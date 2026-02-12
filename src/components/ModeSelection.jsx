import React from 'react';
import { motion } from 'framer-motion';
import UnitX from './UnitX';
import Arbiter from './Arbiter';

const ModeSelection = ({ onSelect, onBack }) => {
    return (
        <div className="flex-center mode-selection" style={{ flexDirection: 'column', height: '100vh', gap: '2rem' }}>
            <h2 style={{
                fontSize: '2rem',
                letterSpacing: '4px',
                color: 'var(--text-primary)',
                opacity: 0.9
            }}>
                SELECT MODE
            </h2>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* VS AI CARD */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: 'var(--color-cyan)' }}
                    whileTap={{ scale: 0.95 }}
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
                        border: '1px solid var(--glass-border)',
                        transition: 'border-color 0.3s ease'
                    }}
                >
                    <div style={{ width: '80px', height: '80px' }}>
                        <Arbiter />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-cyan)', marginBottom: '0.5rem' }}>VS AI</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Challenge the Grandmaster Algorithm.</p>
                    </div>
                </motion.div>

                {/* VS FRIEND CARD */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: 'var(--color-violet)' }}
                    whileTap={{ scale: 0.95 }}
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
                        border: '1px solid var(--glass-border)',
                        transition: 'border-color 0.3s ease'
                    }}
                >
                    <div style={{ width: '80px', height: '80px' }}>
                        {/* Reusing UnitX for PVP visual representation for now, or could create a "Generic Player" icon. 
                             Using UnitX is better than emoji. */}
                        <UnitX />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-violet)', marginBottom: '0.5rem' }}>VS FRIEND</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Local multiplayer tactical combat.</p>
                    </div>
                </motion.div>
            </div>

            {onBack && (
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        marginTop: '1rem',
                        padding: '10px 30px',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    ← Back
                </motion.button>
            )}
        </div>
    );
};

export default ModeSelection;
