import Lie from '@webreflection/lie';

let h = null, schedule = new Set;

const hooks = new WeakMap;

const invoke = effect => {
  const {$, r, h} = effect;
  if (isFunction(r)) {
    fx.get(h).delete(effect);
    r();
  }
  if (isFunction(effect.r = $()))
    fx.get(h).add(effect);
};

const runSchedule = () => {
  const previous = schedule;
  schedule = new Set;
  previous.forEach(({h, c, a, e}) => {
    // avoid running schedules when the hook is
    // re-executed before such schedule happens
    if (e)
      h.apply(c, a);
  });
};

export const fx = new WeakMap;
export const effects = [];
export const layoutEffects = [];

export function different(value, i) {
  return value !== this[i];
};

export const dropEffect = hook => {
  const effects = fx.get(hook);
  if (effects)
    wait.then(() => {
      effects.forEach(effect => {
        effect.r();
        effect.r = null;
      });
      effects.clear();
    });
};

export const getInfo = () => hooks.get(h);

export const hasEffect = hook => fx.has(hook);

export const isFunction = f => typeof f === 'function';

export const hooked = callback => {
  const info = {h: hook, c: null, a: null, e: 0, i: 0, s: []};
  hooks.set(hook, info);
  return hook;
  function hook() {
    const p = h;
    h = hook;
    info.e = info.i = 0;
    try {
      return callback.apply(info.c = this, info.a = arguments);
    }
    finally {
      h = p;
      if (effects.length)
        wait.then(effects.forEach.bind(effects.splice(0), invoke));
      if (layoutEffects.length)
        layoutEffects.splice(0).forEach(invoke);
    }
  }
};

export const reschedule = info => {
  if (!schedule.has(info)) {
    info.e = 1;
    schedule.add(info);
    wait.then(runSchedule);
  }
};

export const wait = new Lie($ => $());
