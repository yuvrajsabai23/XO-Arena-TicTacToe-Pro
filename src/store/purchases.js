// Purchase state management for XO Arena
// Handles localStorage persistence and purchase verification

const STORAGE_KEY = 'xo_arena_purchases';

// Get all purchased items from localStorage
export const getPurchasedItems = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading purchases:', e);
  }
  return {
    themes: ['default'],
    skins: ['default'],
    difficulties: ['grandmaster'],
    bundles: []
  };
};

// Save purchases to localStorage
export const savePurchases = (purchases) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  } catch (e) {
    console.error('Error saving purchases:', e);
  }
};

// Check if a specific item is owned
export const isItemOwned = (category, itemId) => {
  const purchases = getPurchasedItems();

  // Check bundles first
  if (category === 'themes' && purchases.bundles.includes('theme_bundle')) {
    return true;
  }
  if (category === 'skins' && purchases.bundles.includes('skin_bundle')) {
    return true;
  }
  if (category === 'difficulties' && purchases.bundles.includes('difficulty_pack')) {
    return true;
  }
  if (purchases.bundles.includes('premium_bundle')) {
    return true;
  }

  return purchases[category]?.includes(itemId) || false;
};

// Unlock an item after purchase
export const unlockItem = (category, itemId) => {
  const purchases = getPurchasedItems();

  if (!purchases[category]) {
    purchases[category] = [];
  }

  if (!purchases[category].includes(itemId)) {
    purchases[category].push(itemId);
  }

  savePurchases(purchases);
  return purchases;
};

// Unlock a bundle (unlocks all included items)
export const unlockBundle = (bundleId, includedItems) => {
  const purchases = getPurchasedItems();

  if (!purchases.bundles.includes(bundleId)) {
    purchases.bundles.push(bundleId);
  }

  // Also unlock individual items for display purposes
  if (includedItems) {
    Object.entries(includedItems).forEach(([category, items]) => {
      if (!purchases[category]) {
        purchases[category] = [];
      }
      items.forEach(item => {
        if (!purchases[category].includes(item)) {
          purchases[category].push(item);
        }
      });
    });
  }

  savePurchases(purchases);
  return purchases;
};

// Get selected items (active theme, skin, difficulty)
const SELECTED_KEY = 'xo_arena_selected';

export const getSelectedItems = () => {
  try {
    const stored = localStorage.getItem(SELECTED_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading selected items:', e);
  }
  return {
    theme: 'default',
    skin: 'default',
    difficulty: 'grandmaster'
  };
};

export const setSelectedItem = (category, itemId) => {
  const selected = getSelectedItems();
  selected[category] = itemId;
  try {
    localStorage.setItem(SELECTED_KEY, JSON.stringify(selected));
  } catch (e) {
    console.error('Error saving selected item:', e);
  }
  return selected;
};

// Premium bundle info
export const premiumBundle = {
  id: 'premium_bundle',
  name: 'Ultimate Bundle',
  description: 'Unlock everything! All themes, skins, and difficulty modes.',
  storeId: 'premium_bundle',
  price: 19.99,
  includes: {
    themes: ['neon', 'ocean', 'sunset', 'minimal'],
    skins: ['flame', 'galaxy', 'pixel'],
    difficulties: ['rookie', 'pro', 'chaos']
  }
};

export default {
  getPurchasedItems,
  savePurchases,
  isItemOwned,
  unlockItem,
  unlockBundle,
  getSelectedItems,
  setSelectedItem,
  premiumBundle
};
