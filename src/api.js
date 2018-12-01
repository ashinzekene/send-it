const toJSON = res => res.json();

// const API_ROOT = 'https://send-it-andela.herokuapp.com/api/v1';
const API_ROOT = 'http://localhost:4001/api/v1';
const MAP_URL_GEOCODE = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&inputtype=textquery&region=ng&address=';

let token;
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
  patch: (url, body) => fetch(API_ROOT + url, addOptions('PATCH', body)).then(toJSON),
  getPlace: searchString => fetch(MAP_URL_GEOCODE + searchString).then(toJSON),
  getDistance: (from, to) => fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&units=matric&origins=${from}&destinations=${to}`)
    .then(toJSON),
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
