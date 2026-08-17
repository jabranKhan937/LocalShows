// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'macos',
    select: () => null
}));

jest.mock('react-native-radar', () => {
    return {
        on: jest.fn().mockImplementation(() => Promise.resolve()),
        setLogLevel: jest.fn().mockImplementation(() => Promise.resolve()),
        setUserId:jest.fn().mockImplementation(() => Promise.resolve()),
        setMetadata: jest.fn().mockImplementation(() => Promise.resolve()),
        requestPermissions: jest.fn().mockImplementation(() => Promise.resolve()),
        getPermissionsStatus: jest.fn().mockImplementation(() => Promise.resolve()),
        trackOnce: jest.fn().mockImplementation(() => Promise.resolve()),
        startTrackingContinuous: jest.fn().mockImplementation(() => Promise.resolve()),
        searchPlaces: jest.fn().mockImplementation(() => Promise.resolve()),
        searchGeofences: jest.fn().mockImplementation(() => Promise.resolve()),
        autocomplete: jest.fn().mockImplementation(() => Promise.resolve()),
        geocode: jest.fn().mockImplementation(() => Promise.resolve()),
        reverseGeocode: jest.fn().mockImplementation(() => Promise.resolve()),
        ipGeocode: jest.fn().mockImplementation(() => Promise.resolve()),
        getDistance: jest.fn().mockImplementation(() => Promise.resolve()),
        getMatrix: jest.fn().mockImplementation(() => Promise.resolve()),
        startTrip: jest.fn().mockImplementation(() => Promise.resolve()),
        mockTracking: jest.fn().mockImplementation(() => Promise.resolve()),
        completeTrip: jest.fn().mockImplementation(() => Promise.resolve()),
        getLocation: jest.fn().mockImplementation(() => Promise.resolve()),
    };
});
