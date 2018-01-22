const clientId = 'c1dcf252911f42bc90adef48fdb6c153';
const redirectURI = 'http://jgjamming.s3-website-us-east-1.amazonaws.com';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    let expirationTime;
    if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1]
      expirationTime = window.location.href.match(/expires_in=([^&]*)/)[1]
    }

    if (accessToken && expirationTime) {
      window.setTimeout(() => {
        accessToken = undefined
      }, expirationTime * 1000)
      window.location.hash = ''
      return accessToken
    }

    return window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
  },

  search(term) {

    return new Promise((resolve, reject) => {

      accessToken = this.getAccessToken()

      fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Request Failed!')
      }, networkError => console.log(networkError.message)).then(jsonResponse => {
        let tracks = jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
        resolve(tracks)
      })

    })
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) return
    let userId, playlistId, headers = {
      Authorization: `Bearer ${accessToken}`
    }

    // Get user ID
    fetch('https://api.spotify.com/v1/me', { headers }).then(response => {
      if (response.ok) return response.json()
      throw new Error('Request Failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
      userId = jsonResponse.id
      createPlaylist()
    })

    // Post for creating playlist
    function createPlaylist() {
      console.log('userId: ' + userId);
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: playlistName })
      }).then(response => {
        if (response.ok) return response.json()
        throw new Error('Request Failed!')
      }, networkError => console.log(networkError.message)).then(jsonResponse => {
        playlistId = jsonResponse.id
        savePlaylist()
      })
    }

    // Post for saving playlist
    function savePlaylist() {
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({uris: trackURIs})
      }).then(response => {
        if (response.ok) return response.json()
        throw new Error('Request Failed!')
      }, networkError => console.log(networkError.message)).then(jsonResponse => {
        playlistId = jsonResponse.snapshot_id
      })
    }

  }
}

export default Spotify;
