import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class QuestionDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    // Process options
    let options = [{ option: this.props.answer, isAnswer: true }];
    if (this.props.options) {
      for (const option of this.props.options) {
        options.push({ option: option, isAnswer: false });
      }
    }

    // Render UI
    return (
      <div className="card mb-3">
        <div className="card-header">
          {this.props.context && (
            <p className="card-text">{this.props.context}</p>
          )}
          {Boolean(this.props.options) && (
            <input
              type="checkbox"
              className="form-check-input"
              id={`question-display-${this.props.id}-question-checkbox`}
              checked={this.props.questionChecked}
              onChange={this.props.questionCheckboxOnChange}
              data-question-index={this.props.questionIndex}
            ></input>
          )}
          <h5 className="card-title font-weight-bold">{this.props.question}</h5>
        </div>
        <ul className="list-group list-group-flush">
          {options.map((option, index) => {
            return (
              <li
                className="list-group-item"
                key={`${this.props.id}-option-${index}`}
              >
                {option.isAnswer && this.props.answerIsInput ? (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`question-display-${this.props.id}-answer-checkbox`}
                      defaultChecked
                      disabled
                    ></input>
                    <input
                      type="text"
                      className="form-input"
                      value={this.props.answer}
                      onChange={this.props.answerInputOnChange}
                      id={`question-display-${this.props.id}-answer-checkbox`}
                      data-question-index={this.props.questionIndex}
                    />
                  </div>
                ) : (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`question-display-${this.props.id}-option-${index}`}
                      checked={
                        this.props.questionChecked &&
                        this.props.optionsChecked[index]
                      }
                      disabled={!this.props.questionChecked}
                      onChange={this.props.optionCheckboxOnChange}
                      data-question-index={this.props.questionIndex}
                      data-option-index={index}
                    ></input>
                    <label
                      className="form-check-label"
                      htmlFor={`question-display-${this.props.id}-option-${index}`}
                    >
                      {option.isAnswer ? <b>{option.option}</b> : option.option}
                    </label>
                  </div>
                )}
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
