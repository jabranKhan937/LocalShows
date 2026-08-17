declare module 'react-navigation' {
  export function createStackNavigator(routes: any, config?: any): any;
  export function createBottomTabNavigator(routes: any, config?: any): any;
  export function createDrawerNavigator(routes: any, config?: any): any;
  export const NavigationActions: any;
  export const StackActions: any;
  export const StackViewTransitionConfigs: any;
}

declare module 'react-navigation-stack' {
  export const TransitionPresets: any;
}
