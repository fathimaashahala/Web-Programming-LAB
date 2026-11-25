
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");
const searchBtn = document.getElementById("searchBtn");

// Convert weather codes into descriptions and icons
function getWeatherInfo(code) {
    const weatherCodes = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Rime Fog", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Moderate Drizzle", "🌦️"],
        55: ["Heavy Drizzle", "🌧️"],
        61: ["Slight Rain", "🌧️"],
        63: ["Moderate Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Slight Snow", "🌨️"],
        73: ["Moderate Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Moderate Showers", "🌧️"],
        82: ["Heavy Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Heavy Thunderstorm with Hail", "⛈️"]
    };

    return weatherCodes[code] || ["Unknown Weather", "🌡️"];
}

// Fetch weather data when the form is submitted
weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name!";
        weatherResult.hidden = true;
        return;
    }

    message.textContent = "Loading weather information...";
    weatherResult.hidden = true;
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";

    try {
        // Step 1: Find the city's coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! Please enter a valid city name.");
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch current weather using coordinates
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather information.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Weather data is currently unavailable.");
        }

        // Step 3: Extract weather information
        const current = weatherData.current;
        const [description, icon] =
            getWeatherInfo(current.weather_code);

        // Step 4: Display weather information
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("weatherIcon").textContent = icon;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        document.getElementById("condition").textContent =
            description;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("updatedTime").textContent =
            `Last updated: ${current.time.replace("T", " ")}`;

        weatherResult.hidden = false;
        message.textContent = "";

    } catch (error) {
        message.textContent = error.message ||
            "Something went wrong. Please try again.";

        weatherResult.hidden = true;

    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
});
