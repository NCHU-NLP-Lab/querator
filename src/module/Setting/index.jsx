import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { settingLngAndModel, showSetting, showTextSlider } from "../action.js";
import { MdSettings, MdRefresh } from "react-icons/md";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

function Setting(props) {
  let { t, dispatch, appState } = props;

  let changeLang = (lang) => {
    props.i18n.changeLanguage(lang);
    props.dispatch(settingLngAndModel(lang, lang));
  };

  return (
    <ButtonToolbar
      className="justify-content-center"
      aria-label="Setting Buttons"
    >
      <ButtonGroup size="sm" className="m-2">
        <Button variant="secondary" onClick={() => changeLang("zh-TW")}>
          繁體中文
        </Button>
        <Button variant="secondary" onClick={() => changeLang("en-US")}>
          English
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch(showTextSlider(true))}
        >
          {t("Help")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(showSetting(!appState.showSetting));
          }}
        >
          <MdSettings />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="m-2">
        <Button
          variant="danger"
          onClick={() => {
            window.location.reload();
          }}
        >
          {t("clear all data")} <MdRefresh />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(withTranslation(), connect(mapStateToProps))(Setting);
