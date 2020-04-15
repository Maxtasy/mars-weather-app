const API_KEY = "hwLQjDRiPpwibkf7X3dX7d5YzeFe01okP4PkIDji";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector(".show-previous-weather-button");
const previousWeatherContainer = document.querySelector(".previous-weather");
const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHighElement = document.querySelector("[data-current-temp-high]");
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionText = document.querySelector("[data-wind-direction-text]");
const windDirectionArrow = document.querySelector("[data-wind-direction-arrow]");

const previousSolTemplate = document.querySelector("[data-previous-sol-template]");
const previousSolContainer = document.querySelector("[data-previous-sols]");

const unitToggleButton = document.querySelector("[data-unit-toggle]");
const metricRadio = document.querySelector("#cel");
const imperialRadio = document.querySelector("#fah");

let selectedSolIndex;

function getWeather() {
    return fetch(API_URL)
        .then((resp) => resp.json())
        .then(data => {
            const {
                sol_keys,
                validity_checks,
                ...solData
            } = data;
            return Object.entries(solData).map(([sol, data]) => {
                return {
                    sol: sol,
                    maxTemp: data.AT.mx,
                    minTemp: data.AT.mn,
                    windSpeed: data.HWS.av,
                    windDirectionDegrees: data.WD.most_common.compass_degrees,
                    windDirectionCardinal: data.WD.most_common.compass_point,
                    date: new Date(data.First_UTC)
                }
            });
        });
}

function displayDate(date) {
    const options = { month: "long", day: "numeric" }
    return date.toLocaleDateString(undefined, options);
}

function displayTemperature(temperature) {
    let returnTemp = temperature;
    if (!isMetric()) {
        returnTemp = temperature * 9 / 5 + 32
    } 
    return Math.round(returnTemp);
}

function displayWindSpeed(windSpeed) {
    let returnSpeed = windSpeed;
    if (!isMetric()) {
        returnSpeed = windSpeed * 0.62137;
    }
    return Math.round(returnSpeed);
}

function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex];
    currentSolElement.innerText = selectedSol.sol;
    currentDateElement.innerText = displayDate(selectedSol.date);
    currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
    currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
    windSpeedElement.innerText = displayWindSpeed(selectedSol.windSpeed);
    windDirectionText.innerText = selectedSol.windDirectionCardinal;
    windDirectionArrow.style.setProperty("--direction", `${selectedSol.windDirectionDegrees}deg`);
}

function displayPreviousSols(sols) {
    previousSolContainer.innerHTML = "";
    sols.forEach((solData, index) => {
        const solContainer = previousSolTemplate.content.cloneNode(true);
        solContainer.querySelector("[data-sol]").innerText = solData.sol;
        solContainer.querySelector("[data-date]").innerText = displayDate(solData.date);
        solContainer.querySelector("[data-temp-high]").innerText = displayTemperature(solData.maxTemp);
        solContainer.querySelector("[data-temp-low]").innerText = displayTemperature(solData.minTemp);
        solContainer.querySelector("[data-select-button").addEventListener("click", () => {
            selectedSolIndex = index;
            displaySelectedSol(sols);
        });
        previousSolContainer.append(solContainer);
    });
}

function isMetric() {
    return metricRadio.checked;
}


function updateUnits() {
    const speedUnits = document.querySelectorAll("[data-speed-unit]");
    const tempUnits = document.querySelectorAll("[data-temp-unit]");
    speedUnits.forEach(speedUnit => {
        speedUnit.innerText = isMetric() ? "k" : "m";
    });
    tempUnits.forEach(tempUnit => {
        tempUnit.innerText = isMetric() ? "C" : "F";
    });
}

previousWeatherToggle.addEventListener("click", () => {
    previousWeatherContainer.classList.toggle("show-weather");
});

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();

    unitToggleButton.addEventListener("click", () => {
        let metricUnits = !isMetric();
        metricRadio.checked = metricUnits;
        imperialRadio.checked = !metricUnits;
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });

    metricRadio.addEventListener("change", () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });

    imperialRadio.addEventListener("change", () => {
        displaySelectedSol(sols);
        displayPreviousSols(sols);
        updateUnits();
    });
});