import * as A from "../actions";
import { RoomBase } from "../lib/room";

export class User extends RoomBase {
  get view() {
    return {
      id: this.id,
      name: this.name
    };
  }

  get summary() {
    return {
      id: this.id,
      name: this.name
    };
  }

  constructor(lobby, id, name) {
    super(A.VIEW_PLAYER);

    this.name = name;
    this.id = id;
    this.lobby = lobby;
    this._isDisposed = false;
  }

  dispose() {
    if (this._isDisposed)
      return;

    this._isDisposed = true;
    this.lobby.application.dispatcher.emit(A.userDisposed(this.id));
  }
}
