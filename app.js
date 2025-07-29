class AprilTagDetector {
    constructor() {
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvasElement');
        this.ctx = this.canvas.getContext('2d');
        this.stream = null;
        this.currentFamily = 'tag36h11';
        this.detector = null;
        this.isProcessing = false;
        
        this.init();
    }

    async init() {
        await this.initializeCamera();
        this.setupEventListeners();
        await this.loadAprilTagLibrary();
    }

    async initializeCamera() {
        try {
            this.showStatus('Requesting camera permission...');
            
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            this.video.addEventListener('loadedmetadata', () => {
                this.hideStatus();
            });

        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showStatus('Camera access denied. Please allow camera permissions and refresh.');
        }
    }

    setupEventListeners() {
        // Menu functionality
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('overflowMenu');
            if (!e.target.closest('.menu-button') && !e.target.closest('.overflow-menu')) {
                menu.classList.remove('active');
            }
        });

        // Family selection
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectFamily(e.target.dataset.family);
                document.getElementById('overflowMenu').classList.remove('active');
            });
        });

        // Prevent video from pausing on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.stream) {
                this.video.srcObject = this.stream;
            }
        });
    }

    async loadAprilTagLibrary() {
        try {
            this.showStatus('Loading AprilTag detection library...');
            
            // Wait for the apriltag library to be available
            if (typeof Apriltag === 'undefined') {
                throw new Error('AprilTag library not loaded');
            }

            // Initialize the detector
            await this.initializeDetector();
            
        } catch (error) {
            console.error('Error loading AprilTag library:', error);
            this.showStatus('Failed to load AprilTag library. Please refresh and try again.');
        }
    }

    async initializeDetector() {
        return new Promise((resolve, reject) => {
            try {
                if (this.detector) {
                    // No destroy method needed for this implementation
                    this.detector = null;
                }
                
                // Create new detector instance with callback
                this.detector = new Apriltag(() => {
                    console.log('AprilTag detector ready');
                    
                    // Configure detector options
                    this.detector.set_max_detections(0); // Return all detections
                    this.detector.set_return_pose(1); // Return pose estimates
                    this.detector.set_return_solutions(0); // Don't return alternative solutions
                    
                    // Set default camera parameters (will be overridden if available)
                    this.detector.set_camera_info(800, 800, 320, 240);
                    
                    this.hideStatus();
                    resolve();
                });
                
            } catch (error) {
                console.error('Error initializing detector:', error);
                reject(error);
            }
        });
    }

    selectFamily(family) {
        // Update UI
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-family="${family}"]`).classList.add('active');
        
        // Update current family (note: the real AprilTag library only supports tag36h11)
        this.currentFamily = family;
        
        // Show warning if trying to use unsupported family
        if (family !== 'tag36h11') {
            this.showStatus(`Note: Only tag36h11 family is currently supported by the detector.`);
            setTimeout(() => this.hideStatus(), 3000);
        }
    }

    async captureImage() {
        if (this.isProcessing) return;
        
        try {
            this.isProcessing = true;
            this.showStatus('Capturing image...');

            // Set canvas size to match video
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            // Draw video frame to canvas
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            // Switch to canvas view
            this.video.style.display = 'none';
            this.canvas.style.display = 'block';
            document.getElementById('backButton').classList.add('visible');

            // Process the image
            await this.processImage();

        } catch (error) {
            console.error('Error capturing image:', error);
            this.showStatus('Failed to capture image. Please try again.');
        } finally {
            this.isProcessing = false;
        }
    }

    async processImage() {
        try {
            this.showStatus('Detecting AprilTags...');

            if (!this.detector) {
                throw new Error('Detector not initialized');
            }

            // Get image data
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            // Convert to grayscale
            const grayData = this.convertToGrayscale(imageData);
            
            // Run detection using the real AprilTag API
            const detections = await this.detector.detect(grayData, this.canvas.width, this.canvas.height);

            // Draw detections
            this.drawDetections(detections);
            
            // Show detection info
            this.showDetectionInfo(detections);
            
            this.hideStatus();

        } catch (error) {
            console.error('Error processing image:', error);
            this.showStatus('Failed to detect AprilTags. Please try again.');
        }
    }

    convertToGrayscale(imageData) {
        const data = imageData.data;
        const grayData = new Uint8Array(imageData.width * imageData.height);
        
        for (let i = 0; i < data.length; i += 4) {
            // Convert RGB to grayscale using luminance formula (same as in the AprilTag documentation)
            const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
            grayData[i / 4] = gray;
        }
        
        return grayData;
    }

    drawDetections(detections) {
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.fillStyle = '#ff0000';
        this.ctx.lineWidth = 3;
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';

        detections.forEach(detection => {
            const corners = detection.corners;
            
            // Draw tag outline
            this.ctx.beginPath();
            this.ctx.moveTo(corners[0].x, corners[0].y);
            for (let i = 1; i < corners.length; i++) {
                this.ctx.lineTo(corners[i].x, corners[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();

            // Draw top-left corner as red circle
            this.ctx.beginPath();
            this.ctx.arc(corners[0].x, corners[0].y, 8, 0, 2 * Math.PI);
            this.ctx.fill();

            // Draw tag ID
            const center = detection.center;
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillText(detection.id.toString(), center.x, center.y + 8);
            this.ctx.fillStyle = '#ff0000';
        });
    }

    showDetectionInfo(detections) {
        const infoDiv = document.getElementById('detectionInfo');
        
        if (detections.length === 0) {
            infoDiv.innerHTML = '<div class="detection-item">No AprilTags detected</div>';
        } else {
            const items = detections.map(detection => {
                let html = `
                    <div class="detection-item">
                        <strong>Tag ID:</strong> ${detection.id}<br>
                        <strong>Size:</strong> ${detection.size ? (detection.size * 1000).toFixed(1) + 'mm' : 'Unknown'}<br>
                        <strong>Center:</strong> (${Math.round(detection.center.x)}, ${Math.round(detection.center.y)})<br>
                `;
                
                // Add pose information if available
                if (detection.pose) {
                    const t = detection.pose.t;
                    const distance = Math.sqrt(t[0]*t[0] + t[1]*t[1] + t[2]*t[2]);
                    html += `<strong>Distance:</strong> ${(distance * 1000).toFixed(1)}mm<br>`;
                    html += `<strong>Pose Error:</strong> ${detection.pose.e.toFixed(6)}`;
                }
                
                html += '</div>';
                return html;
            }).join('');
            infoDiv.innerHTML = items;
        }
        
        infoDiv.classList.add('visible');
    }

    backToCamera() {
        this.video.style.display = 'block';
        this.canvas.style.display = 'none';
        document.getElementById('backButton').classList.remove('visible');
        document.getElementById('detectionInfo').classList.remove('visible');
    }

    showStatus(message) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.classList.add('visible');
    }

    hideStatus() {
        const status = document.getElementById('status');
        status.classList.remove('visible');
    }
}

// Global functions for HTML onclick handlers
function toggleMenu() {
    const menu = document.getElementById('overflowMenu');
    menu.classList.toggle('active');
}

function captureImage() {
    if (window.detector) {
        window.detector.captureImage();
    }
}

function backToCamera() {
    if (window.detector) {
        window.detector.backToCamera();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.detector = new AprilTagDetector();
});