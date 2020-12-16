import {different, getInfo} from './hooks.js';

export const useCallback = (fn, guards) => useMemo(() => fn, guards);

export const useMemo = (memo, guards) => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({$: memo(), _: guards});
  else if (!guards || guards.some(different, s[i]._))
    s[i] = {$: memo(), _: guards};
  return s[info.i++].$;
};
