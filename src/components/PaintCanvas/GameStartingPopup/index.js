import React, { Component } from "react";
import "./index.scss";
export default class index extends Component {
  render() {
    return (
      <div className="countdown__container">
        <div className="countdown__text">Game Starting In</div>
        <div className="countdown__number">{this.props.time} seconds.</div>
      </div>
    );
  }
}
