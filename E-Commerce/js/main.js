/**
 * Urban Jungle Co. - Main JavaScript
 * Handles navigation, search, animations, and page-specific logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Mobile Navigation Toggle
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

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ============================================
    // Search Modal
    // ============================================
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput?.focus(), 200);
        });

        searchClose?.addEventListener('click', () => {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Search functionality
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!searchResults) return;

            if (query.length < 2) {
                searchResults.innerHTML = '<p class="text-gray-400 text-center py-8">Type at least 2 characters to search...</p>';
                return;
            }

            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                searchResults.innerHTML = '<p class="text-gray-400 text-center py-8">No plants found matching your search.</p>';
                return;
            }

            searchResults.innerHTML = filtered.map(p => `
        <a href="product.html?id=${p.id}" class="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-colors group">
          <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded-lg">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">${p.name}</h4>
            <p class="text-sm text-gray-500">${p.category}</p>
          </div>
          <span class="font-bold text-emerald-700">$${p.price.toFixed(2)}</span>
        </a>
      `).join('');
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // Initial check
        if (window.scrollY > 50) navbar.classList.add('scrolled');
    }

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // Render Trending Products (Home Page)
    // ============================================
    const trendingGrid = document.getElementById('trendingProducts');
    if (trendingGrid) {
        const trending = products.filter(p => p.tags.includes('trending')).slice(0, 3);
        trendingGrid.innerHTML = trending.map(p => createProductCard(p)).join('');
    }

    // ============================================
    // Render Popular Products (Home Page)
    // ============================================
    const popularGrid = document.getElementById('popularProducts');
    if (popularGrid) {
        const popular = products.filter(p => p.tags.includes('popular')).slice(0, 6);
        popularGrid.innerHTML = popular.map(p => createProductCard(p)).join('');
    }

    // ============================================
    // Render Categories (Home Page)
    // ============================================
    const categoryGrid = document.getElementById('categoryGrid');
    if (categoryGrid) {
        categoryGrid.innerHTML = categories.map(cat => `
      <a href="shop.html?category=${encodeURIComponent(cat.name)}" class="category-card group">
        <div class="category-img-wrap">
          <img src="${cat.image}" alt="${cat.name}" class="category-img">
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mt-4 group-hover:text-emerald-700 transition-colors">${cat.name}</h3>
        <p class="text-sm text-gray-500">${cat.count} plants</p>
      </a>
    `).join('');
    }

    // ============================================
    // Render Testimonials (Home Page)
    // ============================================
    const testimonialGrid = document.getElementById('testimonialGrid');
    if (testimonialGrid) {
        testimonialGrid.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="flex items-center gap-1 mb-4">
          ${Array(t.rating).fill('<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>').join('')}
        </div>
        <svg class="w-10 h-10 text-emerald-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z"/>
        </svg>
        <p class="text-gray-600 leading-relaxed mb-6 italic">"${t.text}"</p>
        <div class="flex items-center gap-3 mt-auto">
          <img src="${t.avatar}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover">
          <div>
            <h4 class="font-semibold text-gray-800">${t.name}</h4>
            <p class="text-sm text-emerald-600">Verified Buyer</p>
          </div>
        </div>
      </div>
    `).join('');
    }

    // ============================================
    // Shop Page Logic
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

    // ============================================
    // Checkout Page
    // ============================================
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        initCheckoutPage();
    }

    // ============================================
    // Contact Form
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Cart.showNotification('Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
});

// ============================================
// Product Card Template
// ============================================
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    return `
    <div class="product-card group">
      <a href="product.html?id=${product.id}" class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
        <div class="product-overlay">
          <span class="text-white font-medium">View Details</span>
        </div>
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <div class="flex items-center gap-1 my-2">
          ${generateStars(product.rating)}
          <span class="text-xs text-gray-400 ml-1">(${product.reviews})</span>
        </div>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-2">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>
          </div>
          <button onclick="Cart.addItem(${product.id})" class="add-to-cart-btn" aria-label="Add ${product.name} to cart">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Star Rating Generator
// ============================================
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    }

    if (hasHalf) {
        starsHtml += '<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    }

    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    }

    return starsHtml;
}

// ============================================
// Shop Page Initialization
// ============================================
function initShopPage() {
    const grid = document.getElementById('shopProductGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const shopSearch = document.getElementById('shopSearch');
    const sortFilter = document.getElementById('sortFilter');
    const resultCount = document.getElementById('resultCount');
    const clearFilters = document.getElementById('clearFilters');

    // Check URL params for pre-selected category
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    if (urlCategory && categoryFilter) {
        categoryFilter.value = urlCategory;
    }

    function filterAndRender() {
        let filtered = [...products];

        // Category filter
        const selectedCategory = categoryFilter?.value;
        if (selectedCategory && selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Price filter
        const selectedPrice = priceFilter?.value;
        if (selectedPrice && selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(Number);
            if (max) {
                filtered = filtered.filter(p => p.price >= min && p.price <= max);
            } else {
                filtered = filtered.filter(p => p.price >= min);
            }
        }

        // Search filter
        const searchQuery = shopSearch?.value.toLowerCase().trim();
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery) ||
                p.category.toLowerCase().includes(searchQuery)
            );
        }

        // Sort
        const sortValue = sortFilter?.value;
        switch (sortValue) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // featured - default order
                break;
        }

        // Update result count
        if (resultCount) {
            resultCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
        }

        // Render products
        if (filtered.length === 0) {
            grid.innerHTML = `
        <div class="col-span-full text-center py-16">
          <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-400 mb-2">No plants found</h3>
          <p class="text-gray-400">Try adjusting your filters or search terms.</p>
        </div>
      `;
        } else {
            grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
        }
    }

    // Event listeners for filters
    categoryFilter?.addEventListener('change', filterAndRender);
    priceFilter?.addEventListener('change', filterAndRender);
    sortFilter?.addEventListener('change', filterAndRender);
    shopSearch?.addEventListener('input', filterAndRender);

    clearFilters?.addEventListener('click', () => {
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'featured';
        if (shopSearch) shopSearch.value = '';
        filterAndRender();
    });

    // Initial render
    filterAndRender();
}

// ============================================
// Product Detail Page Initialization
// ============================================
function initProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('productDetail').innerHTML = `
      <div class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-400 mb-4">Product not found</h2>
        <a href="shop.html" class="btn-primary inline-block">Back to Shop</a>
      </div>
    `;
        return;
    }

    // Update page title
    document.title = `${product.name} - Urban Jungle Co.`;

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    document.getElementById('productDetail').innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="index.html" class="hover:text-emerald-700 transition-colors">Home</a>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="shop.html" class="hover:text-emerald-700 transition-colors">Shop</a>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-emerald-700 font-medium">${product.name}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <!-- Product Image -->
        <div class="product-detail-img-wrap">
          <img src="${product.image}" alt="${product.name}" class="w-full rounded-2xl shadow-lg" id="mainProductImg">
          ${discount > 0 ? `<span class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-${discount}%</span>` : ''}
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <span class="text-emerald-600 font-medium text-sm uppercase tracking-wider mb-2">${product.category}</span>
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">${product.name}</h1>
          
          <div class="flex items-center gap-2 mb-4">
            ${generateStars(product.rating)}
            <span class="text-gray-500 text-sm">(${product.reviews} reviews)</span>
          </div>

          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl font-bold text-emerald-700">$${product.price.toFixed(2)}</span>
            <span class="text-xl text-gray-400 line-through">$${product.originalPrice.toFixed(2)}</span>
            ${discount > 0 ? `<span class="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">Save ${discount}%</span>` : ''}
          </div>

          <p class="text-gray-600 leading-relaxed mb-8">${product.description}</p>

          <!-- Care Info -->
          <div class="bg-emerald-50 rounded-xl p-6 mb-8">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Care Guide
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <div><strong class="text-gray-700">Light:</strong><br>${product.care.light}</div>
              </div>
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                <div><strong class="text-gray-700">Water:</strong><br>${product.care.water}</div>
              </div>
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                <div><strong class="text-gray-700">Humidity:</strong><br>${product.care.humidity}</div>
              </div>
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <div><strong class="text-gray-700">Temp:</strong><br>${product.care.temperature}</div>
              </div>
            </div>
          </div>

          <!-- Quantity & Add to Cart -->
          <div class="flex items-center gap-4 mb-6">
            <div class="quantity-selector">
              <button onclick="changeDetailQty(-1)" class="qty-btn" id="qtyMinus">−</button>
              <input type="number" id="detailQty" value="1" min="1" max="20" class="qty-input" readonly>
              <button onclick="changeDetailQty(1)" class="qty-btn" id="qtyPlus">+</button>
            </div>
            <button onclick="addDetailToCart(${product.id})" class="btn-primary flex-1 py-3.5 text-lg">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
              Add to Cart
            </button>
          </div>

          <!-- Perks -->
          <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Free shipping over $50
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              30-day health guarantee
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Expert plant care guide
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Eco-friendly packaging
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="mt-16 lg:mt-24">
        <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-10">You May Also Like</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="relatedProducts"></div>
      </div>
    </div>
  `;

    // Render related products
    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const relatedGrid = document.getElementById('relatedProducts');
    if (relatedGrid && related.length > 0) {
        relatedGrid.innerHTML = related.map(p => createProductCard(p)).join('');
    }
}

// ============================================
// Product Detail - Quantity Control
// ============================================
function changeDetailQty(delta) {
    const input = document.getElementById('detailQty');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > 20) val = 20;
    input.value = val;
}

function addDetailToCart(productId) {
    const qty = parseInt(document.getElementById('detailQty').value);
    Cart.addItem(productId, qty);
}

// ============================================
// Cart Page Initialization
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
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h3 class="font-semibold text-gray-800 text-lg">${item.name}</h3>
        <p class="text-sm text-gray-500">${item.category}</p>
        <p class="text-emerald-700 font-bold text-lg mt-1">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-selector">
          <button onclick="updateCartItemQty(${item.id}, ${item.quantity - 1})" class="qty-btn">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button onclick="updateCartItemQty(${item.id}, ${item.quantity + 1})" class="qty-btn">+</button>
        </div>
        <p class="font-bold text-gray-800 text-lg">$${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeCartItem(${item.id})" class="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50" aria-label="Remove ${item.name}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

    // Update summary
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

// ============================================
// Checkout Page Initialization
// ============================================
function initCheckoutPage() {
    renderCheckoutSummary();

    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        for (const [key, value] of Object.entries(data)) {
            if (!value.trim()) {
                Cart.showNotification('Please fill in all required fields.');
                return;
            }
        }

        // Success
        Cart.clearCart();
        document.getElementById('checkoutContent').innerHTML = `
      <div class="text-center py-16 max-w-md mx-auto">
        <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h2>
        <p class="text-gray-600 mb-2">Thank you for your order, <strong>${data.fullName}</strong>!</p>
        <p class="text-gray-500 mb-8">Your plants are being prepared with love. You'll receive a confirmation email at <strong>${data.email}</strong> shortly.</p>
        <a href="shop.html" class="btn-primary inline-block px-8 py-3">Continue Shopping</a>
      </div>
    `;
    });
}

function renderCheckoutSummary() {
    const cartItems = Cart.getCart();
    const summaryContainer = document.getElementById('checkoutItems');

    if (!summaryContainer) return;

    if (cartItems.length === 0) {
        document.getElementById('checkoutContent').innerHTML = `
      <div class="text-center py-16">
        <h2 class="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
        <a href="shop.html" class="btn-primary inline-block">Start Shopping</a>
      </div>
    `;
        return;
    }

    summaryContainer.innerHTML = cartItems.map(item => `
    <div class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg">
      <div class="flex-1">
        <h4 class="font-medium text-gray-800 text-sm">${item.name}</h4>
        <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
      </div>
      <span class="font-semibold text-gray-800">$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

    const subtotal = Cart.getSubtotal();
    const shipping = Cart.getShipping();
    const total = Cart.getTotal();

    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}
