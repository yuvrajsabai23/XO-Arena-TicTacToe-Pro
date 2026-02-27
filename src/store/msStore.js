// Microsoft Store Integration for XO Arena PWA
// Uses Digital Goods API + Payment Request API (the correct approach for PWAs)
// Docs: https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/digital-goods-api

import { unlockItem, unlockBundle, premiumBundle } from './purchases';
import { applyPackPurchase } from './coinManager';

// Digital Goods Service instance
let digitalGoodsService = null;

// Check if Digital Goods API is available (PWA installed from Microsoft Store)
export const isStoreAvailable = () => {
  return 'getDigitalGoodsService' in window;
};

// Initialize the Digital Goods Service
const getService = async () => {
  if (digitalGoodsService) return digitalGoodsService;

  if (!isStoreAvailable()) {
    console.log('Digital Goods API not available — not installed from Store');
    return null;
  }

  try {
    digitalGoodsService = await window.getDigitalGoodsService(
      'https://store.microsoft.com/billing'
    );
    return digitalGoodsService;
  } catch (e) {
    console.error('Failed to connect to Microsoft Store Billing:', e);
    return null;
  }
};

// Product ID mapping — itemId matches Partner Center Product ID (InAppOfferToken)
export const STORE_PRODUCTS = {
  // Individual themes
  theme_neon: { type: 'theme', id: 'neon', itemId: 'theme_neon' },
  theme_ocean: { type: 'theme', id: 'ocean', itemId: 'theme_ocean' },
  theme_sunset: { type: 'theme', id: 'sunset', itemId: 'theme_sunset' },
  theme_minimal: { type: 'theme', id: 'minimal', itemId: 'theme_minimal' },

  // Theme bundle
  theme_bundle: {
    type: 'bundle',
    id: 'theme_bundle',
    itemId: 'theme_bundle',
    includes: { themes: ['neon', 'ocean', 'sunset', 'minimal'] }
  },

  // Individual skins
  skin_flame: { type: 'skin', id: 'flame', itemId: 'skin_flame' },
  skin_galaxy: { type: 'skin', id: 'galaxy', itemId: 'skin_galaxy' },
  skin_pixel: { type: 'skin', id: 'pixel', itemId: 'skin_pixel' },

  // Skin bundle
  skin_bundle: {
    type: 'bundle',
    id: 'skin_bundle',
    itemId: 'skin_bundle',
    includes: { skins: ['flame', 'galaxy', 'pixel'] }
  },

  // Difficulty pack
  difficulty_pack: {
    type: 'bundle',
    id: 'difficulty_pack',
    itemId: 'difficulty_pack',
    includes: { difficulties: ['rookie', 'pro', 'chaos'] }
  },

  // Premium bundle (everything + bonus coins)
  premium_bundle: {
    type: 'bundle',
    id: 'premium_bundle',
    itemId: 'premium_bundle',
    includes: premiumBundle.includes,
    bonusCoins: 1000
  },

  // ============ CONSUMABLE PRODUCTS ============

  // Coin Packs
  coins_500: { type: 'consumable', id: 'coins_500', itemId: 'coins_500' },
  coins_1200: { type: 'consumable', id: 'coins_1200', itemId: 'coins_1200' },
  coins_5000: { type: 'consumable', id: 'coins_5000', itemId: 'coins_5000' },

  // Spin Packs
  spin_1: { type: 'consumable', id: 'spin_1', itemId: 'spin_1' },
  spin_10: { type: 'consumable', id: 'spin_10', itemId: 'spin_10' },
  spin_25: { type: 'consumable', id: 'spin_25', itemId: 'spin_25' },

  // Hint Packs
  hint_pack_10: { type: 'consumable', id: 'hint_pack_10', itemId: 'hint_pack_10' },
  hint_pack_30: { type: 'consumable', id: 'hint_pack_30', itemId: 'hint_pack_30' },

  // Undo Packs
  undo_pack_10: { type: 'consumable', id: 'undo_pack_10', itemId: 'undo_pack_10' },
  undo_pack_30: { type: 'consumable', id: 'undo_pack_30', itemId: 'undo_pack_30' },

  // Shield Packs
  shield_pack_5: { type: 'consumable', id: 'shield_pack_5', itemId: 'shield_pack_5' },

  // Mega Bundles (consumable)
  mega_starter: { type: 'consumable', id: 'mega_starter', itemId: 'mega_starter' },
  mega_pro: { type: 'consumable', id: 'mega_pro', itemId: 'mega_pro' },
  mega_legend: { type: 'consumable', id: 'mega_legend', itemId: 'mega_legend' }
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

// Purchase a product using Payment Request API
export const purchaseProduct = async (productKey) => {
  const product = STORE_PRODUCTS[productKey];
  if (!product) {
    console.error('Unknown product:', productKey);
    return { success: false, status: PurchaseStatus.UNKNOWN };
  }

  const service = await getService();
  if (!service) {
    console.warn('Store not available — purchase blocked');
    return { success: false, status: PurchaseStatus.SERVER_ERROR };
  }

  try {
    // Create a Payment Request for Microsoft Store Billing
    const request = new PaymentRequest([
      {
        supportedMethods: 'https://store.microsoft.com/billing',
        data: { sku: product.itemId }
      }
    ]);

    // Show the Store purchase UI
    const response = await request.show();

    // Payment succeeded — get purchase token
    const purchaseToken = response.details?.token || response.details?.purchaseToken;

    // Complete the payment
    await response.complete('success');

    // For consumables, consume the purchase so it can be bought again
    if (product.type === 'consumable' && purchaseToken) {
      try {
        await service.consume(purchaseToken);
      } catch (e) {
        console.warn('Failed to consume purchase:', e);
      }
    }

    // Apply the purchase locally
    applyPurchase(productKey);
    return { success: true, status: PurchaseStatus.SUCCEEDED };

  } catch (e) {
    // User cancelled or payment failed
    if (e.name === 'AbortError') {
      return { success: false, status: PurchaseStatus.NOT_PURCHASED };
    }
    console.error('Purchase failed:', e);
    return { success: false, status: PurchaseStatus.NETWORK_ERROR, error: e };
  }
};

// Apply purchase to local storage
const applyPurchase = (productKey) => {
  const product = STORE_PRODUCTS[productKey];

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
    applyPackPurchase(product.id);
  }
};

