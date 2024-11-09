export default function useInterval(interval = 500) {
  function _func({ callback, stopCondition }) {
    let intervalFunction;
    function _stop() {
      clearInterval(intervalFunction);
    }
    intervalFunction = setInterval(() => callback(_stop), interval);
  }
  return _func;
}
