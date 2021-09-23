import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next';

class QuestionInput extends React.Component {
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
            <div id="question-inputs" class="form-group">
              <label for={`question-input-${this.props.id}`}>Question</label>
              <textarea class="form-control" id={`question-input-${this.props.id}`} rows="4" value={this.state.question} onChange={this.handleChange}></textarea>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state
    }
}

export default compose(withTranslation(), connect(mapStateToProps))(QuestionInput);