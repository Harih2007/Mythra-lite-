# ShopHub Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  index.html  │  │  login.html  │  │ dashboards/  │         │
│  │  (Landing)   │  │  (Auth)      │  │ - user.html  │         │
│  └──────────────┘  └──────────────┘  │ - merchant   │         │
│                                       │ - admin      │         │
│                                       └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   auth.js    │  │ products.js  │  │role-guard.js │         │
│  │              │  │              │  │              │         │
│  │ • Login      │  │ • CRUD ops   │  │ • Access     │         │
│  │ • Logout     │  │ • Filters    │  │   control    │         │
│  │ • Session    │  │ • Cart       │  │ • UI hiding  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                         STATE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌──────────────────────┐                     │
│                    │   state-manager.js   │                     │
│                    │                      │                     │
│                    │  • Centralized State │                     │
│                    │  • Event Emitter     │                     │
│                    │  • Persistence       │                     │
│                    └──────────────────────┘                     │
│                              ↕                                   │
│         ┌────────────────────┼────────────────────┐            │
│         ↓                    ↓                    ↓            │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐         │
│  │ Products │        │  Users   │        │   Cart   │         │
│  │  State   │        │  State   │        │  State   │         │
│  └──────────┘        └──────────┘        └──────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        PERSISTENCE LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      Browser localStorage                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  'products'  │  │   'users'    │  │    'cart'    │         │
│  │  JSON Array  │  │  JSON Array  │  │ JSON Object  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │'loggedInUser'│  │'appInitialized'                           │
│  │ JSON Object  │  │   Boolean    │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                         DATA SOURCE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│              Initial Data (Loaded Once)                          │
│                                                                  │
│         ┌──────────────┐      ┌──────────────┐                 │
│         │data/users.json│      │data/products │                 │
│         │              │      │    .json     │                 │
│         │ • Credentials│      │ • Initial    │                 │
│         │ • Roles      │      │   Products   │                 │
│         │ • Status     │      │ • Categories │                 │
│         └──────────────┘      └──────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Event Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         EVENT BUS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    window.dispatchEvent()                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ products     │  │   users      │  │    cart      │         │
│  │  Updated     │  │  Updated     │  │  Updated     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                 ↓                  ↓                   │
│         └─────────────────┴──────────────────┘                  │
│                           ↓                                      │
│              window.addEventListener()                           │
│                           ↓                                      │
│         ┌─────────────────┴──────────────────┐                  │
│         ↓                 ↓                  ↓                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ User         │  │ Merchant     │  │ Admin        │         │
│  │ Dashboard    │  │ Dashboard    │  │ Dashboard    │         │
│  │ (Listener)   │  │ (Listener)   │  │ (Listener)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                 ↓                  ↓                   │
│    Auto-Refresh      Auto-Refresh       Auto-Refresh            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  User    │
│  Enters  │
│  Creds   │
└────┬─────┘
     ↓
