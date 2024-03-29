import "./stacks.scss";

import _ from "lodash";
import React from "react";

import Card from "./card";

export default function Stacks({ stacks, opSelectStack, selectStack, outStackId }) {
  return (
    <div className="comp-stacks">
      {stacks.map((stack) => {
        const cards = stack.cards ? renderVisibleStack(stack, opSelectStack, selectStack) : renderHiddenStack(stack.count);

        const classes = [
          'stack',
          stack.isWinner ? 'is-winner' : '',
          stack.cards ? 'shown' : 'hidden',
          stack.id == outStackId ? 'our-stack' : ''
        ];

        return cards.length
          ? <div key={stack.id} className={classes.join(' ')}>{cards}</div>
          : null;
      })}
    </div>
  );
}

function renderVisibleStack(stack, opSelectStack, selectStack) {
  return stack.cards.map((card, index) =>
    <Card key={index} isSelectable={opSelectStack.can && !opSelectStack.isProgress} onClick={() => selectStack(stack)}
          card={card} type="white" style="small"/>
  );
}

function renderHiddenStack(count) {
  return _.range(0, count).map((index) =>
    <Card key={index} type="white" stle="small"/>
  );
}