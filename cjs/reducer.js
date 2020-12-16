'use strict';
const {getInfo, schedule, runSchedule, waitTick} = require('./hooks.js');

const getValue = (value, f) => typeof f == 'function' ? f(value) : f;

const useReducer = (reducer, value, init) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({
      $: typeof init === 'function' ?
          init(value) : getValue(void 0, value),
      set: value => {
        s[i].$ = reducer(s[i].$, value);
        if (!schedule.has(info)) {
          schedule.add(info);
          waitTick.then(runSchedule);
        }
      }
    });
  const {$, set} = s[info.i++];
  return [$, set];
};
exports.useReducer = useReducer;

const useState = value => useReducer(getValue, value);
exports.useState = useState;
