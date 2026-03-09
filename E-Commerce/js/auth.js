/**
 * Urban Jungle Co. - Authentication Module
 * Handles user registration, login, logout using localStorage
 */

const Auth = {
    // Storage keys
    USERS_KEY: 'urbanJungle_users',
    SESSION_KEY: 'urbanJungle_session',

    /**
     * Get all registered users
     * @returns {Array} Array of user objects
     */
    getUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Save users array to localStorage
     * @param {Array} users
     */
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },

    /**
     * Register a new user
     * @param {Object} userData - { fullName, email, password }
     * @returns {Object} { success: boolean, message: string }
     */
    register(userData) {
        const { fullName, email, password } = userData;

        // Validation
        if (!fullName || !email || !password) {
            return { success: false, message: 'All fields are required.' };
        }

        if (fullName.trim().length < 2) {
            return { success: false, message: 'Name must be at least 2 characters.' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Please enter a valid email address.' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters.' };
        }

        const users = this.getUsers();

        // Check for duplicate email
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        // Create user
        const newUser = {
            id: Date.now(),
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In a real app, this should be hashed
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        // Auto-login after registration
        this.setSession(newUser);

        return { success: true, message: 'Account created successfully!' };
    },

    /**
     * Login a user
     * @param {string} email
     * @param {string} password
     * @returns {Object} { success: boolean, message: string }
     */
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Email and password are required.' };
        }

        const users = this.getUsers();
        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
        );

        if (!user) {
            return { success: false, message: 'Invalid email or password.' };
        }

        this.setSession(user);
        return { success: true, message: `Welcome back, ${user.fullName}!` };
    },

    /**
     * Set user session
     * @param {Object} user
     */
    setSession(user) {
        const session = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    },

    /**
     * Get current session
     * @returns {Object|null} Session object or null
     */
    getSession() {
        const session = localStorage.getItem(this.SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    /**
     * Check if a user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.getSession() !== null;
    },

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        this.updateAuthUI();
        if (typeof Cart !== 'undefined') {
            Cart.showNotification('You have been logged out.');
        }
    },

    /**
     * Update the navbar UI based on auth state
     */
    updateAuthUI() {
        const authLinksDesktop = document.getElementById('authLinksDesktop');
        const authLinksMobile = document.getElementById('authLinksMobile');
        const session = this.getSession();

        if (!authLinksDesktop && !authLinksMobile) return;

        if (session) {
            // Logged in state
            const firstName = session.fullName.split(' ')[0];
            const desktopHTML = `
        <div class="relative group">
          <button class="flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50 transition-colors text-gray-600 hover:text-emerald-700" id="userMenuBtn">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
              ${firstName.charAt(0).toUpperCase()}
            </div>
            <span class="text-sm font-medium hidden xl:inline">${firstName}</span>
          </button>
          <div class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50" id="userDropdown">
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="font-semibold text-gray-800 text-sm">${session.fullName}</p>
              <p class="text-xs text-gray-500 truncate">${session.email}</p>
            </div>
            <a href="#" onclick="Auth.logout(); return false;" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sign Out
            </a>
          </div>
        </div>
      `;
            const mobileHTML = `
        <div class="border-t border-gray-100 mt-4 pt-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold">
              ${firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="font-semibold text-gray-800">${session.fullName}</p>
              <p class="text-xs text-gray-500">${session.email}</p>
            </div>
          </div>
          <a href="#" onclick="Auth.logout(); return false;" class="mobile-nav-link text-red-500 hover:text-red-600">🚪 Sign Out</a>
        </div>
      `;
            if (authLinksDesktop) authLinksDesktop.innerHTML = desktopHTML;
            if (authLinksMobile) authLinksMobile.innerHTML = mobileHTML;
        } else {
            // Logged out state
            const desktopHTML = `
        <a href="login.html" class="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-xl hover:bg-emerald-50">Sign In</a>
        <a href="register.html" class="text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-emerald-200 transition-all hover:-translate-y-0.5">Sign Up</a>
      `;
            const mobileHTML = `
        <div class="border-t border-gray-100 mt-4 pt-4 space-y-2">
          <a href="login.html" class="mobile-nav-link">🔑 Sign In</a>
          <a href="register.html" class="mobile-nav-link">📝 Sign Up</a>
        </div>
      `;
            if (authLinksDesktop) authLinksDesktop.innerHTML = desktopHTML;
            if (authLinksMobile) authLinksMobile.innerHTML = mobileHTML;
        }
    },

    /**
     * Show inline form error
     * @param {string} elementId - The error element id
     * @param {string} message - Error message
     */
    showError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
        }
    },

    /**
     * Hide inline form error
     * @param {string} elementId - The error element id
     */
    hideError(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = '';
            el.classList.add('hidden');
        }
    },

    /**
     * Toggle password visibility
     * @param {string} inputId - Password input id
     * @param {HTMLElement} toggleBtn - The toggle button
     */
    togglePassword(inputId, toggleBtn) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        // Update icon
        const svg = toggleBtn.querySelector('svg');
        if (svg) {
            if (isPassword) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>';
            } else {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
            }
        }
    }
};

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateAuthUI();
});
