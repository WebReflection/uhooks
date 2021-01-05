const {hooked, useState, useRef} = require('../cjs/e');

const context = new Set;
const args = new Set;
const driver = {};

const test = hooked(function () {
  context.add(this);
  args.add(arguments);
  const [state1, update1] = useState(1);
  const [state2, update2] = useState(2);
  const ref1 = useRef(1);
  const ref2 = useRef(2);
  driver.states = [
    [state1, update1],
    [state2, update2]
  ];
  driver.refs = [
    ref1,
    ref2
  ];
});

test.call(Object, 1, 2, 3);

console.assert([...context][0] === Object, 'unexpected context');
console.assert([].slice.call([...args][0]).join(',') === '1,2,3', 'unexpected arguments');

console.assert(driver.states[0][0] === 1);
console.assert(driver.states[1][0] === 2);
console.assert(driver.refs[0].current === 1);
console.assert(driver.refs[1].current === 2);

driver.refs[1].current = 3;
driver.states[1][1](3);

console.assert(driver.states[0][0] === 1);
console.assert(driver.states[1][0] === 3);
console.assert(driver.refs[0].current === 1);
console.assert(driver.refs[1].current === 3);

console.assert(context.size === 1);
console.assert(args.size === 2);

driver.refs[0].current = 2;
driver.states[0][1](2);

console.assert(driver.states[0][0] === 2);
console.assert(driver.states[1][0] === 3);
console.assert(driver.refs[0].current === 2);
console.assert(driver.refs[1].current === 3);

console.assert(context.size === 1);
console.assert(args.size === 3);
