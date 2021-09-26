import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class QuestionDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleChange(event) {
    this.setState({ question: event.target.value });
  }

  render() {
    let { t, appState } = this.props;
    console.log(this.props.options);
    return (
      <div className="card mb-3">
        <div className="card-header">
          <p className="m-0">{this.props.question}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`question-display-${this.props.id}-answer`}
                defaultChecked
              ></input>
              <label
                className="form-check-label"
                for={`question-display-${this.props.id}-answer`}
              >
                <b>{this.props.answer}</b>
              </label>
            </div>
          </li>
          {this.props.options.map((option, index) => {
            return (
              <li className="list-group-item">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`question-display-${this.props.id}-option-${index}`}
                  ></input>
                  <label
                    className="form-check-label"
                    for={`question-display-${this.props.id}-option-${index}`}
                  >
                    {option}
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
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
)(QuestionDisplay);
