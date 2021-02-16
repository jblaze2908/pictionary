import React, { Component } from "react";
import "./App.scss";
import socket from "./config/socket";
import { Switch, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import PaintCanvas from "./components/PaintCanvas";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loadRoomDetails } from "./actions";
class App extends Component {
  socket;
  componentDidMount = () => {
    this.connectToSocket();
  };
  connectToSocket = () => {
    this.socket = socket;
    this.socket.on("connect", () => {
      this.setState({ connected: true });
      this.configSession();
      let name = sessionStorage.getItem("username") || "";
      if (name) {
        this.setUsername(name);
      }
    });
  };
  configSession = () => {
    let sessionId = sessionStorage.getItem("uuid") || "";
    console.log("found id " + sessionId);
    this.socket.emit("configSession", sessionId, (response) => {
      if (response.status === 200) {
        this.socket.sessionId = response.sessionId;
        sessionStorage.setItem("uuid", response.sessionId);
        if (response.roomDetails) {
          this.props.loadRoomDetails(response.roomDetails);
        }
      }
    });
  };
  setUsername = (username) => {
    let sessionId = sessionStorage.getItem("uuid") || "";
    sessionStorage.setItem("username", username);
    this.socket.emit("setUsername", sessionId, username, (response) => {
      if (response.status === 200) {
        this.socket.username = username;
        this.setState({
          username,
        });
      }
    });
  };

  // leaveRoom = () => {
  //   this.socket.emit("leaveRoom", (response) => {
  //     if (response.status === 200) {
  //       this.props.history.push("/");
  //     }
  //   });
  // };
  render() {
    return (
      // <PaintCanvas />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <Homepage
              username={
                this.socket ? this.socket.username || this.state.username : ""
              }
              setUsername={this.setUsername}
              {...props}
            />
          )}
        />
        <Route path="/:roomId" render={(props) => <PaintCanvas {...props} />} />
      </Switch>
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
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
