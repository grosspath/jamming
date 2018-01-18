import React, { Component } from 'react';
import './app.css';
import SearchBar from '../searchBar/searchBar';
import SearchResults from '../searchResults/searchResults';
import PlayList from '../playList/playList';
import Spotify from '../../util/spotify';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchResults: [],
      playListName: 'New Playlist',
      playListTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let counter = 0;
    this.state.playListTracks.forEach(function(element) {
      if (element === track) {
        counter++
      }
    })

    if (counter === 0) {
      let newPlayListTracks = this.state.playListTracks;
      newPlayListTracks.push(track)
      this.setState({ playListTracks: newPlayListTracks })
    }

  }

  removeTrack(track) {
    let newPlayListTracks = this.state.playListTracks;
    this.state.playListTracks.forEach(function(element) {
      if (element === track) {
        newPlayListTracks.pop(track)
      }
    })

    this.setState({
        playListTracks: newPlayListTracks
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playListName: name
    })
  }

  savePlaylist() {
    let trackURIs = this.state.playListTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playListName, trackURIs)
    this.setState({
      playListName: 'New Playlist',
      playListTracks: []
    })
  }

  search(term) {
    Spotify.search(term).then((tracks) => {
      this.setState({
        searchResults: tracks
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <PlayList
              playListName={this.state.playListName}
              playListTracks={this.state.playListTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
