import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  SPIN_REWARDS,
  getSpinReward,
  applySpinReward,
  useSpin,
  getSpins,
  buySpinWithCoins,
  getCoins,
  addCoins,
  addHints,
  addUndos
} from '../store/coinManager';
import { unlockItem } from '../store/purchases';

const LuckySpin = ({ onClose, onUpdate }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(getSpins());
  const [coins, setCoins] = useState(getCoins());
  const [showOdds, setShowOdds] = useState(false);

  const updateBalances = () => {
    setSpinsLeft(getSpins());
    setCoins(getCoins());
    if (onUpdate) onUpdate();
  };

  const handleSpin = () => {
    if (isSpinning) return;

    // Check if user has spins
    const spinResult = useSpin();
    if (!spinResult.success) {
      return;
    }

    setIsSpinning(true);
    setShowReward(false);
    setReward(null);

    // Get the reward
    const wonReward = getSpinReward();

    // Calculate rotation (5-8 full spins + land on reward segment)
    const rewardIndex = SPIN_REWARDS.findIndex(r => r.id === wonReward.id);
    const segmentAngle = 360 / SPIN_REWARDS.length;
    const targetAngle = rewardIndex * segmentAngle;
    const fullSpins = (5 + Math.random() * 3) * 360;
    const finalRotation = rotation + fullSpins + (360 - targetAngle);

    setRotation(finalRotation);

    // After spin completes
    setTimeout(() => {
      setIsSpinning(false);

      // Apply the reward
      const appliedReward = applySpinReward(wonReward);
      setReward(appliedReward);
      setShowReward(true);

      // Handle permanent unlocks
      if (appliedReward.permanent && appliedReward.unlockedItem) {
        if (appliedReward.type === 'theme_permanent') {
          unlockItem('themes', appliedReward.unlockedItem);
        } else if (appliedReward.type === 'skin_permanent') {
          unlockItem('skins', appliedReward.unlockedItem);
        }
      }

      updateBalances();
    }, 4000);
  };

  const handleBuyWithCoins = () => {
    const result = buySpinWithCoins();
    if (result.success) {
      updateBalances();
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'common': return 'rgba(160, 160, 160, 0.5)';
      case 'uncommon': return 'rgba(0, 191, 255, 0.5)';
      case 'rare': return 'rgba(139, 92, 246, 0.5)';
      case 'epic': return 'rgba(255, 107, 53, 0.5)';
      case 'legendary': return 'rgba(255, 215, 0, 0.5)';
      case 'mythic': return 'rgba(255, 0, 255, 0.5)';
      default: return 'rgba(255, 255, 255, 0.5)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '20px'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px'
      }}>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </motion.button>
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 215, 0, 0.2)',
            padding: '8px 15px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>🪙</span>
            <span style={{ color: 'gold', fontWeight: 'bold' }}>{coins}</span>
          </div>
          <div style={{
            background: 'rgba(139, 92, 246, 0.2)',
            padding: '8px 15px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>🎰</span>
            <span style={{ color: 'var(--color-violet)', fontWeight: 'bold' }}>{spinsLeft}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={{
          color: 'gold',
          fontSize: '28px',
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
        }}
      >
        LUCKY SPIN
      </motion.h1>

      {/* Odds Button */}
      <motion.button
        onClick={() => setShowOdds(!showOdds)}
        whileHover={{ scale: 1.05 }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          cursor: 'pointer',
          marginBottom: '20px',
          textDecoration: 'underline'
        }}
      >
        {showOdds ? 'Hide Odds' : 'View Odds'}
      </motion.button>

      {/* Odds Disclosure */}
      <AnimatePresence>
        {showOdds && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px',
              maxWidth: '350px',
              width: '100%'
            }}
          >
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px', fontSize: '14px' }}>
              Reward Probabilities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '11px' }}>
              {SPIN_REWARDS.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', color: r.color }}>
                  <span>{r.name}</span>
                  <span>{r.probability}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin Wheel */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '25px solid gold',
          zIndex: 10,
          filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
        }} />

        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: `conic-gradient(${SPIN_REWARDS.map((r, i) => {
              const angle = 360 / SPIN_REWARDS.length;
              return `${r.color} ${i * angle}deg ${(i + 1) * angle}deg`;
            }).join(', ')})`,
            border: '4px solid gold',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 50px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Center Circle */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            border: '3px solid gold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}>
            🎰
          </div>

          {/* Reward Labels */}
          {SPIN_REWARDS.map((r, i) => {
            const angle = (i * 360 / SPIN_REWARDS.length) + (180 / SPIN_REWARDS.length);
            const radius = 100;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

            return (
              <div
                key={r.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#000',
                  textShadow: '0 0 3px rgba(255,255,255,0.8)',
                  whiteSpace: 'nowrap'
                }}
              >
                {r.name.split(' ')[0]}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Spin Button */}
      {spinsLeft > 0 ? (
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          whileHover={{ scale: isSpinning ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning ? 1 : 0.95 }}
          style={{
            padding: '15px 50px',
            fontSize: '20px',
            fontWeight: 'bold',
            background: isSpinning
              ? 'rgba(100, 100, 100, 0.5)'
              : 'linear-gradient(135deg, #ffd700, #ff8c00)',
            border: 'none',
            borderRadius: '12px',
            color: isSpinning ? '#666' : '#000',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            letterSpacing: '2px'
          }}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN!'}
        </motion.button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No spins left!</p>
          {coins >= 200 ? (
            <motion.button
              onClick={handleBuyWithCoins}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, var(--color-cyan), var(--color-violet))',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Buy Spin (200 Coins)
            </motion.button>
          ) : (
            <p style={{ color: '#ff6b6b', fontSize: '14px' }}>Need 200 coins to spin</p>
          )}
        </div>
      )}

      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && reward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.8)'
            }}
            onClick={() => setShowReward(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))',
                border: `3px solid ${reward.color}`,
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: `0 0 50px ${getRarityGlow(reward.rarity)}`
              }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '60px', marginBottom: '20px' }}
              >
                {reward.type === 'coins' ? '🪙' :
                 reward.type === 'hints' ? '💡' :
                 reward.type === 'undos' ? '↩️' :
                 reward.type.includes('theme') ? '🎨' :
                 reward.type.includes('skin') ? '✨' : '🎁'}
              </motion.div>

              <p style={{
                color: reward.color,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '10px'
              }}>
                {reward.rarity}
              </p>

              <h2 style={{
                color: 'var(--text-primary)',
                margin: '0 0 10px',
                fontSize: '24px'
              }}>
                {reward.name}
              </h2>

              {reward.unlockedItem && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {reward.permanent ? 'Permanently unlocked: ' : 'Trial unlocked: '}
                  <span style={{ color: reward.color }}>{reward.unlockedItem}</span>
                </p>
              )}

              <motion.button
                onClick={() => setShowReward(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '20px',
                  padding: '12px 30px',
                  background: reward.color,
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                CLAIM
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LuckySpin;
