import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { themes, themeBundle } from '../themes/themes';
import { skins, skinBundle } from '../themes/skins';
import { difficultyConfig, difficultyPack } from '../logic/minimax';
import { isItemOwned, premiumBundle, getSelectedItems, setSelectedItem } from '../store/purchases';
import { purchaseProduct, isStoreAvailable } from '../store/msStore';
import UnitX from './UnitX';
import CoreO from './CoreO';

const StoreScreen = ({ onBack, onPurchaseComplete }) => {
  const [activeTab, setActiveTab] = useState('themes');
  const [purchasing, setPurchasing] = useState(null);
  const [owned, setOwned] = useState({});
  const [selected, setSelected] = useState(getSelectedItems());
  const [previewSkin, setPreviewSkin] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    updateOwnedItems();
  }, []);

  const updateOwnedItems = () => {
    const ownedItems = {
      themes: Object.keys(themes).filter(id => isItemOwned('themes', id)),
      skins: Object.keys(skins).filter(id => isItemOwned('skins', id)),
      difficulties: Object.keys(difficultyConfig).filter(id => isItemOwned('difficulties', id))
    };
    setOwned(ownedItems);
  };

  const handlePurchase = async (productKey) => {
    setPurchasing(productKey);
    try {
      const result = await purchaseProduct(productKey);
      if (result.success) {
        updateOwnedItems();
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
    { id: 'themes', label: 'THEMES', icon: '🎨' },
    { id: 'skins', label: 'SKINS', icon: '✨' },
    { id: 'difficulty', label: 'AI MODES', icon: '🤖' },
    { id: 'bundles', label: 'BUNDLES', icon: '👑' }
  ];

  return (
    <motion.div
      className="store-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(180deg, var(--bg-app) 0%, rgba(15, 23, 42, 0.95) 100%)',
        position: 'relative',
        overflow: 'auto'
      }}
    >
      {/* Animated Background Particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--color-cyan)' : 'var(--color-violet)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            backdropFilter: 'blur(10px)'
          }}
        >
          ← Back
        </motion.button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              color: 'var(--text-primary)',
              fontSize: '32px',
              margin: 0,
              letterSpacing: '8px',
              fontWeight: '200',
              textShadow: '0 0 30px rgba(6, 182, 212, 0.5)'
            }}
          >
            STORE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '5px', letterSpacing: '2px' }}
          >
            PREMIUM UPGRADES
          </motion.p>
        </div>
        <div style={{ width: '100px' }}></div>
      </div>

      {/* Premium Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setShowPremiumModal(true)}
        style={{
          width: '100%',
          maxWidth: '900px',
          padding: '20px 30px',
          marginBottom: '30px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1 }}>
          <span style={{ fontSize: '36px' }}>👑</span>
          <div>
            <h3 style={{ margin: 0, color: 'gold', fontSize: '18px', letterSpacing: '2px' }}>ULTIMATE BUNDLE</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
              All themes, skins & AI modes • Save over 50%
            </p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            padding: '12px 28px',
            borderRadius: '10px',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '18px',
            zIndex: 1
          }}
        >
          $19.99
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, var(--color-cyan), var(--color-violet))'
                : 'rgba(255,255,255,0.05)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              padding: '14px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '13px',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            width: '100%',
            maxWidth: '900px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
            position: 'relative',
            zIndex: 10
          }}
        >
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

          {activeTab === 'bundles' && (
            <>
              <BundleCard
                bundle={themeBundle}
                icon="🎨"
                owned={owned.themes?.length >= 5}
                purchasing={purchasing === 'theme_bundle'}
                onPurchase={() => handlePurchase('theme_bundle')}
                gradient="linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))"
              />
              <BundleCard
                bundle={skinBundle}
                icon="✨"
                owned={owned.skins?.length >= 4}
                purchasing={purchasing === 'skin_bundle'}
                onPurchase={() => handlePurchase('skin_bundle')}
                gradient="linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(255, 215, 0, 0.2))"
              />
              <BundleCard
                bundle={difficultyPack}
                icon="🤖"
                owned={owned.difficulties?.length >= 4}
                purchasing={purchasing === 'difficulty_pack'}
                onPurchase={() => handlePurchase('difficulty_pack')}
                gradient="linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 191, 255, 0.2))"
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

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
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex',
                gap: '60px',
                padding: '60px'
              }}
            >
              <div style={{ width: '150px', height: '150px' }}>
                <UnitX skin={previewSkin} />
              </div>
              <div style={{ width: '150px', height: '150px' }}>
                <CoreO skin={previewSkin} />
              </div>
            </motion.div>
            <p style={{ position: 'absolute', bottom: '40px', color: 'var(--text-secondary)' }}>
              Click anywhere to close
            </p>
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
              zIndex: 100,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '500px',
                width: '100%',
                padding: '40px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                border: '2px solid gold',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.05), transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />

              <span style={{ fontSize: '60px' }}>👑</span>
              <h2 style={{ color: 'gold', fontSize: '28px', margin: '20px 0 10px', letterSpacing: '3px' }}>
                ULTIMATE BUNDLE
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Unlock everything in XO Arena
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🎨</span>
                  <p style={{ color: 'var(--text-primary)', margin: '8px 0 0', fontSize: '14px' }}>4 Themes</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>$11.96 value</p>
                </div>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✨</span>
                  <p style={{ color: 'var(--text-primary)', margin: '8px 0 0', fontSize: '14px' }}>3 Skins</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>$11.97 value</p>
                </div>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🤖</span>
                  <p style={{ color: 'var(--text-primary)', margin: '8px 0 0', fontSize: '14px' }}>3 AI Modes</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>$4.99 value</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', fontSize: '18px' }}>
                  $28.92
                </span>
                <span style={{ color: 'gold', fontSize: '36px', fontWeight: 'bold' }}>
                  $19.99
                </span>
                <span style={{
                  background: 'rgba(0,255,0,0.2)',
                  color: '#00ff00',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px'
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
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  letterSpacing: '2px'
                }}
              >
                {purchasing === 'premium_bundle' ? 'PROCESSING...' : 'UNLOCK EVERYTHING'}
              </motion.button>

              <motion.button
                onClick={() => setShowPremiumModal(false)}
                whileHover={{ opacity: 0.8 }}
                style={{
                  marginTop: '15px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Maybe later
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isStoreAvailable() && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '11px',
          marginTop: '30px',
          textAlign: 'center',
          opacity: 0.5
        }}>
          Development mode • Purchases simulated
        </p>
      )}
    </motion.div>
  );
};

// Theme Card Component
const ThemeCard = ({ theme, index, owned, selected, purchasing, onPurchase, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        padding: '0',
        borderRadius: '16px',
        overflow: 'hidden',
        border: selected ? '2px solid var(--color-accent)' : '1px solid var(--glass-border)',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Theme Preview */}
      <div style={{
        height: '120px',
        background: theme.colors.bg,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ fontSize: '40px', color: theme.colors.x, fontWeight: 'bold', textShadow: `0 0 20px ${theme.colors.x}` }}
        >
          X
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '40px', color: theme.colors.o, fontWeight: 'bold', textShadow: `0 0 20px ${theme.colors.o}` }}
        >
          O
        </motion.div>
        {!theme.free && !owned && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'gold'
          }}>
            PREMIUM
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 5px', color: 'var(--text-primary)', fontSize: '18px' }}>
          {theme.name}
        </h3>
        <p style={{ margin: '0 0 15px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          {theme.description}
        </p>

        {owned ? (
          <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '12px',
              background: selected ? 'var(--color-accent)' : 'transparent',
              border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--glass-border)'}`,
              borderRadius: '10px',
              color: selected ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: selected ? 'bold' : 'normal'
            }}
          >
            {selected ? '✓ ACTIVE' : 'APPLY THEME'}
          </motion.button>
        ) : theme.free ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '12px' }}>
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
              padding: '12px',
              background: 'linear-gradient(135deg, var(--color-cyan), var(--color-violet))',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              cursor: purchasing ? 'wait' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: purchasing ? 0.7 : 1
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        padding: '0',
        borderRadius: '16px',
        overflow: 'hidden',
        border: selected ? '2px solid var(--color-accent)' : '1px solid var(--glass-border)',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Skin Preview */}
      <div
        onClick={onPreview}
        style={{
          height: '140px',
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.8), var(--bg-app))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <div style={{ width: '60px', height: '60px' }}>
          <UnitX skin={skin.id} />
        </div>
        <div style={{ width: '60px', height: '60px' }}>
          <CoreO skin={skin.id} />
        </div>
        {!skin.free && !owned && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.3))',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'gold',
            border: '1px solid rgba(255,215,0,0.3)'
          }}>
            ✨ PREMIUM
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          opacity: 0.7
        }}>
          Click to preview
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 5px', color: 'var(--text-primary)', fontSize: '18px' }}>
          {skin.name}
        </h3>
        <p style={{ margin: '0 0 15px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          {skin.description}
        </p>

        {owned ? (
          <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '12px',
              background: selected ? 'var(--color-accent)' : 'transparent',
              border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--glass-border)'}`,
              borderRadius: '10px',
              color: selected ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: selected ? 'bold' : 'normal'
            }}
          >
            {selected ? '✓ EQUIPPED' : 'EQUIP SKIN'}
          </motion.button>
        ) : skin.free ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '12px' }}>
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
              padding: '12px',
              background: 'linear-gradient(135deg, #ff6b35, #ffd700)',
              border: 'none',
              borderRadius: '10px',
              color: '#000',
              cursor: purchasing ? 'wait' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: purchasing ? 0.7 : 1
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
  const icons = {
    rookie: '🎮',
    pro: '🎯',
    grandmaster: '🧠',
    chaos: '🎲'
  };

  const colors = {
    rookie: '#00ff00',
    pro: '#00bfff',
    grandmaster: '#8b5cf6',
    chaos: '#ff6b35'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        padding: '25px',
        borderRadius: '16px',
        border: selected ? `2px solid ${colors[difficulty.id]}` : '1px solid var(--glass-border)',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: difficulty.id === 'chaos' ? [0, 10, -10, 0] : 0
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: '50px', marginBottom: '15px' }}
      >
        {icons[difficulty.id]}
      </motion.div>

      <h3 style={{
        margin: '0 0 8px',
        color: colors[difficulty.id],
        fontSize: '20px',
        textShadow: `0 0 20px ${colors[difficulty.id]}40`
      }}>
        {difficulty.name}
      </h3>
      <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
        {difficulty.description}
      </p>

      {owned ? (
        <motion.button
          onClick={onSelect}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '12px',
            background: selected ? colors[difficulty.id] : 'transparent',
            border: `1px solid ${colors[difficulty.id]}`,
            borderRadius: '10px',
            color: selected ? '#000' : colors[difficulty.id],
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: selected ? 'bold' : 'normal'
          }}
        >
          {selected ? '✓ SELECTED' : 'SELECT'}
        </motion.button>
      ) : difficulty.free ? (
        <motion.button
          onClick={onSelect}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '12px',
            background: selected ? colors[difficulty.id] : 'transparent',
            border: `1px solid ${colors[difficulty.id]}`,
            borderRadius: '10px',
            color: selected ? '#000' : colors[difficulty.id],
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {selected ? '✓ SELECTED' : 'FREE'}
        </motion.button>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,215,0,0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            color: 'gold'
          }}>
            🔒 LOCKED
          </div>
          <motion.button
            onClick={onPurchase}
            disabled={purchasing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              background: 'linear-gradient(135deg, var(--color-cyan), var(--color-violet))',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              cursor: purchasing ? 'wait' : 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
              opacity: purchasing ? 0.7 : 1
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
const BundleCard = ({ bundle, icon, owned, purchasing, onPurchase, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        padding: '30px',
        borderRadius: '16px',
        background: gradient,
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <span style={{ fontSize: '40px' }}>{icon}</span>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px' }}>
            {bundle.name}
          </h3>
          <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {bundle.description}
          </p>
        </div>
      </div>

      {owned ? (
        <div style={{
          padding: '12px',
          background: 'rgba(0,255,0,0.1)',
          borderRadius: '10px',
          textAlign: 'center',
          color: '#00ff00',
          fontWeight: 'bold'
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
            padding: '14px',
            background: 'linear-gradient(135deg, var(--color-cyan), var(--color-violet))',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            cursor: purchasing ? 'wait' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: purchasing ? 0.7 : 1
          }}
        >
          {purchasing ? 'Processing...' : `$${bundle.price.toFixed(2)}`}
        </motion.button>
      )}
    </motion.div>
  );
};

export default StoreScreen;
