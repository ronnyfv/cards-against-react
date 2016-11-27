import { Observable, BehaviorSubject } from "rxjs";
import _ from "lodash";

import { mapOp$ } from "shared/observable";
import * as A from "../actions";
import { Validator } from "shared/validation";
import { validateMessage } from "shared/validation/chat";

const defaultView = {
  id: 42,
  title: 'Tester game',
  step: A.STEP_SETUP,
  options: {
    scoreLimit: 5,
    sets: ['1ed']
  },
  players: [
    { id: 1, name: 'Nelson', score: 40, isCzar: false, isPlaying: false, isWinner: true },
    { id: 2, name: 'Blegh', score: 11, isCzar: false, isPlaying: true, isWinner: false },
    { id: 3, name: 'Whoa', score: 14, isCzar: true, isPlaying: false, isWinner: false },
    { id: 4, name: 'Stuff', score: 23, isCzar: false, isPlaying: false, isWinner: false },
    { id: 5, name: 'Maria', score: 33, isCzar: false, isPlaying: false, isWinner: false },
    { id: 6, name: 'Lucas', score: 1, isCzar: false, isPlaying: false, isWinner: false }
  ],
  round: null,
  timer: null
};

const defaultPlayerView = {
  id: 1,
  hand: [],
  stack: null
};

export default class GameStore {
  constructor({dispatcher}, user) {

    dispatcher.onRequest({
      [A.GAME_CREATE]: (action) => {
        dispatcher.succeed(action);
        dispatcher.succeed(A.gameJoin(42));
      },
      [A.GAME_JOIN]: (action) => {
        dispatcher.succeed(action);
      },
      [A.GAME_SET_OPTIONS]: (action) => {
        dispatcher.succeed(action);
      },
      [A.GAME_START]: (action) => {
        dispatcher.succeed(action);
      },
      [A.GAME_SELECT_CARD]: (action) => {
        dispatcher.succeed(action);
      },
      [A.GAME_SELECT_STACK]: (action) => {
        dispatcher.succeed(action);
      },
      [A.GAME_SEND_MESSAGE]: (action) => {
        const validator = new Validator();

        validator.push(validateMessage(action.message));

        if (validator.didFail) {
          dispatcher.fail(action, validator.message);
          return;
        }

        dispatcher.succeed(action);
      }
    });

    this.view$ = new BehaviorSubject(defaultView);

    this.player$ = new BehaviorSubject(defaultPlayerView);

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