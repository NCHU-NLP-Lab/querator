import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { genDistractors, cleanDistractor } from '../action'
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";

function Distractor(props) {
    console.log(props)
    const appState = useSelector((state) => state)
    const dispatch = useDispatch()

    useEffect(() => {
        const lng = appState.lng
        console.log(props)
        console.log(appState)
        let { article, answer, answer_start, answer_end, question, index } = props
        dispatch(cleanDistractor(index))
        if (question !== undefined && question !== '') {
            dispatch(genDistractors(article, answer, answer_start, answer_end, question, 3, lng, index))
        }
        else {
            console.log('question is null or undefined')
        }
        // eslint-disable-next-line
    }, [])
    let { firstInit=false } = props
    let { distractor = {} } = appState
    let options = distractor[props.index.toString()] || []
    // console.log(options)
    return (
        <div>
            {/* firstInit: 如果是首次初始化，則不顯示讀取遮罩 */}
            {firstInit?<span>wait for question selection ...</span>:''}
            {(options.length === 0 && !firstInit)?
                <LoadingMask loading={true} text={"loading..."}>
                    <div style={{ width: '100%', height: 25 }}></div>
                </LoadingMask>
                : 
            ''}
            {options.map((option, i) => {
                return (
                    <span key={i}><b>Option {i + 1}:</b> {option}<br /></span>
                )
            })}
        </div>
    )
}

export default Distractor;