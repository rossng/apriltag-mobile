import { AprilTagDetector } from "./app.ts";
import createDetector, { MainModule } from "./apriltag/apriltag_wasm.js";

declare global {
  interface Window {
    detector?: AprilTagDetector;
  }
}

const detector: MainModule = await createDetector();
window.detector = new AprilTagDetector(detector);
window.detector.init();

function setupEventListeners(): void {
  const menuButton = document.getElementById("menuButton");
  const captureButton = document.getElementById("captureButton");
  const backButton = document.getElementById("backButton");

  menuButton?.addEventListener("click", () => {
    const menu = document.getElementById("overflowMenu");
    menu?.classList.toggle("active");
  });

  captureButton?.addEventListener("click", () => {
    if (window.detector) {
      window.detector.captureImage();
    }
  });

  backButton?.addEventListener("click", () => {
    if (window.detector) {
      window.detector.backToCamera();
    }
  });
}
setupEventListeners();
