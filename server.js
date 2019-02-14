
const express = require("express");
const https = require("https");
const priv = require("./private");

const app = express();

app.use(express.static("public"));

app.get("/weather", (req, res) => {
  https.get(`https://api.darksky.net/forecast/${priv.weatherApiKey}/37.735988,-122.388798`, (response) => {
    let data = "";
    response.on("data", c => data += c);
    response.on("end", () => {
      res.send(JSON.parse(data).daily.data[0]);
    });
  });
});

app.get("/muni", (req, res) => {
  https.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=${priv.muniStop}`, (response) => {
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
      res.send({ next: closestTrains });
    });
  });
});

app.listen(8000, () => console.log("Listening on 8000"));
