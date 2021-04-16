# use-spy

[![npm](https://img.shields.io/npm/v/use-spy/latest.svg)](https://www.npmjs.com/package/use-spy)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

State management solution for React without forced structure or pattern.

## Installation

```
yarn add use-spy
```

<b>1.5Kb</b> minified.

## Usage

`spy()` does not change application logic, state or behavior.<br>
It exists only as an agent for `useSpy()` to retrieve any data from any place in your application.

```jsx
import { spy, useSpy } from "use-spy";

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

Edit on CodeSandbox: https://codesandbox.io/s/determined-pine-q1rgh

## Examples

Delegate logic to a class: https://codesandbox.io/s/jovial-faraday-juc3i

Delegate logic to a factory: https://codesandbox.io/s/nifty-platform-rjr4c

## Difference from state management frameworks

Spy advocates for minimalism and natural JS syntax.

It is not a framework, just a convenient way to solve the long-standing issue.

### Recoil

```jsx
import { RecoilRoot, atom, selector, useRecoilValue, useRecoilState } from "recoil";

const textState = atom({
  key: "textState",
  default: ""
});
const charCountState = selector({
  key: "charCountState",
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  }
});

function CharacterCount() {
  const count = useRecoilValue(charCountState);
  return <>Character Count: {count}.</>;
}
function App() {
  return (
    <RecoilRoot>
      <CharacterCount />
    </RecoilRoot>
  );
}
```

### Spy

```jsx
import { spy, useSpy } from "use-spy";

const text = spy("");
const getCharCount = () => text.$.length;

function CharacterCount() {
  const count = useSpy(getCharCount);
  return <>Character Count: {count}</>;
}
function App() {
  return <CharacterCount />;
}
```
