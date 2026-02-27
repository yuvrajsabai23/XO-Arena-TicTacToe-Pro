// Coin Economy Manager for XO Arena
// Handles coins, hints, undos, shields, and spins

const COIN_STORAGE_KEY = 'xo_arena_coins';
const CONSUMABLES_KEY = 'xo_arena_consumables';
const STATS_KEY = 'xo_arena_stats';

// Default starting values for new users
const DEFAULT_CONSUMABLES = {
  coins: 100,      // Start with 100 free coins
  hints: 3,        // Start with 3 free hints
  undos: 2,        // Start with 2 free undos
  shields: 0,      // No free shields
  spins: 1         // 1 free spin to try
};

const DEFAULT_STATS = {
  totalCoinsEarned: 100,
  totalCoinsSpent: 0,
  totalSpins: 0,
  winStreak: 0,
  bestWinStreak: 0,
  hintsUsed: 0,
  undosUsed: 0
};

// Get current consumables
export const getConsumables = () => {
  try {
    const stored = localStorage.getItem(CONSUMABLES_KEY);
    if (stored) {
      return { ...DEFAULT_CONSUMABLES, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading consumables:', e);
  }
  return { ...DEFAULT_CONSUMABLES };
};

// Save consumables
export const saveConsumables = (consumables) => {
  try {
    localStorage.setItem(CONSUMABLES_KEY, JSON.stringify(consumables));
  } catch (e) {
    console.error('Error saving consumables:', e);
  }
};

// Get stats
export const getStats = () => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return { ...DEFAULT_STATS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading stats:', e);
  }
  return { ...DEFAULT_STATS };
};

// Save stats
export const saveStats = (stats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats:', e);
  }
};

// ============ COIN OPERATIONS ============

export const getCoins = () => {
  return getConsumables().coins;
};

export const addCoins = (amount) => {
  const consumables = getConsumables();
  const stats = getStats();

  consumables.coins += amount;
  stats.totalCoinsEarned += amount;

  saveConsumables(consumables);
  saveStats(stats);

  return consumables.coins;
};

export const spendCoins = (amount) => {
  const consumables = getConsumables();
  const stats = getStats();

  if (consumables.coins < amount) {
    return { success: false, balance: consumables.coins };
  }

  consumables.coins -= amount;
  stats.totalCoinsSpent += amount;

  saveConsumables(consumables);
  saveStats(stats);

  return { success: true, balance: consumables.coins };
};

export const hasEnoughCoins = (amount) => {
  return getCoins() >= amount;
};

// ============ HINT OPERATIONS ============

export const getHints = () => {
  return getConsumables().hints;
};

export const addHints = (amount) => {
  const consumables = getConsumables();
  consumables.hints += amount;
  saveConsumables(consumables);
  return consumables.hints;
};

export const useHint = () => {
  const consumables = getConsumables();
  const stats = getStats();

  if (consumables.hints <= 0) {
    return { success: false, remaining: 0 };
  }

  consumables.hints -= 1;
  stats.hintsUsed += 1;

  saveConsumables(consumables);
  saveStats(stats);

  return { success: true, remaining: consumables.hints };
};

// Buy hint with coins
export const buyHintWithCoins = () => {
  const HINT_COST = 50;
  const result = spendCoins(HINT_COST);

  if (result.success) {
    addHints(1);
    return { success: true, coinsLeft: result.balance };
  }

  return { success: false, coinsLeft: result.balance };
};

// ============ UNDO OPERATIONS ============

export const getUndos = () => {
  return getConsumables().undos;
};

export const addUndos = (amount) => {
  const consumables = getConsumables();
  consumables.undos += amount;
  saveConsumables(consumables);
  return consumables.undos;
};

export const useUndo = () => {
  const consumables = getConsumables();
  const stats = getStats();

  if (consumables.undos <= 0) {
    return { success: false, remaining: 0 };
  }

  consumables.undos -= 1;
  stats.undosUsed += 1;

  saveConsumables(consumables);
  saveStats(stats);

  return { success: true, remaining: consumables.undos };
};

// Buy undo with coins
export const buyUndoWithCoins = () => {
  const UNDO_COST = 30;
  const result = spendCoins(UNDO_COST);

  if (result.success) {
    addUndos(1);
    return { success: true, coinsLeft: result.balance };
  }

  return { success: false, coinsLeft: result.balance };
};

