import React, { Component } from "react";
import "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }
  handleFormChange = (e) => {
    this.setState({ text: e.target.value });
  };
  render() {
    return (
      <div className="paintcanvas__right-chats">
        <div className="paintcanvas__right-chats-heading">Chats</div>
        <div className="paintcanvas__right-chats-container">
          {this.props.chats.map((chat) => {
            if (chat.sender)
              return (
                <div
                  className="paintcanvas__right-chats-chat"
                  key={chat.sender + chat.text}
                >
                  <div className="paintcanvas__right-chats-chat-sender">
                    {chat.sender}
                  </div>
                  <div className="paintcanvas__right-chats-chat-message">
                    {chat.text}
                  </div>
                </div>
              );
            else
              return (
                <div
                  className="paintcanvas__right-chats-special"
                  key={chat.sender + chat.text}
                >
                  {/* <div className="paintcanvas__right-chats-chat-sender">Jai</div> */}
                  <div className="paintcanvas__right-chats-chat-message">
                    {chat.text}
                  </div>
                </div>
              );
          })}
        </div>
        <div className="paintcanvas__right-chats-input">
          <input
            type="text"
            className="paintcanvas__right-chats-input-textfield"
            placeholder="Guess the Word and press ↵"
            onChange={this.handleFormChange}
            value={this.state.text}
            onKeyPress={(e) => {
              let keyCode = e.code || e.key;
              if (keyCode == "Enter") {
                // Enter pressed
                this.props.sendChatMsg(this.state.text);
                this.setState({ text: "" });
                return false;
              }
            }}
          />
        </div>
      </div>
    );
  }
}
