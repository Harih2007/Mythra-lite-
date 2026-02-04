# Myntra Lite - Modern Fashion E-commerce Platform

A feature-rich, multi-role fashion product management system built with vanilla HTML, CSS, and JavaScript. This project showcases advanced frontend architecture with modern UI design, centralized state management, role-based access control, and real-time search capabilities.

## 🎯 Project Overview

Myntra Lite is a fully-functional fashion e-commerce platform where:
- **Users** browse products with real-time search, filter by category/price, manage cart, and place orders
- **Merchants** manage their product inventory with modern dashboard and analytics
- **Admins** oversee the entire platform with comprehensive analytics and user management

## ✨ Key Features

### 🎨 Modern UI Design
- Clean, professional interface with card-based layouts
- Gradient color schemes and modern typography
- Responsive design that works on all devices
- Symmetrical layouts for better visual balance
- No distracting animations - focus on functionality

### 🔍 Smart Search & Filtering
- **Real-time search** - Results update as you type
- Search across product names, categories, and descriptions
- Combined filtering by category, price range, and search query
- Clear button to reset all filters instantly

### 🛒 Complete Shopping Experience
- Browse 40+ products with real images from Unsplash
- Add products to cart with quantity management
- Persistent cart across sessions
- Full checkout flow with order confirmation
- Order history tracking for users

### 📊 Advanced Admin Dashboard
- **Tab-based navigation** for better organization
  - Overview: Quick stats and system management
  - Users: Manage all user accounts
  - Products: View and manage all products
  - Orders: Track all customer orders
  - **Analytics**: Comprehensive platform insights
- Modern card-based user interface
- Enable/disable user accounts
- Platform-wide statistics and metrics

### 📈 Analytics Dashboard (Admin)
- **Category Distribution** - Product breakdown by category
- **Merchant Performance** - Products per merchant
- **Price Range Analysis** - Min, max, average prices and distribution
- **Order Trends** - Revenue, average order value, items sold

### 🏪 Enhanced Merchant Dashboard
- Modern product management interface
- Inventory value tracking
- Category count statistics
- Large product cards with images
- Streamlined add/edit forms with better UX

### 🎭 3-Way Login System
- Visual role selection with icons
- Auto-fill credentials for quick testing
- One-click login for each role
- Smooth authentication flow

## 🏗️ Architecture

### State Management
The application uses a centralized state management system (`StateManager`) that:
- Stores all data in `localStorage` for persistence
- Provides a single source of truth for application state
- Emits custom events when state changes
- Automatically syncs updates across all dashboard views

### File Structure
```
├── index.html              # Modern landing page with features showcase
├── login.html              # 3-way authentication page
├── dashboards/
│   ├── user.html          # User dashboard with search & cart
│   ├── merchant.html      # Modern merchant dashboard
│   ├── admin.html         # Admin dashboard with analytics
│   └── product-detail.html # Product detail view
├── js/
│   ├── state-manager.js   # Centralized state management
│   ├── auth.js            # Authentication logic
│   ├── role-guard.js      # Access control & role-based UI
│   ├── products.js        # Product CRUD operations
│   └── main.js            # Shared utilities
├── css/
│   ├── main.css           # Landing & login page styles
│   └── dashboard.css      # Dashboard-specific styles
└── data/
    ├── users.json         # User credentials & roles
    └── products.json      # 41 curated products with real images
```

## 🔐 Authentication System

### Default Credentials
| Username | Password | Role     | Access                          |
|----------|----------|----------|---------------------------------|
| user     | user     | user     | Browse, cart, orders            |
| merchant | merchant | merchant | Product management              |
| admin    | admin    | admin    | Full platform control           |

### Features
- Visual role selection with icons
- Auto-fill credentials for quick access
- Session persistence across page navigation
- Role-based redirects after login
- Account enable/disable functionality

## 🎭 Role-Based Features

### User Dashboard
- ✅ Real-time product search
- ✅ Filter by category and price range
- ✅ Add to cart with quantity control
- ✅ View cart with order summary
- ✅ Checkout and place orders
- ✅ View order history
- ✅ Product detail pages

### Merchant Dashboard
- ✅ Modern card-based product grid
- ✅ Add new products with images
- ✅ Edit existing products
- ✅ Delete products
- ✅ Inventory statistics
- ✅ Category tracking
- ✅ Total inventory value

### Admin Dashboard
- ✅ **5 comprehensive tabs**
- ✅ Platform statistics overview
- ✅ User management with enable/disable
- ✅ Product management across all merchants
- ✅ Order tracking and revenue monitoring
- ✅ **Analytics dashboard** with insights
- ✅ System reset functionality

