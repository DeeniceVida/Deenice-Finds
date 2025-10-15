Deenice Finds - GitHub Pages ready site
--------------------------------------
Files included:
- index.html (single-page app, contains header, offers, product grid, modals)
- styles.css (all visual styling; edit variables in :root to change colors, radius, fonts)
- app.js (javascript behavior, search, cart, buy-for-me calculator, offers slider)
- products.json (editable product list: images, prices, descriptions, colors)
- README.md (this file)

How to customize:
1. Replace product entries in products.json. Each product has:
   - id, title, short, price (KES), description (HTML allowed), images (array), colors(array with name & thumb)
   - Add or remove images: the gallery will use items from the images array (default 5)
2. To change currency formatting or rate in BuyForMe calculator:
   - Edit formatKES in app.js and the 'rate' constant inside initBuyForMe
3. To change WhatsApp checkout number:
   - Replace '+254106590617' in app.js (3 places)
4. Offers slider images: edit the <section class="offers"> in index.html
5. For header logo & favicon: change the <link rel="icon"> and .brand img in index.html
6. To change the number of demo products, edit products.json and regenerate the site.

Deploy:
- Commit all files to a GitHub repo and enable GitHub Pages from the repository settings (use root branch).
- Or simply upload to any static host.

Notes:
- All images used in the demo are hotlinked from postimg. For production, upload to your repo or a CDN.
- products.json is intentionally simple to allow quick editing.
- Comments in app.js point to key places to edit behavior.

Enjoy — Deenice Finds team
