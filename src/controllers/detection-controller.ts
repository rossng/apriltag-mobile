import { ReactiveController, ReactiveControllerHost } from 'lit';
import { DetectionState, AppMode } from '../app-state';
import { findDuplicateIds } from '../detector';
import type { AprilTagDetector, Detection } from '../detector';

export class DetectionController implements ReactiveController {
  private host: ReactiveControllerHost;
  private detector: AprilTagDetector;
  private _state: DetectionState = {
    detections: [],
    duplicateIds: [],
    frozenFrame: null,
    selectedImage: null,
    isProcessing: false,
  };
  
  private _currentFamily: string;
  private _previousFamily: string | undefined;

  private animationFrameId: number | null = null;
  private video: HTMLVideoElement | null = null;
  private hiddenCanvas: HTMLCanvasElement;
  private hiddenCtx: CanvasRenderingContext2D;
  private currentMode: AppMode = AppMode.LIVE;

  constructor(host: ReactiveControllerHost, detector: AprilTagDetector, initialFamily = 'tag36h11') {
    this.host = host;
    this.detector = detector;
    this._currentFamily = initialFamily;
    this.host.addController(this);

    // Set the initial family on the detector
    this.detector.setFamily(initialFamily);

    // Create hidden canvas for frame capture
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d')!;
  }

  hostConnected(): void {
    // Will be called when component connects
  }

  hostDisconnected(): void {
    this.stopContinuousDetection();
  }

  hostUpdate(): void {
    // Called before host's update()
    if (this._previousFamily !== undefined && this._previousFamily !== this._currentFamily) {
      // Family has changed, handle it reactively
      this.handleFamilyChange();
    }
    this._previousFamily = this._currentFamily;
  }

  get state(): DetectionState {
    return this._state;
  }

  get family(): string {
    return this._currentFamily;
  }

  set family(newFamily: string) {
    if (this._currentFamily !== newFamily) {
      this._currentFamily = newFamily;
      this.host.requestUpdate();
    }
  }

  get detections(): Detection[] {
    return this._state.detections;
  }

  get duplicateIds(): number[] {
    return this._state.duplicateIds;
  }

  get frozenFrame(): ImageData | null {
    return this._state.frozenFrame;
  }

  get selectedImage(): ImageData | null {
    return this._state.selectedImage;
  }

  get isProcessing(): boolean {
    return this._state.isProcessing;
  }

  setVideo(video: HTMLVideoElement): void {
    this.video = video;
  }

