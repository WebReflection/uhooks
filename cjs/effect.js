'use strict';
const {different, effects, getInfo, layoutEffects} = require('./hooks.js');

const createEffect = stack => (callback, guards) => {
  const info = getInfo();
  const {i, s} = info;
  const call = i === s.length;
  if (call)
    s.push({$: callback, _: guards, r: void 0});
  const fx = s[info.i++];
  if (call || !guards || guards.some(different, fx._))
    stack.push(fx);
};

const useEffect = createEffect(effects);
exports.useEffect = useEffect;

const useLayoutEffect = createEffect(layoutEffects);
exports.useLayoutEffect = useLayoutEffect;
