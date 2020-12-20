'use strict';
const {different, getInfo} = require('./hooks.js');

const useCallback = (fn, guards) => useMemo(() => fn, guards);
exports.useCallback = useCallback;

const useMemo = (memo, guards) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length || !guards || guards.some(different, s[i]._))
    s[i] = {$: memo(), _: guards};
  return s[info.i++].$;
};
exports.useMemo = useMemo;
