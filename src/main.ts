import { AprilTagDetector } from "./app.ts";
import createDetector, { MainModule } from "./apriltag/apriltag_wasm.js";

// interface AprilTagDetectorWasm {
//   detect(grayData: Uint8Array, width: number, height: number): any[];
// }

declare global {
  interface Window {
    detector?: AprilTagDetector;
  }
}

const detector: MainModule = await createDetector();
window.detector = new AprilTagDetector(detector);
window.detector.init();

// Set up event listeners
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
