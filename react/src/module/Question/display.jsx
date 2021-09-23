import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next';

class QuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleChange(event) {
      this.setState({question: event.target.value});
    }

    render() {
        let { t, appState } = this.props

        return (
          <div class="card">
            <div class="card-header">
              {this.props.question}
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id={`question-display-${this.props.id}-answer`} checked></input>
                  <label class="form-check-label" for={`question-display-${this.props.id}-answer`}><b>{this.props.answer}</b></label>
                </div>
              </li>
              {this.props.options.map((option, index) => {
                return <li class="list-group-item">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id={`question-display-${this.props.id}-option-${index}`}></input>
                    <label class="form-check-label" for={`question-display-${this.props.id}-option-${index}`}>{option}</label>
                  </div>
                </li>
              })}
            </ul>
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state
    }
}

export default compose(withTranslation(), connect(mapStateToProps))(QuestionDisplay);