import { DeviceEventEmitter } from 'react-native';

/** Fired when the user re-taps the Home bottom tab to scroll the feed to the top. */
export const HOME_FEED_TAB_SCROLL_EVENT = 'localshows:homeFeedTabScrollToTop';

export type HomeFeedTabScrollPayload = {
  /** True when the user returned from a deep screen (e.g. event details) to the feed root. */
  returnedFromDeep?: boolean;
};

export function emitHomeFeedTabScrollToTop(returnedFromDeep = false): void {
  DeviceEventEmitter.emit(HOME_FEED_TAB_SCROLL_EVENT, { returnedFromDeep });
}

export function subscribeHomeFeedTabScrollToTop(
  handler: (payload: HomeFeedTabScrollPayload) => void,
): { remove: () => void } {
  const subscription = DeviceEventEmitter.addListener(
    HOME_FEED_TAB_SCROLL_EVENT,
    (payload: HomeFeedTabScrollPayload = {}) => {
      handler(payload);
    },
  );
  return { remove: () => subscription.remove() };
}
