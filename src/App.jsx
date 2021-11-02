import "./App.css";

import { settingLngAndModel, showTextSlider } from "util/action";

import Footer from "component/Footer";
import ModeNavBar from "component/ModeNavBar";
import AppSetting from "component/SettingModal";
import DistractorAI from "page/DistractorAI";
import QueratorAI from "page/QueratorAI";
import QueratorGroupAI from "page/QueratorGroupAI";
import React, { useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { compose } from "redux";

const routes = [
  {
    path: "/",
    exact: true,
    name: "Querator AI",
    page: () => <QueratorAI />,
  },
  {
    path: "/group-mode",
    exact: true,
    name: "Querator Group AI",
    page: () => <QueratorGroupAI />,
  },
  {
    path: "/distractor-mode",
    exact: true,
    name: "Distractor AI",
    page: () => <DistractorAI />,
  },
  {
    path: "*",
    exact: false,
    page: () => <Redirect to="/" />,
  },
];

function App(props) {
  const { appState, dispatch, i18n } = props;

  const mounted = useRef();
  useEffect(() => {
    if (mounted.current === false) {
      mounted.current = true;
      const language = window.localStorage.i18nextLng || i18n.language;
      i18n.changeLanguage(language);
      dispatch(settingLngAndModel(language, language));
      let isShowTextSlider = window.localStorage.getItem(
        "already_see_text_slider"
      );
      if (!isShowTextSlider) {
        dispatch(showTextSlider(true));
      }
    }
  });

  return (
    <BrowserRouter>
      <ModeNavBar routes={routes} />
      <main id="QG-App" className="flex-shrink-0 mb-5">
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
            {routes.map((route, index) => (
              <Route key={index} exact={route.exact} path={route.path}>
                {route.page}
                {/* {route.tutorial && (
                  <TutorialModal
                    content={route.tutorial}
                    show={appState.showTextSlider}
                    onHide={() => dispatch(showTextSlider(false))}
                  />
                )} */}
              </Route>
            ))}
          </Switch>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(withTranslation(), connect(mapStateToProps))(App);
