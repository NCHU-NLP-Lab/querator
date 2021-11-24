import React from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

function AnswerInput(props) {
  const { t } = useTranslation();
  return (
    <Form.Group className="answer-inputs mb-3">
      <Form.Label htmlFor={`answer-input-${props.id}`}>{`${t("Answer")} ${
        props.index + 1
      }`}</Form.Label>
      <Form.Control
        type="text"
        id={`answer-input-${props.id}`}
        value={props.answer}
        onChange={props.answerChange}
      />
    </Form.Group>
  );
}

export default AnswerInput;
