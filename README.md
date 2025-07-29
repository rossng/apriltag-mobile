# AprilTag Mobile Detector

A mobile-first web application for detecting AprilTags using your device's camera. Built with vanilla JavaScript and optimized for mobile devices.

## Features

- **Mobile-First Design**: Optimized interface for smartphones and tablets
- **Camera Access**: Real-time camera feed with permission handling
- **AprilTag Detection**: Detects AprilTags in captured images
- **Multiple Families**: Support for various AprilTag families (tag36h11, tag25h9, etc.)
- **Visual Feedback**: Highlights detected tags with:
  - Green outline around tag edges
  - Red circle marking the top-left corner
  - Yellow text showing the tag ID
- **Detection Info**: Displays detailed information about detected tags

## Usage

1. Open the app in your mobile browser
2. Grant camera permissions when prompted
3. Point your camera at AprilTags
4. Tap the capture button to take a picture
5. View the detection results with visual overlays
6. Use the menu (⋮) to switch between AprilTag families
7. Tap "Back to Camera" to return to live view

## AprilTag Families Supported

- **tag36h11** (Default) - Most common family
- **tag25h9** - Smaller family with 25 tags
- **tag16h5** - Compact family with 16 tags
- **tagCircle21h7** - Circular tags
- **tagCircle49h12** - Larger circular family
- **tagCustom48h12** - Custom 48-tag family
- **tagStandard41h12** - Standard 41-tag family
- **tagStandard52h13** - Standard 52-tag family

## Development

The app consists of:

- `index.html` - Main HTML structure with mobile-optimized CSS
- `app.js` - Core application logic and camera handling
- `apriltag-js-standalone/` - Git submodule containing the AprilTag WASM library
- Built files (generated during deployment):
  - `apriltag_wasm.js` - WASM wrapper
  - `apriltag_wasm.wasm` - Compiled AprilTag library
  - `apriltag.js` - JavaScript API wrapper

### Local Development

1. Clone this repository with submodules:
   ```bash
   git clone --recursive https://github.com/yourusername/apriltag-mobile.git
   cd apriltag-mobile
   ```

2. Set up the development environment:

   **Option A: Using Nix (Recommended)**
   ```bash
   # Enter the development shell with all dependencies
   nix develop
   
   # Or use direnv for automatic environment activation
   echo "use flake" > .envrc && direnv allow
   ```

   **Option B: Manual Installation**
   ```bash
   # Install Emscripten following official instructions:
   # https://emscripten.org/docs/getting_started/downloads.html
   ```

3. Build the AprilTag WASM library:
   ```bash
   # Standard build
   ./build.sh
   
   # Or using Nix app
   nix run .#build
   ```
   This script will:
   - Check for Emscripten installation
   - Initialize submodules
   - Compile the AprilTag C library to WebAssembly
   - Copy the generated files to the project root

4. Serve the files using a local web server (required for camera access):
   ```bash
   # Using Nix (recommended)
   nix run .#serve
   
   # Or manually:
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```

5. Open in your mobile browser or use browser dev tools mobile view

### Real AprilTag Detection

This app uses the real AprilTag WASM library from [apriltag-js-standalone](https://github.com/arenaxr/apriltag-js-standalone):

1. The library is included as a git submodule
2. Use `./build.sh` to compile the WASM files locally
3. GitHub Actions automatically compiles and deploys the WASM files
4. Currently supports the tag36h11 AprilTag family
5. Includes pose estimation with camera parameters

**Note:** The WASM files (`apriltag_wasm.js`, `apriltag_wasm.wasm`, `apriltag.js`) are generated during build and are not tracked in git. They will be automatically compiled during GitHub Pages deployment.

## Deployment

This app is configured for automatic deployment to GitHub Pages via GitHub Actions. The workflow:

1. Triggers on pushes to the main branch
2. Checks out the repository with submodules
3. Sets up Emscripten for WASM compilation
4. Runs `./build.sh` to build the AprilTag WASM library from source
5. Verifies the compiled files were generated successfully
6. Deploys to GitHub Pages

The build script (`build.sh`) handles all compilation steps and ensures the WASM files are properly generated.

To deploy:

1. Push your code to the main branch
2. Enable GitHub Pages in your repository settings
3. The app will be available at `https://yourusername.github.io/repository-name`

## Browser Compatibility

- **Camera Access**: Requires HTTPS (except on localhost)
- **Modern Browsers**: Works on iOS Safari, Chrome, Firefox, Edge
- **Mobile Optimized**: Touch-friendly interface with responsive design

## Security Notes

- Camera access requires user permission
- Works only on HTTPS domains (security requirement)
- No data is stored or transmitted - all processing happens locally

## License

Based on the apriltag-js-standalone project. See original repository for license details.