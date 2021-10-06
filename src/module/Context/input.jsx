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
    let { t } = this.props;

    return (
      <div id="context-inputs" className="form-group row">
        <label for={`context-input-${this.props.id}`}>{`${t("Context")} ${
          this.props.index + 1
        }`}</label>
        <textarea
          className="form-control"
          id={`context-input-${this.props.id}`}
          rows="4"
          value={this.props.context}
          onChange={(event) => {
            this.props.contextChange(this.props.index, event.target.value);
          }}
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
