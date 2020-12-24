import {fx, effects, layoutEffects, different, getInfo} from './hooks.js';

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

export const useEffect = createEffect(effects);

export const useLayoutEffect = createEffect(layoutEffects);
