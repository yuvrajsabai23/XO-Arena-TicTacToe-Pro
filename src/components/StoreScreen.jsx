import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { themes, themeBundle } from '../themes/themes';
import { skins, skinBundle } from '../themes/skins';
import { difficultyConfig, difficultyPack } from '../logic/minimax';
import { isItemOwned, premiumBundle, getSelectedItems, setSelectedItem } from '../store/purchases';
import { purchaseProduct, isStoreAvailable } from '../store/msStore';
import {
  getCoins, getHints, getUndos, getShields, getSpins,
  COIN_PACKS, SPIN_PACKS, CONSUMABLE_PACKS, MEGA_BUNDLES
} from '../store/coinManager';
import UnitX from './UnitX';
import CoreO from './CoreO';
import LuckySpin from './LuckySpin';

// Premium easing curves
const premiumEase = [0.22, 1, 0.36, 1]; // Smooth deceleration
const springTransition = { type: 'spring', stiffness: 300, damping: 30 };

// Premium page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 60,
    scale: 0.98,
    filter: 'blur(8px)'
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: premiumEase,
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.98,
    filter: 'blur(6px)',
    transition: {
      duration: 0.35,
      ease: premiumEase
    }
  }
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.92,
    rotateX: 15
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: premiumEase
    }
  }
};

const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(255, 215, 0, 0.3)',
      '0 0 40px rgba(255, 215, 0, 0.6)',
      '0 0 20px rgba(255, 215, 0, 0.3)'
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

// Tab indicator animation
const tabIndicatorVariants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: premiumEase }
  }
};

