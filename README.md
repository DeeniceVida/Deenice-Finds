Deenice Finds - React + Tailwind + Jekyll blog + Admin UI
-------------------------------------------------------

Structure:
- index.html
- package.json
- vite.config.js
- tailwind.config.cjs
- postcss.config.cjs
- /src - React source
- /public/products.json - products data (used by React app)
- /blogs - markdown posts (for Jekyll/GitHub Pages blog)
- README.md (this file)

Quick start (local development):
1. Install Node.js (>=18) and npm.
2. In project root, run:
   npm install
   npm run dev
   This starts the Vite dev server (usually http://localhost:5173).

Build for production:
- npm run build  (builds static files in /dist)

How to use Admin UI:
- Open /admin route in your running app (e.g. http://localhost:5173/admin)
- Edit product titles, prices, images in the form.
- Click "Download JSON" to export the updated products.json file.
- Replace /public/products.json in the repo with the downloaded file and redeploy.

Why Jekyll for blogs?
- The /blogs folder contains markdown posts ready for Jekyll. To publish blog posts on GitHub Pages:
  1. Create a separate gh-pages branch or configure repository to build with GitHub Pages and Jekyll.
  2. Copy the /blogs markdown files into a Jekyll site (or enable Jekyll in this repo by adding _layouts and _config.yml).
  3. Alternatively, host the blog with a static generator (Hugo) and link to it.

Tips for GitHub Pages deployment:
- Option A (simple): Deploy the React build (contents of /dist) to GitHub Pages or Vercel. Keep the /blogs folder in a separate branch or site for Jekyll.
- Option B: Use GitHub Actions to build React and copy blog posts into the site root if you prefer a single repo workflow.

Changing logo size or favicon:
- Logo size: edit --logo-height in src/index.css (root CSS variable)
- Favicon: replace the <link rel="icon"> in index.html with your chosen image link

WhatsApp number:
- Current sample number used in code: 254106590617 (Kenya). Find and replace in the source if needed.

Admin persistence:
- Admin edits are saved to localStorage (quick) and you can download the JSON to permanently update the repo's products.json.

Need help?
- I can produce a ready-to-push GitHub repo with a GitHub Action to build and publish the React app and copy /blogs into a Jekyll folder. Ask me if you'd like that.
