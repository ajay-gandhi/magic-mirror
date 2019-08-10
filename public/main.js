/********************************** Spotify ***********************************/

const spotifyIcon      = document.querySelector(".Spotify__Icon");
const spotifyContainer = document.querySelector(".Spotify__Data");
const spotifyTitle     = document.querySelector(".Spotify__Data h2");
const spotifyArtist    = document.querySelector(".Spotify__Data h3");
const spotifyProps = {
  contWidth: spotifyContainer.offsetWidth,
  id: -1,
};
let spotifyUpdateTimeout;
let spotifyMarqueeTimeout;
let spotifySvg;

const getSpotifyState = () => {
  xhrHelper("/spotify", (response) => {
    const result = JSON.parse(response);
    if (!result.playing) {
      spotifyIcon.innerHTML = "";
      spotifyTitle.textContent = "";
      spotifyArtist.textContent = "";
      return;
    }
    if (spotifyProps.id !== result.id) {
      spotifyIcon.innerHTML = spotifySvg;
      spotifyTitle.textContent = result.name;
      spotifyArtist.textContent = result.artists;
      spotifyProps.id = result.id;

      // Marquee
      spotifyProps.singleWidth = spotifyTitle.offsetWidth;
      if (spotifyProps.singleWidth > spotifyProps.contWidth) {
        spotifyTitle.innerHTML = `${spotifyTitle.textContent}&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;${spotifyTitle.textContent}`;
        spotifyProps.doubleWidth = spotifyTitle.offsetWidth;
        spotifyProps.endCondition = spotifyProps.contWidth - spotifyProps.singleWidth;
        spotifyTitle.style.right = `${spotifyProps.contWidth - spotifyProps.doubleWidth}px`;
        window.requestAnimationFrame(step);
      } else {
        spotifyTitle.style.right = "0";
        if (spotifyMarqueeTimeout) {
          window.clearTimeout(spotifyMarqueeTimeout);
          spotifyMarqueeTimeout = null;
        }
      }
    }
  });
  spotifyUpdateTimeout = setTimeout(getSpotifyState, 10000);
};
getSpotifyState();

xhrHelper("/assets/music.svg", (response) => {
  spotifySvg = response;
});

const step = () => {
  // This is uggo but I'm getting tired of this lol
  const currentRight = Number(spotifyTitle.style.right.slice(0, -2));
  if (currentRight < spotifyProps.endCondition) {
    spotifyTitle.style.right = `${currentRight + 2}px`;
    window.requestAnimationFrame(step);
  } else {
    spotifyMarqueeTimeout = setTimeout(() => {
      spotifyTitle.style.right = `${spotifyProps.contWidth - spotifyProps.doubleWidth}px`;
      window.requestAnimationFrame(step);
    }, 5000);
  }
};

/************************************ Muni ************************************/

let muniTimeout;
const muniEl = document.querySelector(".Muni__Predictions");

const getMuniPrediction = () => {
  xhrHelper("/muni", (response) => {
    const result = JSON.parse(response);
    if (result.error) {
      muniEl.textContent = "Error";
    } else {
      muniEl.textContent = result.closestTrains.join(", ");
    }
  });
  muniTimeout = setTimeout(getMuniPrediction, 30000);
};
getMuniPrediction();

xhrHelper("/assets/transit.svg", (response) => {
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
  dateEl.textContent = `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const hour = now.getHours() === 0 ? 12 : (now.getHours() > 12 ? now.getHours() - 12 : now.getHours());
  const min = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  timeEl.textContent = `${hour}:${min}${now.getHours() > 12 ? "pm" : "am"}`;
  clockTimeout = setTimeout(clockRender, 10000);
};
clockRender();

/********************************** Helpers ***********************************/

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

// CSS @keyframes generator
const createKeyframes = (start, end) => {
  const oldStyle = document.getElementsByTagName("style");
  if (oldStyle.length > 0) oldStyle[0].parentNode.removeChild(oldStyle[0]);

  const style = document.createElement("style");
  style.type = "text/css";
  var keyFrames = `
  @keyframes marquee {
    0% {
      right: ${start}px,
    }
    50% {
      right: ${end}px,
    }
    50.01% {
      right: ${start}px,
    }
  }`;
  document.getElementsByTagName("head")[0].appendChild(style);
};
