import { questionGenerate } from "util/api";

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

export const submitQs = (q, fullContext, language = "zh-TW") => {
  return async (dispatch) => {
    dispatch({
      type: "SUBMIT_START",
      fullContext,
      submitTotal: q.length,
    });

    const [results, error] = await questionGenerate(q, language);
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
