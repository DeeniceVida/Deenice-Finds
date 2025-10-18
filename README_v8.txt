Deenice Finds - v8 (final)

Files:
- index.html (root landing page)
- products.html (product listing)
- product.html (dynamic product detail)
- iphone-listings.html (iPhone collections with model dropdown)
- buy-for-me.html (calculator)
- cart.html, blogs.html, reviews.html, services.html, collaborate.html, about.html
- styles.css (main styling)
- app-v8.js (main JS entrypoint)
- assets/data/products.json (10 demo products)
- assets/data/iphone-products.json (3 iPhone collections, each with 10 colors)

Quick edits:
- Change WhatsApp number: edit DH_WHATSAPP in app-v8.js
- Change ad images: open index.html, replace URLs in offers slider (data-src attributes)
- Edit iPhone colors & stock: edit assets/data/iphone-products.json
- Show more colors default: in app-v8.js change condition idx>=5 to another value
- Re-enable shipping rules in buy-for-me.html: see commented section in that file

Deployment notes for GitHub Pages:
- Upload all files and folders to repository root (not inside another folder)
- Ensure index.html is at repo root
- In repo Settings -> Pages, serve from branch main and folder / (root)
- Wait 1-2 minutes after publish and refresh the site URL

