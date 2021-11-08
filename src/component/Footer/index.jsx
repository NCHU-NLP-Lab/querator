import "./index.scss";

import React from "react";

function Footer(props) {
  return (
    <footer className="footer mt-auto py-3 text-center text-muted">
      <h3>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://nlpnchu.org/querator"
          className="brand"
        >
          Querator AI
        </a>
      </h3>
      <p>
        Copyright © 2021 <a href="https://nlpnchu.org">NCHU NLP Lab</a>. All
        rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
