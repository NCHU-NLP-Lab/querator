import CONFIG from "util/config";
import { showToastInfo } from "util/toast";

const DEFAULT_HEADERS = new Headers({
  "Content-Type": "application/json; charset=UTF-8",
});

const _handle_error = (error) => {
  console.error(error);
  showToastInfo(error.toString(), "error");
};

const _normalize_promises = async (promises) => {
  try {
    const data = await Promise.all(promises);
    return [data, null];
  } catch (error) {
    _handle_error(error);
    return [null, error];
  }
};

export const export_qa_pairs = async (data, format) => {
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
    .catch(_handle_error);
};

export const question_generate = async (sets, language = "en-US") => {
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
  return await _normalize_promises(requests);
};
