// Cart State Management using LocalStorage
class CartManager {
    constructor() {
        this.cartKey = 'bharathi_cart';
        this.cart = this.getCart();
        this.listeners = [];
        this.init();
    }

    init() {
        // Update initial UI
        this.notifyListeners();
        // Setup global listener for 'Add to Cart' buttons on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAddToCartButtons();
            this.updateCartBadge();
        });
    }

    getCart() {
        const storedCart = localStorage.getItem(this.cartKey);
        return storedCart ? JSON.parse(storedCart) : [];
    }

    saveCart() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
        this.notifyListeners();
        this.updateCartBadge();
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.showToast(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.cart));
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const total = this.getTotalItems();
            badge.textContent = total;
            badge.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    setupAddToCartButtons() {
        const buttons = document.querySelectorAll('.add-to-cart-btn');
        buttons.forEach(button => {
            // Remove existing to prevent duplicates if called again
            const newBtn = button.cloneNode(true);
            button.parentNode.replaceChild(newBtn, button);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = newBtn.closest('.product-card') || newBtn.closest('.product-details');
                if (!card) return;

                const product = {
                    id: card.dataset.id,
                    name: card.querySelector('.product-title').textContent,
                    price: parseFloat(card.dataset.price),
                    image: card.querySelector('.product-img').src,
                    category: card.dataset.category
                };
                
                this.addItem(product);
            });
        });
    }

    showToast(message) {
        // Simple toast notification
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
            background-color: var(--color-primary-green);
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(100%);
            opacity: 0;
            transition: all 0.3s ease;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        toast.innerHTML = `<i class="ph ph-check-circle" style="font-size: 1.2rem;"></i> ${message}`;

        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize global cart manager
window.cartManager = new CartManager();
