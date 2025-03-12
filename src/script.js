// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const modeText = document.getElementById("modeText");

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");

  if (darkModeToggle.checked) {
    modeText.innerText = "Light Mode";
    modeText.style.color = "white"; // Set text color to white in dark mode
  } else {
    modeText.innerText = "Dark Mode";
    modeText.style.color = "black"; // Set text color to black in light mode
  }
});

// Update Current Time
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("currentTime").innerText = `${hours}:${minutes}`;
}

setInterval(updateTime, 1000);
updateTime();

const apiKey = "f7c45514dfdb16b7f66921d3fe5217f7";

let city_name_input = document.querySelector(".search-input");
let search_icon = document.querySelector(".search-icon");
let city_name_value;

search_icon.addEventListener("click", () => {
  console.log("input city name :", city_name_input.value);

  city_name_value = city_name_input.value;
  // fetchData(city_name_value);
  fetchData();
  city_name_input.value = "";
});

function fetchData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city_name_value}&appid=${apiKey}`
  )
    .then((res) => {
      let response = res.json();
      return response;
    })
    .then((data) => {
      let cityName = data.name;
      11;
      document.querySelector(".city-name").innerText = cityName;

      function getCurrentTime(data) {
        let currentTimestamp = data.dt; // Current Unix timestamp (seconds)
        let timezoneOffset = data.timezone; // Timezone offset in seconds

        // Convert timestamp to milliseconds
        let utcCurrentTime = new Date(currentTimestamp * 1000);

        // Apply timezone offset
        let localCurrentTime = new Date(
          utcCurrentTime.getTime() + timezoneOffset * 1000
        );

        // Format time in HH:MM AM/PM
        let formattedCurrentTime = localCurrentTime.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        );

        return formattedCurrentTime;
      }

      // Example usage
      let currentTime = getCurrentTime(data);
      console.log("Current Time in", data.name, ":", currentTime);
    });
}
