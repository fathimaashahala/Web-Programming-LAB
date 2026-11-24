
const API_KEY = "YOUR_API_KEY";

const newsContainer =
    document.getElementById("newsContainer");

// Function to fetch news
async function getNews(category = "general") {

    newsContainer.innerHTML = "Loading news...";

    const url =
        `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        displayNews(data.articles);

    } catch (error) {
        newsContainer.innerHTML =
            "Error loading news. Check your API key.";
        console.error(error);
    }
}

// Function to display news
function displayNews(articles) {

    newsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = "No news articles found.";
        return;
    }

    articles.forEach(article => {

        const card = document.createElement("div");
        card.className = "news-card";

        const image = document.createElement("img");
        image.src = article.urlToImage ||
            "https://placehold.co/600x400?text=News";
        image.alt = "News image";

        image.onerror = function() {
            this.src =
                "https://placehold.co/600x400?text=News";
        };

        const content = document.createElement("div");
        content.className = "news-content";

        const title = document.createElement("h3");
        title.textContent = article.title || "No title";

        const description = document.createElement("p");
        description.textContent =
            article.description || "No description available";

        const source = document.createElement("small");
        source.textContent =
            "Source: " + (article.source?.name || "Unknown");

        const date = document.createElement("small");
        date.textContent = article.publishedAt
            ? "Published: " +
              new Date(article.publishedAt).toLocaleDateString()
            : "Publication date unavailable";

        const link = document.createElement("a");
        link.textContent = "Read More";
        link.href = article.url || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        content.append(
            title, description, source, date, link
        );

        card.append(image, content);

        newsContainer.appendChild(card);
    });
}

// Function to search news
async function searchNews() {

    const query =
        document.getElementById("searchInput").value.trim();

    if (query === "") {
        alert("Please enter a search keyword");
        return;
    }

    newsContainer.innerHTML = "Searching news...";

    const url =
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Search failed");
        }

        displayNews(data.articles);

    } catch (error) {
        newsContainer.innerHTML = "Unable to search news.";
        console.error(error);
    }
}

// Load news when page opens
getNews("general");
