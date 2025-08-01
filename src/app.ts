import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AprilTagDetector, Detection } from "./detector";
import "./family-selector";
import "./detections";
import "./overflow-menu";
import "./recorded-tags";
import type { Detections } from "./detections";

@customElement("apriltag-app")
export class AprilTagApp extends LitElement {
  @property({ type: Object }) detector!: AprilTagDetector;

  @state() private statusMessage: { message: string; until?: number } | null = null;
  @state() private currentFamily =
    localStorage.getItem("selectedFamily") || "tag36h11";
  @state() private isPaused = false;
  @state() private isProcessing = false;
  @state() private captureEnabled = false;
  @state() private detections: Detection[] = [];
  @state() private frozenFrame: ImageData | null = null;
  @state() private recordMode = false;
  @state() private isRecording = false;
  @state() private recordedTagIds: number[] = [];
  @state() private showRecordedTags = false;
  @state() private selectedImage: ImageData | null = null;
  @state() private isImageMode = false;

  private recordedTagIdsSet = new Set<number>();

  private video!: HTMLVideoElement;
  private detectionCanvas!: Detections;
  private stream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private hiddenCanvas!: HTMLCanvasElement;
  private hiddenCtx!: CanvasRenderingContext2D;

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

    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
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
    
    .video-overlay {
      position: relative;
      width: 100%;
      height: 100%;
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
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 2;
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
      position: relative;
    }

    .capture-button.enabled {
      opacity: 1;
      pointer-events: auto;
    }

    .capture-button:active {
      transform: scale(0.95);
    }

