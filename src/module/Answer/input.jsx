import React from "react";
import Form from "react-bootstrap/Form";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

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
      <Form.Group className="answer-inputs mb-3">
        <Form.Label htmlFor={`answer-input-${this.props.id}`}>{`${t(
          "Answer"
        )} ${this.props.index + 1}`}</Form.Label>
        <Form.Control
          type="text"
          id={`answer-input-${this.props.id}`}
          value={this.props.answer}
          onChange={this.props.answerChange}
        />
      </Form.Group>
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
