# AprilTag Mobile Detector

A mobile-first web application for detecting AprilTags using your device's camera. Built with vanilla JavaScript and optimized for mobile devices.

**Note:** The detector is currently configured to use tag36h11 by default. While other families are compiled in, the current JavaScript wrapper may need modifications to support family switching at runtime.

## Local Development

1. Clone this repository with submodules:
   ```bash
   git clone --recursive https://github.com/yourusername/apriltag-mobile.git
   cd apriltag-mobile
   ```

2. Build the WASM library:
   ```bash
   nix run .#build
   ```

4. Start the development server:
   ```bash
   nix run .#serve
   
   # Or manually:
   npm run dev
   ```

5. Open in your mobile browser or use browser dev tools mobile view

## Real AprilTag Detection

This app uses the AprilTag WASM library from [apriltag-js-standalone](https://github.com/rossng/apriltag-js-standalone):

## License

Based on the apriltag-js-standalone project. See [original repository](https://github.com/arenaxr/apriltag-js-standalone) for license details.
