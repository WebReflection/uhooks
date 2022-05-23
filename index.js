self.uhooks = (function (exports) {
  'use strict';

  let info = null, schedule = new Set;

  const invoke = effect => {
    const {$, r, h} = effect;
    if (isFunction(r)) {
      fx.get(h).delete(effect);
      r();
    }
    if (isFunction(effect.r = $()))
      fx.get(h).add(effect);
  };

  const runSchedule = () => {
    const previous = schedule;
    schedule = new Set;
    previous.forEach(({h, c, a, e}) => {
      // avoid running schedules when the hook is
      // re-executed before such schedule happens
      if (e)
        h.apply(c, a);
    });
  };

  const fx = new WeakMap;
  const effects = [];
  const layoutEffects = [];

  function different(value, i) {
    return value !== this[i];
  }
  const dropEffect = hook => {
    const effects = fx.get(hook);
    if (effects)
      wait.then(() => {
        effects.forEach(effect => {
          effect.r();
          effect.r = null;
          effect.d = true;
        });
        effects.clear();
      });
  };

  const getInfo = () => info;

  const hasEffect = hook => fx.has(hook);

  const isFunction = f => typeof f === 'function';

  const hooked = callback => {
    const current = {h: hook, c: null, a: null, e: 0, i: 0, s: []};
    return hook;
    function hook() {
      const prev = info;
      info = current;
      current.e = current.i = 0;
      try {
        return callback.apply(current.c = this, current.a = arguments);
      }
      finally {
        info = prev;
        if (effects.length)
          wait.then(effects.forEach.bind(effects.splice(0), invoke));
        if (layoutEffects.length)
          layoutEffects.splice(0).forEach(invoke);
      }
    }
  };

  const reschedule = info => {
    if (!schedule.has(info)) {
      info.e = 1;
      schedule.add(info);
      wait.then(runSchedule);
    }
  };

  const wait = Promise.resolve();

  const createContext = value => ({
    _: new Set,
    provide,
    value
  });

  const useContext = ({_, value}) => {
    _.add(getInfo());
    return value;
  };

  function provide(newValue) {
    const {_, value} = this;
    if (value !== newValue) {
      this._ = new Set;
      this.value = newValue;
      _.forEach(({h, c, a}) => {
        h.apply(c, a);
      });
    }
  }

  const useCallback = (fn, guards) => useMemo(() => fn, guards);

  const useMemo = (memo, guards) => {
    const info = getInfo();
    const {i, s} = info;
    if (i === s.length || !guards || guards.some(different, s[i]._))
      s[i] = {$: memo(), _: guards};
    return s[info.i++].$;
  };

  const createEffect = stack => (callback, guards) => {
    const info = getInfo();
    const {i, s, h} = info;
    const call = i === s.length;
    info.i++;
    if (call) {
      if (!fx.has(h))
        fx.set(h, new Set);
      s[i] = {$: callback, _: guards, r: null, d: false, h};
    }
    if (call || !guards || s[i].d || guards.some(different, s[i]._))
      stack.push(s[i]);
    s[i].$ = callback;
    s[i]._ = guards;
    s[i].d = false;
  };

  const useEffect = createEffect(effects);

  const useLayoutEffect = createEffect(layoutEffects);

  const getValue = (value, f) => isFunction(f) ? f(value) : f;

  const useReducer = (reducer, value, init) => {
    const info = getInfo();
    const {i, s} = info;
    if (i === s.length)
      s.push({
        $: isFunction(init) ?
            init(value) : getValue(void 0, value),
        set: value => {
          s[i].$ = reducer(s[i].$, value);
          reschedule(info);
        }
      });
    const {$, set} = s[info.i++];
    return [$, set];
  };

  const useState = value => useReducer(getValue, value);

  const useRef = current => {
    const info = getInfo();
    const {i, s} = info;
    if (i === s.length)
      s.push({current});
    return s[info.i++];
  };

  exports.createContext = createContext;
  exports.dropEffect = dropEffect;
  exports.hasEffect = hasEffect;
  exports.hooked = hooked;
  exports.useCallback = useCallback;
  exports.useContext = useContext;
  exports.useEffect = useEffect;
  exports.useLayoutEffect = useLayoutEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useRef = useRef;
  exports.useState = useState;
  exports.wait = wait;

  return exports;

})({});
