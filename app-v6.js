// app-v6.js
// This script loads assets/data/iphone-products.json and renders 3 listings with model dropdown, color swatches (10), stock badges,
// "Show more colors" button, and disables opening if out-of-stock.
//
// To edit colors or stock status: open assets/data/iphone-products.json
// To change model list: edit the iphoneModels array below.

const iphoneModels = [
  "iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone SE (2nd generation)",
  "iPhone 12","iPhone 12 mini","iPhone 12 Pro","iPhone 12 Pro Max",
  "iPhone 13","iPhone 13 mini","iPhone 13 Pro","iPhone 13 Pro Max",
  "iPhone SE (3rd generation)","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max",
  "iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max",
  "iPhone 16e","iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max",
  "iPhone 17","iPhone 17 Air","iPhone 17 Pro","iPhone 17 Pro Max"
];

async function loadIphoneProducts(){
  const res = await fetch('assets/data/iphone-products.json');
  return res.json();
}

function createProductCard(product){
  const card = document.createElement('article');
  card.className = 'product-card';
  // Stock badge
  const inStock = product.status === 'in-stock';
  const stockBadge = `<p class="stock-alert ${inStock ? 'in-stock':'out-of-stock'}">${inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>`;
  // disable link if out of stock
  const disabledClass = inStock ? '' : 'disabled-link';
  const colorThumbs = product.colors.map((c, idx) => {
    // first 5 visible, rest hidden (use Show more to reveal)
    const hidden = idx >= 5 ? 'hidden' : '';
    const img = c.image || '';
    return `<span class="color-thumb ${hidden}" data-color="${c.name}" style="background-image:url('${img || 'https://i.postimg.cc/ChT8ngfm/logo-1-3x-100.jpg'}')" title="${c.name}"></span>`;
  }).join('');

  card.innerHTML = `
    <img src="${product.mainImage || 'https://i.postimg.cc/ChT8ngfm/logo-1-3x-100.jpg'}" alt="${product.title}">
    <h3>${product.title}</h3>
    <div class="stock-and-price">${stockBadge}<div class="price" style="font-weight:700">${product.price_from || ''}</div></div>
    <label for="model-${product.id}">Select model:</label>
    <select id="model-${product.id}" class="model-dropdown">
      <option value="">Choose model</option>
    </select>
    <div class="color-options"><p style="margin:8px 0 6px">Select color:</p><div class="color-swatches">${colorThumbs}</div><p class="selected-color">Selected: —</p></div>
    <button class="show-more-colors">Show more colors</button>
    <div style="margin-top:10px"><button class="btn-order" ${inStock ? '' : 'disabled'}>Order via WhatsApp</button></div>
  `;

  // populate model dropdown
  const dropdown = card.querySelector(`#model-${product.id}`);
  iphoneModels.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    dropdown.appendChild(opt);
  });

  // click handling for color thumbs
  const swatches = card.querySelector('.color-swatches');
  swatches.addEventListener('click', (e) => {
    const target = e.target.closest('.color-thumb');
    if(!target) return;
    // remove selection
    swatches.querySelectorAll('.color-thumb').forEach(c => c.classList.remove('selected'));
    target.classList.add('selected');
    const colorName = target.dataset.color || '—';
    card.querySelector('.selected-color').textContent = 'Selected: ' + colorName;
  });

  // show more colors button
  const showBtn = card.querySelector('.show-more-colors');
  showBtn.addEventListener('click', () => {
    card.querySelectorAll('.color-thumb.hidden').forEach(el => el.classList.remove('hidden'));
    showBtn.style.display = 'none';
  });

  // Order via WhatsApp
  const orderBtn = card.querySelector('.btn-order');
  if(!inStock){
    // disable button and visually indicate out of stock
    orderBtn.classList.add('disabled-link');
    orderBtn.title = 'Out of stock';
  } else {
    orderBtn.addEventListener('click', () => {
      const model = dropdown.value || 'Not specified';
      const colorEl = card.querySelector('.color-thumb.selected');
      const color = colorEl ? colorEl.dataset.color : 'Not specified';
      const qty = 1;
      const phone = '+254106590617';
      const msg = `Hello, I'm interested in ${product.title} - Model: ${model} - Color: ${color} - Qty: ${qty}`;
      window.open('https://wa.me/' + phone.replace('+','') + '?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  return card;
}

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('iphoneList');
  const products = await loadIphoneProducts();
  products.forEach(p => {
    const card = createProductCard(p);
    // make whole card clickable to product page if in stock (optional behavior)
    if(p.status === 'in-stock'){
      card.addEventListener('click', (e) => {
        // avoid triggering when clicking inside interactive elements (buttons/select)
        const tag = e.target.tagName.toLowerCase();
        if(['button','select','option'].includes(tag) || e.target.classList.contains('color-thumb')) return;
        // open product detail page (could be same product.html?id=...)
        window.location.href = 'product.html?id=' + encodeURIComponent(p.id);
      });
    } else {
      card.classList.add('disabled-link');
    }
    list.appendChild(card);
  });
});
