import "./game.scss";

import _ from "lodash";
import React from "react";

import * as A from "../actions";
import { ContainerBase } from "../lib/component";
import GameBoard from "./game/game-board";
import GameSetup from "./game/game-setup";
import Chat from "./chat";

//
// ─── CONTAINER ──────────────────────────────────────────────────────────────────
//

class GameContainer extends ContainerBase {
  constructor(props) {
    super(props);

    this._sendMessage = (message) => {
      this.request(A.gameSendMessage(this.state.game.id, message));
    };
  }
  componentWillMount() {
    const {stores: {app, game}} = this.context;
    const {params} = this.props;
    const gameId = parseInt(params.gameId);

    this.subscribe(game.opJoinGame$, (opJoinGame) => this.setState({ opJoinGame }));

    this.subscribe(game.opSendMessage$, (opSendMessage) => this.setState({ opSendMessage }));

    this.subscribe(game.view$, (gameView) => this.setState({ game: gameView }));

    this.subscribe(app.reconnected$, () => this.request(A.gameJoin(gameId)));

    this.request(A.gameJoin(gameId));
  }

  render() {
    const {opJoinGame, opSendMessage, game} = this.state;
    let body = null;
    let showChat = true;

    if (opJoinGame.inProgress) {
      body = <section className="notice"><p>Joining game...</p></section>;
      showChat = false;
    } else if (opJoinGame.error) {
      body = <section className="notice"><p>Cannot join game: {opJoinGame.error}</p></section>;
      showChat = false;
    } else if (game.step == A.STEP_DISPOSED) {
      body = <section className="notice error"><p>Game doesn't exist!</p></section>;
      showChat = false;
    } else if (game.step == A.STEP_SETUP) {
      body = <GameSetup />;
    } else {
      body = <GameBoard />;
    }

    return (
      <div className="comp-game">
        {body}
        {!showChat ? null :
          <Chat messages={game.messages} opSendMessage={opSendMessage} sendMessage={this._sendMessage} />
        }
      </div>
    );
  }
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── SIDEBAR ────────────────────────────────────────────────────────────────────
//

class GameSidebar extends ContainerBase {
  constructor(props) {
    super(props);

    this._exitGame = () => {
      this.props.router.push('/');
    };

    this._login = () => {
      this.dispatch(A.dialogSet(A.DIALOG_LOGIN, true));
    };
  }

  componentWillMount() {
    const {stores: {user, game}} = this.context;

    this.subscribe(user.opLogin$, (opLogin) => this.setState({ opLogin }));

    this.subscribe(game.view$, (gameView) => this.setState({ game: gameView }));
  }

  render() {
    const {opLogin, game} = this.state;

    return (
      <section className="comp-game-sidebar">
        <div className="m-sidebar-buttons">
          {!opLogin.can ? null : <button className="m-button primary" onClick={this._login}>login to join the game</button>}

          <button className="m-button" onClick={this._exitGame}>leave game</button>
        </div>
        {game.step == A.STEP_DISPOSED ? null :
          <PlayerList players={game.players} />
        }
      </section>
    );
  }
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── STATELESS ──────────────────────────────────────────────────────────────────
//

function PlayerList({players}) {
  return (
    <ul className="comp-player-list">
      {players.map((player) => {
        const [cls, status] = getPlayerStatus(player);
        return (
          <li className={cls} key={player.id}>
            <div className="details">
              <div className="name">
                {player.name}
              </div>
              <div className="score">
                {player.score == 1 ? `${player.score} point` : `${player.score} points`}
              </div>
            </div>
            <div className="status">
              {status}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

function getPlayerStatus({isCzar, isWinner, isPlaying}) {
  if (isCzar)
    return ['is-czar', 'czar'];

  if (isWinner)
    return ['is-winner', 'winner'];

  if (isPlaying)
    return ['is-playing', 'playing'];

  return ['', ''];
}

// ────────────────────────────────────────────────────────────────────────────────

export default {
  main: GameContainer,
  sidebar: GameSidebar
};