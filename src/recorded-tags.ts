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
      background: #000;
      color: #fff;
      padding: 20px;
      overflow-y: auto;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 10px 0;
    }

    .count {
      font-size: 16px;
      color: #aaa;
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
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
      white-space: nowrap;
    }

    .tag-item.range {
      background: rgba(0, 122, 255, 0.2);
      border-color: rgba(0, 122, 255, 0.4);
    }

    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.2s;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .empty-state {
      text-align: center;
      color: #888;
      font-size: 16px;
      margin-top: 40px;
    }
  `;

  render() {
    const compressedTags = this.compressTagIds(this.tagIds);
    
    return html`
      <button class="close-button" @click=${this.close}>×</button>
      
      <div class="header">
        <h2>Recorded Tags</h2>
        ${this.tagIds.length > 0 ? html`<div class="count">${this.tagIds.length} unique tags detected</div>` : ''}
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