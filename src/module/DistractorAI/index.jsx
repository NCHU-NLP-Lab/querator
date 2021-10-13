import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ContextInput from "../Context/input";
import ExportButtons from "../Export/buttons";
import QuestionDisplay from "../Question/display";
import QuestionAnswerPair from "../QuestionAnswerPair";
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
            {
              question: "Who is the prime minister of United Kingdom?",
              answer: "Boris Johnson",
              options: [],
            },
          ],
        },
        {
          context:
            "Two real-world studies published Wednesday confirm that the immune protection offered by two doses of Pfizer's Covid-19 vaccine drops off after two months or so, although protection against severe disease, hospitalization and death remains strong.\n\nThe studies, from Israel and from Qatar and published in the New England Journal of Medicine, support arguments that even fully vaccinated people need to maintain precautions against infection.\nOne study from Israel covered 4,800 health care workers a...",
          question_pairs: [
            {
              question:
                "How many doses of Pfizer's Covid-19 vaccine drops off after two months?",
              answer: "Two doses",
              options: [],
            },
          ],
        },
      ],
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
    for (let setIndex = 0; setIndex < questionSets.length; setIndex++) {
      const questionSet = questionSets[setIndex];
      for (
        let pairIndex = 0;
        pairIndex < questionSet.question_pairs.length;
        pairIndex++
      ) {
        const pair = questionSet.question_pairs[pairIndex];
        let options = await pureGenDistractors({
          context: questionSet.context,
          answer: pair.answer,
          answerStart: 0,
          answerEnd: 0,
          question: pair.question,
          quantity: 3,
        });
        pair.options = options;
      }
    }
    this.setState({ questionSets, generated: true });
  };

  emptySet_ = () => {
    return {
      context: "",
      question_pairs: [this.emptyPair_()],
    };
  };

  emptyPair_ = () => {
    return {
      question: "",
      answer: "",
      options: [],
    };
  };

  createSet = () => {
    let questionSets = [...this.state.questionSets];
    questionSets.push(this.emptySet_());
    this.setState({ questionSets });
  };

  deleteSet = (setIndex) => {
    let questionSets = [...this.state.questionSets];
    questionSets.splice(setIndex, 1);
    this.setState({ questionSets });
  };

  createPair = (setIndex) => {
    let questionSets = [...this.state.questionSets];
    questionSets[setIndex].question_pairs.push(this.emptyPair_());
    this.setState({ questionSets });
  };

  deletePair = (setIndex, pairIndex) => {
    let questionSets = [...this.state.questionSets];
    questionSets[setIndex].question_pairs.splice(pairIndex, 1);
    this.setState({ questionSets });
  };

  contextChange = (index, value) => {
    let questionSets = [...this.state.questionSets];
    questionSets[index].context = value;
    this.setState({ questionSets });
  };

  questionChange = (setIndex, pairIndex, value) => {
    let questionSets = [...this.state.questionSets];
    questionSets[setIndex].question_pairs[pairIndex].question = value;
    this.setState({ questionSets });
  };

  answerChange = (setIndex, pairIndex, value) => {
    let questionSets = [...this.state.questionSets];
    questionSets[setIndex].question_pairs[pairIndex].answer = value;
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
            options,
          };
        }),
      };
    });
  };

  render() {
    let { t } = this.props;
    return (
      <div className="distractor-ai container">
        <h1 className="text-center">Distractor AI</h1>
        {[...Array(this.state.questionSets.length)].map((e, setIndex) => (
          <>
            <div className="row">
              <div className="container" key={`set-container-${setIndex}`}>
                <div className="row">
                  <div className="col-6 p-3">
                    <ContextInput
                      index={setIndex}
                      context={this.state.questionSets[setIndex].context}
                      contextChange={this.contextChange}
                      key={`context-input-${setIndex}`}
                    />
                  </div>
                  <div className="col-6 p-3">
                    {this.state.questionSets[setIndex].question_pairs.map(
                      (pair, pairIndex) => (
                        <>
                          <QuestionAnswerPair
                            setIndex={setIndex}
                            pair={pair}
                            questionChange={(event) => {
                              event.preventDefault();
                              this.questionChange(
                                setIndex,
                                pairIndex,
                                event.target.value
                              );
                            }}
                            answerChange={(event) => {
                              event.preventDefault();
                              this.answerChange(
                                setIndex,
                                pairIndex,
                                event.target.value
                              );
                            }}
                          />
                          <div>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(event) => {
                                event.preventDefault();
                                this.deletePair(setIndex, pairIndex);
                              }}
                            >
                              Remove this pair
                            </button>
                          </div>
                          <hr />
                        </>
                      )
                    )}
                    <button
                      className="btn btn-sm btn-success"
                      onClick={(event) => {
                        event.preventDefault();
                        this.createPair(setIndex);
                      }}
                    >
                      Add QA Pair
                    </button>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(event) => {
                      event.preventDefault();
                      this.deleteSet(setIndex);
                    }}
                  >
                    {t("Remove This Set")}
                  </button>
                </div>
              </div>
            </div>
            <hr key={`set-seperator-${setIndex}`} />
          </>
        ))}
        <div className="row">
          <button
            className="btn btn-success m-2"
            onClick={(event) => {
              event.preventDefault();
              this.createSet();
            }}
          >
            {t("Add More Set")}
          </button>
          <button className="btn btn-primary m-2" onClick={this.getDistractors}>
            {t("Generate")}
          </button>
        </div>
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
                      context={questionSet.context}
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
