// app.js - integrated v2.2 site logic (highlight + responsive enhancement)
document.addEventListener('DOMContentLoaded', function () {
  const PRODUCTS = [
    { id: 'p1', slug: 'chromeheart-beanies', title: 'Chromeheart Beanies', price: 1900, desc: 'Warm ribbed beanie with embroidered logo.', images: ['https://i.postimg.cc/441XX552/O1-CN01-Sj-Tb-Ky2-G1tx7oc-Nfp-2213981258956-0-cib.jpg', 'https://i.postimg.cc/SjjBrcHc/beanie.jpg'], colors: [{ name: 'Black', hex: '#000' }, { name: 'Grey', hex: '#9CA3AF' }, { name: 'Beige', hex: '#D9CAB3' }] },
    { id: 'p2', slug: 'newera-caps', title: 'New Era Caps', price: 1700, desc: 'Classic curved brim caps in sports cut.', images: ['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg'], colors: [{ name: 'Black', hex: '#000' }, { name: 'Navy', hex: '#0F172A' }, { name: 'White', hex: '#fff' }] },
    { id: 'p3', slug: 'chromeheart-sunglasses', title: 'ChromeHeart Sunglasses', price: 2600, desc: 'UV protection sunglasses with metallic trim.', images: ['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg', 'https://i.postimg.cc/QCHt4Dzs/sunglasses-back.jpg'], colors: [{ name: 'Black', hex: '#000' }, { name: 'Gold', hex: '#D4AF37' }, { name: 'Brown', hex: '#8B5E3C' }] },
    { id: 'p4', slug: 'magnetic-selfie-display', title: 'Magnetic Selfie Display', price: 5800, desc: 'Portable magnetic screen for selfies - 3 colors.', images: ['https://i.postimg.cc/PfKngqXM/O1-CN01-YHh-BIJ1sy1h2k-YDZ9-2218194145834-0-cib.jpg'], colors: [{ name: 'Black', hex: '#000' }, { name: 'White', hex: '#fff' }, { name: 'Pink', hex: '#FFC0CB' }] },
    { id: 'p5', slug: 'air-max-270', title: 'Air Max 270 Sneakers', price: 9500, desc: 'Comfortable everyday sneakers.', images: ['https://i.postimg.cc/w3trJgst/display.jpg'], colors: [{ name: 'Black', hex: '#111827' }] },
    { id: 'p6', slug: 'vintage-denim-jacket', title: 'Vintage Denim Jacket', price: 6200, desc: 'Classic denim jacket with retro fit.', images: ['https://i.postimg.cc/SjjBrcHc/beanie.jpg'], colors: [{ name: 'Blue', hex: '#3B82F6' }] },
    { id: 'p7', slug: 'smart-led-desk-lamp', title: 'Smart LED Desk Lamp', price: 3800, desc: 'Adjustable brightness lamp for work and study.', images: ['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg'], colors: [{ name: 'Black', hex: '#000' }] },
    { id: 'p8', slug: 'wireless-earbuds-pro', title: 'Wireless Earbuds Pro', price: 4200, desc: 'High-quality audio with long battery life.', images: ['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg'], colors: [{ name: 'Black', hex: '#000' }] }
  ];

  function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ============================
  // Render Product Grid
  // ============================
  const grid = document.getElementById('productsGrid');
  if (grid) {
    PRODUCTS.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img class="card-img" src="${p.images[0]}" alt="${p.title}" loading="lazy">
        <div class="card-body">
          <div class="row-between">
            <div>
              <div class="product-title">${p.title}</div>
              <div class="product-desc">${p.desc}</div>
            </div>
            <div class="price">KES ${formatPrice(p.price)}</div>
          </div>
          <div class="color-list"></div>
        </div>
      `;
      card.addEventListener('click', () => { location.href = 'product.html?id=' + p.id; });
      grid.appendChild(card);

      const colorWrap = card.querySelector('.color-list');
      p.colors.forEach((c, i) => {
        const sw = document.createElement('span');
        sw.className = 'color-swatch' + (i === 0 ? ' selected' : '');
        sw.style.background = c.hex || '#ccc';
        sw.title = c.name;
        colorWrap.appendChild(sw);
      });
    });
  }

  // ============================
  // Product Detail Page
  // ============================
  const detail = document.getElementById('productDetail');
  if (detail) {
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || 'p1';
    const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
    detail.innerHTML = `
      <div class="product-detail">
        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <div class="product-gallery" style="flex:1 1 520px">
            <div class="product-main">
              <img id="mainImg" src="${p.images[0]}" style="width:100%;border-radius:12px;object-fit:cover" loading="lazy">
            </div>
            <div style="display:flex;gap:8px;margin-top:8px" id="thumbRow"></div>
          </div>
          <div style="width:360px;max-width:100%">
            <h2>${p.title}</h2>
            <div class="price">KES ${formatPrice(p.price)}</div>
            <p class="product-desc">${p.desc}</p>
            <div class="color-list" id="prodColors"></div>
            <div style="margin-top:12px">
              <button id="buyBtn" class="btn btn-primary">Buy on WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const thumbRow = document.getElementById('thumbRow');
    p.images.forEach(img => {
      const t = document.createElement('img');
      t.src = img;
      t.style.width = '100px';
      t.style.height = '70px';
      t.style.objectFit = 'cover';
      t.style.borderRadius = '8px';
      t.loading = 'lazy';
      t.addEventListener('click', () => document.getElementById('mainImg').src = img);
      thumbRow.appendChild(t);
    });
    const prodColors = document.getElementById('prodColors');
    p.colors.forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'color-swatch' + (i === 0 ? ' selected' : '');
      s.style.background = c.hex || '#ccc';
      s.title = c.name;
      s.addEventListener('click', () => {
        document.querySelectorAll('#prodColors .color-swatch').forEach(x => x.classList.remove('selected'));
        s.classList.add('selected');
      });
      prodColors.appendChild(s);
    });
    document.getElementById('buyBtn').addEventListener('click', () => {
      const colorEl = document.querySelector('#prodColors .color-swatch.selected');
      const color = colorEl ? colorEl.title : '';
      const text = `Hi! I'm interested in ${p.title} (${color}) - KES ${formatPrice(p.price)}`;
      window.open('https://wa.me/254799507007?text=' + encodeURIComponent(text), '_blank');
    });
  }

  // ============================
  // Search Behavior + Highlight
  // ============================
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const header = document.getElementById('siteHeader');
  const logoImg = document.getElementById('logoImg');
  const tagline = document.getElementById('tagline');

  if (searchBtn) {
    let open = false;
    searchBtn.addEventListener('click', () => {
      open = !open;

      // Header highlight effect
      header.classList.add('highlight');
      setTimeout(() => header.classList.remove('highlight'), 800);

      if (open) {
        searchInput.classList.add('open');
        header.classList.add('search-active');
        searchInput.focus();
        logoImg.style.transform = 'translateX(-40px) scale(.98)';
        tagline.style.transform = 'translateX(-40px)';
      } else {
        searchInput.classList.remove('open');
        header.classList.remove('search-active');
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        logoImg.style.transform = '';
        tagline.style.transform = '';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = (this.value || '').toLowerCase().trim();
      searchSuggestions.innerHTML = '';
      if (!q) return;
      const prodMatches = PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      ).slice(0, 6);
      prodMatches.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${item.images[0]}" alt="${item.title}">
          <div style="flex:1">
            <strong style="display:block">${item.title}</strong>
            <small class="muted">KES ${formatPrice(item.price)}</small>
          </div>
        `;
        li.addEventListener('click', () => { location.href = 'product.html?id=' + item.id; });
        searchSuggestions.appendChild(li);
      });
    });
  }

  // ============================
  // Responsive Fit + Zoomable Page
  // ============================
  function fitToScreen() {
    document.body.style.width = '100%';
    document.body.style.margin = '0 auto';
    document.body.style.padding = '0';
    document.documentElement.style.overflowX = 'hidden';
  }

  fitToScreen();
  window.addEventListener('resize', fitToScreen);

  // Enable zoom
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
  }

  // Fade in page effect
  setTimeout(() => {
    const page = document.getElementById('page');
    if (page) page.classList.add('in');
  }, 80);
});
