// script.js - Deenice Finds 2.0
document.addEventListener('DOMContentLoaded', function(){
  const PRODUCTS = [
    {id:'p1', title:'Chromeheart Beanies', price:1900, currency:'KES', desc:'Warm ribbed beanie with embroidered logo.', images:['https://i.postimg.cc/441XX552/O1-CN01-Sj-Tb-Ky2-G1tx7oc-Nfp-2213981258956-0-cib.jpg'], colors:[{name:'Black',hex:'#000000'},{name:'Grey',hex:'#9CA3AF'},{name:'Beige',hex:'#D9CAB3'}]},
    {id:'p2', title:'New Era Caps', price:1700, currency:'KES', desc:'Classic curved brim caps in sports cut.', images:['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg'], colors:[{name:'Black',hex:'#000000'},{name:'Navy',hex:'#0F172A'},{name:'White',hex:'#FFFFFF'}]},
    {id:'p3', title:'ChromeHeart Sunglasses', price:2600, currency:'KES', desc:'UV protection sunglasses with metallic trim.', images:['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg'], colors:[{name:'Black',hex:'#000000'},{name:'Gold',hex:'#D4AF37'},{name:'Brown',hex:'#8B5E3C'}]},
    {id:'p4', title:'Magnetic Selfie Display', price:5800, currency:'KES', desc:'Portable magnetic screen for selfies - 3 colors.', images:['https://i.postimg.cc/PfKngqXM/O1-CN01-YHh-BIJ1sy1h2k-YDZ9-2218194145834-0-cib.jpg'], colors:[{name:'Black',hex:'#000000'},{name:'White',hex:'#FFFFFF'},{name:'Pink',hex:'#FFC0CB'}]},
    {id:'p5', title:'Wireless Earbuds', price:2200, currency:'KES', desc:'Noise-cancelling wireless earbuds.', images:['https://i.postimg.cc/w3trJgst/display.jpg'], colors:[{name:'Black',hex:'#111827'},{name:'White',hex:'#FFFFFF'}]},
    {id:'p6', title:'iPhone Case', price:1200, currency:'KES', desc:'Sleek protective phone case.', images:['https://i.postimg.cc/SjjBrcHc/beanie.jpg'], colors:[{name:'Black',hex:'#000000'},{name:'Clear',hex:'#FFFFFF'}]}
  ];

  const grid = document.getElementById('productGrid');
  const searchToggle = document.getElementById('searchToggle');
  const searchInput = document.getElementById('searchInput');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modal = modalBackdrop.querySelector('.modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalImg = document.getElementById('modalImg');
  const modalDesc = document.getElementById('modalDesc');
  const modalThumbs = document.getElementById('modalThumbs');
  const modalColors = document.getElementById('modalColors');
  const modalQty = document.getElementById('modalQty');
  const modalBuy = document.getElementById('modalBuy');
  const closeModal = document.getElementById('closeModal');

  function formatPrice(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function renderGrid(filter=''){
    grid.innerHTML='';
    const q = (filter||'').toLowerCase().trim();
    PRODUCTS.filter(p => !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      .forEach(p => {
        const el = document.createElement('article');
        el.className='card fade-up';
        el.innerHTML = `
          <img loading="lazy" class="card-img" src="${p.images[0]}" alt="${p.title}">
          <div class="card-body">
            <div class="row-between">
              <div>
                <div class="product-title">${p.title}</div>
                <div class="product-desc">${p.desc}</div>
              </div>
              <div style="text-align:right"><div class="price">${p.currency} ${formatPrice(p.price)}</div></div>
            </div>
            <div class="color-list" aria-hidden="true"></div>
            <div class="actions">
              <button class="btn btn-primary" data-id="${p.id}">View</button>
              <button class="btn btn-ghost" data-id="${p.id}">Quick buy</button>
            </div>
          </div>
        `;
        grid.appendChild(el);
        const colorWrap = el.querySelector('.color-list');
        p.colors.forEach((c, i)=>{
          const sw = document.createElement('span');
          sw.className='color-swatch';
          sw.style.background = c.hex || '#ccc';
          if(i===0) sw.classList.add('selected');
          sw.title = c.name;
          sw.addEventListener('click', ()=>{
            el.querySelectorAll('.color-swatch').forEach(x=>x.classList.remove('selected'));
            sw.classList.add('selected');
            // future: change image per color mapping
          });
          colorWrap.appendChild(sw);
        });
      });

    // attach listeners
    grid.querySelectorAll('.btn.btn-primary').forEach(b=>b.addEventListener('click', e=>openModal(e.target.dataset.id)));
    grid.querySelectorAll('.btn.btn-ghost').forEach(b=>b.addEventListener('click', e=>quickBuy(e.target.dataset.id)));
  }

  function openModal(id){
    const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
    modalTitle.textContent = p.title;
    modalPrice.textContent = `${p.currency} ${formatPrice(p.price)}`;
    modalImg.src = p.images[0];
    modalDesc.textContent = p.desc;
    modalThumbs.innerHTML = '';
    modalColors.innerHTML = '';
    p.images.forEach(img=>{
      const t = document.createElement('img'); t.src=img; t.loading='lazy'; t.style.width='80px'; t.style.height='56px'; t.style.objectFit='cover'; t.style.borderRadius='8px'; t.style.cursor='pointer';
      t.addEventListener('click', ()=> modalImg.src = img);
      modalThumbs.appendChild(t);
    });
    p.colors.forEach((c,i)=>{
      const s = document.createElement('span'); s.className='color-swatch'; s.style.background=c.hex||'#ccc'; if(i===0) s.classList.add('selected'); s.title=c.name;
      s.addEventListener('click', ()=>{ modalColors.querySelectorAll('.color-swatch').forEach(x=>x.classList.remove('selected')); s.classList.add('selected'); });
      modalColors.appendChild(s);
    });

    // show modal with animation
    document.body.classList.add('modal-open');
    modalBackdrop.style.display='flex';
    setTimeout(()=> modal.classList.add('show'), 40);
    modalBackdrop.setAttribute('aria-hidden','false');
  }

  function closeModalFn(){
    modal.classList.remove('show');
    setTimeout(()=>{ modalBackdrop.style.display='none'; document.body.classList.remove('modal-open'); }, 260);
  }

  closeModal.addEventListener('click', closeModalFn);
  modalBackdrop.addEventListener('click', (e)=>{ if(e.target===modalBackdrop) closeModalFn(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModalFn(); });

  function quickBuy(id){
    openModal(id);
    setTimeout(()=> modalQty.focus(), 200);
  }

  modalBuy.addEventListener('click', ()=>{
    const qty = Math.max(1, parseInt(modalQty.value || '1'));
    const colorEl = modalColors.querySelector('.color-swatch.selected');
    const colorName = colorEl ? colorEl.title : '';
    const text = `Hi Deenice Finds! I'm interested in ${modalTitle.textContent} - ${modalPrice.textContent}. Quantity: ${qty}. Color: ${colorName}`;
    const url = `https://wa.me/254799507007?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  // SEARCH toggle & live filter
  let searchOpen=false;
  searchToggle.addEventListener('click', ()=>{
    searchOpen=!searchOpen;
    if(searchOpen){ searchInput.classList.add('open'); searchInput.focus(); } else { searchInput.classList.remove('open'); searchInput.value=''; renderGrid(); }
  });
  searchInput.addEventListener('input', (e)=> renderGrid(e.target.value));

  // page load
  renderGrid();
  setTimeout(()=> document.getElementById('page').classList.add('in'), 80);

  // show blog when ?blog or ?blog=true
  const params = new URLSearchParams(location.search);
  if(params.has('blog') || params.get('blog')==='true'){ document.getElementById('blogSection').style.display='block'; document.getElementById('blogSection').removeAttribute('aria-hidden'); }

  // hide tidio default placeholders if script loads
  (function hideTidioPlaceholders(){ const style=document.createElement('style'); style.innerHTML = `.tidio-floating-button, .tidio-embed, .tidio-chat-iframe, .tidio-widget { display: none !important; }`; document.head.appendChild(style); })();

  // expose estimate helper
  window.estimateDelivery = function(town){
    if(!town) return 'Delivery fees range between KES 200–800 depending on your location.';
    const t = town.toLowerCase().trim();
    const map = {'nairobi':'KES 200','nyeri':'KES 200','nakuru':'KES 400','kisumu':'KES 600','mombasa':'KES 800','eldoret':'KES 600','thika':'KES 250','meru':'KES 400'};
    return map[t] ? `Estimated delivery to ${town}: ${map[t]}` : `Estimated delivery to ${town}: around KES 700 (we will confirm exact cost).`;
  };
});
