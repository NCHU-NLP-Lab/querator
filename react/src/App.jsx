import React, { Component } from "react";
import PA from "./module/PickAnsModule";
import QG from "./module/QGeneratorModule";
import Footer from "./module/FooterModule";
import AppSetting from "./module/AppConfigModule";
import QuestionInput from "./module/Question/input";
import ContextInput from "./module/Context/input";
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
      context: `Humanity needs to "grow up" and deal with the issue of climate change, British Prime Minister Boris Johnson told world leaders at the United Nations General Assembly in New York on Wednesday. Johnson, a last-minute addition to the speakers' list that day, slammed the world's inadequate response to the climate crisis and urged humanity to "listen to the warnings of the scientists," pointing to the Covid-19 pandemic as "an example of gloomy scientists being proved right."`,
      question: "Who is the prime minister of United Kingdom?",
      answer: "Boris Johnson",
    };
    this.setAPIError = this.setAPIError.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.getDistractors = this.getDistractors.bind(this);
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

  getDistractors() {
    let { dispatch } = this.props;
    dispatch(
      genDistractors(
        this.state.context,
        this.state.answer,
        0,
        0,
        this.state.question,
        3,
        "en-US",
        0,
        this.setAPIError
      )
    );
    setTimeout(() => {
      this.forceUpdate();
      console.log("forced");
    }, 5000);
  }

  contextChange = (event) => {
    this.setState({ context: event.target.value });
  };

  questionChange = (event) => {
    this.setState({ question: event.target.value });
  };

  answerChange = (event) => {
    this.setState({ answer: event.target.value });
  };

  render() {
    let { t, dispatch, appState } = this.props;
    let {
      appToken = "",
      showTextSlider: needShowTextSlider,
      distractor,
    } = appState;
    console.log(distractor);
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
            <Switch>
              <Route path="/distractor-mode">
                <ContextInput
                  context={this.state.context}
                  contextChange={this.contextChange}
                />
                <QuestionInput
                  question={this.state.question}
                  questionChange={this.questionChange}
                />
                <AnswerInput
                  answer={this.state.answer}
                  answerChange={this.answerChange}
                />
                <button
                  className="btn btn-sm btn-success"
                  onClick={this.getDistractors}
                >
                  {t("Generate")}
                </button>
                <hr />
                {distractor && 0 in distractor && (
                  <QuestionDisplay
                    question={this.state.question}
                    answer={this.state.answer}
                    options={distractor[0]}
                  />
                )}
              </Route>
              <Route path="/">
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
