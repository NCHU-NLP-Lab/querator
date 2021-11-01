import React from "react";
import { useSelector } from "react-redux";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice();
}

function uniq(a) {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item !== ary[pos - 1];
  });
}

let i2a = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
};

function Distractor(props) {
  const appState = useSelector((state) => state);

  let { firstInit = false } = props;
  let { distractor = {} } = appState;
  let options = distractor[props.index.toString()] || [];
  options = options.slice();

  // 如果有混淆選項被產生，則一起把答案加入並且打亂
  if (options.length > 0) {
    options.push(props.answer);
    options = uniq(options);
  }

  return (
    <div>
      {/* firstInit: 如果是首次初始化，則不顯示讀取遮罩 */}
      {firstInit ? (
        <span className="text-secondary">wait for question select ...</span>
      ) : (
        ""
      )}
      {options.length === 0 && !firstInit ? (
        <div style={{ width: "100%", height: 25 }}>
          {props.apiError ? (
            <span className="text-danger">
              no suitable distractor avaliable
            </span>
          ) : (
            <span>option generating ...</span>
          )}
        </div>
      ) : (
        ""
      )}
      {shuffle(options).map((option, i) => {
        let isAns = option === props.answer;
        return (
          <span className={`mr-2 ${isAns ? "text-decoration" : ""}`} key={i}>
            <b>({i2a[i]})</b> {isAns ? <b>{option}</b> : option}
          </span>
        );
      })}
    </div>
  );
}

export default Distractor;
