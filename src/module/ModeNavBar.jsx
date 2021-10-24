import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";

function ModeSwitcher(props) {
  return (
    <Navbar bg="light">
      <Nav className="mx-auto">
        <Nav.Link as={Link} to="/">
          Querator AI
        </Nav.Link>
        <Nav.Link as={Link} to="/group-mode">
          Querator Group AI
        </Nav.Link>
        <Nav.Link as={Link} to="/distractor-mode">
          Distractor AI
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(ModeSwitcher);
