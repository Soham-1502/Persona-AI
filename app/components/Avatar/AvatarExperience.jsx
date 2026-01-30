"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, useAnimations, Html } from "@react-three/drei";
import { Suspense, Component, useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import * as THREE from "three";
import { FBXLoader } from "three-stdlib";

// Load the FBX File
const AVATAR_URL = "/businessman/source/yrafaceanimation.fbx";

function AvatarModel({ isTalking }) {
    const group = useRef(null);

    // FBX Loader
    const fbx = useLoader(FBXLoader, AVATAR_URL);

    // Extract animations
    const { actions, names } = useAnimations(fbx.animations, group);

    // Load Textures Manually & Configure Correctly
    const textureLoader = new THREE.TextureLoader();
    const eyeTextureL = textureLoader.load("/businessman/textures/Std_Eye_L_Diffuse.png");
    const eyeTextureR = textureLoader.load("/businessman/textures/Std_Eye_R_Diffuse.png");
    const headTexture = textureLoader.load("/businessman/textures/Std_Skin_Head_Diffuse.png");
    const bodyTexture = textureLoader.load("/businessman/textures/Std_Skin_Body_Diffuse.png");

    // Fix Texture Encoding
    [eyeTextureL, eyeTextureR, headTexture, bodyTexture].forEach(t => {
        t.colorSpace = THREE.SRGBColorSpace;
    });

    useEffect(() => {
        if (!fbx) return;

        fbx.traverse((child) => {
            // 1. MATERIAL FIXES
            if (child.isMesh) {
                const mesh = child;
                mesh.castShadow = true;
                mesh.receiveShadow = false; // Disable self-shadow to stop black artifacts

                if (mesh.material) {
                    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    mats.forEach((mat) => {
                        const m = mat;
                        const name = m.name.toLowerCase();

                        // Base Settings
                        m.transparent = false;
                        m.side = THREE.FrontSide;
                        m.depthWrite = true;
                        m.roughness = 0.6;
                        m.metalness = 0.1;
                        m.emissive = new THREE.Color(0x222222); // Prevent pure black shadows
                        m.emissiveIntensity = 0.15;

                        // EYE FIX
                        if (name.includes("cornea") || name.includes("occlusion") || name.includes("tearline")) {
                            m.transparent = true;
                            m.opacity = 0;
                            m.depthWrite = false;
                        } else if (name.includes("eye") && !name.includes("lash")) {
                            m.color = new THREE.Color(0xffffff);
                            m.emissive = new THREE.Color(0x000000);
                            m.map = (name.includes("left") || name.includes("_l_")) ? eyeTextureL : eyeTextureR;
                            m.needsUpdate = true;
                        }

                        // SKIN/BODY FORCE
                        if ((name.includes("head") || name.includes("face")) && !m.map) {
                            m.map = headTexture;
                            m.needsUpdate = true;
                        }
                        if (name.includes("body") && !m.map) {
                            m.map = bodyTexture;
                            m.needsUpdate = true;
                        }

                        // HAIR/LASHES
                        if (name.includes("hair") || name.includes("lash")) {
                            m.transparent = true;
                            m.alphaTest = 0.5; // Cutout
                            m.side = THREE.DoubleSide;
                        }
                    });
                }
            }
        });

    }, [fbx, eyeTextureL, eyeTextureR, headTexture, bodyTexture]);

    // ANIMATION LOGIC - "Pause at Frame 0" Method
    useEffect(() => {
        if (names.length === 0) return;
        const mainAnim = names[0];
        const action = actions[mainAnim];

        if (!action) return;

        if (isTalking) {
            // PLAY MODE
            action.paused = false;
            action.setEffectiveTimeScale(1);
            action.play();
        } else {
            // PAUSE AT FRAME 0 MODE (Natural Idle)
            action.reset();
            action.play();
            action.paused = true;
        }
    }, [actions, names, isTalking]);

    // PROCEDURAL IDLE
    useFrame((state) => {
        if (!isTalking && group.current) {
            group.current.position.y = -2.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.005;
        }
    });

    return (
        <group ref={group} rotation={[-Math.PI / 2, 0, 0]}>
            <primitive
                object={fbx}
                scale={0.022}
                position={[0, -2.0, 0]}
            />

            <Html fullscreen style={{ pointerEvents: 'none', zIndex: 100 }}>
                <div className="absolute top-4 right-4 flex flex-col gap-1 p-3 bg-black/70 backdrop-blur-md rounded-xl w-40 max-h-64 overflow-y-auto border border-white/10 shadow-xl pointer-events-auto">
                    <p className="text-xs text-secondary-foreground font-bold mb-2 uppercase tracking-wider text-center border-b border-white/10 pb-1">Gestures</p>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-white/50">Status:</span>
                        <span className={`text-[9px] px-1 rounded ${isTalking ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'}`}>
                            {isTalking ? "Talking" : "Idle"}
                        </span>
                    </div>
                </div>
            </Html>
        </group>
    );
}

// Fallback & Error Boundary
function FallbackAvatar() {
    return (
        <group position={[0, -2, 0]}>
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />
                <meshStandardMaterial color="#4C1D95" roughness={0.3} />
            </mesh>
        </group>
    );
}

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full relative">
                    <div className="absolute top-6 left-6 z-20 bg-red-500/20 backdrop-blur-md p-3 rounded-xl border border-red-500/30 max-w-sm">
                        <p className="text-xs text-red-200 font-bold mb-1">Load Failed</p>
                        <p className="text-[10px] text-red-200/70">{this.state.error?.message}</p>
                    </div>
                    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} className="w-full h-full">
                        <ambientLight intensity={0.5} /><FallbackAvatar />
                    </Canvas>
                </div>
            );
        }
        return this.props.children;
    }
}

export function AvatarExperience({ isTalking }) {
    return (
        <div className="w-full h-full relative group bg-linear-to-b from-[#1a1d24] to-[#0f1115]">
            <div className="absolute top-6 left-6 z-10 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                <h3 className="text-lg font-bold text-white">Interactive Session</h3>
                <p className="text-sm text-white/60">Practice mode: Active</p>
            </div>

            <ErrorBoundary>
                {/* Camera Position: [X (Left/Right), Y (Up/Down), Z (Zoom)] */}
                <Canvas camera={{ position: [0, 2, 4.2], fov: 40 }} className="w-full h-full">
                    <ambientLight intensity={1.5} />
                    <spotLight position={[5, 10, 7]} angle={0.5} penumbra={1} intensity={2} castShadow />
                    <pointLight position={[-5, -5, -5]} intensity={1} />

                    <gridHelper position={[0, -2, 0]} args={[10, 10]} />

                    <Suspense fallback={<Html center><Loader2 className="w-10 h-10 text-primary animate-spin" /></Html>}>
                        <AvatarModel isTalking={isTalking} />
                        <Environment preset="city" />
                    </Suspense>

                    <OrbitControls
                        enablePan={true}
                        target={[0, 0.8, 0]}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.8}
                    />
                </Canvas>
            </ErrorBoundary>
            <div className="absolute bottom-6 right-6 z-10 text-xs text-white/20 select-none">Powered by Three.js</div>
        </div>
    );
}