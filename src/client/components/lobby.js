import "./lobby.scss";

import React from "react";

import * as A from "../actions";
import { ContainerBase } from "../lib/component";
import Chat from "./chat";

//
// ─── CONTAINER ──────────────────────────────────────────────────────────────────
//

class LobbyContainer extends ContainerBase {
  // static contextTypes = {
  //   ...ContainerBase.contextTypes,
  //   router: React.PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);

    this._joinGame = (game) => {
      this.request(A.gameJoin(game.id));
    };

    this._sendMessage = (message) => {
      this.request(A.lobbySendMessage(message));
    };
  }

  componentWillMount() {
    const {stores: {lobby, app}} = this.context;

    this.subscribe(lobby.opSendMessage$, (opSendMessage) => this.setState({ opSendMessage }));
    this.subscribe(lobby.view$, (lobbyView) => this.setState({ lobby: lobbyView }));
    this.subscribe(app.reconnected$, () => this.request(A.lobbyJoin()));

    this.request(A.lobbyJoin());
  }

  render() {
    const {lobby: {games, messages}, opSendMessage} = this.state;

    return (
      <div className="comp-lobby">
        <GameList games={games} joinGame={this._joinGame} />
        <Chat messages={messages} opSendMessage={opSendMessage} sendMessage={this._sendMessage} />
      </div>
    );
  }
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── SIDEBAR ────────────────────────────────────────────────────────────────────
//

class LobbySidebar extends ContainerBase {
  constructor(props) {
    super(props);

    this._login = () => {
      this.dispatch(A.dialogSet(A.DIALOG_LOGIN, true));
    };

    this._createGame = () => {
      this.request(A.gameCreate());
    };
  }

  componentWillMount() {
    const {stores: {user, game}} = this.context;

    this.subscribe(user.opLogin$, (opLogin) => this.setState({ opLogin }));
    this.subscribe(game.opCreateGame$, (opCreateGame) => this.setState({ opCreateGame }));
  }

  render() {
    const {opLogin, opCreateGame} = this.state;

    return (
      <section className="comp-lobby-sidebar">
        <div className="m-sidebar-buttons">
          {!opLogin.can ? null : <button className="m-button primary" onClick={this._login}>Login</button>}
          {!opCreateGame.can ? null : <button className="m-button good" onClick={this._createGame} disabled={opCreateGame.inProgress}>Create Game</button>}
        </div>
      </section>
    );
  }
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── LIST ───────────────────────────────────────────────────────────────────────
//

function GameList({games, joinGame}) {
  return (
    <section className="comp-game-list">
      {games.length > 0 ? null : <div className="no-games">There are no games yet.</div>}

      {games.map((game) =>
        <div className="game" key={game.id} onClick={() => joinGame(game)}>
          <div className="title">
            {game.title}
          </div>
          <div className="players">
            {game.players.join(', ')}
          </div>
          <div className="join-game">
            Join Game
          </div>
        </div>
      )}
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────────

export default {
  main: LobbyContainer,
  sidebar: LobbySidebar
};