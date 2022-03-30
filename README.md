## Usage

```jsx
const createClock = () => {
  const time = spy(new Date());
  setInterval(() => (time.$ = new Date()), 1000);
  return () => time.$;
};
const getTime = createClock();

const App = () => {
  const time = useSpy(getTime);
  return <>{time.toLocaleTimeString()}</>;
};
```
