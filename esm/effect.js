import {different, effects, getInfo, layoutEffects} from './hooks.js';

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

export const useEffect = createEffect(effects);

export const useLayoutEffect = createEffect(layoutEffects);
