/* ===================================================
   SocialHub – Albums Page Logic
   Lists all albums grouped by user, or shows a specific
   album's photo grid when albumId is in the URL.
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('navbarContainer').innerHTML = renderNavbar('albums');
  document.getElementById('footerContainer').innerHTML = renderFooter();
  initNavbar();

  const params = new URLSearchParams(window.location.search);
  const albumId = parseInt(params.get('albumId'));

  if (albumId) {
    await showAlbumPhotos(albumId);
  } else {
    await showAllAlbums();
  }
});

/* ---------- Show All Albums ---------- */
async function showAllAlbums() {
  const container = document.getElementById('albumsContainer');

  const [albums, users] = await Promise.all([getAlbums(), getUsers()]);
  if (!albums || !users) {
    container.innerHTML = '<p class="text-center text-accent-red">Failed to load albums.</p>';
    return;
  }

  const userMap = {};
  users.forEach(u => userMap[u.id] = u);

  // Group albums by user
  const grouped = {};
  albums.forEach(a => {
    if (!grouped[a.userId]) grouped[a.userId] = [];
    grouped[a.userId].push(a);
  });

  let html = '';
  for (const userId in grouped) {
    const user = userMap[userId];
    const userAlbums = grouped[userId];

    html += `
    <div class="mb-10 fade-in">
      <div class="flex items-center gap-3 mb-4">
        <div class="avatar" style="background:${stringToColor(user.name)}">
          ${getInitials(user.name)}
        </div>
        <div>
          <a href="profile.html?id=${user.id}" class="font-bold text-gray-800 hover:text-accent-red transition-colors">${user.name}</a>
          <p class="text-xs text-gray-400">${userAlbums.length} albums</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${userAlbums.map((album, i) => `
          <div class="album-card p-5 fade-in" style="animation-delay:${i * 0.03}s">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-cosmos-blue/10 flex items-center justify-center text-cosmos-blue shrink-0">
                <i class="fa-solid fa-images"></i>
              </div>
              <h4 class="text-sm font-semibold text-gray-800 capitalize">${album.title}</h4>
            </div>
            <a href="albums.html?albumId=${album.id}" class="btn-gradient text-xs inline-flex items-center gap-1">
              <i class="fa-solid fa-folder-open"></i> Open Album
            </a>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

/* ---------- Show Single Album Photos ---------- */
async function showAlbumPhotos(albumId) {
  const container = document.getElementById('albumsContainer');
  const title = document.getElementById('pageTitle');

  const photos = await getAlbumPhotos(albumId);
  if (!photos || photos.length === 0) {
    container.innerHTML = '<p class="text-center text-accent-red">No photos found in this album.</p>';
    return;
  }

  title.innerHTML = `
    <a href="albums.html" class="text-gray-400 hover:text-accent-red transition-colors">
      <i class="fa-solid fa-arrow-left mr-2"></i>Albums
    </a>
    <span class="mx-2 text-gray-300">/</span> Album #${albumId}
  `;

  container.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      ${photos.map((photo, i) => `
        <div class="gallery-item aspect-square fade-in" style="animation-delay:${i * 0.02}s"
             onclick="openLightbox('${photo.url}', '${photo.title.replace(/'/g, "\\'")}')">
          <img src="${photo.thumbnailUrl}" alt="${photo.title}" loading="lazy" />
          <div class="overlay">
            <p class="text-white text-xs capitalize">${photo.title}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- Lightbox ---------- */
function openLightbox(src, titleText) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxTitle').textContent = titleText || '';
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target.tagName === 'IMG') return; // don't close when clicking image
  const lb = document.getElementById('lightbox');
  lb.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightbox');
    if (lb) { lb.classList.remove('show'); document.body.style.overflow = ''; }
  }
});
