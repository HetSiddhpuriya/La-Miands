/* ===================================================
   SocialHub – Feed Page Logic
   Loads posts, users, photos and renders the home feed
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // Inject navbar & footer
  document.getElementById('navbarContainer').innerHTML = renderNavbar('home');
  document.getElementById('footerContainer').innerHTML = renderFooter();
  initNavbar();

  const container = document.getElementById('feedContainer');
  container.innerHTML = skeletonCards(6);

  // Fetch data in parallel
  const [posts, users, photos] = await Promise.all([
    getPosts(),
    getUsers(),
    getPhotos()
  ]);

  if (!posts || !users || !photos) {
    container.innerHTML = '<p class="text-center text-red-500 py-10">Failed to load feed. Please try again.</p>';
    return;
  }

  // Build user map for quick lookup
  const userMap = {};
  users.forEach(u => userMap[u.id] = u);

  // Current User (Mocked as Leanne Graham)
  const currentUser = users.find(u => u.id === 1) || users[0];

  // Render Sidebars
  renderLeftSidebar(currentUser);
  renderRightSidebar(users, photos);

  // Render main feed posts
  container.innerHTML = '';
  posts.forEach((post, idx) => {
    const user = userMap[post.userId];
    const imgSeed = post.id + 100; // deterministic seed for picsum
    const card = document.createElement('div');
    card.className = 'post-card card fade-in mb-6'; // Added mb-6 for spacing
    card.style.animationDelay = `${Math.min(idx * 0.04, 0.5)}s`;

    card.innerHTML = `
      <!-- User Header -->
      <div class="flex items-center gap-3 p-4">
        <div class="avatar" style="background: ${stringToColor(user.name)}">
          ${getInitials(user.name)}
        </div>
        <div>
          <a href="profile.html?id=${user.id}" class="font-semibold text-gray-800 hover:text-cosmos-blue transition-colors">
            ${user.name}
          </a>
          <p class="text-xs text-gray-400">@${user.username.toLowerCase()}</p>
        </div>
      </div>

      <!-- Image -->
      <div class="image-wrapper">
        <img src="${getRandomPhotoUrl(imgSeed)}" alt="${post.title}" class="post-image" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/${imgSeed + 500}/600/400'" />
      </div>

      <!-- Content -->
      <div class="p-4 space-y-3">
        <h3 class="font-semibold text-gray-800 leading-snug capitalize">${post.title}</h3>
        <p class="text-gray-500 text-sm leading-relaxed">${post.body}</p>

        <!-- Actions -->
        <div class="flex items-center gap-5 pt-2 text-sm">
          <button class="like-btn flex items-center gap-1" onclick="toggleLike(this)">
            <i class="fa-regular fa-heart text-lg"></i>
            <span class="like-count">${Math.floor(Math.random() * 200) + 10}</span>
          </button>
          <button class="text-gray-400 hover:text-accent-red transition-colors flex items-center gap-1"
                  onclick="toggleComments(${post.id}, this)">
            <i class="fa-regular fa-comment text-lg"></i> Comments
          </button>
          <button class="text-gray-400 hover:text-accent-red transition-colors flex items-center gap-1">
            <i class="fa-regular fa-share-from-square text-lg"></i> Share
          </button>
        </div>

        <!-- Comments Section (expandable) -->
        <div id="comments-${post.id}" class="comments-section">
          <div class="border-t border-marble-blue/20 mt-3 pt-3 space-y-3" id="commentsContent-${post.id}">
            <!-- Comments injected here -->
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
});

/**
 * Render Left Sidebar: Profile, Navigation, Quick Links
 */
