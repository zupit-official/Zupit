import { Platform } from 'react-native';

// For physical Android device connected via ADB reverse: 'http://localhost:5001'
// For Wi-Fi network: 'http://192.168.1.4:5001'
export const API_BASE_URL = Platform.select({
  android: 'http://localhost:5001',
  ios: 'http://localhost:5001',
  default: 'http://localhost:5001',
});