// ============ SHIELD OPERATIONS ============

export const getShields = () => {
  return getConsumables().shields;
};

export const addShields = (amount) => {
  const consumables = getConsumables();
  consumables.shields += amount;
  saveConsumables(consumables);
  return consumables.shields;
};

export const useShield = () => {
  const consumables = getConsumables();

  if (consumables.shields <= 0) {
    return { success: false, remaining: 0 };
  }

  consumables.shields -= 1;
  saveConsumables(consumables);

  return { success: true, remaining: consumables.shields };
};

// ============ SPIN OPERATIONS ============

export const getSpins = () => {
  return getConsumables().spins;
};

export const addSpins = (amount) => {
  const consumables = getConsumables();
  consumables.spins += amount;
  saveConsumables(consumables);
  return consumables.spins;
};

export const useSpin = () => {
  const consumables = getConsumables();
  const stats = getStats();

  if (consumables.spins <= 0) {
    return { success: false, remaining: 0 };
  }

  consumables.spins -= 1;
  stats.totalSpins += 1;

  saveConsumables(consumables);
  saveStats(stats);

  return { success: true, remaining: consumables.spins };
};

// Buy spin with coins
export const buySpinWithCoins = () => {
  const SPIN_COST = 200;
  const result = spendCoins(SPIN_COST);

  if (result.success) {
    addSpins(1);
    return { success: true, coinsLeft: result.balance };
  }

  return { success: false, coinsLeft: result.balance };
};

// ============ WIN STREAK ============

export const getWinStreak = () => {
  return getStats().winStreak;
};

export const getBestWinStreak = () => {
  return getStats().bestWinStreak;
};

export const incrementWinStreak = () => {
  const stats = getStats();
  stats.winStreak += 1;

  if (stats.winStreak > stats.bestWinStreak) {
    stats.bestWinStreak = stats.winStreak;
  }

  // Bonus coins for win streaks
  let bonusCoins = 0;
  if (stats.winStreak === 3) bonusCoins = 10;
  else if (stats.winStreak === 5) bonusCoins = 25;
  else if (stats.winStreak === 10) bonusCoins = 50;
  else if (stats.winStreak % 10 === 0) bonusCoins = 100;

  saveStats(stats);

  if (bonusCoins > 0) {
    addCoins(bonusCoins);
  }

  return { winStreak: stats.winStreak, bonusCoins };
};

export const resetWinStreak = () => {
  const stats = getStats();
  const consumables = getConsumables();

  // Check if shield available
  if (consumables.shields > 0) {
    consumables.shields -= 1;
    saveConsumables(consumables);
    return { shieldUsed: true, winStreak: stats.winStreak };
  }

  const oldStreak = stats.winStreak;
  stats.winStreak = 0;
  saveStats(stats);

  return { shieldUsed: false, winStreak: 0, lostStreak: oldStreak };
};

// ============ LUCKY SPIN REWARDS ============

export const SPIN_REWARDS = [
  { id: 'coins_50', name: '50 Coins', type: 'coins', amount: 50, probability: 30, rarity: 'common', color: '#a0a0a0' },
  { id: 'coins_100', name: '100 Coins', type: 'coins', amount: 100, probability: 20, rarity: 'common', color: '#a0a0a0' },
  { id: 'hint_1', name: '1 Hint', type: 'hints', amount: 1, probability: 15, rarity: 'uncommon', color: '#00bfff' },
  { id: 'hint_3', name: '3 Hints', type: 'hints', amount: 3, probability: 10, rarity: 'uncommon', color: '#00bfff' },
  { id: 'undo_1', name: '1 Undo', type: 'undos', amount: 1, probability: 10, rarity: 'uncommon', color: '#00bfff' },
  { id: 'theme_trial', name: 'Theme Trial (24hr)', type: 'theme_trial', amount: 1, probability: 8, rarity: 'rare', color: '#8b5cf6' },
  { id: 'skin_trial', name: 'Skin Trial (24hr)', type: 'skin_trial', amount: 1, probability: 5, rarity: 'rare', color: '#8b5cf6' },
  { id: 'theme_perm', name: 'Random Theme', type: 'theme_permanent', amount: 1, probability: 1.5, rarity: 'epic', color: '#ff6b35' },
  { id: 'skin_perm', name: 'Random Skin', type: 'skin_permanent', amount: 1, probability: 0.4, rarity: 'legendary', color: '#ffd700' },
  { id: 'jackpot', name: '500 Coins Jackpot!', type: 'coins', amount: 500, probability: 0.1, rarity: 'mythic', color: '#ff00ff' }
];

