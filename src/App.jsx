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
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { compose } from "redux";

const routes = [
  {
    path: "/",
    name: "Querator AI",
    element: <QueratorAI />,
  },
  {
    path: "/group-mode",
    name: "Querator Group AI",
    element: <QueratorGroupAI />,
  },
  {
    path: "distractor-mode",
    name: "Distractor AI",
    element: <DistractorAI />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
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
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
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
