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

// Selects the tag family to detect. Returns 0, or -1 for an unknown name.
EMSCRIPTEN_KEEPALIVE int atag_set_family(const char *name) {
    for (size_t i = 0; i < sizeof FAMILIES / sizeof *FAMILIES; i++) {
        if (strcmp(FAMILIES[i].name, name) != 0) continue;
        if (!detector) detector = apriltag_detector_create();
        if (family) {
            apriltag_detector_remove_family(detector, family);
            family_def_in_use->destroy(family);
        }
        family_def_in_use = &FAMILIES[i];
        family = family_def_in_use->create();
        apriltag_detector_add_family_bits(detector, family, 2);
        return 0;
    }
    return -1;
}

// Returns a buffer large enough for a width x height RGBA image.
EMSCRIPTEN_KEEPALIVE uint8_t *atag_image(int width, int height) {
    image = realloc(image, (size_t)width * height * 4);
    return image;
}

EMSCRIPTEN_KEEPALIVE double *atag_results(void) { return results; }

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
