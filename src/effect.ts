import {Scheduler, BehaviorObservable, ChangeObserver, Executable, Disposable, ValueObserver, offPrivate, onPrivate, EffectAPI} from './types';

export function createEffectAPI(getDefaultScheduler: () => Scheduler) {
  let currentGlobalDependencies: Set<BehaviorObservable<unknown>> | undefined;
  const onGetValue = (observable: BehaviorObservable<unknown>) => {
    currentGlobalDependencies?.add(observable);
  };
  class Effect<T> implements ChangeObserver, Executable, Disposable {
    readonly #getValue;
    readonly #observer;
    readonly #scheduler;
    #dependencies = new Set<BehaviorObservable<unknown>>();

    constructor(
      getValue: () => T,
      observer: ValueObserver<T>,
      scheduler: Scheduler
    ) {
      this.#getValue = getValue;
      this.#observer = observer;
      this.#scheduler = scheduler;
      this.execute();
    }
    execute() {
      let value: T | undefined;
      const previousGlobalDependencies = currentGlobalDependencies;
      const nextDependencies = new Set<BehaviorObservable<unknown>>();
      currentGlobalDependencies = nextDependencies;

      try {
        value = this.#getValue();
      } finally {
        currentGlobalDependencies = previousGlobalDependencies;
        for (const dependency of this.#dependencies) {
          if (!nextDependencies.has(dependency)) {
            dependency[offPrivate](this);
          }
        }
        for (const dependency of nextDependencies) {
          if (!this.#dependencies.has(dependency)) {
            dependency[onPrivate](this);
          }
        }
        this.#dependencies = nextDependencies;
      }
      if (typeof this.#observer === 'function') {
        this.#observer(value);
      } else {
        this.#observer.next(value);
      }
    }
    dispose() {
      this.#scheduler.removeFromQueue(this);
      for (const dependency of this.#dependencies) {
        dependency[offPrivate](this);
      }
      (this.#dependencies as unknown)
        = (this.#getValue as unknown)
        = (this.#observer as unknown)
        = (this.#scheduler as unknown)
        = null;
    }
    notify() {
      this.#scheduler.addToQueue(this);
    }
  }
  const effect: EffectAPI = (
    getValue,
    observer,
    scheduler = getDefaultScheduler()
  ) => {
    return new Effect(getValue, observer, scheduler);
  };
  return [effect, onGetValue] as const;
}
