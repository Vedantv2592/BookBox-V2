// 📚 BOOKBOX - CORE APP LOGIC
// 🔹 Local fallback database
const MASSIVE_BOOK_DATABASE = [
  {
    isbn: "9780141439518",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "",
    genre: "Romance"
  },
  {
    isbn: "9780451524935",
    title: "1984",
    author: "George Orwell",
    cover: "",
    genre: "Dystopian"
  }
];


// 🌐 GOOGLE BOOKS API
async function searchBooksAPI(query) {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
    );

    const data = await res.json();

    if (!data.items) return [];

    return data.items.map(item => {
      const info = item.volumeInfo;

      return {
        isbn: info.industryIdentifiers?.[0]?.identifier || "N/A",
        title: info.title || "No Title",
        author: info.authors ? info.authors.join(", ") : "Unknown",
        cover: info.imageLinks?.thumbnail || "",
        description: info.description || "",
        genre: info.categories?.[0] || "General",
        pages: info.pageCount || 0,
        averageRating: info.averageRating || 0,
        totalRatings: info.ratingsCount || 0,
        language: info.language || "N/A"
      };
    });

  } catch (err) {
    console.error("API error:", err);
    return [];
  }
}


// 🔍 SEARCH SYSTEM (API + FALLBACK)
async function performAdvancedSearch(query) {
  // 1. Try real API first
  const apiResults = await searchBooksAPI(query);

  if (apiResults.length > 0) {
    return apiResults;
  }

  // 2. Fallback to local DB
  const normalized = query.toLowerCase();

  return MASSIVE_BOOK_DATABASE.filter(book =>
    book.title.toLowerCase().includes(normalized) ||
    book.author.toLowerCase().includes(normalized)
  );
}


// 🎯 DISPLAY RESULTS
function displaySearchResults(books) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  if (!books || books.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" style="width:100px;">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>⭐ ${book.averageRating || "N/A"}</p>
    `;

    container.appendChild(card);
  });
}


// 🎧 SEARCH INPUT HANDLER
const searchInput = document.getElementById("search-input");

if (searchInput) {
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value;

    if (query.length < 2) return;

    const results = await performAdvancedSearch(query);
    displaySearchResults(results);
  });
}


// 🚀 FUTURE READY (NEXT UPGRADES)
// Placeholder for recommendation system
function recommendBooks(userRatings, allBooks) {
  // will upgrade later
  return allBooks.slice(0, 10);
}
