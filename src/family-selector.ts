import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface TagFamily {
  id: string;
  label: string;
}

@customElement('family-selector')
export class FamilySelector extends LitElement {
  @property({ type: String }) currentFamily = 'tag36h11';
  @property({ type: Boolean }) showMenu = false;
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .dropdown {
      background: var(--card-bg);
      border: 1px solid var(--neon-purple);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 14px;
      font-family: 'Courier New', monospace;
      padding: 8px 16px;
      cursor: pointer;
      min-width: 120px;
      max-width: 240px;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
      box-shadow: 0 0 15px rgba(128, 0, 255, 0.3);
    }

    .dropdown:hover {
      background: var(--card-bg);
      border-color: var(--neon-purple);
      box-shadow: 0 0 25px rgba(128, 0, 255, 0.5);
      text-shadow: 0 0 10px var(--neon-purple);
    }

    .dropdown.active {
      background: var(--card-bg);
      border-color: var(--neon-purple);
      box-shadow: 0 0 30px rgba(128, 0, 255, 0.6);
      text-shadow: 0 0 15px var(--neon-purple);
    }

    .dropdown-label {
      flex: 1;
      text-align: left;
      font-weight: 500;
    }

    .dropdown-arrow {
      margin-left: 8px;
      transition: transform 0.2s;
    }

    .dropdown.active .dropdown-arrow {
      transform: rotate(180deg);
    }

    .dropdown.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      border-color: var(--text-secondary);
      box-shadow: 0 0 10px rgba(128, 128, 128, 0.2);
    }

    .dropdown.disabled:hover {
      background: var(--card-bg);
      border-color: var(--text-secondary);
      box-shadow: 0 0 10px rgba(128, 128, 128, 0.2);
      text-shadow: none;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--card-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--neon-purple);
      border-radius: 8px;
      padding: 4px;
      z-index: 1001;
      display: none;
      box-shadow:
        0 4px 20px rgba(128, 0, 255, 0.4),
        inset 0 0 20px rgba(128, 0, 255, 0.1);
      min-width: max-content;
      width: auto;
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
      color: var(--text-secondary);
    }

    .menu-item:hover {
      background: rgba(128, 0, 255, 0.2);
      color: var(--text-primary);
      text-shadow: 0 0 10px var(--neon-purple);
      box-shadow: inset 0 0 10px rgba(128, 0, 255, 0.3);
    }

    .menu-item.selected {
      background: rgba(128, 0, 255, 0.3);
      color: var(--text-primary);
      font-weight: 500;
      text-shadow: 0 0 5px var(--neon-purple);
      box-shadow: inset 0 0 15px rgba(128, 0, 255, 0.4);
    }

    @media (max-width: 480px) {
      .dropdown {
        min-width: 100px;
        max-width: 150px;
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .dropdown-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .dropdown-arrow {
        margin-left: 4px;
      }
      
      .dropdown-menu {
        right: 0;
        left: auto;
        min-width: 180px;
      }
      
      .menu-item {
        padding: 8px 12px;
        font-size: 12px;
      }
    }
  `;

  private families: TagFamily[] = [
    { id: 'tag36h11', label: 'tag36h11 (587 tags)' },
    { id: 'tag25h9', label: 'tag25h9 (35 tags)' },
    { id: 'tag16h5', label: 'tag16h5 (30 tags)' },
    { id: 'tagStandard41h12', label: 'tagStandard41h12 (2115 tags)' },
    { id: 'tagStandard52h13', label: 'tagStandard52h13 (48714 tags)' },
    { id: 'tagCircle21h7', label: 'tagCircle21h7 (38 tags)' },
    { id: 'tagCircle49h12', label: 'tagCircle49h12 (65535 tags)' },
    { id: 'tagCustom48h12', label: 'tagCustom48h12 (42211 tags)' },
  ];

  render() {
    const currentFamilyData = this.families.find(
      (f) => f.id === this.currentFamily
    );
    const currentLabel = currentFamilyData?.id || this.currentFamily;

    return html`
      <div
        class="dropdown ${this.showMenu ? 'active' : ''} ${this.disabled ? 'disabled' : ''}"
        @click=${this.disabled ? undefined : this.toggleMenu}
        title="${this.disabled ? 'Family selection disabled during recording/playback' : (currentFamilyData?.label || currentLabel)}"
      >
        <span class="dropdown-label">${currentLabel}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="dropdown-menu ${this.showMenu ? 'active' : ''}">
        ${this.families.map(
          (family) => html`
            <div
              class="menu-item ${this.currentFamily === family.id
                ? 'selected'
                : ''}"
              @click=${(e: Event) => {
                e.stopPropagation();
                this.selectFamily(family.id);
              }}
            >
              ${family.label}
            </div>
          `
        )}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick);
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleClick = (e: Event) => {
    e.stopPropagation();
  };

  private handleDocumentClick = (e: Event) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.showMenu = false;
    }
  };

  private toggleMenu() {
    if (!this.disabled) {
      this.showMenu = !this.showMenu;
    }
  }

  private selectFamily(familyId: string) {
    if (familyId !== this.currentFamily) {
      this.dispatchEvent(
        new CustomEvent('family-selected', {
          detail: { familyId },
          bubbles: true,
          composed: true,
        })
      );
    }
    this.showMenu = false;
  }
}
