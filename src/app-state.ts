export enum AppMode {
  LIVE = 'live',
  PAUSED = 'paused', 
  RECORDING = 'recording',
  VIEWING_RECORDED = 'viewing_recorded',
  IMAGE_MODE = 'image_mode'
}

export interface CameraState {
  isReady: boolean;
  stream: MediaStream | null;
  dimensions: { width: number; height: number };
}

export interface DetectionState {
  detections: import('./detector').Detection[];
  frozenFrame: ImageData | null;
  selectedImage: ImageData | null;
  isProcessing: boolean;
}

export interface RecordingState {
  isActive: boolean;
  tagIds: number[];
  isViewing: boolean;
}

export interface StatusState {
  message: string | null;
  fadeOutTime?: number;
}

export interface AppState {
  mode: AppMode;
  currentFamily: string;
  camera: CameraState;
  detection: DetectionState;
  recording: RecordingState;
  status: StatusState;
}

export const createInitialState = (): AppState => ({
  mode: AppMode.LIVE,
  currentFamily: localStorage.getItem("selectedFamily") || "tag36h11",
  camera: {
    isReady: false,
    stream: null,
    dimensions: { width: 0, height: 0 }
  },
  detection: {
    detections: [],
    frozenFrame: null,
    selectedImage: null,
    isProcessing: false
  },
  recording: {
    isActive: false,
    tagIds: [],
    isViewing: false
  },
  status: {
    message: null
  }
});

export const isValidModeTransition = (from: AppMode, to: AppMode): boolean => {
  switch (from) {
    case AppMode.LIVE:
      return [AppMode.PAUSED, AppMode.RECORDING, AppMode.IMAGE_MODE].includes(to);
    
    case AppMode.PAUSED:
      return [AppMode.LIVE, AppMode.IMAGE_MODE].includes(to);
    
    case AppMode.RECORDING:
      return [AppMode.VIEWING_RECORDED, AppMode.LIVE].includes(to);
    
    case AppMode.VIEWING_RECORDED:
      return [AppMode.LIVE, AppMode.RECORDING].includes(to);
    
    case AppMode.IMAGE_MODE:
      return [AppMode.LIVE].includes(to);
    
    default:
      return false;
  }
};