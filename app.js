// app.js - behavior for Deenice Finds SPA
// -- Product data is loaded from products.json (easy to edit).
// -- Comments show where to change images, prices, etc.
// -- WhatsApp checkout: uses wa.me links with prefilled text.

// Helper: fetch products
async function loadProducts(){
  const resp = await fetch('products.json');
  return resp.json();
}

let PRODUCTS = [];
let CART = [];

function formatKES(n){ return 'Ksh ' + Number(n).toLocaleString('en-KE'); }

// Render product cards
function renderProducts(products){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${p.images[0]}" alt="${p.title}" />
      <div class="title">${p.title}</div>
      <div class="price">${formatKES(p.price)}</div>
      <div class="muted">${p.short}</div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="open" data-id="${p.id}">View</button>
        <button class="quickAdd" data-id="${p.id}">Add</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Open product detail modal
function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('pTitle').textContent = p.title;
  document.getElementById('pPrice').textContent = formatKES(p.price);
  document.getElementById('pDesc').innerHTML = p.description;
  // gallery
  const gallery = document.getElementById('productGallery');
  gallery.innerHTML = '';
  p.images.forEach(img=>{
    const i = document.createElement('img');
    i.src = img;
    gallery.appendChild(i);
  });
  // qty
  const qty = document.getElementById('qtySelect');
  qty.innerHTML = '';
  for(let i=1;i<=10;i++){ qty.innerHTML += `<option value="${i}">${i}</option>` }
  // colors
  const cs = document.getElementById('colorSelector');
  cs.innerHTML = '';
  p.colors.forEach((c,idx)=>{
    const el = document.createElement('div');
    el.className = 'color-option' + (idx===0? ' selected':'');
    el.dataset.color = c.name;
    el.innerHTML = `<img src="${c.thumb}" style="width:40px;height:40px;object-fit:cover;border-radius:6px"/>`;
    el.addEventListener('click', ()=> {
      Array.from(cs.children).forEach(n=>n.classList.remove('selected'));
      el.classList.add('selected');
    });
    cs.appendChild(el);
  });
  // store current product id
  document.getElementById('productModal').dataset.pid = p.id;
  document.getElementById('productModal').classList.remove('hidden');
}

// Cart functions
function updateCartUI(){
  document.getElementById('cartCount').textContent = CART.length;
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  CART.forEach((item,idx)=>{
    container.innerHTML += `<div style="padding:8px;border-bottom:1px solid #f1f3f5">
      <strong>${item.title}</strong><div>${item.color} • ${item.qty} × ${formatKES(item.price)}</div>
    </div>`;
  });
}

// Add to cart
function addToCartFromModal(){
  const modal = document.getElementById('productModal');
  const pid = modal.dataset.pid;
  const p = PRODUCTS.find(x=>x.id===pid);
  const color = modal.querySelector('.color-option.selected').dataset.color;
  const qty = Number(document.getElementById('qtySelect').value);
  CART.push({id:pid,title:p.title,price:p.price,qty,color});
  updateCartUI();
  localStorage.setItem('deenice_cart', JSON.stringify(CART));
  alert('Added to cart');
}

// Quick add from card
function quickAdd(id){
  const p = PRODUCTS.find(x=>x.id===id);
  CART.push({id:p.id,title:p.title,price:p.price,qty:1,color:p.colors[0].name});
  updateCartUI();
  localStorage.setItem('deenice_cart', JSON.stringify(CART));
}

// WhatsApp checkout for single product (Buy Now)
function buyNowFromModal(){
  const modal = document.getElementById('productModal');
  const pid = modal.dataset.pid;
  const p = PRODUCTS.find(x=>x.id===pid);
  const color = modal.querySelector('.color-option.selected').dataset.color;
  const qty = Number(document.getElementById('qtySelect').value);
  const msg = `Hello, I'm interested in *${p.title}*\nPrice: ${formatKES(p.price)}\nQuantity: ${qty}\nColor: ${color}`;
  const phone = '+254106590617';
  const url = 'https://wa.me/' + phone.replace('+','') + '?text=' + encodeURIComponent(msg);
  window.open(url,'_blank');
}

// Checkout cart via WhatsApp (aggregates items)
function checkoutCartViaWhatsApp(){
  if(CART.length===0){ alert('Cart empty'); return; }
  let msg = 'Hello, I would like to order these items:%0A';
  CART.forEach(ci=>{
    msg += `*${ci.title}* - ${ci.color} - qty:${ci.qty} - ${formatKES(ci.price)}%0A`;
  });
  msg += '%0ATotal: ' + formatKES(CART.reduce((s,i)=>s+i.price*i.qty,0));
  const phone = '+254106590617';
  const url = 'https://wa.me/' + phone.replace('+','') + '?text=' + encodeURIComponent(msg);
  window.open(url,'_blank');
}

