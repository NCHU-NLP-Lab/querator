import { question_generate } from "util/api";
import config from "util/config";

import axios from "axios";

const { API_ENDPOINT } = config;
const axios_client = axios.create({
  headers: { AppName: "Querator" },
});

export const resetGeneratedContent = () => {
  return {
    type: "TEMP_RESET_GENERATED_CONTENT",
  };
};

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

export const showSetting = (show) => {
  return {
    type: "APP_SHOW_SETTING",
    show,
  };
};
