# Testing Guide - ShopHub

## Quick Testing Scenarios

### 🧪 Test 1: User Role - Browse & Cart

**Steps:**
1. Open `index.html` in browser
2. Click "Login"
3. Enter: `user` / `user`
4. Click "Login" button (should show "Logging in..." then "Success!")

**Expected Results:**
- Redirected to User Dashboard
- See 8 products displayed
- Cart shows "0 items"
- All products have "Add to Cart" button
- NO edit/delete buttons visible

**Actions to Test:**
1. **Filter by Category**
   - Select "Men's Clothing" from dropdown
   - Click "Apply Filters"
   - Should see only 3 products (T-Shirt, Jeans, Casual Shirt)

2. **Filter by Price**
   - Set Min Price: 1000
   - Set Max Price: 2000
   - Click "Apply Filters"
   - Should see 4 products in that range

3. **Add to Cart**
   - Click "Add to Cart" on any product
   - Button should show "Added!"
   - Cart count should increase
   - Inline text shows "(1 in cart)"
   - Click same product again - count increases to 2

4. **Persistence Test**
   - Add 3 items to cart
   - Refresh page (F5)
   - Cart count should still show 3

---

### 🧪 Test 2: Merchant Role - Product Management

**Steps:**
1. Logout (click "Logout" in nav)
2. Login with: `merchant` / `merchant`

**Expected Results:**
- Redirected to Merchant Dashboard
- See only 3 products (all with merchantId: M001)
- Products: Cotton T-Shirt, Running Shoes, Smart Watch
- "Add New Product" button visible
- Each product has Edit and Delete buttons

**Actions to Test:**
1. **Add New Product**
   - Click "Add New Product"
   - Form appears
   - Fill in:
     - Name: "Leather Jacket"
     - Category: "Men's Clothing"
     - Price: 4999
     - Image: 🧥
   - Click "Add Product"
   - Button shows "Adding..." then "Added!"
   - Form closes automatically
   - New product appears in list (4 products now)
   - Total Products stat updates to 4

2. **Edit Product**
   - Click "Edit" on "Cotton T-Shirt"
   - Edit form appears with pre-filled data
   - Change price to 599
   - Click "Update Product"
   - Button shows "Updating..." then "Updated!"
   - Form closes
   - Product shows new price

3. **Delete Product**
   - Click "Delete" on any product
   - Button shows "Deleting..."
   - Product disappears from list
   - Total Products stat decreases

4. **Cross-Tab Sync Test**
   - Open User Dashboard in another tab
   - In Merchant tab: Add a new product
   - Switch to User tab
   - New product should appear automatically (no refresh needed!)

---

### 🧪 Test 3: Admin Role - Platform Management

**Steps:**
1. Logout
2. Login with: `admin` / `admin`

**Expected Results:**
- Redirected to Admin Dashboard
- Statistics show:
  - Total Users: 1
  - Total Merchants: 1
  - Total Products: 8 (or current count)
- "All Users" section shows 3 users
- "All Products" section shows all products

**Actions to Test:**
1. **View Users**
   - See 3 users listed:
     - Regular User (user) - Active
     - Merchant User (merchant) - Active
     - Admin User (admin) - No disable button
   - Each has role badge (user/merchant/admin)
   - Each has status badge (Active/Disabled)

2. **Disable Merchant Account**
   - Click "Disable" on Merchant User
   - Button shows "Disabling..." then "Disabled!"
   - Status badge changes to "Disabled" (red)
   - Row becomes slightly faded

3. **Test Disabled Login**
   - Logout
   - Try to login as: `merchant` / `merchant`
   - Should see error: "Account disabled. Contact administrator."
   - Login should fail

4. **Re-enable Account**
   - Login as admin again
   - Click "Enable" on Merchant User
   - Button shows "Enabling..." then "Enabled!"
   - Status badge changes to "Active" (green)

5. **Remove Products**
   - Scroll to "All Products" section
   - See products from all merchants (M001, M002, M003)
   - Click "Remove" on any product
   - Button shows "Removing..."
   - Product disappears
   - Total Products stat decreases

6. **Verify Admin Protection**
   - Try to disable Admin User account
   - Should see: "Cannot disable admin" (no button)

---

### 🧪 Test 4: Role Guard & Security

**Test Direct URL Access:**

1. **Without Login**
   - Clear browser data or open incognito
   - Try to access: `dashboards/user.html` directly
   - Should redirect to `login.html`

2. **Wrong Role Access**
   - Login as `user`
   - Manually navigate to: `dashboards/merchant.html`
   - Should auto-redirect to `user.html`
   - Try: `dashboards/admin.html`
   - Should auto-redirect to `user.html`

3. **Correct Role Access**
   - Login as `merchant`
   - Navigate to: `dashboards/merchant.html`
   - Should stay on page (correct role)

---

### 🧪 Test 5: State Persistence

**Test localStorage Persistence:**

1. **Setup State**
   - Login as merchant
   - Add 2 new products
   - Logout

