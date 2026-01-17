import React from 'react';
import { motion } from 'framer-motion';

const GameOverlay = ({ winner, onRestart, onHome }) => {
    const isDraw = winner === 'draw';
    const message = isDraw ? "STALEMATE" : `${winner === 'X' ? 'VICTORY' : 'DEFEAT'}`;
    const subMessage = isDraw ? "Perfectly Balanced." : (winner === 'X' ? "Superior Strategy." : "GrandMaster Won!");

    const buttonStyle = {
        flex: 1,
        padding: '1rem',
        borderRadius: '12px',
        border: 'None',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    };

    return (
        <div className="absolute-fill flex-center" style={{ zIndex: 40, background: 'rgba(0,0,0,0.8)' }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel"
                style={{
                    padding: '3rem',
                    borderRadius: '24px',
                    textAlign: 'center',
                    border: `1px solid ${winner === 'X' ? 'var(--color-cyan)' : 'var(--glass-border)'}`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                }}
            >
                <h2 style={{
                    fontSize: '3rem',
                    color: winner === 'X' ? 'var(--color-cyan)' : (isDraw ? 'var(--text-primary)' : 'var(--color-violet)'),
                    marginBottom: '0.5rem',
                    textShadow: '0 0 20px currentColor'
                }}>
                    {message}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.2rem' }}>{subMessage}</p>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onHome}
                        style={{
                            ...buttonStyle,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        GO HOME
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRestart}
                        style={{
                            ...buttonStyle,
                            background: 'linear-gradient(135deg, var(--color-cyan) 0%, #2563eb 100%)',
                            color: '#ffffff',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        RESTART
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default GameOverlay;
