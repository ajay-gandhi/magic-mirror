const Spotify = require("spotify-web-api-node");
const fs = require("fs");
const creds = require("./private");

if (!creds.spotifyAccessToken || !creds.spotifyRefreshToken) {
  console.log("You must authorize this application first! Read the README");
  process.exit(1);
}

const spotifyApi = new Spotify({
  clientId: creds.spotifyClientId,
  clientSecret: creds.spotifyClientSecret,
  redirectUri: creds.spotifyRedirectUri,
});
spotifyApi.setAccessToken(creds.spotifyAccessToken);
spotifyApi.setRefreshToken(creds.spotifyRefreshToken);

const fail = (err) => {
  console.log("Something went wrong!", err);
  process.exit(1);
};

const getPlaybackState = () => {
  return spotifyApi.getMyCurrentPlaybackState({})
    .then((playbackState) => {
      if (playbackState.body.is_playing) {
        return {
          id: playbackState.body.item.id,
          name: playbackState.body.item.name,
          artists: playbackState.body.item.artists.map(a => a.name).join(", "),
          playing: true,
        };
      } else {
        return { playing: false };
      }
    }, (err) => {
      if (err.message === "Unauthorized" && err.statusCode === 401) {
        spotifyApi
          .refreshAccessToken()
          .then(async (data) => {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
            creds.spotifyExpiresIn = data.body["expires_in"];
            creds.spotifyAccessToken = data.body["access_token"];
            creds.spotifyRefreshToken = data.body["refresh_token"];
            fs.writeFileSync(`${__dirname}/private.json`, JSON.stringify(creds, null, 2));
            return await getPlaybackState();
          }, fail);
      }
    });
};
module.exports = getPlaybackState;
