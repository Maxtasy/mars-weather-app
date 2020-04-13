const previousWeatherToggle = document.querySelector(".show-previous-weather-button");
const previousWeatherContainer = document.querySelector(".previous-weather");

previousWeatherToggle.addEventListener("click", () => {
    previousWeatherContainer.classList.toggle("show-weather");
});