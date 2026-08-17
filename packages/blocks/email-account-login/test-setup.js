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
