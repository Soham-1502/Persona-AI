import { FilesetResolver, FaceLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';

let faceLandmarker = null;
let poseLandmarker = null;
let isInitializing = false;

// Subdue MediaPipe WASM informational logs
if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) {
            return;
        }
        originalConsoleError(...args);
    };

    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
        if (typeof args[0] === 'string' && (args[0].includes('XNNPACK') || args[0].includes('WASM'))) {
            return;
        }
        originalConsoleWarn(...args);
    };
}

// Load models singleton
export async function initMediaPipeModels() {
    if (faceLandmarker && poseLandmarker) return;
    if (isInitializing) {
        // Simple polling if already initializing
        while (isInitializing) {
            await new Promise(r => setTimeout(r, 100));
        }
        return;
    }

    isInitializing = true;
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "CPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        });

        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                delegate: "CPU"
            },
            runningMode: "VIDEO",
            numPoses: 1
        });
    } catch (err) {
        console.error("MediaPipe initialization error:", err);
    } finally {
        isInitializing = false;
    }
}

// Sitting vs Standing heuristic
function determinePosture(poseLandmarks) {
    if (!poseLandmarks || poseLandmarks.length === 0) return "unknown";

    // MediaPipe tracks 33 points. We care about hips (23, 24) and knees (25, 26)
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];
    const leftKnee = poseLandmarks[25];
    const rightKnee = poseLandmarks[26];

    // If we only see upper body (knees not visible), we assume Sitting for desktop use cases usually,
    // but let's check visibility thresholds (MediaPipe gives visibility score 0-1)
    const hipsVisible = leftHip?.visibility > 0.5 || rightHip?.visibility > 0.5;
    const kneesVisible = leftKnee?.visibility > 0.5 || rightKnee?.visibility > 0.5;

    if (!hipsVisible) return "unknown";

    if (kneesVisible) {
        // Average Y coordinates (Y grows downwards 0 to 1)
        const hipY = ((leftHip?.y || 0) + (rightHip?.y || 0)) / (leftHip && rightHip ? 2 : 1);
        const kneeY = ((leftKnee?.y || 0) + (rightKnee?.y || 0)) / (leftKnee && rightKnee ? 2 : 1);

        // If knee is significantly lower than hip down the screen, standing.
        const yDiff = kneeY - hipY;
        if (yDiff > 0.2) return "standing";
    }

    return "sitting"; // Default assumption if hips are seen but knees aren't, or knees are leveled
}

// Openness heuristic (Wrist vs Shoulder distance)
function evaluateOpenness(poseLandmarks) {
    if (!poseLandmarks || poseLandmarks.length === 0) return "unknown";

    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftWrist = poseLandmarks[15];
    const rightWrist = poseLandmarks[16];

    // Check visibility
    if (
        (leftShoulder?.visibility < 0.5 && rightShoulder?.visibility < 0.5) ||
        (leftWrist?.visibility < 0.5 && rightWrist?.visibility < 0.5)
    ) {
        return "unknown";
    }

    const shoulderDist = Math.abs((leftShoulder?.x || 0) - (rightShoulder?.x || 0));
    const wristDist = Math.abs((leftWrist?.x || 0) - (rightWrist?.x || 0));

    // Guard against divide by 0 or completely sideways angle
    if (shoulderDist < 0.05) return "unknown";

    const ratio = wristDist / shoulderDist;

    if (ratio >= 1.2) {
        return "open";
    } else if (ratio < 0.5) {
        return "closed";
    }

    return "neutral";
}

// Helper to continuously run tracking
export function startMediaPipeStream(videoElement, onResults) {
    let active = true;
    let lastVideoTime = -1;

    async function detectFrame() {
        if (!active || !videoElement || videoElement.readyState < 2) {
            if (active) requestAnimationFrame(detectFrame);
            return;
        }

        const currentTimeMs = performance.now();

        if (videoElement.currentTime !== lastVideoTime) {
            lastVideoTime = videoElement.currentTime;

            let faceResult = null;
            let poseResult = null;
            let posture = "unknown";
            let openness = "unknown";

            if (faceLandmarker) {
                faceResult = faceLandmarker.detectForVideo(videoElement, currentTimeMs);
            }
            if (poseLandmarker) {
                poseResult = poseLandmarker.detectForVideo(videoElement, currentTimeMs);
                if (poseResult && poseResult.landmarks && poseResult.landmarks.length > 0) {
                    posture = determinePosture(poseResult.landmarks[0]);
                    openness = evaluateOpenness(poseResult.landmarks[0]);
                }
            }

            // Fire callback
            onResults({
                face: faceResult,
                pose: poseResult,
                posture,
                openness
            });
        }

        if (active) {
            requestAnimationFrame(detectFrame);
        }
    }

    // Assure initialization before starting loop
    initMediaPipeModels().then(() => {
        if (active) detectFrame();
    });

    return () => {
        active = false;
    };
}
