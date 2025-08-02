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

    this.ctx.font = "bold 28px Arial";
    this.ctx.textAlign = "center";

    this.detections.forEach((detection) => {
      const corners = detection.corners;

      // Draw tag outline (thinner green)
      this.ctx.strokeStyle = "#00ff00";
      this.ctx.lineWidth = 2;
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
      this.ctx.arc(corners[0].x, corners[0].y, 8, 0, 2 * Math.PI);
      this.ctx.fill();

      // Draw tag ID with outline for better visibility
      const center = detection.center;
      const text = detection.id.toString();
      
      // Draw black outline (stroke)
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = 4;
      this.ctx.strokeText(text, center.x, center.y + 10);
      
      // Draw white outline (thinner)
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 2;
      this.ctx.strokeText(text, center.x, center.y + 10);
      
      // Draw yellow fill
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(text, center.x, center.y + 10);
    });
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.detections = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
