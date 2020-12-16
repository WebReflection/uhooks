import Lie from '@webreflection/lie';

let a = null, c = null, h = null;

const hooks = new WeakMap;

const invoke = fx => {
  if (typeof fx.r === 'function')
    fx.r();
  fx.r = fx.$();
};

export const effects = [];
export const layoutEffects = [];
export const waitTick = new Lie($ => $());

export function different(value, i) {
  return value !== this[i];
};

export const getInfo = () => {
  const info = hooks.get(h);
  info.a = a;
  info.c = c;
  return info;
};

export const hooked = callback => {
  hooks.set(hook, {a, c, h: hook, i: 0, s: []});
  return hook;
  function hook() {
    const pa = a, pc = c, ph = h;
    a = arguments;
    c = this;
    h = hook;
    try {
      return callback.apply(c, a);
    }
    finally {
      a = pa; c = pc; h = ph;
      if (effects.length) {
        const fx = effects.splice(0);
        waitTick.then(fx.forEach.bind(fx, invoke));
      }
      if (layoutEffects.length)
        layoutEffects.splice(0).forEach(invoke);
    }
  }
};

export let schedule = new Set;
export const runSchedule = () => {
  const previous = schedule;
  schedule = new Set;
  previous.forEach(update);
};

export const update = info => {
  info.i = 0;
  info.h.apply(info.c, info.a);
};
