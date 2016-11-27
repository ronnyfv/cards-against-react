import "./game-board.scss";

import _ from "lodash";
import React from "react";
import * as A from "../../actions";
import { ContainerBase } from "../../lib/component";

export default class GameBoard extends ContainerBase {
  render() {
    return (
      <section className="comp-game-board">
        GAME BOARD
      </section>
    );
  }
}