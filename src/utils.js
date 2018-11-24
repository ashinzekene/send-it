// eslint-disable-next-line import/prefer-default-export
export function debounce(callback, time) {
  let interval;
  return (args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(args);
    }, time);
  };
}
