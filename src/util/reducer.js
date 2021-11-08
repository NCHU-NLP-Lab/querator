let defaultState = {
  selectWords: [],
  selectWordsRaw: [],
  selectWordsSubmitting: false,
  showSetting: false,
  language: "en-US",
  lastSubmitArticle: "",
  pickAnsRaw: [],
  fullContext: "",
  submitTotal: 0,
  showTextSlider: false,
  distractor: {},
};

export default (state = defaultState, action) => {
  console.log(action);
  switch (action.type) {
    case "CLEAN_DISTRACTORS":
      state.distractor[action.save_index.toString()] = [];
      return { ...state };

    case "SAVE_DISTRACTORS":
      state.distractor[action.save_index.toString()] =
        action.distractors.slice(); // 將save_index轉換為字串作為key
      return { ...state };

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

    case "DEL_OR_RECOVERY_ANSWER":
      var newSelectWords = [...state.selectWords];
      newSelectWords = newSelectWords.map((w) => {
        let { tag: at, start_at: as, end_at: ae } = action.targetInfo;
        let { tag: wt, start_at: ws, end_at: we } = w;
        let actionTarget = at + as + ae;
        let stateTarget = wt + ws + we;
        if (actionTarget === stateTarget) {
          return Object.assign({}, w, {
            softDel: !w.softDel,
          });
        }
        return w;
      });
      return Object.assign({}, state, {
        selectWords: newSelectWords,
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
