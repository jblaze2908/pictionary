import React, { Component } from "react";
import "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sizeModal: false,
      colorModal: false,
    };
  }
  toggleSizeModal = () => {
    this.setState({
      sizeModal: !this.state.sizeModal,
      colorModal: false,
    });
  };
  toggleColorModal = () => {
    this.setState({
      colorModal: !this.state.colorModal,
      sizeModal: false,
    });
  };
  changeSize = (size) => {
    this.setState({ sizeModal: false });
    this.props.changeSize(size);
  };
  changeColor = (color) => {
    this.setState({ colorModal: false });
    this.props.changeColor(color);
  };
  colorOptions = [
    "#000000",
    "#575757",
    "#a0a0a0",
    "#9c28b1",
    "#9db0ff",
    "#2a4bd8",
    "#28d0d0",
    "#81c57a",
    "#4cb050",
    "#c6ff00",
    "#ffee34",
    "#ff9233",
    "#e8debb",
    "#804b19",
    "#f9bbd0",
    "#f44236",
    "#f9bbd0",
    "#ffffff",
  ];
  render() {
    return (
      <div className="canvasToolbar__container">
        <div className="canvasToolbar__btns">
          <button
            className={
              "canvasToolbar__btn canvasToolbar__btn-draw" +
              (this.props.mode === "pen" ? " canvasToolbar__btn-active" : "")
            }
            onClick={() => {
              this.props.togglePenEraser(true);
            }}
          >
            <i className="fas fa-pencil-alt" />
          </button>
          <button
            className={
              "canvasToolbar__btn canvasToolbar__btn-eraser" +
              (this.props.mode === "eraser" ? " canvasToolbar__btn-active" : "")
            }
            onClick={() => {
              this.props.togglePenEraser(false);
            }}
          >
            <i className="fas fa-eraser" />
          </button>
          <div className="canvasToolbar__btn-container">
            <button
              className={
                "canvasToolbar__btn canvasToolbar__btn-size" +
                (this.state.sizeModal ? " canvasToolbar__btn-active" : "")
              }
              onClick={this.toggleSizeModal}
            >
              <i className="fas fa-circle" />
            </button>
            <div
              className={
                "canvasToolbar__btn-modal" +
                (this.state.sizeModal ? " canvasToolbar__btn-modal-open" : "")
              }
            >
              <div className="canvasToolbar__btn-modal-arrow" />
              <div className="canvasToolbar__btn-modal-btns">
                <div
                  className={
                    "canvasToolbar__btn-modal-btn" +
                    (this.props.size === 5
                      ? " canvasToolbar__btn-modal-btn-active"
                      : "")
                  }
                  style={{ fontSize: ".6rem" }}
                  onClick={() => {
                    this.changeSize(5);
                  }}
                >
                  <i className="fas fa-circle" />
                </div>
                <div
                  className={
                    "canvasToolbar__btn-modal-btn" +
                    (this.props.size === 7
                      ? " canvasToolbar__btn-modal-btn-active"
                      : "")
                  }
                  style={{ fontSize: ".8rem" }}
                  onClick={() => {
                    this.changeSize(7);
                  }}
                >
                  <i className="fas fa-circle" />
                </div>
                <div
                  className={
                    "canvasToolbar__btn-modal-btn" +
                    (this.props.size === 10
                      ? " canvasToolbar__btn-modal-btn-active"
                      : "")
                  }
                  style={{ fontSize: "1rem" }}
                  onClick={() => {
                    this.changeSize(10);
                  }}
                >
                  <i className="fas fa-circle" />
                </div>
                <div
                  className={
                    "canvasToolbar__btn-modal-btn" +
                    (this.props.size === 14
                      ? " canvasToolbar__btn-modal-btn-active"
                      : "")
                  }
                  style={{ fontSize: "1.2rem" }}
                  onClick={() => {
                    this.changeSize(14);
                  }}
                >
                  <i className="fas fa-circle" />
                </div>
                <div
                  className={
                    "canvasToolbar__btn-modal-btn" +
                    (this.props.size === 19
                      ? " canvasToolbar__btn-modal-btn-active"
                      : "")
                  }
                  style={{ fontSize: "1.4rem" }}
                  onClick={() => {
                    this.changeSize(19);
                  }}
                >
                  <i className="fas fa-circle" />
                </div>
              </div>
            </div>
          </div>
          <div className="canvasToolbar__btn-container">
            <button
              className={
                "canvasToolbar__btn canvasToolbar__btn-size" +
                (this.state.colorModal ? " canvasToolbar__btn-active" : "")
              }
              onClick={this.toggleColorModal}
              style={{ color: this.props.color, fontSize: "1.7rem" }}
            >
              <i className="fas fa-circle" />
            </button>
            <div
              className={
                "canvasToolbar__btn-modal canvasToolbar__btn-modal-color" +
                (this.state.colorModal ? " canvasToolbar__btn-modal-open" : "")
              }
            >
              <div className="canvasToolbar__btn-modal-arrow" />
              <div className="canvasToolbar__btn-modal-btns canvasToolbar__btn-modal-btns-color">
                {this.colorOptions.map((color) => (
                  <div
                    className={
                      "canvasToolbar__btn-modal-btn canvasToolbar__btn-modal-btn-color" +
                      (this.props.color === color
                        ? " canvasToolbar__btn-modal-btn-active"
                        : "")
                    }
                    style={{ color: color }}
                    onClick={() => {
                      this.changeColor(color);
                    }}
                  >
                    <i className="fas fa-circle" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
