import React from "react";
import Form from "react-bootstrap/Form";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

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
      <Form.Group className="question-inputs mb-3">
        <Form.Label htmlFor={`question-input-${this.props.id}`}>{`${t(
          "Question"
        )} ${this.props.index + 1}`}</Form.Label>
        <Form.Control
          type="text"
          id={`question-input-${this.props.id}`}
          value={this.props.question}
          onChange={this.props.questionChange}
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
)(QuestionInput);
