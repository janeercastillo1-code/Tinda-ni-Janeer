// CONFIGURATION & MENU DATA
const currencySymbol = '₱';
const deliveryFee = 50.00;

const menuItems = [
    // BURGERS
    {
        id: 1,
        name: "The Classic Smash Burger",
        category: "burgers",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        desc: "Double beef patty, cheddar cheese, caramelized onions, house burger sauce on a brioche bun."
    },
    {
        id: 2,
        name: "Truffle Mushroom Swiss",
        category: "burgers",
        price: 389.00,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
        desc: "Angus beef patty, sautéed mushrooms, melted Swiss cheese, and fragrant truffle aioli."
    },
    {
        id: 3,
        name: "Spicy Crispy Chicken Burger",
        category: "burgers",
        price: 329.00,
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
        desc: "Crispy fried chicken thigh, spicy coleslaw, pickled jalapeños, and chipotle mayonnaise."
    },

    // PIZZAS
    {
        id: 4,
        name: "Classic Margherita Pizza",
        category: "pizzas",
        price: 449.00,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
        desc: "San Marzano tomato sauce base, fresh mozzarella, fresh basil leaves, and extra virgin olive oil."
    },
    {
        id: 5,
        name: "Double Pepperoni Blast",
        category: "pizzas",
        price: 549.00,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
        desc: "Loaded with cup-and-char pepperoni slices, mozzarella, parmesan, and a hot honey drizzle."
    },
    {
        id: 6,
        name: "BBQ Smokey Chicken Pizza",
        category: "pizzas",
        price: 499.00,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
        desc: "Grilled chicken strips, sliced red onions, cilantro, and smoked hickory BBQ sauce base."
    },

    // DRINKS
    {
        id: 7,
        name: "House Mint Lemonade",
        category: "drinks",
        price: 110.00,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        desc: "Freshly squeezed lemon juice muddled with crushed fresh mint leaves over ice."
    },
    {
        id: 8,
        name: "Craft Draft Cola",
        category: "drinks",
        price: 95.00,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
        desc: "Artisanal small-batch carbonated cola made with natural cane sugar and spices."
    },
    {
        id: 9,
        name: "Iced Peach Green Tea",
        category: "drinks",
        price: 125.00,
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
        desc: "Slow-brewed jasmine green tea infused with natural peach nectar and ice."
    }
];

let cart = [];
let originalModalHTML = '';

// DOM ELEMENTS
const menuGrid = document.getElementById('menu-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartTriggerBtn = document.getElementById('cart-trigger-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const grandTotalEl = document.getElementById('grand-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const paymentForm = document.getElementById('payment-form');
const modalTotalAmount = document.getElementById('modal-total-amount');

const accountNumberInput = document.getElementById('account-number');
const paymentMethodSelect = document.getElementById('payment-method');
const qrLabel = document.getElementById('qr-label');
const qrCodeImg = document.getElementById('qr-code-img');
const paySubmitBtn = document.getElementById('pay-submit-btn');

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Save initial modal template for clean resets
    const modalContent = document.getElementById('modal-body-content');
    if (modalContent) {
        originalModalHTML = modalContent.innerHTML;
    }

    renderMenuGrid('all');
    setupEventListeners();
});

// EVENT LISTENERS SETUP
function setupEventListeners() {
    if (cartTriggerBtn) cartTriggerBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeCheckout);
    
    bindFormListeners();

    // Category Filter Navigation
    const categoryTabs = document.querySelector('.category-tabs');
    if (categoryTabs) {
        categoryTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderMenuGrid(e.target.dataset.category);
            }
        });
    }

    // Cart Container Event Delegation for + / - buttons
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                const id = parseInt(e.target.dataset.id, 10);
                const change = parseInt(e.target.dataset.change, 10);
                updateQty(id, change);
            }
        });
    }
}

