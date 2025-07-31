import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Detection } from "./detector";

@customElement("apriltag-detections")
export class Detections extends LitElement {
  @property({ type: Array }) detections: Detection[] = [];
  @property({ type: Object }) imageData?: ImageData;
  @property({ type: String }) fillMode: 'cover' | 'contain' = 'contain';

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    canvas.cover {
      object-fit: cover;
    }
  `;

  render() {
    return html` <canvas class="${this.fillMode === 'cover' ? 'cover' : ''}"></canvas> `;
  }

  firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("imageData") ||
      changedProperties.has("detections") ||
      changedProperties.has("fillMode")
    ) {
      this.drawCanvas();
    }
  }

  private drawCanvas() {
    if (!this.imageData) return;

    // Set canvas size to match image
    this.canvas.width = this.imageData.width;
    this.canvas.height = this.imageData.height;

    // Draw the image
    this.ctx.putImageData(this.imageData, 0, 0);

    // Draw detections
    this.drawDetections();
  }

  private drawDetections() {
    if (!this.detections || this.detections.length === 0) return;

    this.ctx.strokeStyle = "#00ff00";
    this.ctx.fillStyle = "#ff0000";
    this.ctx.lineWidth = 3;
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";

    this.detections.forEach((detection) => {
      const corners = detection.corners;

      // Draw tag outline
      this.ctx.beginPath();
      this.ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) {
        this.ctx.lineTo(corners[i].x, corners[i].y);
      }
      this.ctx.closePath();
      this.ctx.stroke();

      // Draw top-left corner as red circle
      this.ctx.beginPath();
      this.ctx.arc(corners[0].x, corners[0].y, 8, 0, 2 * Math.PI);
      this.ctx.fill();

      // Draw tag ID
      const center = detection.center;
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(detection.id.toString(), center.x, center.y + 8);
      this.ctx.fillStyle = "#ff0000";
    });
  }

  /**
   * Capture the current frame from a video element
   */
  captureFromVideo(video: HTMLVideoElement): ImageData {
    this.canvas.width = video.videoWidth;
    this.canvas.height = video.videoHeight;

    this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.imageData = imageData;
    return imageData;
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.imageData = undefined;
    this.detections = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
