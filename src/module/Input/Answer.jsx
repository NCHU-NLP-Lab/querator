import React from "react";
import Form from "react-bootstrap/Form";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

function AnswerInput(props) {
  let { t } = props;

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

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(AnswerInput);
