import _ from "lodash";

import * as A from "./actions";
import { Dispatcher } from "./shared/dispatcher";
import { isDevelopment } from "./settings";

export class DispatcherServer extends Dispatcher {
  constructor() {
    super();
  }

  invokeHandler(action, { statusFilter, callback }) {
    if (isDevelopment) {
      console.log(action);
      console.log(statusFilter);
      console.log(callback);

      const separator = '---------------------------------------';

      console.log(`\x1b[36m${separator}\x1b[0m`);

      if (action.hasOwnProperty('status')) {
        switch (action.status) {
          case A.STATUS_REQUEST:
            console.log(`\x1b[45m${action.type}\x1b[0m`);
            break;
          case A.STATUS_FAIL:
            console.log(`\x1b[41m${action.type}\x1b[0m`);
            break;
          case A.STATUS_SUCCESS:
            console.log(`\x1b[42m${action.type}\x1b[0m`);
            break;
        }
      } else {
        console.log(`\x1b[47m${action.type}\x1b[0m`);
      }

      const result = _.omit(action, ['type', 'status']);

      if (_.keys(result).length) {
        console.log(result);
      } else {
        console.log('No result made');
      }

      console.log(`\x1b[36m${separator}\x1b[0m`);
    }

    if (statusFilter && statusFilter != action.status)
      return;

    callback(action);
  }
}


