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

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  document.getElementById(
    "currentTime"
  ).innerText = `${hours}:${minutes}:${second}`;
}

setInterval(updateTime, 1000);
updateTime();

function TodaysDate() {
  const options = { weekday: "long", day: "2-digit", month: "short" };
  const currentDate = new Date().toLocaleDateString("en-GB", options);

  document.querySelector(".date-display").innerText = `${currentDate}`;
}
TodaysDate();

const apiKey = "f7c45514dfdb16b7f66921d3fe5217f7";

let city_name_input = document.querySelector(".search-input");
let search_icon = document.querySelector(".search-icon");
let city_name_value;

search_icon.addEventListener("click", () => {
  console.log("input city name :", city_name_input.value);

  city_name_value = city_name_input.value;
  fetchData(city_name_value);
  city_name_input.value = "";
});

function fetchData(cityname) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}&units=metric`
  )
    .then((res) => {
      let response = res.json();
      return response;
    })
    .then((data) => {
      let cityName = data.name;
      document.querySelector(".city-name").innerText = cityName;

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
      // console.log(weatherInfo);
      // console.log(data);
      document.querySelector(".weather-condition").innerText = `${weatherInfo}`;

      // gett current day and date
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
      ).innerText = `${currentDay} , ${currentDate}`;

      // Get Sunset and Sunrise Time
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

      // Function to get weather icon based on condition
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

        // Return corresponding icon or fallback icon
        return icons[condition] || "images/clear-1-98.png"; // Use a better fallback image
      }

      // Check if data is available before accessing
      if (data && data.weather && data.weather.length > 0) {
        const weatherCondition = data.weather[0].main; // Extract weather condition
        document.querySelector(".weather-condition").innerText =
          weatherCondition; // Display condition
        document.querySelector(".weather-icon-sun").src =
          getWeatherIcon(weatherCondition); // Set icon
      } else {
        console.error("Weather data is not available.");
      }

      function getDateForcast() {
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}&units=metric`
        )
          .then((res) => {
            let response = res.json();
            return response;
          })
          .then((data) => {
            let dailyForcast = "";
            // console.log(data);
            for (let i = 0; i < data.list.length; i += 8) {
              // console.log(data.list[i].weather[0].main);
              let weather_condition = data.list[i].weather[0].main;
              let temp = Math.round(data.list[i].main.temp);

              function getDayAndDate(data) {
                let timestamp = data;
                // let timezoneOffset = data.timezone;

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

            let daily_forcast = (document.querySelector(
              ".daily-forcast"
            ).innerHTML = dailyForcast);
          });
      }
      getDateForcast();

      function getHourlyForcast() {
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}&units=metric`
        )
          .then((res) => {
            let response = res.json();
            return response;
          })
          .then((data) => {
            // console.log(data);

            let hourlyForcast = ``;
            for (let i = 0; i < 5; i++) {
              let weather_condition = data.list[i].weather[0].main;
              let temp = Math.round(data.list[i].main.temp);
              let windSpeed = data.list[i].wind.speed;
              let imgPath = getWeatherIcon(data.list[i].weather[0].main);

              function getTimeFromDT(dt) {
                // Convert timestamp (dt) to a Date object
                const date = new Date(dt * 1000);

                // Format time as HH:MM AM/PM (e.g., 12:00 AM/PM)
                return new Intl.DateTimeFormat("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }).format(date);
              }

              let time = getTimeFromDT(data.list[i].dt);
              hourlyForcast += `
                        <div class="hour-card">
                            <p class="time">${time}</p>
                            <img src="${imgPath}" alt="${weather_condition}" class="weather-icon">
                            <p class="temp temp1">${temp}°C</p>
                            <img src="images/navigation-1-16.png" alt="Wind" class="wind-icon">
                            <p class="wind-speed">${windSpeed}km/h</p>
                        </div>
              `;
            }
            let hourly_forcast = (document.querySelector(
              ".hourly-forcast"
            ).innerHTML = hourlyForcast);
          });
      }
      getHourlyForcast();
    })
    .catch((error) => {
      alert("City Not Found , Please enter valid city !");
    });
}

let currLocationButton = document.querySelector(".current-location-btn");
currLocationButton.addEventListener("click", () => {
  function getCurrentLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Latitude:", latitude, "Longitude:", longitude);

          // Call the callback function with the location
          callback({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          alert(
            "Unable to retrieve location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  function printLocation(latitude, longitude) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Current Location : ", data.name);
        currLocationButton.innerText = data.name;
        let cityName = data.name;
        fetchData(cityName);
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  }

  // Get location and then fetch weather data
  getCurrentLocation(({ latitude, longitude }) => {
    printLocation(latitude, longitude);
  });
});
