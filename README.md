# <em>µ</em>hooks

[![Build Status](https://travis-ci.com/WebReflection/uhooks.svg?branch=main)](https://travis-ci.com/WebReflection/uhooks) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhooks/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhooks?branch=main)

_micro hooks_ is a simplified _~0.8K_ alternative to [augmentor](https://github.com/WebReflection/augmentor#readme) with the same API but async by default and not configurable in any way.

```js
// <script type="module"> import('//unpkg.com/uhooks?module') for ESM
// <script src="//unpkg.com/uhooks"> for a global uhooks
// const {...} = require('uhooks'); for CommonJS

import {
  hooked,
  createContext, useContext,
  useCallback, useMemo,
  useEffect, useLayoutEffect,
  useReducer, useState, useRef
} from 'uhooks';

const Counter = (start) => {
  const [count, setCount] = useState(start);
  const {current} = useRef({});
  current.increment = () => {
    setCount(count + 1);
  };
  console.log(count);
  return current;
};

// logs 1
const comp = hooked(Counter)(1);
// logs 2
comp.increment();
```
