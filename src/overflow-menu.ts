import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppMode } from './app-state';

@customElement('overflow-menu')
export class OverflowMenu extends LitElement {
  @property({ type: Boolean }) recordMode = false;
  @property({ type: String }) appMode: AppMode = AppMode.LIVE;
  @property({ type: Array }) availableCameras: MediaDeviceInfo[] = [];
  @property({ type: String }) currentCameraId: string | null = null;
  @state() private showMenu = false;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .menu-button {
      background: transparent;
      border: 1px solid var(--neon-blue);
      color: var(--neon-blue);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(0, 128, 255, 0.3);
    }

    .menu-button:hover {
      background: rgba(0, 128, 255, 0.1);
      box-shadow: 0 0 20px rgba(0, 128, 255, 0.5);
      text-shadow: 0 0 10px var(--neon-blue);
    }

    .menu-button.active {
      background: rgba(0, 128, 255, 0.2);
      box-shadow: 0 0 25px rgba(0, 128, 255, 0.6);
      text-shadow: 0 0 15px var(--neon-blue);
    }

    .menu-button svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
      filter: drop-shadow(0 0 5px var(--neon-blue));
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--card-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--neon-blue);
      border-radius: 8px;
      padding: 4px;
      z-index: 1001;
      display: none;
      box-shadow:
        0 4px 20px rgba(0, 128, 255, 0.4),
        inset 0 0 20px rgba(0, 128, 255, 0.1);
      min-width: 160px;
      width: max-content;
    }

    .dropdown-menu.active {
      display: block;
    }

    .menu-item {
      padding: 10px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-primary);
      gap: 10px;
    }

    .menu-item:hover {
      background: rgba(0, 128, 255, 0.2);
      color: var(--neon-blue);
      text-shadow: 0 0 10px var(--neon-blue);
      box-shadow: inset 0 0 10px rgba(0, 128, 255, 0.3);
    }

    .toggle-switch {
      width: 32px;
      height: 18px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid var(--neon-magenta);
      border-radius: 9px;
      position: relative;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
    }

    .toggle-switch.active {
      background: rgba(255, 0, 255, 0.3);
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--text-primary);
      border: 1px solid var(--neon-magenta);
      top: 1px;
      left: 1px;
      transition: transform 0.3s ease;
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
    }

    .toggle-switch.active::after {
      transform: translateX(14px);
      background: var(--neon-magenta);
      box-shadow: 0 0 15px var(--neon-magenta);
    }

    .menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .menu-item.disabled:hover {
      background: transparent;
      color: var(--text-primary);
      text-shadow: none;
      box-shadow: none;
    }

    .toggle-switch.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    @media (max-width: 480px) {
      .menu-button {
        padding: 6px;
      }
      
      .menu-button svg {
        width: 18px;
        height: 18px;
      }
      
      .dropdown-menu {
        min-width: 140px;
      }
      
      .menu-item {
        padding: 8px 12px;
        font-size: 12px;
      }
      
      .toggle-switch {
        width: 28px;
        height: 16px;
      }
      
      .toggle-switch::after {
        width: 12px;
        height: 12px;
      }
      
      .toggle-switch.active::after {
        transform: translateX(12px);
      }
    }
  `;

  render() {
    const isRecordModeDisabled = this.isRecordModeDisabled();
    const isCameraSwitchEnabled = this.isCameraSwitchEnabled();
    const isImageSelectionDisabled = this.appMode === AppMode.RECORDING || this.appMode === AppMode.VIEWING_RECORDED;

    return html`
      <button
        class="menu-button ${this.showMenu ? 'active' : ''}"
        @click=${this.toggleMenu}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      <div class="dropdown-menu ${this.showMenu ? 'active' : ''}">
        <div
          class="menu-item ${isRecordModeDisabled ? 'disabled' : ''}"
          @click=${this.handleMenuItemClick}
        >
          <span>Record Mode</span>
          <div
            class="toggle-switch ${this.recordMode
              ? 'active'
              : ''} ${isRecordModeDisabled ? 'disabled' : ''}"
            @click=${this.handleToggleClick}
            title="${isRecordModeDisabled
              ? 'Record mode is disabled while viewing frozen video or images'
              : ''}"
          ></div>
        </div>
        ${this.availableCameras.length > 1
          ? html`
              <div 
                class="menu-item ${!isCameraSwitchEnabled ? 'disabled' : ''}" 
                @click=${this.handleSwitchCamera}
                title="${!isCameraSwitchEnabled 
                  ? 'Camera switching is only available in live mode' 
                  : 'Switch camera'}"
              >
                <span>Switch Camera</span>
                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;">
                  <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm3-4.5h-2v2l-3-3 3-3v2h2v2z"/>
                </svg>
              </div>
            `
          : ''}
        <div 
          class="menu-item ${isImageSelectionDisabled ? 'disabled' : ''}" 
          @click=${isImageSelectionDisabled ? undefined : this.handleSelectImage}
          title="${isImageSelectionDisabled ? 'Image selection disabled during recording/playback' : 'Select an image file'}"
        >
          <span>Select Image</span>
        </div>
        <div 
          class="menu-item ${isImageSelectionDisabled ? 'disabled' : ''}" 
          @click=${isImageSelectionDisabled ? undefined : this.handleViewExample}
          title="${isImageSelectionDisabled ? 'View example disabled during recording/playback' : 'View example AprilTag image'}"
        >
          <span>View Example</span>
        </div>
        <div 
          class="menu-item" 
          @click=${this.handleWhatAreAprilTags}
          title="Learn about AprilTags"
        >
          <span>What are AprilTags?</span>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleDocumentClick = (e: Event) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.showMenu = false;
    }
  };

  private toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  private handleMenuItemClick(e: Event) {
    // Don't close menu when clicking on the menu item
    e.stopPropagation();
  }

  private isRecordModeDisabled(): boolean {
    return (
      this.appMode === AppMode.PAUSED || this.appMode === AppMode.IMAGE_MODE
    );
  }

  private isCameraSwitchEnabled(): boolean {
    return this.appMode === AppMode.LIVE || this.appMode === AppMode.RECORDING;
  }

  private handleToggleClick(e: Event) {
    e.stopPropagation();

    if (this.isRecordModeDisabled()) {
      return;
    }

    this.recordMode = !this.recordMode;
    this.dispatchEvent(
      new CustomEvent('record-mode-changed', {
        detail: { recordMode: this.recordMode },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleSwitchCamera(e: Event) {
    e.stopPropagation();
    
    if (!this.isCameraSwitchEnabled()) {
      return;
    }
    
    this.showMenu = false;

    // Find the next camera in the list
    const currentIndex = this.availableCameras.findIndex(
      camera => camera.deviceId === this.currentCameraId
    );
    const nextIndex = (currentIndex + 1) % this.availableCameras.length;
    const nextCamera = this.availableCameras[nextIndex];

    this.dispatchEvent(
      new CustomEvent('camera-switch-requested', {
        detail: { deviceId: nextCamera.deviceId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleSelectImage(e: Event) {
    e.stopPropagation();
    
    // Prevent image selection during recording or viewing recorded
    if (this.appMode === AppMode.RECORDING || this.appMode === AppMode.VIEWING_RECORDED) {
      return;
    }
    
    this.showMenu = false;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.dispatchEvent(
          new CustomEvent('image-selected', {
            detail: { file },
            bubbles: true,
            composed: true,
          })
        );
      }
      input.remove();
    });

    document.body.appendChild(input);
    input.click();
  }

  private async handleViewExample(e: Event) {
    e.stopPropagation();
    
    // Prevent view example during recording or viewing recorded
    if (this.appMode === AppMode.RECORDING || this.appMode === AppMode.VIEWING_RECORDED) {
      return;
    }
    
    this.showMenu = false;

    try {
      // Fetch the sample image
      const response = await fetch('/sample.jpg');
      if (!response.ok) {
        throw new Error('Failed to load sample image');
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'sample.jpg', { type: 'image/jpeg' });
      
      this.dispatchEvent(
        new CustomEvent('image-selected', {
          detail: { 
            file,
            familyId: 'tagStandard52h13'  // Include the family to switch to
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error('Error loading sample image:', error);
    }
  }

  private handleWhatAreAprilTags(e: Event) {
    e.stopPropagation();
    this.showMenu = false;
    window.open('https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html', '_blank');
  }
}
