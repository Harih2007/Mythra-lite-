# Myntra Lite - Advanced Frontend Fashion Platform

A multi-role fashion product management system built with vanilla HTML, CSS, and JavaScript. This project demonstrates advanced frontend architecture with centralized state management, role-based access control, and automated UI updates.

## 🎯 Project Overview

Myntra Lite is a simulated fashion e-commerce platform where:
- **Users** browse and filter products, add items to cart, view cart and checkout
- **Merchants** manage their own product listings (fashion brands)
- **Admins** oversee the entire platform, manage users and products

## 🏗️ Architecture

### State Management
The application uses a centralized state management system (`StateManager`) that:
- Stores all data in `localStorage` for persistence
- Provides a single source of truth for application state
- Emits custom events when state changes
- Automatically syncs updates across all dashboard views

### File Structure
```
├── index.html              # Landing page
├── login.html              # Authentication page
├── dashboards/
│   ├── user.html          # User dashboard (browse products)
│   ├── merchant.html      # Merchant dashboard (manage products)
│   └── admin.html         # Admin dashboard (platform management)
├── js/
│   ├── state-manager.js   # Centralized state management
│   ├── auth.js            # Authentication logic
│   ├── role-guard.js      # Access control & role-based UI
│   ├── products.js        # Product CRUD operations
│   └── main.js            # Shared utilities
├── css/
│   └── main.css           # All styles
└── data/
    ├── users.json         # User credentials & roles
    └── products.json      # Initial product data
```

## 🔐 Authentication System

### How It Works
1. User enters credentials on `login.html`
2. `auth.js` validates against `data/users.json`
3. If valid, user session is stored in `localStorage` via `StateManager`
4. User is redirected to appropriate dashboard based on role
5. `role-guard.js` protects all dashboard pages from unauthorized access

### Default Credentials
| Username | Password | Role     |
|----------|----------|----------|
| user     | user     | user     |
| merchant | merchant | merchant |
| admin    | admin    | admin    |

### Account Status
- Admins can disable user/merchant accounts
- Disabled accounts cannot log in
- Status is stored in `localStorage` and persists across sessions

## 🎭 Role-Based Logic

### Role Guard System
Each dashboard page is protected by `role-guard.js`:
- Checks if user is authenticated
- Validates user has correct role for the page
- Auto-redirects to appropriate dashboard if role mismatch
- Applies role-based UI hiding

### Role Permissions

**User Role:**
- Browse all products
- Filter by category and price range
- Add products to cart
- Cannot see edit/delete buttons
- Cannot access merchant or admin features

**Merchant Role:**
- View only their own products (filtered by `merchantId`)
- Add new products
- Edit their own products
- Delete their own products
- Cannot see other merchants' products
- Cannot access admin features

**Admin Role:**
- View all users with status badges
- Enable/disable user and merchant accounts
- View all products from all merchants
- Remove any product
- View platform statistics
- Cannot disable other admin accounts

### UI Rendering
Role-based UI is enforced through:
1. **JavaScript filtering** - Data is filtered before display
2. **CSS classes** - Body gets `role-{rolename}` class
3. **Data attributes** - Elements with `data-hide-for` or `data-show-for`
4. **Conditional rendering** - Buttons/sections rendered based on role

## 📊 Data Handling

### State Flow
```
JSON Files (initial data)
    ↓
StateManager.init()
    ↓
localStorage (persistent state)
    ↓
Dashboard Components
    ↓
User Actions (CRUD, Cart Operations)
    ↓
StateManager.set*() → Triggers Events
    ↓
All Dashboards Auto-Update
```

### Data Persistence
- **First Load**: Data loaded from `data/*.json` files
- **Subsequent Loads**: Data loaded from `localStorage`
- **Updates**: All changes saved to `localStorage` immediately
- **Sync**: Custom events ensure all open tabs/dashboards stay in sync

### Product Management
- Products have unique IDs (P001, P002, etc.)
- Each product linked to a merchant via `merchantId`
- New products get auto-generated sequential IDs
- Deleting products removes them from state permanently (until page refresh clears localStorage)

