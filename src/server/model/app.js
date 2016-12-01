import _ from "lodash";

import * as A from "../actions";
import { Dispatcher } from "../shared/dispatcher";
import { RoomBase } from "../lib/room";
import { Lobby } from "./lobby";
import { isDevelopment } from "../settings";

export class Application extends RoomBase {
  get view() {
    return {
      sets: this.cards.sets
    };
  }

  constructor(cards) {
    super(A.VIEW_APP);

    this.dispatcher = new Dispatcher();
    this.cards = cards;
    this.lobby = new Lobby(this);

    // if (isDevelopment) {
    //   this.dispatcher.on('*', (action) => {
    //     const separator = '---------------------------------------';
    //
    //     console.log(`\x1b[36m${separator}\x1b[0m`);
    //
    //     if (action.hasOwnProperty('status')) {
    //       switch (action.status) {
    //         case A.STATUS_REQUEST:
    //           console.log(`\x1b[30m\x1b[45m${action.type}\x1b[0m\x1b[0m`);
    //           break;
    //         case A.STATUS_FAIL:
    //           console.log(`\x1b[30m\x1b[41m${action.type}\x1b[0m\x1b[0m`);
    //           break;
    //         case A.STATUS_SUCCESS:
    //           console.log(`\x1b[30m\x1b[42m${action.type}\x1b[0m\x1b[0m`);
    //           break;
    //       }
    //     } else {
    //       console.log(`\x1b[30m\x1b[47m${action.type}\x1b[0m\x1b[0m`);
    //     }
    //
    //     const result = _.omit(action, ['type', 'status']);
    //
    //     if (_.keys(result).length) {
    //       console.log(result);
    //     } else {
    //       console.log('No result made');
    //     }
    //
    //     console.log(`\x1b[36m${separator}\x1b[0m`);
    //   });
    //
    //   this.dispatcher.emit('*', (action) => {
    //
    //     const separator = '---------------------------------------';
    //
    //     console.log(`\x1b[36m${separator}\x1b[0m`);
    //
    //     if (action.hasOwnProperty('status')) {
    //       switch (action.status) {
    //         case A.STATUS_REQUEST:
    //           console.log(`\x1b[30m\x1b[45m${action.type}\x1b[0m\x1b[0m`);
    //           break;
    //         case A.STATUS_FAIL:
    //           console.log(`\x1b[30m\x1b[41m${action.type}\x1b[0m\x1b[0m`);
    //           break;
    //         case A.STATUS_SUCCESS:
    //           console.log(`\x1b[30m\x1b[42m${action.type}\x1b[0m\x1b[0m`);
    //           break;
    //       }
    //     } else {
    //       console.log(`\x1b[30m\x1b[47m${action.type}\x1b[0m\x1b[0m`);
    //     }
    //
    //     const result = _.omit(action, ['type', 'status']);
    //
    //     if (_.keys(result).length) {
    //       console.log(result);
    //     } else {
    //       console.log('No result made');
    //     }
    //
    //     console.log(`\x1b[36m${separator}\x1b[0m`);
    //   });
    // }
  }
}