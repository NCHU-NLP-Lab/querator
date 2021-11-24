import React from "react";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
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
              {/* Type: Input */}
              {item.type === "input" &&
                (item.inputBeginAddOn || item.inputEndAddOn ? (
                  // Standard input with buttons
                  <InputGroup>
                    {item.inputBeginAddOn}
                    <Form.Control
                      type="text"
                      value={item.text}
                      disabled={item.disabled}
                      onChange={item.onChange}
                    />
                    {item.inputEndAddOn}
                  </InputGroup>
                ) : (
                  // Floating input with label
                  <FloatingLabel label={item.inputLabel}>
                    <Form.Control
                      type="text"
                      value={item.text}
                      disabled={item.disabled}
                      onChange={item.onChange}
                    />
                  </FloatingLabel>
                ))}
              {/* Type: Checkbox / Radio */}
              {item.type === "check" && (
                <Form.Check
                  type={item.checkType}
                  label={item.textBold ? <b>{item.text}</b> : item.text}
                  checked={item.isChecked}
                  disabled={item.disabled}
                  onChange={item.onCheck}
                  readOnly={!Boolean(item.onCheck)}
                />
              )}
              {/* Nested Item */}
              {item.nestedList && Boolean(item.nestedList.length) && (
                <ListGroup horizontal className="mt-3">
                  {item.nestedList.map((nestedItem, nestedIndex) => (
                    <ListGroup.Item
                      key={`${props.id}-list-${index}-${nestedIndex}`}
                    >
                      {nestedItem}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}

export default withTranslation()(QuestionDisplay);
