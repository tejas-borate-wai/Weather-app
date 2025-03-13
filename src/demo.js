// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const modeText = document.getElementById("modeText");

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");

  if (darkModeToggle.checked) {
    modeText.innerText = "Light Mode";
    modeText.style.color = "white";
  } else {
    modeText.innerText = "Dark Mode";
    modeText.style.color = "black";
  }
});

function updateTime(cityName) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  // Show current time and the city name dynamically
  document.getElementById(
    "currentTime"
  ).innerText = `${hours}:${minutes}:${second}`;

  // Update city name in the time section if it's available
  if (cityName) {
    document.getElementById(
      "cityNameInTimeSection"
    ).innerText = `in ${cityName}`;
  }
}

setInterval(() => updateTime(cityNameInTimeSection), 1000);
updateTime(); // To initialize the current time

function TodaysDate() {
  const options = { weekday: "long", day: "2-digit", month: "short" };
  const currentDate = new Date().toLocaleDateString("en-GB", options);
  document.querySelector(".date-display").innerText = `${currentDate}`;
}
TodaysDate();

// API Key
const apiKey = "f7c45514dfdb16b7f66921d3fe5217f7";

// Search bar
let city_name_input = document.querySelector(".search-input");
let search_icon = document.querySelector(".search-icon");
let city_name_value;

search_icon.addEventListener("click", () => {
  city_name_value = city_name_input.value.trim();
  if (city_name_value) {
    fetchData(city_name_value);
  } else {
    alert("Please enter a city name");
  }
  city_name_input.value = "";
});

// Function to fetch weather data based on city name
function fetchData(city_name_value) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city_name_value}&appid=${apiKey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === "404") {
        alert("City not found. Please enter a valid city name.");
        return;
      }

      let cityName = data.name;

      // Display city name in both sections
      document.querySelector(".city-name").innerText = cityName;
      document.getElementById(
        "cityNameInTimeSection"
      ).innerText = `in ${cityName}`;
      updateTime(cityName); // Update time with city name

      let temperature = Math.round(data.main.temp);
      document.querySelector(".temperature").innerText = `${temperature}°C`;

      let feels_like = data.main.feels_like;
      document.querySelector(".feels-like-value").innerText = `${feels_like}°C`;

      let humidity = data.main.humidity;
      document.querySelector(".Humidity").innerText = `${humidity}%`;

      let windSpeed = data.wind.speed;
      document.querySelector(".Wind-Speed").innerText = `${windSpeed}km/h`;

      let pressure = data.main.pressure;
      document.querySelector(".Pressure").innerText = `${pressure}hPa`;

      let uvIndex = data.clouds.all;
      document.querySelector(".UV-Index").innerText = `${uvIndex}hPa`;

      let weatherInfo = data.weather[0].main;
      document.querySelector(".weather-condition").innerText = `${weatherInfo}`;

      // Get the current day and date
      function getDayAndDate(data) {
        let timestamp = data.dt;
        let timezoneOffset = data.timezone;
        let utcDate = new Date(timestamp * 1000);
        let localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
        let day = localDate.toLocaleDateString("en-US", { weekday: "long" });
        let date = localDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
        });
        return { day, date };
      }

      let dateInfo = getDayAndDate(data);
      let currentDay = dateInfo.day;
      let currentDate = dateInfo.date;

      document.querySelector(
        ".date-display"
      ).innerText = `${currentDay}, ${currentDate}`;

      // Format sunrise and sunset times
      function formatTime(timestamp, isSunrise) {
        const date = new Date(timestamp * 1000);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const amPm = isSunrise ? "AM" : "PM";
        hours = hours % 12 || 12;
        return hours.toString().padStart(2, "0") + ":" + minutes + " " + amPm;
      }
      const sunRise = formatTime(data.sys.sunrise, true);
      const sunSet = formatTime(data.sys.sunset, false);

      document.querySelector(".sunrise-time").innerHTML = sunRise;
      document.querySelector(".sunset-time").innerHTML = sunSet;

      // Function to get weather icons
      function getWeatherIcon(condition) {
        const icons = {
          Clear: "images/clear-1-98.png",
          Clouds: "images/clouds-2-28.png",
          Rain: "images/rain-1-55.png",
          Thunderstorm: "images/drizzle-1-59.png",
          Haze: "images/drizzle-1-59.png",
          Snow: "images/rain-1-55.png",
          Mist: "images/mist-1-67.png",
          Smoke: "images/mist-1-67.png",
        };
        return icons[condition] || "images/clear-1-98.png";
      }

      if (data && data.weather && data.weather.length > 0) {
        const weatherCondition = data.weather[0].main;
        document.querySelector(".weather-condition").innerText =
          weatherCondition;
        document.querySelector(".weather-icon-sun").src =
          getWeatherIcon(weatherCondition);
      }

      // Get forecast data
      function getDateForcast() {
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city_name_value}&appid=${apiKey}&units=metric`
        )
          .then((res) => res.json())
          .then((data) => {
            let dailyForcast = "";
            for (let i = 0; i < data.list.length; i += 8) {
              let weather_condition = data.list[i].weather[0].main;
              let temp = Math(data.list[i].main.temp);

              function getDayAndDate(data) {
                let timestamp = data;
                let utcDate = new Date(timestamp * 1000);
                let localDate = new Date(utcDate.getTime());
                let day = localDate.toLocaleDateString("en-US", {
                  weekday: "short",
                });
                let date = localDate.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                });
                return { day, date };
              }

              let { day, date } = getDayAndDate(data.list[i].dt);
              let imgPath = getWeatherIcon(data.list[i].weather[0].main);

              dailyForcast += `<li class="forecast-item">
                            <img src="${imgPath}" alt="${weather_condition}" class="forecast-icon">
                            <span class="temp">${temp}°C</span>
                            <span class="date text-start">${day}, ${date}</span>
                            </li>`;
            }

            document.querySelector(".daily-forcast").innerHTML = dailyForcast;
          });
      }
      getDateForcast();
    })
    .catch(() => {
      alert("An error occurred. Please try again later.");
    });
}

// Get the current location when the "Current Location" button is clicked
const locationButton = document.querySelector(".current-location-btn");

locationButton.addEventListener("click", () => {
  // Check if geolocation is available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch weather data based on geolocation
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.cod === "404") {
              alert("Could not fetch weather data. Try again.");
            } else {
              let cityName = data.name;

              // Display city name for weather and time section
              document.querySelector(".city-name").innerText = cityName;
              document.getElementById(
                "cityNameInTimeSection"
              ).innerText = `in ${cityName}`;
              locationButton.innerText = `Current Location: ${cityName}`;

              // Fetch weather data for the city
              fetchData(cityName);
            }
          })
          .catch(() => {
            alert("Error fetching weather data. Try again.");
          });
      },
      (error) => {
        alert("Geolocation error: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
