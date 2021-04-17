export const onPrivate = Symbol('on');
export const offPrivate = Symbol('off');
export const effectPrivate = Symbol('effect');

export interface ChangeObserver {
  notify(): void;
}
export type ValueObserver<T> = ((value: T) => void) | {
  next(value: T): void;
};
export interface Executable {
  execute(): void;
}
export interface Disposable {
  dispose(): void;
}
export interface BehaviorObservable<T> {
  readonly $: T;
  [onPrivate](observer: ChangeObserver): void;
  [offPrivate](observer: ChangeObserver): void;
}
export interface BehaviorSubject<T> extends BehaviorObservable<T> {
  $: T;
}
export interface Scheduler {
  removeFromQueue(executable: Executable): void;
  addToQueue(executable: Executable): void;
}
export interface EffectAPI {
  <T>(
    getValue: () => T,
    observer: ValueObserver<T>,
    scheduler?: Scheduler | null
  ): Disposable;
}
export interface Spy {
  <T>(value: T): BehaviorSubject<T>;
  [effectPrivate]: EffectAPI;
}
