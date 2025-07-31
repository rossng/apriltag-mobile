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
  
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .dropdown {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      padding: 8px 16px;
      cursor: pointer;
      min-width: 220px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s;
    }

    .dropdown:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .dropdown.active {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
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

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: rgba(40, 40, 40, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 4px;
      z-index: 1001;
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-item.selected {
      background: rgba(0, 122, 255, 0.3);
      font-weight: 500;
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
    { id: 'tagCustom48h12', label: 'tagCustom48h12 (42211 tags)' }
  ];

  render() {
    const currentFamilyData = this.families.find(f => f.id === this.currentFamily);
    const currentLabel = currentFamilyData?.id || this.currentFamily;
    
    return html`
      <div class="dropdown ${this.showMenu ? 'active' : ''}" @click=${this.toggleMenu}>
        <span class="dropdown-label">${currentLabel}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="dropdown-menu ${this.showMenu ? 'active' : ''}">
        ${this.families.map(family => html`
          <div 
            class="menu-item ${this.currentFamily === family.id ? 'selected' : ''}"
            @click=${(e: Event) => {
              e.stopPropagation();
              this.selectFamily(family.id);
            }}
          >
            ${family.label}
          </div>
        `)}
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
    this.showMenu = !this.showMenu;
  }

  private selectFamily(familyId: string) {
    if (familyId !== this.currentFamily) {
      this.dispatchEvent(new CustomEvent('family-selected', {
        detail: { familyId },
        bubbles: true,
        composed: true
      }));
    }
    this.showMenu = false;
  }
}