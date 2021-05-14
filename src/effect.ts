import type {Scheduler, BehaviorObservable, ChangeObserver, Executable, Disposable, ValueObserver, EffectAPI} from './types';
import {offPrivate, onPrivate} from './constants';

class ExplicitEffect<T> implements ChangeObserver, Executable, Disposable {
  readonly #observable;
  readonly #observer;
  readonly #scheduler;

  constructor(
    observable: BehaviorObservable<T>,
    observer: ValueObserver<T>,
    scheduler: Scheduler | null
  ) {
    observable[onPrivate](this);
    this.#observable = observable;
    this.#observer = observer;
    this.#scheduler = scheduler;
    this.execute();
  }
  execute() {
    notifyObserver(this.#observer, this.#observable.$);
  }
  dispose() {
    try {
      this.#scheduler?.removeFromQueue(this);
      this.#observable[offPrivate](this);
    } finally {
      (this.#observable as unknown)
        = (this.#observer as unknown)
        = (this.#scheduler as unknown)
        = null;
    }
  }
  notify() {
    scheduleOrExecute(this.#scheduler, this);
  }
}

export function createEffectAPI(getDefaultScheduler: () => Scheduler) {
  let currentGlobalDependencies: Set<BehaviorObservable<unknown>> | undefined;
  const onGetValue = (observable: BehaviorObservable<unknown>) => {
    currentGlobalDependencies?.add(observable);
  };
  class ImplicitEffect<T> implements ChangeObserver, Executable, Disposable {
    readonly #getValue;
    readonly #observer;
    readonly #scheduler;
    #dependencies = new Set<BehaviorObservable<unknown>>();

    constructor(
      getValue: () => T,
      observer: ValueObserver<T>,
      scheduler: Scheduler | null
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
      notifyObserver(this.#observer, value);
    }
    dispose() {
      try {
        this.#scheduler?.removeFromQueue(this);
        for (const dependency of this.#dependencies) {
          dependency[offPrivate](this);
        }
      } finally {
        (this.#dependencies as unknown)
          = (this.#getValue as unknown)
          = (this.#observer as unknown)
          = (this.#scheduler as unknown)
          = null;
      }
    }
    notify() {
      scheduleOrExecute(this.#scheduler, this);
    }
  }
  const effect: EffectAPI = (
    reactiveValue,
    observer,
    scheduler = getDefaultScheduler()
  ) => {
    if (typeof reactiveValue === 'function') {
      return new ImplicitEffect(reactiveValue, observer, scheduler);
    }
    return new ExplicitEffect(reactiveValue, observer, scheduler);
  };
  return [effect, onGetValue] as const;
}

function notifyObserver<T>(observer: ValueObserver<T>, value: T) {
  if (typeof observer === 'function') {
    observer(value);
  } else {
    observer.next(value);
  }
}

function scheduleOrExecute(
  scheduler: Scheduler | null,
  executable: Executable
) {
  if (scheduler === null) {
    executable.execute();
  } else {
    scheduler.addToQueue(executable);
  }
}
