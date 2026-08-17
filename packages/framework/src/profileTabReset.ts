import { DeviceEventEmitter } from 'react-native';

/** Fired when the user taps the Profile bottom tab to return to their own profile. */
export const PROFILE_TAB_RESET_EVENT = 'localshows:profileTabPressReset';

export function emitProfileTabPressReset(): void {
  DeviceEventEmitter.emit(PROFILE_TAB_RESET_EVENT);
}

export function subscribeProfileTabPressReset(
  handler: () => void,
): { remove: () => void } {
  const subscription = DeviceEventEmitter.addListener(
    PROFILE_TAB_RESET_EVENT,
    handler,
  );
  return { remove: () => subscription.remove() };
}
