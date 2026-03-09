/**
 * ShopVerse - Cart Management
 * Handles cart operations using localStorage
 */

const Cart = {
    STORAGE_KEY: 'shopverse_cart',

    getCart() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.updateCartCount();
    },

    /**
     * Add item to cart (from API product data)
     */
    addItem(product, quantity = 1) {
        const cart = this.getCart();

        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: quantity,
                category: product.category,
                brand: product.brand || ''
            });
        }

        this.saveCart(cart);
        this.showNotification(`${product.title} added to cart!`);
    },

    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    },

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

    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 50 ? 0 : 5.99;
    },

    getTotal() {
        return this.getSubtotal() + this.getShipping();
    },

    clearCart() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartCount();
    },

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

    showNotification(message) {
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <svg width="22" height="22" fill="none" stroke="#22c55e" viewBox="0 0 24 24" style="flex-shrink:0">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${message}</span>
      </div>
    `;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

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
