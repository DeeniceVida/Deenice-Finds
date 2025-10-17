// app-v4.js - homepage behavior v4
async function loadProducts(){ const r = await fetch('products.json'); return r.json(); }
let PRODUCTS = []; let CART = [];

function formatKES(n){ return 'Ksh ' + Number(n).toLocaleString('en-KE'); }

// Render product cards as clickable links
function renderProducts(products){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p=>{
    const a = document.createElement('a');
    a.href = 'product.html?id=' + encodeURIComponent(p.id);
    a.className = 'card-link';
    a.innerHTML = `<article class="card" aria-label="${p.title}">
      <img loading="lazy" src="${p.images[0]}" alt="${p.title}" />
      <div class="title">${p.title}</div>
      <div class="price">${formatKES(p.price)}</div>
      <div class="muted">${p.short}</div>
    </article>`;
    grid.appendChild(a);
  });
}

// Mobile hamburger toggle
function initHamburger(){
  const btn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  btn.addEventListener('click', ()=>{
    const isOpen = mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
}

// Offers slider with touch support
function initOffers(){
  const slider = document.getElementById('offersSlider');
  const dots = document.getElementById('offerDots');
  const slides = slider.children;
  let idx = 0;
  for(let i=0;i<slides.length;i++){
    const b=document.createElement('button');
    b.addEventListener('click', ()=> { idx=i; move(); });
    dots.appendChild(b);
  }
  function move(){ slider.style.transform = `translateX(-${idx*100}%)`; Array.from(dots.children).forEach((d,di)=>d.classList.toggle('active',di===idx)); }
  document.getElementById('prevOffer').addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; move(); });
  document.getElementById('nextOffer').addEventListener('click', ()=>{ idx = (idx+1)%slides.length; move(); });
  move();
  let auto = setInterval(()=>{ idx = (idx+1)%slides.length; move(); },6000);

  // touch support
  let startX = 0, dx = 0, isDown=false;
  slider.addEventListener('touchstart', (e)=>{
    clearInterval(auto);
    isDown = true;
    startX = e.touches[0].clientX;
  }, {passive:true});
  slider.addEventListener('touchmove', (e)=>{
    if(!isDown) return;
    dx = e.touches[0].clientX - startX;
    slider.style.transform = `translateX(${ -idx*100 + (dx / slider.clientWidth)*100 }%)`;
  }, {passive:true});
  slider.addEventListener('touchend', (e)=>{
    isDown = false;
    if(Math.abs(dx) > 50){
      if(dx < 0) idx = Math.min(idx+1, slides.length-1);
      else idx = Math.max(idx-1, 0);
    }
    dx = 0;
    move();
    auto = setInterval(()=>{ idx = (idx+1)%slides.length; move(); },6000);
  });
}

// Search behavior
function initSearch(){
  const sToggle = document.getElementById('searchToggle');
  const sBox = document.getElementById('searchBox');
  const sInput = document.getElementById('searchInput');
  const sSuggest = document.getElementById('searchSuggest');
  const categories = ['Phones Cases','Sunglasses','Beanies','NewEra caps','Powerbanks'];

  function showChips(){
    sSuggest.innerHTML = '<div class="cat-chips">' + categories.map(c=>`<button class="cat-chip" data-cat="${c}">${c}</button>`).join('') + '</div><div class="results"></div>';
    sSuggest.style.display = 'block';
    Array.from(sSuggest.querySelectorAll('.cat-chip')).forEach(ch=>{
      ch.addEventListener('click', ()=>{ sInput.value = ch.dataset.cat; filterResults(); });
    });
  }

  sToggle.addEventListener('click', ()=>{
    const wasHidden = sBox.classList.toggle('hidden');
    if(!sBox.classList.contains('hidden')){
      sInput.classList.add('expanded');
      sInput.focus();
      showChips();
    } else {
      sInput.classList.remove('expanded');
      sSuggest.style.display='none';
    }
  });

  sInput.addEventListener('input', ()=>{
    const q = sInput.value.toLowerCase().trim();
    const results = PRODUCTS.filter(p=> (p.title + ' ' + (p.short||'')).toLowerCase().includes(q)).slice(0,6);
    const resDiv = sSuggest.querySelector('.results') || sSuggest;
    resDiv.innerHTML = results.map(r=>`<div class="suggestion" data-id="${r.id}"><img src="${r.images[0]}"/><div><strong>${r.title}</strong><div>${formatKES(r.price)}</div></div></div>`).join('');
    Array.from(resDiv.querySelectorAll('.suggestion')).forEach(el=>{ el.addEventListener('click', ()=>{ window.location.href = 'product.html?id=' + el.dataset.id; }); });
    sSuggest.style.display = results.length ? 'block' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  PRODUCTS = await loadProducts();
  CART = JSON.parse(localStorage.getItem('deenice_cart')||'[]');
  document.getElementById('cartCount').textContent = CART.length;
  renderProducts(PRODUCTS);
  initHamburger();
  initOffers();
  initSearch();
  const help = document.getElementById('helpCenter');
  if(help) help.addEventListener('click', (e)=>{ e.preventDefault(); window.tidioChatApi && window.tidioChatApi.open(); });
});
