// State Manager Module
// Centralized state management for the entire application
// Handles persistence, synchronization, and state updates

const StateManager = {
  // Initialize state from localStorage or defaults
  init() {
    this.ensureDefaultState();
  },

  // Ensure default state exists in localStorage
  ensureDefaultState() {
    if (!localStorage.getItem('appInitialized')) {
      // Mark app as initialized
      localStorage.setItem('appInitialized', 'true');
      
      // Initialize empty cart if not exists
      if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify({}));
      }
    }
  },

  // Get current user from session
  getCurrentUser() {
    const userStr = localStorage.getItem('loggedInUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set current user session
  setCurrentUser(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  },

  // Clear current user session
  clearCurrentUser() {
    localStorage.removeItem('loggedInUser');
  },

  // Get all products (from localStorage or initial data)
  async getProducts() {
    let products = localStorage.getItem('products');
    
    if (!products) {
      // Load from JSON file on first access
      try {
        const response = await fetch('../data/products.json');
        products = await response.json();
        this.setProducts(products);
        return products;
      } catch (error) {
        console.error('Error loading products:', error);
        return [];
      }
    }
    
    return JSON.parse(products);
  },

  // Set products in localStorage
  setProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
    // Trigger custom event for state change
    window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
  },

  // Get all users (from localStorage or initial data)
  async getUsers() {
    let users = localStorage.getItem('users');
    
    if (!users) {
      // Load from JSON file on first access
      try {
        const response = await fetch('../data/users.json');
        users = await response.json();
        this.setUsers(users);
        return users;
      } catch (error) {
        console.error('Error loading users:', error);
        return [];
      }
    }
    
    return JSON.parse(users);
  },

  // Set users in localStorage
  setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
    // Trigger custom event for state change
    window.dispatchEvent(new CustomEvent('usersUpdated', { detail: users }));
  },

  // Get cart state
  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {};
  },

  // Update cart state
  setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Trigger custom event for state change
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  },

  // Add item to cart
  addToCart(productId) {
    const cart = this.getCart();
    cart[productId] = (cart[productId] || 0) + 1;
    this.setCart(cart);
    return cart[productId];
  },

  // Get cart item count
  getCartCount() {
    const cart = this.getCart();
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  },

  // Get all orders
  getOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  },

  // Set orders in localStorage
  setOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
    // Trigger custom event for state change
    window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: orders }));
  },

  // Add new order
  addOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    this.setOrders(orders);
    return order;
  },

  // Get orders by user ID
  getOrdersByUser(userId) {
    const orders = this.getOrders();
    return orders.filter(order => order.userId === userId);
  },

  // Generate order ID
  generateOrderId() {
    const orders = this.getOrders();
    const maxId = orders.reduce((max, order) => {
      const num = parseInt(order.orderId.substring(3));
      return num > max ? num : max;
    }, 0);
    return 'ORD' + String(maxId + 1).padStart(4, '0');
  },

  // Clear all state (for testing)
  clearAll() {
    localStorage.removeItem('products');
    localStorage.removeItem('users');
    localStorage.removeItem('cart');
    localStorage.removeItem('orders');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('appInitialized');
  }
};

// Initialize state manager on load
StateManager.init();
