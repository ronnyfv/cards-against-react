import "./app.scss";

import React, { Component } from "react";

class AppContainer extends Component {
  componentDidMount() {
    console.log('mounting');
  }

  render() {
    const {main, sidebar} = this.props;

    return (
      <div className={`component-app`}>
        <div className="inner">
          <div className="sidebar">
            {sidebar}
          </div>
          <div className="main">
            {main}
          </div>
        </div>
      </div>
    );
  }
}

export default AppContainer;