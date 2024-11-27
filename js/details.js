const API_KEY = "427f323096cbf6058c47782c87e83069";
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// Get series ID from URL
const urlParams = new URLSearchParams(window.location.search);
const seriesId = urlParams.get("id");

document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("query").value.trim();
    if (query) {
        // Redirect to index.html with the query as a parameter
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    } else {
        alert("Please enter a TV show name!");
    }
});

// Fetch series details
async function fetchSeriesDetails(id) {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`;

    try {
        const response = await fetch(url);
        const series = await response.json();
        console.log(series);

        displaySeriesDetails(series);
        fetchSeriesCast(id);
    } catch (error) {
        console.error("Error fetching series details:", error);
    }
}

// Fetch and display episodes of a selected season
async function fetchSeasonEpisodes(seriesId, seasonNumber) {
    const url = `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`;

    try {
        const response = await fetch(url);
        const season = await response.json();

        displaySeasonEpisodes(season.episodes, seasonNumber);
    } catch (error) {
        console.error("Error fetching season episodes:", error);
    }
}

// Fetch and display series cast
async function fetchSeriesCast(seriesId) {
    const url = `${BASE_URL}/tv/${seriesId}/credits?api_key=${API_KEY}&language=en-US`;

    try {
        const response = await fetch(url);
        const credits = await response.json();

        displaySeriesCast(credits.cast);
    } catch (error) {
        console.error("Error fetching series cast:", error);
    }
}

// Display series details
function displaySeriesDetails(series) {
    const { name, overview, poster_path, seasons, tagline, genres } = series;

    // Set the series title and overview
    document.getElementById("seriesTitle").textContent = name;
    document.getElementById("overviewText").textContent = overview;

    // Set the series image (poster)
    const seriesImage = document.getElementById("seriesImage");
    seriesImage.src = poster_path
        ? `${BASE_IMAGE_URL}${poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Image";
    seriesImage.alt = name;

    // Set the tagline
    const taglineElement = document.getElementById("tagline");
    taglineElement.textContent = tagline ? `"${tagline}"` : "No tagline available";

    // Set the genres
    const genresElement = document.getElementById("genres");
    if (genres && genres.length > 0) {
        genresElement.textContent = genres.map(genre => genre.name).join(", ");
    } else {
        genresElement.textContent = "Genres: Not available";
    }
    
    // Populate seasons dropdown
    const dropdown = document.getElementById("seasonsDropdown");
    seasons.forEach((season) => {
        const option = document.createElement("option");
        option.value = season.season_number;
        option.textContent = `${season.name} (${season.episode_count} episodes)`;
    
        dropdown.appendChild(option);
    });

    // Add event listener for season selection
    dropdown.addEventListener("change", (event) => {
        const selectedSeason = event.target.value;
        dropdown.style.backgroundImage = "none";
        if (selectedSeason) {
            fetchSeasonEpisodes(seriesId, selectedSeason);
        }
    });
}

// Display episodes of a season
function displaySeasonEpisodes(episodes) {
    const container = document.getElementById("episodesContainer");
    container.innerHTML = "";

    episodes.forEach((episode) => {
        const { name, overview, still_path, episode_number } = episode;

        const episodeDiv = document.createElement("div");
        episodeDiv.classList.add("episode");

        const img = document.createElement("img");
        img.src = still_path
            ? `${BASE_IMAGE_URL}${still_path}`
            : "https://via.placeholder.com/300x450?text=No+Image";
        img.alt = name;

        const title = document.createElement("h4");
        title.textContent = `Episode ${String(episode_number)} - ${name}`;

        const description = document.createElement("p");
        description.textContent = overview;

        const episodeInfo = document.createElement("div");
        episodeInfo.classList.add("episodeInfo");

        episodeDiv.appendChild(title);
        episodeDiv.appendChild(episodeInfo);
        episodeInfo.appendChild(img);
        episodeInfo.appendChild(description);
        container.appendChild(episodeDiv);
    });
}

// Display series cast
function displaySeriesCast(cast) {
    const castContainer = document.getElementById("castContainer");
    castContainer.innerHTML = "";

    cast.forEach((member) => {
        const { profile_path, name, character } = member;

        const castDiv = document.createElement("div");
        castDiv.classList.add("cast-member");

        const img = document.createElement("img");
        img.src = profile_path
            ? `${BASE_IMAGE_URL}${profile_path}`
            : "https://via.placeholder.com/100x150?text=No+Image";
        img.alt = name;

        const realName = document.createElement("h5");
        realName.textContent = name;

        const characterName = document.createElement("p");
        characterName.textContent = `${character}`;

        castDiv.appendChild(img);
        castDiv.appendChild(realName);
        castDiv.appendChild(characterName);

        castContainer.appendChild(castDiv);
    });
}

function toggleOverview() {
    const content = document.getElementById("overviewText");
    const icon = document.getElementById("overviewIcon");

    content.classList.toggle("active");
    icon.classList.toggle("down");
}

// Add event listener for overview title and icon
document.getElementById("overviewTitle").addEventListener("click", toggleOverview);

// Fetch and display series details
if (seriesId) {
    fetchSeriesDetails(seriesId);
} else {
    document.body.innerHTML =
        "<p style='color:white; text-align:center; font-size:1.5rem;'>Invalid Series ID. <a href='index.html'>Return to Homepage</a></p>";
}
