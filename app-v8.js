// app-v8.js - main interactive script for Deenice Finds v8
const DH_WHATSAPP = '+254106590617'; // change here to update WhatsApp number

const iphoneModels = [
  "iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone SE (2nd generation)",
  "iPhone 12","iPhone 12 mini","iPhone 12 Pro","iPhone 12 Pro Max",
  "iPhone 13","iPhone 13 mini","iPhone 13 Pro","iPhone 13 Pro Max",
  "iPhone SE (3rd generation)","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max",
  "iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max",
  "iPhone 16e","iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max",
  "iPhone 17","iPhone 17 Air","iPhone 17 Pro","iPhone 17 Pro Max"
];

async function loadJSON(path){ try{ const r=await fetch(path); return await r.json(); }catch(e){return []; } }

function initHamburger(){
  const btn=document.getElementById('hamburgerBtn'), mobile=document.getElementById('mobileNav');
  if(!btn||!mobile) return;
  btn.addEventListener('click', ()=>{ const open=mobile.classList.toggle('open'); mobile.setAttribute('aria-hidden', open? 'false':'true'); btn.setAttribute('aria-label', open? 'Close menu':'Open menu'); document.querySelector('.brand img') && (document.querySelector('.brand img').style.transform = open ? 'scale(0.92)':'scale(1)'); });
}

function initOffers(){
  const slider=document.getElementById('offersSlider'); if(!slider) return;
  const slides=slider.children; const dots=document.getElementById('offerDots'); let idx=0;
  for(let i=0;i<slides.length;i++){ const b=document.createElement('button'); b.addEventListener('click', ()=>{ idx=i; move(); }); dots.appendChild(b); }
  function move(){ slider.style.transform = `translateX(-${idx*100}%)`; Array.from(dots.children).forEach((d,di)=>d.classList.toggle('active', di===idx)); }
  document.getElementById('prevOffer').addEventListener('click', ()=>{ idx=(idx-1+slides.length)%slides.length; move(); });
  document.getElementById('nextOffer').addEventListener('click', ()=>{ idx=(idx+1)%slides.length; move(); });
  move(); let auto=setInterval(()=>{ idx=(idx+1)%slides.length; move(); },6000);
  // touch support
  let startX=0, dx=0, dragging=false;
  slider.addEventListener('touchstart', e=>{ clearInterval(auto); dragging=true; startX=e.touches[0].clientX; }, {passive:true});
  slider.addEventListener('touchmove', e=>{ if(!dragging) return; dx = e.touches[0].clientX - startX; slider.style.transform = `translateX(${ -idx*100 + (dx/slider.clientWidth)*100 }%)`; }, {passive:true});
  slider.addEventListener('touchend', e=>{ dragging=false; if(Math.abs(dx) > 50){ if(dx<0) idx = Math.min(idx+1, slides.length-1); else idx = Math.max(idx-1,0); } dx=0; move(); auto=setInterval(()=>{ idx=(idx+1)%slides.length; move(); },6000); });
  setTimeout(()=>{ slider.querySelectorAll('img[data-src]').forEach(i=>i.src=i.dataset.src); },200);
}

function initSearch(products){
  const sToggle = document.getElementById('searchToggle');
  const sBox = document.getElementById('searchBox');
  const sInput = document.getElementById('searchInput');
  const sSuggest = document.getElementById('searchSuggest');
  if(!sToggle || !sBox || !sInput || !sSuggest) return;
  const chipContainer = sSuggest.querySelector('.cat-chips');
  const results = sSuggest.querySelector('.results');
  const categories = ['Phones Cases','Sunglasses','Beanies','NewEra caps','Powerbanks'];
  chipContainer.innerHTML = categories.map(c=>`<button class="cat-chip" data-cat="${c}">${c}</button>`).join('');
  chipContainer.querySelectorAll && chipContainer.querySelectorAll('.cat-chip') && Array.from(chipContainer.querySelectorAll('.cat-chip')).forEach(ch=>{ ch.addEventListener('click', ()=>{ sInput.value = ch.dataset.cat; filter(); }); });
  sToggle.addEventListener('click', ()=>{ sBox.classList.toggle('hidden'); if(!sBox.classList.contains('hidden')){ sInput.classList.add('expanded'); sInput.focus(); sSuggest.classList.remove('hidden'); positionSuggest(); } else { sInput.classList.remove('expanded'); sSuggest.classList.add('hidden'); } });
  function positionSuggest(){ sSuggest.style.left='0px'; sSuggest.style.width = Math.min(window.innerWidth - 32, 340) + 'px'; }
  window.addEventListener('resize', positionSuggest);
  function filter(){ const q = sInput.value.toLowerCase().trim(); const res = (products||[]).filter(p=> (p.title + ' ' + (p.short||'')).toLowerCase().includes(q)).slice(0,6); results.innerHTML = res.map(r=>`<div class="suggestion" data-id="${r.id}"><img src="${r.images[0]||''}" style="width:56px;height:56px;object-fit:cover;border-radius:6px"/><div style="margin-left:8px"><strong>${r.title}</strong><div>Ksh ${r.price||''}</div></div></div>`).join(''); Array.from(results.querySelectorAll('.suggestion')).forEach(el=> el.addEventListener('click', ()=> window.location.href = 'product.html?id=' + el.dataset.id )); sSuggest.classList.toggle('hidden', res.length===0 && q.length===0); }
  sInput.addEventListener('input', filter);
  sInput.addEventListener('blur', ()=> setTimeout(()=> sSuggest.classList.add('hidden'), 150));
}

