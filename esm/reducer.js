import {getInfo, reschedule} from './hooks.js';

const getValue = (value, f) => typeof f == 'function' ? f(value) : f;

export const useReducer = (reducer, value, init) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({
      $: typeof init === 'function' ?
          init(value) : getValue(void 0, value),
      set: value => {
        s[i].$ = reducer(s[i].$, value);
        reschedule(info);
      }
    });
  const {$, set} = s[info.i++];
  return [$, set];
};

export const useState = value => useReducer(getValue, value);
