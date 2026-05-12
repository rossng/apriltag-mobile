# AprilTag Mobile Detector

A mobile-first web application for detecting AprilTags using your device's camera. Built with vanilla JavaScript and optimized for mobile devices.

**Note:** The detector is currently configured to use tag36h11 by default. While other families are compiled in, the current JavaScript wrapper may need modifications to support family switching at runtime.

## Local Development

The build is fully driven by Nix — no submodules, no `build.sh`. The
[AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag) C library is
fetched as a flake input and compiled to WebAssembly together with the wrapper
sources in `wasm/src/`.

1. Clone the repository:

   ```bash
   git clone https://github.com/rossng/apriltag-mobile.git
   cd apriltag-mobile
   ```

2. Build the WASM library and start the dev server:

   ```bash
   nix run .#serve
   ```

   Or build the WASM artifacts only:

   ```bash
   nix run .#build
   ```

   Or get a shell with `emcc`, `node`, and `npm` available:

   ```bash
   nix develop
   ```

3. To bump the AprilTag library version:

   ```bash
   nix flake update apriltag-src
   ```

## AprilTag Library

The detector is built from upstream
[AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag), pinned via
`flake.lock`. The Emscripten wrapper in `wasm/src/` is derived from
[apriltag-js-standalone](https://github.com/arenaxr/apriltag-js-standalone).

## License

The mobile app code is MIT licensed. The compiled WebAssembly module links
in two BSD-licensed upstream projects:

- AprilTag (BSD-2-Clause) — Regents of the University of Michigan
- apriltag-js-standalone wrapper (BSD-3-Clause) — CONIX Research Center

See [`wasm/NOTICE.md`](./wasm/NOTICE.md) for provenance details and pointers
to both license texts. The build also copies both license files into
`public/` so the deployed site ships them alongside the WASM binary.
