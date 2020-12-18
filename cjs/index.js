'use strict';
/*! (c) Andrea Giammarchi - ISC */

(m => {
  exports.hooked = m.hooked;
  exports.dropEffect = m.dropEffect;
  exports.hasEffect = m.hasEffect;
  exports.wait = m.wait;
})(require('./hooks.js'));
(m => {
  exports.createContext = m.createContext;
  exports.useContext = m.useContext;
})(require('./context.js'));
(m => {
  exports.useCallback = m.useCallback;
  exports.useMemo = m.useMemo;
})(require('./memo.js'));
(m => {
  exports.useEffect = m.useEffect;
  exports.useLayoutEffect = m.useLayoutEffect;
})(require('./effect.js'));
(m => {
  exports.useReducer = m.useReducer;
  exports.useState = m.useState;
})(require('./reducer.js'));
(m => {
  exports.useRef = m.useRef;
})(require('./ref.js'));