2. **Verify Persistence**
   - Login as user
   - Should see the 2 new products
   - Add 5 items to cart
   - Logout

3. **Refresh Test**
   - Close browser completely
   - Reopen and go to site
   - Login as user
   - Cart should still show 5 items
   - Products should include merchant's additions

4. **Clear State Test**
   - Open browser console (F12)
   - Type: `StateManager.clearAll()`
   - Refresh page
   - Products reset to original 8
   - Cart reset to 0

---

### 🧪 Test 6: UI Automation (No Alerts)

**Verify No Popups:**

1. **Login Errors**
   - Try invalid credentials
   - Should see inline error message (not alert)
   - Error should fade after 5 seconds

2. **Add to Cart**
   - Add product to cart
   - Should see button change text (not alert)
   - Should see inline feedback

3. **Delete Product**
   - As merchant, delete product
   - Should see button state change (not confirm)
   - Product should disappear smoothly

4. **Form Submissions**
   - Add/edit products
   - Should see button loading states
   - Should see success states
   - No alert popups

---

### 🧪 Test 7: Auto-Refresh & Sync

**Test Event-Driven Updates:**

1. **Two Browser Tabs**
   - Tab 1: Login as merchant
   - Tab 2: Login as user

2. **Add Product in Merchant Tab**
   - Tab 1: Add new product
   - Tab 2: Product should appear automatically
   - No manual refresh needed

3. **Delete Product in Admin Tab**
   - Tab 1: Login as admin
   - Tab 2: Keep user dashboard open
   - Tab 1: Remove a product
   - Tab 2: Product should disappear automatically

4. **Cart Updates**
   - Tab 1: User dashboard
   - Tab 2: User dashboard (same user)
   - Tab 1: Add to cart
   - Tab 2: Cart count should update

---

### 🧪 Test 8: Filters & Search

**Test User Dashboard Filters:**

1. **Category Filter**
   - Select each category
   - Verify correct products shown
   - Select "All Categories"
   - All products should return

2. **Price Range**
   - Min: 0, Max: 1000
   - Should show products ≤ ₹1000
   - Min: 2000, Max: 5000
   - Should show products in that range
   - Min: 10000, Max: 20000
   - Should show "No products found" message

3. **Combined Filters**
   - Category: "Men's Clothing"
   - Min: 500, Max: 2000
   - Should show only men's clothing in price range

4. **Filter Persistence**
   - Apply filters
   - Add product to cart
   - Filters should remain applied

---

### 🧪 Test 9: Edge Cases

**Test Unusual Scenarios:**

1. **Empty States**
   - Login as merchant
   - Delete all your products
   - Should see: "No products yet. Add your first product!"

2. **Special Characters**
   - Add product with name: "Test & Product <>"
   - Should display correctly (no HTML injection)

3. **Large Numbers**
   - Add product with price: 999999
   - Should format correctly: ₹9,99,999

4. **Emoji Images**
   - Add product with emoji: 🎉
   - Should display correctly

5. **Rapid Clicks**
   - Click "Add to Cart" rapidly
   - Button should disable during processing
   - Count should increment correctly

---

### 🧪 Test 10: Browser Compatibility

**Test in Different Browsers:**

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ❌ IE11 (not supported)

**Test Responsive Design:**

1. **Desktop** (1920x1080)
   - All features visible
   - Grid layout works

2. **Tablet** (768px)
   - Filters stack vertically
   - Products in 2 columns

3. **Mobile** (375px)
   - Single column layout
   - Buttons full width
   - Touch-friendly

---

## 🐛 Common Issues & Solutions

### Issue: Products not loading
**Solution**: Check browser console for errors. Ensure you're running from a web server (not file://)

### Issue: Login not working
**Solution**: Check localStorage is enabled. Try clearing browser data.

### Issue: Auto-refresh not working
**Solution**: Ensure both tabs are from same origin. Check console for event errors.

### Issue: Cart count wrong
**Solution**: Open console, run `StateManager.getCart()` to inspect. Clear with `StateManager.clearAll()`

### Issue: Role guard not working
**Solution**: Check console for errors. Verify user session exists: `StateManager.getCurrentUser()`

---

## ✅ Testing Checklist

- [ ] All 3 roles can login
- [ ] Role guard blocks unauthorized access
- [ ] User can browse and filter products
- [ ] User can add to cart
- [ ] Cart persists across refresh
- [ ] Merchant sees only their products
- [ ] Merchant can add products
- [ ] Merchant can edit products
- [ ] Merchant can delete products
- [ ] Admin can view all users
- [ ] Admin can disable accounts
- [ ] Disabled accounts cannot login
- [ ] Admin can remove any product
- [ ] Statistics update correctly
- [ ] No alert() or confirm() popups
- [ ] Button states show feedback
- [ ] Auto-refresh works across tabs
- [ ] Filters work correctly
- [ ] Empty states display properly
- [ ] Responsive on mobile

---

**Happy Testing! 🚀**
