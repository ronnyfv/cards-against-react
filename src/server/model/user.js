import _ from "lodash";

import * as A from "../actions";
import { RoomBase } from "../lib/room";

export class User extends RoomBase {
  get view() {
    return {
      id: this.id,
      name: this.name,
      color: this.color
    };
  }

  get summary() {
    return {
      id: this.id,
      name: this.name,
      color: this.color
    };
  }

  constructor(lobby, id, name) {
    super(A.VIEW_PLAYER);

    this.name = name;
    this.id = id;
    this.color = this.getColorForUsername(name);
    this.lobby = lobby;
    this._isDisposed = false;
  }

  dispose() {
    if (this._isDisposed)
      return;

    this._isDisposed = true;
    this.lobby.application.dispatcher.emit(A.userDisposed(this.id));
  }

  getColorForUsername(username) {
    // let hash = _.reduce(username, (hashRed, ch) => ch.charCodeAt(0) + (hashRed << 6) + (hashRed << 16) - hashRed, 0);
    //
    // hash = Math.abs(hash);
    // const hue = hash % 360;
    // const saturation = hash % 25 + 70;
    // const lightness = 100 - (hash % 15 + 35);
    //
    // return `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
}
