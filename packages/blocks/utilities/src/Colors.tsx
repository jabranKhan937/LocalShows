// Customizable Area Start
import invert from 'invert-color';
import { DeviceEventEmitter } from 'react-native';

/* get colors */
export const colors = (idDark=false) => {
  const lightColors:any = {
    background: '#FCFCFF',
    primary: '#512DA8',
    text: '#334155',
    error: '#D32F2F',
    black: '#000',
    white: '#fff',
  }

  const darkColors:any = {}
  for (const colors in lightColors) {
    darkColors[colors] = invert(lightColors[colors]);
  }
  return idDark ? darkColors : lightColors;
}

/** Design tokens from localshows-redesign.vercel.app (home redesign). */
export const redesignTheme = {
  background: '#08080f',
  card: '#111120',
  foreground: '#f0eeff',
  muted: '#8880aa',
  primary: '#ff2d6b',
  accent: '#ffe138',
  featuredTime: '#00d4ff',
  input: '#1a1a2e',
  border: 'rgba(255, 255, 255, 0.08)',
  primarySoft: 'rgba(255, 45, 107, 0.15)',
  editButton: 'rgba(17, 17, 32, 0.92)',
  editButtonText: '#FFFFFF',
  editButtonBorder: 'rgba(255, 255, 255, 0.22)',
  tabActive: 'rgba(255, 45, 107, 0.18)',
  tabActiveText: '#ff2d6b',
  tabInactive: '#111120',
  tabInactiveText: '#8880aa',
  statsBg: '#111120',
  statsBorder: 'rgba(255, 255, 255, 0.08)',
  toggleTrack: '#ff2d6b',
  divider: 'rgba(255, 255, 255, 0.12)',
} as const;

export const lightTheme = {
  background: '#FFFFFF',
  card: '#FFFFFF',
  foreground: '#1A1A1A',
  muted: '#8A8A8A',
  primary: '#FF5A7C',
  accent: '#FFD60A',
  featuredTime: '#00d4ff',
  input: '#F2F2F2',
  border: 'rgba(0, 0, 0, 0.10)',
  primarySoft: 'rgba(255, 90, 124, 0.12)',
  editButton: '#F2F2F2',
  editButtonText: '#1A1A1A',
  editButtonBorder: 'transparent',
  tabActive: '#FF5A7C',
  tabActiveText: '#FFFFFF',
  tabInactive: '#F2F2F2',
  tabInactiveText: '#4A4A4A',
  statsBg: '#FFFFFF',
  statsBorder: '#E4E4EA',
  toggleTrack: '#FFD60A',
  divider: '#E4E4EA',
} as const;

export const PROFILE_THEME_STORAGE_KEY = 'is_dark_mode';
export const PROFILE_THEME_CHANGED_EVENT = 'localshows:profileThemeChanged';

export function emitProfileThemeChanged(isDarkMode: boolean) {
  DeviceEventEmitter.emit(PROFILE_THEME_CHANGED_EVENT, isDarkMode);
}
// Customizable Area End