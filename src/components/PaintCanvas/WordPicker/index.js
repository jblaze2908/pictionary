import React, { Component } from "react";
import "./index.scss";
export default class index extends Component {
  render() {
    return (
      <div className="wordpicker__container">
        <div className="wordpicker__text">Choose a Word</div>
        <div className="wordpicker__words">
          {this.props.words.map((word) => (
            <div
              className="wordpicker__word"
              key={word + "-word"}
              onClick={() => {
                this.props.chooseWord(word);
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
