import React, { Component } from "react";
import TimerOverlay from "../TimerOverlay";
import socket from "../../../config/socket";
import "./index.scss";
class index extends Component {
  constructor(props) {
    super(props);
  }
  canvasCase = 0;
  socket;
  isPainting = false;
  prevPos = { offsetX: 0, offsetY: 0 };
  line = [];
  componentDidMount = () => {
    this.socket = socket;
    this.updateDimensions();
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = this.props.size;
    this.socket.on("drawDataServer", (data) => {
      this.paintRecievedData(data);
    });
    if (this.props.currentBoard.length !== 0) {
      this.props.currentBoard.forEach((line) => {
        this.paintRecievedData(line);
      });
    }
    window.addEventListener("resize", this.updateDimensions);
  };
  componentDidUpdate(prevProps) {
    if (
      this.props.currentBoard !== prevProps.currentBoard &&
      prevProps.currentBoard.length === 0
    ) {
      this.props.currentBoard.forEach((line) => {
        this.paintRecievedData(line);
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  };
  restoreCanvas = () => {
    if (this.ctx && this.canvas) {
      this.line.forEach((line) => {
        this.paintRecievedData(line, true);
      });
    }
  };
  getCanvasSizeCase = () => {
    let canvasCase = 0;
    let width = window.innerWidth;
    if (width > 1000) {
      canvasCase = 1;
    } else if (width > 900 && width <= 1000) {
      canvasCase = 2;
    } else if (width > 840 && width <= 900) {
      canvasCase = 3;
    } else if (width > 800 && width <= 840) {
      canvasCase = 4;
    } else if (width > 670 && width <= 800) {
      canvasCase = 5;
    } else if (width > 615 && width <= 670) {
      canvasCase = 6;
    } else if (width > 570 && width <= 615) {
      canvasCase = 7;
    } else if (width > 470 && width <= 570) {
      canvasCase = 8;
    } else if (width > 420 && width <= 470) {
      canvasCase = 9;
    } else if (width > 360 && width <= 420) {
      canvasCase = 10;
    } else {
      canvasCase = 11;
    }
    return canvasCase;
  };
  getSizeAccordingToCase = (canvasCase) => {
    let size;
    switch (canvasCase) {
      case 1:
        size = 610;
        break;
      case 2:
        size = 600;
        break;
      case 3:
        size = 560;
        break;
      case 4:
        size = 530;
        break;
      case 5:
        size = 610;
        break;
      case 6:
        size = 555;
        break;
      case 7:
        size = 500;
        break;
      case 8:
        size = 410;
        break;
      case 9:
        size = 355;
        break;
      case 10:
        size = 320;
        break;
      case 11:
        size = 280;
        break;
    }
    return size;
  };
  setCanvasSize = (size, canvasCase) => {
    if (this.canvas) {
      this.canvas.height = size;
      this.canvas.width = size;
      this.canvasCase = canvasCase;
    }
  };
  updateDimensions = (first) => {
    let canvasCase = this.getCanvasSizeCase();
    if (canvasCase !== this.canvasCase) {
      let size = this.getSizeAccordingToCase(canvasCase);
      this.setCanvasSize(size, canvasCase);
      this.restoreCanvas();
    }
  };
  onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (this.props.canIDraw) this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  };
  // onMouseMove = (e) => {
  //
  // };

  onMouseMove = (e) => {
    const { nativeEvent } = e;
    if (this.isPainting) {
      let { offsetX, offsetY } = nativeEvent;
      if (!offsetX) {
        if (!e.targetTouches) return;
        let bcr = e.target.getBoundingClientRect();
        let x = e.targetTouches[0].clientX - bcr.x;
        let y = e.targetTouches[0].clientY - bcr.y;
        offsetX = x;
        offsetY = y;
      }
      const offSetData = { offsetX, offsetY };
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
        color: this.props.color,
        size: this.props.size,
        mode: this.props.mode,
        canvasCase: this.canvasCase,
      };
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.props.color);
    }
  };
  paintRecievedData = (data, backedUpCanvas) => {
    if (data.clear) {
      this.props.clearBoard();
      return;
    }
    let size = this.getSizeAccordingToCase(this.canvasCase);
    let ratio = size / this.getSizeAccordingToCase(data.canvasCase);

    let offsetX, offsetY, x, y;
    if (backedUpCanvas) {
      x = data.start.offsetX * ratio;
      y = data.start.offsetY * ratio;
      offsetX = data.stop.offsetX * ratio;
      offsetY = data.stop.offsetY * ratio;
    } else {
      offsetX = data.offsetX * ratio;
      offsetY = data.offsetY * ratio;
      x = data.x * ratio;
      y = data.y * ratio;
    }
    this.ctx.lineWidth = data.size;
    if (data.mode === "pen") {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.beginPath();
      this.ctx.strokeStyle = data.color;
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
    } else {
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
    }
    const offSetData = { offsetX, offsetY };
    const positionData = {
      start: { offsetX: x, offsetY: y },
      stop: { ...offSetData },
      color: data.color,
      size: data.size,
      mode: data.mode,
      canvasCase: data.canvasCase,
    };
    if (!backedUpCanvas) this.line = this.line.concat(positionData);
    this.prevPos = { offsetX, offsetY };
  };

  paint = (prevPos, currPos, strokeStyle) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    this.ctx.lineWidth = this.props.size;
    if (this.props.mode === "pen") {
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.beginPath();
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
    } else {
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
    }
    this.sendPaintData(
      x,
      y,
      offsetX,
      offsetY,
      strokeStyle,
      this.props.mode,
      this.props.size,
      this.canvasCase
    );

    this.prevPos = { offsetX, offsetY };
  };
  endPaintEvent = () => {
    if (this.isPainting) {
      this.isPainting = false;
      // this.sendPaintData();
    }
  };
  sendPaintData = (x, y, offsetX, offsetY, color, mode, size, canvasCase) => {
    let data = { x, y, offsetX, offsetY, color, mode, size, canvasCase };
    this.props.sendPaintData(data);
  };

  render() {
    return (
      <div
        className="canvas__container"
        onMouseUp={this.endPaintEvent}
        ref={(ref) => (this.canvasContainer = ref)}
      >
        <TimerOverlay timerValue={this.props.timerValue} />
        <canvas
          ref={(ref) => (this.canvas = ref)}
          className="canvas"
          id="canvas"
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onMouseDown}
          onMouseMove={(e) => {
            // e.preventDefault();

            this.onMouseMove(e);
          }}
          onTouchMove={(e) => {
            // e.preventDefault();
            // console.log

            this.onMouseMove(e);
          }}
          onTouchEnd={(e) => {
            // e.preventDefault();
            this.endPaintEvent(e);
          }}
          onMouseUp={this.endPaintEvent}
          onMouseLeave={this.endPaintEvent}
        ></canvas>
      </div>
    );
  }
}
export default index;
