// Microsoft Store Integration for XO Arena PWA
// Handles in-app purchases through Windows.Services.Store API

import { unlockItem, unlockBundle, premiumBundle } from './purchases';
import { themeBundle } from '../themes/themes';
import { skinBundle } from '../themes/skins';
import { difficultyPack } from '../logic/minimax';
import { applyPackPurchase } from './coinManager';

// Check if running in Microsoft Store context
export const isStoreAvailable = () => {
  return typeof window !== 'undefined' &&
         window.Windows?.Services?.Store?.StoreContext;
};

// Get Store context
let storeContext = null;

const getStoreContext = async () => {
  if (!isStoreAvailable()) {
    console.log('Microsoft Store not available');
    return null;
  }

  if (!storeContext) {
    try {
      storeContext = await window.Windows.Services.Store.StoreContext.getDefault();
    } catch (e) {
      console.error('Failed to get store context:', e);
      return null;
    }
  }

  return storeContext;
};

// Product ID mapping
export const STORE_PRODUCTS = {
  // Individual themes
  theme_neon: { type: 'theme', id: 'neon', storeId: '9PKNR3FTNQZ6' },
  theme_ocean: { type: 'theme', id: 'ocean', storeId: '9NSMS051S6HK' },
  theme_sunset: { type: 'theme', id: 'sunset', storeId: '9P0DPF5DT9HT' },
  theme_minimal: { type: 'theme', id: 'minimal', storeId: '9NT4VR9L88FS' },

  // Theme bundle
  theme_bundle: {
    type: 'bundle',
    id: 'theme_bundle',
    storeId: '9P4GZ5THGZHZ',
    includes: { themes: ['neon', 'ocean', 'sunset', 'minimal'] }
  },

  // Individual skins
  skin_flame: { type: 'skin', id: 'flame', storeId: '9MVF8JWLQWJJ' },
  skin_galaxy: { type: 'skin', id: 'galaxy', storeId: '9NT8MPZGW9GP' },
  skin_pixel: { type: 'skin', id: 'pixel', storeId: '9P0RL4231WVN' },

  // Skin bundle
  skin_bundle: {
    type: 'bundle',
    id: 'skin_bundle',
    storeId: '9PN0NZNQ68N0',
    includes: { skins: ['flame', 'galaxy', 'pixel'] }
  },

  // Difficulty pack
  difficulty_pack: {
    type: 'bundle',
    id: 'difficulty_pack',
    storeId: '9MW5144H1LWR',
    includes: { difficulties: ['rookie', 'pro', 'chaos'] }
  },

  // Premium bundle (everything + bonus coins)
  premium_bundle: {
    type: 'bundle',
    id: 'premium_bundle',
    storeId: '9PMZP7FJRG7T',
    includes: premiumBundle.includes,
    bonusCoins: 1000
  },

  // ============ CONSUMABLE PRODUCTS ============

  // Coin Packs (Consumable)
  coins_500: {
    type: 'consumable',
    id: 'coins_500',
    storeId: '9MSPP2PW6FKJ',
    consumableType: 'coins'
  },
  coins_1200: {
    type: 'consumable',
    id: 'coins_1200',
    storeId: '9N2HSKV4VDMM',
    consumableType: 'coins'
  },
  coins_5000: {
    type: 'consumable',
    id: 'coins_5000',
    storeId: '9PN5MZ0MCDMJ',
    consumableType: 'coins'
  },

  // Spin Packs (Consumable)
  spin_1: {
    type: 'consumable',
    id: 'spin_1',
    storeId: '9PBMS0SHK40D',
    consumableType: 'spins'
  },
  spin_10: {
    type: 'consumable',
    id: 'spin_10',
    storeId: '9NCTM0NH3394',
    consumableType: 'spins'
  },
  spin_25: {
    type: 'consumable',
    id: 'spin_25',
    storeId: '9NPPN71H1ZXT',
    consumableType: 'spins'
  },

  // Hint Packs (Consumable)
  hint_pack_10: {
    type: 'consumable',
    id: 'hint_pack_10',
    storeId: '9PLGMHGN42P7',
    consumableType: 'hints'
  },
  hint_pack_30: {
    type: 'consumable',
    id: 'hint_pack_30',
    storeId: '9NRPGWSDMWKC',
    consumableType: 'hints'
  },

  // Undo Packs (Consumable)
  undo_pack_10: {
    type: 'consumable',
    id: 'undo_pack_10',
    storeId: '9PDKBRTZ7VS8',
    consumableType: 'undos'
  },
  undo_pack_30: {
    type: 'consumable',
    id: 'undo_pack_30',
    storeId: '9P1PNKDVTZWK',
    consumableType: 'undos'
  },

  // Shield Packs (Consumable)
  shield_pack_5: {
    type: 'consumable',
    id: 'shield_pack_5',
    storeId: '9P8ZDKH8M1H2',
    consumableType: 'shields'
  },

  // Mega Bundles (Consumable)
  mega_starter: {
    type: 'consumable',
    id: 'mega_starter',
    storeId: '9MZ96Z4WCMFD',
    consumableType: 'mega_bundle'
  },
  mega_pro: {
    type: 'consumable',
    id: 'mega_pro',
    storeId: '9N72BR86DGHW',
    consumableType: 'mega_bundle'
  },
  mega_legend: {
    type: 'consumable',
    id: 'mega_legend',
    storeId: '9MSP9WXP1GKP',
    consumableType: 'mega_bundle'
  }
};

// Purchase result status
export const PurchaseStatus = {
  SUCCEEDED: 0,
  ALREADY_PURCHASED: 1,
  NOT_PURCHASED: 2,
  NETWORK_ERROR: 3,
  SERVER_ERROR: 4,
  UNKNOWN: 5
};

