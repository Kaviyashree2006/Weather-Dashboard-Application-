async function getWeather() {

    try {
        let city = document.getElementById("city").value;
        if (city.trim() === "") {
            throw new Error("Please enter a city name");
        }
        let locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find the city");
        }

        let locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }

        let location = locationData.results[0];

        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data");
        }

        let weatherData = await weatherResponse.json();

        // Get current weather
        let current = weatherData.current;

        // Step 3: Convert weather code into condition
        let weatherCondition;

        if (current.weather_code === 0) {
            weatherCondition = "☀️ Clear Sky";
        }
        else if (current.weather_code === 1) {
            weatherCondition = "🌤️ Mainly Clear";
        }
        else if (current.weather_code === 2) {
            weatherCondition = "⛅ Partly Cloudy";
        }
        else if (current.weather_code === 3) {
            weatherCondition = "☁️ Overcast";
        }
        else if (current.weather_code === 45 || current.weather_code === 48) {
            weatherCondition = "🌫️ Foggy";
        }
        else if (
            current.weather_code >= 51 &&
            current.weather_code <= 57
        ) {
            weatherCondition = "🌦️ Drizzle";
        }
        else if (
            current.weather_code >= 61 &&
            current.weather_code <= 67
        ) {
            weatherCondition = "🌧️ Rainy";
        }
        else if (
            current.weather_code >= 71 &&
            current.weather_code <= 77
        ) {
            weatherCondition = "❄️ Snowy";
        }
        else if (
            current.weather_code >= 80 &&
            current.weather_code <= 82
        ) {
            weatherCondition = "🌦️ Rain Showers";
        }
        else if (
            current.weather_code === 85 ||
            current.weather_code === 86
        ) {
            weatherCondition = "🌨️ Snow Showers";
        }
        else if (current.weather_code === 95) {
            weatherCondition = "⛈️ Thunderstorm";
        }
        else if (
            current.weather_code === 96 ||
            current.weather_code === 99
        ) {
            weatherCondition = "⛈️ Thunderstorm with Hail";
        }
        else {
            weatherCondition = "🌤️ Unknown Weather";
        }

        // Step 4: Display weather
        let output = `
            <h2>📍 ${location.name}, ${location.country}</h2>

            <div class="weather-item">
                ${weatherCondition}
            </div>

            <div class="weather-item">
                🌡️ Temperature: ${current.temperature_2m} °C
            </div>

            <div class="weather-item">
                💧 Humidity: ${current.relative_humidity_2m}%
            </div>

            <div class="weather-item">
                💨 Wind Speed: ${current.wind_speed_10m} km/h
            </div>
        `;

        document.getElementById("weather").innerHTML = output;

    }

    catch (error) {

        console.error("Weather Error:", error);

        document.getElementById("weather").innerHTML =
            `<p class="error">❌ ${error.message}</p>`;
    }
}
