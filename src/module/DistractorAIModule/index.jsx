import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import QuestionInput from "../Question/input";
import ContextInput from "../Context/input";
import ExportButtons from "../Export/buttons";
import QuestionDisplay from "../Question/display";
import AnswerInput from "../Answer/input";
import { pureGenDistractors } from "../action";

class DistractorAI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionSets: [
        {
          context: `Humanity needs to "grow up" and deal with the issue of climate change, British Prime Minister Boris Johnson told world leaders at the United Nations General Assembly in New York on Wednesday. Johnson, a last-minute addition to the speakers' list that day, slammed the world's inadequate response to the climate crisis and urged humanity to "listen to the warnings of the scientists," pointing to the Covid-19 pandemic as "an example of gloomy scientists being proved right."`,
          question_pairs: [
            {
              question: "Who is the prime minister of United Kingdom?",
              answer: "Boris Johnson",
              options: [],
            },
          ],
        },
      ],
      set_count: 1,
      generated: false,
    };
    this.createSet = this.createSet.bind(this);
    this.deleteSet = this.deleteSet.bind(this);
    this.getDistractors = this.getDistractors.bind(this);
    this.generateDataForExport = this.generateDataForExport.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getDistractors = async (event) => {
    event.preventDefault();
    let questionSets = [...this.state.questionSets];
    for (let index = 0; index < questionSets.length; index++) {
      const questionSet = questionSets[index];
      for (let pairIndex = 0; pairIndex < questionSets.length; pairIndex++) {
        const pair = questionSet.question_pairs[pairIndex];
        pair.options = await pureGenDistractors({
          context: questionSet.context,
          answer: pair.answer,
          answerStart: 0,
          answerEnd: 0,
          question: pair.question,
          quantity: 3,
        });
      }
    }
    this.setState({ questionSets, generated: true });
  };

  emptySet_ = () => {
    return {
      context: "",
      question_pairs: [
        {
          question: "",
          answer: "",
        },
      ],
    };
  };

  createSet = (event) => {
    event.preventDefault();
    let questionSets = [...this.state.questionSets];
    questionSets.push(this.emptySet_());
    this.setState((prevState, props) => ({
      questionSets,
      set_count: prevState.set_count + 1,
    }));
  };

  deleteSet = (index) => {
    let questionSets = [...this.state.questionSets];
    questionSets.splice(index, 1);
    this.setState((prevState, props) => ({
      questionSets,
      set_count: prevState.set_count - 1,
    }));
  };

  contextChange = (index, value) => {
    let questionSets = [...this.state.questionSets];
    questionSets[index].context = value;
    this.setState({ questionSets });
  };

  questionChange = (setIndex, questionIndex, value) => {
    let questionSets = [...this.state.questionSets];
    questionSets[setIndex].question_pairs[questionIndex].question = value;
    this.setState({ questionSets });
  };

  answerChange = (setIndex, answerIndex, value) => {
    let questionSets = [...this.state.questionSets];
    questionSets[setIndex].question_pairs[answerIndex].answer = value;
    this.setState({ questionSets });
  };

  generateDataForExport = () => {
    return this.state.questionSets.map((questionSet) => {
      return {
        context: questionSet.context,
        question_pairs: questionSet.question_pairs.map((pair) => {
          let options = pair.options.map((option) => {
            return { text: option, is_answer: false };
          });
          options.push({ text: pair.answer, is_answer: true });
          return {
            question: pair.question,
            answer: pair.answer,
            options,
          };
        }),
      };
    });
  };

  render() {
    let { t } = this.props;
    return (
      <div className="distractor-ai">
        <h1 className="text-center">Distractor AI</h1>
        <form>
          {Array.from({ length: this.state.set_count }, (_, index) => (
            <>
              <ContextInput
                index={index}
                context={this.state.questionSets[index].context}
                contextChange={this.contextChange}
                key={`context-input-${index}`}
              />
              <QuestionInput
                index={index}
                question={
                  this.state.questionSets[index].question_pairs[0].question
                }
                questionChange={(event) => {
                  event.preventDefault();
                  this.questionChange(index, 0, event.target.value);
                }}
                key={`question-input-${index}`}
              />
              <AnswerInput
                index={index}
                answer={this.state.questionSets[index].question_pairs[0].answer}
                answerChange={(event) => {
                  event.preventDefault();
                  this.answerChange(index, 0, event.target.value);
                }}
                key={`answer-input-${index}`}
              />
              <div className="form-group row justify-content-end">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={(event) => {
                    event.preventDefault();
                    this.deleteSet(index);
                  }}
                >
                  {t("Remove This Set")}
                </button>
              </div>
              <hr />
            </>
          ))}
          <div className="form-group row">
            <button className="btn btn-sm btn-success" onClick={this.createSet}>
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
        {this.state.generated && (
          <div>
            {Object.keys(this.state.questionSets).map((setIndex) => {
              let questionSet = this.state.questionSets[setIndex];
              return Object.keys(questionSet.question_pairs).map(
                (pairIndex) => {
                  let pair = questionSet.question_pairs[pairIndex];
                  return (
                    <QuestionDisplay
                      question={pair.question}
                      answer={pair.answer}
                      options={pair.options}
                      key={`question-display-${setIndex}-${pairIndex}`}
                    />
                  );
                }
              );
            })}
            <ExportButtons getQuestionSets={this.generateDataForExport} />
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
