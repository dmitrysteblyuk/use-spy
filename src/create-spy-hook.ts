import type {Disposable, Spy, Scheduler, BehaviorObservable} from './types';
import {spy as defaultSpy} from '.';
import {effectPrivate} from './constants';

export interface SpyHookOptions {
  spy: Spy;
  scheduler: Scheduler | null;
}

export interface RequiredHooks {
  useEffect: (effect: () => (() => void) | void, dependencies: []) => void;
  useRef<T = undefined>(): {current: T | undefined};
  useState<T>(initialState: T): [T, (nextState: T) => void];
}

export function createSpyHook({useEffect, useRef, useState}: RequiredHooks) {
  return function useSpy<T>(
    reactiveValue: (() => T) | BehaviorObservable<T>,
    {spy = defaultSpy, scheduler}: Partial<SpyHookOptions> = {}
  ) {
    let value!: T;
    const effectRef = useRef<Disposable>();
    if (effectRef.current === undefined) {
      let isInitialized = false;
      effectRef.current = spy[effectPrivate](reactiveValue, (nextValue) => {
        if (value !== (value = nextValue) && isInitialized) {
          setState(nextValue);
        }
      }, scheduler);
      isInitialized = true;
    }
    const [state, setState] = useState<T>(value);
    useEffect(() => () => effectRef.current!.dispose(), []);
    return state;
  };
}
