import { export_qa_pairs } from "util/api";

import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useTranslation } from "react-i18next";

// Expected props
// question_sets: [<set>, <set>, ...]
// set: {
//    context: <str>
//    question_pairs: [<pair>, <pair>, ...]
// }
// pair: {
//    question: <str>
//    options: [<option>, <option>, ...]
// }
// option: {
//   text: <str>
//   is_answer: <bool>
// }

function ExportButtons(props) {
  const { t } = useTranslation();

  const download_export = (event, format) => {
    event.preventDefault();

    const data = props.getQuestionSets();
    if (!Array.isArray(data) || !data.length) {
      console.log("Exported data is not array or is empty");
      return;
    }

    export_qa_pairs(data, format);
  };

  return (
    <>
      <h5>{t("Export Options")}</h5>
      <hr />
      <ButtonGroup>
        <Button
          variant="secondary"
          onClick={(event) => download_export(event, "json")}
        >
          {t("JSON")}
        </Button>
        <Button
          variant="secondary"
          onClick={(event) => download_export(event, "txt")}
        >
          {t("Plain Text")}
        </Button>
        <Button
          variant="secondary"
          onClick={(event) => download_export(event, "docx")}
        >
          {t("Word Document")}
        </Button>
      </ButtonGroup>
    </>
  );
}

export default ExportButtons;
