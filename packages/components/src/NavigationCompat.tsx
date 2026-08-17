/**
 * Compatibility layer for React Navigation v4 to v6 migration
 * This allows object-based navigator configuration to work with v6
 */
import React from 'react';
import { CommonActions as RNCommonActions } from '@react-navigation/native';
import { createStackNavigator as createStackNavigatorV6 } from '@react-navigation/stack';
import { createBottomTabNavigator as createBottomTabNavigatorV6 } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator as createDrawerNavigatorV6 } from '@react-navigation/drawer';

/** Stack state for a tab screen (handles tab wrapper vs direct stack navigation). */
export function getTabNestedStackState(navigation: any): {
  stackState: any;
  stackNavigation: any;
  tabRouteName?: string;
} | null {
  if (!navigation?.getState) {
    return null;
  }

  const state = navigation.getState();
  if (state?.type === 'stack') {
    return { stackState: state, stackNavigation: navigation };
  }

  const tabState = findBottomTabState(navigation);
  if (tabState?.routes && typeof tabState.index === 'number') {
    const tabRoute = tabState.routes[tabState.index];
    const nested = tabRoute?.state;
    if (nested?.routes && typeof nested.index === 'number') {
      return {
        stackState: nested,
        stackNavigation: navigation,
        tabRouteName: tabRoute.name,
      };
    }
  }

  if (state?.routes && typeof state.index === 'number') {
    const active = state.routes[state.index];
    const nested = active?.state;
    if (nested?.routes && typeof nested.index === 'number') {
      return {
        stackState: nested,
        stackNavigation: navigation,
        tabRouteName: active.name,
      };
    }
    if (state.routes.length > 0 && typeof state.index === 'number') {
      return { stackState: state, stackNavigation: navigation };
    }
  }

  return null;
}

function findBottomTabState(navigation: any): any | null {
  let nav: any = navigation;
  for (let depth = 0; depth < 6 && nav; depth += 1) {
    const state = nav.getState?.();
    const routeNames = state?.routes?.map((r: any) => r.name) ?? [];
    const looksLikeMainTabs =
      routeNames.includes('HomeFeed') && routeNames.includes('Search');
    if (looksLikeMainTabs && typeof state.index === 'number') {
      return state;
    }
    nav = nav.getParent?.();
  }
  return null;
}

export function isTabCurrentlySelected(
  navigation: any,
  tabRouteName: string,
): boolean {
  const tabState = findBottomTabState(navigation);
  if (tabState?.routes && typeof tabState.index === 'number') {
    return tabState.routes[tabState.index]?.name === tabRouteName;
  }
  return typeof navigation?.isFocused === 'function'
    ? navigation.isFocused()
    : false;
}

/** Nested stack index for a bottom-tab route (0 = that tab's root screen). */
export function getTabStackIndex(
  navigation: any,
  tabRouteName: string,
): number {
  const tabNav = findMainTabNavigator(navigation);
  if (!tabNav?.getState) {
    return 0;
  }
  const tabRoute = tabNav
    .getState()
    .routes?.find((route: any) => route.name === tabRouteName);
  return typeof tabRoute?.state?.index === 'number' ? tabRoute.state.index : 0;
}

/**
 * Pop a bottom tab's nested stack to its root (e.g. Search details → Search main).
 */
export function resetTabStackToRoot(
  navigation: any,
  tabRouteName: string,
  rootScreenName: string,
  rootParams?: Record<string, unknown>,
): boolean {
  if (getTabStackIndex(navigation, tabRouteName) <= 0) {
    return false;
  }

  const tabNav = findMainTabNavigator(navigation);
  if (!tabNav?.navigate) {
    return false;
  }

  tabNav.navigate(
    tabRouteName,
    rootParams
      ? { screen: rootScreenName, params: rootParams }
      : { screen: rootScreenName },
  );
  return true;
}

