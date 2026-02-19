import { motion } from 'framer-motion';
import { difficultyConfig, DIFFICULTY } from '../logic/minimax';
import { isItemOwned } from '../store/purchases';

// Premium easing
const premiumEase = [0.22, 1, 0.36, 1];

// Container animation
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Item animation
const itemVariants = {
  initial: { opacity: 0, y: 25, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: premiumEase }
  }
};

// Card animation
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.85, rotateX: 20 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.5, ease: premiumEase }
  },
  hover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.25, ease: premiumEase }
  },
  tap: { scale: 0.97 }
};

// Difficulty colors
const difficultyColors = {
  rookie: { primary: '#00ff00', glow: 'rgba(0, 255, 0, 0.3)' },
  pro: { primary: '#00bfff', glow: 'rgba(0, 191, 255, 0.3)' },
  grandmaster: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
  chaos: { primary: '#ff6b35', glow: 'rgba(255, 107, 53, 0.3)' }
};

const DifficultySelector = ({ selectedDifficulty, onSelect, onBack }) => {
  const difficulties = Object.values(difficultyConfig);

  const handleSelect = (diffId) => {
    if (difficultyConfig[diffId].free || isItemOwned('difficulties', diffId)) {
      onSelect(diffId);
    }
  };

  const isOwned = (diffId) => {
    return difficultyConfig[diffId].free || isItemOwned('difficulties', diffId);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px',
        padding: '20px'
      }}
    >
      <motion.h2
        variants={itemVariants}
        style={{
          color: 'var(--text-primary)',
          fontSize: '22px',
          margin: 0,
          letterSpacing: '3px',
          textShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
        }}
      >
        SELECT DIFFICULTY
      </motion.h2>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '18px',
          width: '100%',
          maxWidth: '420px'
        }}
      >
        {difficulties.map((diff, index) => {
          const owned = isOwned(diff.id);
          const selected = selectedDifficulty === diff.id;
          const colors = difficultyColors[diff.id];

          return (
            <motion.button
              key={diff.id}
              variants={cardVariants}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover={owned ? "hover" : undefined}
              whileTap={owned ? "tap" : undefined}
              onClick={() => handleSelect(diff.id)}
              className="glass-panel"
              style={{
                padding: '20px 15px',
                border: selected
                  ? `2px solid ${colors.primary}`
                  : '1px solid var(--glass-border)',
                borderRadius: '16px',
                background: owned
                  ? `linear-gradient(145deg, ${colors.primary}15, rgba(15, 23, 42, 0.9))`
                  : 'rgba(0,0,0,0.4)',
                cursor: owned ? 'pointer' : 'not-allowed',
                opacity: owned ? 1 : 0.6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: selected
                  ? `0 0 25px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
                  : '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              {/* Glow effect */}
              {selected && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 0%, ${colors.primary}20, transparent 70%)`,
                    pointerEvents: 'none'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}

              <motion.span
                style={{ fontSize: '32px' }}
                animate={selected ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 1.5, repeat: selected ? Infinity : 0 }}
              >
                {diff.id === 'rookie' && '🎮'}
                {diff.id === 'pro' && '🎯'}
                {diff.id === 'grandmaster' && '🧠'}
                {diff.id === 'chaos' && '🎲'}
              </motion.span>

              <span style={{
                color: owned ? colors.primary : 'var(--text-secondary)',
                fontSize: '15px',
                fontWeight: 'bold',
                textShadow: selected ? `0 0 15px ${colors.glow}` : 'none'
              }}>
                {diff.name}
              </span>

              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                {diff.description}
              </span>

              {!owned && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    color: 'gold',
                    fontSize: '11px',
                    marginTop: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🔒 Premium
                </motion.span>
              )}

              {selected && owned && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    color: colors.primary,
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                >
                  ✓ Selected
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.button
        variants={itemVariants}
        onClick={onBack}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
          padding: '12px 32px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '13px',
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(10px)'
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
    </motion.div>
  );
};

export default DifficultySelector;
