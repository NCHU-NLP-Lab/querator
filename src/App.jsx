import React, { Component } from "react";
import Footer from "./module/FooterModule";
import AppSetting from "./module/AppConfigModule";
import QueratorAI from "./module/QueratorAI";
import DistractorAI from "./module/DistractorAI";
import "./module/Londing/index.css";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";
import { settingLngAndModel, showTextSlider } from "./module/action.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import TextSlider from "../src/module/TextSliderModule";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = { apiErr: false };
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

  render() {
    let { appState } = this.props;
    let { showTextSlider: needShowTextSlider } = appState;

    return (
      <Router>
        <div id="QG-App">
          {needShowTextSlider && <TextSlider />}
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
            {appState.showSetting && <AppSetting />}
            <br />
            <Switch>
              <Route path="/distractor-mode">
                <DistractorAI />
              </Route>
              <Route path="/">
                <QueratorAI />
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
