import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Arbiter = () => {
    const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            // Limit the eye movement radius
            const maxRadius = 5;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = distance > maxRadius ? maxRadius / distance : 1;

            setEyePos({ x: dx * scale, y: dy * scale });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                    <filter id="diamond-glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Diamond Body */}
                <motion.path
                    d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
                    fill="none"
                    stroke="var(--text-primary)"
                    strokeWidth="2"
                    filter="url(#diamond-glow)"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Tracking Eye */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="8"
                    fill="var(--accent-primary)"
                    animate={{ cx: 50 + eyePos.x, cy: 50 + eyePos.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </svg>
        </div>
    );
};

export default Arbiter;
