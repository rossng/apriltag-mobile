import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AprilTagDetector, Detection } from "./detector";
import "./family-selector";
import "./detections";
import type { Detections } from "./detections";

@customElement("apriltag-app")
export class AprilTagApp extends LitElement {
  @property({ type: Object }) detector!: AprilTagDetector;

  @state() private statusMessage: string | null = null;
  @state() private currentFamily = "tag36h11";
  @state() private showDetections = false;
  @state() private isProcessing = false;
  @state() private captureEnabled = false;
  @state() private detections: Detection[] = [];

  private video!: HTMLVideoElement;
  private detectionCanvas!: Detections;
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

    apriltag-detections {
      display: none;
    }

    apriltag-detections.visible {
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

      <div class="status ${this.statusMessage ? "visible" : ""}">
        ${this.statusMessage}
      </div>

      <div class="camera-container">
        <video
          class="${this.showDetections ? "hidden" : ""}"
          autoplay
          muted
          playsinline
        ></video>
        <apriltag-detections
          class="${this.showDetections ? "visible" : ""}"
          .detections=${this.detections}
        ></apriltag-detections>
      </div>

      <div class="controls">
        <button
          class="back-button ${this.showDetections ? "visible" : ""}"
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
    this.detectionCanvas = this.shadowRoot!.querySelector(
      "apriltag-detections"
    )! as Detections;

    await this.updateComplete;
    await this.init();
  }

  async init(): Promise<void> {
    this.detector.init();
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
    const success = this.detector.setFamily(family);

    if (success) {
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

      this.detectionCanvas.captureFromVideo(this.video);
      this.showDetections = true;

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

      if (!this.detector || !this.detector.isReady()) {
        throw new Error(
          "Detector not ready. Please wait for initialization to complete."
        );
      }

      const imageData = this.detectionCanvas.imageData;
      if (!imageData) {
        throw new Error("No image data available");
      }

      this.detections = this.detector.detectFromImageData(imageData);

      this.hideStatusMessage();
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("not initialized")) {
        this.setStatus(
          "Detector not ready. Please wait for initialization to complete."
        );
      } else {
        this.setStatus("Failed to detect AprilTags. Please try again.");
      }
    }
  }

  backToCamera(): void {
    this.showDetections = false;
    this.detections = [];
    this.detectionCanvas.clear();
  }

  setStatus(message: string): void {
    this.statusMessage = message;
  }

  hideStatusMessage(): void {
    this.statusMessage = null;
  }
}
