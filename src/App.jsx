import React, { Component } from "react";
import PA from "./module/PickAnsModule";
import QG from "./module/QGeneratorModule";
import Footer from "./module/FooterModule";
import AppSetting from "./module/AppConfigModule";
import DistractorAI from "./module/DistractorAIModule";
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
    this.state = { apiErr: false };
    this.setAPIError = this.setAPIError.bind(this);
    this.changeLang = this.changeLang.bind(this);
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

  render() {
    let { t, dispatch, appState } = this.props;
    let { appToken = "", showTextSlider: needShowTextSlider } = appState;
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
            <Switch>
              <Route path="/distractor-mode">
                <DistractorAI />
              </Route>
              <Route path="/">
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
