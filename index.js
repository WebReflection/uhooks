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
  var waitTick = new Lie(function ($) {
    return $();
  });

  var invoke = function invoke(effect) {
    var $ = effect.$,
        r = effect.r,
        h = effect.h;

    if (isFunction(r)) {
      fx.get(h)["delete"](effect);
      r();
    }

    if (isFunction(effect.r = $())) fx.get(h).add(effect);
  };

  var runSchedule = function runSchedule() {
    var previous = schedule;
    schedule = new Set();
    previous.forEach(update);
  };

  var fx = new WeakMap();
  var effects = [];
  var layoutEffects = [];
  function different(value, i) {
    return value !== this[i];
  }
  var dropEffect = function dropEffect(hook) {
    var effects = fx.get(hook);
    if (effects) waitTick.then(function () {
      effects.forEach(function (effect) {
        effect.r();
        effect.r = null;
      });
      effects.clear();
    });
  };
  var getInfo = function getInfo() {
    var info = hooks.get(h);
    info.a = a;
    info.c = c;
    return info;
  };
  var hasEffect = function hasEffect(hook) {
    return fx.has(hook);
  };
  var isFunction = function isFunction(f) {
    return typeof f === 'function';
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
          s = info.s,
          h = info.h;
      var call = i === s.length;

      if (call) {
        if (!fx.has(h)) fx.set(h, new Set());
        s.push({
          $: callback,
          _: guards,
          r: null,
          h: h
        });
      }

      var effect = s[info.i++];
      if (call || !guards || guards.some(different, effect._)) stack.push(effect);
    };
  };

  var useEffect = createEffect(effects);
  var useLayoutEffect = createEffect(layoutEffects);

  var getValue = function getValue(value, f) {
    return isFunction(f) ? f(value) : f;
  };

  var useReducer = function useReducer(reducer, value, init) {
    var info = getInfo();
    var i = info.i,
        s = info.s;
    if (i === s.length) s.push({
      $: isFunction(init) ? init(value) : getValue(void 0, value),
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

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
