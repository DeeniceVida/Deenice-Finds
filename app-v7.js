// app-v7.js - merged behavior (menus, iphone listings, search, offers, lazy loading)
// WhatsApp number centralized here:
const DH_WHATSAPP = '+254106590617';

/* iphoneModels can be edited to add/remove iPhone model names */
const iphoneModels = [
  "iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone SE (2nd generation)",
  "iPhone 12","iPhone 12 mini","iPhone 12 Pro","iPhone 12 Pro Max",
  "iPhone 13","iPhone 13 mini","iPhone 13 Pro","iPhone 13 Pro Max",
  "iPhone SE (3rd generation)","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max",
  "iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max",
  "iPhone 16e","iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max",
  "iPhone 17","iPhone 17 Air","iPhone 17 Pro","iPhone 17 Pro Max"
];

// Minimal helper functions
function formatKES(n){ return 'Ksh ' + Number(n).toLocaleString('en-KE'); }

// Lazy loader for images
function lazyInit(scope=document){
  const imgs = scope.querySelectorAll('img[data-src]');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    }, {rootMargin:'200px'});
    imgs.forEach(i=>io.observe(i));
  } else {
    imgs.forEach(i=>i.src = i.dataset.src);
  }
}

// Merge: initialize hamburger if present
function initHamburger(btnId='hamburgerBtn', mobileNavId='mobileNav'){
  const btn = document.getElementById(btnId);
  const mobileNav = document.getElementById(mobileNavId);
  if(!btn || !mobileNav) return;
  btn.addEventListener('click', ()=>{
    const open = mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', open? 'false':'true');
    btn.setAttribute('aria-label', open? 'Close menu':'Open menu');
    document.querySelector('.brand img') && (document.querySelector('.brand img').style.transform = open ? 'scale(0.92)' : 'scale(1)');
  });
}

// Merge: init offers slider if exists
function initOffers(sliderId='offersSlider', dotsId='offerDots', prevId='prevOffer', nextId='nextOffer'){
  const slider = document.getElementById(sliderId);
  if(!slider) return;
  const slides = slider.children;
  const dots = document.getElementById(dotsId);
  let idx = 0;
  if(dots) for(let i=0;i<slides.length;i++){ const b=document.createElement('button'); b.addEventListener('click', ()=>{ idx=i; move(); }); dots.appendChild(b); }
  function move(){ slider.style.transform = `translateX(-${idx*100}%)`; if(dots) Array.from(dots.children).forEach((d,di)=>d.classList.toggle('active',di===idx)); }
  document.getElementById(prevId) && document.getElementById(prevId).addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; move(); });
  document.getElementById(nextId) && document.getElementById(nextId).addEventListener('click', ()=>{ idx = (idx+1)%slides.length; move(); });
  move();
  let auto = setInterval(()=>{ idx = (idx+1)%slides.length; move(); },6000);

  // touch support
  let startX=0, dx=0, dragging=false;
  slider.addEventListener('touchstart', e=>{ clearInterval(auto); dragging=true; startX=e.touches[0].clientX; }, {passive:true});
  slider.addEventListener('touchmove', e=>{ if(!dragging) return; dx = e.touches[0].clientX - startX; slider.style.transform = `translateX(${ -idx*100 + (dx/slider.clientWidth)*100 }%)`; }, {passive:true});
  slider.addEventListener('touchend', e=>{ dragging=false; if(Math.abs(dx) > 50){ if(dx < 0) idx = Math.min(idx+1, slides.length-1); else idx = Math.max(idx-1, 0); } dx=0; move(); auto = setInterval(()=>{ idx = (idx+1)%slides.length; move(); },6000); });
  // lazy load images inside slider
  setTimeout(()=>{ slider.querySelectorAll('img[data-src]').forEach(i=>i.src = i.dataset.src); }, 200);
}

