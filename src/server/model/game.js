import _ from "lodash";

import * as A from "../actions";
import { Validator } from "../shared/validation";
import { RoomBase } from "../lib/room";
import { Player } from "./player";

export const MINIMUM_PLAYERS = 2;

export class Game extends RoomBase {
  get view() {
    return {
      id: this.id,
      title: this.title,
      step: this.step,
      options: this.options,
      players: this.players.map((player) => player.summary),
      messages: this.messages.slice(),
      round: this.round && this.round.view,
      timer: this.timer
    };
  }

  get summary() {
    return {
      id: this.id,
      title: this.title,
      players: this.players.map((player) => player.name),
      step: this.step,
      round: this.round
    };
  }

  get isDisposed() {
    return this.step == A.STEP_DISPOSED;
  }

  constructor(id, title, app) {
    super(A.VIEW_GAME);
    this.id = id;
    this.title = title;
    this.application = app;
    this.players = [];
    this.step = A.STEP_SETUP;
    this.messages = [];
    this.round = null;
    this.options = {
      scoreLimit: 5,
      sets: app.cards.sets.map((s) => s.id)
    };

    app.dispatcher.on(A.PLAYER_DISPOSED, ({ gameId, playerId }) => {
      if (gameId != this.id)
        return;

      const playerIndex = _.find(this.players, { id: playerId });

      if (playerIndex == -1)
        return;

      this._tick(() => this.players.splice(playerIndex, 1));
      this.application.dispatcher.emit(A.gameSummaryChanged(this.id, this.summary));
    });
  }

  addPlayer(id, name) {
    this._ensureActive();

    const player = new Player(this, id, name);

    this._tick(() => this.players.push(player));
    this.application.dispatcher.emit(A.gameSummaryChanged(this.id, this.summary));

    return player;
  }

  sendMessage(client, message) {
    this._ensureActive();

    this._tick(() => {
      this.messages.push({
        index: this.messages.length + 1,
        name: client.name,
        date: Date.now(),
        message
      });
    });
  }

  setOptions(options) {
    this._ensureActive();

    const validator = new Validator();
    validator.assert(options.scoreLimit >= 3 && options.scoreLimit <= 50, 'Score limit must be between 3 and 50');

    if (validator.didFail)
      return validator;

    this._tick(() => this.options = { scoreLimit: options.scoreLimit, sets: options.sets });
    return validator;
  }

  dispose() {
    if (this.step == A.STEP_DISPOSED)
      return;

    this._tick(() => this.step = A.STEP_DISPOSED);

    this.application.dispatcher.emit(A.gameDisposed(this.id));
  }

  _ensureActive() {
    if (this.isDisposed)
      throw new Error('Game has already been disposed');
  }
}