## 📊 Analytics Features (Admin Only)

### Category Distribution
- Product count per category
- Percentage breakdown
- Sorted by popularity

### Merchant Performance
- Products per merchant
- Performance comparison
- Inventory distribution

### Price Range Analysis
- Minimum, maximum, average prices
- Price range distribution
- Product count per price bracket

### Order Trends
- Total orders and revenue
- Average order value
- Average items per order
- Total items sold

## 🔍 Search Functionality

### Features
- **Real-time search** - Updates as you type
- **Multi-field search** - Name, category, description
- **Case-insensitive** - Finds matches regardless of case
- **Combined filtering** - Works with category and price filters
- **Clear button** - Reset all filters instantly

### How It Works
```javascript
// Search across multiple fields
product.name.includes(query) ||
product.category.includes(query) ||
product.description.includes(query)
```

## 🛒 Shopping Cart & Orders

### Cart Features
- Persistent cart in localStorage
- Quantity increment/decrement
- Remove individual items
- Real-time total calculation
- Clear entire cart option

### Order System
- Place orders with one click
- Order confirmation message
- Order history with details
- Order status tracking
- Revenue calculation for admin

## 🎨 UI/UX Highlights

### Modern Design Elements
- Card-based layouts
- Gradient backgrounds
- Icon-enhanced statistics
- Tab navigation for organization
- Symmetrical grid layouts
- Professional color scheme

### User Experience
- No page reloads needed
- Instant feedback on actions
- Loading states on buttons
- Empty state messages
- Inline error messages
- Smooth transitions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended)

### Running the Project

**Option 1: Python Server**
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

**Option 2: Node.js Server**
```bash
npx http-server
# Visit: http://localhost:8080
```

**Option 3: Direct File Open**
```
Simply open index.html in your browser
```

## 🧪 Testing Guide

### 1. User Experience
```
1. Open http://localhost:8000
2. Click "Start Shopping" or "Login"
3. Select "User" role (auto-fills credentials)
4. Click "Login"
5. Use search bar to find products
6. Apply filters (category, price)
7. Add products to cart
8. View cart and adjust quantities
9. Proceed to checkout
10. View your orders
```

### 2. Merchant Experience
```
1. Login as "Merchant"
2. View your product inventory
3. Check inventory statistics
4. Add a new product
5. Edit existing product
6. Delete a product
7. Notice real-time updates
```

### 3. Admin Experience
```
1. Login as "Admin"
2. View platform statistics
3. Navigate through tabs:
   - Overview: System management
   - Users: Enable/disable accounts
   - Products: Manage all products
   - Orders: Track revenue
   - Analytics: View insights
4. Explore analytics data
5. Disable a user account
6. Test that disabled user cannot login
```

## 📱 Responsive Design

- Mobile-friendly layouts
- Adaptive grid systems
- Touch-friendly buttons
- Optimized for all screen sizes
- Tablet and desktop views

## ⚡ Performance

- Lightweight vanilla JavaScript
- No framework overhead
- Fast page loads
- Efficient DOM updates
- Optimized images from CDN

## 🎓 Learning Objectives

This project demonstrates:
- ✅ Modern UI/UX design principles
- ✅ Centralized state management
- ✅ Real-time search implementation
- ✅ Role-based access control
- ✅ Tab-based navigation
- ✅ Analytics dashboard creation
- ✅ Event-driven architecture
- ✅ Responsive design patterns
- ✅ localStorage as database
- ✅ Modular JavaScript architecture

## 🔧 Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **Vanilla JavaScript** - No frameworks
- **LocalStorage** - Client-side data persistence
- **Unsplash API** - Product images

## ⚠️ Known Limitations

### Security
- Client-side authentication only
- No encryption or hashing
- Not production-ready
- Educational purposes only

### Data
- localStorage-based (clears on cache clear)
- No backend database
- No data backup
- Limited to browser storage capacity

### Features Not Included
- Payment processing
- User registration
- Email notifications
- Image uploads
- Real-time notifications
- Multi-language support

## 🌟 Recent Updates

### Latest Features
- ✅ Modern admin dashboard with analytics
- ✅ Enhanced merchant dashboard UI
- ✅ Real-time search functionality
- ✅ Tab-based navigation for admin
- ✅ Comprehensive analytics dashboard
- ✅ 3-way login system
- ✅ Improved visual design
- ✅ Better responsive layouts

## 📄 License

This is an educational project. Feel free to use and modify for learning purposes.

---

**Built with ❤️ using Vanilla JavaScript - No frameworks, just pure frontend skills!**

