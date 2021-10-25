import AnswerInput from "module/Input/Answer";
import QuestionInput from "module/Input/Question";

import React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

function QuestionAnswerPair(props) {
  return (
    <>
      <QuestionInput
        index={props.pairIndex}
        question={props.pair.question}
        questionChange={props.questionChange}
      />
      <AnswerInput
        index={props.pairIndex}
        answer={props.pair.answer}
        answerChange={props.answerChange}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(QuestionAnswerPair);