// Sync owned purchases from Store (restore purchases)
export const syncPurchases = async () => {
  const service = await getService();
  if (!service) {
    console.log('Store not available, using local purchases');
    return;
  }

  try {
    const purchases = await service.listPurchases();

    for (const purchase of purchases) {
      // Find matching product by itemId
      const productKey = Object.keys(STORE_PRODUCTS).find(
        key => STORE_PRODUCTS[key].itemId === purchase.itemId
      );

      if (productKey) {
        const product = STORE_PRODUCTS[productKey];
        // Only restore durable/bundle purchases (not consumables)
        if (product.type !== 'consumable') {
          applyPurchase(productKey);
        }
      }
    }
  } catch (e) {
    console.error('Failed to sync purchases:', e);
  }
};

// Get product info with prices from Store
export const getProductInfo = async (productKeys) => {
  const service = await getService();

  if (!service) {
    return productKeys.map(key => ({
      key,
      ...STORE_PRODUCTS[key],
      price: getDefaultPrice(key),
      available: true
    }));
  }

  try {
    const itemIds = productKeys.map(key => STORE_PRODUCTS[key].itemId);
    const details = await service.getDetails(itemIds);

    return productKeys.map(key => {
      const product = STORE_PRODUCTS[key];
      const detail = details.find(d => d.itemId === product.itemId);

      if (detail) {
        const priceStr = new Intl.NumberFormat(
          navigator.language || 'en-US',
          { style: 'currency', currency: detail.price.currency }
        ).format(detail.price.value);

        return {
          key,
          ...product,
          price: priceStr,
          title: detail.title,
          description: detail.description,
          available: true
        };
      }

      return {
        key,
        ...product,
        price: getDefaultPrice(key),
        available: true
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

// Default prices (shown when Store API is not available)
const getDefaultPrice = (productKey) => {
  const prices = {
    theme_neon: '$0.99',
    theme_ocean: '$0.99',
    theme_sunset: '$0.99',
    theme_minimal: '$0.99',
    theme_bundle: '$2.99',
    skin_flame: '$0.99',
    skin_galaxy: '$0.99',
    skin_pixel: '$0.99',
    skin_bundle: '$2.99',
    difficulty_pack: '$1.99',
    premium_bundle: '$4.99',
    coins_500: '$0.99',
    coins_1200: '$1.99',
    coins_5000: '$4.99',
    spin_1: '$0.99',
    spin_10: '$1.99',
    spin_25: '$3.99',
    hint_pack_10: '$0.99',
    hint_pack_30: '$1.99',
    undo_pack_10: '$0.99',
    undo_pack_30: '$1.99',
    shield_pack_5: '$0.99',
    mega_starter: '$2.99',
    mega_pro: '$4.99',
    mega_legend: '$6.99'
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