// BIND REUSABLE FORM LISTENERS
function bindFormListeners() {
    const activeForm = document.getElementById('payment-form');
    const activeAccInput = document.getElementById('account-number');
    const activePaySelect = document.getElementById('payment-method');

    if (activeForm) activeForm.addEventListener('submit', processPayment);

    if (activeAccInput) {
        activeAccInput.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    if (activePaySelect) {
        activePaySelect.addEventListener('change', (e) => {
            const method = e.target.value;
            const currentQrLabel = document.getElementById('qr-label');
            const currentPayBtn = document.getElementById('pay-submit-btn');
            const currentQrImg = document.getElementById('qr-code-img');

            if (currentQrLabel) currentQrLabel.textContent = `Scan ${method} QR Code`;
            if (currentPayBtn) currentPayBtn.textContent = `Confirm & Pay via ${method}`;
            if (currentQrImg) currentQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${method}-Tindahan-ni-Janeer-Payment`;
        });
    }
}

// RENDER MENU GRID
function renderMenuGrid(category) {
    if (!menuGrid) return;
    menuGrid.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.dataset.category = item.category;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="card-body">
                <h3 class="card-title">${item.name}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="card-footer">
                    <span class="price">${currencySymbol}${item.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// CART DRAWER CONTROLS
function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('show');
}

function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('show');
}

// CART MANAGEMENT
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existingItem = cart.find(i => i.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    renderCart();
    openCart();
}

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    renderCart();
}

function renderCart() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;

    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your order bag is currently empty.</p>`;
        if (subtotalEl) subtotalEl.textContent = `${currencySymbol}0.00`;
        if (grandTotalEl) grandTotalEl.textContent = `${currencySymbol}0.00`;
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;
    let subtotal = 0;
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${currencySymbol}${item.price.toFixed(2)} each</p>
                <div class="qty-controls">
                    <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span style="font-size:0.9rem; font-weight:600;">${item.qty}</span>
                    <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
            </div>
            <span style="font-weight:700; color:var(--primary, #e63946);">${currencySymbol}${itemTotal.toFixed(2)}</span>
        `;
        if (cartItemsContainer) cartItemsContainer.appendChild(itemRow);
    });

    const grandTotal = subtotal + deliveryFee;
    if (subtotalEl) subtotalEl.textContent = `${currencySymbol}${subtotal.toFixed(2)}`;
    if (grandTotalEl) grandTotalEl.textContent = `${currencySymbol}${grandTotal.toFixed(2)}`;
    
    const modalTotal = document.getElementById('modal-total-amount');
    if (modalTotal) modalTotal.textContent = `${currencySymbol}${grandTotal.toFixed(2)}`;
}

// CHECKOUT & PAYMENT PROCESSING
function openCheckout() {
    closeCart();
    if (checkoutModal) checkoutModal.classList.add('show');
}

function closeCheckout() {
    if (checkoutModal) checkoutModal.classList.remove('show');
}

function resetModal() {
    const modalBody = document.getElementById('modal-body-content');
    if (modalBody && originalModalHTML) {
        modalBody.innerHTML = originalModalHTML;
        bindFormListeners();
    }
    closeCheckout();
}

function processPayment(event) {
    event.preventDefault();

    const paymentSelect = document.getElementById('payment-method');
    const customerNameInput = document.getElementById('customer-name');
    const accNumberInput = document.getElementById('account-number');
    const deliveryAddressInput = document.getElementById('delivery-address');

    const paymentMethod = paymentSelect ? paymentSelect.value : 'GCash';
    const name = customerNameInput ? customerNameInput.value : '';
    const phone = accNumberInput ? accNumberInput.value : '';
    const address = deliveryAddressInput ? deliveryAddressInput.value : '';
    const refNo = 'TNJ' + Math.floor(100000000 + Math.random() * 900000000);
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal + deliveryFee;

    const modalBody = document.getElementById('modal-body-content');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="receipt">
                <div class="success-icon" style="font-size:2.5rem; color:#2ec4b6; text-align:center;">✓</div>
                <h3 style="margin-bottom:0.4rem; text-align:center;">Order Confirmed!</h3>
                <p style="font-size:0.88rem; color:var(--text-muted, #6c757d); margin-bottom:1rem; text-align:center;">Your ${paymentMethod} transaction was successful.</p>
                
                <div class="receipt-details" style="background:#f8f9fa; padding:1rem; border-radius:8px; margin-bottom:1rem; font-size:0.9rem; line-height:1.6;">
                    <p><strong>Order Ref No:</strong> ${refNo}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <p><strong>Customer:</strong> ${name}</p>
                    <p><strong>Mobile/Account:</strong> ${phone}</p>
                    <p><strong>Deliver To:</strong> ${address}</p>
                    <p><strong>Total Paid:</strong> ${currencySymbol}${total.toFixed(2)}</p>
                </div>

                <button onclick="resetModal()" class="pay-submit-btn" style="width:100%;">Return to Menu</button>
            </div>
        `;
    }
    cart = [];
    renderCart();
}