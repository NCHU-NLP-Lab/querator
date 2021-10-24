import React from "react";
import Form from "react-bootstrap/Form";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

class ContextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { t } = this.props;

    return (
      <Form.Group className="context-inputs mb-3">
        <Form.Label htmlFor={`context-input-${this.props.id}`}>{`${t(
          "Context"
        )} ${this.props.index + 1}`}</Form.Label>
        <Form.Control
          as="textarea"
          id={`context-input-${this.props.id}`}
          rows="10"
          value={this.props.context}
          onChange={(event) => {
            this.props.contextChange(this.props.index, event.target.value);
          }}
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
)(ContextInput);
