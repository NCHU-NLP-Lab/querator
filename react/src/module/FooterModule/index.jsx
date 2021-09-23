import React, { Component } from "react";
import "./index.css";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="Footer">
        <div className="text-center container">
          <span
            style={{
              display: "block",
              marginTop: "12px",
            }}
          ></span>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="http://udiclab.cs.nchu.edu.tw/querator.html"
            className="footer-brand"
          >
            Querator AI
          </a>
          <hr />
          <p className="footer-text">
            Copyright © 2021
            <a href="https://nlpnchu.org/">NCHU NLP Lab</a>. All rights
            reserved.
          </p>
        </div>
      </div>
    );
  }
}

export default Index;
