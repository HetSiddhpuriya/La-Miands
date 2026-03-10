/* ===================================================
   SocialHub – Gallery Page Logic
   Displays random photos with hover zoom & lightbox
   =================================================== */

let allPhotos = [];
let displayedCount = 0;
const BATCH_SIZE = 30;

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('navbarContainer').innerHTML = renderNavbar('gallery');
    document.getElementById('footerContainer').innerHTML = renderFooter();
    initNavbar();

    const photos = await getPhotos();
    document.getElementById('gallerySpinner').classList.add('hidden');

    if (!photos || photos.length === 0) {
        document.getElementById('galleryGrid').innerHTML =
            '<p class="text-center text-accent-red col-span-full">Failed to load photos.</p>';
        return;
    }

    // Shuffle photos for a random gallery feel
    allPhotos = shuffleArray([...photos]);
    loadMorePhotos();
});

/**
 * Load the next batch of photos into the grid
 */
function loadMorePhotos() {
    const grid = document.getElementById('galleryGrid');
    const end = Math.min(displayedCount + BATCH_SIZE, allPhotos.length);

    for (let i = displayedCount; i < end; i++) {
        const photo = allPhotos[i];
        const item = document.createElement('div');
        item.className = 'gallery-item aspect-square fade-in';
        item.style.animationDelay = `${(i - displayedCount) * 0.03}s`;
        item.onclick = () => openLightbox(photo.url, photo.title);

        item.innerHTML = `
      <img src="${photo.thumbnailUrl}" alt="${photo.title}" loading="lazy" />
      <div class="overlay">
        <p class="text-white text-xs capitalize">${photo.title}</p>
      </div>
    `;
        grid.appendChild(item);
    }

    displayedCount = end;
    document.getElementById('photoCount').textContent = `Showing ${displayedCount} of ${allPhotos.length} photos`;

    // Hide button if all loaded
    if (displayedCount >= allPhotos.length) {
        document.getElementById('loadMoreBtn').classList.add('hidden');
    }
}

/**
 * Fisher–Yates shuffle
 */
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
    if (e && e.target.tagName === 'IMG') return;
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