/** Pop the Home feed stack to its root (e.g. from event details). */
export function resetHomeFeedTabToRoot(
  navigation: any,
  rootScreenName: string = 'Home',
): boolean {
  return resetTabStackToRoot(navigation, 'HomeFeed', rootScreenName);
}

/**
 * Re-tap on an already-selected bottom tab: pop nested stack to root when deep,
 * otherwise run defaultHandler (tab switch). Used from legacy tabBarOnPress handlers.
 */
export function handleBottomTabRepress(
  navigation: any,
  tabRouteName: string,
  rootScreenName: string,
  defaultHandler: () => void,
  options?: {
    rootParams?: Record<string, unknown>;
    /** After returning from a deep screen (optional delay). */
    onReturnedToRoot?: (returnedFromDeep: boolean) => void;
    /** Custom re-tap handling; return true to skip defaultHandler. */
    onReselect?: (navigation: any) => boolean;
  },
): void {
  const isReselect = isTabCurrentlySelected(navigation, tabRouteName);
  let returnedToRoot = false;

  if (isReselect) {
    if (options?.onReselect) {
      returnedToRoot = options.onReselect(navigation);
    } else {
      returnedToRoot = resetTabStackToRoot(
        navigation,
        tabRouteName,
        rootScreenName,
        options?.rootParams,
      );
    }
  }

  if (!returnedToRoot) {
    defaultHandler();
  }

  if (isReselect && options?.onReturnedToRoot) {
    setTimeout(
      () => options.onReturnedToRoot!(returnedToRoot),
      returnedToRoot ? 150 : 0,
    );
  }
}

/** Pop the tab's nested stack to its root when the user re-taps an already-selected tab. */
export function popTabStackToRoot(
  navigation: any,
  tabRouteName: string,
  rootScreenName?: string,
): boolean {
  if (tabRouteName === 'HomeFeed') {
    if (resetHomeFeedTabToRoot(navigation, rootScreenName || 'Home')) {
      return true;
    }
  }

  const nested = getTabNestedStackState(navigation);
  if (!nested) {
    return false;
  }

  const { stackState, stackNavigation } = nested;
  const stackIndex =
    typeof stackState.index === 'number' ? stackState.index : 0;

  if (stackIndex <= 0) {
    return false;
  }

  const rootFromState = stackState.routes?.[0]?.name;
  const target = rootScreenName || rootFromState;

  const tabNav = findMainTabNavigator(stackNavigation);
  if (
    tabNav?.navigate &&
    tabRouteName &&
    target &&
    tabNav.getState?.()?.routes?.some((r: any) => r.name === tabRouteName)
  ) {
    tabNav.navigate(tabRouteName, { screen: target });
    return true;
  }

  // Prefer nested navigate from tab navigator (reliable in RN 6/7).
  let nav: any = stackNavigation;
  for (let depth = 0; depth < 6 && nav; depth += 1) {
    const routeNames = nav.getState?.()?.routes?.map((r: any) => r.name) ?? [];
    if (
      routeNames.includes(tabRouteName) &&
      typeof nav.navigate === 'function' &&
      target
    ) {
      nav.navigate(tabRouteName, { screen: target });
      return true;
    }
    nav = nav.getParent?.();
  }

  if (typeof stackNavigation.popToTop === 'function') {
    stackNavigation.popToTop();
    return true;
  }

  if (target && typeof stackNavigation.navigate === 'function') {
    stackNavigation.navigate(target);
    return true;
  }

  return false;
}

/** Resolve the nested stack navigator for a bottom-tab screen (e.g. Profile stack). */
export function getTabStackNavigation(navigation: any): any | null {
  if (navigation?.getState?.()?.type === 'stack') {
    return navigation;
  }
  const nested = getTabNestedStackState(navigation);
  if (nested?.stackState?.type === 'stack') {
    let nav: any = navigation;
    for (let depth = 0; depth < 8 && nav; depth += 1) {
      if (nav?.getState?.()?.type === 'stack') {
        return nav;
      }
      nav = nav.getParent?.();
    }
  }
  return null;
}

