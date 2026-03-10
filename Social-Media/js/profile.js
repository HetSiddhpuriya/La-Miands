/* ===================================================
   SocialHub – Profile Page Logic
   Shows user details, their posts, and their albums
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('navbarContainer').innerHTML = renderNavbar('');
  document.getElementById('footerContainer').innerHTML = renderFooter();
  initNavbar();

  // Get user ID from URL query string
  const params = new URLSearchParams(window.location.search);
  const userId = parseInt(params.get('id'));

  if (!userId) {
    document.getElementById('profileHeader').innerHTML =
      '<p class="text-center text-accent-red py-12">No user specified. <a href="users.html" class="text-cosmos-blue underline">Browse users</a></p>';
    return;
  }

  // Fetch user, posts, albums in parallel
  const [user, posts, albums] = await Promise.all([
    getUser(userId),
    getUserPosts(userId),
    getUserAlbums(userId),
  ]);

  if (!user) {
    document.getElementById('profileHeader').innerHTML =
      '<p class="text-center text-red-400 py-12">User not found.</p>';
    return;
  }

  // Update page title
  document.title = `SocialHub – ${user.name}`;

  // Render profile header
  document.getElementById('profileHeader').innerHTML = `
    <div class="profile-header p-6 md:p-10 fade-in">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <!-- Large Avatar -->
        <div class="avatar text-3xl shrink-0" style="width:96px;height:96px;background:${stringToColor(user.name)}">
          ${getInitials(user.name)}
        </div>

        <!-- Info -->
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-3xl font-bold text-gray-800 mb-1">${user.name}</h1>
          <p class="text-cosmos-blue mb-4">@${user.username.toLowerCase()}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
            <p><i class="fa-solid fa-envelope mr-2 text-gray-400 w-4"></i>${user.email.toLowerCase()}</p>
            <p><i class="fa-solid fa-phone mr-2 text-gray-400 w-4"></i>${user.phone}</p>
            <p><i class="fa-solid fa-globe mr-2 text-gray-400 w-4"></i>
              <a href="https://${user.website}" target="_blank" class="text-cosmos-blue hover:text-marble-blue hover:underline">${user.website}</a>
            </p>
            <p><i class="fa-solid fa-building mr-2 text-gray-400 w-4"></i>${user.company.name}</p>
            <p class="sm:col-span-2"><i class="fa-solid fa-location-dot mr-2 text-gray-400 w-4"></i>
              ${user.address.street}, ${user.address.suite}, ${user.address.city} – ${user.address.zipcode}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex gap-6 mt-6 justify-center md:justify-start">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-800">${posts ? posts.length : 0}</p>
              <p class="text-xs text-gray-400">Posts</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-800">${albums ? albums.length : 0}</p>
              <p class="text-xs text-gray-400">Albums</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-800">${Math.floor(Math.random() * 5000) + 500}</p>
              <p class="text-xs text-gray-400">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Show tabs
  document.getElementById('tabsContainer').classList.remove('hidden');

  // Render posts
  renderPosts(posts, user);
  // Render albums
  renderAlbums(albums, user);
});

/* ---------- Tab Switching ---------- */
function switchTab(tab) {
  const postsSection = document.getElementById('postsSection');
  const albumsSection = document.getElementById('albumsSection');
  const tabPosts = document.getElementById('tabPosts');
  const tabAlbums = document.getElementById('tabAlbums');

  if (tab === 'posts') {
    postsSection.classList.remove('hidden');
    albumsSection.classList.add('hidden');
    tabPosts.classList.add('text-accent-red', 'border-accent-red');
    tabPosts.classList.remove('text-gray-400', 'border-transparent');
    tabAlbums.classList.remove('text-accent-red', 'border-accent-red');
    tabAlbums.classList.add('text-gray-400', 'border-transparent');
  } else {
    postsSection.classList.add('hidden');
    albumsSection.classList.remove('hidden');
    tabAlbums.classList.add('text-accent-red', 'border-accent-red');
    tabAlbums.classList.remove('text-gray-400', 'border-transparent');
    tabPosts.classList.remove('text-accent-red', 'border-accent-red');
    tabPosts.classList.add('text-gray-400', 'border-transparent');
  }
}

/* ---------- Render User Posts ---------- */
function renderPosts(posts, user) {
  const container = document.getElementById('postsSection');
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">No posts yet.</p>';
    return;
  }

  container.innerHTML = `<div class="space-y-4">${posts.map((post, i) => `
    <div class="card p-5 fade-in" style="animation-delay:${i * 0.04}s">
      <h3 class="font-semibold text-gray-800 capitalize mb-2">${post.title}</h3>
      <p class="text-gray-500 text-sm leading-relaxed">${post.body}</p>
      <div class="flex items-center gap-4 mt-3 text-sm text-gray-400">
        <span><i class="fa-regular fa-heart mr-1"></i>${Math.floor(Math.random() * 100) + 5}</span>
        <span><i class="fa-regular fa-comment mr-1"></i>${Math.floor(Math.random() * 30)}</span>
      </div>
    </div>
  `).join('')}</div>`;
}

/* ---------- Render User Albums ---------- */
function renderAlbums(albums, user) {
  const container = document.getElementById('albumsSection');
  if (!albums || albums.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">No albums yet.</p>';
    return;
  }

  container.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${albums.map((album, i) => `
    <div class="album-card p-5 fade-in" style="animation-delay:${i * 0.05}s">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-lg bg-cosmos-blue/10 flex items-center justify-center text-cosmos-blue">
          <i class="fa-solid fa-images"></i>
        </div>
        <h4 class="text-sm font-semibold text-gray-800 capitalize flex-1">${album.title}</h4>
      </div>
      <a href="albums.html?albumId=${album.id}" class="btn-gradient text-sm inline-flex items-center gap-1">
        <i class="fa-solid fa-folder-open"></i> Open Album
      </a>
    </div>
  `).join('')}</div>`;
}
