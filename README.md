# Deenice Finds 2.0 - GitHub Pages Ready

This package contains a single-page landing site optimized for GitHub Pages.

## Files
- index.html
- style.css
- script.js

## How to deploy
1. Download and extract this folder.
2. Create a new GitHub repository (e.g. `deenice-finds`).
3. Upload the extracted files to the repo root (`index.html`, `style.css`, `script.js`).
4. In GitHub -> Settings -> Pages, choose Main branch, root (`/`) as the source and save. Wait ~1-3 minutes.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Tidio chat
To enable the chatbot:
1. Sign up at https://www.tidio.com and get your widget script.
2. Replace the placeholder script line in `index.html`:
   ```html
   <script src="//code.tidio.co/YOUR_TIDIO_ID.js" async></script>
   ```
   with the script Tidio provides.

## Images
This build uses Postimg direct links for product images and logo. If you want to host images locally, replace the `src` values and upload images into an `assets/` folder.

## WhatsApp number
Current seller WhatsApp number: +254799507007

## Notes
- Search is live and filters products as you type.
- To view the blog section, add `?blog` or `?blog=true` to your page URL.
- To change color hex codes, edit the `PRODUCTS` array in `script.js`.
