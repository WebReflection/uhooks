const {hooked, useState, useEffect} = require('../cjs');

const Counter = hooked(name => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const time = setTimeout(setCount, 1000, count + 1);
    return () => clearTimeout(time);
  }, [count]);

  console.log(`${name}: ${count}`);
});

Counter('Hit');
