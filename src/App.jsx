import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "./module/Loading/index.css";
import Footer from "./module/FooterModule";
import AppSetting from "./module/AppConfigModule";
import QueratorAI from "./page/QueratorAI";
import DistractorAI from "./page/DistractorAI";
import QueratorGroupAI from "./page/QueratorGroupAI";
import TextSlider from "../src/module/TextSliderModule";
import { settingLngAndModel, showTextSlider } from "./module/action.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let { i18n, dispatch } = this.props;
    let language = window.localStorage.i18nextLng || i18n.language;
    i18n.changeLanguage(language);
    dispatch(settingLngAndModel(language, language));
    let isShowTextSlider = window.localStorage.getItem(
      "already_see_text_slider"
    );
    if (!isShowTextSlider) {
      dispatch(showTextSlider(true));
    }
  }

  render() {
    let { appState } = this.props;
    let { showTextSlider: needShowTextSlider } = appState;

    return (
      <Router>
        <main id="QG-App" className="flex-shrink-0">
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
            <AppSetting show={appState.showSetting} />
            <br />
            <Switch>
              <Route path="/distractor-mode">
                <DistractorAI />
              </Route>
              <Route path="/group-mode">
                <QueratorGroupAI />
              </Route>
              <Route path="/">
                <QueratorAI />
              </Route>
            </Switch>
          </div>
        </main>
        <Footer />
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(withTranslation(), connect(mapStateToProps))(App);
