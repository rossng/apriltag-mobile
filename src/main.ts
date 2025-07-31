import './app';
import createDetector from "./apriltag/apriltag_wasm.js";

async function initApp() {
  try {
    const detector = await createDetector();
    const app = document.createElement('apriltag-app');
    (app as any).detector = detector;
    document.body.appendChild(app);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Initialize when the script loads
initApp();