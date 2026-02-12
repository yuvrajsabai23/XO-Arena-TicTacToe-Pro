import { motion } from 'framer-motion';

const CoreO = ({ skin = 'default' }) => {
    // Skin configurations
    const skinConfig = {
        default: {
            color: 'var(--color-violet)',
            glowColor: 'rgba(139, 92, 246, 0.6)',
            strokeWidth: 8
        },
        flame: {
            color: '#00bfff',
            secondaryColor: '#87ceeb',
            glowColor: 'rgba(0, 191, 255, 0.8)',
            strokeWidth: 8,
            animation: 'ice'
        },
        galaxy: {
            color: '#9932cc',
            secondaryColor: '#da70d6',
            glowColor: 'rgba(153, 50, 204, 0.8)',
            strokeWidth: 8,
            animation: 'nebula'
        },
        pixel: {
            color: '#ff0000',
            secondaryColor: '#8b0000',
            glowColor: 'rgba(255, 0, 0, 0.5)',
            strokeWidth: 10,
            pixelated: true
        }
    };

    const config = skinConfig[skin] || skinConfig.default;
    const filterId = `glow-o-${skin}`;

    // Pixel skin renders a square-ish O
    if (config.pixelated) {
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
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect
                    x="20" y="20"
                    width="60" height="60"
                    rx="5" ry="5"
                    stroke={config.color}
                    strokeWidth={config.strokeWidth}
                    fill="transparent"
                    filter={`url(#${filterId})`}
                />
            </motion.svg>
        );
    }

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
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={config.animation === 'nebula' ? 7 : 5} result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {config.animation === 'ice' && (
                    <linearGradient id="ice-gradient-o" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={config.color}>
                            <animate attributeName="stop-color" values={`${config.color};${config.secondaryColor};${config.color}`} dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor={config.secondaryColor}>
                            <animate attributeName="stop-color" values={`${config.secondaryColor};${config.color};${config.secondaryColor}`} dur="2s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>
                )}
                {config.animation === 'nebula' && (
                    <radialGradient id="nebula-gradient-o">
                        <stop offset="0%" stopColor={config.secondaryColor}>
                            <animate attributeName="stop-color" values={`${config.secondaryColor};${config.color};${config.secondaryColor}`} dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor={config.color}>
                            <animate attributeName="stop-color" values={`${config.color};${config.secondaryColor};${config.color}`} dur="3s" repeatCount="indefinite" />
                        </stop>
                    </radialGradient>
                )}
            </defs>

            <circle
                cx="50"
                cy="50"
                r="35"
                stroke={
                    config.animation === 'ice' ? 'url(#ice-gradient-o)' :
                    config.animation === 'nebula' ? 'url(#nebula-gradient-o)' :
                    config.color
                }
                strokeWidth={config.strokeWidth}
                fill="transparent"
                filter={`url(#${filterId})`}
            />

            {config.animation === 'nebula' && (
                <>
                    <motion.circle
                        cx="50" cy="50" r="25"
                        stroke={config.secondaryColor}
                        strokeWidth="2"
                        fill="transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ transformOrigin: 'center' }}
                    />
                    <motion.circle
                        cx="35" cy="40" r="2"
                        fill={config.secondaryColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.circle
                        cx="65" cy="60" r="1.5"
                        fill={config.color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.7 }}
                    />
                </>
            )}

            {config.animation === 'ice' && (
                <>
                    <motion.line
                        x1="50" y1="15" x2="50" y2="25"
                        stroke={config.secondaryColor}
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.7, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.line
                        x1="50" y1="75" x2="50" y2="85"
                        stroke={config.secondaryColor}
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.7, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                </>
            )}
        </motion.svg>
    );
};

export default CoreO;
