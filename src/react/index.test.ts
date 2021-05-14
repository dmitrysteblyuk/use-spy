import {renderHook, act} from '@testing-library/react-hooks'
import {describe, expect, it} from '@jest/globals';
import {spy, useSpy} from './';
import type {BehaviorSubject} from '../types';

const stateGetters = [
  <T>(state: BehaviorSubject<T>) => () => state.$,
  <T>(state: BehaviorSubject<T>) => state
];

describe('spy()', () => {
  for (const index in stateGetters) {
    it(`should spy on a counter, option #${index}`, async () => {
      const counter = spy(0);
      let updateCount = 0;
      const {result} = renderHook(() => {
        updateCount++;
        return useSpy(stateGetters[index](counter));
      });
      expect(updateCount).toBe(1);
      expect(result.current).toBe(0);

      await act(async () => {
        counter.$ += 1;
        counter.$ += 2;
        await Promise.resolve();
      });
      expect(updateCount).toBe(2);
      expect(result.current).toBe(3);

      await act(async () => {
        counter.$ += 10;
        counter.$ -= 10;
        await Promise.resolve();
      });
      expect(updateCount).toBe(2);
      expect(result.current).toBe(3);
    });
  }
});
