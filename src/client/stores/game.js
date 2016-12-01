import { Observable } from "rxjs";
import _ from "lodash";

import { mapOp$ } from "shared/observable";
import * as A from "../actions";
import { Validator } from "shared/validation";
import { validateMessage } from "shared/validation/chat";
import { createView$ } from "../lib/stores";

const defaultView = {
  id: null,
  title: null,
  step: A.STEP_DISPOSED,
  options: {},
  players: [],
  messages: [],
  round: null,
  timer: null
};

const defaultPlayerView = {
  id: null,
  hand: [],
  stack: null
};

export default class GameStore {
  constructor({ dispatcher, socket }, user) {

    const passThoughAction = (action) => socket.emit('action', action);

    dispatcher.onRequest({
      [A.GAME_CREATE]: passThoughAction,
      [A.GAME_JOIN]: passThoughAction,
      [A.GAME_SET_OPTIONS]: passThoughAction,
      [A.GAME_START]: passThoughAction,
      [A.GAME_SELECT_CARD]: passThoughAction,
      [A.GAME_SELECT_STACK]: passThoughAction,
      [A.GAME_SEND_MESSAGE]: (action) => {
        const validator = new Validator();

        validator.push(validateMessage(action.message));

        if (validator.didFail) {
          dispatcher.fail(action, validator.message);
          return;
        }

        passThoughAction(action);
      }
    });

    this.view$ = createView$(dispatcher, A.VIEW_GAME, defaultView);
    this.player$ = createView$(dispatcher, A.VIEW_PLAYER, defaultPlayerView);

    const isLoggedIn$ = user.details$.map((d) => d.isLoggedIn);

    this.opCreateGame$ = mapOp$(
      dispatcher.on$(A.GAME_CREATE),
      isLoggedIn$
    );

    this.opJoinGame$ = mapOp$(
      dispatcher.on$(A.GAME_JOIN)
    );

    this.opSetOptions$ = mapOp$(
      dispatcher.on$(A.GAME_SET_OPTIONS),
      isLoggedIn$
    );

    this.opStart$ = mapOp$(
      dispatcher.on$(A.GAME_START),
      isLoggedIn$
    );

    const playerAndGame$ = Observable.combineLatest(this.view$, this.player$);

    this.opSelectCard$ = mapOp$(
      dispatcher.on$(A.GAME_SELECT_CARD),
      playerAndGame$.map(([game, player]) => {
        const ourPlayer = _.find(game.players, { id: player.id });
        return ourPlayer && game.step == A.STEP_CHOOSE_WHITES && ourPlayer.isPlaying;
      })
    );

    this.opSelectStack$ = mapOp$(
      dispatcher.on$(A.GAME_SELECT_STACK),
      playerAndGame$.map(([game, player]) => {
        const ourPlayer = _.find(game.players, { id: player.id });
        return ourPlayer && game.step == A.STEP_JUDGE_STACKS && ourPlayer.isCzar;
      })
    );

    this.opSendMessage$ = mapOp$(
      dispatcher.on$(A.GAME_SEND_MESSAGE),
      isLoggedIn$
    );
  }
}