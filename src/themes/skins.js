// Character skin definitions for XO Arena
// Each skin changes the appearance of X and O characters

export const skins = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Classic X and O design',
    x: {
      type: 'classic',
      color: 'var(--color-cyan)',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    o: {
      type: 'classic',
      color: 'var(--color-violet)',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    free: true
  },
  flame: {
    id: 'flame',
    name: 'Flame & Ice',
    description: 'Blazing fire X vs freezing ice O with animated effects',
    x: {
      type: 'flame',
      color: '#ff4500',
      secondaryColor: '#ff8c00',
      glowColor: 'rgba(255, 69, 0, 0.7)',
      animation: 'flicker'
    },
    o: {
      type: 'ice',
      color: '#00bfff',
      secondaryColor: '#87ceeb',
      glowColor: 'rgba(0, 191, 255, 0.7)',
      animation: 'shimmer'
    },
    storeId: 'skin_flame',
    price: 3.99
  },
  galaxy: {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    description: 'Twinkling golden stars & pulsing purple nebulas',
    x: {
      type: 'star',
      color: '#ffd700',
      secondaryColor: '#fff8dc',
      glowColor: 'rgba(255, 215, 0, 0.8)',
      animation: 'twinkle'
    },
    o: {
      type: 'nebula',
      color: '#9932cc',
      secondaryColor: '#da70d6',
      glowColor: 'rgba(153, 50, 204, 0.7)',
      animation: 'pulse'
    },
    storeId: 'skin_galaxy',
    price: 3.99
  },
  pixel: {
    id: 'pixel',
    name: 'Retro Pixel',
    description: 'Classic 8-bit arcade aesthetic with sharp edges',
    x: {
      type: 'pixel',
      color: '#00ff00',
      secondaryColor: '#008000',
      glowColor: 'rgba(0, 255, 0, 0.5)',
      animation: 'none'
    },
    o: {
      type: 'pixel',
      color: '#ff0000',
      secondaryColor: '#8b0000',
      glowColor: 'rgba(255, 0, 0, 0.5)',
      animation: 'none'
    },
    storeId: 'skin_pixel',
    price: 3.99
  }
};

export const skinBundle = {
  id: 'skin_bundle',
  name: 'All Skins Bundle',
  description: 'Unlock all 3 premium character skins',
  storeId: 'skin_bundle',
  price: 8.99,
  includes: ['flame', 'galaxy', 'pixel']
};

export default skins;
