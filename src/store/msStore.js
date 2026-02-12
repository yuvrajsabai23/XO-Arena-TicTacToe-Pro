// Microsoft Store Integration for XO Arena PWA
// Handles in-app purchases through Windows.Services.Store API

import { unlockItem, unlockBundle, premiumBundle } from './purchases';
import { themeBundle } from '../themes/themes';
import { skinBundle } from '../themes/skins';
import { difficultyPack } from '../logic/minimax';

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
  theme_neon: { type: 'theme', id: 'neon', storeId: '9XXXXXXXX1' },
  theme_ocean: { type: 'theme', id: 'ocean', storeId: '9XXXXXXXX2' },
  theme_sunset: { type: 'theme', id: 'sunset', storeId: '9XXXXXXXX3' },
  theme_minimal: { type: 'theme', id: 'minimal', storeId: '9XXXXXXXX4' },

  // Theme bundle
  theme_bundle: {
    type: 'bundle',
    id: 'theme_bundle',
    storeId: '9XXXXXXXX5',
    includes: { themes: ['neon', 'ocean', 'sunset', 'minimal'] }
  },

  // Individual skins
  skin_flame: { type: 'skin', id: 'flame', storeId: '9XXXXXXXX6' },
  skin_galaxy: { type: 'skin', id: 'galaxy', storeId: '9XXXXXXXX7' },
  skin_pixel: { type: 'skin', id: 'pixel', storeId: '9XXXXXXXX8' },

  // Skin bundle
  skin_bundle: {
    type: 'bundle',
    id: 'skin_bundle',
    storeId: '9XXXXXXXX9',
    includes: { skins: ['flame', 'galaxy', 'pixel'] }
  },

  // Difficulty pack
  difficulty_pack: {
    type: 'bundle',
    id: 'difficulty_pack',
    storeId: '9XXXXXXXXXXA',
    includes: { difficulties: ['rookie', 'pro', 'chaos'] }
  },

  // Premium bundle (everything)
  premium_bundle: {
    type: 'bundle',
    id: 'premium_bundle',
    storeId: '9XXXXXXXXXXB',
    includes: premiumBundle.includes
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
  } else if (product.type === 'theme') {
    unlockItem('themes', product.id);
  } else if (product.type === 'skin') {
    unlockItem('skins', product.id);
  }
};

// Simulate purchase for development/testing
const simulatePurchase = (productKey) => {
  const product = STORE_PRODUCTS[productKey];

  // In development, just unlock the item
  if (product.type === 'bundle') {
    unlockBundle(product.id, product.includes);
  } else if (product.type === 'theme') {
    unlockItem('themes', product.id);
  } else if (product.type === 'skin') {
    unlockItem('skins', product.id);
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
    const products = await context.getStoreProductsAsync(['Durable'], storeIds);

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
    premium_bundle: '$19.99'
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
