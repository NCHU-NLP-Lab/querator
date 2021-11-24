import GenerateButton from "module/Button/Generate";
import QuestionDisplay from "module/Question/display";
import { pureGenDistractors, updateQuestion } from "util/action";
import { showToastInfo } from "util/toast";

import ExportButtons from "component/Export";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { withTranslation } from "react-i18next";
import { BsCheck, BsPencilFill } from "react-icons/bs";
import { connect } from "react-redux";
import { compose } from "redux";

class QuestionGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingQuestion: [],
      distractors: [],
      exportChecks: [],
      distractorGenerating: false,
      apiError: false,
    };
    this.generateDistractor = this.generateDistractor.bind(this);
    this.generateDataForExport = this.generateDataForExport.bind(this);
    this.toggleEditingQuestion = this.toggleEditingQuestion.bind(this);
    this.readEditingQuestion = this.readEditingQuestion.bind(this);
  }

  generateDistractor = async (index, questionIndex) => {
    this.setState({ distractorGenerating: true });
    let { selectWords, fullContext } = this.props.appState;
    let options = await pureGenDistractors({
      context: fullContext,
      answer: selectWords[index].tag,
      answerStart: selectWords[index].start_at,
      answerEnd: selectWords[index].end_at,
      question: selectWords[index].questions[questionIndex],
      quantity: 3,
    });

    let newDistractors = [...this.state.distractors];
    if (!newDistractors[index]) {
      newDistractors[index] = [];
    }
    newDistractors[index][questionIndex] = options;
    this.setState({
      distractorGenerating: false,
      distractors: newDistractors,
    });
  };

  generateDataForExport = () => {
    let { fullContext, selectWordsRaw } = this.props.appState;
    let pairs = [];
    this.state.exportChecks.forEach((questionsChecked, index) => {
      questionsChecked.forEach((checked, questionIndex) => {
        if (
          checked &&
          this.state.distractors[index] &&
          this.state.distractors[index][questionIndex]
        ) {
          pairs.push({
            question: selectWordsRaw[index].questions[questionIndex],
            options: [
              { text: selectWordsRaw[index].tag, is_answer: true },
            ].concat(
              this.state.distractors[index][questionIndex].map((distractor) => {
                return { text: distractor, is_answer: false };
              })
            ),
          });
        }
      });
    });
    if (!pairs.length) {
      showToastInfo("No valid ouput group");
      return;
    }
    return [
      {
        context: fullContext,
        question_pairs: pairs,
      },
    ];
  };

  toogleExport = (index, questionIndex) => {
    let newExportChecks = [...this.state.exportChecks];
    if (!newExportChecks[index]) {
      newExportChecks[index] = [];
    }
    newExportChecks[index][questionIndex] =
      !newExportChecks[index][questionIndex];
    this.setState({ exportChecks: newExportChecks });
  };

  toggleEditingQuestion = (index, questionIndex) => {
    let newEditingQuestion = [...this.state.editingQuestion];
    if (!newEditingQuestion[index]) {
      newEditingQuestion[index] = [];
    }
    newEditingQuestion[index][questionIndex] =
      !newEditingQuestion[index][questionIndex];
    this.setState({ editingQuestion: newEditingQuestion });
  };

  readEditingQuestion = (index, questionIndex) => {
    let { editingQuestion } = this.state;
    return editingQuestion[index] && editingQuestion[index][questionIndex];
  };

  render() {
    let { dispatch } = this.props;
    let { distractors, distractorGenerating } = this.state;
    let { selectWords } = this.props.appState;

    return (
      <Container id="QG-Module">
        {/* Generated question sets */}
        <Row>
          {selectWords.map((word, index) => {
            // Process options for QuestionDisplay
            let QDlisting = word.questions.map((question, questionIndex) => {
              const editing = this.readEditingQuestion(index, questionIndex);
              return {
                type: "input",
                text: question,
                disabled: !editing,
                inputBeginAddOn: [
                  <InputGroup.Checkbox
                    key={`question-display-${index}-${questionIndex}-checkbox`}
                    disabled={
                      !Boolean(
                        !editing &&
                          distractors[index] &&
                          distractors[index][questionIndex]
                      )
                    }
                    onClick={() => {
                      this.toogleExport(index, questionIndex);
                    }}
                  />,
                ],
                inputEndAddOn: editing
                  ? [
                      <Button
                        key={`question-display-${index}-${questionIndex}-done`}
                        variant="outline-secondary"
                        onClick={() => {
                          this.toggleEditingQuestion(index, questionIndex);
                        }}
                      >
                        Done <BsCheck />
                      </Button>,
                    ]
                  : [
                      <Button
                        key={`question-display-${index}-${questionIndex}-edit`}
                        variant="outline-secondary"
                        onClick={() => {
                          this.toggleEditingQuestion(index, questionIndex);
                        }}
                      >
                        Edit <BsPencilFill />
                      </Button>,
                      <GenerateButton
                        key={`question-display-${index}-${questionIndex}-generate`}
                        variant="outline-secondary"
                        onClick={() => {
                          this.generateDistractor(index, questionIndex);
                        }}
                        disabled={distractorGenerating}
                      />,
                    ],
                onChange: (event) => {
                  selectWords[index].questions[questionIndex] =
                    event.target.value;
                  dispatch(updateQuestion(selectWords));
                },
                nestedList:
                  !editing &&
                  distractors[index] &&
                  distractors[index][questionIndex],
              };
            });

            let context = this.props.appState.pickAnsRaw[index].context;
            let hightlightedContext = [
              context.slice(0, word.start_at),
              <span
                key={`question-display-${index}-span`}
                className="text-success fw-bolder"
              >
                {word.tag}
              </span>,
              context.slice(word.end_at + 1),
            ];

            return (
              <div key={`generated-question-${index}`}>
                <QuestionDisplay
                  listings={QDlisting}
                  preTitle={hightlightedContext}
                  title={`Answer: ${word.tag}`}
                />
              </div>
            );
          })}
        </Row>

        {/* Export Buttons */}
        {Boolean(
          // Any one of the questions is checked for export
          this.state.exportChecks.length &&
            this.state.exportChecks.some((set) =>
              set.some((questionCheck) => questionCheck)
            )
        ) && (
          <Row>
            <ExportButtons getQuestionSets={this.generateDataForExport} />
          </Row>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(QuestionGenerator);
