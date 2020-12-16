import Lie from '@webreflection/lie';

let a = null, c = null, h = null;

let schedule = new Set;

const hooks = new WeakMap;

const waitTick = new Lie($ => $());

const invoke = effect => {
  const {$, r, h} = effect;
  if (isFunction(r)) {
    fx.get(h).delete(r);
    r();
  }
  if (isFunction(effect.r = $()))
    fx.get(h).add(effect.r);
};

const runSchedule = () => {
  const previous = schedule;
  schedule = new Set;
  previous.forEach(update);
};

export const fx = new WeakMap;
export const effects = [];
export const layoutEffects = [];

export function different(value, i) {
  return value !== this[i];
};

export const dropEffect = hook => {
  waitTick.then(() => {
    (fx.get(hook) || []).forEach(r => { r(); });
  });
};

export const getInfo = () => {
  const info = hooks.get(h);
  info.a = a;
  info.c = c;
  return info;
};

export const hasEffect = hook => fx.has(hook);

export const isFunction = f => typeof f === 'function';

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
      if (effects.length)
        waitTick.then(effects.forEach.bind(effects.splice(0), invoke));
      if (layoutEffects.length)
        layoutEffects.splice(0).forEach(invoke);
    }
  }
};

export const reschedule = info => {
  if (!schedule.has(info)) {
    schedule.add(info);
    waitTick.then(runSchedule);
  }
};

export const update = info => {
  info.i = 0;
  info.h.apply(info.c, info.a);
};
