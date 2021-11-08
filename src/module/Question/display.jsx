import React from "react";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { withTranslation } from "react-i18next";

function QuestionDisplay(props) {
  // Process options
  let options = [{ option: props.answer, isAnswer: true }];
  if (props.options) {
    for (const option of props.options) {
      options.push({ option: option, isAnswer: false });
    }
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        {props.context && <Card.Text>{props.context}</Card.Text>}
        {Boolean(props.options) ? (
          <Card.Title className="font-weight-bold">
            <Form.Check
              type="checkbox"
              label={props.question}
              checked={props.questionChecked}
              onChange={props.questionCheckboxOnChange}
              data-question-index={props.questionIndex}
            />
          </Card.Title>
        ) : (
          <Card.Title className="font-weight-bold">{props.question}</Card.Title>
        )}
      </Card.Header>
      <ListGroup variant="flush">
        {options.map((option, index) => {
          return (
            <ListGroup.Item key={`${props.id}-option-${index}`}>
              {option.isAnswer && props.answerIsInput ? (
                <FloatingLabel label="Answer">
                  <Form.Control
                    type="text"
                    value={props.answer}
                    onChange={props.answerInputOnChange}
                    data-question-index={props.questionIndex}
                  />
                </FloatingLabel>
              ) : (
                <Form.Check
                  type="checkbox"
                  label={
                    option.isAnswer ? <b>{option.option}</b> : option.option
                  }
                  checked={props.questionChecked && props.optionsChecked[index]}
                  disabled={!props.questionChecked}
                  onChange={props.optionCheckboxOnChange}
                  data-question-index={props.questionIndex}
                  data-option-index={index}
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
