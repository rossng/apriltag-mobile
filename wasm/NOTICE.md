# Third-party code notice

This directory contains code that is built into the WebAssembly module
distributed by this project. Two upstream projects are involved.

## `wasm/src/` — Emscripten wrapper

The C wrapper sources (`apriltag_js.c`, `apriltag_js.h`, `str_json.c`,
`str_json.h`) are vendored from
[arenaxr/apriltag-js-standalone](https://github.com/arenaxr/apriltag-js-standalone)
at commit `f746d89df9f5ca55a8d975372a68c9a309e3ae20`.

- Copyright (c) 2020, The CONIX Research Center (Wiselab CMU)
- SPDX-License-Identifier: `BSD-3-Clause`
- License text: [`LICENSE.apriltag-js-standalone`](./LICENSE.apriltag-js-standalone)

## `wasm/apriltag/` — AprilTag detector library (build-time)

The detector itself is built from
[AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag), fetched as
a Nix flake input (`apriltag-src`) and pinned via `flake.lock`. It is not
vendored in this repository, but its compiled object code is linked into the
`apriltag_wasm.wasm` artifact that this project ships.

- Copyright (C) 2013-2016, The Regents of The University of Michigan
- SPDX-License-Identifier: `BSD-2-Clause`
- License text: [`LICENSE.apriltag`](./LICENSE.apriltag) (installed by `nix run .#build`
  alongside the WASM artifacts; upstream copy at
  <https://github.com/AprilRobotics/apriltag/blob/master/LICENSE.md>)

Both licenses permit redistribution in source and binary form provided the
copyright notice and license text are retained.
