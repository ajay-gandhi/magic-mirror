/************************************ Muni ************************************/

let muniTimeout;
const muniEl = document.querySelector(".Muni__Predictions");

const getMuniPrediction = () => {
  xhrHelper("/muni", (response) => {
    const result = JSON.parse(response);
    if (result.error) {
      console.log(result.error);
      muniEl.innerText = "Error";
    } else {
      muniEl.innerText = result.closestTrains.join(", ");
    }
  });
  muniTimeout = setTimeout(getMuniPrediction, 30000);
};
getMuniPrediction();

xhrHelper("/transit.svg", (response) => {
  document.querySelector(".Muni__Icon").innerHTML = response;
});

/********************************** Weather ***********************************/

xhrHelper("/weather", (response) => {
  const forecast = JSON.parse(response);
  const tempText = `${parseInt(forecast.temperatureHigh)}&deg;<br /> ${parseInt(forecast.temperatureLow)}&deg;`;
  document.querySelector(".Weather__Temperature").innerHTML = tempText;
  document.querySelector(".Weather__Icon i").className += ` ${ICON_MAP[forecast.icon]}`;
});

const ICON_MAP = {
  "clear-day":           "wi-day-sunny",
  "clear-night":         "wi-night-clear",
  "rain":                "wi-rain",
  "snow":                "wi-snow",
  "sleet":               "wi-sleet",
  "wind":                "wi-strong-wind",
  "fog":                 "wi-fog",
  "cloudy":              "wi-cloud",
  "partly-cloudy-day":   "wi-day-cloudy",
  "partly-cloudy-night": "wi-night-alt-cloudy",
};

/*********************************** Clock ************************************/

let clockTimeout;
const dateEl = document.querySelector(".Clock__Date");
const timeEl = document.querySelector(".Clock__Time");

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const clockRender = () => {
  const now = new Date();
  dateEl.innerText = `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const hour = now.getHours() === 0 ? 12 : (now.getHours() > 12 ? now.getHours() - 12 : now.getHours());
  const min = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  timeEl.innerText = `${hour}:${min}${now.getHours() > 12 ? "pm" : "am"}`;
  clockTimeout = setTimeout(clockRender, 10000);
};
clockRender();

// XHR helper
function xhrHelper(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(xhr.responseText);
    }
  };
  xhr.send();
}
