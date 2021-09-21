import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { PlayList } from '../PlayList/PlayList.js';
import { Spotify } from '../../util/Spotify.js';

class App extends React.Component{

  constructor(props){
    super(props);

    this.state = { searchResults: [],
    playlistName: 'default',
    playlistTracks: []
    };

    this.spotify = new Spotify();

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(name){
    this.setState({ playlistName: name });
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;

    if(tracks.find( savedTrack => savedTrack.id === track.id )){
        tracks.pop(track);
    }

    this.setState({
      playlistTracks: tracks
    });
  }

  addTrack(track){

    let tracks = this.state.playlistTracks;

    if(tracks.find( savedTrack => savedTrack.id === track.id )){
      return;
    }

    tracks.push(track);

    /* Update the component state */
    this.setState({
      playlistTracks: tracks
    });

  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map( track => track.uri );
    this.spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  async search(term) {
    let gatherData = async () => {
      let results = await this.spotify.search(term);
      return results;
    }

    await gatherData()
    .then( res => {
      this.setState({searchResults: res });
    })
    .catch( err => {
        console.log(err);
        return;
    })
  }


  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-Playlist">

            <SearchResults
              foundTracks={this.state.searchResults}
              onAdd={this.addTrack}
            />

            <PlayList
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onSave={this.savePlaylist}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
