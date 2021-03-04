/*! (c) Andrea Giammarchi - ISC */
const uhooks = ((h, o, O, K) => ({
  hooked: f => {
    const k = {i: 0, s: []};
    return function H() {
      const p = h, r = o, e = O, v = K;
      h = H; o = this; O = arguments; K = k;
      K.i = 0;
      try { return f.apply(o, O); }
      finally {
        h = p; o = r; O = e; K = v;
      }
    };
  },
  useRef: current => {
    if (K.i == K.s.length)
      K.s.push({current: current});
    return K.s[K.i++];
  },
  useState: value => {
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