┌────────────────────────────────────────┐
│         auth.js                        │
│  validateCredentials()                 │
│    ↓                                   │
│  Check against StateManager.getUsers() │
│    ↓                                   │
│  Is account disabled?                  │
│    ├─ Yes → Show error                │
│    └─ No → Continue                    │
│         ↓                              │
│  storeUserSession()                    │
│    ↓                                   │
│  StateManager.setCurrentUser()         │
└────┬───────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  Redirect based on role:               │
│    • user → user.html                  │
│    • merchant → merchant.html          │
│    • admin → admin.html                │
└────┬───────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│         role-guard.js                  │
│  checkAccess(requiredRole)             │
│    ↓                                   │
│  Get current user from StateManager    │
│    ↓                                   │
│  Does role match page?                 │
│    ├─ No → Redirect to correct page   │
│    └─ Yes → Allow access               │
│         ↓                              │
│  applyRoleBasedUI()                    │
│    • Add CSS class to body             │
│    • Hide/show elements                │
└────────────────────────────────────────┘
```

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                         ROLE MATRIX                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Feature              │  User  │ Merchant │  Admin              │
│  ────────────────────────────────────────────────────────────   │
│  Browse Products      │   ✓    │    ✓     │    ✓                │
│  Filter Products      │   ✓    │    ✓     │    ✓                │
│  Add to Cart          │   ✓    │    ✓     │    ✓                │
│  View Own Products    │   ✗    │    ✓     │    ✗                │
│  Add Products         │   ✗    │    ✓     │    ✗                │
│  Edit Own Products    │   ✗    │    ✓     │    ✗                │
│  Delete Own Products  │   ✗    │    ✓     │    ✗                │
│  View All Users       │   ✗    │    ✗     │    ✓                │
│  Disable Accounts     │   ✗    │    ✗     │    ✓                │
│  View All Products    │   ✗    │    ✗     │    ✓                │
│  Delete Any Product   │   ✗    │    ✗     │    ✓                │
│  View Statistics      │   ✗    │    ✓     │    ✓                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Add Product (Merchant)

```
┌──────────────────────────────────────────────────────────────┐
│  1. Merchant fills form and clicks "Add Product"             │
└────┬─────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  2. handleAddProduct(event)                                │
│     • Disable button                                       │
│     • Show "Adding..." text                                │
│     • Collect form data                                    │
└────┬───────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  3. products.js → addProduct(newProduct)                   │
│     • Get current products from StateManager               │
│     • Generate new ID                                      │
│     • Add to array                                         │
└────┬───────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  4. StateManager.setProducts(updatedProducts)              │
│     • Save to localStorage                                 │
│     • Emit 'productsUpdated' event                         │
└────┬───────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  5. Event Listeners Triggered                              │
│     ┌──────────────────────────────────────────┐          │
│     │ Merchant Dashboard                       │          │
│     │  • refreshProducts()                     │          │
│     │  • Display updated list                  │          │
│     │  • Update stats                          │          │
│     └──────────────────────────────────────────┘          │
│     ┌──────────────────────────────────────────┐          │
│     │ User Dashboard (if open)                 │          │
│     │  • getAllProducts()                      │          │
│     │  • Re-apply filters                      │          │
│     │  • Display with new product              │          │
│     └──────────────────────────────────────────┘          │
│     ┌──────────────────────────────────────────┐          │
│     │ Admin Dashboard (if open)                │          │
│     │  • refreshProducts()                     │          │
│     │  • Display all products                  │          │
│     │  • Update total count                    │          │
│     └──────────────────────────────────────────┘          │
└────────────────────────────────────────────────────────────┘
```

## State Synchronization

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-TAB SYNCHRONIZATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tab 1: Merchant Dashboard          Tab 2: User Dashboard       │
│  ┌──────────────────────┐          ┌──────────────────────┐    │
│  │ Add Product          │          │ Browsing Products    │    │
│  │   ↓                  │          │                      │    │
│  │ StateManager.set()   │          │                      │    │
│  │   ↓                  │          │                      │    │
│  │ localStorage.set()   │──────────→ (Same storage)       │    │
│  │   ↓                  │          │   ↓                  │    │
│  │ dispatchEvent()      │──────────→ addEventListener()   │    │
│  │                      │          │   ↓                  │    │
│  │ Auto-refresh         │          │ Auto-refresh         │    │
│  │ ✓ Product added      │          │ ✓ New product shown  │    │
│  └──────────────────────┘          └──────────────────────┘    │
│                                                                  │
│  Result: Both tabs stay in sync without manual refresh          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## UI Automation Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                    NO ALERTS/CONFIRMS PATTERN                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Traditional Approach (❌ Not Used):                             │
│  ┌──────────────────────────────────────────────────┐          │
│  │ User Action → alert("Success!") → OK Button      │          │
│  │ User Action → confirm("Delete?") → Yes/No        │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  Our Approach (✓ Used):                                          │
│  ┌──────────────────────────────────────────────────┐          │
│  │ User Action                                      │          │
│  │   ↓                                              │          │
│  │ Button State: "Processing..."                    │          │
│  │   ↓                                              │          │
│  │ Perform Action                                   │          │
│  │   ↓                                              │          │
│  │ Button State: "Success!"                         │          │
│  │   ↓                                              │          │
│  │ Auto-refresh UI (via events)                     │          │
│  │   ↓                                              │          │
│  │ Reset Button (after delay)                       │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  Benefits:                                                       │
│  • Non-blocking                                                  │
│  • Better UX                                                     │
│  • Feels automated                                               │
│  • No user interruption                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Module Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEPENDENCY GRAPH                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    state-manager.js                              │
│                           ↑                                      │
│              ┌────────────┼────────────┐                        │
│              ↓            ↓            ↓                        │
│         auth.js    products.js   role-guard.js                  │
│              ↑            ↑            ↑                        │
│              └────────────┼────────────┘                        │
│                           ↓                                      │
│                    Dashboard Pages                               │
│                  (user/merchant/admin)                           │
│                                                                  │
│  Load Order:                                                     │
│  1. state-manager.js (first - provides foundation)              │
│  2. role-guard.js (second - protects page)                      │
│  3. products.js (third - business logic)                        │
│  4. auth.js (for login page only)                               │
│  5. Inline scripts (last - page-specific logic)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Security Model (Client-Side Simulation)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Authentication                                         │
│  ┌────────────────────────────────────────────────┐            │
│  │ • Credentials validated against users.json     │            │
│  │ • Session stored in localStorage               │            │
│  │ • Disabled accounts blocked                    │            │
│  └────────────────────────────────────────────────┘            │
│                                                                  │
│  Layer 2: Authorization (Role Guard)                             │
│  ┌────────────────────────────────────────────────┐            │
│  │ • Every dashboard checks role on load          │            │
│  │ • Wrong role → auto-redirect                   │            │
│  │ • No session → redirect to login               │            │
│  └────────────────────────────────────────────────┘            │
│                                                                  │
│  Layer 3: Data Filtering                                         │
│  ┌────────────────────────────────────────────────┐            │
│  │ • Merchants see only their products            │            │
│  │ • Users can't access edit functions            │            │
│  │ • Admins can't disable other admins            │            │
│  └────────────────────────────────────────────────┘            │
│                                                                  │
│  Layer 4: UI Hiding                                              │
│  ┌────────────────────────────────────────────────┐            │
│  │ • Role-based CSS classes                       │            │
│  │ • Conditional rendering                        │            │
│  │ • Data attributes for visibility               │            │
│  └────────────────────────────────────────────────┘            │
│                                                                  │
│  ⚠️  IMPORTANT: This is CLIENT-SIDE ONLY                        │
│      Not secure for production use!                             │
│      Anyone can edit localStorage or bypass checks              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION STRATEGIES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Lazy Loading                                                 │
│     • JSON files loaded only once                               │
│     • Subsequent reads from localStorage                        │
│                                                                  │
│  2. Event-Driven Updates                                         │
│     • Only affected components refresh                          │
│     • No polling or intervals                                   │
│                                                                  │
│  3. Minimal DOM Manipulation                                     │
│     • Batch updates                                             │
│     • innerHTML for bulk changes                                │
│                                                                  │
│  4. CSS-Based Hiding                                             │
│     • display: none via CSS classes                             │
│     • Faster than JS manipulation                               │
│                                                                  │
│  5. Debouncing (Not Implemented)                                 │
│     • Could add for filter inputs                               │
│     • Would reduce unnecessary renders                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Architectural Decisions

### Why Centralized State?
- Single source of truth
- Easier debugging
- Consistent data across views
- Event-driven updates

### Why localStorage?
- Persistence without backend
- Simple API
- Synchronous access
- Built-in serialization

### Why Custom Events?
- Loose coupling between modules
- Easy to add new listeners
- No direct dependencies
- Scalable pattern

### Why Role Guard?
- Security layer (simulated)
- Consistent access control
- Automatic redirects
- Clean separation of concerns

### Why No Framework?
- Learning fundamentals
- Understanding patterns
- No build step needed
- Lightweight and fast

---

This architecture demonstrates real-world patterns used in production applications, adapted for a client-side only implementation.
