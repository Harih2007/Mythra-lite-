# Developer Guide - ShopHub

## Quick Reference for Understanding the Codebase

### 🎯 Core Concepts

#### 1. State Management Pattern
```javascript
// All state operations go through StateManager
const products = await StateManager.getProducts();  // Read
StateManager.setProducts(updatedProducts);          // Write (triggers event)

// Listen for changes
window.addEventListener('productsUpdated', async () => {
    // Auto-refresh your view
});
```

#### 2. Authentication Flow
```
User submits login form
    ↓
auth.js validates credentials
    ↓
Check if account is disabled
    ↓
Store session in StateManager
    ↓
Redirect to role-specific dashboard
    ↓
role-guard.js validates access
    ↓
Dashboard loads
```

#### 3. Role Guard Pattern
```javascript
// Automatic on every dashboard page
checkAccess(requiredRole)
    ↓
No user? → Redirect to login
    ↓
Wrong role? → Redirect to correct dashboard
    ↓
Correct role? → Apply role-based UI
```

### 📁 Module Responsibilities

#### state-manager.js
**Purpose**: Single source of truth for all application data

**Key Functions**:
- `getProducts()` - Fetch products from state
- `setProducts(products)` - Update products and trigger event
- `getUsers()` - Fetch users from state
- `setUsers(users)` - Update users and trigger event
- `getCurrentUser()` - Get logged-in user
- `addToCart(productId)` - Add item to cart
- `getCartCount()` - Get total cart items

**Events Emitted**:
- `productsUpdated` - When products change
- `usersUpdated` - When users change
- `cartUpdated` - When cart changes

#### auth.js
**Purpose**: Handle login, logout, session management

**Key Functions**:
- `validateCredentials(username, password)` - Check login
- `storeUserSession(user)` - Save session
- `getCurrentUser()` - Get current user
- `logout()` - Clear session and redirect

**Features**:
- Checks for disabled accounts
- Shows inline error messages
- Button loading states
- Auto-redirect based on role

#### role-guard.js
**Purpose**: Protect dashboards and enforce role-based UI

**Key Functions**:
- `checkAccess(requiredRole)` - Validate access
- `redirectToDashboard(role)` - Send to correct page
- `setupLogout()` - Handle logout clicks
- `applyRoleBasedUI(role)` - Hide/show elements

**Auto-runs on**: Every dashboard page load

#### products.js
**Purpose**: Product CRUD operations

**Key Functions**:
- `getAllProducts()` - Get all products
- `filterByCategory(products, category)` - Filter products
- `filterByPriceRange(products, min, max)` - Price filter
- `getProductsByMerchant(products, merchantId)` - Merchant filter
- `addProduct(product)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Remove product
- `addToCart(productId)` - Add to cart
- `getCartCount()` - Get cart count

### 🎨 Dashboard Patterns

#### User Dashboard Pattern
```javascript
// 1. Initialize
async function initUserDashboard() {
    allProducts = await getAllProducts();
    displayProducts(allProducts);
    setupFilters();
    updateCartCount();
    
    // 2. Listen for updates
    window.addEventListener('productsUpdated', async () => {
        allProducts = await getAllProducts();
        applyFilters(); // Re-apply current filters
    });
}

// 3. Display with role-appropriate UI
function displayProducts(products) {
    // Users see: Add to Cart button
    // Users DON'T see: Edit/Delete buttons
}

// 4. Handle actions with feedback
function handleAddToCart(productId, button) {
    button.disabled = true;
    button.textContent = 'Added!';
    addToCart(productId);
    // Re-enable after delay
}
```

#### Merchant Dashboard Pattern
```javascript
// 1. Initialize with filtered data
async function initMerchantDashboard() {
    currentUser = StateManager.getCurrentUser();
    await refreshProducts();
    
    // 2. Auto-refresh on changes
    window.addEventListener('productsUpdated', refreshProducts);
}

// 3. Filter to merchant's products only
async function refreshProducts() {
    const allProducts = await getAllProducts();
    merchantProducts = getProductsByMerchant(
        allProducts, 
        currentUser.merchantId
    );
    displayMerchantProducts();
}

// 4. CRUD with visual feedback
async function handleAddProduct(event) {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
    
    await addProduct(newProduct);
    
    submitBtn.textContent = 'Added!';
    // Auto-refresh via event listener
}
```

#### Admin Dashboard Pattern
```javascript
// 1. Initialize with all data
async function initAdminDashboard() {
    await refreshData();
    
    // 2. Listen for multiple state changes
    window.addEventListener('usersUpdated', refreshUsers);
    window.addEventListener('productsUpdated', refreshProducts);
}

// 3. Display with admin controls
function displayUsers() {
    // Show enable/disable buttons
    // Except for admin accounts
}

// 4. Admin actions update state
async function toggleUserStatus(userId, currentlyDisabled, button) {
    button.disabled = true;
    button.textContent = 'Processing...';
    
    const users = await StateManager.getUsers();
    users[index].disabled = !currentlyDisabled;
    StateManager.setUsers(users); // Triggers event
    
    // UI auto-refreshes via event listener
}
```

### 🔄 Event-Driven Updates

#### How Auto-Refresh Works
```javascript
// Step 1: Merchant adds product
await addProduct(newProduct);
    ↓
