/* ===================================================
   SocialHub – Centralised API Module
   All JSONPlaceholder fetch functions + simple cache
   =================================================== */

const API_BASE = 'https://jsonplaceholder.typicode.com';

// Simple in-memory cache to avoid duplicate requests
const _cache = {};

/**
 * Generic fetcher with caching
 * @param {string} endpoint – API path, e.g. '/users'
 * @returns {Promise<any>}
 */
async function apiFetch(endpoint) {
  if (_cache[endpoint]) return _cache[endpoint];
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    _cache[endpoint] = data;
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    return null;
  }
}

/* ---------- Users ---------- */
async function getUsers() {
  return apiFetch('/users');
}

async function getUser(id) {
  return apiFetch(`/users/${id}`);
}

/* ---------- Posts ---------- */
async function getPosts() {
  return apiFetch('/posts');
}

async function getUserPosts(userId) {
  return apiFetch(`/posts?userId=${userId}`);
}

/* ---------- Comments ---------- */
async function getPostComments(postId) {
  return apiFetch(`/comments?postId=${postId}`);
}

/* ---------- Albums ---------- */
async function getAlbums() {
  return apiFetch('/albums');
}

async function getUserAlbums(userId) {
  return apiFetch(`/albums?userId=${userId}`);
}

/* ---------- Photos ---------- */
async function getPhotos() {
  return apiFetch('/photos');
}

async function getAlbumPhotos(albumId) {
  return apiFetch(`/photos?albumId=${albumId}`);
}

/* ---------- Helpers ---------- */

/**
 * Get a random photo URL from the Photos API
 * Returns a picsum.photos URL for variety (JSONPlaceholder thumbnails are identical)
 */
function getRandomPhotoUrl(seed) {
  return `https://picsum.photos/seed/${seed}/600/400`;
}

/**
 * Generate initials for an avatar
 */
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Generate a colour from a string (deterministic)
 */
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

/**
 * Render the shared navbar HTML
 * @param {string} activePage – current page identifier
 */
function renderNavbar(activePage = '') {
  const links = [
    { href: 'index.html', id: 'home', label: 'Home', icon: 'fa-house' },
    { href: 'users.html', id: 'users', label: 'Users', icon: 'fa-users' },
    { href: 'albums.html', id: 'albums', label: 'Albums', icon: 'fa-images' },
    { href: 'gallery.html', id: 'gallery', label: 'Gallery', icon: 'fa-photo-film' },
  ];

  const navLinksHTML = links.map(l => `
    <a href="${l.href}" class="nav-link px-3 py-2 text-sm font-medium text-white/80 hover:text-white ${activePage === l.id ? 'active' : ''}">
      <i class="fa-solid ${l.icon} mr-1"></i> ${l.label}
    </a>
  `).join('');

  const mobileLinksHTML = links.map(l => `
    <a href="${l.href}" class="block px-4 py-2 text-white/80 hover:text-white hover:bg-dark-red rounded-lg ${activePage === l.id ? 'text-white bg-dark-red' : ''}">
      <i class="fa-solid ${l.icon} mr-2"></i> ${l.label}
    </a>
  `).join('');

  return `
  <nav class="navbar px-4 md:px-8 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Logo -->
      <a href="index.html" class="flex items-center gap-2 text-xl font-bold text-white shrink-0">
        <i class="fa-solid fa-globe text-white text-2xl"></i>
        <span class="text-white">SocialHub</span>
      </a>

      <!-- Desktop Links -->
      <div class="hidden md:flex items-center gap-1">
        ${navLinksHTML}
      </div>

      <!-- Search -->
      <div class="hidden md:block relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm"></i>
        <input id="globalSearch" type="text" placeholder="Search users..." class="search-input text-sm" />
      </div>

      <!-- Mobile Toggle -->
      <button id="mobileMenuBtn" class="md:hidden text-white text-xl" aria-label="Toggle menu">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="mobile-menu md:hidden flex-col gap-1 px-4 pb-4 pt-2">
      ${mobileLinksHTML}
      <div class="relative mt-2">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm"></i>
        <input id="globalSearchMobile" type="text" placeholder="Search users..." class="search-input text-sm w-full" />
      </div>
    </div>
  </nav>`;
}

/**
 * Initialise navbar interactivity (mobile toggle, search redirect)
 */
function initNavbar() {
  // Mobile menu toggle
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('open');
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    });
  }

  // Search handlers (redirect to users page with query param)
  const bindSearch = (inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `users.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  };
  bindSearch('globalSearch');
  bindSearch('globalSearchMobile');
}

/**
 * Create skeleton cards for loading state
 * @param {number} count
 * @returns {string} HTML
 */
function skeletonCards(count = 6) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
    <div class="card p-4 space-y-3 fade-in" style="animation-delay:${i * 0.05}s">
      <div class="skeleton h-4 w-1/3 rounded"></div>
      <div class="skeleton h-40 w-full rounded"></div>
      <div class="skeleton h-3 w-full rounded"></div>
      <div class="skeleton h-3 w-2/3 rounded"></div>
    </div>`;
  }
  return html;
}

/**
 * Render a footer
 */
function renderFooter() {
  return `
  <footer class="border-t border-gray-200 mt-16 py-8 text-center text-gray-400 text-sm">
    <p>&copy; 2026 <span class="text-accent-red font-semibold">SocialHub</span>. Powered by JSONPlaceholder API.</p>
  </footer>`;
}
