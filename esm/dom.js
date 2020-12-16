/*! (c) Andrea Giammarchi - ISC */

import {observe} from 'uconnect';

import {
  hooked as $hooked,
  dropEffect, hasEffect
} from './hooks.js';

let observer = null;

const observed = new WeakMap;

const get = node => {
  const {firstChild, nodeType} = node;
  if (nodeType)
    return nodeType < 11 ? node : firstChild;
  else {
    // give a chance to facades to return a reasonable value
    const value = node.valueOf();
    return value !== node ? get(value) : firstChild;
  }
};

export const hooked = fn => {
  const hook = $hooked(fn);
  return function () {
    const node = hook.apply(this, arguments);
    if (hasEffect(hook)) {
      const disconnectable = get(node);
      if (!disconnectable)
        throw 'unobservable';
      if (!observed.has(disconnectable)) {
        const handler = {
          disconnected() {
            dropEffect(hook);
          }
        };
        observed.set(disconnectable, handler);
        if (!observer)
          observer = observe();
        observer.connect(disconnectable, handler);
      }
    }
    return node;
  };
};

export {
  createContext, useContext,
  useCallback, useMemo,
  useEffect, useLayoutEffect,
  useReducer, useState, useRef
} from './index.js';