// Search behavior
function initSearch(){
  const sToggle = document.getElementById('searchToggle');
  const sBox = document.getElementById('searchBox');
  const sInput = document.getElementById('searchInput');
  const sSuggest = document.getElementById('searchSuggest');

  sToggle.addEventListener('click', ()=>{
    sBox.classList.toggle('hidden');
    if(!sBox.classList.contains('hidden')) sInput.focus();
  });

  sInput.addEventListener('input', ()=>{
    const q = sInput.value.toLowerCase().trim();
    if(!q){ sSuggest.style.display='none'; return; }
    const results = PRODUCTS.filter(p=> (p.title+ ' '+ (p.short||'') ).toLowerCase().includes(q)).slice(0,6);
    sSuggest.innerHTML = '';
    results.forEach(r=>{
      const el = document.createElement('div');
      el.className='suggestion';
      el.innerHTML = `<img src="${r.images[0]}" /><div><strong>${r.title}</strong><div>${formatKES(r.price)}</div></div>`;
      el.addEventListener('click', ()=>{ openProduct(r.id); sSuggest.style.display='none'; });
      sSuggest.appendChild(el);
    });
    sSuggest.style.display = results.length? 'block':'none';
  });
}

// Offers slider auto-play
function initOffers(){
  const slider = document.getElementById('offersSlider');
  const dots = document.getElementById('offerDots');
  const slides = slider.children;
  let idx = 0;
  // create dots
  for(let i=0;i<slides.length;i++){
    const b=document.createElement('button');
    b.addEventListener('click', ()=> { idx=i; move(); });
    dots.appendChild(b);
  }
  function move(){ slider.style.transform = `translateX(-${idx*100}%)`; Array.from(dots.children).forEach((d,di)=>d.classList.toggle('active',di===idx)); }
  document.getElementById('prevOffer').addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; move(); });
  document.getElementById('nextOffer').addEventListener('click', ()=>{ idx = (idx+1)%slides.length; move(); });
  move();
  setInterval(()=>{ idx = (idx+1)%slides.length; move(); },6000);
}

// Buy For Me calculator logic
function initBuyForMe(){
  const modal = document.getElementById('buyForMeModal');
  const openLinks = [document.getElementById('buyForMeLink'), document.getElementById('buyForMeFooter')];
  openLinks.forEach(el=>el && el.addEventListener('click', (e)=>{ e.preventDefault(); modal.classList.remove('hidden'); }));
  modal.querySelector('.close-modal').addEventListener('click', ()=> modal.classList.add('hidden'));
  document.getElementById('bfmQuote').addEventListener('click', ()=>{
    const usd = Number(document.getElementById('bfmPrice').value || 0);
    const rate = 135; // rate135 as requested
    // shipping rules: add $20 + 3.5% OR $30 or 4.5% if >750
    let shipping = 20 + usd * 0.035;
    if(usd > 750) shipping = 30 + usd * 0.045;
    const totalUSD = usd + shipping;
    const totalKES = totalUSD * rate;
    const res = document.getElementById('bfmResults');
    res.innerHTML = `<div>Shipping (USD): $${shipping.toFixed(2)}</div><div>Total (USD): $${totalUSD.toFixed(2)}</div><div>Total (KES): Ksh ${Math.round(totalKES).toLocaleString()}</div><div>Delivery duration: 3 weeks</div>`;
  });
  document.getElementById('bfmOrder').addEventListener('click', ()=>{
    const link = document.getElementById('bfmLink').value;
    const usd = Number(document.getElementById('bfmPrice').value || 0);
    const rate = 135;
    let shipping = 20 + usd * 0.035;
    if(usd > 750) shipping = 30 + usd * 0.045;
    const totalUSD = usd + shipping;
    const totalKES = Math.round(totalUSD * rate);
    const phone = '+254106590617';
    const msg = `BuyForMe Request:\nLink: ${link}\nPrice(USD): ${usd}\nShipping(USD): ${shipping.toFixed(2)}\nTotal(KES): Ksh ${totalKES}\nDelivery: 3 weeks`;
    const url = 'https://wa.me/' + phone.replace('+','') + '?text=' + encodeURIComponent(msg);
    window.open(url,'_blank');
  });
}

// Init app
document.addEventListener('DOMContentLoaded', async ()=>{
  PRODUCTS = await loadProducts();
  // restore cart
  CART = JSON.parse(localStorage.getItem('deenice_cart')||'[]');
  updateCartUI();
  renderProducts(PRODUCTS);
  initSearch();
  initOffers();
  initBuyForMe();

  document.body.addEventListener('click', (e)=>{
    if(e.target.matches('.open')) openProduct(e.target.dataset.id);
    if(e.target.matches('.quickAdd')) quickAdd(e.target.dataset.id);
    if(e.target.id === 'addToCart') addToCartFromModal();
    if(e.target.id === 'buyNow') buyNowFromModal();
    if(e.target.id === 'cartBtn' || e.target.closest('#cartBtn')) {
      document.getElementById('cartDrawer').classList.toggle('hidden');
    }
    if(e.target.classList.contains('close-modal')) {
      e.target.closest('.modal').classList.add('hidden');
    }
    if(e.target.classList.contains('close-cart')) {
      document.getElementById('cartDrawer').classList.add('hidden');
    }
    if(e.target.id === 'checkoutWhats') checkoutCartViaWhatsApp();
    if(e.target.id === 'clearCart') { CART=[]; localStorage.removeItem('deenice_cart'); updateCartUI(); }
  });
});
