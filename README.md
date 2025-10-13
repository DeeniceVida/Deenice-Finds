# Deenice Finds - Landing Page

This is the final GitHub Pages-ready landing page for *Deenice Finds*.

## How to deploy
1. Download and extract this folder.
2. Create a new GitHub repository (e.g. `deenice-finds`).
3. Upload the extracted files to the repo root (`index.html`, `css/`, `js/`, `README.md`).
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
This build uses direct Postimg links for images (already embedded). If you want to host images locally, replace the `src` values and upload images into an `assets/` folder.

## WhatsApp number
If you want to change the seller WhatsApp number, edit the `main.js` file and replace `254799507007` with your number (no plus sign).
