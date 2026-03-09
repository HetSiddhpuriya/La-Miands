/**
 * ShopVerse - Main JavaScript
 * Handles navigation, search, animations, and all page-specific logic
 * Uses Fetch API with DummyJSON Products API
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Mobile Navigation
  // ============================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  // ============================================
  // Search Modal
  // ============================================
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  let searchTimeout;

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 200);
    });

    const closeSearch = () => {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    searchClose?.addEventListener('click', closeSearch);

    // Close on clicking backdrop
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });

    // Live search via API
    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (!searchResults) return;

      clearTimeout(searchTimeout);

      if (query.length < 2) {
        searchResults.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2.5rem 0;">Type at least 2 characters to search...</p>';
        return;
      }

      searchResults.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2.5rem 0;">Searching...</p>';

      searchTimeout = setTimeout(async () => {
        try {
          const data = await ProductAPI.searchProducts(query, 8);

          if (data.products.length === 0) {
            searchResults.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2.5rem 0;">No products found.</p>';
            return;
          }

          searchResults.innerHTML = data.products.map(p => `
            <a href="product.html?id=${p.id}" class="search-result-item">
              <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
              <div style="flex:1;min-width:0;">
                <h4 style="font-weight:600;color:var(--gray-800);font-size:0.95rem;">${p.title}</h4>
                <p style="font-size:0.8rem;color:var(--gray-500);text-transform:capitalize;">${p.category}</p>
              </div>
              <span style="font-weight:700;color:var(--primary-600);white-space:nowrap;">$${p.price.toFixed(2)}</span>
            </a>
          `).join('');
        } catch (err) {
          searchResults.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2.5rem 0;">Search failed. Please try again.</p>';
        }
      }, 350);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) closeSearch();
    });
  }

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
    if (window.scrollY > 40) navbar.classList.add('scrolled');
  }

  // ============================================
  // Scroll Reveal
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // Home Page
  // ============================================
  const featuredGrid = document.getElementById('featuredProducts');
  if (featuredGrid) {
    loadFeaturedProducts(featuredGrid);
  }

  const trendingGrid = document.getElementById('trendingProducts');
  if (trendingGrid) {
    loadTrendingProducts(trendingGrid);
  }

  const categoryGrid = document.getElementById('categoryGrid');
  if (categoryGrid) {
    loadCategories(categoryGrid);
  }

  const testimonialGrid = document.getElementById('testimonialGrid');
  if (testimonialGrid) {
    renderTestimonials(testimonialGrid);
  }

  // ============================================
  // Shop Page
  // ============================================
  const shopProductGrid = document.getElementById('shopProductGrid');
  if (shopProductGrid) {
    initShopPage();
  }

  // ============================================
  // Product Detail Page
  // ============================================
  const productDetailSection = document.getElementById('productDetail');
  if (productDetailSection) {
    initProductPage();
  }

  // ============================================
  // Cart Page
  // ============================================
  const cartItemsList = document.getElementById('cartItems');
  if (cartItemsList) {
    initCartPage();
  }
});

// ============================================
// Star Rating HTML
// ============================================
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  let html = '';

  for (let i = 0; i < fullStars; i++) {
    html += '<svg class="star-filled" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }

  if (hasHalf) {
    html += '<svg class="star-filled" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }

  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < empty; i++) {
    html += '<svg class="star-empty" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }

  return html;
}

// ============================================
// Product Card Template
// ============================================
function createProductCard(product) {
  const discount = Math.round(product.discountPercentage || 0);
  const originalPrice = product.price / (1 - (product.discountPercentage || 0) / 100);

  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}" class="product-img-wrap">
        <img src="${product.thumbnail}" alt="${product.title}" class="product-img" loading="lazy">
        ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
        ${product.brand ? `<span class="product-brand-badge">${product.brand}</span>` : ''}
        <div class="product-overlay">
          <span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Quick View
          </span>
        </div>
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.title}</h3>
        </a>
        <div class="product-rating">
          ${generateStars(product.rating)}
          <span style="font-size:0.8rem;color:var(--gray-400);margin-left:0.25rem;">(${product.rating.toFixed(1)})</span>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">$${product.price.toFixed(2)}</span>
            ${discount > 0 ? `<span class="product-original-price">$${originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button onclick='Cart.addItem(${JSON.stringify({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, category: product.category, brand: product.brand || "" })})' class="add-to-cart-btn" aria-label="Add ${product.title} to cart">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Skeleton Card (Loading)
// ============================================
function createSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text-sm"></div>
      <div class="skeleton skeleton-text-price"></div>
    </div>
  `;
}

function showSkeletons(container, count = 8) {
  container.innerHTML = Array(count).fill(createSkeletonCard()).join('');
}

// ============================================
// Home Page: Featured Products
// ============================================
async function loadFeaturedProducts(grid) {
  showSkeletons(grid, 4);
  try {
    const data = await ProductAPI.getProducts({ limit: 4, skip: 0 });
    grid.innerHTML = data.products.map(p => createProductCard(p)).join('');
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2rem;grid-column:1/-1;">Failed to load products.</p>';
  }
}

// ============================================
// Home Page: Trending Products
// ============================================
async function loadTrendingProducts(grid) {
  showSkeletons(grid, 4);
  try {
    const data = await ProductAPI.getProducts({ limit: 4, skip: 8, sortBy: 'rating', order: 'desc' });
    grid.innerHTML = data.products.map(p => createProductCard(p)).join('');
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2rem;grid-column:1/-1;">Failed to load products.</p>';
  }
}

// ============================================
// Home Page: Categories
// ============================================
async function loadCategories(grid) {
  const categoryIcons = {
    'beauty': '💄', 'fragrances': '🌸', 'furniture': '🪑', 'groceries': '🛒',
    'home-decoration': '🏠', 'kitchen-accessories': '🍳', 'laptops': '💻',
    'mens-shirts': '👔', 'mens-shoes': '👟', 'mens-watches': '⌚',
    'mobile-accessories': '📱', 'motorcycle': '🏍️', 'skin-care': '🧴',
    'smartphones': '📲', 'sports-accessories': '⚽', 'sunglasses': '🕶️',
    'tablets': '📋', 'tops': '👚', 'vehicle': '🚗', 'womens-bags': '👜',
    'womens-dresses': '👗', 'womens-jewellery': '💎', 'womens-shoes': '👠',
    'womens-watches': '⌚'
  };

  try {
    const categories = await ProductAPI.getCategories();
    // Show first 8 categories
    const shown = categories.slice(0, 8);
    grid.innerHTML = shown.map(cat => `
      <a href="shop.html?category=${encodeURIComponent(cat.slug)}" class="category-card">
        <div class="category-icon">${categoryIcons[cat.slug] || '📦'}</div>
        <h3 style="font-weight:600;color:var(--gray-800);margin-top:0.5rem;font-size:0.95rem;">${cat.name}</h3>
      </a>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2rem;grid-column:1/-1;">Failed to load categories.</p>';
  }
}

// ============================================
// Home Page: Testimonials
// ============================================
function renderTestimonials(grid) {
  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div style="display:flex;align-items:center;gap:0.25rem;margin-bottom:1rem;">
        ${Array(t.rating).fill('<svg width="18" height="18" fill="#fbbf24" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>').join('')}
      </div>
      <svg width="36" height="36" style="color:var(--primary-200);margin-bottom:0.75rem;" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z"/>
      </svg>
      <p style="color:var(--gray-600);line-height:1.7;margin-bottom:1.5rem;font-style:italic;flex:1;">"${t.text}"</p>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-top:auto;">
        <img src="${t.avatar}" alt="${t.name}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;">
        <div>
          <h4 style="font-weight:600;color:var(--gray-800);font-size:0.95rem;">${t.name}</h4>
          <p style="font-size:0.8rem;color:var(--primary-500);">Verified Buyer</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// Shop Page
// ============================================
let shopState = {
  category: '',
  search: '',
  sortBy: '',
  order: '',
  page: 1,
  limit: 12,
  total: 0
};

async function initShopPage() {
  const grid = document.getElementById('shopProductGrid');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceSort = document.getElementById('priceSort');
  const shopSearch = document.getElementById('shopSearch');
  const resultCount = document.getElementById('resultCount');
  const clearFilters = document.getElementById('clearFilters');
  const paginationWrap = document.getElementById('pagination');

  // Load categories into filter dropdown
  try {
    const categories = await ProductAPI.getCategories();
    if (categoryFilter) {
      categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(c => `<option value="${c.slug}">${c.name}</option>`).join('');
    }
  } catch (e) { }

  // Check URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  if (urlCategory && categoryFilter) {
    categoryFilter.value = urlCategory;
    shopState.category = urlCategory;
  }

  async function loadProducts() {
    showSkeletons(grid, shopState.limit);
    if (paginationWrap) paginationWrap.innerHTML = '';

    try {
      const skip = (shopState.page - 1) * shopState.limit;
      const data = await ProductAPI.getProducts({
        limit: shopState.limit,
        skip: skip,
        category: shopState.category,
        search: shopState.search,
        sortBy: shopState.sortBy,
        order: shopState.order
      });

      shopState.total = data.total;

      if (resultCount) {
        resultCount.textContent = `${data.total} product${data.total !== 1 ? 's' : ''} found`;
      }

      if (data.products.length === 0) {
        grid.innerHTML = `
          <div class="no-results" style="grid-column:1/-1;">
            <svg width="64" height="64" fill="none" stroke="var(--gray-300)" viewBox="0 0 24 24" style="margin:0 auto 1rem;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 style="font-size:1.25rem;font-weight:600;color:var(--gray-400);margin-bottom:0.5rem;">No products found</h3>
            <p style="color:var(--gray-400);">Try adjusting your filters or search terms.</p>
          </div>
        `;
      } else {
        grid.innerHTML = data.products.map(p => createProductCard(p)).join('');
      }

      // Render pagination
      renderPagination(paginationWrap, data.total, shopState.page, shopState.limit, (p) => {
        shopState.page = p;
        loadProducts();
        window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
      });

    } catch (err) {
      grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:2rem;grid-column:1/-1;">Failed to load products. Please try again.</p>';
    }
  }

  let searchTimeout;
  categoryFilter?.addEventListener('change', () => {
    shopState.category = categoryFilter.value;
    shopState.page = 1;
    // Clear search when category changes
    if (shopSearch) shopSearch.value = '';
    shopState.search = '';
    loadProducts();
  });

  priceSort?.addEventListener('change', () => {
    const val = priceSort.value;
    if (val === 'price-low') { shopState.sortBy = 'price'; shopState.order = 'asc'; }
    else if (val === 'price-high') { shopState.sortBy = 'price'; shopState.order = 'desc'; }
    else if (val === 'rating') { shopState.sortBy = 'rating'; shopState.order = 'desc'; }
    else if (val === 'name') { shopState.sortBy = 'title'; shopState.order = 'asc'; }
    else { shopState.sortBy = ''; shopState.order = ''; }
    shopState.page = 1;
    loadProducts();
  });

  shopSearch?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      shopState.search = shopSearch.value.trim();
      shopState.category = ''; // clear category when searching
      if (categoryFilter) categoryFilter.value = '';
      shopState.page = 1;
      loadProducts();
    }, 400);
  });

  clearFilters?.addEventListener('click', () => {
    shopState = { category: '', search: '', sortBy: '', order: '', page: 1, limit: 12, total: 0 };
    if (categoryFilter) categoryFilter.value = '';
    if (priceSort) priceSort.value = 'featured';
    if (shopSearch) shopSearch.value = '';
    loadProducts();
  });

  loadProducts();
}

// ============================================
// Pagination
// ============================================
function renderPagination(container, total, currentPage, limit, onPageChange) {
  if (!container || total <= limit) return;

  const totalPages = Math.ceil(total / limit);
  let html = '';

  // Prev
  html += `<button class="pagination-btn" ${currentPage <= 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
  </button>`;

  // Page numbers
  const range = getPageRange(currentPage, totalPages, 5);
  range.forEach(p => {
    if (p === '...') {
      html += `<span class="pagination-btn" style="cursor:default;">…</span>`;
    } else {
      html += `<button class="pagination-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  // Next
  html += `<button class="pagination-btn" ${currentPage >= totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
  </button>`;

  container.innerHTML = html;

  container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    });
  });
}

function getPageRange(current, total, maxVisible) {
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (current <= 3) { start = 2; end = Math.min(4, total - 1); }
  if (current >= total - 2) { start = Math.max(total - 3, 2); end = total - 1; }

  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');

  pages.push(total);
  return pages;
}

// ============================================
// Product Detail Page
// ============================================
async function initProductPage() {
  const section = document.getElementById('productDetail');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));

  if (!productId) {
    section.innerHTML = `
      <div style="text-align:center;padding:6rem 2rem;">
        <h2 style="font-size:1.5rem;font-weight:700;color:var(--gray-400);margin-bottom:1rem;">Product not found</h2>
        <a href="shop.html" class="btn-primary">Back to Shop</a>
      </div>
    `;
    return;
  }

  // Show loading skeleton
  section.innerHTML = `
    <div style="max-width:1280px;margin:0 auto;padding:2rem 1.5rem;">
      <div style="display:grid;grid-template-columns:1fr;gap:2rem;">
        <div class="skeleton" style="aspect-ratio:1/1;border-radius:var(--radius-2xl);max-height:500px;"></div>
        <div>
          <div class="skeleton" style="height:20px;width:30%;margin-bottom:1rem;"></div>
          <div class="skeleton" style="height:32px;width:80%;margin-bottom:1.5rem;"></div>
          <div class="skeleton" style="height:16px;width:100%;margin-bottom:0.75rem;"></div>
          <div class="skeleton" style="height:16px;width:90%;margin-bottom:0.75rem;"></div>
          <div class="skeleton" style="height:16px;width:70%;"></div>
        </div>
      </div>
    </div>
  `;

  try {
    const product = await ProductAPI.getProduct(productId);
    document.title = `${product.title} — ShopVerse`;

    const discount = Math.round(product.discountPercentage || 0);
    const originalPrice = product.price / (1 - (product.discountPercentage || 0) / 100);

    const stockClass = product.stock > 10 ? 'stock-in' : product.stock > 0 ? 'stock-low' : 'stock-out';
    const stockText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock';

    // Reviews breakdown
    const reviewCounts = [0, 0, 0, 0, 0]; // 1-5 stars
    if (product.reviews) {
      product.reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) reviewCounts[r.rating - 1]++;
      });
    }
    const totalReviews = product.reviews ? product.reviews.length : 0;

    section.innerHTML = `
      <div style="max-width:1280px;margin:0 auto;padding:2rem 1.5rem;">
        <!-- Breadcrumb -->
        <nav style="display:flex;align-items:center;gap:0.5rem;font-size:0.9rem;color:var(--gray-500);margin-bottom:2rem;flex-wrap:wrap;">
          <a href="index.html" style="color:var(--gray-500);transition:var(--transition-fast);" onmouseover="this.style.color='var(--primary-600)'" onmouseout="this.style.color='var(--gray-500)'">Home</a>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <a href="shop.html" style="color:var(--gray-500);transition:var(--transition-fast);" onmouseover="this.style.color='var(--primary-600)'" onmouseout="this.style.color='var(--gray-500)'">Products</a>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span style="color:var(--primary-600);font-weight:500;">${product.title}</span>
        </nav>

        <div style="display:grid;grid-template-columns:1fr;gap:3rem;" class="product-detail-grid">
          <!-- Images -->
          <div>
            <div class="product-detail-img-wrap">
              <img src="${product.images?.[0] || product.thumbnail}" alt="${product.title}" id="mainProductImg" style="width:100%;border-radius:var(--radius-2xl);aspect-ratio:1/1;object-fit:cover;">
              ${discount > 0 ? `<span style="position:absolute;top:1rem;left:1rem;background:linear-gradient(135deg,var(--danger-500),#f87171);color:white;font-size:0.8rem;font-weight:700;padding:0.375rem 0.75rem;border-radius:var(--radius-full);">-${discount}%</span>` : ''}
            </div>
            ${product.images && product.images.length > 1 ? `
              <div class="product-thumbnail-strip">
                ${product.images.map((img, i) => `
                  <div class="product-thumbnail ${i === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                    <img src="${img}" alt="View ${i + 1}" loading="lazy">
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Product Info -->
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.75rem;">
              <span style="font-size:0.8rem;font-weight:600;color:var(--primary-500);text-transform:uppercase;letter-spacing:0.5px;">${product.category}</span>
              ${product.brand ? `<span style="font-size:0.75rem;font-weight:600;color:var(--gray-500);background:var(--gray-100);padding:0.25rem 0.625rem;border-radius:var(--radius-full);">${product.brand}</span>` : ''}
            </div>

            <h1 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:700;color:var(--gray-900);margin-bottom:1rem;line-height:1.25;">${product.title}</h1>

            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:0.25rem;">
                ${generateStars(product.rating)}
              </div>
              <span style="font-size:0.9rem;color:var(--gray-500);">${product.rating.toFixed(1)} (${totalReviews} review${totalReviews !== 1 ? 's' : ''})</span>
              <span class="stock-badge ${stockClass}">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4"/></svg>
                ${stockText}
              </span>
            </div>

            <div class="price-tag" style="margin-bottom:1.5rem;">
              <span class="price-current">$${product.price.toFixed(2)}</span>
              ${discount > 0 ? `<span class="price-original">$${originalPrice.toFixed(2)}</span>` : ''}
              ${discount > 0 ? `<span class="price-save">Save ${discount}%</span>` : ''}
            </div>

            <p style="color:var(--gray-600);line-height:1.8;margin-bottom:2rem;font-size:0.98rem;">${product.description}</p>

            <!-- Product Details -->
            <div style="background:var(--gray-50);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1.5rem;border:1px solid var(--gray-100);">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;font-size:0.9rem;">
                ${product.brand ? `<div><span style="color:var(--gray-500);">Brand</span><div style="font-weight:600;color:var(--gray-800);margin-top:0.125rem;">${product.brand}</div></div>` : ''}
                <div><span style="color:var(--gray-500);">SKU</span><div style="font-weight:600;color:var(--gray-800);margin-top:0.125rem;">${product.sku || 'N/A'}</div></div>
                <div><span style="color:var(--gray-500);">Warranty</span><div style="font-weight:600;color:var(--gray-800);margin-top:0.125rem;">${product.warrantyInformation || 'N/A'}</div></div>
                <div><span style="color:var(--gray-500);">Shipping</span><div style="font-weight:600;color:var(--gray-800);margin-top:0.125rem;">${product.shippingInformation || 'Standard'}</div></div>
                <div><span style="color:var(--gray-500);">Return Policy</span><div style="font-weight:600;color:var(--gray-800);margin-top:0.125rem;">${product.returnPolicy || 'N/A'}</div></div>
                <div><span style="color:var(--gray-500);">Weight</span><div style="font-weight:600;color:var(--gray-800);margin-top:0.125rem;">${product.weight ? product.weight + ' oz' : 'N/A'}</div></div>
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
              <div class="quantity-selector">
                <button onclick="changeDetailQty(-1)" class="qty-btn" id="qtyMinus">−</button>
                <input type="number" id="detailQty" value="1" min="1" max="20" class="qty-input" readonly>
                <button onclick="changeDetailQty(1)" class="qty-btn" id="qtyPlus">+</button>
              </div>
              <button onclick='addDetailToCart(${JSON.stringify({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, category: product.category, brand: product.brand || "" })})' class="btn-primary" style="flex:1;padding:0.875rem 2rem;font-size:1.05rem;" ${product.stock <= 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
                Add to Cart
              </button>
            </div>

            <!-- Perks -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.625rem;font-size:0.875rem;color:var(--gray-600);">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <svg width="18" height="18" style="color:var(--success-500);flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Free shipping over $50
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <svg width="18" height="18" style="color:var(--success-500);flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Secure checkout
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <svg width="18" height="18" style="color:var(--success-500);flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Quality guaranteed
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <svg width="18" height="18" style="color:var(--success-500);flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                24/7 Support
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        ${totalReviews > 0 ? `
        <div style="margin-top:4rem;border-top:1px solid var(--gray-200);padding-top:3rem;">
          <h2 style="font-size:1.5rem;font-weight:700;color:var(--gray-900);margin-bottom:2rem;">Customer Reviews</h2>
          <div style="display:grid;grid-template-columns:1fr;gap:1rem;">
            ${product.reviews.map(r => `
              <div style="background:white;border:1px solid var(--gray-100);border-radius:var(--radius-lg);padding:1.25rem;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;">
                  <div style="display:flex;align-items:center;gap:0.75rem;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewerName)}&background=6366f1&color=fff&size=40&bold=true" alt="${r.reviewerName}" style="width:36px;height:36px;border-radius:50%;">
                    <div>
                      <div style="font-weight:600;color:var(--gray-800);font-size:0.95rem;">${r.reviewerName}</div>
                      <div style="font-size:0.8rem;color:var(--gray-400);">${new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:0.125rem;">${generateStars(r.rating)}</div>
                </div>
                <p style="color:var(--gray-600);line-height:1.6;font-size:0.95rem;">${r.comment}</p>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Related Products -->
        <div style="margin-top:4rem;">
          <h2 style="font-size:1.5rem;font-weight:700;color:var(--gray-900);text-align:center;margin-bottom:2rem;">You May Also Like</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem;" id="relatedProducts"></div>
        </div>
      </div>
    `;

    // Add responsive grid style for detail page
    const style = document.createElement('style');
    style.textContent = `@media(min-width:1024px){.product-detail-grid{grid-template-columns:1fr 1fr !important;}}`;
    document.head.appendChild(style);

    // Load related products
    try {
      const related = await ProductAPI.getProducts({ limit: 4, category: product.category });
      const relatedGrid = document.getElementById('relatedProducts');
      if (relatedGrid) {
        const filtered = related.products.filter(p => p.id !== product.id).slice(0, 4);
        relatedGrid.innerHTML = filtered.map(p => createProductCard(p)).join('');
      }
    } catch (e) { }

  } catch (err) {
    section.innerHTML = `
      <div style="text-align:center;padding:6rem 2rem;">
        <h2 style="font-size:1.5rem;font-weight:700;color:var(--gray-400);margin-bottom:1rem;">Product not found</h2>
        <p style="color:var(--gray-400);margin-bottom:1.5rem;">This product may have been removed or doesn't exist.</p>
        <a href="shop.html" class="btn-primary">Back to Shop</a>
      </div>
    `;
  }
}

function changeMainImage(src, thumbEl) {
  const mainImg = document.getElementById('mainProductImg');
  if (mainImg) mainImg.src = src;

  document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function changeDetailQty(delta) {
  const input = document.getElementById('detailQty');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 20) val = 20;
  input.value = val;
}

function addDetailToCart(product) {
  const qty = parseInt(document.getElementById('detailQty').value);
  Cart.addItem(product, qty);
}

// ============================================
// Cart Page
// ============================================
function initCartPage() {
  renderCartPage();
}

function renderCartPage() {
  const cartItems = Cart.getCart();
  const cartContainer = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const emptyCart = document.getElementById('emptyCart');

  if (cartItems.length === 0) {
    if (cartContainer) cartContainer.innerHTML = '';
    if (cartSummary) cartSummary.classList.add('hidden');
    if (emptyCart) emptyCart.classList.remove('hidden');
    return;
  }

  if (emptyCart) emptyCart.classList.add('hidden');
  if (cartSummary) cartSummary.classList.remove('hidden');

  cartContainer.innerHTML = cartItems.map(item => `
    <div class="cart-item" id="cartItem-${item.id}">
      <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-info">
        <h3 style="font-weight:600;color:var(--gray-800);font-size:1.05rem;">${item.title}</h3>
        <p style="font-size:0.85rem;color:var(--gray-500);text-transform:capitalize;">${item.category}</p>
        <p style="color:var(--primary-600);font-weight:700;font-size:1.05rem;margin-top:0.25rem;">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-selector">
          <button onclick="updateCartItemQty(${item.id}, ${item.quantity - 1})" class="qty-btn">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button onclick="updateCartItemQty(${item.id}, ${item.quantity + 1})" class="qty-btn">+</button>
        </div>
        <p style="font-weight:700;color:var(--gray-800);font-size:1.1rem;min-width:70px;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeCartItem(${item.id})" class="btn-danger" aria-label="Remove ${item.title}">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  const subtotal = Cart.getSubtotal();
  const shipping = Cart.getShipping();
  const total = Cart.getTotal();

  document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function updateCartItemQty(productId, newQty) {
  if (newQty <= 0) {
    removeCartItem(productId);
    return;
  }
  Cart.updateQuantity(productId, newQty);
  renderCartPage();
}

function removeCartItem(productId) {
  Cart.removeItem(productId);
  renderCartPage();
}

function clearEntireCart() {
  Cart.clearCart();
  renderCartPage();
}
