'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {useMemo} = require('./memo.js');
const {useLayoutEffect} = require('./effect.js');
const {useState} = require('./reducer.js');
const {useRef} = require('./ref.js');

/**
 * Persist the same reference while updating its current value.
 * @param {any} value
 * @returns {object} An always-same reference.
 */
const useUpdatedRef = value => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
exports.useUpdatedRef = useUpdatedRef;

/**
 * Given a `MutationObserverInit` object with two extra properties,
 * such as `mutations(records){}`, and an optional `ref` to recycle,
 * observes the reference on layout effect and invokes `mutations`.
 * @param {MutationObserverInit} options
 * @returns {object} An always-same reference.
 */
const useMutationObserver = options => {
  const fn = useUpdatedRef(options.mutations);
  const ref = options.ref || useRef(null);
  const _ = [];
  const mo = useMemo(
    () => new MutationObserver(
      records => { fn.current(records); }
    ),
    _
  );
  useLayoutEffect(
    () => {
      mo.observe(ref.current, options);
      return () => { mo.disconnect(); };
    },
    _
  );
  return ref;
};
exports.useMutationObserver = useMutationObserver;

const defaultFetcher = url => fetch(url).then(res => res.json());

/**
 * A simplified version of the vercel useSWR
 * @see https://github.com/vercel/swr
 * @param {string|function} key the `url` to fetch
 * @param {function?} fetcher a function to fetch the `url`
 * @param {object?} options a configuration object
 */
const useSWR = (key, fetcher, options) => {
  const path = typeof key === 'function' ? key() : key;
  if (typeof fetcher === 'object') {
    options = fetcher;
    fetcher = null;
  }
  if (!options)
    options = {};
  if (!fetcher)
    fetcher = options.fetcher || defaultFetcher;
  const [data, update] = useState(options.initialData);
  const ref = useRef(null);
  if (!ref.current || path !== ref.current)
    fetcher(ref.current = path).then(update, update);
  const isError = data instanceof Error;
  return {
    data: isError ? null : data,
    error: isError ? data : null
  };
};
exports.useSWR = useSWR;
