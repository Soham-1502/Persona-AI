'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let raf;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            ringX = lerp(ringX, mouseX, 0.12);
            ringY = lerp(ringY, mouseY, 0.12);
            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            raf = requestAnimationFrame(animate);
        };

        const onEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };
        const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };

        // Scale ring on clickable elements
        const onDown = () => ring.classList.add('ml-cursor-ring--click');
        const onUp = () => ring.classList.remove('ml-cursor-ring--click');

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseenter', onEnter);
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseenter', onEnter);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            {/* Small solid dot — snaps instantly */}
            <div ref={dotRef} className="ml-cursor-dot" aria-hidden="true" />
            {/* Larger ring — follows with lag */}
            <div ref={ringRef} className="ml-cursor-ring" aria-hidden="true" />
        </>
    );
}
