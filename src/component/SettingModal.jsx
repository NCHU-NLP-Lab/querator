import { settingLanguage, showSetting } from "util/action";

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

function SettingModal(props) {
  const { t, i18n } = useTranslation();
  const showSettingModal = useSelector((state) => state.showSetting);
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(settingLanguage(lang));
  };

  return (
    <Modal show={showSettingModal} onHide={() => dispatch(showSetting(false))}>
      <Modal.Header closeButton>
        <Modal.Title>{t("setting")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title>
          {t("UI lang")} :<b> {language}</b>
        </Modal.Title>
        <p>{t("Select UI lang")}</p>
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => changeLang("zh-TW")}
        >
          繁體中文
        </Button>
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => changeLang("en-US")}
        >
          English
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

export default SettingModal;
