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

    .menu-button {
      background: none;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      padding: 5px;
    }

    .overflow-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 10px;
      background: rgba(40, 40, 40, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 10px 0;
      min-width: 200px;
      z-index: 1001;
      display: none;
    }

    .overflow-menu.active {
      display: block;
    }

    .menu-item {
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-item.active {
      background: rgba(0, 122, 255, 0.3);
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
    return html`
      <button class="menu-button" @click=${this.toggleMenu}>⋮</button>
      <div class="overflow-menu ${this.showMenu ? 'active' : ''}">
        ${this.families.map(family => html`
          <div 
            class="menu-item ${this.currentFamily === family.id ? 'active' : ''}"
            @click=${() => this.selectFamily(family.id)}
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