async function renderProductGrid(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  const ps = await loadJSON('assets/data/products.json');
  ps.forEach(p=>{
    const a=document.createElement('a');
    a.href = 'product.html?id='+encodeURIComponent(p.id);
    a.className = 'card';
    a.innerHTML = `<img data-src="${p.images[0]}" class="lazy"/><div class="title">${p.title}</div><div class="price">Ksh ${p.price.toLocaleString()}</div><div class="muted">${p.short}</div>`;
    grid.appendChild(a);
  });
  // lazy init images
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ const img=e.target; img.src=img.dataset.src; io.unobserve(img); } }); }, {rootMargin:'200px'});
    document.querySelectorAll('img.lazy').forEach(i=>io.observe(i));
  } else document.querySelectorAll('img.lazy').forEach(i=>i.src=i.dataset.src);
  return ps;
}

async function renderIphoneCollections(){
  const container = document.getElementById('iphoneList');
  if(!container) return;
  const data = await loadJSON('assets/data/iphone-products.json');
  data.forEach(prod=>{
    const card = document.createElement('article'); card.className='product-card';
    const inStock = prod.status === 'in-stock';
    const stockBadge = `<p class="stock-alert ${inStock ? 'in-stock':'out-of-stock'}">${inStock ? '✅ In Stock':'❌ Out of Stock'}</p>`;
    const colorThumbs = (prod.colors||[]).map((c,idx)=>{const hidden = idx>=5 ? 'hidden': ''; const img=c.image||'https://i.postimg.cc/ChT8ngfm/logo-1-3x-100.jpg'; return `<span class="color-thumb ${hidden}" data-color="${c.name}" style="background-image:url('${img}')" title="${c.name}"></span>`; }).join('');
    card.innerHTML = `<img data-src="${prod.mainImage||''}" alt="${prod.title}"/><h3>${prod.title}</h3><div class="stock-and-price">${stockBadge}<div class="price" style="font-weight:700">${prod.price_from||''}</div></div><label for="model-${prod.id}">Select model:</label><select id="model-${prod.id}" class="model-dropdown"><option value="">Choose model</option></select><div class="color-options"><p style="margin:8px 0 6px">Select color:</p><div class="color-swatches">${colorThumbs}</div><p class="selected-color">Selected: —</p></div><button class="show-more-colors">Show more colors</button><div style="margin-top:10px"><button class="btn-order" ${inStock ? '' : 'disabled'}>Order via WhatsApp</button></div>`;
    // populate models
    const dropdown = card.querySelector(`#model-${prod.id}`);
    iphoneModels.forEach(m=>{ const opt=document.createElement('option'); opt.value = m; opt.textContent = m; dropdown.appendChild(opt); });
    // color click
    const swatches = card.querySelector('.color-swatches');
    swatches.addEventListener('click', e=>{ const t = e.target.closest('.color-thumb'); if(!t) return; swatches.querySelectorAll('.color-thumb').forEach(c=>c.classList.remove('selected')); t.classList.add('selected'); card.querySelector('.selected-color').textContent = 'Selected: ' + t.dataset.color; });
    // show more
    const showBtn = card.querySelector('.show-more-colors'); showBtn.addEventListener('click', ()=>{ card.querySelectorAll('.color-thumb.hidden').forEach(el=>el.classList.remove('hidden')); showBtn.style.display='none'; });
    // order button
    const orderBtn = card.querySelector('.btn-order');
    if(inStock){ orderBtn.addEventListener('click', ()=>{ const model = dropdown.value || 'Not specified'; const colorEl = card.querySelector('.color-thumb.selected'); const color = colorEl ? colorEl.dataset.color : 'Not specified'; const msg = `Hello, I'm interested in ${prod.title} - Model: ${model} - Color: ${color}`; window.open('https://wa.me/'+DH_WHATSAPP.replace('+','')+'?text='+encodeURIComponent(msg),'_blank'); }); } else { orderBtn.classList.add('disabled-link'); orderBtn.title='Out of stock'; }
    container.appendChild(card);
  });
  // lazy init for iphone images
  setTimeout(()=>{ document.querySelectorAll('#iphoneList img[data-src]').forEach(i=>i.src=i.dataset.src); },200);
}

document.addEventListener('DOMContentLoaded', async ()=>{
  initHamburger();
  initOffers();
  const products = await renderProductGrid();
  initSearch(products);
  renderIphoneCollections();
});
