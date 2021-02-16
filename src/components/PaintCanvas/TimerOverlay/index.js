import React, { Component } from "react";
import "./index.scss";
export default class index extends Component {
  render() {
    return (
      <div className="timer__container">
        <div className="timer__value">{this.props.timerValue}</div>
      </div>
    );
  }
}
