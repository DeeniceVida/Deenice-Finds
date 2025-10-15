document.addEventListener('DOMContentLoaded', function () {
  const PRODUCTS = [
    { id: 'p1', title: 'Chromeheart Beanies', price: 1900, images: ['https://i.postimg.cc/441XX552/O1-CN01-Sj-Tb-Ky2-G1tx7oc-Nfp-2213981258956-0-cib.jpg'], desc: 'Warm ribbed beanie with embroidered logo.' },
    { id: 'p2', title: 'New Era Caps', price: 1700, images: ['https://i.postimg.cc/fLNhNtSH/O1-CN01-XDatn-Z1-Pmv-Fhq-Lh-K7-2215114721884-0-cib.jpg'], desc: 'Classic curved brim cap.' },
    { id: 'p3', title: 'ChromeHeart Sunglasses', price: 2600, images: ['https://i.postimg.cc/PJfsCg4c/O1-CN01-E4vv4r1d4-PHxocq-S4-2214783223682-0-cib.jpg'], desc: 'UV protection sunglasses.' },
  ];

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const header = document.getElementById('siteHeader');

  // Highlight header
  searchBtn.addEventListener('click', () => {
    header.classList.add('highlight');
    setTimeout(() => header.classList.remove('highlight'), 700);

    searchInput.classList.toggle('open');
    if (searchInput.classList.contains('open')) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      searchSuggestions.classList.remove('active');
    }
  });

  // Suggestions
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchSuggestions.innerHTML = '';
    if (!query) {
      searchSuggestions.classList.remove('active');
      return;
    }

    const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(query));
    if (matches.length === 0) {
      searchSuggestions.classList.remove('active');
      return;
    }

    matches.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${p.images[0]}" alt="${p.title}">
        <div>
          <strong>${p.title}</strong><br>
          <small>KES ${p.price.toLocaleString()}</small>
        </div>
      `;
      li.addEventListener('click', () => {
        location.href = `product.html?id=${p.id}`;
      });
      searchSuggestions.appendChild(li);
    });

    searchSuggestions.classList.add('active');
  });
});



