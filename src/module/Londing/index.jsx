import React, { Component } from "react";
import "./index.css";

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div className="loading-mask"></div>;
  }
}

export default View;
