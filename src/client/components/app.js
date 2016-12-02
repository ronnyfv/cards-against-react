import "./app.scss";

import React from "react";

import * as A from "../actions";
import { ContainerBase } from "../lib/component";
import dialogTypes from "./dialogs";

//
// ─── CONTAINER ──────────────────────────────────────────────────────────────────
//

class AppContainer extends ContainerBase {
  componentWillMount() {
    const { stores: { app }, services: { dispatcher } } = this.context;
    const { router } = this.props;

    this.subscribe(app.dialogs$, (dialogs) => {
      this.setState({ dialogs });
    });

    this.subscribe(dispatcher.onSuccess$(A.GAME_JOIN), (action) => {
      const path = `/game/${action.gameId}`;

      if (router.location.pathname == path)
        return;

      router.push(path);
    });

    this.subscribe(dispatcher.onSuccess$(A.LOBBY_JOI), () => {
      if (router.location.pathname == '/')
        return;

      router.push('/');
    });
  }

  render() {
    const { main, sidebar } = this.props;
    const { dialogs } = this.state;

    const dialogStack = dialogs.map((dialog) => {
      const DialogComponent = dialogTypes[dialog.id];
      return <DialogComponent {...dialog.props} key={dialog.id}/>;
    });

    return (
      <div className={`comp-app ${dialogStack.length ? "dialogs-open" : "dialogs-closed"}`}>
        <div className="dialogs">
          {dialogStack}
        </div>
        <header className="header m-b-10">
          Header here
        </header>
        <div className="content">
          <article className="main m-l-10 m-r-10">
            {main}
          </article>
          <aside className="sidebar">
            {sidebar}
          </aside>
          <article className="ads">
            How to play
          </article>
        </div>
        <footer className="footer m-t-10">
          Footer
        </footer>
      </div>
    );
  }
}

// ────────────────────────────────────────────────────────────────────────────────

export default AppContainer;