import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track.js';

export class TrackList extends React.Component {

  constructor(props){
    super(props);
  }

  render(){

    return (
      <div className="TrackList">

        { this.props.tracks ? (
          this.props.tracks.map((track) => (
            <Track
              track={track}
              key={track.id}
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              isRemoval={this.props.isRemoval}
            />

          ))
        ) : (
          <h2>No results found</h2>
        )}
      </div>
    )
  }
}
