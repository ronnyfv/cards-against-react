import "./app.scss";

import React, { Component } from "react";

class AppContainer extends Component {
  componentDidMount() {
    console.log('mounting');
  }

  render() {
    const {main, sidebar} = this.props;

    return (
      <div className={`container-fluid comp-app`}>
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