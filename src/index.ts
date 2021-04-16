import {createSpy} from './create-spy';
import {MicroTaskScheduler} from './scheduler';

export interface Subject<T> {
  $: T;
}
export type {Scheduler, Spy} from './types';
export {createSpy} from './create-spy';
export {createSpyHook} from './create-spy-hook';
export {MicroTaskScheduler} from './scheduler';

export const spy = createSpy(new MicroTaskScheduler());
