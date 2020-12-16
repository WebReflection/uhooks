'use strict';
const Lie = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@webreflection/lie'));

let a = null, c = null, h = null;

let schedule = new Set;

const hooks = new WeakMap;

const invoke = fx => {
  if (typeof fx.r === 'function')
    fx.r();
  fx.r = fx.$();
};

const runSchedule = () => {
  const previous = schedule;
  schedule = new Set;
  previous.forEach(update);
};

const effects = [];
exports.effects = effects;
const layoutEffects = [];
exports.layoutEffects = layoutEffects;
const waitTick = new Lie($ => $());
exports.waitTick = waitTick;

function different(value, i) {
  return value !== this[i];
}
exports.different = different;

const getInfo = () => {
  const info = hooks.get(h);
  info.a = a;
  info.c = c;
  return info;
};
exports.getInfo = getInfo;

const hooked = callback => {
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
exports.hooked = hooked;

const reschedule = info => {
  if (!schedule.has(info)) {
    schedule.add(info);
    waitTick.then(runSchedule);
  }
};
exports.reschedule = reschedule;

const update = info => {
  info.i = 0;
  info.h.apply(info.c, info.a);
};
exports.update = update;