function getNavigatorRouteNames(nav: any): string[] {
  if (typeof nav?.getState !== 'function') {
    return [];
  }
  const state = nav.getState();
  if (Array.isArray(state?.routeNames) && state.routeNames.length > 0) {
    return state.routeNames;
  }
  return state?.routes?.map((route: any) => route.name) ?? [];
}

const ARTIST_PROFILE_ROUTE_CANDIDATES = [
  'UserProfileBasicBlockArtist3',
  'UserProfileBasicBlockArtist2',
  'UserProfileBasicBlockArtist',
  'Customisableuserprofiles2',
] as const;

const FAN_PROFILE_ROUTE_CANDIDATES = [
  'UserProfileBasicBlock3',
  'UserProfileBasicBlock2',
  'UserProfileBasicBlock',
] as const;

/** Find a stack navigator that registers an other-user profile route. */
export function findNavigatorWithProfileRoute(
  navigation: any,
  isArtistType: boolean,
): { nav: any; screen: string } | null {
  const candidates = isArtistType
    ? ARTIST_PROFILE_ROUTE_CANDIDATES
    : FAN_PROFILE_ROUTE_CANDIDATES;

  let nav: any = navigation;
  for (let depth = 0; depth < 10 && nav; depth += 1) {
    const routeNames = getNavigatorRouteNames(nav);
    const screen = candidates.find((name) => routeNames.includes(name));
    if (screen) {
      return { nav, screen };
    }
    nav = nav.getParent?.();
  }
  return null;
}

/** Find the nearest navigator (deepest first) that registers a given route. */
export function findNavigatorWithRoute(
  navigation: any,
  routeName: string,
): { nav: any } | null {
  let nav: any = navigation;
  for (let depth = 0; depth < 10 && nav; depth += 1) {
    const routeNames = getNavigatorRouteNames(nav);
    if (routeNames.includes(routeName)) {
      return { nav };
    }
    nav = nav.getParent?.();
  }
  return null;
}

/**
 * Open Followers inside the current tab stack so the bottom tab bar stays visible.
 */
export function navigateToFollowersScreen(
  navigation: any,
  params?: Record<string, unknown>,
): boolean {
  const match = findNavigatorWithRoute(navigation, 'Followers');
  if (!match) {
    return false;
  }

  if (typeof match.nav.push === 'function') {
    match.nav.push('Followers', params ?? {});
  } else if (typeof match.nav.navigate === 'function') {
    match.nav.navigate('Followers', params ?? {});
  } else {
    return false;
  }

  return true;
}

/** Push an other-user profile using a route that exists in the current navigator tree. */
export function pushOtherUserProfileScreen(
  navigation: any,
  isArtistType: boolean,
  params: Record<string, unknown> = { isOtherUser: true },
): boolean {
  const match = findNavigatorWithProfileRoute(navigation, isArtistType);
  if (match) {
    if (typeof match.nav.push === 'function') {
      match.nav.push(match.screen, params);
    } else {
      match.nav.navigate(match.screen, params);
    }
    return true;
  }

  const tabNav = findMainTabNavigator(navigation);
  const profileScreen = isArtistType
    ? 'UserProfileBasicBlockArtist'
    : 'UserProfileBasicBlock';
  if (tabNav?.navigate) {
    tabNav.navigate('Profile', {
      screen: profileScreen,
      params,
    });
    return true;
  }

  return false;
}

function findMainTabNavigator(navigation: any): any | null {
  let nav: any = navigation;
  for (let depth = 0; depth < 10 && nav; depth += 1) {
    const routeNames = nav.getState?.()?.routes?.map((r: any) => r.name) ?? [];
    if (routeNames.includes('HomeFeed') && routeNames.includes('Profile')) {
      return nav;
    }
    nav = nav.getParent?.();
  }
  return null;
}

