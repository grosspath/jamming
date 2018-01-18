import React from 'react';
import './playList.css';
import TrackList from '../trackList/trackList';

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(evt) {
    evt.preventDefault();
    this.props.onNameChange(evt.target.value)
  }

  render() {
    return(
      <div className="Playlist">
        <input
          value={this.props.playListName}
          onChange={this.handleNameChange}/>
          <TrackList tracks={this.props.playListTracks} onRemove={this.props.onRemove} />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
};

export default PlayList;
