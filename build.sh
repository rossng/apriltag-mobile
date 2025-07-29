#!/bin/bash

# AprilTag WASM Build Script
# This script compiles the AprilTag library to WebAssembly

set -e  # Exit on any error

echo "🔧 Building AprilTag WASM library..."

# Check if emscripten is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Error: Emscripten not found. Please install Emscripten first."
    echo "   Visit: https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "apriltag-js-standalone" ]; then
    echo "❌ Error: apriltag-js-standalone submodule not found."
    echo "   Run: git submodule update --init --recursive"
    exit 1
fi

echo "📁 Entering apriltag-js-standalone directory..."
cd apriltag-js-standalone

# Initialize and update submodules (apriltag C library)
echo "🔄 Updating submodules..."
git submodule update --init --recursive

# Check if apriltag submodule exists
if [ ! -d "apriltag" ]; then
    echo "❌ Error: apriltag C library submodule not found."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
if [ -d "html" ]; then
    rm -f html/apriltag_wasm.js html/apriltag_wasm.wasm
fi

# Build the WASM library
echo "🏗️  Compiling AprilTag to WebAssembly..."
make apriltag_wasm.js

# Check if build was successful
if [ ! -f "html/apriltag_wasm.js" ] || [ ! -f "html/apriltag_wasm.wasm" ]; then
    echo "❌ Error: Build failed. WASM files not generated."
    exit 1
fi

# Return to root directory
cd ..

echo "🎉 Build completed successfully!"
echo ""
echo "Generated files in public/:"
echo "  - apriltag_wasm.js (WASM wrapper)"
echo "  - apriltag_wasm.wasm (compiled AprilTag library)"
echo ""
echo "You can now run the Vite development server:"
echo "  npm run dev"