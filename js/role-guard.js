// Role Guard Module
// Protects dashboard pages from unauthorized access
// Uses StateManager for centralized state

// Check if user is authenticated and has correct role
function checkAccess(requiredRole) {
  const currentUser = StateManager.getCurrentUser();
  
  // If no user is logged in, redirect to login
  if (!currentUser) {
    window.location.href = '../login.html';
    return false;
  }
  
  // If role doesn't match, redirect to correct dashboard
  if (currentUser.role !== requiredRole) {
    redirectToDashboard(currentUser.role);
    return false;
  }
  
  return true;
}

// Redirect to appropriate dashboard based on role
function redirectToDashboard(role) {
  switch (role) {
    case 'user':
      window.location.href = 'user.html';
      break;
    case 'merchant':
      window.location.href = 'merchant.html';
      break;
    case 'admin':
      window.location.href = 'admin.html';
      break;
    default:
      window.location.href = '../login.html';
  }
}

// Setup logout functionality
function setupLogout() {
  const logoutLinks = document.querySelectorAll('a[href*="index.html"]');
  logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      StateManager.clearCurrentUser();
      window.location.href = '../index.html';
    });
  });
}

// Hide UI elements based on role
function applyRoleBasedUI(userRole) {
  // Add role class to body for CSS-based hiding
  document.body.classList.add(`role-${userRole}`);
  
  // Hide elements with data-hide-for attribute
  document.querySelectorAll('[data-hide-for]').forEach(element => {
    const hideFor = element.getAttribute('data-hide-for').split(',');
    if (hideFor.includes(userRole)) {
      element.style.display = 'none';
    }
  });
  
  // Show elements with data-show-for attribute
  document.querySelectorAll('[data-show-for]').forEach(element => {
    const showFor = element.getAttribute('data-show-for').split(',');
    if (!showFor.includes(userRole)) {
      element.style.display = 'none';
    }
  });
}

// Initialize role guard on dashboard pages
document.addEventListener('DOMContentLoaded', function() {
  // Determine required role based on current page
  const path = window.location.pathname;
  let requiredRole = null;
  
  if (path.includes('user.html')) {
    requiredRole = 'user';
  } else if (path.includes('merchant.html')) {
    requiredRole = 'merchant';
  } else if (path.includes('admin.html')) {
    requiredRole = 'admin';
  }
  
  // Check access if on a dashboard page
  if (requiredRole) {
    if (checkAccess(requiredRole)) {
      setupLogout();
      applyRoleBasedUI(requiredRole);
    }
  }
});
