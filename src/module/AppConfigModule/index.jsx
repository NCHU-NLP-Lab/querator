import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "./index.css";
import { MdClose } from "react-icons/md";
import { showSetting, settingLngAndModel } from "../action";
import { compose } from "redux";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class AppConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.t = this.props.t;
    this.changeLang.bind(this);
  }

  changeLang(lang) {
    this.props.i18n.changeLanguage(lang);
    this.props.dispatch(settingLngAndModel(lang, "NULL"));
  }

  render() {
    let { dispatch, appState } = this.props;
    let { t } = this;
    let { lng, model } = appState;
    return (
      <Modal show={this.props.show} onHide={() => dispatch(showSetting(false))}>
        <Modal.Header closeButton>
          <Modal.Title>{t("setting")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Title>
            {t("UI lang")} :<b> {lng}</b>
          </Modal.Title>
          <p>{t("Select UI lang")}</p>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => this.changeLang("zh-TW")}
          >
            繁體中文
          </Button>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => this.changeLang("en-US")}
          >
            English
          </Button>
          <hr />
          <Modal.Title>
            {t("QG model traget lang")}: <b>{model}</b>
          </Modal.Title>
          <p>{t("Select Model lang")}</p>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => dispatch(settingLngAndModel("NULL", "zh-TW"))}
          >
            {t("Chinese")}
          </Button>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => dispatch(settingLngAndModel("NULL", "en-US"))}
          >
            {t("English")}
          </Button>
          <hr />
          <Modal.Title>{t("Clear data and sign out")}</Modal.Title>
          <p>{t("Clear data and sign out")}</p>
          <Button
            variant="danger"
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            {t("Confirm")}
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => dispatch(showSetting(false))}
          >
            Close <MdClose />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default compose(withTranslation(), connect(mapStateToProps))(AppConfig);
