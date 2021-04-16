import {Executable, Scheduler} from './types';

export class MicroTaskScheduler implements Scheduler {
  readonly #queued = new Set<Executable>();
  #scheduled = false;
  readonly #run = () => {
    for (const executable of this.#queued) {
      executable.execute();
    }
    this.#queued.clear();
    this.#scheduled = false;
  };

  addToQueue(executable: Executable) {
    this.#queued.add(executable);
    if (this.#scheduled) {
      return;
    }
    this.#scheduled = true;
    queueMicrotask(this.#run);
  }
  removeFromQueue(executable: Executable) {
    this.#queued.delete(executable);
  }
}
