import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { redesignTheme } from '../../blocks/utilities/src/Colors';

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

/**
 * Floating dark pill tab bar matching localshows-redesign.
 * Visual only — uses the same tabPress / navigate flow as the default bar.
 */
export default function RedesignTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

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
          const color = focused
            ? redesignTheme.primary
            : redesignTheme.muted;
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
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.85}
                style={styles.item}
              >
                <View style={styles.postGlow}>
                  <View style={styles.postButton}>
                    <Icon name="plus" size={22} color="#FFFFFF" />
                  </View>
                </View>
                <Text style={[styles.label, styles.postLabel]}>{label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.85}
              style={styles.item}
            >
              <View
                style={[styles.iconSlot, focused && styles.iconSlotActive]}
              >
                <Icon
                  name={iconName}
                  size={18}
                  color={color}
                  style={focused ? styles.iconActiveStroke : undefined}
                />
              </View>
              <Text style={[styles.label, { color }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'flex-end',
    minHeight: 52,
  },
  iconSlot: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconSlotActive: {
    backgroundColor: 'rgba(255, 45, 107, 0.18)',
    ...Platform.select({
      ios: {
        shadowColor: redesignTheme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  iconActiveStroke: {
    // Feather icons are stroke-based; weight is fixed — color carries focus.
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
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
