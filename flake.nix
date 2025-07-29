{
  description = "AprilTag Mobile - Development environment with Emscripten";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core build tools
            emscripten
            python3
            nodejs
            
            # Development tools
            git
            gnumake
            gcc
            
            # Optional: useful for development
            http-server
            
            # Shell utilities
            which
            curl
            jq
          ];

          shellHook = ''
            echo "🚀 AprilTag Mobile Development Environment"
            echo "=========================================="
            echo "Available tools:"
            echo "  • emcc $(emcc --version | head -n1)"
            echo "  • Node.js $(node --version)"
            echo "  • Python $(python3 --version)"
            echo "  • Make $(make --version | head -n1)"
            echo ""
            echo "Quick start:"
            echo "  1. Initialize submodules: git submodule update --init --recursive"
            echo "  2. Build WASM library: ./build.sh"
            echo "  3. Start dev server: npx http-server"
            echo ""
            echo "The build environment is ready! 🎯"
            echo ""
            
            # Ensure git submodules are initialized
            if [ ! -d "apriltag-js-standalone/.git" ]; then
              echo "⚠️  Submodules not initialized. Run: git submodule update --init --recursive"
            fi
            
            # Check if WASM files exist
            if [ ! -f "apriltag_wasm.js" ] || [ ! -f "apriltag_wasm.wasm" ]; then
              echo "💡 WASM files not found. Run './build.sh' to compile them."
            fi
          '';

          # Environment variables
          EMSCRIPTEN_ROOT = "${pkgs.emscripten}/share/emscripten";
          
          # Make sure the Emscripten tools are available
          EM_CONFIG = "${pkgs.emscripten}/share/emscripten/.emscripten";
        };

        # Optional: provide the build script as a Nix app
        apps.build = {
          type = "app";
          program = "${pkgs.writeShellScript "build-apriltag" ''
            set -e
            echo "Building AprilTag WASM with Nix environment..."
            ${self.devShells.${system}.default.shellHook}
            exec ./build.sh
          ''}";
        };

        # Optional: provide a serve app for development
        apps.serve = {
          type = "app";
          program = "${pkgs.writeShellScript "serve-apriltag" ''
            set -e
            echo "Starting development server..."
            if [ ! -f "apriltag_wasm.js" ]; then
              echo "WASM files not found. Building first..."
              ./build.sh
            fi
            echo "Server will be available at http://localhost:8080"
            exec ${pkgs.nodejs}/bin/npx http-server -p 8080 -c-1
          ''}";
        };

        # Default app points to build
        apps.default = self.apps.${system}.build;
      });
}