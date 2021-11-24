import AnswerInput from "module/Input/Answer";
import QuestionInput from "module/Input/Question";

import React from "react";

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

export default QuestionAnswerPair;
