# Build Instructions

This document provides detailed instructions for building the AprilTag WASM library.

## Prerequisites

### Emscripten Installation

The AprilTag library needs to be compiled to WebAssembly using Emscripten.

#### Option 1: Install Emscripten Directly

1. Follow the official installation guide: https://emscripten.org/docs/getting_started/downloads.html

2. Quick installation (Linux/macOS):
   ```bash
   # Download and install
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ./emsdk_env.sh
   ```

3. Verify installation:
   ```bash
   emcc --version
   ```


#### Option 2: Use Nix (Recommended)

If you use Nix, you can use the provided flake for a reproducible development environment:

```bash
# Enter development shell with all dependencies
nix develop

# Or use direnv for automatic activation
echo "use flake" > .envrc && direnv allow

# Build using Nix app
nix run .#build

# Serve using Nix app
nix run .#serve
```

The Nix flake provides:
- Emscripten compiler
- Node.js and Python for serving
- All required build tools
- Automatic environment setup
- Helpful shell prompts

## Building

Once Emscripten is installed:

1. Clone the repository with submodules:
   ```bash
   git clone --recursive https://github.com/yourusername/apriltag-mobile.git
   cd apriltag-mobile
   ```

2. Run the build script:
   ```bash
   ./build.sh
   ```

3. The script will generate:
   - `apriltag_wasm.js` - WASM wrapper and module loader
   - `apriltag_wasm.wasm` - Compiled AprilTag library binary
   - `apriltag.js` - JavaScript API wrapper

## Troubleshooting

### "emcc not found"
- Ensure Emscripten is installed and in your PATH
- If using emsdk, make sure to run `source ./emsdk_env.sh`

### "apriltag-js-standalone submodule not found"
- Run `git submodule update --init --recursive`

### Build fails with compilation errors
- Ensure you have the latest version of Emscripten
- Check that all submodules are properly initialized
- Try cleaning and rebuilding: `cd apriltag-js-standalone && make clean && cd .. && ./build.sh`

### Generated files are too small or contain errors
- The build script checks file sizes to detect common issues
- If files contain "404: Not Found" or similar, it means the download/generation failed
- Check your internet connection and retry

## Development Workflow

For active development:

1. Make changes to the AprilTag integration code
2. Test locally by running `./build.sh` and serving the files
3. Commit your changes (the WASM files are ignored by git)
4. Push to trigger GitHub Actions deployment

The GitHub Actions workflow will automatically build and deploy the WASM files when you push to the main branch.