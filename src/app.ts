import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MainModule } from "./apriltag/apriltag_wasm";
import "./family-selector";

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

@customElement("apriltag-app")
export class AprilTagApp extends LitElement {
  @property({ type: Object }) detector!: MainModule;

  @state() private statusMessage = "";
  @state() private showStatus = false;
  @state() private currentFamily = "tag36h11";
  @state() private showCanvas = false;
  @state() private isProcessing = false;
  @state() private captureEnabled = false;

  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private stream: MediaStream | null = null;

  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      background: #000;
      color: #fff;
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    family-selector {
      position: relative;
    }

    .camera-container {
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #222;
    }

    video,
    canvas {
      width: 100%;
      height: 100%;
    }

    video {
      object-fit: cover;
    }

    canvas {
      object-fit: contain;
      display: none;
    }

    canvas.visible {
      display: block;
    }

    video.hidden {
      display: none;
    }

    .controls {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      padding: 20px;
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .capture-button {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #fff;
      border: 4px solid #ccc;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      pointer-events: none;
    }

    .capture-button.enabled {
      opacity: 1;
      pointer-events: auto;
    }

    .capture-button:active {
      transform: scale(0.95);
    }

    .capture-button::after {
      content: "";
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #000;
    }

    .back-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      padding: 15px 25px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      display: none;
    }

    .back-button.visible {
      display: block;
    }

    .status {
      position: fixed;
      top: 80px;
      left: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px 20px;
      border-radius: 8px;
      text-align: center;
      display: none;
      z-index: 999;
    }

    .status.visible {
      display: block;
    }
  `;

  render() {
    return html`
      <div class="header">
        <h1>AprilTag Detector</h1>
        <family-selector
          .currentFamily=${this.currentFamily}
          @family-selected=${this.handleFamilySelected}
        ></family-selector>
      </div>

      <div class="status ${this.showStatus ? "visible" : ""}">
        ${this.statusMessage}
      </div>

      <div class="camera-container">
        <video
          class="${this.showCanvas ? "hidden" : ""}"
          autoplay
          muted
          playsinline
        ></video>
        <canvas class="${this.showCanvas ? "visible" : ""}"></canvas>
      </div>

      <div class="controls">
        <button
          class="back-button ${this.showCanvas ? "visible" : ""}"
          @click=${this.backToCamera}
        >
          Back to Camera
        </button>
        <button
          class="capture-button ${this.captureEnabled ? "enabled" : ""}"
          @click=${this.captureImage}
        ></button>
      </div>
    `;
  }

  async firstUpdated() {
    this.video = this.shadowRoot!.querySelector("video")!;
    this.canvas = this.shadowRoot!.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;

    await this.init();
  }

  async init(): Promise<void> {
    this.detector._atagjs_init();
    await this.initializeCamera();
    this.setupGlobalListeners();
    this.captureEnabled = true;
  }

  async initializeCamera(): Promise<void> {
    try {
      this.setStatus("Requesting camera permission...");

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
        this.hideStatusMessage();
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      this.setStatus(
        "Camera access denied. Please allow camera permissions and refresh."
      );
    }
  }

  setupGlobalListeners(): void {
    // Prevent video from pausing on page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && this.stream) {
        this.video.srcObject = this.stream;
      }
    });
  }

  handleFamilySelected(e: CustomEvent): void {
    const { familyId } = e.detail;
    this.switchFamily(familyId);
  }

  switchFamily(family: string): void {
    const setFamily = this.detector.cwrap("atagjs_set_family", "number", [
      "string",
    ]);

    const result = setFamily(family);

    if (result === 0) {
      this.currentFamily = family;
      this.setStatus(`Switched to ${family}`);
    } else {
      this.setStatus(`Failed to switch to ${family}`);
    }
  }

  async captureImage(): Promise<void> {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      this.setStatus("Capturing image...");

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
      this.showCanvas = true;

      // Process the image
      await this.processImage();
    } catch (error) {
      console.error("Error capturing image:", error);
      this.setStatus("Failed to capture image. Please try again.");
    } finally {
      this.isProcessing = false;
    }
  }

  async processImage(): Promise<void> {
    try {
      this.setStatus("Detecting AprilTags...");

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

      // set_img_buffer allocates the buffer for image and returns it
      let imgBuffer = this.detector._atagjs_set_img_buffer(
        this.canvas.width,
        this.canvas.height,
        this.canvas.width
      );
      if (this.canvas.width * this.canvas.height < grayData.length)
        throw new Error("Image data too large.");
      this.detector.HEAPU8.set(grayData, imgBuffer);
      let strJsonPtr = this.detector._atagjs_detect();

      let strJsonLen = this.detector.getValue(strJsonPtr, "i32");
      if (strJsonLen == 0) {
        return;
      }
      let strJsonStrPtr = this.detector.getValue(strJsonPtr + 4, "i32");
      const strJsonView = new Uint8Array(
        this.detector.HEAPU8.buffer,
        strJsonStrPtr,
        strJsonLen
      );
      let detectionsJson = "";
      for (let i = 0; i < strJsonLen; i++) {
        detectionsJson += String.fromCharCode(strJsonView[i]);
      }
      let detections = JSON.parse(detectionsJson);

      if (!(detections instanceof Array)) {
        console.error("Invalid detections format:", detections);
        throw new Error("Invalid detections format");
      }

      this.drawDetections(detections);
      this.hideStatusMessage();
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("WASM module not ready")) {
        this.setStatus(
          "AprilTag library is still loading. Please wait and try again."
        );
      } else if (errorMessage.includes("not ready")) {
        this.setStatus(
          "Detector not ready. Please wait for initialization to complete."
        );
      } else {
        this.setStatus("Failed to detect AprilTags. Please try again.");
      }
    }
  }

  convertToGrayscale(imageData: ImageData): Uint8Array {
    const data = imageData.data;
    const grayData = new Uint8Array(imageData.width * imageData.height);

    for (let i = 0; i < data.length; i += 4) {
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

  backToCamera(): void {
    this.showCanvas = false;
  }

  setStatus(message: string): void {
    this.statusMessage = message;
    this.showStatus = true;
  }

  hideStatusMessage(): void {
    this.showStatus = false;
  }
}
