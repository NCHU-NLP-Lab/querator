import "./index.css";

import GenerateButton from "module/Button/Generate";
import ContextInput from "module/Input/Context";
import { submitQs } from "util/action";
import { showToastInfo } from "util/toast";

import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { withTranslation } from "react-i18next";
import { MdHelp, MdLockOpen, MdLockOutline } from "react-icons/md";
import { connect } from "react-redux";
import { compose } from "redux";

class PickAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectWords: [],
      isEdit: true,
      inputContext: "",
      language: "en-US",
    };
    this.showToastInfo = showToastInfo;
    this.addWords = this.addWords.bind(this);
    this.triggerQG = this.triggerQG.bind(this);
  }

  pasteTo() {
    let self = this;
    navigator.clipboard
      .readText()
      .then(function (text) {
        console.log(text, this);
        self.setState({
          inputContext: text,
        });
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
      });
  }

  confirmContext() {
    let { isEdit, inputContext } = this.state;
    if (isEdit) {
      if (
        inputContext.length <= 0 ||
        inputContext.replace(/ /g, "").length <= 0
      ) {
        this.showToastInfo(this.props.t("Input can't be null"), "error");
        return;
      }
    }
    this.setState({
      isEdit: !isEdit,
    });
  }

  cleanSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  }

  addWords() {
    /* ??????????????????????????? */
    let selection = window.getSelection();
    let selectWord = selection.toString();

    var start = selection.anchorOffset;
    var end = selection.focusOffset - 1;
    var tmp = 0;
    if (end < start) {
      tmp = end;
      end = start;
      start = tmp;
      start++;
      end--;
    }
    // console.log(start, end);

    //???????????????
    let contextLimit = 467;
    let contextForQG = "";
    let { inputContext } = this.state;
    let padding = 0;
    if (start <= 233) {
      contextForQG = inputContext.slice(0, contextLimit);
    } else {
      contextForQG = inputContext.slice(
        parseInt(start - contextLimit / 2),
        parseInt(start + contextLimit / 2)
      );
      // console.log(contextForQG)
      padding = start - 234;
      start = start - padding;
      end = end - padding;
    }

    // console.log(inputContext.slice(start+padding,end+1+padding))
    // console.log(contextForQG.slice(start,end+1))
    // console.log(start, end, padding,contextForQG.length);

    let { selectWords } = this.state;

    //????????????
    let isWordRepeat = false;
    selectWords.map((word) => {
      let { start_at, end_at } = word;
      // console.log(start_at,start,padding)
      // console.log(end_at,end,padding)
      if (
        start_at === start &&
        end_at === end &&
        selectWord === word.tag &&
        padding === word.tag_padding
      ) {
        isWordRepeat = true;
      }
      return true;
    });

    if (isWordRepeat) {
      this.cleanSelection();
      return;
    }

    if (selectWord !== "" && selectWord.replace(/ /g, "").length > 0) {
      selectWords.push({
        tag_padding: padding,
        tag: selectWord,
        start_at: start,
        end_at: end,
        context: contextForQG, //???????????????????????????
      });
      this.setState({
        selectWords,
      });
    }
    if (selectWords.length === 1) {
      this.showToastInfo(this.props.t("Click block to cancel select"));
    }
    this.cleanSelection();
  }

  removeSelect(start, end, tag) {
    /* remove word by start_at */
    let { selectWords } = this.state;
    selectWords = selectWords.filter((word) => {
      let { start_at, end_at } = word;
      return !(start_at === start && end_at === end && tag === word.tag);
    });
    // console.log(selectWords)
    this.setState({
      selectWords,
    });
  }

  triggerQG() {
    if (this.state.selectWords.length > 0) {
      this.showToastInfo(this.props.t("Generating"));
      this.props.dispatch(
        submitQs(
          this.state.selectWords,
          this.state.inputContext,
          this.state.language
        )
      );
    } else {
      this.showToastInfo(this.props.t("No answer is selected"), "error");
    }
  }

  render() {
    let {
      selectWords,
      isEdit,
      inputContext,
      oneClickDisable = false,
    } = this.state;
    let { t } = this.props;
    let { selectWordsSubmitting } = this.props.appState;

    return (
      <Container id="Pick-Answer">
        {/* Context area */}
        <Row>
          {isEdit ? (
            <ContextInput
              context={inputContext}
              textCount={true}
              helpText={t("Context-Hint")}
              onChange={(event) => {
                this.setState({
                  inputContext: event.target.value,
                });
              }}
            />
          ) : (
            <>
              <h3>
                {t("Select some words")}
                <span
                  onClick={() => {
                    showToastInfo(t("Drag to select word"));
                  }}
                  className="help-btn"
                >
                  <MdHelp />
                </span>
              </h3>
              <pre
                className="qa-context"
                onMouseUp={(event) => this.addWords(event)}
              >
                {this.state.inputContext}
              </pre>
            </>
          )}

          {/* Model language buttons */}
          {/* UNCOMMENT THIS WHEN CHINESE MODELS ARE READY */}
          {/* <Form.Group className="mb-3">
            <Form.Label>{t("Model-Language")}</Form.Label>
            <Col>
              <ButtonGroup aria-label="Model language setting button">
                <Button
                  variant="outline-primary"
                  active={this.state.language === "en-US"}
                  onClick={() => {
                    this.setState({ language: "en-US" });
                  }}
                >
                  {t("Model-enUS")}
                </Button>
                <Button
                  variant="outline-primary"
                  active={this.state.language === "zh-TW"}
                  disabled={true}
                  onClick={() => {
                    this.setState({ language: "zh-TW" });
                  }}
                >
                  {t("Model-zhTW")}
                </Button>
              </ButtonGroup>
            </Col>
          </Form.Group> */}

          {/* Edit / Confirm Button */}
          <Button
            variant={isEdit ? "success" : "secondary"}
            onClick={(e) => {
              if (!isEdit) {
                if (!oneClickDisable) {
                  this.showToastInfo(t("Double click to confirm"));
                }
                this.setState({
                  oneClickDisable: true,
                });
                setTimeout(() => {
                  this.setState({
                    oneClickDisable: false,
                  });
                }, 3000);
              } else {
                this.confirmContext(e);
              }
            }}
            onDoubleClick={(e) => {
              this.setState({
                selectWords: [],
              });
              this.confirmContext(e);
            }}
          >
            {isEdit ? (
              <span>
                {t("Confirm")} <MdLockOpen />
              </span>
            ) : (
              <span>
                {t("Edit")} <MdLockOutline />
              </span>
            )}
          </Button>
        </Row>

        {/* Selected Answer Block */}
        <Row ref={this.pickedBlock} className="mt-3">
          {!isEdit && (
            <>
              <h4>
                {t("Selected Answer")}
                <span
                  className="help-btn"
                  onClick={() => {
                    showToastInfo(t("Click block to cancel select"));
                  }}
                >
                  <MdHelp />
                </span>
              </h4>

              {/* Show selected answers with buttons */}
              <div className="my-2">
                {selectWords.map((word, k) => {
                  return (
                    <Button
                      variant="danger"
                      size="sm"
                      className="mx-1"
                      key={k}
                      onClick={(event) =>
                        this.removeSelect(word.start_at, word.end_at, word.tag)
                      }
                    >
                      {word.tag}
                    </Button>
                  );
                })}
              </div>
              <GenerateButton
                onClick={this.triggerQG}
                disabled={selectWordsSubmitting}
              />
            </>
          )}
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(connect(mapStateToProps), withTranslation())(PickAnswer);
