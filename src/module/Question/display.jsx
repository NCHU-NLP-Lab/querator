import React from "react";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { withTranslation } from "react-i18next";

function QuestionDisplay(props) {
  return (
    <Card className="mb-3">
      <Card.Header>
        {props.preTitle && <Card.Text>{props.preTitle}</Card.Text>}
        {Boolean(props.titleCheckboxOnChange) ? (
          <Card.Title className="font-weight-bold">
            <Form.Check
              type="checkbox"
              label={props.title}
              checked={props.titleChecked}
              onChange={props.titleCheckboxOnChange}
            />
          </Card.Title>
        ) : (
          <Card.Title className="font-weight-bold">{props.title}</Card.Title>
        )}
      </Card.Header>
      <ListGroup variant="flush">
        {props.listings.map((item, index) => {
          return (
            <ListGroup.Item key={`${props.id}-list-${index}`}>
              {item.textOnChange ? (
                <FloatingLabel label={item.textInputLabel}>
                  <Form.Control
                    type="text"
                    value={item.text}
                    onChange={item.textOnChange}
                  />
                </FloatingLabel>
              ) : (
                <Form.Check
                  type={item.checkType}
                  label={item.textBold ? <b>{item.text}</b> : item.text}
                  checked={item.isChecked}
                  disabled={item.checkDisabled}
                  onChange={item.checkboxOnChange}
                  readOnly={!Boolean(item.checkboxOnChange)}
                />
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}

export default withTranslation()(QuestionDisplay);
