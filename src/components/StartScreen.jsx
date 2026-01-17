import React from 'react';
import { motion } from 'framer-motion';
import Arbiter from './Arbiter';

const StartScreen = ({ onStart, onHowToPlay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-center"
            style={{ flexDirection: 'column', height: '100vh', gap: '3rem', textAlign: 'center' }}
        >

            {/* Hero Section */}
            <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    style={{ width: '120px', height: '120px' }}
                >
                    <Arbiter />
                </motion.div>
                <div>
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: '10px' }}
                        animate={{ opacity: 1, letterSpacing: '4px' }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '300',
                            letterSpacing: '4px',
                            marginBottom: '0.5rem',
                            textShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                        }}
                    >
                        XO ARENA
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}
                    >
                        By Sabai Innovations
                    </motion.p>
                </div>
            </div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex-center"
                style={{ flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}
            >
                <button
                    onClick={onStart}
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '1.1rem',
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid var(--color-cyan)',
                        color: 'var(--color-cyan)',
                        boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
                        cursor: 'pointer'
                    }}
                >
                    Start the game
                </button>

                <button
                    onClick={onHowToPlay}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}
                >
                    HOW TO PLAY
                </button>
            </motion.div>

        </motion.div>
    );
};

export default StartScreen;
