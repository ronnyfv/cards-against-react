import "./player-hand.scss";

import React from "react";

import Card from "./card";

export default function PlayerHand({ hand, opSelectCard, selectCard, toggle, isOpen }) {
  const caretClass = isOpen ? 'fa-caret-down' : 'fa-caret-up';

  return (
    <div className={`comp-player-hand ${isOpen ? 'is-open' : 'is-closed'}`}>
      <div className={`title ${opSelectCard.can ? 'is-active' : ''}`} onClick={toggle}>
        <i className={`fa ${caretClass}`}></i>
        {opSelectCard.error}
        <i className={`fa ${caretClass}`}></i>
      </div>
      <div className="cards">
        {hand.map((card) =>
          <Card key={card.id} isSelectable={opSelectCard.can && !opSelectCard.inProgress}
                onClick={() => selectCard(card)} type="white" card={card} style="small" canZoom/>
        )}
      </div>
    </div>
  );
}