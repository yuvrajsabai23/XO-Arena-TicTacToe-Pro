import { motion } from 'framer-motion';

const UnitX = () => {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { type: "spring", duration: 1.5, bounce: 0 },
                opacity: { duration: 0.01 }
            }
        }
    };

    return (
        <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            initial="hidden"
            animate="visible"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <filter id="glow-x" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <motion.path
                d="M 20 20 L 80 80 M 80 20 L 20 80"
                stroke="var(--color-cyan)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                variants={draw}
                filter="url(#glow-x)"
            />
        </motion.svg>
    );
};

export default UnitX;
