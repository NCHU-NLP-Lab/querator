let {
  REACT_APP_API: API_ENDPOINT = "https://api.nlpnchu.org",
  REACT_APP_CH_API_SERVER: API_ZH_TW = "https://api.nlpnchu.org/zh",
  REACT_APP_EN_API_SERVER: API_EN_US = "https://api.nlpnchu.org/en",
} = process.env;

const config = {
  API_ENDPOINT,
  API_ZH_TW,
  API_EN_US,
};

export default config;
