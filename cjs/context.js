'use strict';
const {getInfo} = require('./hooks.js');

const createContext = value => ({
  _: new Set,
  provide,
  value
});
exports.createContext = createContext;

const useContext = ({_, value}) => {
  _.add(getInfo());
  return value;
};
exports.useContext = useContext;

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
