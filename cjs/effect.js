'use strict';
const {fx, effects, layoutEffects, different, getInfo} = require('./hooks.js');

const createEffect = stack => (callback, guards) => {
  const info = getInfo();
  const {i, s, h} = info;
  const call = i === s.length;
  if (call) {
    if (!fx.has(h))
      fx.set(h, new Set);
    s.push({$: callback, _: guards, r: null, h});
  }
  const effect = s[info.i++];
  if (call || !guards || guards.some(different, effect._))
    stack.push(effect);
};

const useEffect = createEffect(effects);
exports.useEffect = useEffect;

const useLayoutEffect = createEffect(layoutEffects);
exports.useLayoutEffect = useLayoutEffect;
