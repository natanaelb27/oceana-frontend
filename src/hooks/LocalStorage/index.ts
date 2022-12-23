import { useState, useEffect } from 'react';

const STORAGE_KEYS_PREFIX = 'oceana_';

const useStorage =
  (storage: Storage, keyPrefix: string) =>
  <T>(
    storageKey: string,
    fallbackState: T
  ): [T, React.Dispatch<React.SetStateAction<T>>] => {
    if (!storageKey)
      throw new Error(
        `"storageKey" must be a nonempty string, but "${storageKey}" was passed.`
      );

    const storedString = storage.getItem(keyPrefix + storageKey);
    let parsedObject = null;

    if (storedString !== null) {
      try {
        parsedObject = JSON.parse(storedString);
      } catch (e) {
        parsedObject = null;
      }
    }

    const [value, setValue] = useState<T>(parsedObject ?? fallbackState);

    useEffect(() => {
      storage.setItem(keyPrefix + storageKey, JSON.stringify(value));
    }, [value, storageKey]);

    return [value, setValue];
  };

const useLocalStorage = useStorage(localStorage, STORAGE_KEYS_PREFIX);

export default useLocalStorage;
