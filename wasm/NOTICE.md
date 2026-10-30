# Third-party code notice

The WebAssembly module shipped by this project links
[AprilRobotics/apriltag](https://github.com/AprilRobotics/apriltag). The main library is not
vendored in this repository — it is fetched as the `apriltag-src` flake input
(pinned in `flake.lock`) and its compiled object code is linked into the
`apriltag_wasm.wasm` artifact this project ships, together with this
project's own wrapper, `wasm/apriltag_wasm.c`.

- Copyright (C) 2013-2016, The Regents of The University of Michigan
- SPDX-License-Identifier: `BSD-2-Clause`
- License text: `LICENSE.apriltag`, installed by `nix run .#build` alongside
  the WASM artifacts. Upstream copy:
  <https://github.com/AprilRobotics/apriltag/blob/master/LICENSE.md>

The license permits redistribution in source and binary form provided the
copyright notice and license text are retained.

## Legacy tag25h7 family

`wasm/tag25h7.c` adapts the codebook from
[swatbotics/apriltag](https://github.com/swatbotics/apriltag/blob/427a42ce24578e0fcc483eaf35794b986352070d/core/tag25h7.c)
(revision `427a42ce24578e0fcc483eaf35794b986352070d`) to the AprilTag 3 bit layout.
Its source license is reproduced below and shipped with the WASM artifacts:

```text
/* (C) 2013-2015, The Regents of The University of Michigan
All rights reserved.

This software may be available under alternative licensing
terms. Contact Edwin Olson, ebolson@umich.edu, for more information.

   An unlimited license is granted to use, adapt, modify, or embed the 2D
barcodes into any medium.

   Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies,
either expressed or implied, of the FreeBSD Project.
 */
```