// Get random spin reward based on probability
export const getSpinReward = () => {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const reward of SPIN_REWARDS) {
    cumulative += reward.probability;
    if (random <= cumulative) {
      return reward;
    }
  }

  // Fallback to first reward
  return SPIN_REWARDS[0];
};

// Apply spin reward
export const applySpinReward = (reward) => {
  const consumables = getConsumables();

  switch (reward.type) {
    case 'coins':
      addCoins(reward.amount);
      break;
    case 'hints':
      addHints(reward.amount);
      break;
    case 'undos':
      addUndos(reward.amount);
      break;
    case 'theme_trial':
      // Store trial expiry (24 hours from now)
      const themeTrials = JSON.parse(localStorage.getItem('xo_theme_trials') || '{}');
      const themes = ['neon', 'ocean', 'sunset', 'minimal'];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      themeTrials[randomTheme] = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('xo_theme_trials', JSON.stringify(themeTrials));
      return { ...reward, unlockedItem: randomTheme };
    case 'skin_trial':
      const skinTrials = JSON.parse(localStorage.getItem('xo_skin_trials') || '{}');
      const skins = ['flame', 'galaxy', 'pixel'];
      const randomSkin = skins[Math.floor(Math.random() * skins.length)];
      skinTrials[randomSkin] = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('xo_skin_trials', JSON.stringify(skinTrials));
      return { ...reward, unlockedItem: randomSkin };
    case 'theme_permanent':
      // Import and unlock a random theme
      const permThemes = ['neon', 'ocean', 'sunset', 'minimal'];
      const permTheme = permThemes[Math.floor(Math.random() * permThemes.length)];
      return { ...reward, unlockedItem: permTheme, permanent: true };
    case 'skin_permanent':
      const permSkins = ['flame', 'galaxy', 'pixel'];
      const permSkin = permSkins[Math.floor(Math.random() * permSkins.length)];
      return { ...reward, unlockedItem: permSkin, permanent: true };
    default:
      break;
  }

  return reward;
};

// Check if trial is active
export const isTrialActive = (type, itemId) => {
  const key = type === 'theme' ? 'xo_theme_trials' : 'xo_skin_trials';
  const trials = JSON.parse(localStorage.getItem(key) || '{}');

  if (trials[itemId] && trials[itemId] > Date.now()) {
    return true;
  }

  return false;
};

// Get trial time remaining
export const getTrialTimeRemaining = (type, itemId) => {
  const key = type === 'theme' ? 'xo_theme_trials' : 'xo_skin_trials';
  const trials = JSON.parse(localStorage.getItem(key) || '{}');

  if (trials[itemId]) {
    const remaining = trials[itemId] - Date.now();
    if (remaining > 0) {
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return `${hours}h ${minutes}m`;
    }
  }

  return null;
};

// ============ PACK DEFINITIONS ============

export const COIN_PACKS = [
  { id: 'coins_500', name: 'Starter Coins', coins: 500, price: 0.99, bonus: null, storeId: 'coins_500' },
  { id: 'coins_1200', name: 'Pro Coins', coins: 1200, price: 1.99, bonus: '+20%', storeId: 'coins_1200' },
  { id: 'coins_5000', name: 'Legend Coins', coins: 5000, price: 4.99, bonus: '+150%', storeId: 'coins_5000' }
];

export const SPIN_PACKS = [
  { id: 'spin_1', name: '1 Spin', spins: 1, price: 0.99, coinPrice: 200, storeId: 'spin_1' },
  { id: 'spin_10', name: '10 Spins', spins: 10, price: 1.99, coinPrice: 1500, bonus: '25% off', storeId: 'spin_10' },
  { id: 'spin_25', name: '25 Spins', spins: 25, price: 3.99, coinPrice: 3000, bonus: '40% off + Guaranteed Rare', storeId: 'spin_25' }
];

