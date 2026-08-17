// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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

jest.mock('react-native-daterange-picker', () => {
  return {
    DateRangePicker: jest.fn(),
  };
});

function FormDataMock() {
  this.append = jest.fn();
}

global.FormData = FormDataMock;

configure({ adapter: new Adapter() });

jest.mock('react-native-fs', () => ({
  ExternalStorageDirectoryPath: jest.fn(),
  stat: jest.fn(),
  readdir: jest.fn(),
}));

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);