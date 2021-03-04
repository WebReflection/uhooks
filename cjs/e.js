'use strict';
/*! (c) Andrea Giammarchi - ISC */
const uhooks = ((h, o, O, K) => ({
  hooked: f => {
    const k = {i: 0, s: []};
    return function H() {
      // const [p, r, e, v] = [h, o, O, K];
      // [h, o, O, K] = [H, this, arguments, k];
      const p = h, r = o, e = O, v = K;
      h = H; o = this; O = arguments; K = k;
      K.i = 0;
      try { return f.apply(o, O); }
      finally {
        h = p; o = r; O = e; K = v;
        // [h, o, O, K] = [p, r, e, v];
      }
    };
  },
  useRef: current => {
    // const {i, s} = K;
    if (K.i == K.s.length)
      K.s.push({current: current});
    return K.s[K.i++];
  },
  useState: value => {
    // const [y, u, p, {i, s}] = [h, o, O, K];
    const y = h, u = o, p = O, i = K.i, s = K.s;
    if (i == s.length)
      s.push(value);
    return [
      s[K.i++],
      value => {
        s[i] = value;
        y.apply(u, p);
      }
    ];
  }
}))();

const hooked = uhooks.hooked;
const useRef = uhooks.useRef;
const useState = uhooks.useState;

exports.hooked = hooked;
exports.useState = useState;
exports.useRef = useRef;
