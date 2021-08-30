import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { genDistractors,cleanDistractor } from '../action'

function Distractor(props) {
    const appState = useSelector((state) => state)
    const dispatch = useDispatch()

    useEffect(() => {
        const lng = appState.lng
        console.log(props)
        console.log(appState)
        let { article, answer, answer_start, answer_end, question, index } = props
        dispatch(cleanDistractor(index))
        if (question!==undefined && question !== '') {
            dispatch(genDistractors(article, answer, answer_start, answer_end, question, 3, lng, index))
        }
        else{
            console.log('question is null or undefined')
        }
    // eslint-disable-next-line
    }, [])

    let { distractor = {} } = appState
    let options = distractor[props.index.toString()] || []
    // console.log(options)
    return (
        <div>
            {options.map((option, i) => {
                return (
                    <span key={i}><b>Option {i + 1}:</b> {option}<br /></span>
                )
            })}
        </div>
    )
}

export default Distractor;