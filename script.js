// script.js - Main quotes app logic

// ---------- Quote data ----------
const quotes = [
  // Motivational
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivational" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivational" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "motivational" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "motivational" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi", category: "motivational" },

  // Life
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "life" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "life" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "life" },
  { text: "Get busy living or get busy dying.", author: "Stephen King", category: "life" },

  // Success
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "success" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "success" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "success" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser", category: "success" },
];

// ---------- DOM elements ----------
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const categorySelect = document.getElementById("category");
const favoritesList = document.getElementById("favoritesList");
const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");

// Track the currently displayed quote
let currentQuote = null;

// ---------- Auth check on page load ----------
const currentUser = getCurrentUser();
if (!currentUser) {
  // If not logged in, redirect to login page
  window.location.href = "login.html";
} else {
  // Show username and logout button
  userInfo.textContent = "Hi, " + currentUser.username;
  logoutBtn.style.display = "inline-block";
  logoutBtn.addEventListener("click", logoutUser);
}

// ---------- Helpers ----------

// Show a small toast message
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Pick a random quote from the selected category
function getRandomQuote() {
  const category = categorySelect.value;
  let pool = quotes;
  if (category !== "all") {
    pool = quotes.filter((q) => q.category === category);
  }

  // Avoid showing the same quote twice in a row when possible
  let candidate;
  do {
    candidate = pool[Math.floor(Math.random() * pool.length)];
  } while (pool.length > 1 && currentQuote && candidate.text === currentQuote.text);

  return candidate;
}

// Display a quote on the page
function displayQuote(quote) {
  currentQuote = quote;
  quoteText.textContent = '"' + quote.text + '"';
  quoteAuthor.textContent = "— " + quote.author;
}

// ---------- Favorites (localStorage) ----------

// Build a per-user storage key so favorites are separate per account
function favoritesKey() {
  return "favorites_" + currentUser.email;
}

function getFavorites() {
  const data = localStorage.getItem(favoritesKey());
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favs) {
  localStorage.setItem(favoritesKey(), JSON.stringify(favs));
}

function renderFavorites() {
  const favs = getFavorites();
  favoritesList.innerHTML = "";

  if (favs.length === 0) {
    favoritesList.innerHTML = "<li>No favorites saved yet.</li>";
    return;
  }

  favs.forEach((fav, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = '"' + fav.text + '" — ' + fav.author;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => removeFavorite(index));

    li.appendChild(span);
    li.appendChild(removeBtn);
    favoritesList.appendChild(li);
  });
}

function addFavorite(quote) {
  const favs = getFavorites();
  // Prevent duplicates
  if (favs.some((f) => f.text === quote.text)) {
    showToast("Already in favorites!");
    return;
  }
  favs.push(quote);
  saveFavorites(favs);
  renderFavorites();
  showToast("Saved to favorites!");
}

function removeFavorite(index) {
  const favs = getFavorites();
  favs.splice(index, 1);
  saveFavorites(favs);
  renderFavorites();
  showToast("Removed from favorites.");
}

// ---------- Event listeners ----------

newQuoteBtn.addEventListener("click", () => {
  const quote = getRandomQuote();
  displayQuote(quote);
});

copyBtn.addEventListener("click", () => {
  if (!currentQuote) {
    showToast("Generate a quote first!");
    return;
  }
  const text = '"' + currentQuote.text + '" — ' + currentQuote.author;
  navigator.clipboard
    .writeText(text)
    .then(() => showToast("Quote copied to clipboard!"))
    .catch(() => showToast("Failed to copy quote."));
});

saveBtn.addEventListener("click", () => {
  if (!currentQuote) {
    showToast("Generate a quote first!");
    return;
  }
  addFavorite(currentQuote);
});

// ---------- Initial load ----------
displayQuote(getRandomQuote());
renderFavorites();
