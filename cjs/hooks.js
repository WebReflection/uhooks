'use strict';
const Lie = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@webreflection/lie'));

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
    wait.then(() => {
      effects.forEach(effect => {
        effect.r();
        effect.r = null;
      });
      effects.clear();
    });
};
exports.dropEffect = dropEffect;

const getInfo = () => hooks.get(h);
exports.getInfo = getInfo;

const hasEffect = hook => fx.has(hook);
exports.hasEffect = hasEffect;

const isFunction = f => typeof f === 'function';
exports.isFunction = isFunction;

const hooked = callback => {
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
exports.hooked = hooked;

const reschedule = info => {
  if (!schedule.has(info)) {
    info.e = 1;
    schedule.add(info);
    wait.then(runSchedule);
  }
};
exports.reschedule = reschedule;

const update = ({h, c, a, e}) => {
  // avoid running schedules when the hook is
  // re-executed before such schedule happens
  if (e)
    h.apply(c, a);
};
exports.update = update;

const wait = new Lie($ => $());
exports.wait = wait;
