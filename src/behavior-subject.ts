import type {BehaviorSubject, BehaviorObservable, ChangeObserver} from './types';
import {offPrivate, onPrivate} from './constants';

export function createBehaviorSubjectAPI(
  onGetValue: (observable: BehaviorObservable<unknown>) => void
) {
  class BehaviorSubjectImpl<T> implements BehaviorSubject<T> {
    #value: T;
    readonly #observers = new Set<ChangeObserver>();
    constructor(value: T) {
      this.#value = value;
    }
    get $() {
      onGetValue(this);
      return this.#value;
    }
    set $(nextValue) {
      this.#value = nextValue;
      for (const observer of this.#observers) {
        observer.notify();
      }
    }
    [onPrivate](observer: ChangeObserver) {
      this.#observers.add(observer);
    }
    [offPrivate](observer: ChangeObserver) {
      this.#observers.delete(observer);
    }
  }
  return <T>(value: T): BehaviorSubject<T> => {
    return new BehaviorSubjectImpl(value);
  };
}
