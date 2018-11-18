const toJSON = res => res.json();

const API_ROOT = 'http://localhost:4001/api/v1';

let token = null;
const addOptions = (body) => {
  let res = {};
  if (body) res = { ...res, body };
  if (token) {
    res = { ...res, header: { Authorization: `Bearer ${token}` } };
  }
  return res;
};

const api = {
  get: url => fetch(API_ROOT + url, addOptions()).then(toJSON),
  post: (url, body) => fetch(API_ROOT + url, addOptions(body)).then(toJSON),
};

export default api;

export const setToken = (t) => {
  token = t;
};

export const removeToken = () => {
  token = null;
};
