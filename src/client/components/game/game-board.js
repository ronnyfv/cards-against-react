import "./game-board.scss";

import _ from "lodash";
import React from "react";

import * as A from "../../actions";
import { ContainerBase } from "../../lib/component";
import Card from "./card";
import PlayerHand from "./player-hand";
import Stacks from "./stacks";

const TIMER_REASONS = {
  [A.WAIT_GAME_OVER]: 'game over',
  [A.WAIT_REASON_GAME_FINISHED]: 'it ended',
  [A.WAIT_REASON_TOO_FEW_PLAYERS]: 'there are too few players',

  [A.WAIT_ROUND_OVER]: 'round over',
  [A.WAIT_REASON_CZAR_LEFT]: 'the czar left',
  [A.WAIT_REASON_ROUND_FINISHED]: 'it ended'
};

export default class GameBoard extends ContainerBase {
  constructor(props) {
    super(props);

    this.state = { isHandOpen: false };

    this._selectCard = (card) => {
      this.request(A.gameSelectCard(this.state.game.id, card.id));
    };

    this._selectStack = (stack) => {
      this.request(A.gameSelectStack(this.state.game.id, stack.id));
    };

    this._toggleHand = () => {
      this.setState({ isHandOpen: !this.state.isHandOpen });
    };
  }

  componentWillMount() {
    const { stores: { game } } = this.context;

    this.subscribe(game.view$, (gameView) => this.setState({ game: gameView }));

    this.subscribe(game.player$, (player) => this.setState({ player }));

    this.subscribe(game.opSelectCard$, (opSelectCard) => this.setState({ opSelectCard }));

    this.subscribe(game.opSelectStack$, (opSelectStack) => this.setState({ opSelectStack }));
  }

  render() {
    const { game, player, opSelectCard, opSelectStack, isHandOpen } = this.state;
    const round = game.round;
    const timer = game.timer || {};

    if (!round)
      return null;

    let message = null;
    let messageIsActive = false;

    switch (game.step) {
      case A.STEP_CHOOSE_WHITES:
        messageIsActive = opSelectCard.can;
        message = opSelectCard.can ? 'choose your cards!' : 'waiting for other players!';
        break;

      case A.STEP_JUDGE_STACKS:
        messageIsActive = opSelectStack.can;
        message = opSelectStack.can ? 'select the winning cards!' : 'waiting for czar';
        break;

      case A.STEP_WAIT:
        message = `${TIMER_REASONS[timer.type]}, ${TIMER_REASONS[timer.reason]}`;
        break;
    }

    const outStackId = game.step == A.STEP_CHOOSE_WHITES && player && player.stack && player.stack.id;
    const stacks = outStackId ? round.stacks.map((s) => s.id == outStackId ? player.stack : s) : round.stacks;

    return (
      <section className="comp-game-board">
        <div className="black-card">
          <Card type="black" card={round.blackCard}/>
          <div className={`game-status ${messageIsActive ? 'is-active' : ''}`}>
            {message}
          </div>
        </div>
        <Stacks stacks={stacks} outStackId={outStackId} opSelectStack={opSelectStack} selectStack={this._selectStack}/>
        <PlayerHand opSelectCard={opSelectCard} selectCard={this._selectCard} hard={player.hand}
                    toggle={this._toggleHand} isOpen={isHandOpen}/>
      </section>
    );
  }
}