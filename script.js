let itemsData = [];

document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("items-container");
  const reviewContainer = document.getElementById("review-container");

  if (itemsContainer) {
    loadItems();
    setupEventListeners();
  }

  if (reviewContainer) {
    loadReview();
  }
});

function loadItems() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      itemsData = data;
      displayItems(itemsData);
    });
}

function displayItems(items) {
  const container = document.getElementById("items-container");
  container.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-type", item.type);

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p><strong>Genre:</strong> ${item.genre}</p>
      <a href="review.html?id=${item.id}" class="btn">Read Review</a>
    `;

    container.appendChild(card);
  });
}

function loadReview() {
  const params = new URLSearchParams(window.location.search);
  const reviewId = params.get("id");

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const item = data.find(i => i.id == reviewId);

      if (item) {
        document.getElementById("review-container").innerHTML = `
          <div class="review-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="details">
              <h2>${item.title}</h2>
              <p><strong>Genre:</strong> ${item.genre}</p>
              <p><strong>Year:</strong> ${item.year}</p>
              <p><strong>Review:</strong> ${item.review}</p>
              <div class="rating" onclick="rate(event, ${item.id})">★★★★★</div>
              ${item.trailer ? `<iframe src="${item.trailer}" frameborder="0" allowfullscreen></iframe>` : ""}
            </div>
          </div>
        `;
      }
    });
}

function setupEventListeners() {
  const searchInput = document.getElementById("search");
  const filterSelect = document.getElementById("filter");

  searchInput.addEventListener("keyup", () => {
    applyFilters();
  });

  filterSelect.addEventListener("change", () => {
    applyFilters();
  });
}

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;

  const filteredItems = itemsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(query);
    const matchesFilter = filter === "all" || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  displayItems(filteredItems);
}

function rate(event, id) {
  localStorage.setItem(`rating-${id}`, "★★★★★");
  event.target.classList.add("rated");
}
