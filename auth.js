// auth.js - Simple authentication using localStorage
// NOTE: This is a beginner-friendly approach. Do NOT use this for real-world apps.

// Get all registered users (returns an array)
function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

// Save users array back to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Register a new user
function registerUser(username, email, password) {
  const users = getUsers();

  // Check if email already exists
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return { success: false, message: "An account with this email already exists." };
  }

  // Create and save new user
  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(users);

  // Auto-login after signup
  localStorage.setItem("currentUser", JSON.stringify({ username, email }));
  return { success: true };
}

// Login an existing user
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: "Invalid email or password." };
  }

  // Save current session
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ username: user.username, email: user.email })
  );
  return { success: true };
}

// Logout the current user
function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Get the currently logged-in user (or null)
function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}
