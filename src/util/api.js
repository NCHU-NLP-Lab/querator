import CONFIG from "util/config";
import { showToastInfo } from "util/toast";

const DEFAULT_HEADERS = new Headers({
  "Content-Type": "application/json; charset=UTF-8",
});

const _handleError = (error) => {
  console.error(error);
  showToastInfo(error.toString(), "error");
};

const _normalizePromises = async (promises) => {
  try {
    const data = await Promise.all(promises);
    return [data, null];
  } catch (error) {
    _handleError(error);
    return [null, error];
  }
};

export const exportQAPairs = async (data, format) => {
  fetch(`${CONFIG.API_ENDPOINT}/export-qa-pairs/${format}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: DEFAULT_HEADERS,
  })
    .then((response) => {
      const filename = response.headers
        .get("Content-Disposition")
        .split("filename=")[1]
        .slice(1, -1);
      response.blob().then((blob) => {
        const a = document.createElement("a");
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      });
    })
    .catch(_handleError);
};

export const questionGenerate = async (sets, language = "en-US") => {
  let requests = sets.map(async (set) => {
    return fetch(`${CONFIG.API_ENDPOINT}/${language}/generate-question`, {
      method: "POST",
      body: JSON.stringify({
        answer: {
          tag: set.tag,
          start_at: set.start_at,
          end_at: set.end_at,
        },
        article: set.context,
      }),
      headers: DEFAULT_HEADERS,
    }).then((response) => response.json());
  });

  // Wait for all requests to complete
  return await _normalizePromises(requests);
};

export const questionGroupGenerate = async (
  context,
  questionGroupSize,
  candidatePoolSize,
  language = "en-US"
) => {
  let request = fetch(
    `${CONFIG.API_ENDPOINT}/${language}/generate-question-group`,
    {
      method: "POST",
      body: JSON.stringify({
        context,
        question_group_size: questionGroupSize,
        candidate_pool_size: candidatePoolSize,
      }),
      headers: DEFAULT_HEADERS,
    }
  ).then((response) => response.json());

  // Wait for all requests to complete
  return (await _normalizePromises([request]))[0];
};

export const questionGroupDistractorGenerate = async (
  context,
  questionAndAnswers,
  language = "en-US"
) => {
  let request = fetch(
    `${CONFIG.API_ENDPOINT}/${language}/generate-group-distractor`,
    {
      method: "POST",
      body: JSON.stringify({
        context,
        question_and_answers: questionAndAnswers,
      }),
      headers: DEFAULT_HEADERS,
    }
  ).then((response) => response.json());

  // Wait for all requests to complete
  return (await _normalizePromises([request]))[0];
};

export const distractorGenerate = async (
  context,
  answer,
  answerStart,
  answerEnd,
  question,
  quantity,
  language = "en-US"
) => {
  let request = fetch(
    `${CONFIG.API_ENDPOINT}/${language}/generate-distractor`,
    {
      method: "POST",
      body: JSON.stringify({
        article: context,
        answer: {
          tag: answer,
          start_at: answerStart,
          end_at: answerEnd,
        },
        question,
        gen_quantity: quantity,
      }),
      headers: DEFAULT_HEADERS,
    }
  ).then((response) => response.json());

  // Wait for all requests to complete
  return (await _normalizePromises([request]))[0];
};
