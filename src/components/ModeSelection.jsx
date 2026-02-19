import React from 'react';
import { motion } from 'framer-motion';
import UnitX from './UnitX';
import Arbiter from './Arbiter';

// Premium easing
const premiumEase = [0.22, 1, 0.36, 1];

// Container animation
const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

// Item animation
const itemVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: premiumEase }
    }
};

// Card animation
const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.9, rotateY: -10 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateY: 0,
        transition: { duration: 0.6, ease: premiumEase }
    },
    hover: {
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3, ease: premiumEase }
    },
    tap: { scale: 0.98 }
};

const ModeSelection = ({ onSelect, onBack }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-center mode-selection"
            style={{ flexDirection: 'column', height: '100vh', gap: '2rem' }}
        >
            <motion.h2
                variants={itemVariants}
                style={{
                    fontSize: '2rem',
                    letterSpacing: '4px',
                    color: 'var(--text-primary)',
                    opacity: 0.9,
                    textShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
            >
                SELECT MODE
            </motion.h2>

            <motion.div
                variants={itemVariants}
                style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}
            >
                {/* VS AI CARD */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => onSelect('PvAI')}
                    className="glass-panel text-center"
                    style={{
                        width: '280px',
                        padding: '3rem',
                        borderRadius: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        border: '2px solid rgba(6, 182, 212, 0.3)',
                        background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.1), rgba(15, 23, 42, 0.8))',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Glow effect */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.15), transparent 70%)',
                            pointerEvents: 'none'
                        }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                    />
                    <motion.div
                        style={{ width: '80px', height: '80px' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Arbiter />
                    </motion.div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-cyan)', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>VS AI</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Challenge the Grandmaster Algorithm.</p>
                    </div>
                </motion.div>

                {/* VS FRIEND CARD */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => onSelect('PvP')}
                    className="glass-panel text-center"
                    style={{
                        width: '280px',
                        padding: '3rem',
                        borderRadius: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1), rgba(15, 23, 42, 0.8))',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Glow effect */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15), transparent 70%)',
                            pointerEvents: 'none'
                        }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                    />
                    <motion.div
                        style={{ width: '80px', height: '80px' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    >
                        <UnitX />
                    </motion.div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-violet)', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>VS FRIEND</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Local multiplayer tactical combat.</p>
                    </div>
                </motion.div>
            </motion.div>

            {onBack && (
                <motion.button
                    variants={itemVariants}
                    onClick={onBack}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        marginTop: '1rem',
                        padding: '12px 32px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <motion.span
                        animate={{ x: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        ←
                    </motion.span>
                    Back
                </motion.button>
            )}
        </motion.div>
    );
};

export default ModeSelection;
