/**
 * ShopVerse - Authentication Module
 * Handles user registration, login, logout using localStorage
 */

const Auth = {
    // Storage keys
    USERS_KEY: 'shopVerse_users',
    SESSION_KEY: 'shopVerse_session',

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

        // Simple Validation
        if (!fullName || !email || !password) {
            return { success: false, message: 'All fields are required.' };
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
        setTimeout(() => window.location.reload(), 800);
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
                <div style="position:relative;display:flex;align-items:center;gap:0.75rem;">
                    <button class="nav-action-btn" style="display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0.75rem;background:var(--gray-100);border-radius:var(--radius-full);width:auto;height:auto;" id="userMenuBtn">
                        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(to bottom right, var(--primary-500), var(--primary-700));color:white;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;">
                            ${firstName.charAt(0).toUpperCase()}
                        </div>
                        <span style="font-size:0.875rem;font-weight:600;color:var(--gray-700);">${firstName}</span>
                    </button>
                    <button onclick="Auth.logout()" class="nav-action-btn" title="Logout" style="color:var(--danger-500);background:var(--danger-50);">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    </button>
                </div>
            `;
            const mobileHTML = `
                <div style="padding:1.5rem 0;border-top:1px solid var(--gray-100);margin-top:auto;">
                    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
                        <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(to bottom right, var(--primary-500), var(--primary-700));color:white;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:700;">
                            ${firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-weight:700;color:var(--gray-900);">${session.fullName}</div>
                            <div style="font-size:0.8rem;color:var(--gray-500);">${session.email}</div>
                        </div>
                    </div>
                    <button onclick="Auth.logout()" class="mobile-nav-link" style="width:100%;text-align:left;color:var(--danger-500);border:none;background:none;padding:0;">🚪 Logout</button>
                </div>
            `;
            if (authLinksDesktop) {
                authLinksDesktop.innerHTML = desktopHTML;
                authLinksDesktop.classList.remove('hidden');
            }
            if (authLinksMobile) {
                authLinksMobile.innerHTML = mobileHTML;
            }
        } else {
            // Logged out state
            const desktopHTML = `
                <div style="display:flex;align-items:center;gap:0.75rem;">
                    <a href="login.html" class="nav-link" style="font-size:0.875rem;padding:0.5rem 1rem;">Sign In</a>
                    <a href="register.html" class="btn-primary" style="padding:0.5rem 1.25rem;font-size:0.875rem;">Join Free</a>
                </div>
            `;
            const mobileHTML = `
                <div style="padding:1.5rem 0;border-top:1px solid var(--gray-100);margin-top:auto;display:flex;flex-direction:column;gap:0.75rem;">
                    <a href="login.html" class="mobile-nav-link">🔑 Sign In</a>
                    <a href="register.html" class="btn-primary" style="justify-content:center;padding:0.875rem;">Create Account</a>
                </div>
            `;
            if (authLinksDesktop) {
                authLinksDesktop.innerHTML = desktopHTML;
                authLinksDesktop.classList.remove('hidden');
            }
            if (authLinksMobile) {
                authLinksMobile.innerHTML = mobileHTML;
            }
        }
    }
};

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateAuthUI();
});
