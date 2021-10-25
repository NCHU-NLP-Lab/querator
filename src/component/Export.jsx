import config from "util/config";

import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

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

class ExportButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.download_export = this.download_export.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  download_export(event, format) {
    event.preventDefault();

    let data = this.props.getQuestionSets();
    if (!Array.isArray(data) || !data.length) {
      console.log("Exported data is not array or is empty");
      return;
    }

    fetch(`${config.API_ENDPOINT}/export-qa-pairs/${format}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {
        const filename = response.headers
          .get("Content-Disposition")
          .split("filename=")[1]
          .slice(1, -1);
        response.blob().then((blob) => {
          const a = document.createElement("a");
          a.download = filename;
          a.href = window.URL.createObjectURL(blob);
          a.click();
        });
      })
      .catch((error) => console.error(error));
  }

  render() {
    let { t } = this.props;

    return (
      <>
        <h5>{t("Export Options")}</h5>
        <hr />
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={(event) => this.download_export(event, "json")}
          >
            {t("JSON")}
          </Button>
          <Button
            variant="secondary"
            onClick={(event) => this.download_export(event, "txt")}
          >
            {t("Plain Text")}
          </Button>
          <Button
            variant="secondary"
            onClick={(event) => this.download_export(event, "docx")}
          >
            {t("Word Document")}
          </Button>
        </ButtonGroup>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { appState: state };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(ExportButtons);
