import {getInfo} from './hooks.js';

export const createContext = value => ({
  _: new Set,
  provide,
  value
});

export const useContext = ({_, value}) => {
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
