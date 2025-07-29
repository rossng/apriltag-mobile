import { MainModule } from "./apriltag/apriltag_wasm";

interface Detection {
  id: number;
  corners: Array<{ x: number; y: number }>;
  center: { x: number; y: number };
  size?: number;
  pose?: {
    t: [number, number, number];
    e: number;
  };
}

interface AprilTagDetectorWasm {
  detect(grayData: Uint8Array, width: number, height: number): Detection[];
}

export class AprilTagDetector {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stream: MediaStream | null = null;
  private currentFamily: string = "tag36h11";
  private detector: MainModule;
  private isProcessing: boolean = false;

  constructor(detector: MainModule) {
    this.video = document.getElementById("videoElement") as HTMLVideoElement;
    this.canvas = document.getElementById("canvasElement") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.detector = detector;

    this.init();
  }

  async init(): Promise<void> {
    this.detector._atagjs_init();
    await this.initializeCamera();
    this.setupEventListeners();
    this.enableCaptureButton();
  }

  async initializeCamera(): Promise<void> {
    try {
      this.showStatus("Requesting camera permission...");

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;

      this.video.addEventListener("loadedmetadata", () => {
        this.hideStatus();
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      this.showStatus(
        "Camera access denied. Please allow camera permissions and refresh."
      );
    }
  }

  setupEventListeners(): void {
    // Menu functionality
    document.addEventListener("click", (e: Event) => {
      const menu = document.getElementById("overflowMenu");
      const target = e.target as HTMLElement;
      if (
        !target.closest(".menu-button") &&
        !target.closest(".overflow-menu")
      ) {
        menu?.classList.remove("active");
      }
    });

    // Family selection
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.dataset.family) {
          this.selectFamily(target.dataset.family);
        }
        document.getElementById("overflowMenu")?.classList.remove("active");
      });
    });

    // Prevent video from pausing on page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && this.stream) {
        this.video.srcObject = this.stream;
      }
    });
  }

  selectFamily(family: string): void {
    // Update UI
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-family="${family}"]`)
      ?.classList.add("active");

    // Update current family
    this.currentFamily = family;

    // Show info about family switch
    this.showStatus(`Switched to ${family} family`);
    setTimeout(() => this.hideStatus(), 2000);

    // Note: The current AprilTag WASM implementation is initialized with tag36h11
    // Runtime family switching would require reinitializing the detector
  }

  enableCaptureButton(): void {
    const captureButton = document.querySelector(
      ".capture-button"
    ) as HTMLElement;
    if (captureButton) {
      captureButton.style.opacity = "1";
      captureButton.style.pointerEvents = "auto";
    }
  }

  disableCaptureButton(): void {
    const captureButton = document.querySelector(
      ".capture-button"
    ) as HTMLElement;
    if (captureButton) {
      captureButton.style.opacity = "0.5";
      captureButton.style.pointerEvents = "none";
    }
  }

  async captureImage(): Promise<void> {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      this.showStatus("Capturing image...");

      // Set canvas size to match video
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      // Draw video frame to canvas
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Switch to canvas view
      this.video.style.display = "none";
      this.canvas.style.display = "block";
      document.getElementById("backButton")?.classList.add("visible");

      // Process the image
      await this.processImage();
    } catch (error) {
      console.error("Error capturing image:", error);
      this.showStatus("Failed to capture image. Please try again.");
    } finally {
      this.isProcessing = false;
    }
  }

  async processImage(): Promise<void> {
    try {
      this.showStatus("Detecting AprilTags...");

      if (!this.detector) {
        throw new Error(
          "Detector not ready. Please wait for initialization to complete."
        );
      }

      // Get image data
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Convert to grayscale
      const grayData = this.convertToGrayscale(imageData);

      // set_img_buffer allocates the buffer for image and returns it; just returns the previously allocated buffer if size has not changed
      let imgBuffer = this.detector._atagjs_set_img_buffer(
        this.canvas.width,
        this.canvas.height,
        this.canvas.width
      );
      if (this.canvas.width * this.canvas.height < grayData.length)
        throw new Error("Image data too large.");
      this.detector.HEAPU8.set(grayData, imgBuffer); // copy grayscale image data
      let strJsonPtr = this.detector._atagjs_detect();
      /* detect returns a pointer to a t_str_json c struct as follows
          size_t len; // string length
          char *str;
          size_t alloc_size; // allocated size */
      let strJsonLen = this.detector.getValue(strJsonPtr, "i32"); // get len from struct
      if (strJsonLen == 0) {
        // returned empty string
        return;
      }
      let strJsonStrPtr = this.detector.getValue(strJsonPtr + 4, "i32"); // get *str from struct
      const strJsonView = new Uint8Array(
        this.detector.HEAPU8.buffer,
        strJsonStrPtr,
        strJsonLen
      );
      let detectionsJson = ""; // build this javascript string from returned characters
      for (let i = 0; i < strJsonLen; i++) {
        detectionsJson += String.fromCharCode(strJsonView[i]);
      }
      //console.log(detectionsJson);
      let detections = JSON.parse(detectionsJson);

      if (!(detections instanceof Array)) {
        console.error("Invalid detections format:", detections);
        throw new Error("Invalid detections format");
      }

      this.drawDetections(detections);
      this.showDetectionInfo(detections);
      this.hideStatus();
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("WASM module not ready")) {
        this.showStatus(
          "AprilTag library is still loading. Please wait and try again."
        );
      } else if (errorMessage.includes("not ready")) {
        this.showStatus(
          "Detector not ready. Please wait for initialization to complete."
        );
      } else {
        this.showStatus("Failed to detect AprilTags. Please try again.");
      }
    }
  }

  convertToGrayscale(imageData: ImageData): Uint8Array {
    const data = imageData.data;
    const grayData = new Uint8Array(imageData.width * imageData.height);

    for (let i = 0; i < data.length; i += 4) {
      // Convert RGB to grayscale using luminance formula (same as in the AprilTag documentation)
      const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      grayData[i / 4] = gray;
    }

    return grayData;
  }

  drawDetections(detections: Detection[]): void {
    this.ctx.strokeStyle = "#00ff00";
    this.ctx.fillStyle = "#ff0000";
    this.ctx.lineWidth = 3;
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";

    detections.forEach((detection) => {
      const corners = detection.corners;

      // Draw tag outline
      this.ctx.beginPath();
      this.ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) {
        this.ctx.lineTo(corners[i].x, corners[i].y);
      }
      this.ctx.closePath();
      this.ctx.stroke();

      // Draw top-left corner as red circle
      this.ctx.beginPath();
      this.ctx.arc(corners[0].x, corners[0].y, 8, 0, 2 * Math.PI);
      this.ctx.fill();

      // Draw tag ID
      const center = detection.center;
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(detection.id.toString(), center.x, center.y + 8);
      this.ctx.fillStyle = "#ff0000";
    });
  }

  showDetectionInfo(detections: Detection[]): void {
    const infoDiv = document.getElementById("detectionInfo");
    if (!infoDiv) return;

    if (detections.length === 0) {
      infoDiv.innerHTML =
        '<div class="detection-item">No AprilTags detected</div>';
    } else {
      const items = detections
        .map((detection) => {
          let html = `
                    <div class="detection-item">
                        <strong>Tag ID:</strong> ${detection.id}<br>
                        <strong>Size:</strong> ${
                          detection.size
                            ? (detection.size * 1000).toFixed(1) + "mm"
                            : "Unknown"
                        }<br>
                        <strong>Center:</strong> (${Math.round(
                          detection.center.x
                        )}, ${Math.round(detection.center.y)})<br>
                `;

          // Add pose information if available
          if (detection.pose) {
            const t = detection.pose.t;
            const distance = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);
            html += `<strong>Distance:</strong> ${(distance * 1000).toFixed(
              1
            )}mm<br>`;
            html += `<strong>Pose Error:</strong> ${detection.pose.e.toFixed(
              6
            )}`;
          }

          html += "</div>";
          return html;
        })
        .join("");
      infoDiv.innerHTML = items;
    }

    infoDiv.classList.add("visible");
  }

  backToCamera(): void {
    this.video.style.display = "block";
    this.canvas.style.display = "none";
    document.getElementById("backButton")?.classList.remove("visible");
    document.getElementById("detectionInfo")?.classList.remove("visible");
  }

  showStatus(message: string): void {
    const status = document.getElementById("status");
    if (status) {
      status.textContent = message;
      status.classList.add("visible");
    }
  }

  hideStatus(): void {
    const status = document.getElementById("status");
    status?.classList.remove("visible");
  }
}
