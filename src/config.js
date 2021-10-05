let {
  REACT_APP_API: API_ENDPOINT = "https://api.nlpnchu.org",
  REACT_APP_CH_API_SERVER: API_ZH_TW = "https://api.nlpnchu.org/zh",
  REACT_APP_EN_API_SERVER: API_EN_US = "https://api.nlpnchu.org/en",
  REACT_APP_USER_AUTH_SERVER: UDIC_SERVICES_SERVER = "https://api.nlpnchu.org",
  REACT_APP_USER_AUTH = "FALSE",
} = process.env;

const config = {
  API_ENDPOINT,
  API_ZH_TW,
  API_EN_US,
  UDIC_SERVICES_SERVER,
  REACT_APP_USER_AUTH,
};

export default config;
