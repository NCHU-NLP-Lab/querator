import React, { Component } from "react";
import "./loginForm.css";
import Foorter from "../FooterModule";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { settingLngAndModel, getToken } from "../action";
import { showToastInfo } from "../toast";

class UserModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      pwd: "",
    };
    this.changeLang.bind(this);
    this.getToken = this.getToken.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
  }

  pressEnter(e) {
    let self = this;
    if (e.key === "Enter") {
      self.getToken();
    }
  }

  componentDidMount() {
    window.addEventListener("keypress", this.pressEnter);
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.pressEnter);
  }

  changeLang(lang) {
    let { i18n, dispatch } = this.props;
    i18n.changeLanguage(lang);
    dispatch(settingLngAndModel(lang, lang));
  }

  getToken() {
    let { dispatch, t } = this.props;
    let { account, pwd } = this.state;
    dispatch(
      getToken(
        account,
        pwd,
        () => showToastInfo(t("Wrong username or password"), "error"),
        () => showToastInfo(t("Welcome to use Querator!"), "info")
      )
    );
  }

  render() {
    let { t, appState } = this.props,
      { isLoging } = appState;

    return (
      <div id="Login">
        <div className="login-form container">
          <h3 className="text-center">
            <b>{t("Login")}</b>
          </h3>
          <hr />
          <div className="text-center" style={{ paddingBottom: 8 }}>
            <button
              onClick={() => this.changeLang("zh-TW")}
              className="btn btn-sm"
            >
              繁體中文
            </button>
            <span style={{ display: "inline-block", width: 20 }} />
            <button
              onClick={() => this.changeLang("en-US")}
              className="btn btn-sm"
            >
              English
            </button>
            <br />
            <br />
            <input
              disabled={isLoging}
              value={this.state.account}
              onChange={(e) => {
                this.setState({
                  account: e.target.value,
                });
              }}
              className="form-control"
              placeholder={t("E-mail or Username")}
              type="text"
            />
            <br />
            <input
              disabled={isLoging}
              value={this.state.pwd}
              onChange={(e) => {
                this.setState({
                  pwd: e.target.value,
                });
              }}
              className="form-control"
              type="password"
              placeholder={t("Password")}
            />
            <br />
            <button
              disabled={isLoging}
              onClick={this.getToken}
              className="btn btn-block btn-primary"
            >
              {t("Login")}
            </button>
            <br />
            {/* <small>{t('No account yet?')} <a target="_blank" rel="noopener noreferrer" href="http://140.120.13.243:6500/register">{t('Sign up')}</a></small> */}
          </div>
          <hr />
          <Foorter />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default compose(withTranslation(), connect(mapStateToProps))(UserModule);
