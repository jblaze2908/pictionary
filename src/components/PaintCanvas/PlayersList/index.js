import React, { Component } from "react";
import "./index.scss";
export default class index extends Component {
  render() {
    return (
      <div className="paintcanvas__right-playerlist-container">
        <div className="paintcanvas__right-playerlist-heading">Players</div>
        <div className="paintcanvas__right-playerlist">
          {this.props.players.map((player) => (
            <div
              className="paintcanvas__right-playerlist-player"
              key={player.sessionId}
            >
              <div className="paintcanvas__right-playerlist-player-name">
                {player.username}
              </div>
              <div className="paintcanvas__right-playerlist-player-score">
                {player.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
