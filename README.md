# <em>µ</em>hooks

[![Build Status](https://travis-ci.com/WebReflection/uhooks.svg?branch=main)](https://travis-ci.com/WebReflection/uhooks) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhooks/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhooks?branch=main)

![hooks](./uhooks.jpg)

<sup>**Social Media Photo by [Tatiana Rodriguez](https://unsplash.com/@tata186) on [Unsplash](https://unsplash.com/)**</sup>

### 📣 Community Announcement

Please ask questions in the [dedicated discussions repository](https://github.com/WebReflection/discussions), to help the community around this project grow ♥

---

_micro hooks_ is a simplified _~0.8K_ alternative to [augmentor](https://github.com/WebReflection/augmentor#readme), with the following differences:

  * `hooked(fn)` is the *augmentor* entry point equivalent
  * multiple states update are applied at once asynchronously <sup><sub>(these are a *Promise.then(...)* away)</sub><sup>
  * `useEffect` is also applied asynchronously
  * there are no extra options whatsoever so it's less configurable
  * there is no `contextual` export, as every hook can have a context passed along, whenever it's needed, or a good idea at all
  * exports from `uhooks/async` allows `hooked(async () => { ... })` definitions
  * the [uhooks/e](./esm/e.js) export provides an *essential* utility with `useState` and `useRef`, usable in micro-controllers or whenever synchronous, simplified, hooks are enough, and code size/memory constraints are relevant.

The reason for this module to exist is to explore a slightly different pattern that is *not* stack-based, but that should perform overall better in real-world use cases, thanks to its smaller size and its reduced amount of invokes applied in bulks.

```js
// <script type="module"> import('//unpkg.com/uhooks?module') for ESM
// <script src="//unpkg.com/uhooks"> for a global uhooks
// const {...} = require('uhooks'); for CommonJS

import {
  hooked, wait,
  dropEffect, hasEffect,
  createContext, useContext,
  useCallback, useMemo,
  useEffect, useLayoutEffect,
  useReducer, useState,
  useRef
} from 'uhooks'; // or 'uhooks/async'

const Counter = (start) => {
  const [count, setCount] = useState(start);
  const {current} = useRef({});
  current.increment = () => {
    setCount(count + 1);
  };
  console.log(count);
  return current;
};

// logs 1, 1
const comp1 = hooked(Counter)(1);
const comp2 = hooked(Counter)(1);

// logs 2
comp1.increment();
```
