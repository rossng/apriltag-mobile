# AprilTag Mobile Detector

A mobile-first web app for detecting AprilTags using your device's camera. The
detector is the upstream [AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag)
C library compiled to WebAssembly via Emscripten, driven from TypeScript /
[Solid](https://www.solidjs.com/).

## Local Development

The whole build is driven by Nix. `apriltag-src` is fetched as a flake input
(pinned in `flake.lock`) and compiled to WASM alongside the small wrapper in
`wasm/apriltag_wasm.c`.

```bash
git clone https://github.com/rossng/apriltag-mobile.git
cd apriltag-mobile

# Build the WASM module and start the dev server:
nix run .#serve

# Or build the WASM artifacts only:
nix run .#build

# Or get a shell with emcc, node, and npm available:
nix develop
```

To test the app on a phone, open `/test-tags/` on another screen (e.g.
<http://localhost:3000/test-tags/>; it isn't linked from the app). It shows a
page of tags, with controls for the family, size and IDs, each of which can be
randomised. Its settings are kept in the URL.

To bump the apriltag library version:

```bash
nix flake update apriltag-src
```

## License

The mobile app code, including the WebAssembly wrapper in `wasm/`, is MIT
licensed. The compiled WebAssembly module links in the BSD-2-Clause licensed
[AprilTag](https://github.com/AprilRobotics/apriltag) library (Regents of the
University of Michigan); see [`wasm/NOTICE.md`](./wasm/NOTICE.md). The build
copies its license text into `public/` so the deployed site ships it alongside
the WASM binary.