/**
 * Reset the Profile tab stack to the root profile screen (own profile).
 * Pops detail screens and other-user profile routes in one action.
 */
export function resetProfileTabToOwnProfile(
  navigation: any,
  rootScreenName: string,
  rootParams: Record<string, unknown> = { resetProfile: true },
): boolean {
  const tabNav = findMainTabNavigator(navigation);
  if (!tabNav?.getState || !tabNav?.dispatch) {
    return false;
  }

  const tabState = tabNav.getState();
  if (!tabState?.routes?.length) {
    return false;
  }

  const profileRouteIndex = tabState.routes.findIndex(
    (route: any) => route.name === 'Profile',
  );
  if (profileRouteIndex < 0) {
    return false;
  }

  const routes = tabState.routes.map((route: any) => {
    if (route.name !== 'Profile') {
      return route;
    }
    return {
      ...route,
      name: 'Profile',
      state: {
        index: 0,
        routes: [{ name: rootScreenName, params: rootParams }],
      },
    };
  });

  tabNav.dispatch(
    RNCommonActions.reset({
      index: profileRouteIndex,
      routes,
    }),
  );

  return true;
}

/** Switch to a tab and open its stack root (e.g. Home → feed). */
export function resetActiveTabToRootScreen(
  navigation: any,
  tabRouteName: string,
  rootScreenName: string,
  rootParams?: Record<string, unknown>,
): boolean {
  if (tabRouteName === 'Profile') {
    return resetProfileTabToOwnProfile(
      navigation,
      rootScreenName,
      (rootParams as Record<string, unknown>) ?? { resetProfile: true },
    );
  }

  let tabNav: any = null;
  let nav: any = navigation;
  for (let depth = 0; depth < 8 && nav; depth += 1) {
    const routeNames = nav.getState?.()?.routes?.map((r: any) => r.name) ?? [];
    if (routeNames.includes('HomeFeed') && routeNames.includes(tabRouteName)) {
      tabNav = nav;
      break;
    }
    nav = nav.getParent?.();
  }

  const stackNav = getTabStackNavigation(navigation);

  if (tabNav?.navigate) {
    tabNav.navigate(tabRouteName, {
      screen: rootScreenName,
      params: rootParams,
    });
  }

  if (stackNav?.dispatch) {
    stackNav.dispatch(
      RNCommonActions.reset({
        index: 0,
        routes: [{ name: rootScreenName, params: rootParams ?? {} }],
      }),
    );
    return true;
  }

  if (stackNav?.navigate) {
    stackNav.navigate(rootScreenName, rootParams ?? {});
    return true;
  }

  return Boolean(tabNav);
}

export function createStackNavigator(routeConfigMap: any, stackConfig: any = {}) {
  const Stack = createStackNavigatorV6();

  const Navigator = () => {
    const { initialRouteName, defaultNavigationOptions, ...otherConfig } = stackConfig;

    return (
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={defaultNavigationOptions || {}}
      >
        {Object.keys(routeConfigMap).map((routeName) => {
          const routeConfig = routeConfigMap[routeName];
          const { screen, navigationOptions = {}, path } = routeConfig;

          // Convert header: null to headerShown: false for v6 compatibility
          const convertedOptions = { ...navigationOptions };
          if (convertedOptions.header === null) {
            delete convertedOptions.header;
            convertedOptions.headerShown = false;
          }

          return (
            <Stack.Screen
              key={routeName}
              name={routeName}
              component={screen}
              options={convertedOptions}
            />
          );
        })}
      </Stack.Navigator>
    );
  };

  return Navigator;
}

