let currentUnit = "metric";
let currentCity = "";
let lastUsedMethod = "city";
const apiKey = "671eea401cb97d17096eb3f16cae3e40";

function getWeather() 
{
    const city = document.getElementById("cityInput").value.trim();
    
    if (!city) 
        {
            document.getElementById("weatherResult").innerHTML = `<p style="color:red;">Please enter a city name.</p>`;
            return;
        }

lastUsedMethod = "city";

currentCity = city;

const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${currentUnit}`;

fetchWeather(url);
}

function getLocationWeather() 
{
    if (!navigator.geolocation) 
        {
        alert("Geolocation is not supported by your browser.");
        return;
        }

navigator.geolocation.getCurrentPosition(success => 
    {
    const lat = success.coords.latitude;
    const lon = success.coords.longitude;
    lastUsedMethod = "gps";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
    fetchWeather(url);
    }, error => 
        {
        alert("Unable to retrieve your location.");
        console.error(error);
        });
}

function fetchWeather(url) 
{
    fetch(url)

.then(response => {
    if (!response.ok) {
        throw new Error("City not found or failed to fetch data.");
}
return response.json();
})

.then(data => 
    {
    console.log("Rendering weather for:", data.name);
    currentCity = data.name;
    const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
    const weatherMain = data.weather[0].main.toLowerCase();
    
    document.body.className = "";
    if (weatherMain.includes("clear")) document.body.classList.add("sunny");
    else if (weatherMain.includes("cloud")) document.body.classList.add("cloudy");
    else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) document.body.classList.add("rainy");
    else if (weatherMain.includes("thunderstorm")) document.body.classList.add("storm");
    else if (weatherMain.includes("snow")) document.body.classList.add("snow");
    else if (weatherMain.includes("mist") || weatherMain.includes("haze") || weatherMain.includes("fog")) document.body.classList.add("foggy");

    const weather = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
    <p><strong>Temperature:</strong> ${data.main.temp}${unitSymbol}</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"}</p>`;

    document.getElementById("weatherResult").innerHTML = weather;
    console.log("Weather content inserted.");
})

.catch(error => 
    {
    document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error); 
});
}

function toggleUnit()
{
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    const toggleBtn = document.querySelector("button[onclick='toggleUnit()']");
    toggleBtn.textContent = currentUnit === "metric" ? "Switch to °F" : "Switch to °C";
    if (lastUsedMethod === "city" && currentCity !== "") 
    {
        getWeather();
    } else if (lastUsedMethod === "gps") {
        getLocationWeather();
    }
}