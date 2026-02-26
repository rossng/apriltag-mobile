import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AprilTagDetector } from './detector';
import { AppMode, isValidModeTransition } from './app-state';
import {
  CameraController,
  DetectionController,
  RecordingController,
  StatusController,
} from './controllers';
import './family-selector';
import './detections';
import './overflow-menu';
import './recorded-tags';

@customElement('apriltag-app')
export class AprilTagApp extends LitElement {
  @property({ type: Object }) detector!: AprilTagDetector;

  @state() private appMode: AppMode = AppMode.LIVE;
  @state() private currentFamily =
    localStorage.getItem('selectedFamily') || 'tag36h11';
  @state() private recordMode = false;
  @state() private captureEnabled = false;
  @state() private coverMode = true;

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
      min-height: 60px;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
      flex-shrink: 1;
      min-width: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .header {
        padding: 8px 12px;
        gap: 8px;
      }

      .header h1 {
        font-size: 14px;
        letter-spacing: 1px;
      }

      .header-controls {
        gap: 8px;
      }
    }

    family-selector {
      position: relative;
    }

    .camera-container {
      position: fixed;
      top: 80px;
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

    video.contain-mode {
      object-fit: contain;
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
      top: 100px;
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

    .duplicate-warning {
      position: fixed;
      top: 100px;
      left: 20px;
      right: 20px;
      background: rgba(40, 0, 0, 0.9);
      color: #ff4444;
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid #ff4444;
      text-align: center;
      z-index: 999;
      font-size: 14px;
      box-shadow:
        0 0 20px rgba(255, 68, 68, 0.4),
        inset 0 0 10px rgba(255, 68, 68, 0.1);
      text-shadow: 0 0 10px #ff4444;
    }

    @keyframes neonPulse {
      0%,
      100% {
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

    .about-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-bg);
      border: 1px solid var(--neon-cyan);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      opacity: 0.6;
      box-shadow:
        0 0 10px rgba(6, 9, 9, 0.3),
        inset 0 0 10px rgba(0, 255, 255, 0.1);
    }

    .about-button:hover {
      opacity: 1;
      transform: scale(1.05);
      box-shadow:
        0 0 20px rgba(0, 255, 255, 0.5),
        inset 0 0 15px rgba(0, 255, 255, 0.2);
    }

    .about-button svg {
      width: 20px;
      height: 20px;
      fill: var(--neon-cyan);
      filter: drop-shadow(0 0 5px var(--neon-cyan));
    }
  `;

  render() {
    return html`
      <div class="header">
        <h1>AprilTag Detector</h1>
        <div class="header-controls">
          <family-selector
            .currentFamily=${this.currentFamily}
            .disabled=${this.appMode === AppMode.RECORDING || this.appMode === AppMode.VIEWING_RECORDED}
            @family-selected=${this.handleFamilySelected}
          ></family-selector>
          <overflow-menu
            .recordMode=${this.recordMode}
            .appMode=${this.appMode}
            .availableCameras=${this.cameraController?.availableCameras || []}
            .currentCameraId=${this.cameraController?.currentCameraId}
            .coverMode=${this.coverMode}
            @record-mode-changed=${this.handleRecordModeChanged}
            @cover-mode-changed=${this.handleCoverModeChanged}
            @image-selected=${this.handleImageSelected}
            @camera-switch-requested=${this.handleCameraSwitchRequested}
          ></overflow-menu>
        </div>
      </div>

      <div class="status ${this.statusController?.hasMessage ? 'visible' : ''}">
        ${this.statusController?.message}
      </div>

      ${(this.detectionController?.duplicateIds?.length ?? 0) > 0
        ? html`<div class="duplicate-warning">
            Duplicate marker${this.detectionController!.duplicateIds.length > 1 ? 's' : ''}: ${this.detectionController!.duplicateIds.join(', ')}
          </div>`
        : ''}

      <div class="camera-container">
        <div class="video-overlay">
          <video
            class="${this.appMode !== AppMode.LIVE &&
            this.appMode !== AppMode.RECORDING
              ? 'hidden'
              : ''} ${!this.coverMode ? 'contain-mode' : ''}"
            autoplay
            muted
            playsinline
          ></video>
          <apriltag-detections
            .detections=${this.detectionController?.detections || []}
            .duplicateIds=${this.detectionController?.duplicateIds || []}
            .imageData=${this.appMode === AppMode.IMAGE_MODE
              ? this.detectionController?.selectedImage
              : this.detectionController?.frozenFrame}
            .showImage=${this.appMode === AppMode.PAUSED ||
            this.appMode === AppMode.IMAGE_MODE}
            .videoDimensions=${this.cameraController?.dimensions}
            .coverMode=${this.coverMode}
            style="display: ${this.appMode === AppMode.VIEWING_RECORDED
              ? 'none'
              : 'block'}"
          ></apriltag-detections>
          ${this.appMode === AppMode.VIEWING_RECORDED
            ? html`
                <recorded-tags
                  .tagIds=${this.recordingController?.tagIds || []}
                  @close=${this.handleHideRecorded}
                ></recorded-tags>
              `
            : ''}
        </div>
      </div>

      <div class="controls">
        <button
          class="capture-button ${this.captureEnabled &&
          this.appMode !== AppMode.VIEWING_RECORDED
            ? 'enabled'
            : ''}"
          @click=${this.handleToggleDetection}
        >
          ${this.getButtonIcon()}
        </button>
      </div>

      <button class="about-button" @click=${this.handleAboutClick}>
        <svg viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
          />
        </svg>
      </button>
    `;
  }

  async firstUpdated() {
    this.video = this.shadowRoot!.querySelector('video')!;

    await this.updateComplete;
    await this.init();
  }

  async init(): Promise<void> {
    this.detector.init();

    // Create all controllers after element is connected
    this.cameraController = new CameraController(this);
    this.detectionController = new DetectionController(this, this.detector, this.currentFamily);
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
      this.video.addEventListener('loadedmetadata', () => {
        console.log(
          'Video metadata loaded:',
          this.video.videoWidth,
          this.video.videoHeight
        );
        this.statusController?.clearMessage();
        this.cameraController?.updateDimensions(
          this.video.videoWidth,
          this.video.videoHeight
        );
        // Force update to ensure camera data is passed to overflow menu
        this.requestUpdate();
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
    document.addEventListener('visibilitychange', () => {
      if (
        document.visibilityState === 'visible' &&
        this.cameraController.stream
      ) {
        this.video.srcObject = this.cameraController.stream;
      }
    });
  }

  handleFamilySelected(e: CustomEvent): void {
    const { familyId } = e.detail;
    
    // Update the detection controller's family property
    if (this.detectionController) {
      this.detectionController.family = familyId;
      
      // Update our local state and persist
      this.currentFamily = familyId;
      localStorage.setItem('selectedFamily', familyId);
      this.statusController?.setTemporaryMessage(`Switched to ${familyId}`, 3000);
    }
  }

  handleRecordModeChanged(e: CustomEvent): void {
    const { recordMode } = e.detail;
    this.recordMode = recordMode;

    if (!recordMode && this.recordingController?.isActive) {
      this.recordingController.stopRecording();
    }
  }

  handleCoverModeChanged(e: CustomEvent): void {
    const { coverMode } = e.detail;
    this.coverMode = coverMode;
  }

  handleImageSelected(e: CustomEvent): void {
    const { file, familyId } = e.detail;
    
    // Switch family if specified (for example image)
    if (familyId && this.detectionController) {
      this.detectionController.family = familyId;
      this.currentFamily = familyId;
      localStorage.setItem('selectedFamily', familyId);
      this.statusController?.setTemporaryMessage(`Switched to ${familyId}`, 3000);
    }
    
    this.detectionController?.loadImageFile(file);
    this.setAppMode(AppMode.IMAGE_MODE);
  }

  handleHideRecorded(): void {
    this.recordingController?.hideRecorded();
  }

  handleAboutClick(): void {
    window.open('https://github.com/rossng/apriltag-mobile', '_blank');
  }

  handleCameraSwitchRequested(e: CustomEvent): void {
    const { deviceId } = e.detail;
    if (this.cameraController) {
      this.cameraController.switchCamera(deviceId);
    }
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


  setAppMode(newMode: AppMode): void {
    // Skip if already in the same mode
    if (this.appMode === newMode) {
      return;
    }

    if (!isValidModeTransition(this.appMode, newMode)) {
      console.warn(
        `Invalid mode transition from ${this.appMode} to ${newMode}`
      );
      return;
    }

    // Turn off record mode when entering paused or image modes to prevent bugs
    if (
      (newMode === AppMode.PAUSED || newMode === AppMode.IMAGE_MODE) &&
      this.recordMode
    ) {
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
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>`;
    } else if (this.recordMode) {
      if (this.recordingController?.isActive) {
        return html`<svg viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>`;
      } else {
        return html`<svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="red" />
        </svg>`;
      }
    } else {
      return this.appMode === AppMode.PAUSED
        ? html`<svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>`
        : html`<svg viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>`;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cameraController?.cleanup();
  }
}
