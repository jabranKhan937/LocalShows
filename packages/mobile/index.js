// index.js - MOBILE
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import {App} from './App';

const snapshots = false;
if(snapshots){
  require('./indexSnapshot');
}
else {
  try {
    AppRegistry.registerComponent(appName, () => App);
  } catch (e) {
    console.error('AppRegistry registration failed', e);
  }
}
