import React from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

function QuestionInput(props) {
  const { t } = useTranslation();

  return (
    <Form.Group className="question-inputs mb-3">
      <Form.Label htmlFor={`question-input-${props.id}`}>{`${t("Question")} ${
        props.index + 1
      }`}</Form.Label>
      <Form.Control
        type="text"
        id={`question-input-${props.id}`}
        value={props.question}
        onChange={props.questionChange}
      />
    </Form.Group>
  );
}

export default QuestionInput;
