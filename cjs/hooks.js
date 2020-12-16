'use strict';
const Lie = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@webreflection/lie'));

let a = null, c = null, h = null;

let schedule = new Set;

const hooks = new WeakMap;

const waitTick = new Lie($ => $());

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
  previous.forEach(update);
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
    waitTick.then(() => {
      effects.forEach(effect => {
        effect.r();
        effect.r = null;
      });
      effects.clear();
    });
};
exports.dropEffect = dropEffect;

const getInfo = () => {
  const info = hooks.get(h);
  info.a = a;
  info.c = c;
  return info;
};
exports.getInfo = getInfo;

const hasEffect = hook => fx.has(hook);
exports.hasEffect = hasEffect;

const isFunction = f => typeof f === 'function';
exports.isFunction = isFunction;

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
