import GenerateButton from "module/Button/Generate";
import ContextInput from "module/Input/Context";
import QuestionDisplay from "module/Question/display";
import QuestionAnswerPair from "module/QuestionAnswerPair";
import { showTextSlider } from "util/action";
import { pureGenDistractors } from "util/action";

import ExportButtons from "component/Export";
import TutorialModal from "component/TutorialModal";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import tutorial from "./tutorial";

function DistractorAI(props) {
  const [questionSets, setQuestionSets] = useState([
    {
      context: `Humanity needs to "grow up" and deal with the issue of climate change, British Prime Minister Boris Johnson told world leaders at the United Nations General Assembly in New York on Wednesday. Johnson, a last-minute addition to the speakers' list that day, slammed the world's inadequate response to the climate crisis and urged humanity to "listen to the warnings of the scientists," pointing to the Covid-19 pandemic as "an example of gloomy scientists being proved right."`,
      question_pairs: [
        {
          question: "Who is the prime minister of United Kingdom?",
          answer: "Boris Johnson",
          options: [],
        },
        {
          question: "Who is the prime minister of United Kingdom?",
          answer: "Boris Johnson",
          options: [],
        },
      ],
    },
    {
      context:
        "Two real-world studies published Wednesday confirm that the immune protection offered by two doses of Pfizer's Covid-19 vaccine drops off after two months or so, although protection against severe disease, hospitalization and death remains strong.\n\nThe studies, from Israel and from Qatar and published in the New England Journal of Medicine, support arguments that even fully vaccinated people need to maintain precautions against infection.\nOne study from Israel covered 4,800 health care workers a...",
      question_pairs: [
        {
          question:
            "How many doses of Pfizer's Covid-19 vaccine drops off after two months?",
          answer: "Two doses",
          options: [],
        },
      ],
    },
  ]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exportChecks, setExportChecks] = useState([]);
  const appState = useSelector((state) => state);
  const dispatch = useDispatch();
  let { t } = props;

  const toggleQuestionExportFuncGenerator = (setIndex, pairIndex) => {
    return (event) => {
      let newExportChecks = [...exportChecks];
      newExportChecks[setIndex][pairIndex] = Boolean(
        newExportChecks[setIndex][pairIndex]
      )
        ? false
        : Array(
            questionSets[setIndex].question_pairs[pairIndex].options.length + 1
          ).fill(true);
      // +1 for the answer
      setExportChecks(newExportChecks);
    };
  };

  const getDistractors = async (event) => {
    event.preventDefault();
    setGenerating(true);
    for (let setIndex = 0; setIndex < questionSets.length; setIndex++) {
      const questionSet = questionSets[setIndex];
      for (
        let pairIndex = 0;
        pairIndex < questionSet.question_pairs.length;
        pairIndex++
      ) {
        const pair = questionSet.question_pairs[pairIndex];
        let options = await pureGenDistractors({
          context: questionSet.context,
          answer: pair.answer,
          answerStart: 0,
          answerEnd: 0,
          question: pair.question,
          quantity: 3,
        });
        pair.options = options;
      }
    }
    setExportChecks(
      questionSets.map((questionSet) => {
        return questionSet.question_pairs.map((pair) => {
          return Array(pair.options.length + 1).fill(true);
        });
      })
    );
    setGenerating(false);
    setGenerated(true);
  };

  const emptySet_ = () => {
    return {
      context: "",
      question_pairs: [emptyPair_()],
    };
  };

  const emptyPair_ = () => {
    return {
      question: "",
      answer: "",
      options: [],
    };
  };

  const createSet = () => {
    let newSets = [...questionSets];
    newSets.push(emptySet_());
    setQuestionSets(newSets);
  };

  const deleteSet = (setIndex) => {
    let newSets = [...questionSets];
    newSets.splice(setIndex, 1);
    setQuestionSets(newSets);
  };

  const createPair = (setIndex) => {
    let newSets = [...questionSets];
    newSets[setIndex].question_pairs.push(emptyPair_());
    setQuestionSets(newSets);
  };

  const deletePair = (setIndex, pairIndex) => {
    let newSets = [...questionSets];
    newSets[setIndex].question_pairs.splice(pairIndex, 1);
    setQuestionSets(newSets);
  };

  const contextChange = (index, value) => {
    let newSets = [...questionSets];
    newSets[index].context = value;
    setQuestionSets(newSets);
  };

  const questionChange = (setIndex, pairIndex, value) => {
    let newSets = [...questionSets];
    newSets[setIndex].question_pairs[pairIndex].question = value;
    setQuestionSets(newSets);
  };

  const answerChange = (setIndex, pairIndex, value) => {
    let newSets = [...questionSets];
    newSets[setIndex].question_pairs[pairIndex].answer = value;
    setQuestionSets(newSets);
  };

  const generateDataForExport = () => {
    let datas = [];
    questionSets.forEach((questionSet, setIndex) => {
      let data = { context: questionSet.context, question_pairs: [] };
      questionSet.question_pairs.forEach((pair, pairIndex) => {
        if (Boolean(exportChecks[setIndex][pairIndex])) {
          let options = [{ text: pair.answer, is_answer: true }];
          pair.options.forEach((option, optionIndex) => {
            if (Boolean(exportChecks[setIndex][pairIndex][optionIndex])) {
              options.push({ text: option, is_answer: false });
            }
          });
          data.question_pairs.push({ question: pair.question, options });
        }
      });
      if (Boolean(data.question_pairs.length)) {
        datas.push(data);
      }
    });
    return datas;
  };

  return (
    <Container id="distractor-ai">
      <h1 className="text-center">Distractor AI</h1>
      {[...Array(questionSets.length)].map((e, setIndex) => (
        <div key={setIndex}>
          <Row>
            <Container>
              <Row>
                <Col xs={6} className="p-3">
                  <ContextInput
                    label={`${t("Context")} ${setIndex + 1}`}
                    context={questionSets[setIndex].context}
                    onChange={(event) => {
                      contextChange(setIndex, event.target.value);
                    }}
                  />
                </Col>
                <Col xs={6} className="p-3">
                  {questionSets[setIndex].question_pairs.map(
                    (pair, pairIndex) => (
                      <Form key={`set-${setIndex}-qa-input-${pairIndex}`}>
                        <QuestionAnswerPair
                          pairIndex={pairIndex}
                          pair={pair}
                          questionChange={(event) => {
                            event.preventDefault();
                            questionChange(
                              setIndex,
                              pairIndex,
                              event.target.value
                            );
                          }}
                          answerChange={(event) => {
                            event.preventDefault();
                            answerChange(
                              setIndex,
                              pairIndex,
                              event.target.value
                            );
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(event) => {
                            event.preventDefault();
                            deletePair(setIndex, pairIndex);
                          }}
                        >
                          Remove this pair
                        </Button>
                        <hr />
                      </Form>
                    )
                  )}
                  <Button
                    variant="success"
                    size="sm"
                    onClick={(event) => {
                      event.preventDefault();
                      createPair(setIndex);
                    }}
                  >
                    Add QA Pair
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-end">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(event) => {
                    event.preventDefault();
                    deleteSet(setIndex);
                  }}
                >
                  {t("Remove This Set")}
                </Button>
              </Row>
            </Container>
          </Row>
          <hr />
        </div>
      ))}
      <Row>
        <Button
          variant="success"
          className="mb-2"
          onClick={(event) => {
            event.preventDefault();
            createSet();
          }}
        >
          {t("Add More Set")}
        </Button>
        <GenerateButton
          className="m-2"
          onClick={getDistractors}
          disabled={generating}
        />
      </Row>
      <hr />
      {generated && (
        <div>
          {questionSets.map((questionSet, setIndex) => {
            return questionSet.question_pairs.map((pair, pairIndex) => {
              // Process options for QuestionDisplay
              let pairChecks = exportChecks[setIndex][pairIndex];
              let QDoption = [
                {
                  text: pair.answer,
                  textBold: true,
                  checkType: "checkbox",
                  isChecked: pairChecks && pairChecks[0], // Ideally, this should always be true
                  checkDisabled: !Boolean(pairChecks),
                },
              ];
              pair.options.forEach((option, optionIndex) => {
                QDoption.push({
                  text: option,
                  textBold: false,
                  checkType: "checkbox",
                  // +1 for the answer
                  isChecked: pairChecks && pairChecks[optionIndex + 1],
                  checkDisabled: !Boolean(pairChecks),
                  checkboxOnChange: (event) => {
                    let newExportChecks = [...exportChecks];
                    newExportChecks[setIndex][pairIndex][optionIndex + 1] =
                      !newExportChecks[setIndex][pairIndex][optionIndex + 1];
                    setExportChecks(newExportChecks);
                  },
                });
              });

              return (
                <QuestionDisplay
                  key={`question-display-${setIndex}-${pairIndex}`}
                  listings={QDoption}
                  preTitle={questionSet.context}
                  title={pair.question}
                  titleChecked={Boolean(exportChecks[setIndex][pairIndex])}
                  titleCheckboxOnChange={toggleQuestionExportFuncGenerator(
                    setIndex,
                    pairIndex
                  )}
                />
              );
            });
          })}
          <ExportButtons getQuestionSets={generateDataForExport} />
        </div>
      )}
      <TutorialModal
        content={tutorial}
        show={appState.showTextSlider}
        onHide={() => dispatch(showTextSlider(false))}
      />
    </Container>
  );
}

export default withTranslation()(DistractorAI);
