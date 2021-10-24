import React from "react";
import Form from "react-bootstrap/Form";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

function QuestionInput(props) {
  let { t } = props;

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

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(QuestionInput);
