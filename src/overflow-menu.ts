import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppMode } from './app-state';

@customElement('overflow-menu')
export class OverflowMenu extends LitElement {
  @property({ type: Boolean }) recordMode = false;
  @property({ type: String }) appMode: AppMode = AppMode.LIVE;
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
        <div class="menu-item" @click=${this.handleSelectImage}>
          <span>Select Image</span>
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

  private handleSelectImage(e: Event) {
    e.stopPropagation();
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
}
