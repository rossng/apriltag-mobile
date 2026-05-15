# AprilTag Mobile Detector

A mobile-first web app for detecting AprilTags using your device's camera. The
detector is the upstream [AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag)
C library compiled to WebAssembly via Emscripten, driven from TypeScript /
[Lit](https://lit.dev/).

## Local Development

The whole build is driven by Nix. `apriltag-src` is fetched as a flake input
(pinned in `flake.lock`) and compiled to WASM alongside the wrapper sources in
`wasm/src/`.

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

To bump the apriltag library version:

```bash
nix flake update apriltag-src
```

## License

The mobile app code is MIT licensed. The compiled WebAssembly module links in
two BSD-licensed upstream projects:

- [AprilTag](https://github.com/AprilRobotics/apriltag) (BSD-2-Clause) — Regents
  of the University of Michigan
- [apriltag-js-standalone](https://github.com/arenaxr/apriltag-js-standalone)
  wrapper (BSD-3-Clause) — CONIX Research Center

See [`wasm/NOTICE.md`](./wasm/NOTICE.md) for provenance details and pointers to
both license texts. The build copies both into `public/` so the deployed site
ships them alongside the WASM binary.
