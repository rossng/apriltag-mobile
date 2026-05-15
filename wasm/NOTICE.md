# Third-party code notice

The WebAssembly module shipped by this project links two upstream
BSD-licensed projects.

## Emscripten wrapper — `wasm/src/`

`apriltag_js.{c,h}` and `str_json.{c,h}` are vendored from
[arenaxr/apriltag-js-standalone](https://github.com/arenaxr/apriltag-js-standalone)
at commit `f746d89df9f5ca55a8d975372a68c9a309e3ae20`.

- Copyright (c) 2020, The CONIX Research Center (Wiselab CMU)
- SPDX-License-Identifier: `BSD-3-Clause`
- License text: [`LICENSE.apriltag-js-standalone`](./LICENSE.apriltag-js-standalone)

## AprilTag detector library

[AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag) is not
vendored in this repository — it is fetched as the `apriltag-src` flake input
(pinned in `flake.lock`) and its compiled object code is linked into the
`apriltag_wasm.wasm` artifact this project ships.

- Copyright (C) 2013-2016, The Regents of The University of Michigan
- SPDX-License-Identifier: `BSD-2-Clause`
- License text: `LICENSE.apriltag`, installed by `nix run .#build` alongside
  the WASM artifacts. Upstream copy:
  <https://github.com/AprilRobotics/apriltag/blob/master/LICENSE.md>

Both licenses permit redistribution in source and binary form provided the
copyright notice and license text are retained.
