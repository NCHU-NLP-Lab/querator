import { showToastInfo } from "./toast";
import config from "../config";
let Axios = require("axios");
let axios = undefined;

const { API_ENDPOINT, API_ZH_TW, API_EN_US } = config;

if (API_ZH_TW === "" || API_EN_US === "") {
  console.warn("API_SERVER not set");
}

const createAxios = (token) => {
  if (!token) {
    token = window.localStorage.getItem("appToken");
  }
  axios = Axios.create({
    headers: { AppName: "Querator", Authorization: token },
  });
};

createAxios();

const getApiHost = (lng) => {
  if (lng === "en-US") return API_EN_US;
  //zh-TW
  else return API_ZH_TW;
};

export const showTextSlider = (show) => {
  return {
    type: "SHOW_TEXT_SLIDER",
    show,
  };
};

export const settingLngAndModel = (lng = "NULL", model = "NULL") => {
  if (lng !== "NULL" && model !== "NULL" && window) {
    if (lng === model) {
      window.localStorage.setItem("i18nextLng", lng);
    }
  }
  return {
    type: "SETTING_LNG_AND_MODEL",
    lng,
    model,
  };
};

export const cleanDistractor = (save_index) => {
  return {
    type: "CLEAN_DISTRACTORS",
    save_index,
  };
};

export const pureGenDistractors = async (params) => {
  return await axios
    .post(`${API_EN_US}/generate-distractor`, {
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
  let apiHost = getApiHost(lng);
  return (dispatch) => {
    axios
      .post(apiHost + "/generate-distractor", {
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
          // eslint-disable-next-line
          throw "no suitable distractor avaliable";
        }
      })
      .catch((e) => {
        showToastInfo(JSON.stringify(e), "error");
        onFailCallback();
      });
  };
};

export const submitQs = (q, fullContext, lng = "zh-TW") => {
  let apiHost = getApiHost(lng);

  // Promise-Base Req
  let apiReq = (reqData) => {
    console.log(reqData);
    return axios.post(
      apiHost + "/generate-question",
      {
        answer: {
          tag: reqData.tag,
          start_at: reqData.start_at,
          end_at: reqData.end_at,
        },
        article: reqData.context,
      },
      { headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  };

  return (dispatch) => {
    dispatch({
      type: "SUBMIT_START",
      fullContext,
      submitTotal: q.length,
    });

    let responses = [];
    let onLoading = async () => {
      for (var i = 0; i < q.length; i++) {
        console.log("REQ ON:", i);
        let res = await apiReq(q[i]);
        responses = responses.concat(res.data);
        dispatch({ type: "SUBMIT_ADD_COUNT" });
      }
      if (i === q.length) {
        return Promise.resolve(responses);
      }
      return Promise.reject("API REQ FAIL");
    };
    onLoading()
      .then((data) => {
        console.log(data);
        dispatch({
          type: "SUBMIT_QUESTIONS",
          questions: data,
          pickAnsRaw: q,
        });
      })
      .catch((err) => {
        console.log(err);
        showToastInfo("Oops! Some error happened.", "error");
        dispatch({
          type: "SUBMIT_QUESTIONS_FAIL",
          questions: [],
        });
      });
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
  //show: bool
  return {
    type: "APP_SHOW_SETTING",
    show,
  };
};
