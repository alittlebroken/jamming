import React from 'react';
import './SearchResults.css';
import { TrackList } from '../TrackList/TrackList.js';

export class SearchResults extends React.Component{

  constructor(props){
    super(props);
  }

 render(){
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.foundTracks} onAdd={this.props.onAdd} isRemoval={false} />
      </div>
    )
  }

}
