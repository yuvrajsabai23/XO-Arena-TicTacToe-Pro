import { motion } from 'framer-motion';
import { difficultyConfig, DIFFICULTY } from '../logic/minimax';
import { isItemOwned } from '../store/purchases';

const DifficultySelector = ({ selectedDifficulty, onSelect, onBack }) => {
  const difficulties = Object.values(difficultyConfig);

  const handleSelect = (diffId) => {
    // Check if owned or free
    if (difficultyConfig[diffId].free || isItemOwned('difficulties', diffId)) {
      onSelect(diffId);
    }
  };

  const isOwned = (diffId) => {
    return difficultyConfig[diffId].free || isItemOwned('difficulties', diffId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px'
      }}
    >
      <h2 style={{
        color: 'var(--text-primary)',
        fontSize: '20px',
        margin: 0,
        letterSpacing: '2px'
      }}>
        SELECT DIFFICULTY
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {difficulties.map(diff => {
          const owned = isOwned(diff.id);
          const selected = selectedDifficulty === diff.id;

          return (
            <motion.button
              key={diff.id}
              onClick={() => handleSelect(diff.id)}
              whileHover={owned ? { scale: 1.05 } : {}}
              whileTap={owned ? { scale: 0.95 } : {}}
              className="glass-panel"
              style={{
                padding: '15px',
                border: selected
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--glass-border)',
                borderRadius: '12px',
                background: owned ? 'var(--bg-panel)' : 'rgba(0,0,0,0.3)',
                cursor: owned ? 'pointer' : 'not-allowed',
                opacity: owned ? 1 : 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '28px' }}>
                {diff.id === 'rookie' && '🎮'}
                {diff.id === 'pro' && '🎯'}
                {diff.id === 'grandmaster' && '🧠'}
                {diff.id === 'chaos' && '🎲'}
              </span>

              <span style={{
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {diff.name}
              </span>

              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                {diff.description}
              </span>

              {!owned && (
                <span style={{
                  color: 'gold',
                  fontSize: '10px',
                  marginTop: '5px'
                }}>
                  🔒 Premium
                </span>
              )}

              {selected && owned && (
                <span style={{
                  color: 'var(--color-accent)',
                  fontSize: '10px'
                }}>
                  ✓ Selected
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'transparent',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
          padding: '10px 30px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '10px'
        }}
      >
        ← Back
      </motion.button>
    </motion.div>
  );
};

export default DifficultySelector;
