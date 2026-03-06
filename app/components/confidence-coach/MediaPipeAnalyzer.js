import { FilesetResolver, FaceLandmarker, PoseLandmarker, HandLandmarker } from '@mediapipe/tasks-vision';

let faceLandmarker = null;
let poseLandmarker = null;
let handLandmarker = null;
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
    if (faceLandmarker && poseLandmarker && handLandmarker) return;
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

        handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                delegate: "CPU"
            },
            runningMode: "VIDEO",
            numHands: 2
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

    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];
    const leftKnee = poseLandmarks[25];
    const rightKnee = poseLandmarks[26];

    const hipsVisible = leftHip?.visibility > 0.5 || rightHip?.visibility > 0.5;
    const kneesVisible = leftKnee?.visibility > 0.5 || rightKnee?.visibility > 0.5;

    if (!hipsVisible) return "unknown";

    if (kneesVisible) {
        const leftHipY = leftHip?.y || 0;
        const rightHipY = rightHip?.y || 0;
        const leftKneeY = leftKnee?.y || 0;
        const rightKneeY = rightKnee?.y || 0;

        const hipY = (leftHipY + rightHipY) / 2;
        const kneeY = (leftKneeY + rightKneeY) / 2;

        const yDiff = kneeY - hipY;
        if (yDiff > 0.15) return "standing";
    }

    return "sitting";
}

function evaluateEmotion(faceBlendshapes) {
    if (!faceBlendshapes || faceBlendshapes.length === 0) return "neutral";

    const getScore = (name) => {
        const shape = faceBlendshapes.find(b => b.categoryName === name);
        return shape ? shape.score : 0;
    };

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const browDownLeft = getScore("browDownLeft");
    const browDownRight = getScore("browDownRight");

    if (smileLeft > 0.4 && smileRight > 0.4) return "positive";
    if (browDownLeft > 0.4 && browDownRight > 0.4) return "tense";

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
            let handResult = null;
            let posture = "unknown";
            let emotion = "neutral";

            if (faceLandmarker) {
                faceResult = faceLandmarker.detectForVideo(videoElement, currentTimeMs);
                if (faceResult && faceResult.faceBlendshapes && faceResult.faceBlendshapes.length > 0) {
                    emotion = evaluateEmotion(faceResult.faceBlendshapes[0].categories);
                }
            }
            if (poseLandmarker) {
                poseResult = poseLandmarker.detectForVideo(videoElement, currentTimeMs);
                if (poseResult && poseResult.landmarks && poseResult.landmarks.length > 0) {
                    posture = determinePosture(poseResult.landmarks[0]);
                }
            }
            if (handLandmarker) {
                handResult = handLandmarker.detectForVideo(videoElement, currentTimeMs);
            }

            // Fire callback
            onResults({
                face: faceResult,
                pose: poseResult,
                hand: handResult,
                posture,
                emotion,
                handsVisible: handResult?.landmarks?.length > 0
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
