let defaultState = {
  appToken: window.localStorage.getItem("appToken") || "",
  isLoging: false,
  selectWords: [],
  selectWordsRaw: [],
  selectWordsSubmitting: false,
  showSetting: false,
  lng: "en-US",
  model: "en-US",
  lastSubmitArticle: "",
  pickAnsRaw: [],
  fullContext: "",
  submitCount: 0,
  submitTotal: 0,
  showTextSlider: false,
  distractor: {},
};

const AppState = (state = defaultState, action) => {
  console.log(action);
  switch (action.type) {
    case "CLEAN_DISTRACTORS":
      state.distractor[action.save_index.toString()] = [];
      return Object.assign({}, state);

    case "SAVE_DISTRACTORS":
      state.distractor[action.save_index.toString()] =
        action.distractors.slice(); // 將save_index轉換為字串作為key
      return Object.assign({}, state);

    case "SHOW_TEXT_SLIDER":
      return Object.assign({}, state, {
        showTextSlider: action.show,
      });
    case "USER_LOGIN":
      return Object.assign({}, state, {
        appToken: action.token,
      });
    case "USER_LOGINING":
      return Object.assign({}, state, {
        isLoging: action.loging,
      });
    case "SETTING_LNG_AND_MODEL":
      if (action.lng === "NULL") action.lng = state.lng;
      if (action.model === "NULL") action.model = state.model;
      return Object.assign({}, state, {
        lng: action.lng,
        model: action.model,
      });

    case "SUBMIT_START":
      return Object.assign({}, state, {
        selectWordsSubmitting: true,
        fullContext: action.fullContext,
        submitCount: 0,
        submitTotal: action.submitTotal,
      });

    case "SUBMIT_ADD_COUNT":
      return Object.assign({}, state, {
        submitCount: state.submitCount + 1,
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

export default AppState;
