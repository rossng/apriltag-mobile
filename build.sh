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

# Copy the built files to the root directory
echo "📋 Copying build artifacts..."
cp apriltag-js-standalone/html/apriltag_wasm.js ./
cp apriltag-js-standalone/html/apriltag_wasm.wasm ./
cp apriltag-js-standalone/html/apriltag.js ./

# Verify the files were copied and are not empty
for file in apriltag_wasm.js apriltag_wasm.wasm apriltag.js; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Failed to copy $file"
        exit 1
    fi
    
    size=$(wc -c < "$file")
    if [ "$size" -lt 100 ]; then
        echo "❌ Error: $file is too small ($size bytes), likely contains error content"
        exit 1
    fi
    
    echo "✅ $file: $size bytes"
done

echo "🎉 Build completed successfully!"
echo ""
echo "Generated files:"
echo "  - apriltag_wasm.js (WASM wrapper)"
echo "  - apriltag_wasm.wasm (compiled AprilTag library)"
echo "  - apriltag.js (JavaScript API)"
echo ""
echo "You can now serve the files locally or deploy to a web server."