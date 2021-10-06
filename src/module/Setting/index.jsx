import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { showSetting, showTextSlider } from "../action.js";
import { MdSettings } from "react-icons/md";

function Setting(props) {
  let { t, dispatch, appState } = props;
  return (
    <>
      <div
        className="text-center"
        style={{
          marginTop: "-10px",
        }}
      >
        <button className="btn btn-sm" onClick={() => this.changeLang("zh-TW")}>
          繁體中文
        </button>
        <button className="btn btn-sm" onClick={() => this.changeLang("en-US")}>
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
    </>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(withTranslation(), connect(mapStateToProps))(Setting);
