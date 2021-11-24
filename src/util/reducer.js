let defaultState = {
  selectWords: [],
  selectWordsRaw: [],
  selectWordsSubmitting: false,
  showSetting: false,
  language: "en-US",
  pickAnsRaw: [],
  fullContext: "",
  submitTotal: 0,
  showTextSlider: false,
};

export default (state = defaultState, action) => {
  console.log(action);
  switch (action.type) {

    case "SHOW_TEXT_SLIDER":
      return { ...state, showTextSlider: action.show };

    case "SETTING_LANGUAGE":
      return {
        ...state,
        language: action.language ? action.language : state.language,
      };

    case "SUBMIT_START":
      return Object.assign({}, state, {
        selectWordsSubmitting: true,
        fullContext: action.fullContext,
        submitTotal: action.submitTotal,
      });

    case "SUBMIT_QUESTIONS":
      action.questions = action.questions.map((q) => {
        return Object.assign({}, q, {
          softDel: false,
        });
      });
      return Object.assign({}, state, {
        selectWordsSubmitting: false,
        selectWords: action.questions,
        selectWordsRaw: [...action.questions],
        pickAnsRaw: action.pickAnsRaw,
      });

    case "SUBMIT_QUESTIONS_FAIL":
      return Object.assign({}, state, {
        selectWordsSubmitting: false,
        selectWords: action.questions,
      });

    case "UPDATE_QUESTION":
      return Object.assign({}, state, {
        selectWords: action.questions,
      });

    case "APP_SHOW_SETTING":
      let { show } = action;
      return Object.assign({}, state, {
        showSetting: show,
      });

    default:
      return state;
  }
};
