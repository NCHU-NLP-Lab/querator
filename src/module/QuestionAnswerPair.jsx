import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import QuestionInput from "./Question/input";
import AnswerInput from "./Answer/input";

function QuestionAnswerPair(props) {
  return (
    <>
      <QuestionInput
        index={props.setIndex}
        question={props.pair.question}
        questionChange={props.questionChange}
        key={`question-input-${props.setIndex}`}
      />
      <AnswerInput
        index={props.setIndex}
        answer={props.pair.answer}
        answerChange={props.answerChange}
        key={`answer-input-${props.setIndex}`}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(QuestionAnswerPair);
