import { Observable } from "rxjs";

import { Validator } from "shared/validation";
import { validateMessage } from "shared/validation/chat";
import { mapOp$ } from "shared/observable";
import * as A from "../actions";

const defaultView = {
  messages: [
    { index: 1, name: 'Person 1', message: 'Teste 1' },
    { index: 2, name: 'Person 2', message: 'Teste 2' },
    { index: 3, name: 'Person 3', message: 'Teste 3' },
    { index: 4, name: 'Person 4', message: 'Teste 4' },
    { index: 5, name: 'Person 5', message: 'Teste 5' },
    { index: 6, name: 'Person 6', message: 'Teste 6' }
  ],
  games: [
    { title: 'Game 1', id: 1, players: ['one', 'two', 'three'] },
    { title: 'Game 2', id: 2, players: ['one', 'two', 'three'] },
    { title: 'Game 3', id: 3, players: ['one', 'two', 'three'] },
    { title: 'Game 4', id: 4, players: ['one', 'two', 'three'] },
    { title: 'Game 5', id: 5, players: ['one', 'two', 'three'] }
  ]
};

export default class LobbyStore {
  constructor({dispatcher}, user) {
    this.view$ = Observable.of(defaultView);

    dispatcher.onRequest({
      [A.LOBBY_JOIN]: (action) => {
        dispatcher.succeed(action);
      },
      [A.LOBBY_SEND_MESSAGE]: (action) => {
        const validator = new Validator();

        if (!user.isLoggedIn)
          validator.push('You must be logged in!');

        validator.push(validateMessage(action.message));

        if (validator.didFail) {
          dispatcher.fail(action, validator.message);
          return;
        }

        // TODO: SEND TO SOCKET
      }
    });

    this.opSendMessage$ = mapOp$(
      dispatcher.on$(A.LOBBY_SEND_MESSAGE),
      user.details$.map((u) => u.isLoggedIn)
    );
  }
}