// app.js — v3.0 Enhanced UI & Responsive Search Suggestions
document.addEventListener("DOMContentLoaded", () => {
  const PRODUCTS = [
    { id: 'p1', title: 'Chromeheart Beanies', price: 1900, desc: 'Warm ribbed beanie with embroidered logo.', images: ['https://i.postimg.cc/441XX552/O1-CN01-Sj-Tb-Ky2-G1tx7oc-Nfp-2213981258956-0-cib.jpg'] },
    { id: 'p2', title: 'New Era Caps', price: 1700, desc: 'Classic curved brim caps in sports cut.', images: ['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg'] },
    { id: 'p3', title: 'ChromeHeart Sunglasses', price: 2600, desc: 'UV protection sunglasses with metallic trim.', images: ['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg'] },
    { id: 'p4', title: 'Magnetic Selfie Display', price: 5800, desc: 'Portable magnetic screen for selfies - 3 colors.', images: ['https://i.postimg.cc/PfKngqXM/O1-CN01-YHh-BIJ1sy1h2k-YDZ9-2218194145834-0-cib.jpg'] },
    { id: 'p5', title: 'Air Max 270 Sneakers', price: 9500, desc: 'Comfortable everyday sneakers.', images: ['https://i.postimg.cc/w3trJgst/display.jpg'] },
    { id: 'p6', title: 'Vintage Denim Jacket', price: 6200, desc: 'Classic denim jacket with retro fit.', images: ['https://i.postimg.cc/SjjBrcHc/beanie.jpg'] },
    { id: 'p7', title: 'Smart LED Desk Lamp', price: 3800, desc: 'Adjustable brightness lamp for work and study.', images: ['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg'] },
    { id: 'p8', title: 'Wireless Earbuds Pro', price: 4200, desc: 'High-quality audio with long battery life.', images: ['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg'] },
  ];

  const formatPrice = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const grid = document.getElementById("productsGrid");
  if (grid) {
    PRODUCTS.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img class="card-img" src="${p.images[0]}" alt="${p.title}" loading="lazy">
        <div class="card-body">
          <div class="product-title">${p.title}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="price">KES ${formatPrice(p.price)}</div>
        </div>
      `;
      card.onclick = () => (location.href = `product.html?id=${p.id}`);
      grid.appendChild(card);
    });
  }

  // ===== Search logic =====
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const header = document.getElementById("siteHeader");

  if (searchBtn) {
    let open = false;
    searchBtn.addEventListener("click", () => {
      open = !open;

      header.classList.add("highlight");
      setTimeout(() => header.classList.remove("highlight"), 600);

      searchInput.classList.toggle("open", open);
      if (open) searchInput.focus();
      else {
        searchInput.value = "";
        searchSuggestions.innerHTML = "";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase().trim();
      searchSuggestions.innerHTML = "";
      if (!q) return;

      const results = PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      ).slice(0, 5);

      results.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("search-item");
        li.innerHTML = `
          <img src="${item.images[0]}" alt="${item.title}" class="search-thumb">
          <div class="search-info">
            <strong>${item.title}</strong>
            <small>KES ${formatPrice(item.price)}</small>
          </div>
        `;
        li.onclick = () => (location.href = `product.html?id=${item.id}`);
        searchSuggestions.appendChild(li);
      });
    });
  }

  // ===== Responsive Fit + Zoom =====
  const fitToScreen = () => {
    document.body.style.width = "100%";
    document.body.style.margin = "0 auto";
    document.body.style.overflowX = "hidden";
  };
  fitToScreen();
  window.addEventListener("resize", fitToScreen);

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.setAttribute("content", "width=device-width, initial-scale=1.0, user-scalable=yes");

  // ===== Fade In Effect =====
  const page = document.getElementById("page");
  if (page) setTimeout(() => page.classList.add("in"), 100);
});


