'use strict';
const Lie = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('@webreflection/lie'));

let info = null, schedule = new Set;

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

const fx = new WeakMap;
exports.fx = fx;
const effects = [];
exports.effects = effects;
const layoutEffects = [];
exports.layoutEffects = layoutEffects;

function different(value, i) {
  return value !== this[i];
}
exports.different = different;

const dropEffect = hook => {
  const effects = fx.get(hook);
  if (effects)
    wait.then(() => {
      effects.forEach(effect => {
        effect.r();
        effect.r = null;
        effect.d = true;
      });
      effects.clear();
    });
};
exports.dropEffect = dropEffect;

const getInfo = () => info;
exports.getInfo = getInfo;

const hasEffect = hook => fx.has(hook);
exports.hasEffect = hasEffect;

const isFunction = f => typeof f === 'function';
exports.isFunction = isFunction;

const hooked = callback => {
  const current = {h: hook, c: null, a: null, e: 0, i: 0, s: []};
  return hook;
  function hook() {
    const prev = info;
    info = current;
    current.e = current.i = 0;
    try {
      return callback.apply(current.c = this, current.a = arguments);
    }
    finally {
      info = prev;
      if (effects.length)
        wait.then(effects.forEach.bind(effects.splice(0), invoke));
      if (layoutEffects.length)
        layoutEffects.splice(0).forEach(invoke);
    }
  }
};
exports.hooked = hooked;

const reschedule = info => {
  if (!schedule.has(info)) {
    info.e = 1;
    schedule.add(info);
    wait.then(runSchedule);
  }
};
exports.reschedule = reschedule;

const wait = new Lie($ => $());
exports.wait = wait;
