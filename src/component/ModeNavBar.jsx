import { showSetting, showTextSlider } from "util/action";

import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsGear, BsQuestionCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function ModeNavbar(props) {
  const dispatch = useDispatch();

  return (
    <Navbar bg="light">
      <Container>
        <Nav className="mx-auto">
          {props.routes.map((route, index) => {
            return (
              route.name && (
                <Nav.Link key={index} as={Link} to={route.path}>
                  {route.name}
                </Nav.Link>
              )
            );
          })}
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

export default ModeNavbar;