// Merge: search behavior (simple)
function initSearch(toggleId='searchToggle', boxId='searchBox', inputId='searchInput', suggestId='searchSuggest', productsList=[]){
  const sToggle = document.getElementById(toggleId);
  const sBox = document.getElementById(boxId);
  const sInput = document.getElementById(inputId);
  const sSuggest = document.getElementById(suggestId);
  if(!sToggle || !sBox || !sInput || !sSuggest) return;
  const categories = ['Phones Cases','Sunglasses','Beanies','NewEra caps','Powerbanks'];
  sToggle.addEventListener('click', ()=>{
    sBox.classList.toggle('hidden');
    if(!sBox.classList.contains('hidden')){ sInput.classList.add('expanded'); sInput.focus(); sSuggest.classList.remove('hidden'); positionSuggest(); } else { sInput.classList.remove('expanded'); sSuggest.classList.add('hidden'); }
  });
  function positionSuggest(){ sSuggest.style.left='0px'; sSuggest.style.width = Math.min(window.innerWidth - 32, 340) + 'px'; }
  window.addEventListener('resize', positionSuggest);
  sInput.addEventListener('input', ()=>{
    const q = sInput.value.toLowerCase().trim();
    const res = (productsList || []).filter(p=> (p.title + ' ' + (p.short||'')).toLowerCase().includes(q)).slice(0,6);
    const results = res.map(r=>`<div class="suggestion" data-id="${r.id}"><img src="${r.images && r.images[0] || ''}" style="width:56px;height:56px;object-fit:cover"/><div style="margin-left:8px"><strong>${r.title}</strong><div>${formatKES(r.price || '')}</div></div></div>`).join('');
    sSuggest.querySelector('.results').innerHTML = results;
    Array.from(sSuggest.querySelectorAll('.suggestion')).forEach(el=> el.addEventListener('click', ()=> window.location.href = 'product.html?id=' + el.dataset.id ));
  });
}

// Render iphone collections if iphone-products.json exists
async function renderIphoneCollections(containerId='iphoneList', jsonPath='assets/data/iphone-products.json'){
  const container = document.getElementById(containerId);
  if(!container) return;
  try{
    const res = await fetch(jsonPath);
    const data = await res.json();
    data.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const inStock = product.status === 'in-stock';
      const stockBadge = `<p class="stock-alert ${inStock ? 'in-stock' : 'out-of-stock'}">${inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>`;
      const colorThumbs = (product.colors || []).map((c, idx) => {
        const hidden = idx >= 5 ? 'hidden' : '';
        const img = c.image || 'https://i.postimg.cc/ChT8ngfm/logo-1-3x-100.jpg';
        return `<span class="color-thumb ${hidden}" data-color="${c.name}" style="background-image:url('${img}')" title="${c.name}"></span>`;
      }).join('');
      card.innerHTML = `
        <img data-src="${product.mainImage || ''}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <div class="stock-and-price">${stockBadge}<div class="price" style="font-weight:700">${product.price_from || ''}</div></div>
        <label for="model-${product.id}">Select model:</label>
        <select id="model-${product.id}" class="model-dropdown"><option value="">Choose model</option></select>
        <div class="color-options"><p style="margin:8px 0 6px">Select color:</p><div class="color-swatches">${colorThumbs}</div><p class="selected-color">Selected: —</p></div>
        <button class="show-more-colors">Show more colors</button>
        <div style="margin-top:10px"><button class="btn-order" ${inStock ? '' : 'disabled'}>Order via WhatsApp</button></div>
      `;
      // populate models
      const dropdown = card.querySelector(`#model-${product.id}`);
      iphoneModels.forEach(m => { const opt = document.createElement('option'); opt.value = m; opt.textContent = m; dropdown.appendChild(opt); });
      // swatches handler
      const swatches = card.querySelector('.color-swatches');
      swatches.addEventListener('click', (e) => {
        const target = e.target.closest('.color-thumb');
        if(!target) return;
        swatches.querySelectorAll('.color-thumb').forEach(c => c.classList.remove('selected'));
        target.classList.add('selected');
        const colorName = target.dataset.color || '—';
        card.querySelector('.selected-color').textContent = 'Selected: ' + colorName;
      });
      // show more colors
      const showBtn = card.querySelector('.show-more-colors');
      showBtn.addEventListener('click', ()=>{ card.querySelectorAll('.color-thumb.hidden').forEach(el=>el.classList.remove('hidden')); showBtn.style.display='none'; });
      // order button
      const orderBtn = card.querySelector('.btn-order');
      if(inStock){
        orderBtn.addEventListener('click', ()=>{
          const model = dropdown.value || 'Not specified';
          const colorEl = card.querySelector('.color-thumb.selected');
          const color = colorEl ? colorEl.dataset.color : 'Not specified';
          const msg = `Hello, I'm interested in ${product.title} - Model: ${model} - Color: ${color}`;
          window.open('https://wa.me/' + DH_WHATSAPP.replace('+','') + '?text=' + encodeURIComponent(msg), '_blank');
        });
      } else {
        orderBtn.classList.add('disabled-link');
        orderBtn.title = 'Out of stock';
      }
      // append and lazy init image
      container.appendChild(card);
    });
    lazyInit(container);
  } catch(e){
    console.warn('No iphone products JSON found or failed to load:', e);
  }
}

// Auto-init common pieces on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async ()=>{
  // init hamburger if present
  initHamburger();
  // init offers slider if present
  initOffers();
  // render iphone collections if page contains #iphoneList
  renderIphoneCollections();
  // lazy init for any remaining images
  lazyInit();
});