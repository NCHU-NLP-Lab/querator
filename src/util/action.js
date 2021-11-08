import { question_generate } from "util/api";
import config from "util/config";
import { showToastInfo } from "util/toast";

import axios from "axios";

const { API_ENDPOINT } = config;
const axios_client = axios.create({
  headers: { AppName: "Querator" },
});

export const showTextSlider = (show) => {
  return {
    type: "SHOW_TEXT_SLIDER",
    show,
  };
};

export const settingLanguage = (language = "NULL") => {
  window.localStorage.setItem("i18nextLng", language);
  return {
    type: "SETTING_LANGUAGE",
    language,
  };
};

export const cleanDistractor = (save_index) => {
  return {
    type: "CLEAN_DISTRACTORS",
    save_index,
  };
};

export const pureGenDistractors = async (params) => {
  let { lng } = params;
  lng = "en-US"; // Only English is support for now
  return await axios_client
    .post(`${API_ENDPOINT}/${lng}/generate-distractor`, {
      article: params.context,
      answer: {
        tag: params.answer,
        start_at: params.answerStart,
        end_at: params.answerEnd,
      },
      question: params.question,
      gen_quantity: params.quantity,
    })
    .then((response) => {
      let { distractors = [] } = response.data;
      return distractors;
    });
};

export const genDistractors = (
  article,
  answer,
  answer_start,
  answer_end,
  question,
  gen_quantity,
  lng = "zh-TW",
  save_index = 0,
  onFailCallback = () => {}
) => {
  lng = "en-US"; // Only English is support for now
  return (dispatch) => {
    axios_client
      .post(`${API_ENDPOINT}/${lng}/generate-distractor`, {
        article,
        answer: {
          tag: answer,
          start_at: answer_start,
          end_at: answer_end,
        },
        question,
        gen_quantity,
      })
      .then((reqData) => {
        console.log(reqData);
        let { distractors = [] } = reqData.data;
        dispatch({
          type: "SAVE_DISTRACTORS",
          save_index,
          distractors,
        });
        if (distractors.length === 0) {
          throw new Error("no suitable distractor avaliable");
        }
      })
      .catch((e) => {
        showToastInfo(JSON.stringify(e), "error");
        onFailCallback();
      });
  };
};

export const submitQs = (q, fullContext, language = "zh-TW") => {
  return async (dispatch) => {
    dispatch({
      type: "SUBMIT_START",
      fullContext,
      submitTotal: q.length,
    });

    const [results, error] = await question_generate(q, language);
    if (!error) {
      dispatch({
        type: "SUBMIT_QUESTIONS",
        questions: results,
        pickAnsRaw: q,
      });
    }
  };
};

export const updateQuestion = (alreadyUpdateQuestions) => {
  return {
    type: "UPDATE_QUESTION",
    questions: alreadyUpdateQuestions,
  };
};

export const delAnswer = (targetInfo, k1Index) => {
  return {
    type: "DEL_OR_RECOVERY_ANSWER",
    targetInfo,
    k1Index,
  };
};

export const showSetting = (show) => {
  return {
    type: "APP_SHOW_SETTING",
    show,
  };
};
