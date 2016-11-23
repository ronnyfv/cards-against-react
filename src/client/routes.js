import React from "react";
import { Route, IndexRoute, Redirect } from "react-router";

import AppContainer from "./components/app";
import Lobby from "./components/lobby";
import Game from "./components/game";

function requireAuth(nextState, replace) {
  console.log('realizando autenticação!');
}

export default function () {
  return (
    <Route path='/' component={AppContainer} onEnter={requireAuth}>
      <IndexRoute components={Lobby} />

      <Route path="/game/:gameId" components={Game} />

      <Redirect from="*" to="/" />
    </Route>
  );
}