// Minimal WebAssembly interface to the AprilTag detector.
//
// JS writes an RGBA image into the buffer from atag_image(), calls
// atag_detect(), then reads ATAG_STRIDE doubles per detection from
// atag_results(): id, centre (x, y), then the four corners (x, y).

#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#include "apriltag.h"
#include "tag16h5.h"
#include "tag25h9.h"
#include "tag36h11.h"
#include "tagCircle21h7.h"
#include "tagCircle49h12.h"
#include "tagCustom48h12.h"
#include "tagStandard41h12.h"
#include "tagStandard52h13.h"

#define ATAG_STRIDE 11

typedef struct {
    const char *name;
    apriltag_family_t *(*create)(void);
    void (*destroy)(apriltag_family_t *);
} family_def;

#define FAMILY(name) {#name, name##_create, name##_destroy}

static const family_def FAMILIES[] = {
    FAMILY(tag36h11),         FAMILY(tag25h9),          FAMILY(tag16h5),
    FAMILY(tagStandard41h12), FAMILY(tagStandard52h13), FAMILY(tagCircle21h7),
    FAMILY(tagCircle49h12),   FAMILY(tagCustom48h12),
};

static apriltag_detector_t *detector;
static const family_def *family_def_in_use;
static apriltag_family_t *family;
static uint8_t *image;
static double *results;

static const family_def *find_family(const char *name) {
    for (size_t i = 0; i < sizeof FAMILIES / sizeof *FAMILIES; i++) {
        if (strcmp(FAMILIES[i].name, name) == 0) return &FAMILIES[i];
    }
    return NULL;
}

// Selects the tag family to detect. Returns 0, or -1 for an unknown name.
EMSCRIPTEN_KEEPALIVE int atag_set_family(const char *name) {
    const family_def *def = find_family(name);
    if (!def) return -1;
    if (!detector) detector = apriltag_detector_create();
    if (family) {
        apriltag_detector_remove_family(detector, family);
        family_def_in_use->destroy(family);
    }
    family_def_in_use = def;
    family = def->create();
    apriltag_detector_add_family_bits(detector, family, 2);
    return 0;
}

// Returns a buffer large enough for a width x height RGBA image.
EMSCRIPTEN_KEEPALIVE uint8_t *atag_image(int width, int height) {
    image = realloc(image, (size_t)width * height * 4);
    return image;
}

EMSCRIPTEN_KEEPALIVE double *atag_results(void) { return results; }

// Fills the square ring of cells that is `width` cells across.
static void fill_ring(int size, int width, uint8_t value) {
    if (width > size) return;
    int start = (size - width) / 2, end = start + width - 1;
    for (int i = start; i <= end; i++) {
        image[start * size + i] = image[end * size + i] = value;
        image[i * size + start] = image[i * size + end] = value;
    }
}

// Draws a tag into the image buffer, one byte per cell: 0 for black, 255 for
// white, or 128 where the tag has no cell (e.g. the corners of circular
// tags). Returns the tag's width in cells, or -1 for an unknown tag.
EMSCRIPTEN_KEEPALIVE int atag_render(const char *name, int id) {
    const family_def *def = find_family(name);
    if (!def) return -1;
    apriltag_family_t *fam = def->create();
    int size = -1;
    if (id >= 0 && (uint32_t)id < fam->ncodes) {
        size = fam->total_width;
        atag_image(size, size);
        memset(image, 128, (size_t)size * size);
        // The border is black inside white, or white inside black when
        // reversed; data bits may then overwrite the outer ring.
        uint8_t inner = fam->reversed_border ? 255 : 0;
        fill_ring(size, fam->width_at_border, inner);
        fill_ring(size, fam->width_at_border + 2, 255 - inner);
        int start = (size - fam->width_at_border) / 2;
        uint64_t code = fam->codes[id];
        for (uint32_t i = 0; i < fam->nbits; i++) {
            int bit = (code >> (fam->nbits - i - 1)) & 1;
            image[(fam->bit_y[i] + start) * size + fam->bit_x[i] + start] = bit ? 255 : 0;
        }
    }
    def->destroy(fam);
    return size;
}

// Detects tags in the image buffer, overwriting it with its greyscale
// version. Returns the number of detections written to atag_results().
EMSCRIPTEN_KEEPALIVE int atag_detect(int width, int height) {
    int pixels = width * height;
    for (int i = 0; i < pixels; i++) {
        const uint8_t *p = image + 4 * i;
        image[i] = (p[0] + p[1] + p[2] + 1) / 3;
    }

    image_u8_t grey = {.width = width, .height = height, .stride = width, .buf = image};
    zarray_t *detections = apriltag_detector_detect(detector, &grey);
    int n = zarray_size(detections);
    results = realloc(results, sizeof(double) * ATAG_STRIDE * (n ? n : 1));

    for (int i = 0; i < n; i++) {
        apriltag_detection_t *det;
        zarray_get(detections, i, &det);
        double *r = results + ATAG_STRIDE * i;
        r[0] = det->id;
        r[1] = det->c[0];
        r[2] = det->c[1];
        for (int j = 0; j < 4; j++) {
            r[3 + 2 * j] = det->p[j][0];
            r[4 + 2 * j] = det->p[j][1];
        }
    }

    apriltag_detections_destroy(detections);
    return n;
}