function renderLeftSidebar(user) {
  const sidebar = document.getElementById('leftSidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <!-- User Profile Card -->
    <div class="card p-5 text-center">
      <div class="avatar mx-auto mb-3" style="width:64px; height:64px; font-size:1.5rem; background:${stringToColor(user.name)}">
        ${getInitials(user.name)}
      </div>
      <h3 class="font-bold text-gray-800 text-lg">${user.name}</h3>
      <p class="text-sm text-gray-400 mb-4">@${user.username.toLowerCase()}</p>
      <p class="text-xs text-gray-500 italic">"Design is a way of life, a point of view."</p>
      <div class="mt-4 pt-4 border-t border-gray-50 flex justify-around text-xs">
        <div>
          <p class="font-bold text-primary-red">124</p>
          <p class="text-gray-400 font-medium">Posts</p>
        </div>
        <div>
          <p class="font-bold text-primary-red">2.5k</p>
          <p class="text-gray-400 font-medium">Followers</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="card overflow-hidden">
      <div class="flex flex-col">
        <a href="index.html" class="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-cosmos-blue hover:bg-gray-50 transition-colors border-l-4 border-accent-red bg-gray-50/50">
          <i class="fa-solid fa-house w-5 text-accent-red"></i> Home
        </a>
        <a href="users.html" class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:text-cosmos-blue hover:bg-gray-50 transition-colors border-l-4 border-transparent">
          <i class="fa-solid fa-users w-5"></i> Users
        </a>
        <a href="albums.html" class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:text-cosmos-blue hover:bg-gray-50 transition-colors border-l-4 border-transparent">
          <i class="fa-solid fa-images w-5"></i> Albums
        </a>
        <a href="gallery.html" class="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-600 hover:text-cosmos-blue hover:bg-gray-50 transition-colors border-l-4 border-transparent">
          <i class="fa-solid fa-photo-film w-5"></i> Gallery
        </a>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="card p-5">
      <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Links</h4>
      <div class="space-y-3">
        <a href="#" class="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-accent-red transition-colors">
          <i class="fa-solid fa-fire text-orange-500"></i> Trending
        </a>
        <a href="#" class="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-accent-red transition-colors">
          <i class="fa-solid fa-bookmark text-blue-500"></i> Saved Posts
        </a>
        <a href="#" class="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-accent-red transition-colors">
          <i class="fa-solid fa-gear text-gray-400"></i> Settings
        </a>
      </div>
    </div>
  `;
}

/**
 * Render Right Sidebar: Trending Users, Trending Photos
 */
function renderRightSidebar(users, photos) {
  const sidebar = document.getElementById('rightSidebar');
  if (!sidebar) return;

  // Trending Users (Top 5)
  const trendingUsers = users.slice(0, 5);
  const usersHTML = trendingUsers.map(user => `
    <div class="flex items-center justify-between group">
      <div class="flex items-center gap-3">
        <div class="avatar" style="width:32px; height:32px; font-size:0.75rem; background:${stringToColor(user.name)}">
          ${getInitials(user.name)}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-bold text-gray-800 truncate leading-tight group-hover:text-cosmos-blue transition-colors">
            <a href="profile.html?id=${user.id}">${user.name}</a>
          </p>
          <p class="text-[10px] text-gray-400 truncate">@${user.username.toLowerCase()}</p>
        </div>
      </div>
      <button class="text-xs font-bold text-accent-red hover:text-dark-red transition-colors">Follow</button>
    </div>
  `).join('');

  // Trending Photos (6 small imgs)
  const trendingPhotos = photos.sort(() => 0.5 - Math.random()).slice(0, 6);
  const photosHTML = trendingPhotos.map(photo => `
    <div class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onclick="openLightbox('${photo.url}', '${photo.title.replace(/'/g, "\\'")}')">
      <img src="${photo.thumbnailUrl}" alt="${photo.title}" class="w-full h-full object-cover shadow-sm" />
    </div>
  `).join('');

  sidebar.innerHTML = `
    <!-- Trending Users -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-bold text-gray-800">Trending Users</h4>
        <a href="users.html" class="text-xs font-medium text-accent-red hover:underline">View All</a>
      </div>
      <div class="space-y-4">
        ${usersHTML}
      </div>
    </div>

    <!-- Trending Photos -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-bold text-gray-800">Trending Photos</h4>
        <a href="gallery.html" class="text-xs font-medium text-accent-red hover:underline">Explore</a>
      </div>
      <div class="grid grid-cols-3 gap-2">
        ${photosHTML}
      </div>
    </div>

    <!-- Mini Footer -->
    <div class="px-2 text-[10px] text-gray-400 space-x-2">
      <a href="#" class="hover:underline">About</a>
      <span>•</span>
      <a href="#" class="hover:underline">Privacy</a>
      <span>•</span>
      <a href="#" class="hover:underline">Terms</a>
      <span>•</span>
      <p class="mt-2 text-[9px]">&copy; 2026 SOCIALHUB BY ANTI-GRAVITY</p>
    </div>
  `;
}

/* ---------- Like Toggle ---------- */
function toggleLike(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('i');
  const countEl = btn.querySelector('.like-count');
  let count = parseInt(countEl.textContent);

  if (btn.classList.contains('liked')) {
    icon.classList.replace('fa-regular', 'fa-solid');
    countEl.textContent = count + 1;
  } else {
    icon.classList.replace('fa-solid', 'fa-regular');
    countEl.textContent = count - 1;
  }
}

/* ---------- Comments Toggle ---------- */
async function toggleComments(postId, btn) {
  const section = document.getElementById(`comments-${postId}`);
  const content = document.getElementById(`commentsContent-${postId}`);

  if (section.classList.contains('open')) {
    section.classList.remove('open');
    return;
  }

  // Show loading
  content.innerHTML = '<div class="flex justify-center py-4"><div class="spinner"></div></div>';
  section.classList.add('open');

  const comments = await getPostComments(postId);
  if (!comments || comments.length === 0) {
    content.innerHTML = '<p class="text-gray-400 text-sm">No comments found.</p>';
    return;
  }

  content.innerHTML = comments.map(c => `
    <div class="bg-marble-blue/5 border border-marble-blue/15 rounded-lg p-3 space-y-1 fade-in">
      <div class="flex items-center gap-2">
        <div class="avatar" style="width:28px;height:28px;font-size:0.65rem;background:${stringToColor(c.email)}">
          ${getInitials(c.name)}
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-800 capitalize">${c.name}</p>
          <p class="text-xs text-gray-400">${c.email}</p>
        </div>
      </div>
      <p class="text-sm text-gray-500 pl-9">${c.body}</p>
    </div>
  `).join('');
}

/* ---------- Lightbox ---------- */
function openLightbox(src, title) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxTitle').textContent = title || '';
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
