const toJSON = res => res.json();

const API_ROOT = 'http://localhost:4001/api/v1';
const MAP_URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&inputtype=textquery&region=ng&address=';

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjA4LCJlbWFpbCI6IiIsInJvbGUiOiIwIiwiaWF0IjoxNTQyNjE5NzM5fQ.xdAkOs5G5iQ6Ld300Igxwjfm3budqvEUt0he97MpSQA';
const addOptions = (method, body) => {
  let res = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) res = { ...res, body: JSON.stringify(body) };
  if (token) {
    res = { ...res, headers: { ...res.headers, Authorization: `Bearer ${token}` } };
  }
  return res;
};

const api = {
  get: url => fetch(API_ROOT + url, addOptions('GET')).then(toJSON),
  post: (url, body) => fetch(API_ROOT + url, addOptions('POST', body)).then(toJSON),
  getPlace: searchString => fetch(MAP_URL + searchString).then(toJSON),
};

export default api;

export const setToken = (t) => {
  token = t;
  localStorage.setItem('token', t);
};

export const removeToken = () => {
  token = null;
  localStorage.removeItem('token');
};
