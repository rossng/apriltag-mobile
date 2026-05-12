{
  description = "AprilTag Mobile - Detect AprilTags from your camera in the browser";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    apriltag-src = {
      url = "github:AprilRobotics/apriltag";
      flake = false;
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      apriltag-src,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Builds the AprilTag detector to WebAssembly, linking the upstream
        # AprilRobotics/apriltag C sources together with the Emscripten wrapper
        # in ./wasm/src. Produces apriltag_wasm.{js,wasm,d.ts}.
        apriltagWasm = pkgs.stdenv.mkDerivation {
          pname = "apriltag-wasm";
          version = builtins.substring 0 7 apriltag-src.rev;

          nativeBuildInputs = [
            pkgs.emscripten
            pkgs.typescript
          ];

          dontUnpack = true;

          buildPhase = ''
            runHook preBuild

            export HOME=$TMPDIR
            mkdir -p apriltag
            cp -r ${apriltag-src}/. apriltag/
            cp -r ${./wasm/src} src
            chmod -R u+w apriltag src

            APRILTAG_SRCS=$(ls apriltag/*.c apriltag/common/*.c | grep -v apriltag_pywrap.c)
            WRAPPER_SRCS="src/apriltag_js.c src/str_json.c"

            mkdir -p out
            emcc -Os \
              -s MODULARIZE=1 \
              -s 'EXPORT_NAME="AprilTagWasm"' \
              -s WASM=1 \
              -s ALLOW_MEMORY_GROWTH=1 \
              -s EXPORTED_FUNCTIONS="['_free']" \
              -s EXPORTED_RUNTIME_METHODS='["cwrap", "getValue", "setValue", "HEAPU8"]' \
              -s EXPORT_ES6 \
              -Iapriltag \
              --emit-tsd apriltag_wasm.d.ts \
              -o out/apriltag_wasm.js \
              $APRILTAG_SRCS $WRAPPER_SRCS

            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp out/apriltag_wasm.js out/apriltag_wasm.wasm out/apriltag_wasm.d.ts $out/

            # Ship the upstream licenses alongside the binary so any
            # redistribution carries the required attribution.
            install -m 644 ${apriltag-src}/LICENSE.md        $out/LICENSE.apriltag
            install -m 644 ${./wasm/LICENSE.apriltag-js-standalone} \
              $out/LICENSE.apriltag-js-standalone
            install -m 644 ${./wasm/NOTICE.md}               $out/NOTICE.md

            runHook postInstall
          '';
        };

        # Copy the built WASM artifacts into the source tree:
        #   - public/        is served by Vite at runtime (including license texts
        #                    so the deployed binary distribution carries its
        #                    required BSD attribution).
        #   - src/apriltag/  provides the .d.ts/.js/.wasm for Vite at bundle time.
        installWasm = pkgs.writeShellScript "install-apriltag-wasm" ''
          set -euo pipefail
          mkdir -p public src/apriltag
          install -m 644 ${apriltagWasm}/apriltag_wasm.js                  public/apriltag_wasm.js
          install -m 644 ${apriltagWasm}/apriltag_wasm.wasm                public/apriltag_wasm.wasm
          install -m 644 ${apriltagWasm}/LICENSE.apriltag                  public/LICENSE.apriltag
          install -m 644 ${apriltagWasm}/LICENSE.apriltag-js-standalone    public/LICENSE.apriltag-js-standalone
          install -m 644 ${apriltagWasm}/NOTICE.md                         public/NOTICE.md
          install -m 644 ${apriltagWasm}/apriltag_wasm.js                  src/apriltag/apriltag_wasm.js
          install -m 644 ${apriltagWasm}/apriltag_wasm.wasm                src/apriltag/apriltag_wasm.wasm
          install -m 644 ${apriltagWasm}/apriltag_wasm.d.ts                src/apriltag/apriltag_wasm.d.ts
          echo "✓ WASM artifacts and license notices installed to public/ and src/apriltag/"
        '';
      in
      {
        packages = {
          apriltagWasm = apriltagWasm;
          default = apriltagWasm;
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            emscripten
            nodejs
            nodePackages.npm
          ];
        };

        apps.build = {
          type = "app";
          program = toString installWasm;
        };

        apps.serve = {
          type = "app";
          program = toString (
            pkgs.writeShellScript "apriltag-mobile-serve" ''
              set -euo pipefail
              export PATH=${
                pkgs.lib.makeBinPath [
                  pkgs.nodejs
                  pkgs.nodePackages.npm
                ]
              }:$PATH
              ${installWasm}
              [ -d node_modules ] || npm install
              exec npm run dev
            ''
          );
        };

        apps.default = self.apps.${system}.build;
      }
    );
}
