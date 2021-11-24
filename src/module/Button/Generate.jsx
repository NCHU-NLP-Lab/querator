import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

function GenerateButton(props) {
  const { t } = useTranslation();

  return (
    <Button
      variant={props.variant || "primary"}
      disabled={props.disabled}
      onClick={props.onClick}
    >
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

export default GenerateButton;
