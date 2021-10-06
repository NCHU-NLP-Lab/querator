import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice();
}

class QuestionDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    let options = [];
    for (const option of this.props.options) {
      options.push({ option: option, isAnswer: false });
    }
    options.push({ option: this.props.answer, isAnswer: true });
    this.setState({ options: shuffle(options) });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="card mb-3">
        <div className="card-header">
          <p className="m-0">{this.props.question}</p>
        </div>
        <ul className="list-group list-group-flush">
          {this.state.options.map((option, index) => {
            return (
              <li
                className="list-group-item"
                key={`${this.props.id}-option-${index}`}
              >
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`question-display-${this.props.id}-option-${index}`}
                    defaultChecked={option.isAnswer}
                    disabled
                  ></input>
                  <label
                    className="form-check-label"
                    for={`question-display-${this.props.id}-option-${index}`}
                  >
                    {option.isAnswer ? <b>{option.option}</b> : option.option}
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
