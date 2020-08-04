const fetch = require("node-fetch");
const { getHeaders } = require("./auth");

const baseUrl = "https://api.telldus.com/json";

const fetchData = (url, params) => {
  let paramString = "";
  if (params) {
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      p.set(key, value);
    }
    paramString = p.toString();
  }

  let fullUrl = `${baseUrl}${url}`;
  if (paramString) fullUrl = `${fullUrl}?${paramString}`;
  const requestData = {
    url: fullUrl,
    method: "GET",
  };

  const headers = getHeaders(requestData);
  return fetch(requestData.url, { method: requestData.method, headers });
};

module.exports = {
  fetchData,
};
