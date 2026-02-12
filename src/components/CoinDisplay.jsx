import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getCoins, getHints, getUndos, getShields, getSpins, getWinStreak } from '../store/coinManager';

const CoinDisplay = ({ compact = false, showAll = false, onCoinClick }) => {
  const [coins, setCoins] = useState(0);
  const [hints, setHints] = useState(0);
  const [undos, setUndos] = useState(0);
  const [shields, setShields] = useState(0);
  const [spins, setSpins] = useState(0);
  const [winStreak, setWinStreak] = useState(0);

  useEffect(() => {
    updateValues();
    // Set up interval to check for updates
    const interval = setInterval(updateValues, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateValues = () => {
    setCoins(getCoins());
    setHints(getHints());
    setUndos(getUndos());
    setShields(getShields());
    setSpins(getSpins());
    setWinStreak(getWinStreak());
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onCoinClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 215, 0, 0.15)',
          padding: '8px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          cursor: onCoinClick ? 'pointer' : 'default'
        }}
      >
        <span style={{ fontSize: '16px' }}>🪙</span>
        <motion.span
          key={coins}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          style={{
            color: 'gold',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        >
          {coins.toLocaleString()}
        </motion.span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center'
      }}
    >
      {/* Coins */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={onCoinClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 215, 0, 0.15)',
          padding: '8px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          cursor: onCoinClick ? 'pointer' : 'default'
        }}
      >
        <span>🪙</span>
        <span style={{ color: 'gold', fontWeight: 'bold', fontFamily: 'monospace' }}>
          {coins.toLocaleString()}
        </span>
      </motion.div>

      {showAll && (
        <>
          {/* Hints */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 191, 255, 0.15)',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(0, 191, 255, 0.3)'
          }}>
            <span>💡</span>
            <span style={{ color: '#00bfff', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {hints}
            </span>
          </div>

          {/* Undos */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(139, 92, 246, 0.15)',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <span>↩️</span>
            <span style={{ color: 'var(--color-violet)', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {undos}
            </span>
          </div>

          {/* Shields */}
          {shields > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 255, 0, 0.15)',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 255, 0, 0.3)'
            }}>
              <span>🛡️</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {shields}
              </span>
            </div>
          )}

          {/* Spins */}
          {spins > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 107, 53, 0.15)',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 107, 53, 0.3)'
            }}>
              <span>🎰</span>
              <span style={{ color: '#ff6b35', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {spins}
              </span>
            </div>
          )}

          {/* Win Streak */}
          {winStreak > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 69, 0, 0.15)',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 69, 0, 0.3)'
            }}>
              <span>🔥</span>
              <span style={{ color: '#ff4500', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {winStreak}
              </span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

// Mini display for in-game UI
export const GameConsumables = ({ hints, undos, shields, winStreak, onHintClick, onUndoClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      {/* Hint Button */}
      <motion.button
        onClick={onHintClick}
        disabled={hints <= 0}
        whileHover={{ scale: hints > 0 ? 1.1 : 1 }}
        whileTap={{ scale: hints > 0 ? 0.9 : 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: hints > 0 ? 'rgba(0, 191, 255, 0.2)' : 'rgba(100, 100, 100, 0.2)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${hints > 0 ? 'rgba(0, 191, 255, 0.5)' : 'rgba(100, 100, 100, 0.3)'}`,
          cursor: hints > 0 ? 'pointer' : 'not-allowed',
          color: hints > 0 ? '#00bfff' : '#666',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        <span>💡</span>
        <span>{hints}</span>
      </motion.button>

      {/* Undo Button */}
      <motion.button
        onClick={onUndoClick}
        disabled={undos <= 0}
        whileHover={{ scale: undos > 0 ? 1.1 : 1 }}
        whileTap={{ scale: undos > 0 ? 0.9 : 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: undos > 0 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(100, 100, 100, 0.2)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${undos > 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(100, 100, 100, 0.3)'}`,
          cursor: undos > 0 ? 'pointer' : 'not-allowed',
          color: undos > 0 ? 'var(--color-violet)' : '#666',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        <span>↩️</span>
        <span>{undos}</span>
      </motion.button>

      {/* Shield Indicator */}
      {shields > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(0, 255, 0, 0.2)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 255, 0, 0.5)',
          color: '#00ff00',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <span>🛡️</span>
          <span>{shields}</span>
        </div>
      )}

      {/* Win Streak */}
      {winStreak > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(255, 69, 0, 0.2)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 69, 0, 0.5)',
          color: '#ff4500',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          <span>🔥</span>
          <span>{winStreak}</span>
        </div>
      )}
    </motion.div>
  );
};

export default CoinDisplay;
