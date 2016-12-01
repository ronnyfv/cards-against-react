import _ from "lodash";
import { Observable, BehaviorSubject } from "rxjs";

import * as A from "../actions";
import { createView$ } from "../lib/stores";

const defaultView = {
  sets: []
};

export default class AppStore {
  constructor({ dispatcher, socket }) {
    this.view$ = createView$(dispatcher, A.VIEW_APP, defaultView);

    this.dialogs$ = dispatcher
      .on$(A.DIALOG_SET)
      .scan((stack, action) => {
        _.remove(stack, { id: action.id });

        if (action.isOpen)
          stack.push({ id: action.id, props: action.props });

        return stack;
      }, [])
      .startWith([])
      .publishReplay(1);

    this.dialogs$.connect();

    socket.on('connect', () => dispatcher.emit(A.appConnectionSet(A.CONNECTION_CONNECTED)));
    socket.on('reconnection', () => dispatcher.emit(A.appConnectionSet(A.CONNECTION_RECONNECTING)));
    socket.on('disconnect', () => dispatcher.emit(A.appConnectionSet(A.CONNECTION_DISCONNECTED)));
    socket.on('reconnect', () => dispatcher.emit(A.appConnectionReconnected(A.CONNECTION_CONNECTING)));

    this.connection$ = dispatcher
      .on$(A.APP_CONNECTION_SET)
      .startWith(socket.connected ? A.CONNECTION_CONNECTED : A.CONNECTION_DISCONNECTED)
      .publishReplay(1);
    this.connection$.connect();

    this.reconnected$ = dispatcher.on$(A.APP_CONNECTION_RECONNECTED).publish();
    this.reconnected$.connect();
  }
}