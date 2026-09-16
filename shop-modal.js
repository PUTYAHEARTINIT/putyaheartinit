// Size Selector System
(function() {
  const modal = document.getElementById('sizeModal');
  const closeBtn = document.getElementById('closeModal');
  const productName = document.getElementById('modalProductName');
  const productPrice = document.getElementById('modalProductPrice');
  const sizeButtons = document.getElementById('sizeButtons');

  function closeModal() {
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function showSizeSelector(productBaseName) {
    const product = STRIPE_PRODUCTS[productBaseName];
    if (!product) {
      console.error('Product not found:', productBaseName);
      return;
    }

    productName.textContent = product.name;
    productPrice.textContent = '$' + product.price.toFixed(0);
    sizeButtons.innerHTML = '';

    if (!product.sizes) {
      window.location.href = product.link;
      return;
    }

    ['S', 'M', 'L', 'XL', 'XXL'].forEach(size => {
      const link = product.sizes[size];
      if (link) {
        const btn = document.createElement('a');
        btn.href = link;
        btn.textContent = size;
        btn.style.cssText = `display:flex;align-items:center;justify-content:center;padding:16px 8px;background:var(--black);border:1px solid rgba(255,255,255,0.1);color:var(--cream);font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;text-decoration:none;transition:all 0.3s;cursor:pointer;`;
        btn.onmouseenter = () => {
          btn.style.background = 'var(--white)';
          btn.style.color = 'var(--black)';
        };
        btn.onmouseleave = () => {
          btn.style.background = 'var(--black)';
          btn.style.color = 'var(--cream)';
        };
        sizeButtons.appendChild(btn);
      }
    });

    modal.style.display = 'flex';
  }

  // Only these are purchasable right now — every other item in the line
  // stays visible (so the shop doesn't look empty) but is marked
  // "Coming Soon" and its buy flow is disabled until it's brought back.
  const AVAILABLE_NOW = ['Astro Heart Tee', 'Heart Throne Long Sleeve'];

  document.querySelectorAll('.prod-card').forEach(card => {
    card.removeAttribute('href');
    const productNameEl = card.querySelector('.prod-name');
    const name = productNameEl ? productNameEl.textContent.trim() : '';

    if (!AVAILABLE_NOW.includes(name)) {
      card.classList.add('coming-soon');
      const img = card.querySelector('.prod-img');
      if (img) {
        const badge = document.createElement('span');
        badge.className = 'prod-badge';
        badge.textContent = 'Coming Soon';
        img.appendChild(badge);
      }
      card.addEventListener('click', (e) => e.preventDefault());
      return;
    }

    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      if (name) showSizeSelector(name);
    });
  });
})();

// Shop collections: one collapsed row per clothing type — click to expand
// and see every option in it, instead of every collection stacked open.
(function() {
  document.querySelectorAll('.collection-label').forEach(label => {
    const wrap = label.closest('.rv');
    const grid = wrap ? wrap.nextElementSibling : null;
    if (!grid || !grid.classList.contains('prod-grid')) return;

    const count = grid.querySelectorAll('.prod-card').length;
    const countEl = document.createElement('span');
    countEl.className = 'cl-count';
    countEl.textContent = count + (count === 1 ? ' item' : ' items');
    const chev = document.createElement('span');
    chev.className = 'cl-chev';
    chev.textContent = '⌄';
    label.appendChild(countEl);
    label.appendChild(chev);

    grid.classList.add('collapsed');
    label.addEventListener('click', () => {
      grid.classList.toggle('collapsed');
      label.classList.toggle('open');
    });
  });
})();
