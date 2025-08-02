import { ReactiveController, ReactiveControllerHost } from 'lit';
import { DetectionState, AppMode } from '../app-state';
import type { AprilTagDetector, Detection } from '../detector';

export class DetectionController implements ReactiveController {
  private host: ReactiveControllerHost;
  private detector: AprilTagDetector;
  private _state: DetectionState = {
    detections: [],
    frozenFrame: null,
    selectedImage: null,
    isProcessing: false
  };
  
  private animationFrameId: number | null = null;
  private video: HTMLVideoElement | null = null;
  private hiddenCanvas: HTMLCanvasElement;
  private hiddenCtx: CanvasRenderingContext2D;
  private currentMode: AppMode = AppMode.LIVE;

  constructor(host: ReactiveControllerHost, detector: AprilTagDetector) {
    this.host = host;
    this.detector = detector;
    this.host.addController(this);
    
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

  get state(): DetectionState {
    return this._state;
  }

  get detections(): Detection[] {
    return this._state.detections;
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
        detections
      };
      
      this.host.requestUpdate();
      this.stopContinuousDetection();
    }
  }

  async loadImageFile(file: File): Promise<void> {
    try {
      this.dispatchEvent('status-update', { message: "Loading image..." });
      
      const selectedImage = await this.loadImageAsImageData(file);
      const detections = await this.detectInFrame(selectedImage);
      
      this._state = {
        ...this._state,
        selectedImage,
        detections,
        frozenFrame: null
      };
      
      this.host.requestUpdate();
      this.stopContinuousDetection();
      this.dispatchEvent('status-clear');
    } catch (error) {
      console.error("Error loading image:", error);
      this.dispatchEvent('status-update', { message: "Failed to load image" });
    }
  }

  resumeLiveDetection(): void {
    this._state = {
      ...this._state,
      frozenFrame: null,
      selectedImage: null,
      detections: []
    };
    
    this.host.requestUpdate();
    this.startContinuousDetection();
  }

  private runDetectionLoop(): void {
    if (this.currentMode !== AppMode.LIVE && this.currentMode !== AppMode.RECORDING) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.processCurrentFrame();
      this.runDetectionLoop();
    });
  }

  private async processCurrentFrame(): Promise<void> {
    if (this._state.isProcessing || !this.detector?.isReady() || !this.video?.videoWidth) {
      return;
    }

    try {
      this._state = { ...this._state, isProcessing: true };
      this.host.requestUpdate();

      const imageData = this.captureCurrentFrame();
      if (imageData) {
        const detections = await this.detectInFrame(imageData);
        
        this._state = {
          ...this._state,
          detections,
          isProcessing: false
        };
        
        this.host.requestUpdate();
        this.dispatchEvent('detections-updated', { detections });
      }
    } catch (error) {
      console.error("Error processing frame:", error);
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
      this.host.dispatchEvent(new CustomEvent(type, { 
        detail,
        bubbles: true,
        composed: true 
      }));
    }
  }
}