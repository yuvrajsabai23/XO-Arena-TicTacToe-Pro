import React from 'react';
import { motion } from 'framer-motion';

// Premium easing
const premiumEase = [0.22, 1, 0.36, 1];

// Overlay animation
const overlayVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.4, ease: premiumEase }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

// Panel animation
const panelVariants = {
    initial: {
        scale: 0.8,
        opacity: 0,
        y: 50,
        rotateX: 15
    },
    animate: {
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            duration: 0.6,
            ease: premiumEase,
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    exit: {
        scale: 0.9,
        opacity: 0,
        y: -30,
        transition: { duration: 0.3 }
    }
};

// Item animation
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: premiumEase }
    }
};

// Button animation
const buttonVariants = {
    initial: { opacity: 0, y: 15, scale: 0.9 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: premiumEase }
    },
    hover: {
        scale: 1.05,
        y: -3,
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 }
};

const GameOverlay = ({ winner, onRestart, onHome }) => {
    const isDraw = winner === 'draw';
    const isVictory = winner === 'X';
    const message = isDraw ? "STALEMATE" : (isVictory ? 'VICTORY' : 'DEFEAT');
    const subMessage = isDraw ? "Perfectly Balanced." : (isVictory ? "Superior Strategy." : "GrandMaster Won!");

    const accentColor = isVictory ? 'var(--color-cyan)' : (isDraw ? 'var(--text-primary)' : 'var(--color-violet)');
    const glowColor = isVictory ? 'rgba(6, 182, 212, 0.4)' : (isDraw ? 'rgba(255, 255, 255, 0.2)' : 'rgba(139, 92, 246, 0.4)');

    return (
        <motion.div
            className="absolute-fill flex-center"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ zIndex: 40, background: 'rgba(0,0,0,0.85)' }}
        >
            {/* Background particles */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: 4 + Math.random() * 6,
                            height: 4 + Math.random() * 6,
                            borderRadius: '50%',
                            background: accentColor,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.6
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0.6, 0],
                            scale: [1, 0]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: 'easeOut'
                        }}
                    />
                ))}
            </div>

            <motion.div
                variants={panelVariants}
                className="glass-panel"
                style={{
                    padding: '3rem 4rem',
                    borderRadius: '28px',
                    textAlign: 'center',
                    border: `2px solid ${accentColor}`,
                    backdropFilter: 'blur(25px)',
                    boxShadow: `0 0 60px ${glowColor}, 0 20px 60px rgba(0,0,0,0.5)`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated glow */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)`,
                        pointerEvents: 'none'
                    }}
                    animate={{
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Victory/Defeat icon */}
                <motion.div
                    variants={itemVariants}
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: isVictory ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '4rem', marginBottom: '1rem' }}
                >
                    {isVictory ? '🏆' : (isDraw ? '⚔️' : '💔')}
                </motion.div>

                <motion.h2
                    variants={itemVariants}
                    style={{
                        fontSize: '3rem',
                        color: accentColor,
                        marginBottom: '0.5rem',
                        letterSpacing: '4px',
                        fontWeight: '300'
                    }}
                >
                    <motion.span
                        animate={{
                            textShadow: [
                                `0 0 20px ${glowColor}`,
                                `0 0 40px ${glowColor}`,
                                `0 0 20px ${glowColor}`
                            ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {message}
                    </motion.span>
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '2.5rem',
                        fontSize: '1.1rem',
                        letterSpacing: '1px'
                    }}
                >
                    {subMessage}
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    style={{ display: 'flex', gap: '1.5rem' }}
                >
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={onHome}
                        style={{
                            flex: 1,
                            padding: '1rem 1.5rem',
                            borderRadius: '14px',
                            border: '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-secondary)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        GO HOME
                    </motion.button>
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={onRestart}
                        style={{
                            flex: 1,
                            padding: '1rem 1.5rem',
                            borderRadius: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: `linear-gradient(135deg, ${accentColor}, ${isVictory ? '#2563eb' : '#7c3aed'})`,
                            color: '#ffffff',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            boxShadow: `0 4px 20px ${glowColor}`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Shine effect */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                            }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>PLAY AGAIN</span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default GameOverlay;
