import "./index.css";
import React, { useState } from "react";
import config from "../../config";
import QuestionDisplay from "../Question/display";
import ExportButtons from "../Export/buttons";

const axios = require("axios");

let { API_ENDPOINT } = config;

function getRandomItem(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

const EXAMPLE_CONTEXTS = [
  "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main story arc concerns Harry's struggle against Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic and subjugate all wizards and Muggles.",
  "Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss for HBO. It is an adaptation of A Song of Ice and Fire, a series of fantasy novels by George R. R. Martin, the first of which is A Game of Thrones. The show was shot in the United Kingdom, Canada, Croatia, Iceland, Malta, Morocco, and Spain. It premiered on HBO in the United States on April 17, 2011, and concluded on May 19, 2019, with 73 episodes broadcast over eight seasons.",
  "Facebook is an American online social media and social networking service based in Menlo Park, California, and a flagship service of the namesake company Facebook, Inc. It was founded by Mark Zuckerberg, along with fellow Harvard College students and roommates Eduardo Saverin, Andrew McCollum, Dustin Moskovitz, and Chris Hughes. The founders of Facebook initially limited membership to Harvard students. Membership was expanded to Columbia, Stanford, and Yale before being expanded to the rest of the Ivy League, MIT, NYU, Boston University, then various other universities in the United States and Canada, and lastly high school students. Since 2006, anyone who claims to be at least 13 years old has been allowed to become a registered user of Facebook, though this may vary depending on local laws. The name comes from the face book directories often given to American university students.",
];

function QueratorGroupAI() {
  let [context, setContext] = useState(getRandomItem(EXAMPLE_CONTEXTS));
  let [questionNum, setQuestionNum] = useState(5);
  let [questions, setQuestions] = useState([]);
  let [disableGenBtn, setDisableGenBtn] = useState(false);
  let [answers, setAnswers] = useState([]);
  let [options, setOptions] = useState([]);
  let [exportChecks, setExportChecks] = useState([]);

  let answerInputOnChange = (event) => {
    let newAnswers = [...answers];
    newAnswers[event.target.dataset.questionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  let toggleQuestionExport = (event) => {
    let index = event.target.dataset.questionIndex;
    let newExportChecks = [...exportChecks];
    newExportChecks[index] = Boolean(newExportChecks[index])
      ? false
      : Array(options[index].length + 1).fill(true);
    // +1 for the answer
    setExportChecks(newExportChecks);
  };

  let toggleOptionExport = (event) => {
    let questionIndex = event.target.dataset.questionIndex;
    let optionIndex = event.target.dataset.optionIndex;
    let newExportChecks = [...exportChecks];
    newExportChecks[questionIndex][optionIndex] =
      !newExportChecks[questionIndex][optionIndex];
    setExportChecks(newExportChecks);
  };

  let genQuestionGroup = (
    context,
    question_group_size,
    candidate_pool_size
  ) => {
    console.log(context, question_group_size, candidate_pool_size);
    setAnswers([]); // reset
    setQuestions([]);
    setDisableGenBtn(true);
    axios
      .post(`${API_ENDPOINT}/en-US/generate-question-group`, {
        context,
        question_group_size,
        candidate_pool_size,
      })
      .then(function (response) {
        let { question_group = [] } = response.data;
        setQuestions(question_group);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() => {
        setDisableGenBtn(false);
      });
  };

  let genOptions = () => {
    console.log(questions);
    console.log(answers);
    // combine question and answer
    let allAnsIsNull = true;
    let question_and_answers = questions.map((question, i) => {
      let answer = answers[i] || "";
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
      .post(`${API_ENDPOINT}/en-US/generate-group-distractor`, {
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
        let newOptionValue = [...options];
        question_answer_and_options.forEach((qac, i) => {
          newOptionValue[i] = qac.options;
        });
        setOptions(newOptionValue);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setDisableGenBtn(false);
        // setAnswers([]) // reset
      });
  };

  let getQuestionSets = () => {
    let data = [{ context, question_pairs: [] }];
    for (
      let questionIndex = 0;
      questionIndex < questions.length;
      questionIndex++
    ) {
      const question = questions[questionIndex];
      if (!exportChecks[questionIndex]) {
        continue;
      }
      let exportOptions = [{ text: answers[questionIndex], is_answer: true }];
      for (
        let optionIndex = 0;
        optionIndex < options[questionIndex].length;
        optionIndex++
      ) {
        // first option is answer, +1 for actual option
        if (!exportChecks[questionIndex][optionIndex + 1]) {
          continue;
        }
        const option = options[questionIndex][optionIndex];
        exportOptions.push({ text: option, is_answer: false });
      }
      data[0].question_pairs.push({ question, options: exportOptions });
    }
    // data = [
    //   {
    //     context,
    //     question_pairs: [...Array(questions.length)].map((e, questionIndex) => {
    //       let exportOptions = options[questionIndex].map((option) => {
    //         return { text: option, is_answer: false };
    //       });
    //       exportOptions.push({ text: answers[questionIndex], is_answer: true });
    //       return {
    //         question,
    //         options: exportOptions,
    //       };
    //     }),
    //   },
    // ];
    return data;
  };

  return (
    <div className="App container pt-3 mb-5">
      <h1 className="text-center mb-3">Querator Group AI</h1>
      <textarea
        value={context}
        onChange={(e) => {
          setContext(e.target.value);
        }}
        className="form-control"
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
            className="accordion-collapse show"
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
                      setQuestionNum(e.target.value);
                      if (e.target.value > 10) {
                        setTimeout(() => {
                          setQuestionNum(10);
                        }, 200);
                      }
                    }}
                    value={questionNum}
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
        onClick={() => genQuestionGroup(context, questionNum, questionNum * 2)}
      >
        {disableGenBtn ? "Generating..." : "Generate Question Group"}
      </button>

      <hr />

      <div
        className="displayQuesitonGroup"
        style={{ minHeight: 80, width: "100%" }}
      >
        {questions.map((question, questionIndex) => {
          return (
            <QuestionDisplay
              key={`question-display-${questionIndex}`}
              question={question}
              questionIndex={questionIndex}
              questionChecked={Boolean(exportChecks[questionIndex])}
              questionCheckboxOnChange={toggleQuestionExport}
              answer={answers[questionIndex]}
              answerIsInput
              answerInputOnChange={answerInputOnChange}
              options={options[questionIndex]}
              optionsChecked={exportChecks[questionIndex]}
              optionCheckboxOnChange={toggleOptionExport}
            />
          );
        })}
      </div>
      {Boolean(options.length) && (
        <ExportButtons getQuestionSets={getQuestionSets} />
      )}
      {Boolean(questions.length) && (
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

export default QueratorGroupAI;
