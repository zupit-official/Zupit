// In-memory web and development storage fallback for instant hot-reload without native rebuilds
const memoryStore = new Map<string, string>();

let NativeStorage: any = null;
try {
  NativeStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fallback to memory
}

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (NativeStorage) {
        return await NativeStorage.getItem(key);
      }
    } catch (e) {
      // Fallback
    }
    return memoryStore.get(key) || null;
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (NativeStorage) {
        await NativeStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Fallback
    }
    memoryStore.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (NativeStorage) {
        await NativeStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // Fallback
    }
    memoryStore.delete(key);
  },
};

