// Products Module
// Handles product loading, filtering, and management
// Uses StateManager for centralized state

// Get all products from state
async function getAllProducts() {
  return await StateManager.getProducts();
}

// Filter products by category
function filterByCategory(products, category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

// Filter products by price range
function filterByPriceRange(products, minPrice, maxPrice) {
  return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

// Get unique categories from products
function getCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.sort();
}

// Get products by merchant ID
function getProductsByMerchant(products, merchantId) {
  return products.filter(p => p.merchantId === merchantId);
}

// Generate new product ID
function generateProductId(products) {
  const maxId = products.reduce((max, p) => {
    const num = parseInt(p.id.substring(1));
    return num > max ? num : max;
  }, 0);
  return 'P' + String(maxId + 1).padStart(3, '0');
}

// Add new product
async function addProduct(product) {
  const products = await StateManager.getProducts();
  
  // Generate new ID
  product.id = generateProductId(products);
  
  // Add to products array
  products.push(product);
  
  // Save to state (triggers update event)
  StateManager.setProducts(products);
  
  return product;
}

// Update product
async function updateProduct(productId, updatedData) {
  const products = await StateManager.getProducts();
  const index = products.findIndex(p => p.id === productId);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    StateManager.setProducts(products);
    return true;
  }
  return false;
}

// Delete product
async function deleteProduct(productId) {
  const products = await StateManager.getProducts();
  const filtered = products.filter(p => p.id !== productId);
  StateManager.setProducts(filtered);
  return true;
}

// Cart Management
function getCart() {
  return StateManager.getCart();
}

function addToCart(productId) {
  return StateManager.addToCart(productId);
}

function getCartCount() {
  return StateManager.getCartCount();
}
