/**
 * Tiny shared store of wallet loading flags. Connectors write to it and the
 * loader overlay reads from it, so the overlay doesn't import the (large)
 * connector modules just to observe a boolean.
 */

type LoadingListener = (loading: boolean) => void;

const flags = new Map<string, boolean>();
const listeners = new Set<LoadingListener>();

export function isAnyLoading(): boolean {
  for (const value of flags.values()) {
    if (value) return true;
  }
  return false;
}

export function setLoadingFlag(key: string, loading: boolean): void {
  if (flags.get(key) === loading) return;
  flags.set(key, loading);
  const state = isAnyLoading();
  for (const listener of listeners) listener(state);
}

export function subscribeToLoadingFlags(listener: LoadingListener): () => void {
  listeners.add(listener);
  listener(isAnyLoading());
  return () => {
    listeners.delete(listener);
  };
}
