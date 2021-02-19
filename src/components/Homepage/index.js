import React, { Component } from "react";
import ReactModal from "react-modal";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { leaveRoom, loadRoomDetails } from "../../actions/index";
import socket from "../../config/socket";
import "./index.scss";
let timeout = null;
class index extends Component {
  socket;
  constructor(props) {
    super(props);
    this.state = {
      roomId: "",
      showJoinModal: false,
      username: this.props.username || "",
      wiggleButton: false,
    };
  }
  componentDidMount = () => {
    this.socket = socket;
    if (this.props.room.roomId) {
      this.props.leaveRoom();
      this.socket.emit("leaveRoom", (response) => {
        // if (response.status === 200) {
        // }
      });
    }
  };
  toggleJoinModal = () => {
    if (this.state.username)
      this.setState({ showJoinModal: !this.state.showJoinModal });
  };
  handleFormChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
    if (evt.target.name === "username") {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.props.setUsername(evt.target.value);
      }, 500);
    }
  };
  joinRoom = (room) => {
    let status;
    console.log(room);
    this.socket.emit("joinRoom", room, (response) => {
      status = response.status;
      console.log(response);
      if (status === 200) {
        this.props.loadRoomDetails(response.roomDetails);
        this.props.history.push("/" + response.roomId);
      }
    });
    if (status === 404) {
      return false;
    }
  };
  joinRoomClick = () => {
    if (this.state.roomId) {
      let status = this.joinRoom(this.state.roomId);
      if (!status) {
        this.setState({ wiggleButton: true });
      }
    }
  };
  createRoom = () => {
    if (this.state.username) {
      this.socket.emit("createRoom", (response) => {
        console.log(response);
        if (response.status === 200) {
          // console.log(response);
          this.props.loadRoomDetails(response.roomDetails);
          this.props.history.push("/" + response.roomId);
        } else if (response.status === 220) {
          alert("Already in " + response.roomId);
        }
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.username !== prevProps.username) {
      this.setState({ username: this.props.username });
    }
  };
  render() {
    return (
      <div className="homepage__container">
        <div className="homepage__header">Online Pictionary</div>
        <div className="homepage__username">
          <input
            type="text"
            className="homepage__username-textfield"
            value={this.state.username}
            onChange={this.handleFormChange}
            placeholder="Enter Nickname"
            name="username"
          />
        </div>
        <div className="homepage__btns">
          {/* <div
            className="homepage__btns-public homepage__btns-btn"
            style={{ cursor: this.state.username ? "pointer" : "not-allowed" }}
          >
            Quick Play
          </div> */}
          <div
            className="homepage__btns-create homepage__btns-btn"
            style={{ cursor: this.state.username ? "pointer" : "not-allowed" }}
            onClick={this.createRoom}
          >
            Create Room
          </div>
          <div
            className="homepage__btns-join homepage__btns-btn"
            style={{ cursor: this.state.username ? "pointer" : "not-allowed" }}
            onClick={this.toggleJoinModal}
          >
            Join Room
          </div>
        </div>
        <ReactModal
          isOpen={this.state.showJoinModal}
          ariaHideApp={false}
          onRequestClose={this.toggleJoinModal}
          overlayClassName="homepage__modal-overlay"
          className="homepage__modal"
        >
          <div className="homepage__modal-container">
            <div className="homepage__modal-header">Enter Room ID</div>
            <input
              type="text"
              className="homepage__modal-textfield"
              value={this.state.roomId}
              name="roomId"
              onChange={this.handleFormChange}
            />
            <button
              className={
                "homepage__modal-btn" +
                (this.state.wiggleButton ? " wigglebtn" : "")
              }
              onClick={this.joinRoomClick}
              onAnimationEnd={() => this.setState({ wiggleButton: false })}
            >
              Join Room
            </button>
          </div>
        </ReactModal>
        <div className="homepage__version">v0.13</div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    room: state.room,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loadRoomDetails,
      leaveRoom,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
