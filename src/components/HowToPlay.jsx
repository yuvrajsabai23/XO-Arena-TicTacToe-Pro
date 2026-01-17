import React from 'react';
import { motion } from 'framer-motion';

const HowToPlay = ({ onClose }) => {
    return (
        <div className="absolute-fill flex-center" style={{ zIndex: 50, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{
                    width: 'min(90vw, 400px)',
                    padding: '2rem',
                    borderRadius: '24px',
                    position: 'relative'
                }}
            >
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-cyan)', textAlign: 'center' }}>Directives</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
                    <p><strong>01 / Objective</strong><br /><span style={{ color: 'var(--text-secondary)' }}>Align 3 symbols vertically, horizontally, or diagonally.</span></p>
                    <p><strong>02 / Turn-Based</strong><br /><span style={{ color: 'var(--text-secondary)' }}>You command Unit X. The opponent commands Core O.</span></p>
                    <p><strong>03 / Difficulty</strong><br /><span style={{ color: 'var(--text-secondary)' }}>The Grandmaster AI calculates all possible outcomes. Verification of victory requires strategic perfection.</span></p>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-app)',
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '14px'
                    }}
                >
                    ACKNOWLEDGE
                </button>

            </motion.div>
        </div>
    );
};

export default HowToPlay;
