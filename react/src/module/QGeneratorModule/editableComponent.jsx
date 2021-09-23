import React, { useState, useRef } from "react";
import { MdModeEdit, MdReplay, MdCheck } from "react-icons/md";
import { connect } from "react-redux";
import { updateQuestion } from "../action";

function EComponent(props) {
  let {
    q,
    k1,
    k2,
    dispatch,
    appState,
    radioOnSelect = false,
    onClick: onClickEvent,
  } = props;
  let { selectWords } = appState;
  const [editable, setEditable] = useState(false);
  const [qText, setQText] = useState(q);
  const [qTextRollBack, setqTextRollBack] = useState(q);
  // const [lastClick, setLastClick] = useState('confirm') //confirm cancel

  const qInput = useRef(null);
  // console.log(selectWords)
  return (
    <div>
      {editable ? (
        <input
          ref={qInput}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              //更新redux,By Key
              console.log(selectWords[k1].question[k2]);
              selectWords[k1].question[k2] = qText;
              dispatch(updateQuestion(selectWords));
              setTimeout(() => {
                setQText(qText);
              }, 10);
              setEditable(false);
              e.preventDefault();
            }
          }}
          className="form-control"
          onBlur={() => {
            setTimeout(() => {
              setEditable(false);
              setQText(qTextRollBack);
            }, 5);
          }}
          value={qText}
          onChange={(e) => setQText(e.target.value)}
        />
      ) : (
        <label className="question-label">
          <input
            onClick={onClickEvent}
            readOnly
            type="radio"
            name="location"
            value={qText}
            checked={radioOnSelect}
            key={radioOnSelect}
          />{" "}
          {qText}
        </label>
      )}
      <button
        className="btn btn-sm"
        onMouseDown={(e) => {
          e.preventDefault();
          // setLastClick('confirm')
          //結束編輯
          if (editable === true) {
            //更新redux,By Key
            // console.log(selectWords[k1].question[k2])
            selectWords[k1].questions[k2] = qText;
            dispatch(updateQuestion(selectWords));
            setTimeout(() => {
              setQText(qText);
            }, 10);
          }

          //開始編輯
          if (editable === false) {
            setqTextRollBack(qText);
            //delay for qInput appear
            setTimeout(() => {
              qInput.current.focus();
            }, 0);
          }
          setEditable(!editable);
        }}
      >
        {editable ? (
          <span className="svg-big btn btn-outline-success">
            Confirm
            <MdCheck />
          </span>
        ) : (
          <MdModeEdit />
        )}
      </button>
      {!editable ? (
        ""
      ) : (
        <span
          className="svg-big btn btn-outline-danger"
          onClick={() => {
            // setLastClick('cancel')
            setQText(qTextRollBack);
            setTimeout(() => {
              setEditable(true);
              qInput.current.focus();
            }, 1);
          }}
        >
          Undo
          <MdReplay />
        </span>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};

export default connect(mapStateToProps)(EComponent);
