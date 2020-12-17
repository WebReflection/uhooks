'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {observe} = require('uconnect');

const {
  hooked: $hooked,
  dropEffect,
  hasEffect
} = require('./hooks.js');

let observer = null;

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

const hooked = fn => {
  const hook = $hooked(fn);
  return function () {
    const node = hook.apply(this, arguments);
    if (hasEffect(hook)) {
      const disconnectable = get(node);
      if (!disconnectable)
        throw 'unobservable';
      if (!observer)
        observer = observe();
      if (!observer.has(disconnectable))
        observer.connect(disconnectable, {
          disconnected() {
            dropEffect(hook);
          }
        });
    }
    return node;
  };
};
exports.hooked = hooked;

(m => {
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
