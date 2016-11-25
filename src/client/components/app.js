import "./app.scss";

import React from "react";

import { ContainerBase } from "../lib/component";
import dialogTypes from "./dialogs";

class AppContainer extends ContainerBase {
  componentWillMount() {
    const {stores: {app}} = this.context;

    this.subscribe(app.dialogs$, (dialogs) => this.setState({ dialogs }));
  }

  render() {
    const {main, sidebar} = this.props;
    const {dialogs} = this.state;

    const dialogStack = dialogs.map((dialog) => {
      const DialogComponent = dialogTypes[dialog.id];
      return <DialogComponent {...dialog.props} key={dialog.id} />;
    });

    return (
      <div className={`comp-app ${dialogStack.length ? "dialogs-open" : "dialogs-closed"}`}>
        <div className="dialogs">
          {dialogStack}
        </div>
        <div className="row inner">
          <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 sidebar">
            {sidebar}
          </div>
          <div className="col-xs main">
            {main}
          </div>
        </div>
      </div>
    );
  }
}

export default AppContainer;