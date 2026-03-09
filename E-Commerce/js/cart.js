/**
 * Urban Jungle Co. - Cart Management
 * Handles cart operations using localStorage
 */

// Cart namespace
const Cart = {
    // Storage key
    STORAGE_KEY: 'urbanJungle_cart',

    /**
     * Get cart data from localStorage
     * @returns {Array} Cart items array
     */
    getCart() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    /**
     * Save cart to localStorage
     * @param {Array} cart - Cart items to save
     */
    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.updateCartCount();
    },

    /**
     * Add item to cart
     * @param {number} productId - The product ID to add
     * @param {number} quantity - Quantity to add (default: 1)
     */
    addItem(productId, quantity = 1) {
        const cart = this.getCart();
        const product = products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                category: product.category
            });
        }

        this.saveCart(cart);
        this.showNotification(`${product.name} added to cart!`);
    },

    /**
     * Remove item from cart
     * @param {number} productId - Product ID to remove
     */
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    },

    /**
     * Update item quantity
     * @param {number} productId - Product ID
     * @param {number} newQuantity - New quantity value
     */
    updateQuantity(productId, newQuantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
                return;
            }
            item.quantity = newQuantity;
            this.saveCart(cart);
        }
    },

    /**
     * Get total number of items in cart
     * @returns {number} Total item count
     */
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Get cart subtotal
     * @returns {number} Subtotal price
     */
    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    /**
     * Get shipping cost (free above $50)
     * @returns {number} Shipping cost
     */
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 50 ? 0 : 5.99;
    },

    /**
     * Get total price including shipping
     * @returns {number} Total price
     */
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    },

    /**
     * Clear all items from cart
     */
    clearCart() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartCount();
    },

    /**
     * Update cart count badge in navbar
     */
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();

        countElements.forEach(el => {
            el.textContent = totalItems;
            if (totalItems > 0) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    },

    /**
     * Show a toast notification
     * @param {string} message - Notification message
     */
    showNotification(message) {
        // Remove existing notification if any
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${message}</span>
      </div>
    `;
        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
};

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartCount();
});
