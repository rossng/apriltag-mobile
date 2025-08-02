import { ReactiveController, ReactiveControllerHost } from 'lit';
import { StatusState } from '../app-state';

export class StatusController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _state: StatusState = {
    message: null,
  };

  private fadeOutTimer: number | null = null;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected(): void {
    // Setup any initialization when component connects
  }

  hostDisconnected(): void {
    this.clearMessage();
  }

  get state(): StatusState {
    return this._state;
  }

  get message(): string | null {
    return this._state.message;
  }

  get hasMessage(): boolean {
    return this._state.message !== null;
  }

  setMessage(message: string, fadeOutAfter?: number): void {
    // Clear any existing timer
    if (this.fadeOutTimer !== null) {
      clearTimeout(this.fadeOutTimer);
      this.fadeOutTimer = null;
    }

    const fadeOutTime = fadeOutAfter ? Date.now() + fadeOutAfter : undefined;

    this._state = {
      message,
      fadeOutTime,
    };

    this.host.requestUpdate();

    if (fadeOutAfter) {
      this.fadeOutTimer = window.setTimeout(() => {
        // Only clear if this is still the same message
        if (this._state.fadeOutTime === fadeOutTime) {
          this.clearMessage();
        }
      }, fadeOutAfter);
    }
  }

  clearMessage(): void {
    if (this.fadeOutTimer !== null) {
      clearTimeout(this.fadeOutTimer);
      this.fadeOutTimer = null;
    }

    this._state = {
      message: null,
    };

    this.host.requestUpdate();
  }

  setTemporaryMessage(message: string, duration: number = 3000): void {
    this.setMessage(message, duration);
  }

  setPersistentMessage(message: string): void {
    this.setMessage(message);
  }
}
