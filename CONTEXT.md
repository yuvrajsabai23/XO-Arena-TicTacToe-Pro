# XO Arena - Project Context & Microsoft Store Status

## App Overview

**App Name:** XO Arena
**Developer:** Sabai Innovations
**Platform:** PWA (Progressive Web App) for Microsoft Store
**Status:** Published and approved on Microsoft Store (first submission)

---

## Current Features

### Core Gameplay
- Play vs AI (Grandmaster difficulty - free)
- Play vs Friend (local multiplayer)
- Premium AI difficulty modes (Rookie, Pro, Chaos)

### Store & Economy System
- **Coins** - In-game currency for hints, undos, spins
- **Hints** - Cost 50 coins, shows best move
- **Undos** - Cost 30 coins, take back a move
- **Streak Shields** - Protect win streak from reset
- **Lucky Spins** - Cost 200 coins, win random rewards

### Customization
- **Themes** - Neon, Ocean, Sunset, Minimal (premium)
- **Skins** - Flame & Ice, Galaxy, Pixel (premium)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/store/msStore.js` | Microsoft Store API integration |
| `src/store/coinManager.js` | Coin economy & consumables |
| `src/store/purchases.js` | Purchase state management |
| `src/components/StoreScreen.jsx` | In-app store UI |
| `src/components/LuckySpin.jsx` | Lucky spin wheel component |
| `src/App.jsx` | Main app with screen transitions |

---

## Microsoft Store Add-ons Setup

### Product Types to Use

| Category | Product Type in Partner Center |
|----------|-------------------------------|
| Themes, Skins, Difficulty Pack, Bundles | **Durable** |
| Coins, Spins, Hints, Undos, Shields, Mega Bundles | **Developer-managed consumable** |

---

## Complete Add-on List (25 Total: 11 Durable + 14 Consumable)

### DURABLE PRODUCTS (11 - One-time purchases) - ALL PUBLISHED

| Product ID | Store ID | Title | Price | Status |
|------------|----------|-------|-------|--------|
| `theme_neon` | `9PKNR3FTNQZ6` | Neon Theme Pack | $0.99 | Published |
| `theme_ocean` | `9NSMS051S6HK` | Ocean Theme Pack | $0.99 | Published |
| `theme_sunset` | `9P0DPF5DT9HT` | Sunset Theme Pack | $0.99 | Published |
| `theme_minimal` | `9NT4VR9L88FS` | Minimal Theme Pack | $0.99 | Published |
| `theme_bundle` | `9P4GZ5THGZHZ` | All Themes Bundle | $2.99 | Published |
| `skin_flame` | `9MVF8JWLQWJJ` | Flame & Ice Skin | $0.99 | Published |
| `skin_galaxy` | `9NT8MPZGW9GP` | Galaxy Skin | $0.99 | Published |
| `skin_pixel` | `9P0RL4231WVN` | Pixel Retro Skin | $0.99 | Published |
| `skin_bundle` | `9PN0NZNQ68N0` | All Skins Bundle | $2.99 | Published |
| `difficulty_pack` | `9MW5144H1LWR` | AI Difficulty Pack | $1.99 | Published |
| `premium_bundle` | `9PMZP7FJRG7T` | Ultimate Bundle | $4.99 | Published |

### CONSUMABLE PRODUCTS (14 - Developer-managed consumable) - ALL PUBLISHED

| Product ID | Store ID | Title | Price | Status |
|------------|----------|-------|-------|--------|
| `coins_500` | `9MSPP2PW6FKJ` | 500 Coins | $0.99 | Published |
| `coins_1200` | `9N2HSKV4VDMM` | 1200 Coins | $1.99 | Published |
| `coins_5000` | `9PN5MZ0MCDMJ` | 5000 Coins | $4.99 | Published |
| `spin_1` | `9PBMS0SHK40D` | 1 Lucky Spin | $0.99 | Published |
| `spin_10` | `9NCTM0NH3394` | 10 Lucky Spins | $1.99 | Published |
| `spin_25` | `9NPPN71H1ZXT` | 25 Lucky Spins | $3.99 | Published |
| `hint_pack_10` | `9PLGMHGN42P7` | 10 Hints Pack | $0.99 | Published |
| `hint_pack_30` | `9NRPGWSDMWKC` | 30 Hints Pack | $1.99 | Published |
| `undo_pack_10` | `9PDKBRTZ7VS8` | 10 Undos Pack | $0.99 | Published |
| `undo_pack_30` | `9P1PNKDVTZWK` | 30 Undos Pack | $1.99 | Published |
| `shield_pack_5` | `9P8ZDKH8M1H2` | 5 Streak Shields | $0.99 | Published |
| `mega_starter` | `9MZ96Z4WCMFD` | Starter Pack | $2.99 | Published |
| `mega_pro` | `9N72BR86DGHW` | Pro Pack | $4.99 | Published |
| `mega_legend` | `9MSP9WXP1GKP` | Legend Pack | $6.99 | Published |

---

## Partner Center Steps (For Each Add-on)

### 1. Create Add-on
- Go to Partner Center > Your App > Add-ons > Create new add-on
- Select product type (Durable or Developer-managed consumable)
- Enter Product ID from table above

### 2. Properties Section
- Content type: Electronic software download
- Privacy policy: No
- Keywords: Skip (leave empty)
- Custom developer data: Skip (leave empty)

### 3. Pricing and Availability
- Markets: All 240 markets
- Visibility: Public audience, discoverable in parent product listing
- Release: As soon as possible
- Stop acquisition: Never
- Base price: Select USD price tier matching the table above
- Sale pricing: Skip

### 4. Store Listings
- Click "Add/remove languages" > Add English (United States)
- Title: Copy from table above
- Description: Copy from table above
- Icon: Skip (optional, not required)

### 5. Submit
- Click "Submit to the Store"
- Wait 1-3 business days for certification

---

## After Add-ons Are Approved

### Step 1: Get Store IDs
Each approved add-on gets a Store ID (starts with `9`):
1. Partner Center > Your App > Add-ons
2. Click on approved add-on
3. Find Store ID in product identity section

### Step 2: Update Code
Edit `src/store/msStore.js` and replace placeholder IDs:

```javascript
// Before (placeholder)
theme_neon: { type: 'theme', id: 'neon', storeId: '9XXXXXXXX1' },