export function createBottomTabNavigator(routeConfigMap: any, tabConfig: any = {}) {
  const Tab = createBottomTabNavigatorV6();

  const Navigator = () => {
    const { initialRouteName, tabBarOptions, tabBar, ...otherConfig } =
      tabConfig;

    // Map React Navigation v4 tabBarOptions → v6 screenOptions keys.
    const {
      activeTintColor,
      inactiveTintColor,
      style: tabBarStyle,
      labelStyle: tabBarLabelStyle,
      showLabel,
      keyboardHidesTabBar,
      allowFontScaling,
      ...restTabBarOptions
    } = tabBarOptions || {};

    const screenOptions = {
      headerShown: false,
      tabBarActiveTintColor: activeTintColor,
      tabBarInactiveTintColor: inactiveTintColor,
      tabBarStyle: tabBar
        ? {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: undefined,
            ...tabBarStyle,
          }
        : tabBarStyle,
      tabBarLabelStyle,
      tabBarShowLabel: showLabel,
      tabBarHideOnKeyboard: keyboardHidesTabBar,
      tabBarAllowFontScaling: allowFontScaling,
      sceneContainerStyle: {
        backgroundColor: tabBarStyle?.backgroundColor ?? '#08080f',
      },
      ...restTabBarOptions,
      ...otherConfig,
    };

    return (
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}
        tabBar={tabBar}
      >
        {Object.keys(routeConfigMap).map((routeName) => {
          const routeConfig = routeConfigMap[routeName];
          const { screen, navigationOptions = {} } = routeConfig;

          // Convert header: null to headerShown: false for v6 compatibility
          const convertedOptions = { ...navigationOptions };
          if (convertedOptions.header === null) {
            delete convertedOptions.header;
            convertedOptions.headerShown = false;
          }
          const legacyTabBarOnPress = convertedOptions.tabBarOnPress;
          const tabStackRootScreen = convertedOptions.tabStackRootScreen as
            | string
            | undefined;
          if (legacyTabBarOnPress) {
            delete convertedOptions.tabBarOnPress;
          }
          if (tabStackRootScreen) {
            delete convertedOptions.tabStackRootScreen;
          }

          return (
            <Tab.Screen
              key={routeName}
              name={routeName}
              component={screen}
              options={convertedOptions}
              listeners={({ navigation, route }) => ({
                tabPress: (e: any) => {
                  const isSelectedTab = isTabCurrentlySelected(
                    navigation,
                    route.name,
                  );

                  if (typeof legacyTabBarOnPress === 'function') {
                    e.preventDefault();
                    legacyTabBarOnPress({
                      navigation,
                      defaultHandler: () => navigation.navigate(route.name),
                    });
                    return;
                  }

                  // Re-tap active tab while deep in stack → return to that tab's main screen.
                  if (isSelectedTab && tabStackRootScreen) {
                    const popped = popTabStackToRoot(
                      navigation,
                      route.name,
                      tabStackRootScreen,
                    );
                    if (popped) {
                      e.preventDefault();
                    }
                  }
                },
              })}
            />
          );
        })}
      </Tab.Navigator>
    );
  };

  return Navigator;
}

export function createDrawerNavigator(routeConfigMap: any, drawerConfig: any = {}) {
  const Drawer = createDrawerNavigatorV6();

  const Navigator = () => {
    const { initialRouteName, contentComponent, drawerPosition, ...otherConfig } = drawerConfig;

    return (
      <Drawer.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          drawerPosition: drawerPosition || 'left',
          ...otherConfig
        }}
        drawerContent={contentComponent}
      >
        {Object.keys(routeConfigMap).map((routeName) => {
          const routeConfig = routeConfigMap[routeName];
          const { screen, navigationOptions = {} } = routeConfig;

          // Convert header: null to headerShown: false for v6 compatibility
          const convertedOptions = { ...navigationOptions };
          if (convertedOptions.header === null) {
            delete convertedOptions.header;
            convertedOptions.headerShown = false;
          }

          return (
            <Drawer.Screen
              key={routeName}
              name={routeName}
              component={screen}
              options={convertedOptions}
            />
          );
        })}
      </Drawer.Navigator>
    );
  };

  return Navigator;
}

export { NavigationActions, StackActions, CommonActions } from '@react-navigation/native';
