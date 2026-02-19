import React from 'react';
import { motion } from 'framer-motion';
import Arbiter from './Arbiter';

// Premium easing
const premiumEase = [0.22, 1, 0.36, 1];

// Stagger container
const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.3 }
    }
};

// Item variants
const itemVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: premiumEase }
    }
};

// Button variants
const buttonVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: premiumEase }
    },
    hover: {
        scale: 1.03,
        y: -3,
        transition: { duration: 0.2, ease: premiumEase }
    },
    tap: { scale: 0.97 }
};

const StartScreen = ({ onStart, onHowToPlay, onStore }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-center"
            style={{
                flexDirection: 'column',
                height: '100vh',
                gap: '3rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated background particles */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: 150 + Math.random() * 100,
                            height: 150 + Math.random() * 100,
                            borderRadius: '50%',
                            background: i % 2 === 0
                                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(30px)'
                        }}
                        animate={{
                            x: [0, 30, 0],
                            y: [0, 20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <motion.div
                variants={itemVariants}
                className="flex-center"
                style={{ flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}
            >
                <motion.div
                    initial={{ y: -30, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: premiumEase }}
                    style={{ width: '120px', height: '120px' }}
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Arbiter />
                    </motion.div>
                </motion.div>
                <div>
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: '12px', scale: 0.9 }}
                        animate={{ opacity: 1, letterSpacing: '6px', scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: premiumEase }}
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '300',
                            letterSpacing: '6px',
                            marginBottom: '0.5rem'
                        }}
                    >
                        <motion.span
                            animate={{
                                textShadow: [
                                    '0 0 20px rgba(6, 182, 212, 0.4)',
                                    '0 0 40px rgba(6, 182, 212, 0.6)',
                                    '0 0 20px rgba(6, 182, 212, 0.4)'
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            XO ARENA
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.7, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}
                    >
                        By Sabai Innovations
                    </motion.p>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                variants={itemVariants}
                className="flex-center"
                style={{ flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px', position: 'relative', zIndex: 1 }}
            >
                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={onStart}
                    style={{
                        width: '100%',
                        padding: '18px',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.05))',
                        border: '2px solid var(--color-cyan)',
                        borderRadius: '16px',
                        color: 'var(--color-cyan)',
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        letterSpacing: '1px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Shine effect */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <span style={{ position: 'relative', zIndex: 1 }}>START GAME</span>
                </motion.button>

                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={onHowToPlay}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '14px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        fontSize: '0.95rem',
                        letterSpacing: '1px'
                    }}
                >
                    HOW TO PLAY
                </motion.button>

                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={onStore}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1))',
                        border: '2px solid rgba(139, 92, 246, 0.5)',
                        borderRadius: '14px',
                        color: 'var(--color-violet)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        fontSize: '0.95rem',
                        letterSpacing: '1px',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.15)'
                    }}
                >
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                        ✨
                    </motion.span>
                    <span>STORE</span>
                </motion.button>
            </motion.div>

        </motion.div>
    );
};

export default StartScreen;
