import { motion } from 'framer-motion';

const UnitX = ({ skin = 'default' }) => {
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

    // Skin configurations
    const skinConfig = {
        default: {
            color: 'var(--color-cyan)',
            glowColor: 'rgba(6, 182, 212, 0.6)',
            strokeWidth: 10
        },
        flame: {
            color: '#ff4500',
            secondaryColor: '#ff8c00',
            glowColor: 'rgba(255, 69, 0, 0.8)',
            strokeWidth: 10,
            animation: 'flicker'
        },
        galaxy: {
            color: '#ffd700',
            secondaryColor: '#fff8dc',
            glowColor: 'rgba(255, 215, 0, 0.9)',
            strokeWidth: 10,
            animation: 'twinkle'
        },
        pixel: {
            color: '#00ff00',
            secondaryColor: '#008000',
            glowColor: 'rgba(0, 255, 0, 0.5)',
            strokeWidth: 12,
            pixelated: true
        }
    };

    const config = skinConfig[skin] || skinConfig.default;
    const filterId = `glow-x-${skin}`;

    // Pixel skin uses a different path
    const getPath = () => {
        if (config.pixelated) {
            return "M 15 15 L 25 15 L 25 25 L 35 25 L 35 35 L 45 35 L 45 45 L 55 45 L 55 55 L 65 55 L 65 65 L 75 65 L 75 75 L 85 75 L 85 85 M 85 15 L 75 15 L 75 25 L 65 25 L 65 35 L 55 35 L 55 45 L 45 45 L 45 55 L 35 55 L 35 65 L 25 65 L 25 75 L 15 75 L 15 85";
        }
        return "M 20 20 L 80 80 M 80 20 L 20 80";
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
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={config.animation === 'twinkle' ? 6 : 4} result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {config.animation === 'flame' && (
                    <linearGradient id="flame-gradient-x" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={config.color}>
                            <animate attributeName="stop-color" values={`${config.color};${config.secondaryColor};${config.color}`} dur="0.5s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor={config.secondaryColor}>
                            <animate attributeName="stop-color" values={`${config.secondaryColor};${config.color};${config.secondaryColor}`} dur="0.5s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>
                )}
                {config.animation === 'twinkle' && (
                    <radialGradient id="star-gradient-x">
                        <stop offset="0%" stopColor={config.secondaryColor} />
                        <stop offset="100%" stopColor={config.color} />
                    </radialGradient>
                )}
            </defs>

            <motion.path
                d={getPath()}
                stroke={
                    config.animation === 'flame' ? 'url(#flame-gradient-x)' :
                    config.animation === 'twinkle' ? 'url(#star-gradient-x)' :
                    config.color
                }
                strokeWidth={config.strokeWidth}
                strokeLinecap={config.pixelated ? 'square' : 'round'}
                fill="transparent"
                variants={draw}
                filter={`url(#${filterId})`}
            />

            {config.animation === 'twinkle' && (
                <>
                    <motion.circle
                        cx="50" cy="50" r="3"
                        fill={config.secondaryColor}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.circle
                        cx="30" cy="30" r="2"
                        fill={config.secondaryColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
                    />
                    <motion.circle
                        cx="70" cy="70" r="2"
                        fill={config.secondaryColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 1.2 }}
                    />
                </>
            )}
        </motion.svg>
    );
};

export default UnitX;
