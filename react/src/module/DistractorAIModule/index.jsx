import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import QuestionInput from "../Question/input";
import ContextInput from "../Context/input";
import ExportButtons from "../Export/buttons";
import QuestionDisplay from "../Question/display";
import AnswerInput from "../Answer/input";
import { genDistractors } from "../action";

class DistractorAI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contexts: [
        `Humanity needs to "grow up" and deal with the issue of climate change, British Prime Minister Boris Johnson told world leaders at the United Nations General Assembly in New York on Wednesday. Johnson, a last-minute addition to the speakers' list that day, slammed the world's inadequate response to the climate crisis and urged humanity to "listen to the warnings of the scientists," pointing to the Covid-19 pandemic as "an example of gloomy scientists being proved right."`,
      ],
      questions: ["Who is the prime minister of United Kingdom?"],
      answers: ["Boris Johnson"],
      distractor_mode_set_count: 1,
    };
    this.getDistractors = this.getDistractors.bind(this);
    this.removeDistractorSet = this.removeDistractorSet.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getDistractors(event) {
    event.preventDefault();
    let { dispatch } = this.props;
    for (let index = 0; index < this.state.distractor_mode_set_count; index++) {
      dispatch(
        genDistractors(
          this.state.contexts[index],
          this.state.answers[index],
          0,
          0,
          this.state.questions[index],
          3,
          "en-US",
          index,
          this.setAPIError
        )
      );
    }
  }

  removeDistractorSet = (index) => {
    let contexts = [...this.state.contexts];
    let questions = [...this.state.questions];
    let answers = [...this.state.answers];
    contexts.splice(index, 1);
    questions.splice(index, 1);
    answers.splice(index, 1);
    this.setState((prevState, props) => ({
      contexts,
      questions,
      answers,
      distractor_mode_set_count: prevState.distractor_mode_set_count - 1,
    }));
  };

  contextChange = (index, value) => {
    let contexts = [...this.state.contexts];
    contexts[index] = value;
    this.setState({ contexts });
  };

  questionChange = (index, value) => {
    let questions = [...this.state.questions];
    questions[index] = value;
    this.setState({ questions });
  };

  answerChange = (index, value) => {
    let answers = [...this.state.answers];
    answers[index] = value;
    this.setState({ answers });
  };

  render() {
    let { t, appState } = this.props;
    let { distractor: distractors } = appState;

    return (
      <div className="DistractorAI">
        <h1 className="text-center">Distractor AI</h1>
        <form>
          {Array.from(
            { length: this.state.distractor_mode_set_count },
            (_, index) => (
              <>
                <ContextInput
                  index={index}
                  context={this.state.contexts[index]}
                  contextChange={this.contextChange}
                  key={`context-input-${index}`}
                />
                <QuestionInput
                  index={index}
                  question={this.state.questions[index]}
                  questionChange={this.questionChange}
                  key={`question-input-${index}`}
                />
                <AnswerInput
                  index={index}
                  answer={this.state.answers[index]}
                  answerChange={this.answerChange}
                  key={`answer-input-${index}`}
                />
                <div className="form-group row justify-content-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(event) => {
                      event.preventDefault();
                      this.removeDistractorSet(index);
                    }}
                  >
                    {t("Remove This Set")}
                  </button>
                </div>
                <hr />
              </>
            )
          )}
          <div className="form-group row">
            <button
              className="btn btn-success"
              onClick={(event) => {
                event.preventDefault();
                this.setState((prevState, props) => ({
                  distractor_mode_set_count:
                    prevState.distractor_mode_set_count + 1,
                }));
              }}
            >
              {t("Add More Set")}
            </button>
          </div>
          <div className="form-group row">
            <button className="btn btn-primary" onClick={this.getDistractors}>
              {t("Generate")}
            </button>
          </div>
        </form>
        <hr />
        {Object.keys(distractors).length !== 0 && (
          <div>
            {Object.keys(distractors).map((index) => (
              <QuestionDisplay
                question={this.state.questions[index]}
                answer={this.state.answers[index]}
                options={distractors[index]}
              />
            ))}
            <ExportButtons
              contexts={this.state.contexts}
              questions={this.state.questions}
              answers={this.state.answers}
              options={distractors}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(DistractorAI);
