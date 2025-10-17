// app-v5.js - dynamic, performance-focused
async function loadProducts(){ const r = await fetch('products.json'); return r.json(); }
let PRODUCTS = []; let CART = [];
function formatKES(n){ return 'Ksh ' + Number(n).toLocaleString('en-KE'); }

// Lazy load images via IntersectionObserver
function lazyInit(){
  const imgs = document.querySelectorAll('img.lazy');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          io.unobserve(img);
        }
      });
    }, {rootMargin:'200px'});
    imgs.forEach(i=>io.observe(i));
  } else {
    imgs.forEach(i=>i.src = i.dataset.src);
  }
}

// render products as links to product.html (dynamic)
function renderProducts(products){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p=>{
    const a = document.createElement('a');
    a.href = 'product.html?id=' + encodeURIComponent(p.id);
    a.className = 'card-link';
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<img loading="lazy" data-src="${p.images[0]}" class="lazy" alt="${p.title}"/><div class="title">${p.title}</div><div class="price">${formatKES(p.price)}</div><div class="muted">${p.short}</div>`;
    a.appendChild(card);
    grid.appendChild(a);
  });
  lazyInit();
}

// hamburger open/close with nice animation (vertical slide handled by CSS)
function initHamburger(){
  const btn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  btn.addEventListener('click', ()=>{
    const isOpen = mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    // subtle logo scale when menu opens
    document.querySelector('.brand img').style.transform = isOpen ? 'scale(0.92)' : 'scale(1)';
  });
}

// offers slider with touch; lazy load slide images
function initOffers(){
  const slider = document.getElementById('offersSlider');
  const dots = document.getElementById('offerDots');
  const slides = slider.children;
  let idx = 0;
  for(let i=0;i<slides.length;i++){
    const b = document.createElement('button');
    b.addEventListener('click', ()=>{ idx = i; move(); });
    dots.appendChild(b);
  }
  function move(){ slider.style.transform = `translateX(-${idx*100}%)`; Array.from(dots.children).forEach((d,di)=>d.classList.toggle('active', di===idx)); }
  document.getElementById('prevOffer').addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; move(); });
  document.getElementById('nextOffer').addEventListener('click', ()=>{ idx = (idx+1)%slides.length; move(); });
  move();
  let auto = setInterval(()=>{ idx = (idx+1)%slides.length; move(); }, 6000);

  // touch handling optimized
  let startX=0, dx=0, dragging=false;
  slider.addEventListener('touchstart', e=>{ clearInterval(auto); dragging=true; startX=e.touches[0].clientX; }, {passive:true});
  slider.addEventListener('touchmove', e=>{ if(!dragging) return; dx = e.touches[0].clientX - startX; slider.style.transform = `translateX(${ -idx*100 + (dx/slider.clientWidth)*100 }%)`; }, {passive:true});
  slider.addEventListener('touchend', e=>{ dragging=false; if(Math.abs(dx) > 50){ if(dx < 0) idx = Math.min(idx+1, slides.length-1); else idx = Math.max(idx-1, 0); } dx=0; move(); auto = setInterval(()=>{ idx = (idx+1)%slides.length; move(); },6000); });
  // lazy init for slides images
  setTimeout(()=>{ document.querySelectorAll('#offersSlider img.lazy').forEach(i=>i.src = i.dataset.src); }, 200);
}

// Search UI - suggestions constrained to viewport width on mobile
function initSearch(){
  const sToggle = document.getElementById('searchToggle');
  const sBox = document.getElementById('searchBox');
  const sInput = document.getElementById('searchInput');
  const sSuggest = document.getElementById('searchSuggest');
  const chipContainer = sSuggest.querySelector('.cat-chips');
  const results = sSuggest.querySelector('.results');
  const categories = ['Phones Cases','Sunglasses','Beanies','NewEra caps','Powerbanks'];
  chipContainer.innerHTML = categories.map(c=>`<button class="cat-chip" data-cat="${c}">${c}</button>`).join('');
  chipContainer.querySelectorAll && chipContainer.querySelectorAll('.cat-chip') && Array.from(chipContainer.querySelectorAll('.cat-chip')).forEach(ch=>{
    ch.addEventListener('click', ()=>{ sInput.value = ch.dataset.cat; filter(); });
  });

  sToggle.addEventListener('click', ()=>{
    const wasHidden = sBox.classList.toggle('hidden');
    if(!sBox.classList.contains('hidden')){ sInput.classList.add('expanded'); sInput.focus(); sSuggest.classList.remove('hidden'); positionSuggest(); }
    else { sInput.classList.remove('expanded'); sSuggest.classList.add('hidden'); }
  });

  function positionSuggest(){
    // ensure suggestions fit viewport horizontally on mobile
    const rect = sBox.getBoundingClientRect();
    sSuggest.style.left = '0px';
    sSuggest.style.width = Math.min(window.innerWidth - 32, 340) + 'px';
  }
  window.addEventListener('resize', positionSuggest);

  function filter(){
    const q = sInput.value.toLowerCase().trim();
    const res = PRODUCTS.filter(p=> (p.title + ' ' + (p.short||'')).toLowerCase().includes(q)).slice(0,6);
    results.innerHTML = res.map(r=>`<div class="suggestion" data-id="${r.id}"><img src="${r.images[0]}" style="width:56px;height:56px;object-fit:cover;border-radius:6px"/><div style="margin-left:8px"><strong>${r.title}</strong><div>${formatKES(r.price)}</div></div></div>`).join('');
    // attach click handlers
    Array.from(results.querySelectorAll('.suggestion')).forEach(el=> el.addEventListener('click', ()=> window.location.href = 'product.html?id=' + el.dataset.id ));
    sSuggest.classList.toggle('hidden', res.length===0 && q.length===0);
  }

  sInput.addEventListener('input', filter);
  sInput.addEventListener('blur', ()=> setTimeout(()=> sSuggest.classList.add('hidden'), 150));
}

// disable double-tap zoom safeguard: prevent zooming by setting meta viewport; additionally block pinch-zoom
document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, {passive:false});

// init
document.addEventListener('DOMContentLoaded', async ()=>{
  PRODUCTS = await loadProducts();
  CART = JSON.parse(localStorage.getItem('deenice_cart')||'[]');
  document.getElementById('cartCount').textContent = CART.length;
  renderProducts(PRODUCTS);
  initHamburger();
  initOffers();
  initSearch();
  lazyInit();

  // help center open (tidio)
  const help = document.getElementById('helpCenter');
  if(help) help.addEventListener('click', (e)=>{ e.preventDefault(); window.tidioChatApi && window.tidioChatApi.open(); });
});
