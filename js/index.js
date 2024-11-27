const API_KEY = "427f323096cbf6058c47782c87e83069";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const trendingContainer = document.getElementById('trending-container');

// Trend dizileri çek
async function fetchTrendingShows() {
    const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const top10Shows = data.results.slice(0, 7); // İlk 10 trend
            displayShows(top10Shows);
        } else {
            trendingContainer.innerHTML = "<p>No trending shows found.</p>";
        }
    } catch (error) {
        console.error("Error fetching trending shows:", error);
        trendingContainer.innerHTML = "<p>Something went wrong while loading trending shows.</p>";
    }
}

// Trend dizileri göster
function displayShows(shows) {
    trendingContainer.innerHTML = "";
    shows.forEach((show) => {
        const { id, name, poster_path } = show;

        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("p");
        title.classList.add("cardBaslik");
        title.textContent = name;

        const link = document.createElement("a");
        link.href = `details.html?id=${id}`;

        const image = document.createElement("img");
        image.src = poster_path
            ? `${BASE_IMAGE_URL}${poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image";
        image.alt = name;

        link.appendChild(image);
        card.appendChild(link);
        card.appendChild(title);

        trendingContainer.appendChild(card);
    });
}


// Sayfa yüklendiğinde trend dizileri getir
document.addEventListener("DOMContentLoaded", fetchTrendingShows);

// Arama butonuna tıklanınca arama sayfasına yönlendir
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('query').value.trim();
    if (query) {
        // Arama sayfasına yönlendirme
        window.location.href = `search.html?query=${query}`;
    } else {
        alert("Please enter a TV show name!");
    }
});
