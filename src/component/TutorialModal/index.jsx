import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import { withTranslation } from "react-i18next";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

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
          {`${t("Step")} ${index + 1} - ${t(content[index].title)}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel
          activeIndex={index}
          controls={false}
          indicators={false}
          onSelect={handleSelect}
        >
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
        <ButtonGroup
          className="mx-auto"
          size="lg"
          aria-label="Tutorial step control"
        >
          <Button
            variant="secondary"
            disabled={index === 0}
            onClick={() => {
              setIndex(index - 1);
            }}
          >
            <BsCaretLeftFill />
          </Button>
          <Button
            variant="secondary"
            disabled={index === content.length - 1}
            onClick={() => {
              setIndex(index + 1);
            }}
          >
            <BsCaretRightFill />
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(TutorialModal);
