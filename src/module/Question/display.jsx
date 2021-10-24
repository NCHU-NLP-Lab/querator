import React from "react";
import Card from "react-bootstrap/Card";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

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
      <Card className="mb-3">
        <Card.Header>
          {this.props.context && <Card.Text>{this.props.context}</Card.Text>}
          {Boolean(this.props.options) ? (
            <Card.Title className="font-weight-bold">
              <Form.Check
                type="checkbox"
                label={this.props.question}
                checked={this.props.questionChecked}
                onChange={this.props.questionCheckboxOnChange}
                data-question-index={this.props.questionIndex}
              />
            </Card.Title>
          ) : (
            <Card.Title className="font-weight-bold">
              {this.props.question}
            </Card.Title>
          )}
        </Card.Header>
        <ListGroup variant="flush">
          {options.map((option, index) => {
            return (
              <ListGroup.Item key={`${this.props.id}-option-${index}`}>
                {option.isAnswer && this.props.answerIsInput ? (
                  <FloatingLabel label="Answer">
                    <Form.Control
                      type="text"
                      value={this.props.answer}
                      onChange={this.props.answerInputOnChange}
                      data-question-index={this.props.questionIndex}
                    />
                  </FloatingLabel>
                ) : (
                  <Form.Check
                    type="checkbox"
                    label={
                      option.isAnswer ? <b>{option.option}</b> : option.option
                    }
                    checked={
                      this.props.questionChecked &&
                      this.props.optionsChecked[index]
                    }
                    disabled={!this.props.questionChecked}
                    onChange={this.props.optionCheckboxOnChange}
                    data-question-index={this.props.questionIndex}
                    data-option-index={index}
                  />
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card>
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