export const CONSUMABLE_PACKS = [
  { id: 'hint_pack_10', name: 'Hint Pack', type: 'hints', amount: 10, price: 0.99, storeId: 'hint_pack_10' },
  { id: 'hint_pack_30', name: 'Hint Bundle', type: 'hints', amount: 30, price: 1.99, storeId: 'hint_pack_30' },
  { id: 'undo_pack_10', name: 'Undo Pack', type: 'undos', amount: 10, price: 0.99, storeId: 'undo_pack_10' },
  { id: 'undo_pack_30', name: 'Undo Bundle', type: 'undos', amount: 30, price: 1.99, storeId: 'undo_pack_30' },
  { id: 'shield_pack_5', name: 'Shield Pack', type: 'shields', amount: 5, price: 0.99, storeId: 'shield_pack_5' }
];

export const MEGA_BUNDLES = [
  {
    id: 'mega_starter',
    name: 'Mega Starter',
    price: 2.99,
    storeId: 'mega_starter',
    contents: { coins: 1000, hints: 10, undos: 5, spins: 5 },
    description: '1,000 Coins + 10 Hints + 5 Undos + 5 Spins'
  },
  {
    id: 'mega_pro',
    name: 'Mega Pro',
    price: 4.99,
    storeId: 'mega_pro',
    contents: { coins: 2500, hints: 25, undos: 15, spins: 12 },
    description: '2,500 Coins + 25 Hints + 15 Undos + 12 Spins'
  },
  {
    id: 'mega_legend',
    name: 'Mega Legend',
    price: 6.99,
    storeId: 'mega_legend',
    contents: { coins: 5000, hints: 50, undos: 30, spins: 25, shields: 2 },
    description: '5,000 Coins + 50 Hints + 30 Undos + 25 Spins + 2 Shields'
  }
];

// Apply pack purchase
export const applyPackPurchase = (packId) => {
  // Handle bonus coins (e.g. from premium bundle)
  if (packId.startsWith('bonus_coins_')) {
    const amount = parseInt(packId.replace('bonus_coins_', ''), 10);
    if (amount > 0) {
      addCoins(amount);
      return { success: true, type: 'coins', amount };
    }
  }

  // Check coin packs
  const coinPack = COIN_PACKS.find(p => p.id === packId);
  if (coinPack) {
    addCoins(coinPack.coins);
    return { success: true, type: 'coins', amount: coinPack.coins };
  }

  // Check spin packs
  const spinPack = SPIN_PACKS.find(p => p.id === packId);
  if (spinPack) {
    addSpins(spinPack.spins);
    return { success: true, type: 'spins', amount: spinPack.spins };
  }

  // Check consumable packs
  const consumablePack = CONSUMABLE_PACKS.find(p => p.id === packId);
  if (consumablePack) {
    const consumables = getConsumables();
    consumables[consumablePack.type] += consumablePack.amount;
    saveConsumables(consumables);
    return { success: true, type: consumablePack.type, amount: consumablePack.amount };
  }

  // Check mega bundles
  const megaBundle = MEGA_BUNDLES.find(p => p.id === packId);
  if (megaBundle) {
    const { contents } = megaBundle;
    if (contents.coins) addCoins(contents.coins);
    if (contents.hints) addHints(contents.hints);
    if (contents.undos) addUndos(contents.undos);
    if (contents.spins) addSpins(contents.spins);
    if (contents.shields) addShields(contents.shields);
    return { success: true, type: 'mega_bundle', contents };
  }

  return { success: false };
};

export default {
  getConsumables,
  getCoins,
  addCoins,
  spendCoins,
  hasEnoughCoins,
  getHints,
  addHints,
  useHint,
  buyHintWithCoins,
  getUndos,
  addUndos,
  useUndo,
  buyUndoWithCoins,
  getShields,
  addShields,
  useShield,
  getSpins,
  addSpins,
  useSpin,
  buySpinWithCoins,
  getWinStreak,
  getBestWinStreak,
  incrementWinStreak,
  resetWinStreak,
  getSpinReward,
  applySpinReward,
  isTrialActive,
  getTrialTimeRemaining,
  applyPackPurchase,
  SPIN_REWARDS,
  COIN_PACKS,
  SPIN_PACKS,
  CONSUMABLE_PACKS,
  MEGA_BUNDLES
};
