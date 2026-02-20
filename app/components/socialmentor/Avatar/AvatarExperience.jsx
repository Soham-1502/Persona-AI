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
    const hairTexture = textureLoader.load("/businessman/textures/Classic_Taper_Diffuse.jpeg");
    const scalpTexture = textureLoader.load("/businessman/textures/Classic_Taper_Scalp_Diffuse.jpeg");
    const scalpOpacity = textureLoader.load("/businessman/textures/Classic_Taper_Scalp_Opacity.jpeg");
    const lashTexture = textureLoader.load("/businessman/textures/Std_Eyelash_Diffuse.jpeg");
    const lashOpacity = textureLoader.load("/businessman/textures/Std_Eyelash_Opacity.png");

    // Fix Texture Encoding
    [eyeTextureL, eyeTextureR, headTexture, bodyTexture, hairTexture, scalpTexture, lashTexture].forEach(t => {
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

                        // HAIR FIX
                        if (name.includes("taper") || name.includes("hair")) {
                            m.transparent = true;
                            m.alphaTest = 0.5;
                            m.side = THREE.DoubleSide;
                            if (name.includes("scalp")) {
                                m.map = scalpTexture;
                                m.alphaMap = scalpOpacity;
                            } else {
                                m.map = hairTexture;
                            }
                            m.needsUpdate = true;
                        }

                        // EYELASH FIX
                        if (name.includes("lash")) {
                            m.transparent = true;
                            m.map = lashTexture;
                            m.alphaMap = lashOpacity;
                            m.alphaTest = 0.5;
                            m.side = THREE.DoubleSide;
                            m.needsUpdate = true;
                        }
                    });
                }
            }
        });

    }, [fbx, eyeTextureL, eyeTextureR, headTexture, bodyTexture, hairTexture, scalpTexture, scalpOpacity, lashTexture, lashOpacity]);

    // Track current action for reliable cleanup
    const currentActionRef = useRef(null);
    const isTalkingRef = useRef(isTalking);

    // Keep ref in sync with prop
    useEffect(() => {
        isTalkingRef.current = isTalking;
    }, [isTalking]);

    // ANIMATION LOGIC
    useEffect(() => {
        if (names.length === 0) return;
        const mainAnim = names[0];
        const action = actions[mainAnim];
        if (!action) return;

        currentActionRef.current = action;

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

        return () => {
            // Ensure animation pauses when isTalking turns false
            if (!isTalkingRef.current && currentActionRef.current) {
                currentActionRef.current.paused = true;
            }
        };
    }, [actions, names, isTalking]);

    // PROCEDURAL IDLE
    useFrame((state) => {
        if (!isTalking && group.current) {
            group.current.position.y = -2.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.005;
        } else if (isTalking && group.current) {
            group.current.position.y = -2.5; // Keep position consistent when talking
        }
    });

    return (
        <group ref={group} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
            <primitive
                object={fbx}
                scale={0.022}
                position={[0, 0, 0]} // Reset local translation to fix strange pivot issues
            />


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
        <div className="w-full h-full relative group bg-white dark:bg-linear-to-b dark:from-[#1a1d24] dark:to-[#0f1115] transition-colors">


            <ErrorBoundary>
                {/* Camera Position: [X (Left/Right), Y (Up/Down), Z (Zoom)] */}
                <Canvas camera={{ position: [0, 0, 6.5], fov: 40 }} className="w-full h-full">
                    <ambientLight intensity={1.5} />
                    <spotLight position={[5, 10, 7]} angle={0.5} penumbra={1} intensity={2} castShadow />
                    <pointLight position={[-5, -5, -5]} intensity={1} />



                    <Suspense fallback={<Html center><Loader2 className="w-10 h-10 text-primary animate-spin" /></Html>}>
                        <AvatarModel isTalking={isTalking} />
                        <Environment preset="city" />
                    </Suspense>

                    <OrbitControls
                        enablePan={true}
                        target={[0, -0.5, 0]}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Canvas>
            </ErrorBoundary>

        </div>
    );
}