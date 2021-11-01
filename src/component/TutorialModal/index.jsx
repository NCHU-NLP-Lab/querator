import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import { withTranslation } from "react-i18next";

function TutorialModal(props) {
  const [index, setIndex] = useState(0);
  const { t, content } = props;

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Modal
      className="tutorial-modal"
      show={props.show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={props.onHide}>
        <Modal.Title id="contained-modal-title-vcenter">
          {t(content[index].title)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {content.map((content, contentIndex) => (
            <Carousel.Item key={`tutorial-carousel-${contentIndex}`}>
              <img
                className="d-block w-100"
                src={content.image}
                alt={content.title}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(TutorialModal);
