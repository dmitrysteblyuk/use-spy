# use-spy

Patternless state management for React.

`spy()` does not change application logic, state or behavior.

It exists only as an agent for `useSpy()` to retrieve any data from any place in your application.

### Installation

```
yarn add use-spy
```

1.5Kb minified.

### Usage

```jsx
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { spy, useSpy } from "use-spy";

// This function doesn't know anything about React.
// `spy()` doesn't affect its logic or its behavior.
const createCounter = (interval = 1000) => {
  const count = spy(0);
  const intervalId = spy(null);
  const toggle = () => {
    if (intervalId.$ === null) {
      intervalId.$ = setInterval(() => count.$++, interval);
    } else {
      clearInterval(intervalId.$);
      intervalId.$ = null;
      count.$ = 0;
    }
  };
  return {
    getCount: () => count.$,
    isCounting: () => intervalId.$ !== null,
    toggle
  };
};

const App = () => {
  const counter = (useRef().current ??= createCounter());
  const [count, isCounting] = useSpy(() => [
    counter.getCount(),
    counter.isCounting()
  ]);
  return (
    <>
      {count}
      &nbsp;
      <button onClick={counter.toggle}>{isCounting ? "Stop" : "Start"}</button>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

On CodeSandbox:

https://codesandbox.io/s/nifty-platform-rjr4c?file=/src/index.tsx

### More Examples

https://codesandbox.io/s/jovial-faraday-juc3i?file=/src/App.tsx
