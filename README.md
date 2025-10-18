Deenice Finds - v6 build (iPhone collections + stock & dropdown)

Files added/updated:
- assets/data/iphone-products.json  <-- Edit product entries, colors, status ("in-stock"/"out-of-stock"), mainImage, price_from
- iphone-listings.html              <-- New page that renders the iPhone collections
- app-v6.js                         <-- Renders collections, dropdown models, colors, stock badge, show more
- styles.css                        <-- CSS includes z-index fix for dropdown and ad-banner z-index lowered
- index.html, products.html         <-- Basic pages linking to listings
- buy-for-me.html                   <-- calculator placeholder with shipping rules commented out
- README.md                         <-- this file

HOW TO EDIT:
1) Edit colors or stock status:
   Open assets/data/iphone-products.json and change the "status" value to "in-stock" or "out-of-stock".
   Update color image links under "colors" array for each product.

2) Change the model list (dropdown):
   Open app-v6.js and edit the iphoneModels array at the top to add/remove model names.

3) Show more colors by default:
   In app-v6.js, inside createProductCard(), change the condition `idx >= 5` to a different number
   (e.g., `idx >= 10` to hide none).

4) Change the ad image:
   Edit index.html and replace the src inside the .ad-banner <img> tag. The CSS z-index for .ad-banner is set lower
   so dropdown menus (z-index:9999) will appear above the ad.

5) Shipping rules hidden:
   The buy-for-me calculator has shipping logic commented out in buy-for-me.html.
   To re-enable shipping rules, edit that file and see comments near the calculation section.

6) WhatsApp number:
   Replace +254106590617 in app-v6.js or other files to change the receiver number.
