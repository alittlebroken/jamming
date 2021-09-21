
let accessToken;

const clientID = 'CLIENT_ID';
const redirectUri = 'REDIRECT_URI';

export class Spotify  {

  constructor() {
    this._scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
    this._state = '123456789';
  }

  async getAccessToken(){

    if(accessToken){
      return accessToken;
    }

    let uri = window.location.href;
    const accessTokenMatch = uri.match(/access_token=([^&]*)/);
    const expiresInMatch = uri.match(/expires_in=([^&]*)/);

    if(accessTokenMatch && expiresInMatch){

        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);

        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');

        return accessToken;

    }

    window.location.href = 'https://accounts.spotify.com/authorize?'
    + 'client_id=' + clientID
    + '&response_type=token'
    + '&scope=' + this._scope
    + '&redirect_uri=' + redirectUri;

  }

  async search(term){

    const searchAccessToken = await this.getAccessToken();
    const searchUri = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    let searchResults = await fetch(searchUri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${searchAccessToken}`
      }
    })
    .then( response => {
      if(response.ok){
        return response.json();
      }
    })
    .then( data => {

      if(!data.tracks){
        return [];
      }

      let tracks = data.tracks.items;

      let results = tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));

      return results;

    })
    .catch(error => {
      console.log(error);
      return [];
    })

    return searchResults;

  }

  // Save a playlist to the users spotify account
  async savePlaylist(playlistName, playlistTracks){
    // Check that the parameters passed in contain data
    if(!playlistName || !playlistTracks){ return; }

    // Get the users access token so we can query the spotify API
    let userAccessToken = await this.getAccessToken();

    // Set the headers for requesting the users ID
    let headers = {
      Authorization: `Bearer ${userAccessToken}`
    };

    // This will hold the user ID
    let userID;

    // URI to access
    let userURI = 'https://api.spotify.com/v1/me';

    // Perform a fetch and get the user ID returned
    userID = await fetch(userURI, {
      method: 'GET',
      headers: headers
    })
    .then ( response => {
      if(response.ok){
        return response.json();
      }
    })
    .then( data => {
      return data.id;
    })
    .catch( error => {
      console.log(error);
      return;
    })
    ;

    // Now lets attempt to save the PlayList
    let savePlaylistUri = `https://api.spotify.com/v1/users/${userID}/playlists`;
    console.log(`<Spotify.js> Playlist URI: ${savePlaylistUri}`);
    let playlistId = await fetch(savePlaylistUri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userAccessToken}`
      },
      body: JSON.stringify({ name: playlistName })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data.id;
    })
    .catch(error => {
      console.log(error);
      return;
    });

    // Now save the tracks to the playlist
    let addTrackUri = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    let addTrackId = await fetch(addTrackUri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userAccessToken}`
      },
      body: JSON.stringify({ uris: playlistTracks })
    })
    .then( response => {
      return response.json();
    })
    .then(data => {
      return data.snapshot_id;
    })
    .catch(error => {
      console.log(error);
      return;
    });

  }


}
