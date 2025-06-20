import {
  computed,
  effect,
  endBatch,
  signal,
  startBatch,
  effectScope
} from "@type-dom/signals";
import { ReactiveFramework } from "../util/reactiveFramework";

let scope: (() => void) | null = null;

export const typeFramework: ReactiveFramework = {
  name: "@type-dom/signals",
  signal: (initial) => {
    const data = signal(initial);
    return {
      read: () => data.get(),
      write: (v) => data.set(v),
    };
  },
  computed: (fn) => {
    const c = computed(fn);
    return {
      read: () => c.get(),
    };
  },
  effect: (fn) => effect(fn),
  withBatch: (fn) => {
    startBatch();
    fn();
    endBatch();
  },
  withBuild: <T>(fn: () => T) => {
    let out!: T;
    scope = effectScope(() => {
      out = fn();
    });
    return out;
  },
  cleanup: () => {
    scope!();
    scope = null;
  },
};
