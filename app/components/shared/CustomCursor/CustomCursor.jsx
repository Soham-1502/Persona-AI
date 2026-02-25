"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "next-themes";

const CustomCursor = () => {
    const { theme, resolvedTheme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isHiddenRoute, setIsHiddenRoute] = useState(false);

    // After mounting, we can safely show the cursor that depends on the theme and route
    useEffect(() => {
        setMounted(true);
        // Initial route check
        const checkRoute = () => {
            const isDark = (resolvedTheme || theme) === "dark";
            const shouldHide = false;
            setIsHiddenRoute(shouldHide);

            if (shouldHide) {
                document.body.classList.add("custom-cursor-disabled");
            } else {
                document.body.classList.remove("custom-cursor-disabled");
            }
        };

        checkRoute();
        // We could also listen for navigation events here if needed, 
        // but since this component re-renders on mount/unmount in layouts it usually works.
    }, [theme, resolvedTheme]);

    const currentTheme = resolvedTheme || theme;
    const customImage = currentTheme === "dark" ? "/cursor_dark_mode.png" : "/cursor_light_mode.png";

    // Motion values for smooth tracking
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring configuration for the follower (outer circle)
    const springConfig = { damping: 25, stiffness: 250 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleHoverStart = (e) => {
            if (
                e.target.tagName === "A" ||
                e.target.tagName === "BUTTON" ||
                e.target.closest("button") ||
                e.target.closest("a") ||
                window.getComputedStyle(e.target).cursor === "pointer"
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);
        const handleMouseLeave = () => {
            setIsVisible(false);
            setIsClicked(false);
        };
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", moveMouse);
        window.addEventListener("mouseover", handleHoverStart);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", moveMouse);
            window.removeEventListener("mouseover", handleHoverStart);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!mounted || !isVisible || isHiddenRoute) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Custom PNG Cursor */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isClicked ? 0.6 : (isHovered ? 1 : 0.8),
                }}
                className="absolute w-10 h-10 flex items-center justify-center overflow-hidden pointer-events-none"
            >
                {customImage && (
                    <img
                        src={customImage}
                        alt="cursor"
                        className="w-full h-full object-contain"
                    />
                )}
            </motion.div>
        </div>
    );
};

export default CustomCursor;
