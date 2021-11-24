import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { withTranslation } from "react-i18next";

function GenerateButton(props) {
  return (
    <Button
      variant={props.variant || "primary"}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.disabled ? (
        <>
          {props.t("Generating")}
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        </>
      ) : (
        props.t("Generate")
      )}
    </Button>
  );
}

export default withTranslation()(GenerateButton);
