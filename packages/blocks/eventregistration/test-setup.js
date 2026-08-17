// test-setup.js
import React from "react";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'macos',
    select: () => null
}));

jest.mock("react-native-daterange-picker", () => <></>)
jest.mock('react-native-calendars', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    Calendar: (props) => (
      <View testID="mock-calendar">
        <Text>Mock Calendar</Text>
        {props.onDayPress && (
          <Text onPress={() => props.onDayPress({ dateString: '2025-04-15' })}>
            Press Day
          </Text>
        )}
      </View>
    ),
    Agenda: () => (
      <View testID="mock-agenda">
        <Text>Mock Agenda</Text>
      </View>
    ),
    CalendarList: () => (
      <View testID="mock-calendar-list">
        <Text>Mock Calendar List</Text>
      </View>
    ),
    LocaleConfig: {
      locales: {},
      defaultLocale: '',
    },
  };
});


jest.mock("react-native-vector-icons/MaterialCommunityIcons", ()=>"MaterialCommunityIcons")
jest.mock("react-native-vector-icons/Feather", ()=>"Icon")
jest.mock("react-native-vector-icons/FontAwesome", () => ({
    FontAwesome: jest.fn()
}))
jest.mock('react-native-swipe-list-view', () => ({
    SwipeListView: jest.fn()
  }));