self.uhooks = (function (exports) {
  'use strict';

  var Lie = typeof Promise === 'function' ? Promise : function (fn) {
    var queue = [],
        resolved = 0,
        value;
    fn(function ($) {
      value = $;
      resolved = 1;
      queue.splice(0).forEach(then);
    });
    return {
      then: then
    };

    function then(fn) {
      return resolved ? setTimeout(fn, 0, value) : queue.push(fn), this;
    }
  };

  var a = null,
      c = null,
      h = null;
  var schedule = new Set();
  var hooks = new WeakMap();

  var invoke = function invoke(fx) {
    if (typeof fx.r === 'function') fx.r();
    fx.r = fx.$();
  };

  var runSchedule = function runSchedule() {
    var previous = schedule;
    schedule = new Set();
    previous.forEach(update);
  };

  var effects = [];
  var layoutEffects = [];
  var waitTick = new Lie(function ($) {
    return $();
  });
  function different(value, i) {
    return value !== this[i];
  }
  var getInfo = function getInfo() {
    var info = hooks.get(h);
    info.a = a;
    info.c = c;
    return info;
  };
  var hooked = function hooked(callback) {
    hooks.set(hook, {
      a: a,
      c: c,
      h: hook,
      i: 0,
      s: []
    });
    return hook;

    function hook() {
      var pa = a,
          pc = c,
          ph = h;
      a = arguments;
      c = this;
      h = hook;

      try {
        return callback.apply(c, a);
      } finally {
        a = pa;
        c = pc;
        h = ph;
        if (effects.length) waitTick.then(effects.forEach.bind(effects.splice(0), invoke));
        if (layoutEffects.length) layoutEffects.splice(0).forEach(invoke);
      }
    }
  };
  var reschedule = function reschedule(info) {
    if (!schedule.has(info)) {
      schedule.add(info);
      waitTick.then(runSchedule);
    }
  };
  var update = function update(info) {
    info.i = 0;
    info.h.apply(info.c, info.a);
  };

  var createContext = function createContext(value) {
    return {
      _: new Set(),
      provide: provide,
      value: value
    };
  };
  var useContext = function useContext(_ref) {
    var _ = _ref._,
        value = _ref.value;

    _.add(getInfo());

    return value;
  };

  function provide(newValue) {
    var _ = this._,
        value = this.value;

    if (value !== newValue) {
      this._ = new Set();
      this.value = newValue;

      _.forEach(update);
    }
  }

  var useCallback = function useCallback(fn, guards) {
    return useMemo(function () {
      return fn;
    }, guards);
  };
  var useMemo = function useMemo(memo, guards) {
    var info = getInfo();
    var i = info.i,
        s = info.s;
    if (i === s.length) s.push({
      $: memo(),
      _: guards
    });else if (!guards || guards.some(different, s[i]._)) s[i] = {
      $: memo(),
      _: guards
    };
    return s[info.i++].$;
  };

  var createEffect = function createEffect(stack) {
    return function (callback, guards) {
      var info = getInfo();
      var i = info.i,
          s = info.s;
      var call = i === s.length;
      if (call) s.push({
        $: callback,
        _: guards,
        r: void 0
      });
      var fx = s[info.i++];
      if (call || !guards || guards.some(different, fx._)) stack.push(fx);
    };
  };

  var useEffect = createEffect(effects);
  var useLayoutEffect = createEffect(layoutEffects);

  var getValue = function getValue(value, f) {
    return typeof f == 'function' ? f(value) : f;
  };

  var useReducer = function useReducer(reducer, value, init) {
    var info = getInfo();
    var i = info.i,
        s = info.s;
    if (i === s.length) s.push({
      $: typeof init === 'function' ? init(value) : getValue(void 0, value),
      set: function set(value) {
        s[i].$ = reducer(s[i].$, value);
        reschedule(info);
      }
    });
    var _s$info$i = s[info.i++],
        $ = _s$info$i.$,
        set = _s$info$i.set;
    return [$, set];
  };
  var useState = function useState(value) {
    return useReducer(getValue, value);
  };

  var useRef = function useRef(current) {
    var info = getInfo();
    var i = info.i,
        s = info.s;
    if (i === s.length) s.push({
      current: current
    });
    return s[info.i++];
  };

  exports.createContext = createContext;
  exports.hooked = hooked;
  exports.useCallback = useCallback;
  exports.useContext = useContext;
  exports.useEffect = useEffect;
  exports.useLayoutEffect = useLayoutEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useRef = useRef;
  exports.useState = useState;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
