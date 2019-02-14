
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

app.listen(8000, () => console.log("Listening on 8000"));
