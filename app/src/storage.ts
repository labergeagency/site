import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

/** useState that persists to AsyncStorage. `ready` flips once the saved value loads. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw != null) setValue(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, [key]);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);

  const update = useCallback((v: T | ((p: T) => T)) => setValue(v), []);
  return [value, update, ready] as const;
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
