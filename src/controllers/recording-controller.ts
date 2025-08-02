import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RecordingState } from '../app-state';
import type { Detection } from '../detector';

export class RecordingController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _state: RecordingState = {
    isActive: false,
    tagIds: [],
    isViewing: false,
  };

  private recordedTagIdsSet = new Set<number>();

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected(): void {
    // Setup any initialization when component connects
  }

  hostDisconnected(): void {
    this.stopRecording();
  }

  get state(): RecordingState {
    return this._state;
  }

  get isActive(): boolean {
    return this._state.isActive;
  }

  get isViewing(): boolean {
    return this._state.isViewing;
  }

  get tagIds(): number[] {
    return this._state.tagIds;
  }

  startRecording(): void {
    this._state = {
      isActive: true,
      tagIds: [],
      isViewing: false,
    };

    this.recordedTagIdsSet.clear();
    this.host.requestUpdate();
    this.dispatchEvent('recording-started');
  }

  stopRecording(): void {
    if (!this._state.isActive) return;

    this._state = {
      ...this._state,
      isActive: false,
      isViewing: true,
    };

    this.host.requestUpdate();
    this.dispatchEvent('recording-stopped', { tagIds: this._state.tagIds });
  }

  hideRecorded(): void {
    this._state = {
      ...this._state,
      isViewing: false,
    };

    this.host.requestUpdate();
    this.dispatchEvent('recording-hidden');
  }

  clearRecorded(): void {
    this._state = {
      isActive: false,
      tagIds: [],
      isViewing: false,
    };

    this.recordedTagIdsSet.clear();
    this.host.requestUpdate();
  }

  recordDetections(detections: Detection[]): void {
    if (!this._state.isActive || detections.length === 0) return;

    let hasNewTags = false;

    detections.forEach((detection) => {
      if (!this.recordedTagIdsSet.has(detection.id)) {
        this.recordedTagIdsSet.add(detection.id);
        hasNewTags = true;
      }
    });

    if (hasNewTags) {
      this._state = {
        ...this._state,
        tagIds: Array.from(this.recordedTagIdsSet).sort((a, b) => a - b),
      };

      this.host.requestUpdate();
      this.dispatchEvent('tags-updated', { tagIds: this._state.tagIds });
    }
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
