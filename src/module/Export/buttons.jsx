import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import config from "../../config";

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
    let data = [];
    for (let index = 0; index < this.props.questions.length; index++) {
      const context = this.props.contexts[index];
      const question = this.props.questions[index];
      let options = [];
      for (const option of this.props.options[index]) {
        options.push({ option: option, is_answer: false });
      }
      options.push({ option: this.props.answers[index], is_answer: true });
      data.push({
        context: context,
        question: question,
        options: options,
      });
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
    let { t, appState } = this.props;

    return (
      <div className="btn-group" role="group">
        <a
          type="button"
          className="btn btn-secondary"
          href="#"
          role="button"
          onClick={(event) => this.download_export(event, "json")}
        >
          JSON
        </a>
        <a
          type="button"
          className="btn btn-secondary"
          href="#"
          role="button"
          onClick={(event) => this.download_export(event, "txt")}
        >
          Plain Text
        </a>
        <a
          type="button"
          className="btn btn-secondary"
          href="#"
          role="button"
          onClick={(event) => this.download_export(event, "docx")}
        >
          Word (.docx)
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps)
)(ExportButtons);
