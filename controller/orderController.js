import OrderModel from "../model/orderModel.js";
import { order_db } from "../db/db.js";

export default class OrderController {
    constructor() {
        this.orderModel = new OrderModel();
        this.currentOrder = {
            customer: null,
            items: [],
            total: 0
        };
        this.initialize();
    }

    initialize() {
        this.loadItems();
        this.loadCustomers();
        this.setupEventListeners();
    }

    loadItems() {
        const sidePage = document.getElementById('sidePg');
        sidePage.innerHTML = '';

        order_db.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.width = '18rem';
            card.innerHTML = `
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text">$${item.price.toFixed(2)}</p>
                    <div class="cart-options">
                        <img src="../assets/icon/shopping-cart.png" width="30px" height="30px" class="shopping-cart">
                        <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            sidePage.appendChild(card);
        });
    }

    loadCustomers() {
        const customerDropdownMenu = document.querySelector('.dropdown-center .dropdown-menu');
        customerDropdownMenu.innerHTML = '';

        order_db.customers.forEach(customer => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = '#';
            a.textContent = customer.name;
            a.dataset.id = customer.id;
            li.appendChild(a);
            customerDropdownMenu.appendChild(li);
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const itemId = e.target.dataset.id;
                this.addToCart(itemId);
            }

            if (e.target.classList.contains('quantity-maintainer')) {
                const card = e.target.closest('.card-cart');
                if (card) {
                    const itemId = card.dataset.id;
                    if (e.target.getAttribute('src').includes('plus')) {
                        this.increaseQuantity(itemId);
                    } else if (e.target.getAttribute('src').includes('minus')) {
                        this.decreaseQuantity(itemId);
                    }
                }
            }

            if (e.target.classList.contains('dropdown-item') && e.target.closest('.dropdown-center')) {
                const customerId = e.target.dataset.id;
                this.selectCustomer(customerId);
            }
        });

        const continueButton = document.getElementById('continue');
        if (continueButton) {
            continueButton.addEventListener('click', () => this.placeOrder());
        }
    }

    addToCart(itemId) {
        const item = order_db.items.find(i => i.id === itemId);
        if (!item) return;

        const existingItem = this.currentOrder.items.find(i => i.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.currentOrder.items.push({
                ...item,
                quantity: 1
            });
        }

        this.updateCartDisplay();
    }

    increaseQuantity(itemId) {
        const item = this.currentOrder.items.find(i => i.id === itemId);
        if (item) {
            item.quantity += 1;
            this.updateCartDisplay();
        }
    }

    decreaseQuantity(itemId) {
        const itemIndex = this.currentOrder.items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            const item = this.currentOrder.items[itemIndex];
            item.quantity -= 1;

            if (item.quantity <= 0) {
                this.currentOrder.items.splice(itemIndex, 1);
            }

            this.updateCartDisplay();
        }
    }

    selectCustomer(customerId) {
        const customer = order_db.customers.find(c => c.id === customerId);
        if (customer) {
            this.currentOrder.customer = customer;
            const customerDropdown = document.querySelector('.dropdown-center button');
            customerDropdown.textContent = customer.name;

            const customerPhoto = document.querySelector('#photo img');
            const customerName = document.querySelector('#photo').firstChild;
            customerName.textContent = customer.name;
        }
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cart');
        cartContainer.innerHTML = '';

        let total = 0;

        this.currentOrder.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const card = document.createElement('div');
            card.className = 'card-cart';
            card.style.width = '18rem';
            card.dataset.id = item.id;
            card.innerHTML = `
                <img src="${item.image}" class="cart-image" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                    <div class="cart-options">
                        <img src="../assets/icon/plus.png" width="30px" height="30px" class="quantity-maintainer">
                        <p class="quantity-handling">${item.quantity}</p>
                        <img src="../assets/icon/minus.png" width="30px" height="30px" class="quantity-maintainer">
                    </div>
                </div>
            `;

            const wrapper = document.createElement('span');
            wrapper.className = 'border border-info';
            wrapper.appendChild(card);
            cartContainer.appendChild(wrapper);
        });

        this.currentOrder.total = total;

        const continueButton = document.getElementById('continue');
        if (continueButton) {
            continueButton.disabled = this.currentOrder.items.length === 0 || !this.currentOrder.customer;
        }
    }

    placeOrder() {
        if (this.currentOrder.items.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Empty Order',
                text: 'Please add items to your order before placing it.'
            });
            return;
        }

        if (!this.currentOrder.customer) {
            Swal.fire({
                icon: 'error',
                title: 'No Customer Selected',
                text: 'Please select a customer before placing the order.'
            });
            return;
        }

        // Create the order in the model
        const newOrder = this.orderModel.createOrder(
            this.currentOrder.customer.id,
            this.currentOrder.items,
            this.currentOrder.total
        );

        Swal.fire({
            icon: 'success',
            title: 'Order Placed!',
            text: `Order #${newOrder.id} for ${this.currentOrder.customer.name} has been placed successfully. Total: $${this.currentOrder.total.toFixed(2)}`,
            showConfirmButton: true
        }).then(() => {
            // Reset the current order (keep the same customer)
            this.currentOrder = {
                customer: this.currentOrder.customer,
                items: [],
                total: 0
            };
            this.updateCartDisplay();
        });
    }
}

// Initialize the controller when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new OrderController();
});