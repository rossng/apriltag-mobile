import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Detection } from './detector';

@customElement('apriltag-detections')
export class Detections extends LitElement {
  @property({ type: Array }) detections: Detection[] = [];
  @property({ type: Object }) imageData?: ImageData;
  @property({ type: Boolean }) showImage: boolean = false;
  @property({ type: Object }) videoDimensions?: {
    width: number;
    height: number;
  };

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private scale = 1;
  private translateX = 0;
  private translateY = 0;
  private lastTouchDistance = 0;
  private lastTouchCenterX = 0;
  private lastTouchCenterY = 0;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      overflow: hidden;
    }

    canvas {
      width: 100%;
      height: 100%;
      background: transparent;
      touch-action: none;
      transform-origin: 0 0;
      transition: transform 0.1s ease-out;
    }

    canvas.cover-mode {
      object-fit: cover;
    }

    canvas.fill-mode {
      object-fit: fill;
    }
  `;

  render() {
    return html`
      <canvas class="cover-mode"></canvas>
    `;
  }

  firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupTouchEvents();
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('detections') ||
      changedProperties.has('imageData') ||
      changedProperties.has('showImage') ||
      changedProperties.has('videoDimensions')
    ) {
      // Reset zoom when switching between modes or loading new images
      if (changedProperties.has('showImage') || changedProperties.has('imageData')) {
        this.resetZoom();
      }
      this.drawCanvas();
    }
  }

  private drawCanvas() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw frozen image if in paused mode
    if (this.showImage && this.imageData) {
      this.canvas.width = this.imageData.width;
      this.canvas.height = this.imageData.height;
      this.ctx.putImageData(this.imageData, 0, 0);
    } else if (this.videoDimensions) {
      // In live mode, use video dimensions
      this.canvas.width = this.videoDimensions.width;
      this.canvas.height = this.videoDimensions.height;
    }

    // Draw detections
    this.drawDetections();
  }

  /**
   * Set canvas dimensions to match video
   */
  setCanvasDimensions(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private drawDetections() {
    if (!this.detections || this.detections.length === 0) return;

    // Calculate font size relative to viewport dimensions
    const baseFontSize = this.calculateViewportRelativeFontSize();
    this.ctx.font = `bold ${baseFontSize}px Arial`;
    this.ctx.textAlign = 'center';

    // Calculate scaled dimensions for consistent appearance
    const outlineWidth = Math.max(1, Math.round(baseFontSize * 0.07)); // ~7% of font size
    const circleRadius = Math.max(1.5, Math.round(baseFontSize * 0.15)); // ~15% of font size (half of original)
    const textOutlineWidth = Math.max(1, Math.round(baseFontSize * 0.14)); // ~14% of font size
    const textInnerOutlineWidth = Math.max(1, Math.round(baseFontSize * 0.07)); // ~7% of font size

    this.detections.forEach((detection) => {
      const corners = detection.corners;

      // Draw tag outline with neon cyan glow
      this.ctx.shadowColor = '#00ffff';
      this.ctx.shadowBlur = 10;
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = outlineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) {
        this.ctx.lineTo(corners[i].x, corners[i].y);
      }
      this.ctx.closePath();
      this.ctx.stroke();

      // Draw top-left corner as neon magenta circle
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = '#ff00ff';
      this.ctx.beginPath();
      this.ctx.arc(corners[0].x, corners[0].y, circleRadius, 0, 2 * Math.PI);
      this.ctx.fill();

      // Draw tag ID with neon styling and glow
      const center = detection.center;
      const text = detection.id.toString();

      // Reset shadow for text outline
      this.ctx.shadowBlur = 0;

      // Draw dark outline (stroke)
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = textOutlineWidth;
      this.ctx.strokeText(text, center.x, center.y + 10);

      // Draw cyan outline (thinner)
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = textInnerOutlineWidth;
      this.ctx.strokeText(text, center.x, center.y + 10);

      // Draw neon green fill with glow
      this.ctx.shadowColor = '#00ff80';
      this.ctx.shadowBlur = 5;
      this.ctx.fillStyle = '#00ff80';
      this.ctx.fillText(text, center.x, center.y + 10);

      // Reset shadow for next detection
      this.ctx.shadowBlur = 0;
    });
  }

  /**
   * Calculate font size relative to viewport dimensions to ensure consistent label size
   * regardless of image resolution
   */
  private calculateViewportRelativeFontSize(): number {
    // Get the displayed canvas size (viewport size)
    const canvasRect = this.canvas.getBoundingClientRect();
    const displayWidth = canvasRect.width;
    const displayHeight = canvasRect.height;

    // Base font size relative to the smaller viewport dimension
    // This ensures labels are readable on both wide and tall images
    const minViewportDimension = Math.min(displayWidth, displayHeight);

    // Scale factor: roughly 3% of the smaller viewport dimension
    // This provides good readability while not being too large
    const baseFontSize = Math.max(12, Math.round(minViewportDimension * 0.03));

    // Apply scaling factor based on canvas resolution vs display size
    // This accounts for the object-fit: cover scaling
    const scaleX = this.canvas.width / displayWidth;
    const scaleY = this.canvas.height / displayHeight;
    const averageScale = (scaleX + scaleY) / 2;

    return Math.round(baseFontSize * averageScale);
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.detections = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private setupTouchEvents() {
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
  }

  private handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    
    if (!this.showImage) return;
    
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      this.lastTouchDistance = this.getDistance(touch1, touch2);
      const center = this.getTouchCenter(touch1, touch2);
      this.lastTouchCenterX = center.x;
      this.lastTouchCenterY = center.y;
    }
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    
    if (!this.showImage) return;
    
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const currentDistance = this.getDistance(touch1, touch2);
      const center = this.getTouchCenter(touch1, touch2);
      
      if (this.lastTouchDistance > 0) {
        const scaleChange = currentDistance / this.lastTouchDistance;
        const newScale = Math.max(0.5, Math.min(5, this.scale * scaleChange));
        
        // Calculate zoom point relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const zoomPointX = center.x - rect.left;
        const zoomPointY = center.y - rect.top;
        
        // Adjust translation to zoom around the touch center
        const scaleDiff = newScale - this.scale;
        this.translateX -= (zoomPointX / rect.width) * rect.width * scaleDiff;
        this.translateY -= (zoomPointY / rect.height) * rect.height * scaleDiff;
        
        this.scale = newScale;
        this.updateCanvasTransform();
      }
      
      this.lastTouchDistance = currentDistance;
      this.lastTouchCenterX = center.x;
      this.lastTouchCenterY = center.y;
    } else if (e.touches.length === 1 && this.scale > 1) {
      // Pan when zoomed in
      const touch = e.touches[0];
      if (this.lastTouchCenterX !== 0 && this.lastTouchCenterY !== 0) {
        const deltaX = touch.clientX - this.lastTouchCenterX;
        const deltaY = touch.clientY - this.lastTouchCenterY;
        
        this.translateX += deltaX;
        this.translateY += deltaY;
        this.updateCanvasTransform();
      }
      
      this.lastTouchCenterX = touch.clientX;
      this.lastTouchCenterY = touch.clientY;
    }
  }

  private handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    
    if (e.touches.length === 0) {
      this.lastTouchDistance = 0;
      this.lastTouchCenterX = 0;
      this.lastTouchCenterY = 0;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.lastTouchCenterX = touch.clientX;
      this.lastTouchCenterY = touch.clientY;
    }
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();
    
    if (!this.showImage) return;
    
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(5, this.scale * scaleChange));
    
    // Calculate zoom point relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const zoomPointX = e.clientX - rect.left;
    const zoomPointY = e.clientY - rect.top;
    
    // Adjust translation to zoom around the mouse cursor
    const scaleDiff = newScale - this.scale;
    this.translateX -= (zoomPointX / rect.width) * rect.width * scaleDiff;
    this.translateY -= (zoomPointY / rect.height) * rect.height * scaleDiff;
    
    this.scale = newScale;
    this.updateCanvasTransform();
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }

  private updateCanvasTransform() {
    this.canvas.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
  }

  private resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateCanvasTransform();
  }
}