### Cart System
- Cart stored as object: `{ productId: count }`
- Persists across page navigation
- Updates trigger `cartUpdated` event
- Count displayed in real-time
- Full cart view with quantity controls
- Checkout simulation with success message

## 🤖 UI Automation Principles

### No Popups or Alerts
Instead of `alert()` or `confirm()`, the system uses:
- **Inline messages** - Errors shown within forms
- **Button state changes** - "Adding...", "Added!", "Deleting..."
- **Status badges** - Active/Disabled, role indicators
- **Disabled buttons** - Prevent duplicate actions
- **Auto-hide messages** - Errors fade after 5 seconds

### Auto-Refresh
- Product lists update automatically when data changes
- No manual refresh needed
- Works across multiple open tabs
- Powered by custom events (`productsUpdated`, `usersUpdated`, `cartUpdated`)

### Visual Feedback
- Buttons show loading states during operations
- Success states briefly displayed before reset
- Smooth animations for state transitions
- Empty states when no data available

## 🔧 Code Quality

### Modular Design
- Each JS file has single responsibility
- Functions are small and focused
- No duplicated logic across files
- Clear separation of concerns

### Comments
- Module-level comments explain purpose
- Function comments describe behavior
- Complex logic has inline explanations
- State flow documented

### Naming Conventions
- Functions: `camelCase` with verb prefix (`getProducts`, `handleLogin`)
- Variables: `camelCase` descriptive names
- Constants: `UPPER_SNAKE_CASE` (if any)
- CSS classes: `kebab-case` with BEM-like structure

## ⚠️ Known Limitations

### Security
- **Client-side only** - All authentication is simulated
- **No encryption** - Passwords stored in plain text
- **No validation** - Server-side validation doesn't exist
- **localStorage exposed** - Anyone can edit browser storage
- **Not production-ready** - This is a learning/demo project

### Data Persistence
- Data resets when `localStorage` is cleared
- No database - changes lost on cache clear
- No backup or recovery mechanism
- Initial data from JSON files only loaded once

### Functionality
- No actual payment processing
- Cart doesn't convert to orders
- No user registration (fixed credentials)
- No email notifications
- No image uploads (emoji placeholders only)
- No search functionality
- No pagination (all products shown)

### Browser Support
- Requires modern browser with ES6+ support
- Requires localStorage enabled
- No IE11 support
- Assumes JavaScript enabled

### Scalability
- Not optimized for large datasets
- No lazy loading
- No virtual scrolling
- All data loaded at once

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Running the Project

**Option 1: Simple File Open**
```
Open index.html in your browser
```

**Option 2: Local Server (Recommended)**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit: http://localhost:8000
```

### Testing Workflow

1. **Login as User**
   - Username: `user`, Password: `user`
   - Browse products, apply filters
   - Add items to cart
   - Note cart count persists

2. **Login as Merchant**
   - Username: `merchant`, Password: `merchant`
   - See only products with merchantId: M001
   - Add a new product
   - Edit existing product
   - Delete a product
   - Notice user dashboard updates automatically

3. **Login as Admin**
   - Username: `admin`, Password: `admin`
   - View all users and merchants
   - Disable a merchant account
   - Try logging in as that merchant (should fail)
   - Re-enable the account
   - Remove products from any merchant
   - View updated statistics

## 🎓 Learning Objectives

This project demonstrates:
- ✅ Centralized state management without frameworks
- ✅ Event-driven architecture
- ✅ Role-based access control
- ✅ Separation of concerns
- ✅ Modular JavaScript design
- ✅ Automated UI updates
- ✅ Client-side routing simulation
- ✅ localStorage as database
- ✅ Responsive design
- ✅ User experience patterns (loading states, feedback)

## 📝 Future Enhancements (Not Implemented)

- Search and advanced filtering
- Product categories management
- Order processing workflow
- User profile management
- Merchant analytics dashboard
- Product image uploads
- Pagination for large datasets
- Real-time notifications
- Export data functionality
- Dark mode theme

## 📄 License

This is an educational project. Feel free to use and modify for learning purposes.

---

**Note**: This project is designed for learning frontend architecture patterns. It is NOT suitable for production use without significant security enhancements, backend integration, and proper authentication systems.
