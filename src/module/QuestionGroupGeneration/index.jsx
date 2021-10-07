import "./index.css";
import React, { useState } from "react";
const axios = require("axios");

let API_URI = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // dev code
  API_URI = process.env.REACT_APP_DEV_API_URI || "http://localhost:8000";
} else {
  // production code
  API_URI = "";
}

console.log(API_URI);

// example input
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
let exampleInputText1 =
  "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main story arc concerns Harry's struggle against Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic and subjugate all wizards and Muggles.";
let exampleInputText2 =
  "Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss for HBO. It is an adaptation of A Song of Ice and Fire, a series of fantasy novels by George R. R. Martin, the first of which is A Game of Thrones. The show was shot in the United Kingdom, Canada, Croatia, Iceland, Malta, Morocco, and Spain. It premiered on HBO in the United States on April 17, 2011, and concluded on May 19, 2019, with 73 episodes broadcast over eight seasons.";
let exampleInputText3 =
  "Facebook is an American online social media and social networking service based in Menlo Park, California, and a flagship service of the namesake company Facebook, Inc. It was founded by Mark Zuckerberg, along with fellow Harvard College students and roommates Eduardo Saverin, Andrew McCollum, Dustin Moskovitz, and Chris Hughes. The founders of Facebook initially limited membership to Harvard students. Membership was expanded to Columbia, Stanford, and Yale before being expanded to the rest of the Ivy League, MIT, NYU, Boston University, then various other universities in the United States and Canada, and lastly high school students. Since 2006, anyone who claims to be at least 13 years old has been allowed to become a registered user of Facebook, though this may vary depending on local laws. The name comes from the face book directories often given to American university students.";
let exampleInputTexts = [
  exampleInputText1,
  exampleInputText2,
  exampleInputText3,
];
let exampleInputText =
  exampleInputTexts[getRandomInt(exampleInputTexts.length)];

function App() {
  let [context, setContext] = useState("");
  let [questionGroupSize, setQuestionGroupSize] = useState(5);
  let [questionGroup, setQuestionGroup] = useState([]);
  let [disableGenBtn, setDisableGenBtn] = useState(false);
  let [answerValue, setAnswerValue] = useState({});
  let [optionValue, setOptionValue] = useState({});
  //answerInputOnChange
  let answerInputOnChange = (e) => {
    // console.log(e, e.target.id)
    answerValue[e.target.name] = e.target.value;
    answerValue = Object.assign({}, answerValue, {
      [e.target.name]: e.target.value,
    });
    // console.log(answerValue)
    setAnswerValue(answerValue);
  };

  let genQuestionGroup = (
    context,
    question_group_size,
    candidate_pool_size
  ) => {
    if (context === "") {
      context = exampleInputText;
    }
    console.log(context, question_group_size, candidate_pool_size);
    setAnswerValue({}); // reset
    setQuestionGroup([]);
    setDisableGenBtn(true);
    axios
      .post(API_URI + "/generate-question-group", {
        context,
        question_group_size,
        candidate_pool_size,
      })
      .then(function (response) {
        let { question_group = [] } = response.data;
        setQuestionGroup(question_group);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() => {
        setDisableGenBtn(false);
      });
  };

  let genOptions = () => {
    if (context === "") {
      context = exampleInputText;
    }
    console.log(questionGroup);
    console.log(answerValue);
    // combine question and answer
    let allAnsIsNull = true;
    let question_and_answers = questionGroup.map((question, i) => {
      let answer = answerValue[`A${i + 1}.`] || "";
      if (answer !== "") {
        allAnsIsNull = false;
      }
      return { question, answer };
    });

    if (allAnsIsNull) {
      alert("Please provide answers for distractor generation.");
      return;
    }

    console.log(context);
    console.log(question_and_answers);
    setDisableGenBtn(true);
    axios
      .post(API_URI + "/generate-distractor", {
        context,
        question_and_answers,
      })
      .then((res) => {
        console.log(res.data);
        let { distractors = [] } = res.data;
        let question_answer_and_options = question_and_answers.map((qa) => {
          // get distractor
          let distractor = undefined;
          distractors.forEach((d) => {
            if (d.question === qa.question) {
              distractor = d;
            }
          });
          // merge with qa
          qa.options = distractor.options || [];
          return qa;
        });
        // change state
        question_answer_and_options.forEach((qac, i) => {
          let options = qac.options;
          optionValue = Object.assign({}, optionValue, {
            [`O${i + 1}.`]: options,
          });
        });
        setOptionValue(optionValue);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setDisableGenBtn(false);
        // setAnswerValue({}) // reset
      });
  };

  return (
    <div className="App container pt-3 mb-5">
      <h1 className="text-center mb-3">Question Group Generator Demo</h1>
      <textarea
        value={context}
        onChange={(e) => {
          setContext(e.target.value);
        }}
        className="form-control"
        placeholder={exampleInputText}
        style={{ height: 200 }}
        id="floatingTextarea"
      ></textarea>

      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="btn btn-sm btn-light w-100 collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Generation Setting
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="mb-3 row">
                <label
                  htmlFor="inputQuestionGroupSize"
                  className="col-sm-3 col-form-label"
                >
                  question group size
                </label>
                <div className="col-sm-9">
                  {/* inputQuestionGroupSize */}
                  <input
                    onChange={(e) => {
                      setQuestionGroupSize(e.target.value);
                      if (e.target.value > 10) {
                        setTimeout(() => {
                          setQuestionGroupSize(10);
                        }, 200);
                      }
                    }}
                    value={questionGroupSize}
                    type="number"
                    className="form-control"
                    id="inputQuestionGroupSize"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={disableGenBtn}
        type="button"
        className="mt-2 btn btn-success w-100"
        onClick={() =>
          genQuestionGroup(context, questionGroupSize, questionGroupSize * 2)
        }
      >
        {disableGenBtn ? "Generating..." : "Generate Question Group"}
      </button>

      <hr />

      <div
        className="displayQuesitonGroup"
        style={{ minHeight: 80, width: "100%" }}
      >
        {questionGroup.map((question, i) => {
          return (
            <div className="mb-1 row question-block pb-1" key={i}>
              <input
                type="text"
                readOnly
                className="form-control"
                id={`Q${i + 1}.`}
                value={`Q${i + 1}. ${question}`}
              />

              <hr />

              <div className="col-12 ps-2">
                <div className="row">
                  <div className="col-12">
                    <span className="me-2">A{i + 1}.</span>
                    <input
                      // className="form-control form-control-sm"
                      type="text"
                      name={`A${i + 1}.`}
                      onChange={answerInputOnChange}
                      value={answerValue[`A${i + 1}.`]}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 ps-2">
                <div className="row">
                  <div className="col-12">
                    {optionValue[`O${i + 1}.`] &&
                      optionValue[`O${i + 1}.`].map((option, i) => {
                        return (
                          <div className="mb-1" key={i}>
                            <span className="me-2">{`O${i + 1}.`}</span>
                            {option}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {questionGroup.length && (
        <button
          disabled={disableGenBtn}
          type="button"
          className="mt-2 btn btn-success w-100"
          onClick={genOptions}
        >
          {disableGenBtn ? "Generating..." : "Generate Distractor"}
        </button>
      )}
    </div>
  );
}

export default App;
