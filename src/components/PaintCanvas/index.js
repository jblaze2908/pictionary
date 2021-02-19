import React, { Component } from "react";
import Canvas from "./Canvas";
import CanvasToolbar from "./CanvasToolbar";
import PlayersList from "./PlayersList";
import Chats from "./Chats";
import WordPicker from "./WordPicker";
import GameStartingPopup from "./GameStartingPopup";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loadRoomDetails } from "../../actions/index";
import socket from "../../config/socket";
import ReactModal from "react-modal";
import "./index.scss";
class index extends Component {
  socket;
  constructor(props) {
    super(props);
    this.state = {
      pen: true,
      color: "#000000",
      size: 10,
      showChooseWordDialog: false,
      words: [],
      time: 0,
    };
  }
  componentDidMount = () => {
    this.socket = socket;
    // if (!this.props.room.roomId) {
    //   setTimeout(() => {
    //     this.socket.emit(
    //       "getRoomDetails",
    //       this.props.match.params.roomId,
    //       (response) => {
    //
    //         this.props.loadRoomDetails(response.roomDetails);
    //       }
    //     );
    //   }, 1000);
    // }
    this.socket.on("newChatMessage", (sender, text) => {
      console.log(this.props.room.chats);
      this.props.loadRoomDetails({
        ...this.props.room,
        chats: [...this.props.room.chats, { sender, text }],
      });
      // if (!sender) {
      //
      //   this.socket.emit("getRoomDetails", (response) => {
      //
      //     this.props.loadRoomDetails(response.roomDetails);
      //   });
      // }
    });
    this.socket.on("chooseWord", (words) => {
      this.setState({ words, showChooseWordDialog: true });
    });
    this.socket.on("nextRoundStarting", (username, sessionId) => {
      this.props.loadRoomDetails({
        ...this.props.room,
        timer: 60,
        currentBoard: [],
      });
    });
    this.socket.on("updateRound", (room) => {
      console.log(room);
      this.props.loadRoomDetails({ ...this.props.room, ...room });
      if (room.currentBoard && room.currentBoard.length === 0) {
        let canvas = document.querySelector("#canvas");
        if (canvas) {
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });
    this.socket.on("startingIn", (time) => {
      this.setState({ time: time });
    });
    this.socket.on("timerUpdate", (time) => {
      // this.props.loadRoomDetails({ ...this.props.room, timer: time });
    });
  };
  togglePenEraser = (pen) => {
    if (pen !== this.state.pen)
      this.setState({
        pen: !this.state.pen,
      });
  };
  changeSize = (size) => {
    this.setState({ size: size });
  };
  changeColor = (color) => {
    this.setState({ color: color });
  };
  sendChatMsg = (msg) => {
    this.socket.emit("newMessage", msg);
  };
  sendClearBoardReq = () => {
    this.socket.emit("drawData", { clear: true });
    this.clearBoard();
  };
  clearBoard = () => {
    let canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  sendPaintData = (data) => {
    this.socket.emit("drawData", data);
  };
  chooseWord = (word) => {
    this.socket.emit("chooseWord", word, (response) => {
      if (response.status === 200) {
        this.setState({
          showChooseWordDialog: false,
          words: [],
        });
      }
    });
  };
  getPlayerUsernameFromSessionId = (sessionId) => {
    let players = [...this.props.room.players];
    for (let player of players) {
      if (player.sessionId === sessionId) return player.username;
    }
  };
  canIDraw = () => {
    let sessionId = sessionStorage.getItem("uuid") || "";
    let room = this.props.room;
    if (room.players.length === 1) return true;
    else {
      if (room.roundDetails.length === 0) return true;
      let lsRound = room.roundDetails[room.roundDetails.length - 1];
      if (lsRound.chosenBy === sessionId && lsRound.chosenWord !== "")
        return true;
    }
    return false;
  };
  getHeaderText = () => {
    let sessionId = sessionStorage.getItem("uuid") || "";
    let room = this.props.room;
    if (room.players.length === 1) return "Waiting for players...";
    else {
      if (room.roundDetails.length === 0) return "";
      let lsRound = room.roundDetails[room.roundDetails.length - 1];
      if (lsRound.chosenBy === sessionId && lsRound.chosenWord === "")
        return "You are picking a word.";
      else if (lsRound.chosenBy === sessionId && lsRound.chosenWord !== "")
        return 'You are drawing "' + lsRound.chosenWord + '".';
      else if (lsRound.chosenBy !== sessionId && lsRound.chosenWord === "") {
        return (
          this.getPlayerUsernameFromSessionId(lsRound.chosenBy) +
          " is picking a word."
        );
      } else if (lsRound.chosenBy !== sessionId && lsRound.chosenWord !== "") {
        return (
          this.getPlayerUsernameFromSessionId(lsRound.chosenBy) +
          ' is drawing "' +
          lsRound.chosenWord +
          '".'
        );
      }
    }
  };
  render() {
    let canIDraw = this.canIDraw();
    let headerText = this.getHeaderText();
    return (
      <div className="paintcanvas__page">
        <div className="paintcanvas__container">
          <div className="paintcanvas__left">
            <div className="paintcanvas__left-heading">{headerText}</div>
            <Canvas
              mode={this.state.pen ? "pen" : "eraser"}
              color={this.state.color}
              size={this.state.size}
              sendPaintData={this.sendPaintData}
              currentBoard={this.props.room.currentBoard}
              timerValue={this.props.room.timer}
              canIDraw={canIDraw}
              clearBoard={this.clearBoard}
            />
            <CanvasToolbar
              togglePenEraser={this.togglePenEraser}
              mode={this.state.pen ? "pen" : "eraser"}
              color={this.state.color}
              size={this.state.size}
              changeSize={this.changeSize}
              changeColor={this.changeColor}
              clearBoard={this.sendClearBoardReq}
            />
          </div>
          <div className="paintcanvas__right">
            <PlayersList players={this.props.room.players} />
            <Chats
              chats={this.props.room.chats}
              sendChatMsg={this.sendChatMsg}
            />
          </div>
        </div>
        <ReactModal
          isOpen={
            this.state.showChooseWordDialog &&
            this.props.room.players.length !== 1
          }
          className="paintcanvas__modal"
          overlayClassName="paintcanvas__overlay"
        >
          <WordPicker words={this.state.words} chooseWord={this.chooseWord} />
        </ReactModal>
        <ReactModal
          isOpen={this.state.time !== 0}
          className="paintcanvas__modal"
          overlayClassName="paintcanvas__overlay"
        >
          <GameStartingPopup time={this.state.time} />
        </ReactModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { room: state.room };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ loadRoomDetails }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
