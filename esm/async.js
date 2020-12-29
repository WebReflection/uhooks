import {
  hooked as $hooked,
  dropEffect as $dropEffect,
  hasEffect as $hasEffect
} from './hooks.js';

const hooks = new WeakMap;

export const dropEffect = hook => $dropEffect(hooks.get(hook));

export const hasEffect = hook => $hasEffect(hooks.get(hook));

export const hooked = callback => {
  const $hook = $hooked(callback);
  hooks.set(hook, $hook);
  return hook;
  async function hook() {
    return await $hook.apply(this, arguments);
  };
};

export {
  wait,
  createContext, useContext,
  useCallback, useMemo,
  useEffect, useLayoutEffect,
  useReducer, useState,
  useRef
} from './index.js';
