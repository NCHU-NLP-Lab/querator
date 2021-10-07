import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class QuestionInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { t } = this.props;

    return (
      <div className="question-inputs">
        <label htmlFor={`question-input-${this.props.id}`}>{`${t("Question")} ${
          this.props.index + 1
        }`}</label>
        <input
          type="text"
          className="form-control"
          id={`question-input-${this.props.id}`}
          value={this.props.question}
          onChange={this.props.questionChange}
        ></input>
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
)(QuestionInput);
