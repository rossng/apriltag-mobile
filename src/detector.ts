import { MainModule } from './apriltag/apriltag_wasm';

export interface Detection {
  id: number;
  corners: Array<{ x: number; y: number }>;
  center: { x: number; y: number };
  size?: number;
  pose?: {
    t: [number, number, number];
    e: number;
  };
}

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Find marker IDs that appear more than once in a set of detections.
 */
export function findDuplicateIds(detections: Detection[]): number[] {
  const counts = new Map<number, number>();
  for (const d of detections) {
    counts.set(d.id, (counts.get(d.id) ?? 0) + 1);
  }
  const duplicates: number[] = [];
  for (const [id, count] of counts) {
    if (count > 1) duplicates.push(id);
  }
  return duplicates.sort((a, b) => a - b);
}

export class AprilTagDetector {
  private detector: MainModule;
  private initialized = false;
  private currentFamily = 'tag36h11';

  constructor(detector: MainModule) {
    this.detector = detector;
  }

  /**
   * Initialize the detector. Must be called before using other methods.
   */
  init(): void {
    if (this.initialized) return;

    this.detector._atagjs_init();
    this.initialized = true;
  }

  /**
   * Switch to a different AprilTag family
   * @param family The tag family to use (e.g., "tag36h11", "tag25h9")
   * @returns true if successful, false otherwise
   */
  setFamily(family: string): boolean {
    this.ensureInitialized();

    const setFamilyFn = this.detector.cwrap('atagjs_set_family', 'number', [
      'string',
    ]);
    const result = setFamilyFn(family);

    if (result === 0) {
      this.currentFamily = family;
      return true;
    }
    return false;
  }

  /**
   * Get the current tag family
   */
  getFamily(): string {
    return this.currentFamily;
  }

  /**
   * Detect AprilTags in a grayscale image
   * @param grayData Grayscale image data (1 byte per pixel)
   * @param dimensions Image dimensions
   * @returns Array of detected tags
   */
  detect(grayData: Uint8Array, dimensions: ImageDimensions): Detection[] {
    this.ensureInitialized();

    const { width, height } = dimensions;

    // Allocate buffer for image
    const imgBuffer = this.detector._atagjs_set_img_buffer(
      width,
      height,
      width
    );

    if (width * height !== grayData.length) {
      throw new Error(
        `Image data size mismatch. Expected ${width * height} bytes, got ${
          grayData.length
        }`
      );
    }

    // Copy grayscale data to WASM memory
    this.detector.HEAPU8.set(grayData, imgBuffer);

    // Perform detection
    const strJsonPtr = this.detector._atagjs_detect();

    // Parse results
    const strJsonLen = this.detector.getValue(strJsonPtr, 'i32');
    if (strJsonLen === 0) {
      return [];
    }

    const strJsonStrPtr = this.detector.getValue(strJsonPtr + 4, 'i32');
    const strJsonView = new Uint8Array(
      this.detector.HEAPU8.buffer,
      strJsonStrPtr,
      strJsonLen
    );

    let detectionsJson = '';
    for (let i = 0; i < strJsonLen; i++) {
      detectionsJson += String.fromCharCode(strJsonView[i]);
    }

    const detections = JSON.parse(detectionsJson);

    if (!Array.isArray(detections)) {
      throw new Error('Invalid detections format');
    }

    return detections;
  }

  /**
   * Detect AprilTags from an ImageData object
   * @param imageData The image data from canvas
   * @returns Array of detected tags
   */
  detectFromImageData(imageData: ImageData): Detection[] {
    const grayData = this.convertToGrayscale(imageData);
    return this.detect(grayData, {
      width: imageData.width,
      height: imageData.height,
    });
  }

  /**
   * Convert RGBA image data to grayscale
   * @param imageData The RGBA image data
   * @returns Grayscale image data
   */
  private convertToGrayscale(imageData: ImageData): Uint8Array {
    const data = imageData.data;
    const grayData = new Uint8Array(imageData.width * imageData.height);

    for (let i = 0; i < data.length; i += 4) {
      // Simple average for grayscale conversion
      const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      grayData[i / 4] = gray;
    }

    return grayData;
  }

  /**
   * Check if the detector is ready to use
   */
  isReady(): boolean {
    return this.initialized;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Detector not initialized. Call init() first.');
    }
  }

  /**
   * Get available tag families
   */
  static getAvailableFamilies() {
    return [
      { id: 'tag36h11', name: '36h11', tagCount: 587 },
      { id: 'tag25h9', name: '25h9', tagCount: 35 },
      { id: 'tag16h5', name: '16h5', tagCount: 30 },
      { id: 'tagStandard41h12', name: 'Standard 41h12', tagCount: 2115 },
      { id: 'tagStandard52h13', name: 'Standard 52h13', tagCount: 48714 },
      { id: 'tagCircle21h7', name: 'Circle 21h7', tagCount: 38 },
      { id: 'tagCircle49h12', name: 'Circle 49h12', tagCount: 65535 },
      { id: 'tagCustom48h12', name: 'Custom 48h12', tagCount: 42211 },
    ];
  }
}
