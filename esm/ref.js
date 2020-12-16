import {getInfo} from './hooks.js';

export const useRef = current => {
  const info = getInfo();
  const {i, s} = info;
  if (i === s.length)
    s.push({current});
  return s[info.i++];
};
