import GenerateButton from "module/Button/Generate";
import ContextInput from "module/Input/Context";
import QuestionDisplay from "module/Question/display";
import { showTextSlider } from "util/action";
import {
  questionGroupDistractorGenerate,
  questionGroupGenerate,
} from "util/api";

import ExportButtons from "component/Export";
import TutorialModal from "component/TutorialModal";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";

import tutorial from "./tutorial";

function getRandomItem(array) {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

const EXAMPLE_CONTEXTS = [
  "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main story arc concerns Harry's struggle against Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic and subjugate all wizards and Muggles.",
  "Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss for HBO. It is an adaptation of A Song of Ice and Fire, a series of fantasy novels by George R. R. Martin, the first of which is A Game of Thrones. The show was shot in the United Kingdom, Canada, Croatia, Iceland, Malta, Morocco, and Spain. It premiered on HBO in the United States on April 17, 2011, and concluded on May 19, 2019, with 73 episodes broadcast over eight seasons.",
  "Facebook is an American online social media and social networking service based in Menlo Park, California, and a flagship service of the namesake company Facebook, Inc. It was founded by Mark Zuckerberg, along with fellow Harvard College students and roommates Eduardo Saverin, Andrew McCollum, Dustin Moskovitz, and Chris Hughes. The founders of Facebook initially limited membership to Harvard students. Membership was expanded to Columbia, Stanford, and Yale before being expanded to the rest of the Ivy League, MIT, NYU, Boston University, then various other universities in the United States and Canada, and lastly high school students. Since 2006, anyone who claims to be at least 13 years old has been allowed to become a registered user of Facebook, though this may vary depending on local laws. The name comes from the face book directories often given to American university students.",
];

function QueratorGroupAI(props) {
  const [settingOpen, setSettingOpen] = useState(false);
  const [questionNum, setQuestionNum] = useState(5);
  const [context, setContext] = useState(getRandomItem(EXAMPLE_CONTEXTS));
  const [disableGenBtn, setDisableGenBtn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);
  const [exportChecks, setExportChecks] = useState([]);
  const showTutorialModal = useSelector((state) => state.showTextSlider);
  const dispatch = useDispatch();

  const toggleQuestionExportFuncGenerator = (questionIndex) => {
    return (event) => {
      let newExportChecks = [...exportChecks];
      newExportChecks[questionIndex] = Boolean(newExportChecks[questionIndex])
        ? false
        : Array(options[questionIndex].length + 1).fill(true);
      // +1 for the answer
      setExportChecks(newExportChecks);
    };
  };

  let genQuestionGroup = async (
    context,
    questionGroupSize,
    candidatePoolSize
  ) => {
    setAnswers(Array(questionNum).fill("")); // reset
    setDisableGenBtn(true);

    const [result, error] = await questionGroupGenerate(
      context,
      questionGroupSize,
      candidatePoolSize,
      "en-US"
    );

    if (!error) {
      setQuestions(result.question_group);
    } else {
      console.log(error);
    }
    setDisableGenBtn(false);
  };

  let genOptions = async () => {
    // combine question and answer
    let allAnsIsNull = true;
    let questionAndAnswers = questions.map((question, i) => {
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

    setDisableGenBtn(true);

    const [result, error] = await questionGroupDistractorGenerate(
      context,
      questionAndAnswers,
      "en-US"
    );

    if (!error) {
      let question_answer_and_options = questionAndAnswers.map((qa) => {
        // get distractor
        let distractor = undefined;
        result.distractors.forEach((d) => {
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
    } else {
      console.log(error);
    }

    setDisableGenBtn(false);
  };

  let generateSetsForExport = () => {
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
    return data;
  };

  return (
    <Container id="querator-group-ai">
      <h1 className="text-center mb-3">Querator Group AI</h1>
      <ContextInput
        label="Context"
        context={context}
        onChange={(event) => {
          setContext(event.target.value);
        }}
      />

      <Button
        variant="light"
        size="sm"
        className="my-3 w-100"
        onClick={() => setSettingOpen(!settingOpen)}
        aria-expanded={settingOpen}
      >
        Generation Setting
      </Button>
      <Collapse in={settingOpen}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column>Question Group Size</Form.Label>
          <Col>
            <Form.Control
              type="number"
              onChange={(event) => {
                setQuestionNum(event.target.value);
                if (event.target.value > 10) {
                  setTimeout(() => {
                    setQuestionNum(10);
                  }, 200);
                }
              }}
              value={questionNum}
            />
          </Col>
        </Form.Group>
      </Collapse>

      <Row>
        <GenerateButton
          onClick={() =>
            genQuestionGroup(context, questionNum, questionNum * 2)
          }
          disabled={disableGenBtn}
        />
      </Row>

      <hr />

      <Row>
        <Col>
          {questions.map((question, questionIndex) => {
            // Process options for QuestionDisplay
            let QDoptions = questions.map((question, questionIndex) => {
              let questionChecks = exportChecks[questionIndex];
              let QDoption = [
                {
                  text: answers[questionIndex],
                  type: "input",
                  inputLabel: "Answer",
                  onChange: (event) => {
                    let newAnswers = [...answers];
                    newAnswers[questionIndex] = event.target.value;
                    setAnswers(newAnswers);
                  },
                },
              ];
              if (options[questionIndex]) {
                options[questionIndex].forEach((option, optionIndex) => {
                  QDoption.push({
                    text: option,
                    type: "check",
                    checkType: "checkbox",
                    textBold: false,
                    // +1 for the answer
                    isChecked:
                      questionChecks && questionChecks[optionIndex + 1],
                    disabled: !Boolean(questionChecks),
                    onCheck: (event) => {
                      let newExportChecks = [...exportChecks];
                      newExportChecks[questionIndex][optionIndex + 1] =
                        !newExportChecks[questionIndex][optionIndex + 1];
                      setExportChecks(newExportChecks);
                    },
                  });
                });
              }
              return QDoption;
            });

            return (
              <QuestionDisplay
                key={`question-display-${questionIndex}`}
                listings={QDoptions[questionIndex]}
                title={question}
                titleChecked={Boolean(exportChecks[questionIndex])}
                titleCheckboxOnChange={
                  Boolean(options.length) &&
                  toggleQuestionExportFuncGenerator(questionIndex)
                }
              />
            );
          })}
        </Col>
      </Row>
      {Boolean(questions.length) && (
        <Row>
          <GenerateButton onClick={genOptions} disabled={disableGenBtn} />
        </Row>
      )}
      {Boolean(options.length) && (
        <Row>
          <ExportButtons getQuestionSets={generateSetsForExport} />
        </Row>
      )}
      <TutorialModal
        content={tutorial}
        show={showTutorialModal}
        onHide={() => dispatch(showTextSlider(false))}
      />
    </Container>
  );
}

export default QueratorGroupAI;
