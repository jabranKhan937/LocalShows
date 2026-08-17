// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock("../../framework/src/StorageProvider", () => {
  let store = {}
  return {
    set: function (key, value) {
      store[key] = value.toString();
    },
    get: function (key) {
      return store[key];
    },
    remove: function (key) {
      delete store[key];
    },
  };
});

jest.mock('react-native-image-picker', () => {
  return {
    launchCamera: jest.fn(),
    launchImageLibrary: jest.fn()
  }
})

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
  },
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
}))

function FormDataMock() {
  this.append = jest.fn();
}
global.FormData = FormDataMock;