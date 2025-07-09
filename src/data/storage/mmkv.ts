import { MMKV } from 'react-native-mmkv';

// Create a single MMKV instance for the entire app
export const storage = new MMKV({
  id: 'workout-companion-app-storage',
  encryptionKey: 'workout-companion-secure-storage',
});

// Helper functions to work with MMKV
export const MMKVStorage = {
  // Get a value from storage
  getItem: <T>(key: string, defaultValue?: T): T | undefined => {
    const value = storage.getString(key);
    if (value === undefined) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      console.error(`Error parsing MMKV value for key ${key}:`, e);
      return defaultValue;
    }
  },

  // Set a value in storage
  setItem: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting MMKV value for key ${key}:`, e);
    }
  },

  // Remove a value from storage
  removeItem: (key: string): void => {
    storage.delete(key);
  },

  // Clear all values from storage
  clearAll: (): void => {
    storage.clearAll();
  },
};
