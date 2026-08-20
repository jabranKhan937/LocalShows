// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        SafeAreaView: ({ children, ...props }) =>
            React.createElement(View, props, children),
        useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    };
});

jest.mock('react-native-vector-icons/Feather', () => 'Icon');

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'macos',
    select: () => null
}));

jest.mock('react-native-document-picker', () => ({
    types: {
        allFiles: '.ics'
    },
    pickSingle: jest.fn().mockImplementation(() => ({uri: 'test'}))
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(`BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    DTSTART:20220915T103000Z
    DTEND:20220915T111500Z
    SUMMARY:React Native
    DESCRIPTION:Description
    END:VEVENT
    END:VCALENDAR`),
  })
);

global.URL.createObjectURL = jest.fn().mockImplementation(() => "/filepath.ics")