    .capture-button svg {
      width: 28px;
      height: 28px;
      fill: #000;
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
        <div class="header-controls">
          <family-selector
            .currentFamily=${this.currentFamily}
            @family-selected=${this.handleFamilySelected}
          ></family-selector>
          <overflow-menu
            .recordMode=${this.recordMode}
            @record-mode-changed=${this.handleRecordModeChanged}
            @image-selected=${this.handleImageSelected}
          ></overflow-menu>
        </div>
      </div>

      <div class="status ${this.statusMessage ? "visible" : ""}">
        ${this.statusMessage?.message}
      </div>

      <div class="camera-container">
        <div class="video-overlay">
          <video
            class="${this.isPaused || this.showRecordedTags || this.isImageMode ? 'hidden' : ''}"
            autoplay
            muted
            playsinline
          ></video>
          <apriltag-detections
            .detections=${this.detections}
            .imageData=${this.isImageMode ? this.selectedImage : this.frozenFrame}
            .showImage=${this.isPaused || this.isImageMode}
            style="display: ${this.showRecordedTags ? 'none' : 'block'}"
          ></apriltag-detections>
          ${this.showRecordedTags ? html`
            <recorded-tags
              .tagIds=${this.recordedTagIds}
              @close=${this.hideRecordedTags}
            ></recorded-tags>
          ` : ''}
        </div>
      </div>

      <div class="controls">
        <button
          class="capture-button ${this.captureEnabled && !this.showRecordedTags ? "enabled" : ""}"
          @click=${this.toggleDetection}
        >
          ${this.getButtonIcon()}
        </button>
      </div>
    `;
  }

  async firstUpdated() {
    this.video = this.shadowRoot!.querySelector("video")!;
    this.detectionCanvas = this.shadowRoot!.querySelector(
      "apriltag-detections"
    )! as Detections;

    // Create hidden canvas for frame capture
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d')!;

    await this.updateComplete;
    await this.init();
  }

  async init(): Promise<void> {
    this.detector.init();
    this.detector.setFamily(this.currentFamily);
    await this.initializeCamera();
    this.setupGlobalListeners();
    this.captureEnabled = true;
    this.startContinuousDetection();
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

  handleRecordModeChanged(e: CustomEvent): void {
    const { recordMode } = e.detail;
    this.recordMode = recordMode;
    
    if (!recordMode && this.isRecording) {
      this.stopRecording();
    }
  }

  handleImageSelected(e: CustomEvent): void {
    const { file } = e.detail;
    this.loadImageFile(file);
  }

  switchFamily(family: string): void {
    const success = this.detector.setFamily(family);

    if (success) {
      this.currentFamily = family;
      localStorage.setItem("selectedFamily", family);
      this.setStatus(`Switched to ${family}`, 3000);
    } else {
      this.setStatus(`Failed to switch to ${family}`);
    }
  }

  startContinuousDetection(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.runDetectionLoop();
  }

  stopContinuousDetection(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private runDetectionLoop(): void {
    if (this.isPaused || this.isImageMode) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.processCurrentFrame();
      this.runDetectionLoop();
    });
  }

  private async processCurrentFrame(): Promise<void> {
    if (this.isProcessing || !this.detector?.isReady() || !this.video.videoWidth) {
      return;
    }

    try {
      this.isProcessing = true;

      // Set overlay canvas dimensions to match video
      this.detectionCanvas.setCanvasDimensions(this.video.videoWidth, this.video.videoHeight);

      // Capture current frame to hidden canvas
      this.hiddenCanvas.width = this.video.videoWidth;
      this.hiddenCanvas.height = this.video.videoHeight;
      this.hiddenCtx.drawImage(this.video, 0, 0);

      const imageData = this.hiddenCtx.getImageData(
        0,
        0,
        this.hiddenCanvas.width,
        this.hiddenCanvas.height
      );

      // Run detection
      this.detections = this.detector.detectFromImageData(imageData);
      
      // Track detected tag IDs during recording
      if (this.isRecording && this.detections.length > 0) {
        this.detections.forEach(detection => {
          this.recordedTagIdsSet.add(detection.id);
        });
        this.recordedTagIds = Array.from(this.recordedTagIdsSet);
      }
    } catch (error) {
      console.error("Error processing frame:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  toggleDetection(): void {
    if (this.isImageMode) {
      this.exitImageMode();
    } else if (this.recordMode) {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    } else {
      this.isPaused = !this.isPaused;
      
      if (this.isPaused) {
        this.freezeCurrentFrame();
      } else {
        this.resumeLiveVideo();
      }
    }
  }

  private freezeCurrentFrame(): void {
    if (!this.video.videoWidth) return;

    // Capture current frame
    this.hiddenCanvas.width = this.video.videoWidth;
    this.hiddenCanvas.height = this.video.videoHeight;
    this.hiddenCtx.drawImage(this.video, 0, 0);

    this.frozenFrame = this.hiddenCtx.getImageData(
      0,
      0,
      this.hiddenCanvas.width,
      this.hiddenCanvas.height
    );

    // Run detection on frozen frame
    if (this.detector?.isReady()) {
      this.detections = this.detector.detectFromImageData(this.frozenFrame);
    }

    // Stop continuous detection
    this.stopContinuousDetection();
  }

  private resumeLiveVideo(): void {
    this.frozenFrame = null;
    this.startContinuousDetection();
  }

  private startRecording(): void {
    this.isRecording = true;
    this.recordedTagIds = [];
    this.recordedTagIdsSet.clear();
  }

  private stopRecording(): void {
    this.isRecording = false;
    this.showRecordedTags = true;
  }

  private hideRecordedTags(): void {
    this.showRecordedTags = false;
    // Resume live video when closing recorded tags view
    if (!this.isPaused && !this.isImageMode) {
      this.startContinuousDetection();
    }
  }

  private async loadImageFile(file: File): Promise<void> {
    try {
      this.setStatus("Loading image...");
      
      const img = new Image();
      img.onload = () => {
        // Create canvas to get ImageData
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        this.selectedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Run detection on the image
        if (this.detector?.isReady()) {
          this.detections = this.detector.detectFromImageData(this.selectedImage);
        }
        
        // Stop continuous detection and enter image mode
        this.stopContinuousDetection();
        this.isImageMode = true;
        this.isPaused = false;
        this.showRecordedTags = false;
        
        this.hideStatusMessage();
        
        // Clean up
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        this.setStatus("Failed to load image");
        URL.revokeObjectURL(img.src);
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error("Error loading image:", error);
      this.setStatus("Failed to load image");
    }
  }

  private exitImageMode(): void {
    this.isImageMode = false;
    this.selectedImage = null;
    this.detections = [];
    this.startContinuousDetection();
  }

  private getButtonIcon() {
    if (this.isImageMode) {
      return html`<svg viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    } else if (this.recordMode) {
      if (this.isRecording) {
        return html`<svg viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>`;
      } else {
        return html`<svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="red"/>
        </svg>`;
      }
    } else {
      return this.isPaused
        ? html`<svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>`
        : html`<svg viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>`;
    }
  }

  setStatus(message: string, fadeOutAfter?: number): void {
    const until = fadeOutAfter ? Date.now() + fadeOutAfter : undefined;
    this.statusMessage = { message, until };
    
    if (until) {
      setTimeout(() => {
        if (this.statusMessage?.until === until) {
          this.statusMessage = null;
        }
      }, fadeOutAfter);
    }
  }

  hideStatusMessage(): void {
    this.statusMessage = null;
  }


  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopContinuousDetection();
  }
}
