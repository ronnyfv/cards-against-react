import React from "react";
import { Route, IndexRoute, Redirect } from "react-router";

import AppContainer from "./components/app";
import Lobby from "./components/lobby";
import Game from "./components/game";

function requireAuthentication(nextState, replace) {
  console.log('requireAuthentication');
  // if (!sessionStorage.jwt) {
  //   replace({
  //     pathname: '/',
  //     state: { nextPathname: nextState.location.pathname }
  //   });
  // }
}

function requireAuthorization(nextState, replace) {
  console.log('requireAuthorization');
  // if (!sessionStorage.jwt) {
  //   replace({
  //     pathname: '/',
  //     state: { nextPathname: nextState.location.pathname }
  //   });
  // }
}

export default function () {
  return (
    <Route path='/' component={AppContainer}>
      <IndexRoute components={Lobby} />

      <Route path="/game" components={Game} onEnter={requireAuthentication}>
        <Route path="/game/:gameId" components={Game} onEnter={requireAuthorization} />
      </Route>

      <Redirect from="*" to="/" />
    </Route>
  );
}
