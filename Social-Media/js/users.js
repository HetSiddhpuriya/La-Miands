/* ===================================================
   SocialHub – Users Page Logic
   Loads and renders user cards with search filtering
   =================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('navbarContainer').innerHTML = renderNavbar('users');
  document.getElementById('footerContainer').innerHTML = renderFooter();
  initNavbar();

  const grid = document.getElementById('usersGrid');
  grid.innerHTML = skeletonCards(6);

  const users = await getUsers();
  if (!users) {
    grid.innerHTML = '<p class="text-center text-accent-red col-span-full">Failed to load users.</p>';
    return;
  }

  // Check if there's a search query in the URL
  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get('search') || '';
  const searchInput = document.getElementById('userSearch');
  if (initialSearch) searchInput.value = initialSearch;

  /** Render filtered user cards */
  function renderUsers(query = '') {
    const q = query.toLowerCase().trim();
    const filtered = q ? users.filter(u => u.name.toLowerCase().includes(q)) : users;

    document.getElementById('noResults').classList.toggle('hidden', filtered.length > 0);

    grid.innerHTML = '';
    filtered.forEach((user, idx) => {
      const card = document.createElement('div');
      card.className = 'card p-6 fade-in cursor-pointer hover:border-dark-red';
      card.style.animationDelay = `${idx * 0.05}s`;
      card.onclick = () => window.location.href = `profile.html?id=${user.id}`;

      card.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <div class="avatar text-lg" style="width:56px;height:56px;background:${stringToColor(user.name)}">
            ${getInitials(user.name)}
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">${user.name}</h3>
            <p class="text-sm text-cosmos-blue">@${user.username.toLowerCase()}</p>
          </div>
        </div>

        <div class="space-y-2 text-sm text-gray-500">
          <p><i class="fa-solid fa-envelope mr-2 text-gray-400 w-4"></i>${user.email.toLowerCase()}</p>
          <p><i class="fa-solid fa-building mr-2 text-gray-400 w-4"></i>${user.company.name}</p>
          <p><i class="fa-solid fa-location-dot mr-2 text-gray-400 w-4"></i>${user.address.city}</p>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span class="badge bg-cosmos-blue/10 text-cosmos-blue"><i class="fa-solid fa-globe mr-1"></i>${user.website}</span>
          <span class="text-accent-red text-sm font-medium">View Profile <i class="fa-solid fa-arrow-right ml-1"></i></span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderUsers(initialSearch);

  // Live search filter
  searchInput.addEventListener('input', (e) => renderUsers(e.target.value));
});
