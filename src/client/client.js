import "./client.scss";

import React from "react";
import ReactDOM from "react-dom";

import { Router, browserHistory } from "react-router";


//
// ─── RENDER ─────────────────────────────────────────────────────────────────────
//

function init() {
  const routes = require("./routes").default();

  ReactDOM.render(
    <Router history={browserHistory}>
      {routes}
    </Router>,
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