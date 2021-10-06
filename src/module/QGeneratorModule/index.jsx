import "./index.css";
import { compose } from "redux";
import { connect } from "react-redux";
import { delAnswer, updateQuestion } from "../action";
import { IoMdAdd } from "react-icons/io";
import { MdClose, MdReplay } from "react-icons/md";
import { showToastInfo } from "../toast.js";
import { withTranslation } from "react-i18next";
import Distractor from "./distractor";
import ExportButtons from "../Export/buttons";
import EditableComponent from "./editableComponent";
import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRadios: [],
    };
    this.QGBlock = React.createRef();
    this.srollToBlock = this.srollToBlock.bind(this);
    this.editQuestion = this.editQuestion.bind(this);
    this.radioOnselectEvent = this.radioOnselectEvent.bind(this);
    this.radioOnClick = this.radioOnClick.bind(this);
    this.getDateTime = this.getDateTime.bind(this);
    this.delAnswerBlock = this.delAnswerBlock.bind(this);
    this.addEmptyQuestion = this.addEmptyQuestion.bind(this);
    this.generateDataForExport = this.generateDataForExport.bind(this);
  }

  componentDidUpdate() {
    let { appState } = this.props;
    let { selectWordsSubmitting } = appState;
    if (selectWordsSubmitting) {
      this.srollToBlock(this.QGBlock);
    }
  }

  delAnswerBlock = (e, word, k1Index) => {
    /*
     * 軟刪除
     */
    let { dispatch } = this.props;
    let { selectRadios } = this.state;
    selectRadios = selectRadios.filter((r) => {
      return r.k1 !== k1Index;
    });
    console.log(selectRadios.length, selectRadios);
    this.setState({
      selectRadios,
    });
    dispatch(delAnswer(word, k1Index));
    e.preventDefault();
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let { appState } = nextProps;
    if (appState.selectWordsSubmitting) {
      return {
        selectRadios: [],
      };
    }
    return null;
  }

  radioOnselectEvent = (index, i) => {
    /*
     * radio選擇事件
     * 根據已選擇的物件及傳入的index返回一個falg
     */
    let { selectRadios } = this.state;
    let selectFlag = false;
    selectRadios.forEach((sr) => {
      if (sr.k1 === index && sr.k2 === i) {
        selectFlag = true;
      }
    });
    return selectFlag;
  };

  radioOnClick = (e, selectRadios, index, i) => {
    /*
     * radio點擊事件
     * 移除同樣的index(同層的點擊)，加入選擇的radio
     */
    e.preventDefault();
    selectRadios = selectRadios.filter((sw) => {
      return !(sw.k1 === index);
    });
    selectRadios.push({
      k1: index,
      k2: i,
    });
    this.setState({
      selectRadios,
    });
  };

  editQuestion = (e) => {
    e.preventDefault();
    console.log("e");
  };

  getDateTime = () => {
    var currentdate = new Date();
    var datetime =
      currentdate.getFullYear() +
      "-" +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getDate() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    return datetime;
  };

  generateDataForExport = () => {
    let { fullContext, distractor, selectWordsRaw } = this.props.appState;
    let pairs = [];
    for (let index = 0; index < this.state.selectRadios.length; index++) {
      const selection = this.state.selectRadios[index];
      if (
        selectWordsRaw[selection.k1].softDel ||
        distractor[selection.k1].length === 0
      ) {
        continue;
      }
      let options = distractor[selection.k1].map((option) => {
        return { text: option, is_answer: false };
      });
      options.push({
        text: selectWordsRaw[selection.k1].tag,
        is_answer: true,
      });
      pairs.push({
        question: selectWordsRaw[selection.k1].questions[selection.k2],
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

  getK2UnderK1 = (k1) => {
    let current_block = {};
    this.state.selectRadios.forEach((radio) => {
      if (radio.k1 === k1) {
        current_block = radio;
      }
    });
    // console.log(current_block.k2)
    return current_block.k2;
  };

  hasK1 = (k1) => {
    let flag = false;
    this.state.selectRadios.forEach((radio) => {
      if (radio.k1 === k1) {
        flag = true;
      }
    });
    return flag;
  };

  addEmptyQuestion = (index) => {
    let { dispatch } = this.props;
    let { selectWords } = this.props.appState;
    let newSelectWords = [...selectWords];
    newSelectWords[index].questions.push("");
    dispatch(updateQuestion(newSelectWords));
  };

  render() {
    let { t } = this.props;
    let {
      selectWordsSubmitting,
      selectWords,
      submitCount,
      submitTotal,
      pickAnsRaw,
      fullContext,
    } = this.props.appState;
    let { selectRadios } = this.state;
    let selectWordsAfterDel = selectWords.filter((s) => {
      let { softDel = false } = s;
      return !softDel;
    });
    return (
      <div ref={this.QGBlock} id="QG-Module">
        <div
          className={selectWordsSubmitting ? "loading-mask" : ""}
          style={{ minHeight: "200px" }}
        >
          {selectWordsSubmitting ? (
            <h4 className="loading-text text-center">
              Loading...{submitCount}/{submitTotal}
            </h4>
          ) : (
            selectWords.map((word, index) => {
              let { tag, questions, softDel = false } = word;
              return softDel !== true ? (
                <form key={index} className="alert alert-dark" role="alert">
                  {/* String(dataTip).replace(/GLB/g,'<b class="text-info">GLB</b>' */}
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
                  <span
                    className="del-answer"
                    onClick={(e) => {
                      this.delAnswerBlock(e, word, index);
                    }}
                  >
                    <MdClose />
                  </span>
                  <Distractor
                    firstInit={!this.hasK1(index)}
                    key={this.getK2UnderK1(index)}
                    index={index}
                    article={fullContext}
                    answer={tag}
                    answer_start={word.start_at}
                    answer_end={word.end_at}
                    question={this.getSelectQuestion(
                      index,
                      this.getK2UnderK1(index)
                    )}
                  />
                  <hr />
                  {questions.map((q, i) => {
                    return (
                      <EditableComponent
                        onClick={(e) =>
                          this.radioOnClick(e, selectRadios, index, i)
                        }
                        radioOnSelect={this.radioOnselectEvent(index, i)}
                        initEditable={false}
                        q={q}
                        key={i}
                        k1={index}
                        k2={i}
                      />
                    );
                  })}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      this.addEmptyQuestion(index);
                    }}
                  >
                    <IoMdAdd />
                  </button>
                </form>
              ) : (
                <form key={index} className="alert alert-light" role="alert">
                  <s>
                    <b>
                      {index + 1}. {t("Answer")}:
                    </b>
                    {tag}
                    <span
                      className="del-answer"
                      onClick={(e) => {
                        this.delAnswerBlock(e, word, index);
                      }}
                    >
                      <MdReplay />
                    </span>
                  </s>
                </form>
              );
            })
          )}
        </div>
        {Boolean(selectWordsAfterDel.length) && !selectWordsSubmitting && (
          <div className="text-left">
            {/* 偷渡tip組件...  */}
            <ReactTooltip
              key={JSON.stringify(this.state)}
              place="right"
              getContent={(dataTip) => (
                <div dangerouslySetInnerHTML={{ __html: dataTip }} />
              )}
              multiline={true}
            />
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

export default compose(connect(mapStateToProps), withTranslation())(View);