// Card hover effect
const cardHoverEffect = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  hover: {
    scale: 1.03,
    y: -12,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    transition: { duration: 0.3, ease: premiumEase }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const StoreScreen = ({ onBack, onPurchaseComplete }) => {
  const [activeTab, setActiveTab] = useState('coins');
  const [purchasing, setPurchasing] = useState(null);
  const [owned, setOwned] = useState({});
  const [selected, setSelected] = useState(getSelectedItems());
  const [previewSkin, setPreviewSkin] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const [consumables, setConsumables] = useState({
    coins: 0, hints: 0, undos: 0, shields: 0, spins: 0
  });

  useEffect(() => {
    updateOwnedItems();
    updateConsumables();
  }, []);

  const updateOwnedItems = () => {
    const ownedItems = {
      themes: Object.keys(themes).filter(id => isItemOwned('themes', id)),
      skins: Object.keys(skins).filter(id => isItemOwned('skins', id)),
      difficulties: Object.keys(difficultyConfig).filter(id => isItemOwned('difficulties', id))
    };
    setOwned(ownedItems);
  };

  const updateConsumables = () => {
    setConsumables({
      coins: getCoins(),
      hints: getHints(),
      undos: getUndos(),
      shields: getShields(),
      spins: getSpins()
    });
  };

  const handlePurchase = async (productKey) => {
    setPurchasing(productKey);
    try {
      const result = await purchaseProduct(productKey);
      if (result.success) {
        updateOwnedItems();
        updateConsumables();
        if (onPurchaseComplete) {
          onPurchaseComplete();
        }
      }
    } catch (e) {
      console.error('Purchase error:', e);
    }
    setPurchasing(null);
  };

  const handleSelect = (category, itemId) => {
    if (isItemOwned(category, itemId)) {
      const newSelected = setSelectedItem(category.slice(0, -1), itemId);
      setSelected(newSelected);
      if (onPurchaseComplete) {
        onPurchaseComplete();
      }
    }
  };

  const tabs = [
    { id: 'coins', label: 'COINS', icon: '🪙', color: '#ffd700' },
    { id: 'spins', label: 'SPINS', icon: '🎰', color: '#ff6b35' },
    { id: 'themes', label: 'THEMES', icon: '🎨', color: '#06b6d4' },
    { id: 'skins', label: 'SKINS', icon: '✨', color: '#8b5cf6' },
    { id: 'difficulty', label: 'AI', icon: '🤖', color: '#00ff00' },
    { id: 'bundles', label: 'MEGA', icon: '👑', color: '#ff8c00' }
  ];

  const currentTabColor = tabs.find(t => t.id === activeTab)?.color || '#ffd700';

  return (
    <motion.div
      className="store-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Floating orbs */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 100 + Math.random() * 200,
              height: 100 + Math.random() * 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${currentTabColor}10 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(40px)'
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Sparkles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            style={{
              position: 'absolute',
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              borderRadius: '50%',
              background: currentTabColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Fixed Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 100,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)'
        }}
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <motion.span
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ←
          </motion.span>
          Back
        </motion.button>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center', flex: 1 }}
        >
          <motion.h1
            animate={{
              textShadow: [
                `0 0 20px ${currentTabColor}50`,
                `0 0 40px ${currentTabColor}80`,
                `0 0 20px ${currentTabColor}50`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              color: '#fff',
              fontSize: '28px',
              margin: 0,
              letterSpacing: '6px',
              fontWeight: '300'
            }}
          >
            PREMIUM STORE
          </motion.h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '11px',
            marginTop: '5px',
            letterSpacing: '3px'
          }}>
            EXCLUSIVE UPGRADES
          </p>
        </motion.div>

        {/* Balance Display */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.1))',
            padding: '10px 18px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}
        >
          <span style={{ fontSize: '20px' }}>🪙</span>
          <span style={{ color: 'gold', fontWeight: 'bold', fontSize: '16px' }}>
            {consumables.coins.toLocaleString()}
          </span>
        </motion.div>
      </motion.div>

      {/* Premium Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowPremiumModal(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          margin: '0 20px 20px',
          padding: '20px 30px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 10
        }}
      >
        {/* Shine effect */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1 }}>
          <motion.span
            style={{ fontSize: '40px' }}
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👑
          </motion.span>
          <div>
            <h3 style={{ margin: 0, color: 'gold', fontSize: '20px', letterSpacing: '2px' }}>
              ULTIMATE BUNDLE
            </h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              All themes, skins & AI modes • Save over 50%
            </p>
          </div>
        </div>
        <motion.div
          {...glowPulse}
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            padding: '14px 30px',
            borderRadius: '12px',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '20px',
            zIndex: 1
          }}
        >
          $19.99
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: premiumEase }}
        style={{
          display: 'flex',
          gap: '10px',
          padding: '0 20px 20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10
        }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 * index, duration: 0.4, ease: premiumEase }}
            whileHover={{
              scale: 1.08,
              y: -5,
              transition: { duration: 0.2, ease: premiumEase }
            }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
            style={{
              background: activeTab === tab.id
                ? `linear-gradient(135deg, ${tab.color}, ${tab.color}90)`
                : 'rgba(255,255,255,0.05)',
              border: activeTab === tab.id
                ? `2px solid ${tab.color}`
                : '1px solid rgba(255,255,255,0.1)',
              color: activeTab === tab.id ? '#000' : '#fff',
              padding: '14px 22px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              boxShadow: activeTab === tab.id
                ? `0 8px 32px ${tab.color}40, 0 0 20px ${tab.color}30, inset 0 1px 0 rgba(255,255,255,0.2)`
                : '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'background 0.4s cubic-bezier(0.22, 1, 0.36, 1), border 0.3s ease, box-shadow 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Tab shine effect */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabShine"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  pointerEvents: 'none'
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
              />
            )}
            <motion.span
              style={{ fontSize: '18px' }}
              animate={activeTab === tab.id ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {tab.icon}
            </motion.span>
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Scrollable Content Area */}
      <motion.div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 20px 100px',
          position: 'relative',
          zIndex: 10,
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {/* COINS TAB */}
            {activeTab === 'coins' && (
              <>
                {/* Balance Card */}
                <motion.div
                  variants={itemVariants}
                  style={{
                    gridColumn: '1 / -1',
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05))',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '24px',
                    padding: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '40px',
                    flexWrap: 'wrap'
                  }}
                >
                  {[
                    { icon: '🪙', value: consumables.coins, label: 'Coins', color: 'gold' },
                    { icon: '💡', value: consumables.hints, label: 'Hints', color: '#00bfff' },
                    { icon: '↩️', value: consumables.undos, label: 'Undos', color: '#8b5cf6' },
                    { icon: '🛡️', value: consumables.shields, label: 'Shields', color: '#00ff00' }
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ scale: 1.1, y: -5 }}
                      style={{ textAlign: 'center' }}
                    >
                      <motion.span
                        style={{ fontSize: '50px', display: 'block' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {item.icon}
                      </motion.span>
                      <p style={{
                        color: item.color,
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '10px 0 5px',
                        textShadow: `0 0 20px ${item.color}50`
                      }}>
                        {item.value.toLocaleString()}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '1px' }}>
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Coin Packs */}
                {COIN_PACKS.map((pack, i) => (
                  <PremiumCard
                    key={pack.id}
                    icon="🪙"
                    title={pack.name}
                    value={pack.coins.toLocaleString()}
                    subtitle="coins"
                    badge={pack.bonus}
                    badgeColor="#00ff00"
                    price={pack.price}
                    color="#ffd700"
                    index={i}
                    purchasing={purchasing === pack.id}
                    onPurchase={() => handlePurchase(pack.id)}
                  />
                ))}

                {/* Consumable Packs */}
                {CONSUMABLE_PACKS.map((pack, i) => {
                  const config = {
                    hints: { icon: '💡', color: '#00bfff' },
                    undos: { icon: '↩️', color: '#8b5cf6' },
                    shields: { icon: '🛡️', color: '#00ff00' }
                  };
                  return (
                    <PremiumCard
                      key={pack.id}
                      icon={config[pack.type].icon}
                      title={pack.name}
                      value={`${pack.amount}x`}
                      subtitle={pack.type}
                      price={pack.price}
                      color={config[pack.type].color}
                      index={i + COIN_PACKS.length}
                      purchasing={purchasing === pack.id}
                      onPurchase={() => handlePurchase(pack.id)}
                    />
                  );
                })}
              </>
            )}

            {/* SPINS TAB */}
            {activeTab === 'spins' && (
              <>
                {/* Lucky Spin Hero Card */}
                <motion.div
                  variants={itemVariants}
                  style={{
                    gridColumn: '1 / -1',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(255, 107, 53, 0.2), rgba(255, 215, 0, 0.1))',
                    border: '2px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: '24px',
                    padding: '40px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'conic-gradient(from 0deg, transparent, rgba(255,215,0,0.1), transparent, rgba(139,92,246,0.1), transparent)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />

                  <motion.span
                    style={{ fontSize: '80px', display: 'block', position: 'relative', zIndex: 1 }}
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🎰
                  </motion.span>

                  <h2 style={{
                    color: '#fff',
                    fontSize: '32px',
                    margin: '20px 0 10px',
                    textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    LUCKY SPIN
                  </h2>

                  <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    You have <span style={{ color: 'gold', fontWeight: 'bold', fontSize: '24px' }}>{consumables.spins}</span> spins
                  </p>

                  <motion.button
                    onClick={() => setShowLuckySpin(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...glowPulse}
                    style={{
                      padding: '18px 50px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#000',
                      cursor: 'pointer',
                      letterSpacing: '2px',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    SPIN NOW
                  </motion.button>
                </motion.div>

                {/* Spin Packs */}
                {SPIN_PACKS.map((pack, i) => (
                  <PremiumCard
                    key={pack.id}
                    icon="🎰"
                    title={pack.name}
                    value={pack.spins.toString()}
                    subtitle={pack.spins === 1 ? 'spin' : 'spins'}
                    badge={pack.bonus}
                    badgeColor="#ff6b35"
                    subtext={pack.coinPrice ? `or ${pack.coinPrice} coins` : null}
                    price={pack.price}
                    color="#8b5cf6"
                    index={i}
                    purchasing={purchasing === pack.id}
                    onPurchase={() => handlePurchase(pack.id)}
                  />
                ))}

                {/* Odds Disclosure */}
                <motion.div
                  variants={itemVariants}
                  style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)'
                  }}
                >
                  <strong style={{ color: '#fff', fontSize: '12px' }}>Reward Probabilities:</strong>
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {[
                      { label: 'Common', items: '50 Coins 30%, 100 Coins 20%', color: '#a0a0a0' },
                      { label: 'Uncommon', items: '1 Hint 15%, 3 Hints 10%, 1 Undo 10%', color: '#00bfff' },
                      { label: 'Rare', items: 'Theme Trial 8%, Skin Trial 5%', color: '#8b5cf6' },
                      { label: 'Epic', items: 'Permanent Theme 1.5%', color: '#ff6b35' },
                      { label: 'Legendary', items: 'Permanent Skin 0.4%', color: '#ffd700' },
                      { label: 'Mythic', items: '500 Coins 0.1%', color: '#ff00ff' }
                    ].map(tier => (
                      <span key={tier.label} style={{
                        background: `${tier.color}20`,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: `1px solid ${tier.color}40`
                      }}>
                        <span style={{ color: tier.color, fontWeight: 'bold' }}>{tier.label}:</span> {tier.items}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* THEMES TAB */}
            {activeTab === 'themes' && (
              <>
                {Object.values(themes).map((theme, i) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    index={i}
                    owned={owned.themes?.includes(theme.id)}
                    selected={selected.theme === theme.id}
                    purchasing={purchasing === `theme_${theme.id}`}
                    onPurchase={() => handlePurchase(`theme_${theme.id}`)}
                    onSelect={() => handleSelect('themes', theme.id)}
                  />
                ))}
              </>
            )}

            {/* SKINS TAB */}
            {activeTab === 'skins' && (
              <>
                {Object.values(skins).map((skin, i) => (
                  <SkinCard
                    key={skin.id}
                    skin={skin}
                    index={i}
                    owned={owned.skins?.includes(skin.id)}
                    selected={selected.skin === skin.id}
                    purchasing={purchasing === `skin_${skin.id}`}
                    onPurchase={() => handlePurchase(`skin_${skin.id}`)}
                    onSelect={() => handleSelect('skins', skin.id)}
                    onPreview={() => setPreviewSkin(skin.id)}
                  />
                ))}
              </>
            )}

            {/* DIFFICULTY TAB */}
            {activeTab === 'difficulty' && (
              <>
                {Object.values(difficultyConfig).map((diff, i) => (
                  <DifficultyCard
                    key={diff.id}
                    difficulty={diff}
                    index={i}
                    owned={owned.difficulties?.includes(diff.id)}
                    selected={selected.difficulty === diff.id}
                    purchasing={purchasing === 'difficulty_pack'}
                    onPurchase={() => handlePurchase('difficulty_pack')}
                    onSelect={() => handleSelect('difficulties', diff.id)}
                  />
                ))}
              </>
            )}

            {/* BUNDLES TAB */}
            {activeTab === 'bundles' && (
              <>
                {/* Mega Bundles */}
                {MEGA_BUNDLES.map((bundle, i) => (
                  <MegaBundleCard
                    key={bundle.id}
                    bundle={bundle}
                    index={i}
                    purchasing={purchasing === bundle.id}
                    onPurchase={() => handlePurchase(bundle.id)}
                  />
                ))}

                {/* Durable Bundles */}
                <BundleCard
                  bundle={themeBundle}
                  icon="🎨"
                  owned={owned.themes?.length >= 5}
                  purchasing={purchasing === 'theme_bundle'}
                  onPurchase={() => handlePurchase('theme_bundle')}
                  color="#06b6d4"
                />
                <BundleCard
                  bundle={skinBundle}
                  icon="✨"
                  owned={owned.skins?.length >= 4}
                  purchasing={purchasing === 'skin_bundle'}
                  onPurchase={() => handlePurchase('skin_bundle')}
                  color="#8b5cf6"
                />
                <BundleCard
                  bundle={difficultyPack}
                  icon="🤖"
                  owned={owned.difficulties?.length >= 4}
                  purchasing={purchasing === 'difficulty_pack'}
                  onPurchase={() => handlePurchase('difficulty_pack')}
                  color="#00ff00"
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Skin Preview Modal */}
      <AnimatePresence>
        {previewSkin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewSkin(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200
            }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex',
                gap: '80px',
                padding: '60px'
              }}
            >
              <motion.div
                style={{ width: '180px', height: '180px' }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <UnitX skin={previewSkin} />
              </motion.div>
              <motion.div
                style={{ width: '180px', height: '180px' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CoreO skin={previewSkin} />
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: 'rgba(255,255,255,0.5)', marginTop: '20px' }}
            >
              Tap anywhere to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Bundle Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPremiumModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 100, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.7, y: 100, rotateX: -20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '500px',
                width: '100%',
                padding: '50px 40px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.98), rgba(40, 30, 60, 0.98))',
                border: '3px solid gold',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Rotating glow */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: -50,
                  background: 'conic-gradient(from 0deg, transparent, rgba(255,215,0,0.1), transparent, rgba(139,92,246,0.1), transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />

              <motion.span
                style={{ fontSize: '80px', display: 'block', position: 'relative', zIndex: 1 }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.span>

              <motion.h2
                style={{
                  color: 'gold',
                  fontSize: '32px',
                  margin: '25px 0 15px',
                  letterSpacing: '4px',
                  position: 'relative',
                  zIndex: 1
                }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,215,0,0.5)',
                    '0 0 40px rgba(255,215,0,0.8)',
                    '0 0 20px rgba(255,215,0,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ULTIMATE BUNDLE
              </motion.h2>

              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
                Unlock everything in XO Arena
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '30px',
                position: 'relative',
                zIndex: 1
              }}>
                {[
                  { icon: '🎨', label: '4 Themes', value: '$11.96' },
                  { icon: '✨', label: '3 Skins', value: '$11.97' },
                  { icon: '🤖', label: '3 AI Modes', value: '$4.99' }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{
                      padding: '20px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <span style={{ fontSize: '30px' }}>{item.icon}</span>
                    <p style={{ color: '#fff', margin: '10px 0 5px', fontSize: '14px', fontWeight: 'bold' }}>{item.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{item.value} value</p>
                  </motion.div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontSize: '20px' }}>
                  $28.92
                </span>
                <motion.span
                  style={{ color: 'gold', fontSize: '42px', fontWeight: 'bold' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  $19.99
                </motion.span>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,200,0,0.2))',
                  color: '#00ff00',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  SAVE 31%
                </span>
              </div>

              <motion.button
                onClick={() => {
                  handlePurchase('premium_bundle');
                  setShowPremiumModal(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={purchasing === 'premium_bundle'}
                {...glowPulse}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#000',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  letterSpacing: '3px',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {purchasing === 'premium_bundle' ? 'PROCESSING...' : 'UNLOCK EVERYTHING'}
              </motion.button>

              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPremiumModal(false);
                }}
                whileHover={{ scale: 1.05, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '20px',
                  padding: '12px 30px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Maybe later
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lucky Spin Modal */}
      <AnimatePresence>
        {showLuckySpin && (
          <LuckySpin
            onClose={() => setShowLuckySpin(false)}
            onUpdate={() => {
              updateConsumables();
              updateOwnedItems();
              if (onPurchaseComplete) onPurchaseComplete();
            }}
          />
        )}
      </AnimatePresence>

      {/* Dev Mode Notice */}
      {!isStoreAvailable() && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '10px',
            zIndex: 100
          }}
        >
          Development mode • Purchases simulated
        </motion.p>
      )}
    </motion.div>
  );
};

// Premium Card Component
const PremiumCard = ({ icon, title, value, subtitle, badge, badgeColor, subtext, price, color, index, purchasing, onPurchase }) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      style={{
        padding: '30px',
        borderRadius: '24px',
        background: `linear-gradient(145deg, ${color}18, ${color}08, rgba(0,0,0,0.2))`,
        border: `2px solid ${color}40`,
        backdropFilter: 'blur(15px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Animated border glow */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '26px',
          background: `linear-gradient(135deg, ${color}60, transparent, ${color}40)`,
          opacity: 0,
          zIndex: -1
        }}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.4 } }
        }}
      />

      {/* Glow effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at 50% 50%, ${color}25 0%, transparent 50%)`,
          opacity: 0
        }}
        variants={{
          rest: { opacity: 0, scale: 0.8 },
          hover: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
        }}
      />

      {/* Shine sweep effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
          pointerEvents: 'none'
        }}
        variants={{
          rest: { x: '-100%' },
          hover: { x: '100%', transition: { duration: 0.6, ease: 'easeInOut' } }
        }}
      />

      <motion.span
        style={{ fontSize: '55px', display: 'block', position: 'relative', zIndex: 1 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
      >
        {icon}
      </motion.span>

      <h3 style={{ margin: '15px 0 8px', color, fontSize: '18px', fontWeight: '600', position: 'relative', zIndex: 1 }}>
        {title}
      </h3>

      <p style={{
        margin: '0',
        color: '#fff',
        fontSize: '32px',
        fontWeight: 'bold',
        position: 'relative',
        zIndex: 1
      }}>
        {value}
      </p>

      <p style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: '12px',
        marginTop: '2px',
        position: 'relative',
        zIndex: 1
      }}>
        {subtitle}
      </p>

      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            display: 'inline-block',
            marginTop: '10px',
            background: `${badgeColor}25`,
            color: badgeColor,
            padding: '5px 14px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            border: `1px solid ${badgeColor}40`,
            position: 'relative',
            zIndex: 1
          }}
        >
          {badge}
        </motion.span>
      )}

      {subtext && (
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '11px',
          marginTop: '8px',
          position: 'relative',
          zIndex: 1
        }}>
          {subtext}
        </p>
      )}

      <motion.button
        onClick={onPurchase}
        disabled={purchasing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '16px',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          border: 'none',
          borderRadius: '14px',
          color: '#000',
          cursor: purchasing ? 'wait' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          opacity: purchasing ? 0.7 : 1,
          position: 'relative',
          zIndex: 1,
          boxShadow: `0 4px 20px ${color}40`
        }}
      >
        {purchasing ? 'Processing...' : `$${price.toFixed(2)}`}
      </motion.button>
    </motion.div>
  );
};

// Theme Card Component
const ThemeCard = ({ theme, index, owned, selected, purchasing, onPurchase, onSelect }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        border: selected ? '3px solid #06b6d4' : '2px solid rgba(255,255,255,0.1)',
        background: 'rgba(20, 20, 40, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: selected ? '0 0 30px rgba(6, 182, 212, 0.3)' : 'none'
      }}
    >
      {/* Theme Preview */}
      <div style={{
        height: '140px',
        background: theme.colors.bg,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            fontSize: '50px',
            color: theme.colors.x,
            fontWeight: 'bold',
            textShadow: `0 0 30px ${theme.colors.x}`
          }}
        >
          X
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            fontSize: '50px',
            color: theme.colors.o,
            fontWeight: 'bold',
            textShadow: `0 0 30px ${theme.colors.o}`
          }}
        >
          O
        </motion.div>

        {!theme.free && !owned && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,140,0,0.9))',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '10px',
              color: '#000',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            PREMIUM
          </motion.div>
        )}
      </div>

      <div style={{ padding: '25px' }}>
        <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '20px', fontWeight: '600' }}>
          {theme.name}
        </h3>
        <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          {theme.description}
        </p>

        {owned ? (
          <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '14px',
              background: selected ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'transparent',
              border: selected ? 'none' : '2px solid rgba(6, 182, 212, 0.5)',
              borderRadius: '12px',
              color: selected ? '#000' : '#06b6d4',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {selected ? '✓ ACTIVE' : 'APPLY THEME'}
          </motion.button>
        ) : theme.free ? (
          <div style={{
            padding: '14px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px'
          }}>
            Default Theme
          </div>
        ) : (
          <motion.button
            onClick={onPurchase}
            disabled={purchasing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              cursor: purchasing ? 'wait' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: purchasing ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)'
            }}
          >
            {purchasing ? 'Processing...' : `$${theme.price?.toFixed(2) || '2.99'}`}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Skin Card Component
