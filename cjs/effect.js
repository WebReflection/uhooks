'use strict';
const {fx, effects, layoutEffects, different, getInfo} = require('./hooks.js');

const createEffect = stack => (callback, guards) => {
  const info = getInfo();
  const {i, s, h} = info;
  const call = i === s.length;
  info.i++;
  if (call) {
    if (!fx.has(h))
      fx.set(h, new Set);
    s[i] = {$: callback, _: guards, r: null, h};
  }
  if (call || !guards || guards.some(different, s[i]._))
    stack.push(s[i]);
  s[i].$ = callback;
  s[i]._ = guards;
};

const useEffect = createEffect(effects);
exports.useEffect = useEffect;

const useLayoutEffect = createEffect(layoutEffects);
exports.useLayoutEffect = useLayoutEffect;
