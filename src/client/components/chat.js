import "./chat.scss";

import React, { Component, PropTypes } from "react";

import { TextInput } from "./controls";

export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    opSendMessage: PropTypes.object.isRequired,
    sendMessage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this._lastIndex = -1;

    this._sendMessage = (e) => {
      const { opSendMessage, sendMessage } = this.props;

      e.preventDefault();

      if (!opSendMessage.can)
        return;

      const message = this._text.value.trim();
      if (message.length == 0)
        return;

      sendMessage(message);
      this._text.value = "";
    };
  }

  componentDidUpdate() {
    const { messages } = this.props;

    if (messages.length == 0)
      return;

    const newIndex = messages[messages.length - 1].index;
    if (this._lastIndex == newIndex)
      return;

    this._messages.scrollTop = this._messages.scrollHeight;
    this._lastIndex = newIndex;
  }

  render() {
    const { messages, opSendMessage } = this.props;

    return (
      <section className="comp-chat">
        <ul className="messages" ref={(c) => this._messages = c}>
          {messages.map((message) =>
            <li key={message.index}>
              <span className="author" color={{color: message.user.color}}>{message.user.name}</span>
              <span className="message">{message.message}</span>
              <span className="date">{this.msToTime(message.date)}</span>
            </li>
          )}
        </ul>
        <form onSubmit={this._sendMessage}>
          <TextInput
            className="top-border"
            placeholder={opSendMessage.can ? "enter a message" : "please log in to chat"}
            ref={(c) => this._text = c}
            disabled={!opSendMessage.can}
          />
        </form>
      </section>
    );
  }

  msToTime(duration) {
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
  }
}