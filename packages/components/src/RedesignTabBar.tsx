import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from '../../blocks/utilities/src/Colors';
import { getStorageData } from '../../framework/src/Utilities';

const ICON_BY_ROUTE: Record<string, string> = {
  HomeFeed: 'compass',
  Search: 'search',
  Travel: 'navigation',
  Calender: 'calendar',
  PostSelection: 'plus',
  Profile: 'user',
};

function resolveIconName(routeName: string, label: string): string {
  if (ICON_BY_ROUTE[routeName]) {
    return ICON_BY_ROUTE[routeName];
  }
  const lower = label.toLowerCase();
  if (lower.includes('home')) return 'compass';
  if (lower.includes('search')) return 'search';
  if (lower.includes('travel')) return 'navigation';
  if (lower.includes('calendar')) return 'calendar';
  if (lower.includes('post')) return 'plus';
  if (lower.includes('profile') || lower.includes('log')) return 'user';
  return 'circle';
}

function isPostRoute(routeName: string, label: string): boolean {
  return (
    routeName === 'PostSelection' || label.toLowerCase().includes('post')
  );
}

const SELECTED_CHIP_RADIUS = 14;

const darkItemRipple = {
  color: 'rgba(255, 45, 107, 0.18)',
  borderless: true,
  radius: 22,
};

const lightItemRipple = {
  color: lightTheme.primarySoft,
  borderless: true,
  radius: 22,
};

/**
 * Floating dark pill tab bar matching localshows-redesign.
 * Light theme uses a full-width white bar like the profile mockup.
 * Visual only — uses the same tabPress / navigate flow as the default bar.
 */
export default function RedesignTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const styles = isDarkMode ? darkStyles : lightStyles;
  const theme = isDarkMode ? redesignTheme : lightTheme;
  const itemRipple = isDarkMode ? darkItemRipple : lightItemRipple;

  React.useEffect(() => {
    let mounted = true;
    getStorageData(PROFILE_THEME_STORAGE_KEY).then(savedTheme => {
      if (mounted) {
        setIsDarkMode(savedTheme !== 'false');
      }
    });
    const subscription = DeviceEventEmitter.addListener(
      PROFILE_THEME_CHANGED_EVENT,
      (nextIsDarkMode: boolean) => {
        setIsDarkMode(nextIsDarkMode);
      },
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: bottomPad }]}
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;

          const post = isPostRoute(route.name, label);
          const color = focused ? theme.primary : theme.muted;
          const iconName = resolveIconName(route.name, label);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (post) {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                android_ripple={undefined}
                style={styles.item}
              >
                <View style={styles.postGlow}>
                  <View style={styles.postButton}>
                    <Icon name="plus" size={22} color="#FFFFFF" />
                  </View>
                </View>
                <Text style={[styles.label, styles.postLabel]}>{label}</Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              android_ripple={itemRipple}
              style={styles.item}
            >
              <View
                collapsable={false}
                style={[styles.itemChip, focused && styles.itemChipActive]}
              >
                {focused ? <View style={styles.itemChipActiveFill} /> : null}
                <Icon name={iconName} size={18} color={color} />
                <Text style={[styles.label, { color }]}>{label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const darkStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: redesignTheme.background,
    paddingTop: 6,
    width: '100%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#10101f',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2A3C',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  itemChip: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 5,
    borderRadius: SELECTED_CHIP_RADIUS,
    overflow: 'hidden',
  },
  itemChipActive: {
    borderRadius: SELECTED_CHIP_RADIUS,
    overflow: 'hidden',
  },
  itemChipActiveFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: redesignTheme.tabActive,
    borderRadius: SELECTED_CHIP_RADIUS,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 12,
  },
  postGlow: {
    marginBottom: 2,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: redesignTheme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.85,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  postButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: redesignTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postLabel: {
    color: redesignTheme.primary,
    marginTop: 2,
  },
});

const lightStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: lightTheme.background,
    paddingTop: 6,
    width: '100%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '92%',
    maxWidth: 420,
    backgroundColor: lightTheme.background,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D0D0D8',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  itemChip: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 5,
    borderRadius: SELECTED_CHIP_RADIUS,
    overflow: 'hidden',
  },
  itemChipActive: {
    borderRadius: SELECTED_CHIP_RADIUS,
    overflow: 'hidden',
  },
  itemChipActiveFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightTheme.primarySoft,
    borderRadius: SELECTED_CHIP_RADIUS,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 12,
  },
  postGlow: {
    marginBottom: 2,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: lightTheme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  postButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: lightTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postLabel: {
    color: lightTheme.muted,
    marginTop: 2,
  },
});
