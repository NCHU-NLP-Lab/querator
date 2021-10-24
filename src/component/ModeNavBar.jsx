import { showSetting, showTextSlider } from "module/action.js";

import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { withTranslation } from "react-i18next";
import { BsGear, BsQuestionCircleFill } from "react-icons/bs";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";

function ModeNavbar(props) {
  let { dispatch } = props;

  return (
    <Navbar bg="light">
      <Container>
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
          <Nav.Link onClick={() => dispatch(showSetting(true))}>
            <BsGear />
          </Nav.Link>
          <Nav.Link onClick={() => dispatch(showTextSlider(true))}>
            <BsQuestionCircleFill />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(withTranslation(), connect(mapStateToProps))(ModeNavbar);
