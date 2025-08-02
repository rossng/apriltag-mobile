import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Detection } from "./detector";

@customElement("apriltag-detections")
export class Detections extends LitElement {
  @property({ type: Array }) detections: Detection[] = [];
  @property({ type: Object }) imageData?: ImageData;
  @property({ type: Boolean }) showImage: boolean = false;
  @property({ type: Object }) videoDimensions?: { width: number; height: number };

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    canvas {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: transparent;
    }
  `;

  render() {
    return html` <canvas></canvas> `;
  }

  firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("detections") ||
      changedProperties.has("imageData") ||
      changedProperties.has("showImage") ||
      changedProperties.has("videoDimensions")
    ) {
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
    this.ctx.textAlign = "center";

    // Calculate scaled dimensions for consistent appearance
    const outlineWidth = Math.max(1, Math.round(baseFontSize * 0.07)); // ~7% of font size
    const circleRadius = Math.max(3, Math.round(baseFontSize * 0.3)); // ~30% of font size
    const textOutlineWidth = Math.max(1, Math.round(baseFontSize * 0.14)); // ~14% of font size
    const textInnerOutlineWidth = Math.max(1, Math.round(baseFontSize * 0.07)); // ~7% of font size

    this.detections.forEach((detection) => {
      const corners = detection.corners;

      // Draw tag outline (thinner green)
      this.ctx.strokeStyle = "#00ff00";
      this.ctx.lineWidth = outlineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) {
        this.ctx.lineTo(corners[i].x, corners[i].y);
      }
      this.ctx.closePath();
      this.ctx.stroke();

      // Draw top-left corner as red circle
      this.ctx.fillStyle = "#ff0000";
      this.ctx.beginPath();
      this.ctx.arc(corners[0].x, corners[0].y, circleRadius, 0, 2 * Math.PI);
      this.ctx.fill();

      // Draw tag ID with outline for better visibility
      const center = detection.center;
      const text = detection.id.toString();
      
      // Draw black outline (stroke)
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = textOutlineWidth;
      this.ctx.strokeText(text, center.x, center.y + 10);
      
      // Draw white outline (thinner)
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = textInnerOutlineWidth;
      this.ctx.strokeText(text, center.x, center.y + 10);
      
      // Draw yellow fill
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(text, center.x, center.y + 10);
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
}