  setMode(mode: AppMode): void {
    const oldMode = this.currentMode;
    this.currentMode = mode;

    if (mode === AppMode.LIVE && oldMode !== AppMode.LIVE) {
      this.resumeLiveDetection();
    } else if (mode !== AppMode.LIVE && oldMode === AppMode.LIVE) {
      this.stopContinuousDetection();
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

  async freezeCurrentFrame(): Promise<void> {
    if (!this.video?.videoWidth) return;

    const frozenFrame = this.captureCurrentFrame();
    if (frozenFrame) {
      const detections = await this.detectInFrame(frozenFrame);

      this._state = {
        ...this._state,
        frozenFrame,
        detections,
        duplicateIds: findDuplicateIds(detections),
      };

      this.host.requestUpdate();
      this.stopContinuousDetection();
    }
  }

  async loadImageFile(file: File): Promise<void> {
    try {
      this.dispatchEvent('status-update', { message: 'Loading image...' });

      const selectedImage = await this.loadImageAsImageData(file);
      const detections = await this.detectInFrame(selectedImage);

      this._state = {
        ...this._state,
        selectedImage,
        detections,
        duplicateIds: findDuplicateIds(detections),
        frozenFrame: null,
      };

      this.host.requestUpdate();
      this.stopContinuousDetection();
      this.dispatchEvent('status-clear');
    } catch (error) {
      console.error('Error loading image:', error);
      this.dispatchEvent('status-update', { message: 'Failed to load image' });
    }
  }

  resumeLiveDetection(): void {
    this._state = {
      ...this._state,
      frozenFrame: null,
      selectedImage: null,
      detections: [],
      duplicateIds: [],
    };

    this.host.requestUpdate();
    this.startContinuousDetection();
  }

  async redetectInFrozenFrame(): Promise<void> {
    const frozenFrame = this._state.frozenFrame;
    if (!frozenFrame) return;

    try {
      this._state = { ...this._state, isProcessing: true };
      this.host.requestUpdate();

      const detections = await this.detectInFrame(frozenFrame);

      this._state = {
        ...this._state,
        detections,
        duplicateIds: findDuplicateIds(detections),
        isProcessing: false,
      };
      
      this.host.requestUpdate();
    } catch (error) {
      console.error('Error re-detecting in frozen frame:', error);
      this._state = { ...this._state, isProcessing: false };
      this.host.requestUpdate();
    }
  }

  async redetectInSelectedImage(): Promise<void> {
    const selectedImage = this._state.selectedImage;
    if (!selectedImage) return;

    try {
      this._state = { ...this._state, isProcessing: true };
      this.host.requestUpdate();

      const detections = await this.detectInFrame(selectedImage);

      this._state = {
        ...this._state,
        detections,
        duplicateIds: findDuplicateIds(detections),
        isProcessing: false,
      };
      
      this.host.requestUpdate();
    } catch (error) {
      console.error('Error re-detecting in selected image:', error);
      this._state = { ...this._state, isProcessing: false };
      this.host.requestUpdate();
    }
  }

  private async handleFamilyChange(): Promise<void> {
    // Update the detector with the new family
    const success = this.detector.setFamily(this._currentFamily);
    
    if (!success) {
      console.error(`Failed to switch to family: ${this._currentFamily}`);
      // Revert to previous family
      this._currentFamily = this._previousFamily!;
      return;
    }

    // Automatically re-run detections based on current mode
    if (this.currentMode === AppMode.PAUSED && this._state.frozenFrame) {
      // Re-detect in frozen frame
      await this.redetectInFrozenFrame();
    } else if (this.currentMode === AppMode.IMAGE_MODE && this._state.selectedImage) {
      // Re-detect in selected image
      await this.redetectInSelectedImage();
    }
    // Note: Live mode will automatically use the new family in the next detection loop iteration
  }

  private runDetectionLoop(): void {
    if (
      this.currentMode !== AppMode.LIVE &&
      this.currentMode !== AppMode.RECORDING
    ) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.processCurrentFrame();
      this.runDetectionLoop();
    });
  }

  private async processCurrentFrame(): Promise<void> {
    if (
      this._state.isProcessing ||
      !this.detector?.isReady() ||
      !this.video?.videoWidth
    ) {
      return;
    }

    try {
      this._state = { ...this._state, isProcessing: true };
      this.host.requestUpdate();

      const imageData = this.captureCurrentFrame();
      if (imageData) {
        const detections = await this.detectInFrame(imageData);
        const duplicateIds = findDuplicateIds(detections);

        this._state = {
          ...this._state,
          detections,
          duplicateIds,
          isProcessing: false,
        };

        this.host.requestUpdate();
        this.dispatchEvent('detections-updated', { detections, duplicateIds });
      }
    } catch (error) {
      console.error('Error processing frame:', error);
      this._state = { ...this._state, isProcessing: false };
      this.host.requestUpdate();
    }
  }

  private captureCurrentFrame(): ImageData | null {
    if (!this.video?.videoWidth) return null;

    this.hiddenCanvas.width = this.video.videoWidth;
    this.hiddenCanvas.height = this.video.videoHeight;
    this.hiddenCtx.drawImage(this.video, 0, 0);

    return this.hiddenCtx.getImageData(
      0,
      0,
      this.hiddenCanvas.width,
      this.hiddenCanvas.height
    );
  }

  private async detectInFrame(imageData: ImageData): Promise<Detection[]> {
    if (!this.detector?.isReady()) return [];
    return this.detector.detectFromImageData(imageData);
  }

  private loadImageAsImageData(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(img.src);
        resolve(imageData);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private dispatchEvent(type: string, detail?: any): void {
    if (this.host instanceof EventTarget) {
      this.host.dispatchEvent(
        new CustomEvent(type, {
          detail,
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}
