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
      console.log(`Todo: join game ${game.title}`);
    };

    this._sendMessage = (message) => {
      console.log(`Sending ${message}`);
    };
  }

  render() {
    const games = [
      { title: 'Game 1', _id: 1, players: ['one', 'two', 'three'] },
      { title: 'Game 2', _id: 2, players: ['one', 'two', 'three'] },
      { title: 'Game 3', _id: 3, players: ['one', 'two', 'three'] },
      { title: 'Game 4', _id: 4, players: ['one', 'two', 'three'] },
      { title: 'Game 5', _id: 5, players: ['one', 'two', 'three'] }
    ];

    const opSendMessage = {
      can: true,
      inProgreee: false
    };

    const messages = [
      { index: 1, name: 'Person 1', message: 'Teste 1' },
      { index: 2, name: 'Person 2', message: 'Teste 2' },
      { index: 3, name: 'Person 3', message: 'Teste 3' },
      { index: 4, name: 'Person 4', message: 'Teste 4' },
      { index: 5, name: 'Person 5', message: 'Teste 5' },
      { index: 6, name: 'Person 6', message: 'Teste 6' }
    ];

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
      //TODO: implement
    };
  }

  render() {
    const canLogin = true;
    const canCreateGame = true;
    const createGameInProgress = false;

    return (
      <section className="comp-lobby-sidebar">
        <div className="m-sidebar-buttons">
          {!canLogin ? null : <button className="m-button primary" onClick={this._login}>Login</button>}
          {!canCreateGame ? null : <button className="m-button good" onClick={this._createGame} disabled={createGameInProgress}>Create Game</button>}
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
        <div className="game" key={game._id} onClick={() => joinGame(game)}>
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