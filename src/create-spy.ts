import type {Spy, Scheduler} from './types';
import {createBehaviorSubjectAPI} from './behavior-subject';
import {createEffectAPI} from './effect';
import {effectPrivate} from './constants';

export function createSpy(defaultScheduler: Scheduler) {
  const [effect, onGetValue] = createEffectAPI(() => defaultScheduler);
  const behaviorSubject = createBehaviorSubjectAPI(onGetValue);
  const spy = behaviorSubject as Spy;
  spy[effectPrivate] = effect;
  return spy;
}
