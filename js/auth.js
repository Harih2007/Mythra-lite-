// Authentication Module
// Handles user login, logout, and session management
// Uses StateManager for centralized state

// Validate user credentials
async function validateCredentials(username, password) {
  const users = await StateManager.getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  // Check if user account is disabled
  if (user && user.disabled) {
    return { error: 'Account disabled. Contact administrator.' };
  }
  
  return user || null;
}

// Store logged-in user session
function storeUserSession(user) {
  StateManager.setCurrentUser({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    merchantId: user.merchantId || null
  });
}

// Get current logged-in user
function getCurrentUser() {
  return StateManager.getCurrentUser();
}

// Logout user
function logout() {
  StateManager.clearCurrentUser();
  window.location.href = '../login.html';
}

// Show inline error message
function showLoginError(form, message) {
  let errorMsg = form.querySelector('.error-message');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    form.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorMsg.style.opacity = '0';
    setTimeout(() => errorMsg.remove(), 300);
  }, 5000);
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  // Disable button during processing
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  
  const result = await validateCredentials(username, password);
  
  if (result && result.error) {
    // Account disabled
    showLoginError(event.target, result.error);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  } else if (result) {
    // Successful login - store session and redirect
    storeUserSession(result);
    
    // Show success state briefly
    submitBtn.textContent = 'Success!';
    
    // Redirect based on role
    setTimeout(() => {
      switch (result.role) {
        case 'user':
          window.location.href = 'dashboards/user.html';
          break;
        case 'merchant':
          window.location.href = 'dashboards/merchant.html';
          break;
        case 'admin':
          window.location.href = 'dashboards/admin.html';
          break;
        default:
          window.location.href = 'dashboards/user.html';
      }
    }, 500);
  } else {
    // Invalid credentials
    showLoginError(event.target, 'Invalid username or password');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
}

// Initialize login page
if (window.location.pathname.includes('login.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  });
}
