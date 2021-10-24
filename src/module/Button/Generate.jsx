import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

function GenerateButton(props) {
  let { t } = props;

  return (
    <Button variant="primary" disabled={props.disabled} onClick={props.onClick}>
      {props.disabled ? (
        <>
          {t("Generating")}
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        </>
      ) : (
        t("Generate")
      )}
    </Button>
  );
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(GenerateButton);
