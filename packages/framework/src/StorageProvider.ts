import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MyModel = {
  test: string;
};

let storage: any = null;

if (Platform.OS !== 'macos') {
  storage = {
    // mimic old API
    get: async (key: string) => {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    },
    set: async (key: string, value: any) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    remove: async (key: string) => {
      await AsyncStorage.removeItem(key);
    },
    clear: async () => {
      await AsyncStorage.clear();
    },
  };
}

export default storage;