// Request purchase of a product
export const purchaseProduct = async (productKey) => {
  const product = STORE_PRODUCTS[productKey];
  if (!product) {
    console.error('Unknown product:', productKey);
    return { success: false, status: PurchaseStatus.UNKNOWN };
  }

  const context = await getStoreContext();

  if (!context) {
    // For development/testing without Store - simulate purchase
    console.log('Simulating purchase for:', productKey);
    return simulatePurchase(productKey);
  }

  try {
    const result = await context.requestPurchaseAsync(product.storeId);

    if (result.status === 0) { // Succeeded
      // Unlock the purchased item
      applyPurchase(productKey);
      return { success: true, status: PurchaseStatus.SUCCEEDED };
    } else if (result.status === 1) { // Already purchased
      applyPurchase(productKey);
      return { success: true, status: PurchaseStatus.ALREADY_PURCHASED };
    } else {
      return { success: false, status: result.status };
    }
  } catch (e) {
    console.error('Purchase failed:', e);
    return { success: false, status: PurchaseStatus.NETWORK_ERROR, error: e };
  }
};

// Apply purchase to local storage
const applyPurchase = (productKey) => {
  const product = STORE_PRODUCTS[productKey];

  if (product.type === 'bundle') {
    unlockBundle(product.id, product.includes);
    // Premium bundle also includes bonus coins
    if (product.bonusCoins) {
      applyPackPurchase(`bonus_coins_${product.bonusCoins}`);
    }
  } else if (product.type === 'theme') {
    unlockItem('themes', product.id);
  } else if (product.type === 'skin') {
    unlockItem('skins', product.id);
  } else if (product.type === 'consumable') {
    // Apply consumable pack (coins, spins, hints, undos, shields, mega bundles)
    applyPackPurchase(product.id);
  }
};

// Simulate purchase for development/testing
const simulatePurchase = (productKey) => {
  const product = STORE_PRODUCTS[productKey];

  // In development, just unlock the item
  if (product.type === 'bundle') {
    unlockBundle(product.id, product.includes);
    if (product.bonusCoins) {
      applyPackPurchase(`bonus_coins_${product.bonusCoins}`);
    }
  } else if (product.type === 'theme') {
    unlockItem('themes', product.id);
  } else if (product.type === 'skin') {
    unlockItem('skins', product.id);
  } else if (product.type === 'consumable') {
    // Apply consumable pack
    applyPackPurchase(product.id);
  }

  return { success: true, status: PurchaseStatus.SUCCEEDED, simulated: true };
};

// Check owned products from Store
export const syncPurchases = async () => {
  const context = await getStoreContext();

  if (!context) {
    console.log('Store not available, using local purchases');
    return;
  }

  try {
    // Get user's owned add-ons
    const addOns = await context.getAppLicenseAsync();

    if (addOns?.addOnLicenses) {
      addOns.addOnLicenses.forEach((license, storeId) => {
        if (license.isActive) {
          // Find the product by storeId and unlock it
          const productKey = Object.keys(STORE_PRODUCTS).find(
            key => STORE_PRODUCTS[key].storeId === storeId
          );
          if (productKey) {
            applyPurchase(productKey);
          }
        }
      });
    }
  } catch (e) {
    console.error('Failed to sync purchases:', e);
  }
};

// Get product info with prices from Store
export const getProductInfo = async (productKeys) => {
  const context = await getStoreContext();

  if (!context) {
    // Return default prices if Store not available
    return productKeys.map(key => ({
      key,
      ...STORE_PRODUCTS[key],
      price: getDefaultPrice(key),
      available: true
    }));
  }

  try {
    const storeIds = productKeys.map(key => STORE_PRODUCTS[key].storeId);
    const products = await context.getStoreProductsAsync(['Durable', 'Consumable'], storeIds);

    return productKeys.map(key => {
      const storeId = STORE_PRODUCTS[key].storeId;
      const product = products.products.get(storeId);

      return {
        key,
        ...STORE_PRODUCTS[key],
        price: product?.price?.formattedPrice || getDefaultPrice(key),
        available: !!product
      };
    });
  } catch (e) {
    console.error('Failed to get product info:', e);
    return productKeys.map(key => ({
      key,
      ...STORE_PRODUCTS[key],
      price: getDefaultPrice(key),
      available: true
    }));
  }
};

// Default prices for when Store is not available
const getDefaultPrice = (productKey) => {
  const prices = {
    // Durable products
    theme_neon: '$2.99',
    theme_ocean: '$2.99',
    theme_sunset: '$2.99',
    theme_minimal: '$2.99',
    theme_bundle: '$7.99',
    skin_flame: '$3.99',
    skin_galaxy: '$3.99',
    skin_pixel: '$3.99',
    skin_bundle: '$8.99',
    difficulty_pack: '$4.99',
    premium_bundle: '$19.99',
    // Consumable products
    coins_500: '$4.99',
    coins_1200: '$9.99',
    coins_5000: '$19.99',
    spin_1: '$1.99',
    spin_10: '$9.99',
    spin_25: '$19.99',
    hint_pack_10: '$2.99',
    hint_pack_30: '$6.99',
    undo_pack_10: '$1.99',
    undo_pack_30: '$4.99',
    shield_pack_5: '$3.99',
    mega_starter: '$9.99',
    mega_pro: '$14.99',
    mega_legend: '$19.99'
  };
  return prices[productKey] || '$0.99';
};

export default {
  isStoreAvailable,
  purchaseProduct,
  syncPurchases,
  getProductInfo,
  STORE_PRODUCTS,
  PurchaseStatus
};
