import "./index.css";
import { compose } from "redux";
import { connect } from "react-redux";
import { delAnswer, updateQuestion } from "../action";
import { IoMdAdd } from "react-icons/io";
import { MdClose, MdReplay } from "react-icons/md";
import { showToastInfo } from "../toast.js";
import { withTranslation } from "react-i18next";
import Distractor from "./distractor";
import EditableComponent from "./editableComponent";
import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRadios: [],
    };
    this.srollToBlock = this.srollToBlock.bind(this);
    this.QGBlock = React.createRef();
    this.exportAsJson = this.exportAsJson.bind(this);
    this.exportAsQAPair = this.exportAsQAPair.bind(this);
    this.editQuestion = this.editQuestion.bind(this);
    this.radioOnselectEvent = this.radioOnselectEvent.bind(this);
    this.radioOnClick = this.radioOnClick.bind(this);
    this.getDateTime = this.getDateTime.bind(this);
    this.delAnswerBlock = this.delAnswerBlock.bind(this);
    this.addEmptyQuestion = this.addEmptyQuestion.bind(this);
    // this.editableComponent = this.editableComponent.bind(this)
  }

  componentDidUpdate() {
    let { appState } = this.props;
    let { selectWordsSubmitting } = appState;
    if (selectWordsSubmitting) {
      this.srollToBlock(this.QGBlock);
    }
  }

  delAnswerBlock(e, word, k1Index) {
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
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { appState } = nextProps;
    if (appState.selectWordsSubmitting) {
      return {
        selectRadios: [],
      };
    }
    return null;
  }

  radioOnselectEvent(index, i) {
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
  }

  radioOnClick(e, selectRadios, index, i) {
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
  }

  editQuestion(e) {
    e.preventDefault();
    console.log("e");
  }

  getDateTime() {
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
  }

  exportAsJson() {
    let { selectWords, pickAnsRaw, fullContext, distractor } =
      this.props.appState;
    let { selectRadios } = this.state;
    let { t } = this.props;

    let newSelectWords = [];
    newSelectWords = [...selectWords];
    newSelectWords = newSelectWords.map((sw, index) => {
      let getSelectQ = (index) => {
        /* 取得選擇的問題 */
        var sq = "";
        let options = [];
        selectRadios.forEach((rs) => {
          if (parseInt(rs.k1) === parseInt(index)) {
            sq = selectWords[rs.k1].questions[rs.k2];
            options = distractor[rs.k1.toString()] || [];
          }
        });
        return { question: sq, options };
      };
      var selectQ = getSelectQ(index);

      let newSw = { ...sw };
      return Object.assign(newSw, {
        context: pickAnsRaw[index].context,
        select_question: selectQ.question,
        options: selectQ.options,
        tag_padding: pickAnsRaw[index].tag_padding,
      });
    });

    // 篩掉軟刪除
    newSelectWords = newSelectWords.filter((s) => {
      let { softDel = false } = s;
      return !softDel;
    });
    //刪掉sofetDel key
    newSelectWords = newSelectWords.map((s) => {
      delete s["softDel"];
      return s;
    });

    let outJson = {
      context: fullContext,
      question_detail: newSelectWords,
    };
    let dataStr = JSON.stringify(outJson);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = this.getDateTime() + ".json";
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);

    if (newSelectWords.length === selectRadios.length) {
      linkElement.click();
    } else {
      showToastInfo(
        t("You have to pick the question what you want to export"),
        "error"
      );
    }
  }

  exportAsQAPair() {
    let { selectWords } = this.props.appState;
    let { selectRadios } = this.state;
    let { t } = this.props;
    var outPair = "";
    let newSelectWords = [...selectWords];

    let selectCount = 0;
    newSelectWords.forEach((sw, index) => {
      let getSelectQ = (index) => {
        /* 取得選擇的問題 */
        var sq = "";
        selectRadios.forEach((rs) => {
          if (parseInt(rs.k1) === parseInt(index)) {
            sq = selectWords[rs.k1].questions[rs.k2];
          }
        });
        return sq;
      };
      var selectQ = getSelectQ(index);
      if (sw.softDel !== true) {
        outPair = outPair + selectQ + " " + sw.tag + "\n";
        selectCount += 1;
      }
    });

    let dataStr = outPair;
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = this.getDateTime() + ".txt";
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    if (selectCount === selectRadios.length) {
      linkElement.click();
    } else {
      showToastInfo(
        t("You have to pick the question what you want to export"),
        "error"
      );
    }
  }

  srollToBlock(ref) {
    // scorll to
    window.scrollTo(0, ref.current.offsetTop);
  }

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
          className={selectWordsSubmitting === true ? "loading-mask" : ""}
          style={{ minHeight: "200px" }}
        >
          {selectWordsSubmitting === true ? (
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
                      // console.log(word.start_at, word.end_at)
                      // console.log(frontContext)
                      // console.log(endContext)
                      return (
                        frontContext +
                        `<span class="tool-tip-hl">${tag}</span>` +
                        endContext
                      );
                    })()}
                  >
                    <b>
                      {index + 1}. {t("answer")}:
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
                      {index + 1}. {t("answer")}:
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
        {selectWordsAfterDel.length > 0 && selectWordsSubmitting === false ? (
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
            <h5>{t("Export Options")}</h5>
            <hr />
            <button
              className="btn btn-secondary btn-sm"
              onClick={(e) => this.exportAsJson(e)}
            >
              JSON
            </button>
            <button
              style={{ marginLeft: "5px" }}
              className="btn btn-secondary btn-sm"
              onClick={(e) => this.exportAsQAPair(e)}
            >
              QA Pair
            </button>
          </div>
        ) : (
          <div></div>
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
