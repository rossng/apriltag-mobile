import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('overflow-menu')
export class OverflowMenu extends LitElement {
  @property({ type: Boolean }) recordMode = false;
  @state() private showMenu = false;
  
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .menu-button {
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-button.active {
      background: rgba(255, 255, 255, 0.2);
    }

    .menu-button svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: rgba(40, 40, 40, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 4px;
      z-index: 1001;
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 160px;
    }

    .dropdown-menu.active {
      display: block;
    }

    .menu-item {
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.2s;
      border-radius: 4px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .toggle-switch {
      width: 32px;
      height: 18px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 9px;
      position: relative;
      transition: background 0.2s;
      cursor: pointer;
    }

    .toggle-switch.active {
      background: #007AFF;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      top: 2px;
      left: 2px;
      transition: transform 0.2s;
    }

    .toggle-switch.active::after {
      transform: translateX(14px);
    }
  `;

  render() {
    return html`
      <button class="menu-button ${this.showMenu ? 'active' : ''}" @click=${this.toggleMenu}>
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
      <div class="dropdown-menu ${this.showMenu ? 'active' : ''}">
        <div class="menu-item" @click=${this.handleMenuItemClick}>
          <span>Record Mode</span>
          <div class="toggle-switch ${this.recordMode ? 'active' : ''}" @click=${this.handleToggleClick}></div>
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

  private handleToggleClick(e: Event) {
    e.stopPropagation();
    this.recordMode = !this.recordMode;
    this.dispatchEvent(new CustomEvent('record-mode-changed', {
      detail: { recordMode: this.recordMode },
      bubbles: true,
      composed: true
    }));
  }
}