/*! (c) Andrea Giammarchi - ISC */
const {hooked, useRef, useState} = ((h, o, O, K) => ({
  hooked(f) {
    const k = {i: 0, s: []};
    return function H() {
      const [p, r, e, v] = [h, o, O, K];
      [h, o, O, K] = [H, this, arguments, k];
      K.i = 0;
      try { return f.apply(o, O); }
      finally { [h, o, O, K] = [p, r, e, v]; }
    };
  },
  useRef(current) {
    const {i, s} = K;
    if (i == s.length)
      s.push({current});
    return s[K.i++];
  },
  useState(value) {
    const [y, u, p, {i, s}] = [h, o, O, K];
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

export {hooked, useState, useRef};
