import {createSpy} from './create-spy';
import {MicroTaskScheduler} from './scheduler';

export interface Subject<T> {
  $: T;
}
export type {Scheduler, Spy} from './types';
export * from './create-spy';
export * from './create-spy-hook';
export * from './scheduler';

export const spy = createSpy(new MicroTaskScheduler());
