import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('recorded-tags')
export class RecordedTags extends LitElement {
  @property({ type: Array }) tagIds: number[] = [];

  static styles = css`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--dark-bg);
      color: var(--text-primary);
      padding: 20px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 10px 0;
      color: var(--neon-cyan);
      text-shadow: 0 0 15px var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .count {
      font-size: 16px;
      color: var(--text-secondary);
      text-shadow: 0 0 10px var(--neon-green);
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .tag-item {
      background: var(--card-bg);
      border: 1px solid var(--neon-green);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      white-space: nowrap;
      color: var(--neon-green);
      text-shadow: 0 0 8px var(--neon-green);
      box-shadow: 
        0 0 15px rgba(0, 255, 128, 0.3),
        inset 0 0 10px rgba(0, 255, 128, 0.1);
      transition: all 0.3s ease;
    }

    .tag-item:hover {
      box-shadow: 
        0 0 25px rgba(0, 255, 128, 0.5),
        inset 0 0 15px rgba(0, 255, 128, 0.2);
    }

    .tag-item.range {
      background: var(--card-bg);
      border-color: var(--neon-blue);
      color: var(--neon-blue);
      text-shadow: 0 0 8px var(--neon-blue);
      box-shadow: 
        0 0 15px rgba(0, 128, 255, 0.3),
        inset 0 0 10px rgba(0, 128, 255, 0.1);
    }

    .tag-item.range:hover {
      box-shadow: 
        0 0 25px rgba(0, 128, 255, 0.5),
        inset 0 0 15px rgba(0, 128, 255, 0.2);
    }

    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--card-bg);
      border: 1px solid var(--text-secondary);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-family: 'Courier New', monospace;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(176, 176, 208, 0.2);
    }

    .close-button:hover {
      background: var(--card-bg);
      border-color: var(--text-primary);
      color: var(--neon-pink);
      box-shadow: 0 0 15px rgba(255, 0, 128, 0.3);
      text-shadow: 0 0 8px var(--neon-pink);
    }

    .empty-state {
      text-align: center;
      color: var(--text-secondary);
      font-size: 16px;
      margin-top: 40px;
      text-shadow: 0 0 10px var(--neon-purple);
    }
  `;

  render() {
    const compressedTags = this.compressTagIds(this.tagIds);
    
    return html`
      <button class="close-button" @click=${this.close}>×</button>
      
      <div class="header">
        <h2>Recorded Tags</h2>
        ${this.tagIds.length > 0 ? html`<div class="count">${this.tagIds.length} unique tag${this.tagIds.length === 1 ? '' : 's'} detected</div>` : ''}
      </div>

      ${this.tagIds.length === 0 
        ? html`<div class="empty-state">No tags detected during recording</div>`
        : html`
          <div class="tags-container">
            ${compressedTags.map(item => html`
              <div class="tag-item ${item.isRange ? 'range' : ''}">
                ${item.display}
              </div>
            `)}
          </div>
        `
      }
    `;
  }

  private compressTagIds(tagIds: number[]): Array<{display: string, isRange: boolean}> {
    if (tagIds.length === 0) return [];
    
    const sorted = [...new Set(tagIds)].sort((a, b) => a - b);
    const compressed: Array<{display: string, isRange: boolean}> = [];
    
    let start = sorted[0];
    let end = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        if (start === end) {
          compressed.push({display: start.toString(), isRange: false});
        } else if (end === start + 1) {
          compressed.push({display: start.toString(), isRange: false});
          compressed.push({display: end.toString(), isRange: false});
        } else {
          compressed.push({display: `${start}-${end}`, isRange: true});
        }
        start = sorted[i];
        end = sorted[i];
      }
    }
    
    if (start === end) {
      compressed.push({display: start.toString(), isRange: false});
    } else if (end === start + 1) {
      compressed.push({display: start.toString(), isRange: false});
      compressed.push({display: end.toString(), isRange: false});
    } else {
      compressed.push({display: `${start}-${end}`, isRange: true});
    }
    
    return compressed;
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }));
  }
}