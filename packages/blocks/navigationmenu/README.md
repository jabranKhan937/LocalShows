## Building Blocks React Native Mobile -  NavigationMenu

Building Blocks - React Native Master App - NavigationMenu

## Getting Started

Update packages/mobile/App.tsx 

import {
  createDrawerNavigator
} from "react-navigation";


const CustomDrawer = (props:any) => {
  return <NavigationMenu {...props} drawerContent />
}
const UserLoggedInDrawer = createDrawerNavigator(
  {
    NavigationMenu: { screen: NavigationMenu, navigationOptions: { title: 'NavigationMenu' } }
  },
  {
    initialRouteName: 'NavigationMenu',
    contentComponent: CustomDrawer,
    headerMode: 'none'
  }
);


+ Navigation Stack

UserLoggedInDrawer: { screen: UserLoggedInDrawer, navigationOptions: { header: null } }

### Prerequisites

### Git Structure

### Installing

## Running the tests

## CI/CD Details

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).