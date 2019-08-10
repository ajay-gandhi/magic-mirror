// Copied from github.com/ajay-gandhi/beatlify with modifications

const http = require("http");
const Spotify = require("spotify-web-api-node");
const url = require("url");
const fs = require("fs");
const creds = require("./private");

const PORT = 9004;
const SCOPES = ["user-read-playback-state"];

/************************ Step 1: Print authorize URL *************************/
const spotifyApi = new Spotify({
  redirectUri: creds.spotifyRedirectUri,
  clientSecret: creds.spotifySecret,
  clientId: creds.spotifyId,
});

// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(SCOPES);
console.log("Visit this URL to authorize this application:");
console.log(authorizeURL);

/***************************** Step 2: Get tokens *****************************/
const server = http.createServer((request, response) => {
  if (request.url.startsWith("/callback")) {
    const query = url.parse(request.url, true).query;
    console.log("Received authorization code:", query.code);

    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(query.code).then((data) => {
      creds.spotifyExpiresIn = data.body["expires_in"];
      creds.spotifyAccessToken = data.body["access_token"];
      creds.spotifyRefreshToken = data.body["refresh_token"];
      fs.writeFileSync(`${__dirname}/private.json`, JSON.stringify(creds, null, 2));
      console.log("Successfully retrieved tokens!");
      process.exit(0);
    }, (err) => {
      console.log("Something went wrong!", err);
      process.exit(1);
    });
  }
  response.end("Check your console!");
});

server.listen(PORT);
