import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class AnswerInputModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { t } = this.props;

    return (
      <div className="answer-inputs">
        <label htmlFor={`answer-input-${this.props.id}`}>{`${t("Answer")} ${
          this.props.index + 1
        }`}</label>
        <input
          type="text"
          className="form-control"
          id={`answer-input-${this.props.id}`}
          value={this.props.answer}
          onChange={this.props.answerChange}
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
)(AnswerInputModule);
