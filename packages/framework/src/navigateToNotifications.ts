import { CommonActions } from '@react-navigation/native';

/**
 * Opens the in-app Notifications screen (the one registered on the home stack).
 *
 * On React Navigation 6, dispatching NAVIGATE from a leaf stack screen can be a
 * no-op in some nested setups. Prefer the parent navigator:
 * - Bottom tab navigator: navigate to the HomeFeed tab, then the Notifications stack screen.
 * - Drawer (main app shell): same, but the drawer wraps the tab navigator, so one extra
 *   nesting level is required (HomeTab drawer route → HomeFeed tab → Notifications).
 */
function routeNames(nav: any): string[] | undefined {
  return typeof nav?.getState === 'function'
    ? (nav.getState()?.routeNames as string[] | undefined)
    : undefined;
}

function isMainAppDrawer(names: string[] | undefined): boolean {
  return (
    !!names &&
    names.indexOf('HomeTab') !== -1 &&
    names.indexOf('Notifications') !== -1 &&
    names.indexOf('DisputeForm') !== -1
  );
}

function navigateViaHomeTab(nav: any, names: string[] | undefined): void {
  if (!nav?.dispatch) {
    return;
  }
  if (isMainAppDrawer(names)) {
    nav.dispatch(
      CommonActions.navigate({
        name: 'HomeTab',
        params: {
          screen: 'HomeFeed',
          params: { screen: 'Notifications' },
        },
      }),
    );
    return;
  }
  if (names?.includes('HomeFeed')) {
    nav.dispatch(
      CommonActions.navigate({
        name: 'HomeFeed',
        params: { screen: 'Notifications' },
      }),
    );
  }
}

export function navigateToNotificationsScreen(navigation: any): void {
  if (!navigation) {
    return;
  }

  const parent =
    typeof navigation.getParent === 'function'
      ? navigation.getParent()
      : null;
  const parentNames = routeNames(parent);

  if (
    parent &&
    (parentNames?.includes('HomeTab') || parentNames?.includes('HomeFeed'))
  ) {
    navigateViaHomeTab(parent, parentNames);
    return;
  }

  const leafNames = routeNames(navigation);
  if (leafNames?.includes('Notifications')) {
    navigation.dispatch(CommonActions.navigate({ name: 'Notifications' }));
    return;
  }

  let nav: any = navigation;
  while (nav) {
    const names = routeNames(nav);
    if (names?.includes('HomeTab') || names?.includes('HomeFeed')) {
      navigateViaHomeTab(nav, names);
      return;
    }
    if (names?.includes('Notifications')) {
      nav.dispatch(CommonActions.navigate({ name: 'Notifications' }));
      return;
    }
    nav = typeof nav.getParent === 'function' ? nav.getParent() : null;
  }

  if (typeof navigation.dispatch === 'function') {
    navigation.dispatch(CommonActions.navigate({ name: 'Notifications' }));
  } else if (typeof navigation.navigate === 'function') {
    navigation.navigate('Notifications');
  }
}
