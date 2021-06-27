const {
  hooked,
  createContext, useContext,
} = require('../cjs');

const ctx = createContext(0);

const log = () => {
  console.log(useContext(ctx));
};

const log1 = hooked(log);

const log2 = hooked(log);

log1();
log2();

setTimeout(() => {
  ctx.provide(1);
});
