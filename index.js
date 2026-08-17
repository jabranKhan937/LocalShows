/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { AppRegistry, LogBox } from 'react-native';
// import App from './App';
import { name as appName } from './app.json';
import { App } from './packages/mobile/App';

LogBox.ignoreAllLogs();

const snapshots = false;
if (snapshots) {
  require('./indexSnapshot');
} else {
  try {
    AppRegistry.registerComponent(appName, () => App);
  } catch (e) {
    console.error('AppRegistry registration failed', e);
  }
}
