
const express = require("express");
const https = require("https");
const http = require("http");
const parseString = require("xml2js").parseString;
const priv = require("./private");

const app = express();

app.use(express.static("public"));

app.get("/weather", (req, res) => {
  request(`https://api.darksky.net/forecast/${priv.weatherApiKey}/37.735988,-122.388798`, (data) => {
    res.send(JSON.parse(data).daily.data[0]);
  });
});

app.get("/muni", (req, res) => {
  request(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=${priv.muniAgency}&r=${priv.muniRoute}&s=${priv.muniStopId}`, (response) => {
    parseString(response, (err, result) => {
      if (err) {
        return res.send(JSON.stringify({ error: err }));
      }

      // Get the 2 closest
      const directions = result.body.predictions[0].direction;
      const closestTrains = directions.reduce((memo, d) => {
        const f = d.prediction[0].$.minutes;
        const s = d.prediction[1].$.minutes;

        if (f < memo[0])      return [f, s < memo[1] ? s : memo[1]];
        else if (f < memo[1]) return [memo[0], f];
        else                  return memo;
      }, [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]);
      res.send({ closestTrains });
    });
  });
});

app.listen(8000, () => console.log("Listening on 8000"));

// http request helper
const request = (url, cb) => {
  const prot = url.startsWith("https") ? https : http;
  prot.get(url, (response) => {
    let data = "";
    response.on("data", c => data += c);
    response.on("end", () => {
      cb(data);
    });
  });
};
