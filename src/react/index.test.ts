import {renderHook, act} from '@testing-library/react-hooks'
import {describe, expect, it} from '@jest/globals';
import {spy} from '../';
import {useSpy} from './';

describe('spy()', () => {
  it('should spy on a counter', async () => {
    const counter = spy(0);
    let updateCount = 0;
    const {result} = renderHook(() => {
      updateCount++;
      return useSpy(() => counter.$);
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
});
