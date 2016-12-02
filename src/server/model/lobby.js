import _ from "lodash";

import * as A from "../actions";
import { RoomBase } from "../lib/room";
import { Game } from "./game";
import { User } from "./user";

export class Lobby extends RoomBase {
  get view() {
    return {
      messages: this.messages.slice(),
      users: this.users.map((user) => user.summary),
      games: this.games.map((game) => game.summary)
    };
  }

  constructor(app) {
    super(A.VIEW_LOBBY);

    this.messages = [];
    this.games = [];
    this.users = [];
    this.application = app;
    this._nextGameId = 1000;

    app.dispatcher.on({
      [A.GAME_DISPOSED]: ({ gameId }) => this.removeGame(gameId),

      [A.GAME_SUMMARY_CHANGED]: () => this._tick(),

      [A.USER_DISPOSED]: ({ userId }) => {
        const userIndex = _.findIndex(this.users, { id: userId });

        if (userIndex == -1)
          return;

        this._tick(() => this.users.splice(userIndex, 1));
      }
    });
  }

  sendMessage(client, message) {
    if (!client.isLoggedIn)
      throw new Error('Client must be logged in');

    this._tick(() => {
      this.messages.push({
        index: this.messages.length + 1,
        user: {
          name: client.name,
          color: client.color
        },
        date: Date.now(),
        message
      });
    });
  }

  addUser(id, name) {
    this._ensureActive();

    const user = new User(this, id, name);

    this._tick(() => {
      this.users.push(user);
    });

    return user;
  }

  createGame(title) {
    const game = new Game(this._nextGameId++, title, this.application);

    this._tick(() => this.games.push(game));

    return game;
  }

  removeGame(gameId) {
    this._tick(() => _.remove(this.games, { id: gameId }));
  }

  getGameById(gameId) {
    return _.find(this.games, { id: gameId });
  }

  _ensureActive() {
    if (this.isDisposed)
      throw new Error('Lobby is disposed');
  }
}