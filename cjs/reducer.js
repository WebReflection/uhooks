'use strict';
const {getInfo, isFunction, reschedule} = require('./hooks.js');

const getValue = (value, f) => isFunction(f) ? f(value) : f;

const useReducer = (reducer, value, init) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({
      $: isFunction(init) ?
          init(value) : getValue(void 0, value),
      set: value => {
        s[i].$ = reducer(s[i].$, value);
        reschedule(info);
      }
    });
  const {$, set} = s[info.i++];
  return [$, set];
};
exports.useReducer = useReducer;

const useState = value => useReducer(getValue, value);
exports.useState = useState;
