import {describe, expect, it} from '@jest/globals';
import {spy} from './';

describe('spy()', () => {
  it('should create a subject', () => {
    const value = spy(0);
    expect(value.$).toBe(0);
    value.$++;
    expect(value.$).toBe(1);
  });
});
