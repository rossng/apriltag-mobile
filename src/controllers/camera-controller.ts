import { ReactiveController, ReactiveControllerHost } from 'lit';
import { CameraState } from '../app-state';

export class CameraController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _state: CameraState = {
    isReady: false,
    stream: null,
    dimensions: { width: 0, height: 0 },
  };
  private availableDevices: MediaDeviceInfo[] = [];
  private currentDeviceId: string | null = null;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected(): void {
    // Setup any initialization when component connects
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  get state(): CameraState {
    return this._state;
  }

  get isReady(): boolean {
    return this._state.isReady;
  }

  get stream(): MediaStream | null {
    return this._state.stream;
  }

  get dimensions(): { width: number; height: number } {
    return this._state.dimensions;
  }

  get availableCameras(): MediaDeviceInfo[] {
    return this.availableDevices;
  }

  get currentCameraId(): string | null {
    return this.currentDeviceId;
  }

  get hasMultipleCameras(): boolean {
    return this.availableDevices.length > 1;
  }

  async initialize(): Promise<void> {
    try {
      this.updateStatus('Requesting camera permission...');

      // First, enumerate available cameras
      await this.enumerateDevices();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Store the current device ID
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        this.currentDeviceId = videoTrack.getSettings().deviceId || null;
      }

      // Re-enumerate devices after getting permission to get device labels
      await this.enumerateDevices();

      this._state = {
        ...this._state,
        stream,
        isReady: true,
      };

      this.host.requestUpdate();
      console.log('Camera ready, dispatching event with stream:', stream);
      this.dispatchEvent('camera-ready', { stream });
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.dispatchEvent('camera-error', {
        error,
        message:
          'Camera access denied. Please allow camera permissions and refresh.',
      });
    }
  }

  updateDimensions(width: number, height: number): void {
    if (
      this._state.dimensions.width !== width ||
      this._state.dimensions.height !== height
    ) {
      this._state = {
        ...this._state,
        dimensions: { width, height },
      };
      this.host.requestUpdate();
      this.dispatchEvent('dimensions-changed', { width, height });
    }
  }

  async enumerateDevices(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.availableDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', this.availableDevices);
    } catch (error) {
      console.error('Error enumerating devices:', error);
      this.availableDevices = [];
    }
  }

  async switchCamera(deviceId: string): Promise<void> {
    if (!this.availableDevices.find(device => device.deviceId === deviceId)) {
      throw new Error('Invalid device ID');
    }

    try {
      this.updateStatus('Switching camera...');
      
      // Stop current stream
      if (this._state.stream) {
        this._state.stream.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentDeviceId = deviceId;

      this._state = {
        ...this._state,
        stream,
        isReady: true,
      };

      this.host.requestUpdate();
      this.dispatchEvent('camera-ready', { stream });
      this.dispatchEvent('status-clear');
    } catch (error) {
      console.error('Error switching camera:', error);
      this.dispatchEvent('camera-error', {
        error,
        message: 'Failed to switch camera. Please try again.',
      });
    }
  }

  cleanup(): void {
    if (this._state.stream) {
      this._state.stream.getTracks().forEach((track) => track.stop());
      this._state = {
        ...this._state,
        stream: null,
        isReady: false,
      };
      this.host.requestUpdate();
    }
  }

  private updateStatus(message: string): void {
    this.dispatchEvent('status-update', { message });
  }

  private dispatchEvent(type: string, detail: any): void {
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
