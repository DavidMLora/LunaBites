import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, getServerSnapshot } from './demoStore';
export function useDemoStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
