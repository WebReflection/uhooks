'use strict';
const {
  hooked: $hooked,
  dropEffect: $dropEffect,
  hasEffect: $hasEffect
} = require('./hooks.js');

const hooks = new WeakMap;

const dropEffect = hook => $dropEffect(hooks.get(hook));
exports.dropEffect = dropEffect;

const hasEffect = hook => $hasEffect(hooks.get(hook));
exports.hasEffect = hasEffect;

const hooked = callback => {
  const $hook = $hooked(callback);
  hooks.set(hook, $hook);
  return hook;
  async function hook() {
    return await $hook.apply(this, arguments);
  }
};
exports.hooked = hooked;

(m => {
  exports.wait = m.wait;
  exports.createContext = m.createContext;
  exports.useContext = m.useContext;
  exports.useCallback = m.useCallback;
  exports.useMemo = m.useMemo;
  exports.useEffect = m.useEffect;
  exports.useLayoutEffect = m.useLayoutEffect;
  exports.useReducer = m.useReducer;
  exports.useState = m.useState;
  exports.useRef = m.useRef;
})(require('./index.js'));
