const {
  hooked,
  createContext, useContext,
  useCallback, useMemo,
  useEffect, useLayoutEffect,
  useReducer, useState,
  useRef
} = require('../cjs');

const Counter = (start) => {
  const [count, setCount] = useState(start);
  const {current} = useRef({});
  current.increment = () => {
    setCount(count + 1);
  };
  console.log(count);
  return current;
};

const comp = hooked(Counter)(1);
comp.increment();

(async () => {

  let test = function () {
    console.assert(arguments.length === 1 && arguments[0] === 123);
    console.assert(this == 1);
  };
  hooked(test).call(1, 123);

  test = function () {
    const [value, update] = useState(0);
    if (value === 0)
      update(value + 1);
    else
      console.assert(value === 1);
  };
  hooked(test)();

  test = function () {
    const [value, update] = useState(() => 0);
    if (value === 0)
      update(() => value + 2);
    else
      console.assert(value === 2);
  };
  hooked(test)();

  test = function () {
    const [value, update] = useReducer((_, curr) => curr, -1, () => 0);
    const [other, refresh] = useReducer((_, curr) => curr, -1, () => 0);
    if (value === 0) {
      update(value + 1);
      refresh(other + 2);
    }
    else {
      console.assert(value === 1);
      console.assert(other === 2);
    }
  };
  hooked(test)();

  test = function () {
    const ref = useRef(null);
    const [value, update] = useState(ref.current);
    if (value === null)
      update(ref.current = 123);
    else
      console.assert(ref.current === 123);
  };
  hooked(test)();

  test = function () {
    const [value, update] = useState(() => 0);
    let i = 0, y = 1;
    useLayoutEffect(() => {
      console.assert(i === 0);
    });
    useEffect(() => {
      return () => {
        y = 2;
      };
    });
    if (value === 0)
      update(1);
  };
  hooked(test)();

  let i = 0;
  test = function () {
    const [value, update] = useState(() => 0);
    useEffect(() => {
      console.assert(i++ === 0);
    }, []);
    if (value === 0)
      update(1);
  };
  hooked(test)();

  test = function () {
    const [count, setCount] = useState(0);
    const handleCount = useCallback(() => setCount(count + 1), [count]);
    if (count === 0)
      handleCount();
  };
  hooked(test)();

  test = function () {
    const [count, setCount] = useState(0);
    const handleCount = useCallback(() => setCount(count + 1));
    if (count === 0)
      handleCount();
  };
  hooked(test)();

  let ctx = createContext(1);
  test = function () {
    const value = useContext(ctx);
    useEffect(() => {
      if (value === 1)
        ctx.provide(value + 1);
    }, [value]);
  };
  hooked(test)();

  test = function () {
    const [count, setCount] = useState(0);
    const current = useMemo(() => count, [count]);
    const future = useMemo(() => count, []);
    if (current === future)
      setCount(current + 1);
  };
  hooked(test)();
})();