// After (real ID)
theme_neon: { type: 'theme', id: 'neon', storeId: '9NBLGGH4R2R6' },
```

### Step 3: Submit App Update
1. Partner Center > Your App > Submissions
2. Create new submission with updated code
3. Submit for certification (1-3 days)

---

## Current Status

| Item | Status |
|------|--------|
| App published on MS Store (v1.0.1) | Completed |
| Premium UI animations | Completed |
| Store screen with tabs | Completed |
| Coin economy system | Completed |
| Lucky Spin feature | Completed |
| Premium bundle bonus coins fix | Completed |
| Add-ons created in Partner Center (25 total) | Completed - Submitted Feb 16, 2026 |
| Add-ons certification (25/25) | Completed - Published Feb 19, 2026 |
| coins_2500 | Removed from app |
| msStore.js updated with all real Store IDs | Completed - Feb 19, 2026 |
| All audio/sound disabled | Completed - Feb 19, 2026 |
| Build & push updated code to GitHub | Completed - Feb 19, 2026 |
| PWABuilder MSIX generated (v1.0.2) | Completed - Feb 19, 2026 |
| App update submitted in Partner Center (v1.0.2) | Completed - Submitted Feb 19, 2026 |
| v1.0.2 rejected — Policy 10.8.7 (prices too high) | Failed - Feb 25, 2026 |
| Add-on prices lowered (all 25) | Completed - Feb 26, 2026 |
| App update resubmitted (v1.0.2, same MSIX) | Completed - Feb 26, 2026 |
| App update certification (resubmission) | **Waiting** - 1-3 business days |

---

## Timeline

| Step | Duration | Status |
|------|----------|--------|
| Create all add-ons in Partner Center | 1-2 hours | DONE |
| Add-ons certification (25/25) | 1-3 business days | DONE - Feb 19 |
| Update msStore.js with all real Store IDs | 30 minutes | DONE - Feb 19 |
| Build & push updated code | 30 minutes | DONE - Feb 19 |
| Generate MSIX v1.0.2 via PWABuilder | 15 minutes | DONE - Feb 19 |
| Submit app update in Partner Center | 15 minutes | DONE - Feb 19 |
| v1.0.2 certification | 1-3 business days | FAILED - Policy 10.8.7 |
| Lower all 25 add-on prices | 30 minutes | DONE - Feb 26 |
| Resubmit app update (v1.0.2) | 10 minutes | DONE - Feb 26 |
| App update certification (resubmission) | 1-3 business days | **WAITING** |

---

## Notes

- All 25 add-ons have **real Store IDs** in msStore.js
- `coins_2500` removed from app (was pending certification)
- All audio/sound/TTS completely disabled (was causing noise issues)
- Age rating: ESRB: E, PEGI: 3, IARC: 3 (suitable for all ages)
- Premium bundle correctly delivers 1,000 bonus coins on purchase
- Total add-on count: 25 (11 Durable + 14 Consumable)
- All add-ons submitted Feb 16, 2026; published Feb 19, 2026
- App update v1.0.2 submitted Feb 19, 2026 (includes Store IDs + audio removal)
- v1.0.2 rejected Feb 25 — Policy 10.8.7 (add-on prices too high for a tic-tac-toe game)
- All 25 add-on prices lowered Feb 26 and app update resubmitted

---

## Quick Reference Links

- [Microsoft Partner Center](https://partner.microsoft.com/dashboard)
- [Store Add-ons Documentation](https://docs.microsoft.com/en-us/windows/uwp/monetize/in-app-purchases-and-trials)

---

*Last updated: February 26, 2026 (v1.0.2 resubmitted with lowered prices)*
