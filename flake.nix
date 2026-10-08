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

        # Builds the AprilTag detector to WebAssembly, linking the
        # AprilRobotics/apriltag C sources together with the wrapper in
        # ./wasm/apriltag_wasm.c. Produces apriltag_wasm.{js,wasm,d.ts}.
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
            mkdir -p out
            emcc -Os \
              -s MODULARIZE=1 \
              -s EXPORT_ES6 \
              -s ENVIRONMENT=web \
              -s ALLOW_MEMORY_GROWTH=1 \
              -s EXPORTED_RUNTIME_METHODS='["ccall", "HEAPU8", "HEAPF64"]' \
              -I${apriltag-src} \
              --emit-tsd apriltag_wasm.d.ts \
              -o out/apriltag_wasm.js \
              $(ls ${apriltag-src}/*.c ${apriltag-src}/common/*.c | grep -v apriltag_pywrap.c) \
              ${./wasm/apriltag_wasm.c}

            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp out/apriltag_wasm.js out/apriltag_wasm.wasm out/apriltag_wasm.d.ts $out/

            # BSD attribution for the binary distribution.
            install -m 644 ${apriltag-src}/LICENSE.md        $out/LICENSE.apriltag
            install -m 644 ${./wasm/NOTICE.md}               $out/NOTICE.md

            runHook postInstall
          '';
        };

        # Copy the build artifacts into the source tree:
        #   - public/        gets the license text, which Vite copies
        #                    verbatim into the deployed site so the binary
        #                    distribution carries the required BSD attribution.
        #   - src/apriltag/  is consumed by Vite at bundle time: the .wasm
        #                    must sit next to apriltag_wasm.js so Vite can
        #                    resolve the new URL('apriltag_wasm.wasm',
        #                    import.meta.url) reference and emit it as an
        #                    asset; the .d.ts provides types to TypeScript.
        installWasm = pkgs.writeShellScript "install-apriltag-wasm" ''
          set -euo pipefail
          mkdir -p public src/apriltag
          install -m 644 ${apriltagWasm}/LICENSE.apriltag                  public/LICENSE.apriltag
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
