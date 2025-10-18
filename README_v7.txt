Deenice Finds - v7 (Merged from v4 + v6 updates)

What this bundle contains:
- All files originally present in your v4 bundle (extracted into this folder).
- Merged updates from v6 (iphone collections, stock flags, dropdown models, search/offer improvements).
- New script: app-v7.js (entrypoint that handles hamburger, offers slider, iphone listings rendering).
- assets/data/iphone-products.json included (edit to change models/colors/status).
- Instructions:
  * Edit assets/data/iphone-products.json to change stock status ("in-stock" / "out-of-stock"), color image links, price_from.
  * Change WhatsApp number in app-v7.js (DH_WHATSAPP variable at top).
  * To change number of colors visible by default, modify the condition `idx >= 5` inside app-v7.js (set to 10 to show all).
  * Change ad banner image in index.html (look for .ad-banner <img src="...">).
  * Shipping rules are hidden in buy-for-me.html (search for commented shipping logic).

Files of interest:
- index.html (main landing)
- styles.css (visuals + z-index fix for dropdowns)
- app-v7.js (main JS, modify DH_WHATSAPP here)
- assets/data/iphone-products.json (iPhone collection data)
- iphone-listings.html (new iPhone listings page)

