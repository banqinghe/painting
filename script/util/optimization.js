export function throttle(callback, interval) {
  let startTime = 0;
  return function(e) {
    let now = Date.now();
    if (now - startTime > interval) {
      callback.call(this, e);
      startTime = now;
    }
  };
}

export function debounce(callback, delay) {
  let delayId = null;
  return function(e) {
    if (delayId) {
      clearTimeout(delayId);
    }
    delayId = setTimeout(() => {
      callback.call(this, e);
      delayId = null;
    }, delay);
  };
}
