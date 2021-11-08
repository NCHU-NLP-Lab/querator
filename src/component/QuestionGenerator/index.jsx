import "./index.css";

import { delAnswer, genDistractors } from "util/action";
import { showToastInfo } from "util/toast";

import ExportButtons from "component/Export";
import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { withTranslation } from "react-i18next";
import { MdClose, MdReplay } from "react-icons/md";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { compose } from "redux";

import Distractor from "./distractor";
import EditableComponent from "./editableComponent";

class QuestionGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRadios: [],
      apiError: false,
    };
    this.QGBlock = React.createRef();
    this.srollToBlock = this.srollToBlock.bind(this);
    this.radioOnClick = this.radioOnClick.bind(this);
    this.delAnswerBlock = this.delAnswerBlock.bind(this);
    this.generateDataForExport = this.generateDataForExport.bind(this);
  }

  componentDidUpdate() {
    let { appState } = this.props;
    let { selectWordsSubmitting } = appState;
    if (selectWordsSubmitting) {
      this.srollToBlock(this.QGBlock);
    }
  }

  delAnswerBlock = (word, index) => {
    /*
     * 軟刪除
     */
    let selectRadios = [...this.state.selectRadios];
    selectRadios[index] = null;
    this.setState({ selectRadios });
    this.props.dispatch(delAnswer(word, index));
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let { appState } = nextProps;
    if (appState.selectWordsSubmitting) {
      return { selectRadios: [] };
    }
    return null;
  }

  radioOnClick = (index, questionIndex) => {
    /*
     * radio點擊事件
     * 移除同樣的index(同層的點擊)，加入選擇的radio
     */
    let selectRadios = [...this.state.selectRadios];
    let { appState, dispatch } = this.props;
    let { selectWords, fullContext } = appState;
    selectRadios[index] = questionIndex;
    this.setState({ selectRadios });
    dispatch(
      genDistractors(
        fullContext,
        selectWords[index].tag,
        selectWords[index].start_at,
        selectWords[index].end_at,
        this.getSelectQuestion(index, selectRadios[index]),
        3,
        appState.language,
        index,
        () => {
          this.setState({ apiError: true });
        }
      )
    );
  };

  generateDataForExport = () => {
    let { fullContext, distractor, selectWordsRaw } = this.props.appState;
    let pairs = [];
    for (let index = 0; index < this.state.selectRadios.length; index++) {
      const questionIndex = this.state.selectRadios[index];
      if (questionIndex === null || distractor[index].length === 0) {
        continue;
      }
      let options = distractor[index].map((option) => {
        return { text: option, is_answer: false };
      });
      options.push({
        text: selectWordsRaw[index].tag,
        is_answer: true,
      });
      pairs.push({
        question: selectWordsRaw[index].questions[questionIndex],
        options,
      });
    }
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

  srollToBlock = (ref) => {
    // scorll to
    window.scrollTo(0, ref.current.offsetTop);
  };

  getSelectQuestion = (k1, k2) => {
    let { selectWords } = this.props.appState;
    try {
      return selectWords[k1].questions[k2];
    } catch (error) {
      return "";
    }
  };

  hasK1 = (index) => {
    return !(this.state.selectRadios[index] === null);
  };

  render() {
    let { t } = this.props;
    let { selectWords, pickAnsRaw } = this.props.appState;
    let { selectRadios } = this.state;
    let selectWordsAfterDel = selectWords.filter((s) => {
      let { softDel = false } = s;
      return !softDel;
    });

    return (
      <Container ref={this.QGBlock} id="QG-Module">
        {/* Generated question sets */}
        <Row>
          {selectWords.map((word, index) => {
            let { tag, questions, softDel = false } = word;
            return softDel ? (
              <Alert
                variant="light"
                className="text-decoration-line-through"
                key={`generated-question-${index}`}
              >
                <b>
                  {index + 1}. {t("Answer")}:
                </b>
                {tag}
                <span
                  className="del-answer"
                  onClick={(event) => {
                    event.preventDefault();
                    this.delAnswerBlock(word, index);
                  }}
                >
                  <MdReplay />
                </span>
              </Alert>
            ) : (
              <Alert variant="dark" key={`generated-question-${index}`}>
                <span
                  style={{ cursor: "context-menu" }}
                  data-class="tool-tip"
                  data-tip={(() => {
                    var frontContext = pickAnsRaw[index].context.slice(
                      0,
                      word.start_at
                    );
                    var endContext = pickAnsRaw[index].context.slice(
                      word.end_at + 1
                    );
                    return (
                      frontContext +
                      `<span class="tool-tip-hl">${tag}</span>` +
                      endContext
                    );
                  })()}
                >
                  <b>
                    {index + 1}. {t("Answer")}:
                  </b>
                  {tag}
                </span>
                <ReactTooltip
                  place="right"
                  getContent={(dataTip) => (
                    <div dangerouslySetInnerHTML={{ __html: dataTip }} />
                  )}
                  multiline={true}
                />
                <span
                  className="del-answer"
                  onClick={(event) => {
                    event.preventDefault();
                    this.delAnswerBlock(word, index);
                  }}
                >
                  <MdClose />
                </span>
                {typeof selectRadios[index] === "number" && (
                  <Distractor
                    firstInit={!this.hasK1(index)}
                    apiError={this.state.apiError}
                    index={index}
                    answer={tag}
                  />
                )}
                <hr />
                {questions.map((question, questionIndex) => {
                  return (
                    <EditableComponent
                      key={`generated-${index}-${questionIndex}`}
                      checked={Boolean(selectRadios[index] === questionIndex)}
                      onChange={(event) => {
                        event.preventDefault();
                        this.radioOnClick(index, questionIndex);
                      }}
                      initEditable={false}
                      q={question}
                      k1={index}
                      k2={questionIndex}
                    />
                  );
                })}
              </Alert>
            );
          })}
        </Row>

        {/* Export Buttons */}
        {Boolean(selectWordsAfterDel.length) && (
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