const SkinCard = ({ skin, index, owned, selected, purchasing, onPurchase, onSelect, onPreview }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        border: selected ? '3px solid #8b5cf6' : '2px solid rgba(255,255,255,0.1)',
        background: 'rgba(20, 20, 40, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: selected ? '0 0 30px rgba(139, 92, 246, 0.3)' : 'none'
      }}
    >
      {/* Skin Preview */}
      <motion.div
        onClick={onPreview}
        whileHover={{ scale: 1.02 }}
        style={{
          height: '160px',
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2), transparent)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <motion.div
          style={{ width: '70px', height: '70px' }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <UnitX skin={skin.id} />
        </motion.div>
        <motion.div
          style={{ width: '70px', height: '70px' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <CoreO skin={skin.id} />
        </motion.div>

        {!skin.free && !owned && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,140,0,0.9))',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '10px',
              color: '#000',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            ✨ PREMIUM
          </motion.div>
        )}

        <div style={{
          position: 'absolute',
          bottom: '10px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)'
        }}>
          Tap to preview
        </div>
      </motion.div>

      <div style={{ padding: '25px' }}>
        <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '20px', fontWeight: '600' }}>
          {skin.name}
        </h3>
        <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          {skin.description}
        </p>

        {owned ? (
          <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '14px',
              background: selected ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
              border: selected ? 'none' : '2px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '12px',
              color: selected ? '#fff' : '#8b5cf6',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {selected ? '✓ EQUIPPED' : 'EQUIP SKIN'}
          </motion.button>
        ) : skin.free ? (
          <div style={{
            padding: '14px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px'
          }}>
            Default Skin
          </div>
        ) : (
          <motion.button
            onClick={onPurchase}
            disabled={purchasing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #ff6b35, #ffd700)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              cursor: purchasing ? 'wait' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: purchasing ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)'
            }}
          >
            {purchasing ? 'Processing...' : `$${skin.price?.toFixed(2) || '3.99'}`}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Difficulty Card Component
const DifficultyCard = ({ difficulty, index, owned, selected, purchasing, onPurchase, onSelect }) => {
  const config = {
    rookie: { icon: '🎮', color: '#00ff00' },
    pro: { icon: '🎯', color: '#00bfff' },
    grandmaster: { icon: '🧠', color: '#8b5cf6' },
    chaos: { icon: '🎲', color: '#ff6b35' }
  };

  const { icon, color } = config[difficulty.id] || { icon: '🤖', color: '#fff' };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        padding: '30px',
        borderRadius: '24px',
        border: selected ? `3px solid ${color}` : '2px solid rgba(255,255,255,0.1)',
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        boxShadow: selected ? `0 0 30px ${color}40` : 'none'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: difficulty.id === 'chaos' ? [0, 15, -15, 0] : 0
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: '60px', marginBottom: '15px' }}
      >
        {icon}
      </motion.div>

      <h3 style={{
        margin: '0 0 10px',
        color,
        fontSize: '22px',
        fontWeight: '600',
        textShadow: `0 0 20px ${color}50`
      }}>
        {difficulty.name}
      </h3>

      <p style={{ margin: '0 0 25px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
        {difficulty.description}
      </p>

      {owned || difficulty.free ? (
        <motion.button
          onClick={onSelect}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '14px',
            background: selected ? color : 'transparent',
            border: `2px solid ${color}`,
            borderRadius: '12px',
            color: selected ? '#000' : color,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {selected ? '✓ SELECTED' : difficulty.free ? 'FREE' : 'SELECT'}
        </motion.button>
      ) : (
        <div style={{ position: 'relative' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,215,0,0.2)',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '10px',
              color: 'gold',
              border: '1px solid rgba(255,215,0,0.3)'
            }}
          >
            🔒 LOCKED
          </motion.div>
          <motion.button
            onClick={onPurchase}
            disabled={purchasing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '12px',
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              cursor: purchasing ? 'wait' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: purchasing ? 0.7 : 1,
              boxShadow: `0 4px 20px ${color}40`
            }}
          >
            {purchasing ? 'Processing...' : 'UNLOCK ALL $4.99'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

// Bundle Card Component
const BundleCard = ({ bundle, icon, owned, purchasing, onPurchase, color }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        padding: '30px',
        borderRadius: '24px',
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        border: `2px solid ${color}40`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <motion.span
          style={{ fontSize: '50px' }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.span>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '600' }}>
            {bundle.name}
          </h3>
          <p style={{ margin: '5px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            {bundle.description}
          </p>
        </div>
      </div>

      {owned ? (
        <div style={{
          padding: '14px',
          background: 'rgba(0,255,0,0.15)',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#00ff00',
          fontWeight: 'bold',
          border: '1px solid rgba(0,255,0,0.3)'
        }}>
          ✓ OWNED
        </div>
      ) : (
        <motion.button
          onClick={onPurchase}
          disabled={purchasing}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '16px',
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            cursor: purchasing ? 'wait' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: purchasing ? 0.7 : 1,
            boxShadow: `0 4px 20px ${color}40`
          }}
        >
          {purchasing ? 'Processing...' : `$${bundle.price.toFixed(2)}`}
        </motion.button>
      )}
    </motion.div>
  );
};

// Mega Bundle Card Component
const MegaBundleCard = ({ bundle, index, purchasing, onPurchase }) => {
  const config = [
    { icon: '🚀', color: '#00bfff', label: 'STARTER' },
    { icon: '⚡', color: '#ffd700', label: 'PRO' },
    { icon: '👑', color: '#ff6b35', label: 'BEST VALUE' }
  ];

  const { icon, color, label } = config[index];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        padding: '30px',
        borderRadius: '24px',
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        border: `2px solid ${color}50`,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {index === 2 && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '15px',
            right: '-25px',
            background: 'gold',
            color: '#000',
            padding: '5px 40px',
            fontSize: '10px',
            fontWeight: 'bold',
            transform: 'rotate(45deg)',
            letterSpacing: '1px'
          }}
        >
          {label}
        </motion.div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <motion.span
          style={{ fontSize: '50px' }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.span>
        <div>
          <h3 style={{ margin: 0, color, fontSize: '22px', fontWeight: '600' }}>
            {bundle.name}
          </h3>
          <p style={{ margin: '5px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            {bundle.description}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {bundle.contents.coins && (
          <span style={{
            background: 'rgba(255,215,0,0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: 'gold',
            border: '1px solid rgba(255,215,0,0.3)'
          }}>
            🪙 {bundle.contents.coins.toLocaleString()}
          </span>
        )}
        {bundle.contents.hints && (
          <span style={{
            background: 'rgba(0,191,255,0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#00bfff',
            border: '1px solid rgba(0,191,255,0.3)'
          }}>
            💡 {bundle.contents.hints}
          </span>
        )}
        {bundle.contents.undos && (
          <span style={{
            background: 'rgba(139,92,246,0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#8b5cf6',
            border: '1px solid rgba(139,92,246,0.3)'
          }}>
            ↩️ {bundle.contents.undos}
          </span>
        )}
        {bundle.contents.spins && (
          <span style={{
            background: 'rgba(255,107,53,0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#ff6b35',
            border: '1px solid rgba(255,107,53,0.3)'
          }}>
            🎰 {bundle.contents.spins}
          </span>
        )}
        {bundle.contents.shields && (
          <span style={{
            background: 'rgba(0,255,0,0.2)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#00ff00',
            border: '1px solid rgba(0,255,0,0.3)'
          }}>
            🛡️ {bundle.contents.shields}
          </span>
        )}
      </div>

      <motion.button
        onClick={onPurchase}
        disabled={purchasing}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          padding: '16px',
          background: `linear-gradient(135deg, ${color}, ${config[(index + 1) % 3].color})`,
          border: 'none',
          borderRadius: '14px',
          color: '#000',
          cursor: purchasing ? 'wait' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          opacity: purchasing ? 0.7 : 1,
          boxShadow: `0 4px 20px ${color}50`
        }}
      >
        {purchasing ? 'Processing...' : `$${bundle.price.toFixed(2)}`}
      </motion.button>
    </motion.div>
  );
};

export default StoreScreen;