// Step 2: products.js calls StateManager
StateManager.setProducts(updatedProducts);
    ↓
// Step 3: StateManager triggers event
window.dispatchEvent(new CustomEvent('productsUpdated'));
    ↓
// Step 4: All dashboards listening
window.addEventListener('productsUpdated', refreshView);
    ↓
// Step 5: Each dashboard refreshes its view
// User dashboard: Shows new product
// Merchant dashboard: Shows in their list
// Admin dashboard: Updates count
```

### 🎭 Role-Based UI Techniques

#### Technique 1: CSS Classes
```javascript
// role-guard.js adds class to body
document.body.classList.add('role-user');

// CSS hides elements
.role-user .admin-only { display: none !important; }
```

#### Technique 2: Data Attributes
```html
<!-- Show only for admin -->
<button data-show-for="admin">Admin Action</button>

<!-- Hide for users -->
<div data-hide-for="user">Merchant Content</div>
```

#### Technique 3: Conditional Rendering
```javascript
// Only render edit button for merchants
${userRole === 'merchant' ? `
    <button onclick="editProduct()">Edit</button>
` : ''}
```

#### Technique 4: Data Filtering
```javascript
// Merchants only see their products
if (userRole === 'merchant') {
    products = products.filter(p => p.merchantId === currentUser.merchantId);
}
```

### 🚫 No Alerts/Confirms Pattern

#### Instead of alert()
```javascript
// ❌ Bad
alert('Product added!');

// ✅ Good
button.textContent = 'Added!';
setTimeout(() => button.textContent = 'Add to Cart', 1500);
```

#### Instead of confirm()
```javascript
// ❌ Bad
if (confirm('Delete product?')) {
    deleteProduct(id);
}

// ✅ Good
button.disabled = true;
button.textContent = 'Deleting...';
await deleteProduct(id);
// Auto-refresh shows it's gone
```

#### Error Messages
```javascript
// ❌ Bad
alert('Invalid credentials');

// ✅ Good
const errorDiv = document.createElement('div');
errorDiv.className = 'error-message';
errorDiv.textContent = 'Invalid credentials';
form.appendChild(errorDiv);

// Auto-hide after 5 seconds
setTimeout(() => errorDiv.remove(), 5000);
```

### 🔧 Adding New Features

#### Add a New Product Field
```javascript
// 1. Update data/products.json
{
    "id": "P001",
    "name": "Product",
    "newField": "value"  // Add here
}

// 2. Update add/edit forms in merchant.html
<input type="text" id="product-newfield">

// 3. Update handleAddProduct()
const newProduct = {
    name: document.getElementById('product-name').value,
    newField: document.getElementById('product-newfield').value
};

// 4. Update display functions
<p>${product.newField}</p>
```

#### Add a New Role
```javascript
// 1. Add to data/users.json
{
    "username": "newrole",
    "password": "newrole",
    "role": "newrole"
}

// 2. Create dashboards/newrole.html

// 3. Update auth.js redirect
case 'newrole':
    window.location.href = 'dashboards/newrole.html';
    break;

// 4. Update role-guard.js
if (path.includes('newrole.html')) {
    requiredRole = 'newrole';
}
```

#### Add a New State Type
```javascript
// 1. Add to state-manager.js
getOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
},

setOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('ordersUpdated'));
}

// 2. Listen in dashboards
window.addEventListener('ordersUpdated', refreshOrders);
```

### 🐛 Debugging Tips

#### Check Current State
```javascript
// Open browser console
StateManager.getCurrentUser()  // See logged-in user
StateManager.getProducts()     // See all products
StateManager.getCart()         // See cart contents
```

#### Clear State (Reset)
```javascript
// In browser console
StateManager.clearAll()
location.reload()
```

#### Check Role Guard
```javascript
// In browser console
document.body.className  // Should show role-{rolename}
```

#### Monitor Events
```javascript
// In browser console
window.addEventListener('productsUpdated', () => console.log('Products updated!'));
window.addEventListener('usersUpdated', () => console.log('Users updated!'));
window.addEventListener('cartUpdated', () => console.log('Cart updated!'));
```

### 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Storage                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   products   │  │    users     │  │     cart     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    StateManager                          │
│  • getProducts()  • setProducts()                       │
│  • getUsers()     • setUsers()                          │
│  • getCart()      • setCart()                           │
│  • Emits: productsUpdated, usersUpdated, cartUpdated   │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                  Business Logic                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ auth.js  │  │products.js│  │role-guard│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    UI Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │user.html │  │merchant  │  │admin.html│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### ✅ Best Practices Used

1. **Single Responsibility** - Each module does one thing
2. **DRY** - No duplicated logic
3. **Event-Driven** - Loose coupling via events
4. **Declarative UI** - State drives UI, not vice versa
5. **Progressive Enhancement** - Works without JS (login form)
6. **Graceful Degradation** - Empty states, error handling
7. **User Feedback** - Loading states, success messages
8. **Accessibility** - Semantic HTML, proper labels
9. **Responsive** - Mobile-friendly layouts
10. **Maintainable** - Clear comments, consistent naming

---

**Remember**: This is a learning project focused on architecture patterns, not production security!
