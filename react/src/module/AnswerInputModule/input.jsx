import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class AnswerInputModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleChange(event) {
    this.setState({ answer: event.target.value });
  }

  render() {
    let { t, appState } = this.props;

    return (
      <div class="answer-inputs form-group col-md-6">
        <label for={`answer-input-${this.props.id}`}>Answer</label>
        <input
          type="text"
          class="form-control"
          id={`answer-input-${this.props.id}`}
          value={this.state.answer}
          onChange={this.handleChange}
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
