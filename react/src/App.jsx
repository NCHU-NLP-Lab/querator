import React, { Component } from "react";
import PA from "./module/PickAnsModule";
import QG from "./module/QGeneratorModule";
import Footer from "./module/FooterModule";
import AppSetting from "./module/AppConfigModule";
import QuestionInput from "./module/Question/input";
import ContextInput from "./module/Context/input";
import ExportButtons from "./module/Export/buttons";
import QuestionDisplay from "./module/Question/display";
import AnswerInput from "./module/Answer/input";
import { genDistractors } from "./module/action";
import "./module/Londing/index.css";
import { withTranslation } from "react-i18next";
import { MdSettings } from "react-icons/md";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  showSetting,
  settingLngAndModel,
  showTextSlider,
} from "./module/action.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import LoginForm from "./module/UserModule/loginForm";
import TextSlider from "../src/module/TextSliderModule";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiErr: false,
      contexts: [
        `Humanity needs to "grow up" and deal with the issue of climate change, British Prime Minister Boris Johnson told world leaders at the United Nations General Assembly in New York on Wednesday. Johnson, a last-minute addition to the speakers' list that day, slammed the world's inadequate response to the climate crisis and urged humanity to "listen to the warnings of the scientists," pointing to the Covid-19 pandemic as "an example of gloomy scientists being proved right."`,
      ],
      questions: ["Who is the prime minister of United Kingdom?"],
      answers: ["Boris Johnson"],
      distractor_mode_set_count: 1,
    };
    this.setAPIError = this.setAPIError.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.getDistractors = this.getDistractors.bind(this);
    this.removeDistractorSet = this.removeDistractorSet.bind(this);
  }

  componentDidMount() {
    // const parsed = queryString.parse(window.location.search);
    let { i18n, dispatch } = this.props;
    console.log(i18n.language, window.localStorage.i18nextLng);
    let getLanguage = () => window.localStorage.i18nextLng || i18n.language;
    dispatch(settingLngAndModel(getLanguage(), getLanguage()));
    this.changeLang(getLanguage());
    let isShowTextSlider = window.localStorage.getItem(
      "already_see_text_slider"
    );
    if (!isShowTextSlider) {
      dispatch(showTextSlider(true));
    }
  }

  changeLang(lang) {
    let { i18n, dispatch } = this.props;
    i18n.changeLanguage(lang);
    dispatch(settingLngAndModel(lang, lang));
  }

  setAPIError() {
    this.setState({ apiErr: true });
  }

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

  render() {
    let { t, dispatch, appState } = this.props;
    let {
      appToken = "",
      showTextSlider: needShowTextSlider,
      distractor: distractors,
    } = appState;
    console.log({ distractors });
    let { changeLang } = this;
    let { apiErr } = this.state;
    let isShowTextSlider = window.localStorage.getItem(
      "already_see_text_slider"
    );
    let { REACT_APP_USER_AUTH = "FALSE" } = process.env;

    return (
      <Router>
        <div id="QG-App">
          {needShowTextSlider ? <TextSlider /> : ""}
          {isShowTextSlider &&
          appToken === "" &&
          REACT_APP_USER_AUTH === "TRUE" ? (
            <LoginForm />
          ) : (
            ""
          )}{" "}
          {/* 檢測token是否存在 */}
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
          <div className="App container">
            {appState.showSetting ? <AppSetting /> : ""}
            <br />
            <h1 className="text-center">Querator AI</h1>
            <div
              className="text-center"
              style={{
                marginTop: "-10px",
              }}
            >
              <button
                className="btn btn-sm"
                onClick={() => changeLang("zh-TW")}
              >
                繁體中文
              </button>
              <button
                className="btn btn-sm"
                onClick={() => changeLang("en-US")}
              >
                English
              </button>
              <button
                className="btn btn-sm"
                onClick={() => dispatch(showTextSlider(true))}
              >
                {t("Help")}
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  dispatch(showSetting(!appState.showSetting));
                }}
              >
                <MdSettings />
              </button>
              <br />
            </div>
            <hr style={{ marginTop: "5px", marginBottom: "12px" }} />
            <Switch>
              <Route path="/distractor-mode">
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
                    <button
                      className="btn btn-primary"
                      onClick={this.getDistractors}
                    >
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
              </Route>
              <Route path="/">
                {apiErr === true ? (
                  <div className="text-center">
                    <br />
                    <p>
                      <b>{t("API error")}</b>
                    </p>
                    <br />
                  </div>
                ) : (
                  <div>
                    <PA />
                    <hr />
                    <QG />
                  </div>
                )}
              </Route>
            </Switch>
          </div>
          <br />
          <Footer />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default compose(withTranslation(), connect(mapStateToProps))(Index);
