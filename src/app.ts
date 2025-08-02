import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AprilTagDetector } from "./detector";
import { AppMode, isValidModeTransition } from "./app-state";
import { CameraController, DetectionController, RecordingController, StatusController } from "./controllers";
import "./family-selector";
import "./detections";
import "./overflow-menu";
import "./recorded-tags";

@customElement("apriltag-app")
export class AprilTagApp extends LitElement {
  @property({ type: Object }) detector!: AprilTagDetector;

  @state() private appMode: AppMode = AppMode.LIVE;
  @state() private currentFamily = localStorage.getItem("selectedFamily") || "tag36h11";
  @state() private recordMode = false;
  @state() private captureEnabled = false;

  private video!: HTMLVideoElement;
  
  // Controllers
  private cameraController!: CameraController;
  private detectionController!: DetectionController;
  private recordingController!: RecordingController;
  private statusController!: StatusController;

  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: 'Courier New', monospace;
      background: var(--dark-bg);
      color: var(--text-primary);
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--neon-cyan);
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
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
      background: var(--darker-bg);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 8px;
      margin: 8px;
      box-shadow: 
        inset 0 0 20px rgba(0, 255, 255, 0.1),
        0 0 30px rgba(0, 255, 255, 0.2);
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
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      padding: 20px;
      display: flex;
      justify-content: center;
      gap: 20px;
      border-top: 1px solid var(--neon-magenta);
      box-shadow: 0 -2px 20px rgba(255, 0, 255, 0.2);
    }

    .capture-button {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: var(--card-bg);
      border: 3px solid var(--neon-pink);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      pointer-events: none;
      position: relative;
      box-shadow: 
        0 0 20px rgba(255, 0, 128, 0.4),
        inset 0 0 20px rgba(255, 0, 128, 0.1);
    }

    .capture-button.enabled {
      opacity: 1;
      pointer-events: auto;
      box-shadow: 
        0 0 30px rgba(255, 0, 128, 0.6),
        inset 0 0 20px rgba(255, 0, 128, 0.2);
    }

    .capture-button:active {
      transform: scale(0.95);
      box-shadow: 
        0 0 40px rgba(255, 0, 128, 0.8),
        inset 0 0 30px rgba(255, 0, 128, 0.3);
    }

    .capture-button svg {
      width: 28px;
      height: 28px;
      fill: var(--neon-pink);
      color: #ffffff;
      filter: drop-shadow(0 0 8px var(--neon-pink));
    }

    .capture-button svg path {
      stroke: var(--neon-pink);
      fill: var(--neon-pink);
    }

    .capture-button svg rect {
      fill: var(--neon-pink);
      stroke: none;
    }

    .capture-button svg circle {
      fill: var(--neon-pink);
      stroke: none;
    }


    .status {
      position: fixed;
      top: 80px;
      left: 20px;
      right: 20px;
      background: var(--card-bg);
      color: var(--text-accent);
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid var(--neon-green);
      text-align: center;
      display: none;
      z-index: 999;
      box-shadow: 
        0 0 20px rgba(0, 255, 128, 0.4),
        inset 0 0 10px rgba(0, 255, 128, 0.1);
      text-shadow: 0 0 10px var(--neon-green);
    }

    .status.visible {
      display: block;
      animation: neonPulse 2s ease-in-out infinite;
    }

    @keyframes neonPulse {
      0%, 100% { 
        box-shadow: 
          0 0 20px rgba(0, 255, 128, 0.4),
          inset 0 0 10px rgba(0, 255, 128, 0.1);
      }
      50% { 
        box-shadow: 
          0 0 30px rgba(0, 255, 128, 0.6),
          inset 0 0 15px rgba(0, 255, 128, 0.2);
      }
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
            .appMode=${this.appMode}
            @record-mode-changed=${this.handleRecordModeChanged}
            @image-selected=${this.handleImageSelected}
          ></overflow-menu>
        </div>
      </div>

      <div class="status ${this.statusController?.hasMessage ? "visible" : ""}">
        ${this.statusController?.message}
      </div>

      <div class="camera-container">
        <div class="video-overlay">
          <video
            class="${this.appMode !== AppMode.LIVE && this.appMode !== AppMode.RECORDING ? 'hidden' : ''}"
            autoplay
            muted
            playsinline
          ></video>
          <apriltag-detections
            .detections=${this.detectionController?.detections || []}
            .imageData=${this.appMode === AppMode.IMAGE_MODE ? this.detectionController?.selectedImage : this.detectionController?.frozenFrame}
            .showImage=${this.appMode === AppMode.PAUSED || this.appMode === AppMode.IMAGE_MODE}
            .videoDimensions=${this.cameraController?.dimensions}
            style="display: ${this.appMode === AppMode.VIEWING_RECORDED ? 'none' : 'block'}"
          ></apriltag-detections>
          ${this.appMode === AppMode.VIEWING_RECORDED ? html`
            <recorded-tags
              .tagIds=${this.recordingController?.tagIds || []}
              @close=${this.handleHideRecorded}
            ></recorded-tags>
          ` : ''}
        </div>
      </div>

      <div class="controls">
        <button
          class="capture-button ${this.captureEnabled && this.appMode !== AppMode.VIEWING_RECORDED ? "enabled" : ""}"
          @click=${this.handleToggleDetection}
        >
          ${this.getButtonIcon()}
        </button>
      </div>
    `;
  }

  async firstUpdated() {
    this.video = this.shadowRoot!.querySelector("video")!;

    await this.updateComplete;
    await this.init();
  }

  async init(): Promise<void> {
    this.detector.init();
    this.detector.setFamily(this.currentFamily);
    
    // Create all controllers after element is connected
    this.cameraController = new CameraController(this);
    this.detectionController = new DetectionController(this, this.detector);
    this.recordingController = new RecordingController(this);
    this.statusController = new StatusController(this);
    
    this.detectionController.setVideo(this.video);
    
    // Set up listeners BEFORE initializing camera
    this.setupControllerListeners();
    this.setupGlobalListeners();
    
    // Now initialize camera - this will dispatch events
    await this.cameraController.initialize();
    
    this.captureEnabled = true;
    
    // Start detection since we're already in LIVE mode
    this.detectionController.setMode(AppMode.LIVE);
    this.detectionController.startContinuousDetection();
  }

  setupControllerListeners(): void {
    // Camera controller events
    this.addEventListener('camera-ready', (e: any) => {
      console.log('Camera ready event received:', e.detail);
      this.video.srcObject = e.detail.stream;
      this.video.addEventListener("loadedmetadata", () => {
        console.log('Video metadata loaded:', this.video.videoWidth, this.video.videoHeight);
        this.statusController?.clearMessage();
        this.cameraController?.updateDimensions(this.video.videoWidth, this.video.videoHeight);
      });
    });
    
    this.addEventListener('camera-error', (e: any) => {
      this.statusController?.setPersistentMessage(e.detail.message);
    });
    
    this.addEventListener('status-update', (e: any) => {
      this.statusController?.setMessage(e.detail.message);
    });
    
    this.addEventListener('status-clear', () => {
      this.statusController?.clearMessage();
    });
    
    // Detection controller events
    this.addEventListener('detections-updated', (e: any) => {
      if (this.recordingController?.isActive) {
        this.recordingController?.recordDetections(e.detail.detections);
      }
    });
    
    // Recording controller events
    this.addEventListener('recording-stopped', () => {
      this.setAppMode(AppMode.VIEWING_RECORDED);
    });
    
    this.addEventListener('recording-hidden', () => {
      this.setAppMode(AppMode.LIVE);
    });
  }

  setupGlobalListeners(): void {
    // Prevent video from pausing on page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && this.cameraController.stream) {
        this.video.srcObject = this.cameraController.stream;
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
    
    if (!recordMode && this.recordingController?.isActive) {
      this.recordingController.stopRecording();
    }
  }

  handleImageSelected(e: CustomEvent): void {
    const { file } = e.detail;
    this.detectionController?.loadImageFile(file);
    this.setAppMode(AppMode.IMAGE_MODE);
  }
  
  handleHideRecorded(): void {
    this.recordingController?.hideRecorded();
  }
  
  handleToggleDetection(): void {
    if (this.appMode === AppMode.IMAGE_MODE) {
      this.setAppMode(AppMode.LIVE);
    } else if (this.recordMode) {
      if (this.recordingController?.isActive) {
        this.recordingController.stopRecording();
      } else {
        this.recordingController?.startRecording();
        this.setAppMode(AppMode.RECORDING);
      }
    } else {
      if (this.appMode === AppMode.PAUSED) {
        this.setAppMode(AppMode.LIVE);
      } else {
        this.setAppMode(AppMode.PAUSED);
      }
    }
  }

  switchFamily(family: string): void {
    const success = this.detector.setFamily(family);

    if (success) {
      this.currentFamily = family;
      localStorage.setItem("selectedFamily", family);
      this.statusController?.setTemporaryMessage(`Switched to ${family}`, 3000);
    } else {
      this.statusController?.setMessage(`Failed to switch to ${family}`);
    }
  }
  
  setAppMode(newMode: AppMode): void {
    // Skip if already in the same mode
    if (this.appMode === newMode) {
      return;
    }
    
    if (!isValidModeTransition(this.appMode, newMode)) {
      console.warn(`Invalid mode transition from ${this.appMode} to ${newMode}`);
      return;
    }
    
    // Turn off record mode when entering paused or image modes to prevent bugs
    if ((newMode === AppMode.PAUSED || newMode === AppMode.IMAGE_MODE) && this.recordMode) {
      this.recordMode = false;
      if (this.recordingController?.isActive) {
        this.recordingController.stopRecording();
      }
    }
    
    this.appMode = newMode;
    
    // Only update detection controller if it's initialized
    if (this.detectionController) {
      this.detectionController.setMode(newMode);
      
      // Handle mode-specific logic
      switch (newMode) {
        case AppMode.LIVE:
          this.detectionController.resumeLiveDetection();
          break;
        case AppMode.PAUSED:
          this.detectionController.freezeCurrentFrame();
          break;
        case AppMode.IMAGE_MODE:
          // Image loading is handled in the detection controller
          break;
        case AppMode.RECORDING:
          this.detectionController.startContinuousDetection();
          break;
        case AppMode.VIEWING_RECORDED:
          this.detectionController.stopContinuousDetection();
          break;
      }
    }
  }


  private getButtonIcon() {
    if (this.appMode === AppMode.IMAGE_MODE) {
      return html`<svg viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    } else if (this.recordMode) {
      if (this.recordingController?.isActive) {
        return html`<svg viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>`;
      } else {
        return html`<svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="red"/>
        </svg>`;
      }
    } else {
      return this.appMode === AppMode.PAUSED
        ? html`<svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>`
        : html`<svg viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>`;
    }
  }



  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cameraController?.cleanup();
  }
}
