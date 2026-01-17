import { motion } from 'framer-motion';

const CoreO = () => {
    return (
        <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0, 0, 0, 1] }}
        >
            <defs>
                <filter id="turbulence-o">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="turbulence">
                        <animate attributeName="baseFrequency" dur="10s" values="0.05;0.02;0.05" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
                    <feGaussianBlur stdDeviation="2" />
                </filter>
                <filter id="glow-o" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <circle
                cx="50"
                cy="50"
                r="35"
                stroke="var(--color-violet)"
                strokeWidth="8"
                fill="transparent"
                filter="url(#glow-o)"
            />
        </motion.svg>
    );
};

export default CoreO;
