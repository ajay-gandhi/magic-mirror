/********************************** Weather ***********************************/
const xhr = new XMLHttpRequest();
xhr.open("GET", "/weather");
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const forecast = JSON.parse(xhr.responseText);
    const tempText = `${parseInt(forecast.temperatureHigh)} / ${parseInt(forecast.temperatureLow)}`;
    document.querySelector(".Weather__Temperature").innerText = tempText;
    document.querySelector(".Weather__Icon i").className += ` ${ICON_MAP[forecast.icon]}`;
  }
};
xhr.send();

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
  timeEl.innerText = `${hour}:${now.getMinutes()}${now.getHours() > 12 ? "pm" : "am"}`;
  clockTimeout = setTimeout(clockRender, 10000);
};
clockRender();
