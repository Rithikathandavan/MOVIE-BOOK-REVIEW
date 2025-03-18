document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("items-container")) {
      loadItems();
    }
    if (document.getElementById("review-container")) {
      loadReview();
    }
  });
  
  // Load items from JSON
  function loadItems() {
    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById("items-container");
        container.innerHTML = "";
        data.forEach(item => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p><strong>Genre:</strong> ${item.genre}</p>
            <a href="review.html?id=${item.id}" class="btn">Read Review</a>
          `;
          container.appendChild(card);
        });
      });
  }
  
  // Load review details
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
                <div class="rating" onclick="rate(event, ${item.id})">
                  ★★★★★
                </div>
                ${item.trailer ? `<iframe width="560" height="315" src="${item.trailer}" frameborder="0" allowfullscreen></iframe>` : ""}
              </div>
            </div>
          `;
        }
      });
  }
  
  // Search function
  function searchItems() {
    const query = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "block" : "none";
    });
  }
  
  // Filter function
  function filterItems() {
    const filter = document.getElementById("filter").value;
    document.querySelectorAll(".card").forEach(card => {
      const type = card.querySelector("p").textContent.includes("Book") ? "book" : "movie";
      card.style.display = (filter === "all" || filter === type) ? "block" : "none";
    });
  }
  
  // Star rating storage
  function rate(event, id) {
    localStorage.setItem(`rating-${id}`, "★★★★★");
    event.target.classList.add("rated");
  }
  