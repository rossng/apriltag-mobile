{
  description = "AprilTag Mobile - Development environment with Emscripten";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
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
            nodePackages.npm

            # Development tools
            git
            gnumake
            gcc

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
            echo "  2. Install dependencies: npm install"
            echo "  3. Build WASM library: ./build.sh"
            echo "  4. Start dev server: npm run dev"
            echo ""
            echo "The build environment is ready! 🎯"
            echo ""

            # Ensure git submodules are initialized
            if [ ! -d "apriltag-js-standalone/.git" ]; then
              echo "⚠️  Submodules not initialized. Run: git submodule update --init --recursive"
            fi

            # Check if WASM files exist
            if [ ! -f "public/apriltag_wasm.js" ] || [ ! -f "public/apriltag_wasm.wasm" ]; then
              echo "⚠️  WASM files not found. The app will not work without them."
              echo "💡 Run './build.sh' to compile the AprilTag WASM library."
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
            export PATH=${
              pkgs.lib.makeBinPath (
                with pkgs;
                [
                  emscripten
                  git
                  gnumake
                  gcc
                  which
                  curl
                  typescript
                ]
              )
            }:$PATH
            export EMSCRIPTEN_ROOT="${pkgs.emscripten}/share/emscripten"
            export EM_CONFIG="${pkgs.emscripten}/share/emscripten/.emscripten"

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
            export PATH=${
              pkgs.lib.makeBinPath (
                with pkgs;
                [
                  nodejs
                  nodePackages.npm
                  emscripten
                  git
                  gnumake
                  gcc
                  which
                  curl
                ]
              )
            }:$PATH
            export EMSCRIPTEN_ROOT="${pkgs.emscripten}/share/emscripten"
            export EM_CONFIG="${pkgs.emscripten}/share/emscripten/.emscripten"

            echo "Starting Vite development server..."
            if [ ! -f "public/apriltag_wasm.js" ]; then
              echo "WASM files not found. Building first..."
              ./build.sh
            fi
            if [ ! -d "node_modules" ]; then
              echo "Installing npm dependencies..."
              npm install
            fi
            echo "Starting development server..."
            exec npm run dev
          ''}";
        };

        # Default app points to build
        apps.default = self.apps.${system}.build;
      }
    );
}
