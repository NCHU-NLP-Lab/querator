import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class ContextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { t, appState } = this.props;

    return (
      <div id="context-inputs" class="form-group">
        <label for={`context-input-${this.props.id}`}>Context</label>
        <textarea
          class="form-control"
          id={`context-input-${this.props.id}`}
          rows="4"
          value={this.props.context}
          onChange={this.props.contextChange}
        ></textarea>
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
)(ContextInput);
