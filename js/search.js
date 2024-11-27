const API_KEY = "427f323096cbf6058c47782c87e83069";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const resultsContainer = document.getElementById('results-container');

// URL'den query parametresini al
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

// Arama sonuçlarını getir
async function fetchShows(query) {
    const type = "tv";
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayShows(data.results);
        } else {
            resultsContainer.innerHTML = "<p>No results found.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsContainer.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
}

// Sonuçları göster
function displayShows(shows) {
    resultsContainer.innerHTML = ""; 
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

        resultsContainer.appendChild(card);
    });
}


// Arama butonuna tıklanınca yeni arama yap
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('query').value.trim();
    if (query) {
        window.location.href = `search.html?query=${query}`;
    } else {
        alert("Please enter a TV show name!");
    }
});

// Sayfa yüklendiğinde arama sonuçlarını getir
if (query) {
    document.getElementById('query').value = query; // Arama kutusunu doldur
    fetchShows(query);
}
