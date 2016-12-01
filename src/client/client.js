import "./client.scss";

import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from "react-router";
import io from "socket.io-client";

import { Dispatcher } from "shared/dispatcher";
import * as A from "./actions";
import { StoreProvider } from "./lib/component";
import createStores from "./stores";

//
// ─── SERVICES ───────────────────────────────────────────────────────────────────
//

const dispatcher = new Dispatcher();
const socket = io();
const services = { dispatcher, socket };

if (IS_DEVELOPMENT) {
  dispatcher.on('*', printAction);
}

socket.on('action', (action) => dispatcher.emit(action));

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── STORES ─────────────────────────────────────────────────────────────────────
//

const stores = createStores(services);

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── RENDER ─────────────────────────────────────────────────────────────────────
//

function init() {
  const routes = require("./routes").default();

  ReactDOM.render(
    <StoreProvider stores={stores} services={services}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </StoreProvider>,
    document.getElementById('app-root')
  );
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── MISC ───────────────────────────────────────────────────────────────────────
//

if (module.hot) {
  module.hot.accept('./routes', () => init());
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── START ──────────────────────────────────────────────────────────────────────
//

init();

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

function printAction(action) {
  if (action.hasOwnProperty('status')) {
    let style = null;

    switch (action.status) {
      case A.STATUS_REQUEST:
        style = 'color: blue';
        break;
      case A.STATUS_FAIL:
        style = 'color: red';
        break;
      case A.STATUS_SUCCESS:
        style = 'color: green';
        break;
    }

    console.log(`%c${action.type}`, `${style}; font-weight: bold; background: #eee; width: 100%; display: block;`);
  } else {
    console.log(`%c${action.type}`, 'background: #ddd');
  }

  const result = _.omit(action, ['type', 'status']);

  if (_.keys(result).length)
    console.log(result);
}

// ────────────────────────────────────────────────────────────────────────────────