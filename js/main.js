// main.js - Deenice Finds
document.addEventListener('DOMContentLoaded', function(){
  // Product data (Postimg links)
  const PRODUCTS = [
    {id:'p1', title:'Chromeheart Beanies', price:1900, currency:'KES', desc:'Premium beanies, warm & stylish.', images:['https://i.postimg.cc/441XX552/O1-CN01-Sj-Tb-Ky2-G1tx7oc-Nfp-2213981258956-0-cib.jpg']},
    {id:'p2', title:'New Era Caps', price:1700, currency:'KES', desc:'Classic New Era caps.', images:['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg']},
    {id:'p3', title:'ChromeHeart Glasses', price:2600, currency:'KES', desc:'Designer sunglasses with UV protection.', images:['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg']},
    {id:'p4', title:'Magnetic Selfie Display', price:5800, currency:'KES', desc:'Selfie display — Black, White & Pink options.', images:['https://i.postimg.cc/PfKngqXM/O1-CN01-YHh-BIJ1sy1h2k-YDZ9-2218194145834-0-cib.jpg']}
  ];

  const grid = document.getElementById('products');
  PRODUCTS.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card fade-up';
    card.innerHTML = `
      <img class="card-img" loading="lazy" src="${p.images[0]}" alt="${p.title}">
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:8px">
          <div><div style="font-weight:700">${p.title}</div><div class="muted">${p.desc}</div></div>
          <div style="text-align:right"><div class="price">${p.currency} ${formatPrice(p.price)}</div></div>
        </div>
        <div class="actions">
          <button class="btn btn-primary" data-id="${p.id}">View</button>
          <button class="btn btn-ghost" data-id="${p.id}">Quick buy</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // fade-in page
  setTimeout(()=> document.getElementById('page').classList.add('in'), 60);

  // intersection observer for cards
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.12});
  document.querySelectorAll('.fade-up').forEach(e=>io.observe(e));

  // modal and order logic
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalImg = document.getElementById('modalImg');
  const modalDesc = document.getElementById('modalDesc');
  const orderQty = document.getElementById('orderQty');
  const orderBuyer = document.getElementById('orderBuyer');
  const orderLocation = document.getElementById('orderLocation');
  const orderNotes = document.getElementById('orderNotes');
  const sendOrderBtn = document.getElementById('sendOrderBtn');
  const closeModal = document.getElementById('closeModal');
  const colorWrap = document.getElementById('colorSelectWrap');
  const colorSelect = document.getElementById('orderColor');
  let active = null;

  document.addEventListener('click', (e)=>{
    if(e.target.matches('.btn.btn-primary') || e.target.matches('.btn-primary')){
      const id = e.target.dataset.id;
      openModal(id);
    }
    if(e.target.matches('.btn.btn-ghost') || e.target.matches('.btn-ghost')){
      const id = e.target.dataset.id;
      openModal(id);
      setTimeout(()=> orderBuyer.focus(), 220);
    }
  });

  function openModal(id){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    active = p;
    modalTitle.textContent = p.title;
    modalImg.src = p.images[0];
    modalDesc.textContent = p.desc;
    orderQty.value = 1; orderBuyer.value = ''; orderLocation.value = ''; orderNotes.value = '';
    colorWrap.style.display = p.id==='p4' ? 'block' : 'none';
    modalBackdrop.style.display = 'flex';
  }

  closeModal.addEventListener('click', ()=> modalBackdrop.style.display = 'none');
  modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) modalBackdrop.style.display='none'; });
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') modalBackdrop.style.display='none'; });

  sendOrderBtn.addEventListener('click', ()=>{
    const buyer = orderBuyer.value.trim();
    const qty = parseInt(orderQty.value) || 1;
    const loc = orderLocation.value.trim() || 'Not provided';
    const notes = orderNotes.value.trim();
    if(!buyer){ alert('Please enter your WhatsApp number with country code.'); orderBuyer.focus(); return; }
    let colorNote = '';
    if(active && active.id==='p4'){ colorNote = `Color: ${colorSelect.value}\n`; }
    const message = `New order from Deenice Finds\n\nProduct: ${active.title}\nPrice: ${active.currency} ${formatPrice(active.price)}\nQuantity: ${qty}\nBuyer WhatsApp: ${buyer}\nLocation: ${loc}\n${colorNote}Notes: ${notes}`;
    const url = `https://wa.me/254799507007?text=` + encodeURIComponent(message);
    window.open(url, '_blank');
  });

  // chat placeholder click - info
  document.getElementById('chatPlaceholder').addEventListener('click', ()=>{
    alert('Tidio chatbot placeholder. Sign in to Tidio, copy your widget script and replace YOUR_TIDIO_ID in index.html to enable.');
  });

  // helper
  function formatPrice(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
});
