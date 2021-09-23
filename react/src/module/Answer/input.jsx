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
    let { t, appState } = this.props;

    return (
      <div class="answer-inputs form-group">
        <label for={`answer-input-${this.props.id}`}>Answer</label>
        <input
          type="text"
          class="form-control"
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
