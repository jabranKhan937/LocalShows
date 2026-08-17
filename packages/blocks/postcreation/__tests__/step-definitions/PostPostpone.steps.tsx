import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
export const configJSON = require("../../config.json");
import React from "react";

import PostPostpone from "../../src/PostPostpone";

jest.useFakeTimers()

const mockPostponeSuccess = {
  "data": {
    "id": "199",
    "type": "show",
    "attributes": {
      "id": 199,
      "event_title": "test",
      "date_of_the_show": "2024-05-31",
      "time": "08:30:00",
      "description": "hello",
      "rules_and_regulations": null,
      "city": "Washington",
      "state": "District of Columbia",
      "country": "US",
      "zip_code": 12312,
      "address": "address",
      "location": "location",
      "like_by_me": false,
      "added_in_calendar": false,
      "account_id": 272,
      "show_features": [
        
      ],
      "website": "abc.com",
      "likes_count": 0,
      "comment_count": 0,
      "model_name": "Show",
      "band_name": "sad",
      "band_profile_image": "",
      "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZHM9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a15cd758f55d6e17739786308762a4f22d036b85/eventImage.jpg",
      "type_of_show": [
        {
          "id": 7,
          "name": "Enjoyment",
          "approved_by_admin": true,
          "created_at": "2023-10-03T09:46:13.354Z",
          "updated_at": "2024-02-27T10:22:02.320Z"
        }
      ],
      "genre": [
        {
          "id": 78,
          "name": "Comedy",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:37:01.232Z",
          "updated_at": "2024-03-05T10:37:01.232Z"
        },
        {
          "id": 77,
          "name": "Burlesque",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:36:45.793Z",
          "updated_at": "2024-03-05T10:36:45.793Z"
        },
        {
          "id": 79,
          "name": "Dance",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:37:16.629Z",
          "updated_at": "2024-03-05T10:37:16.629Z"
        }
      ],
      "line_ups": [
        'sad'
      ]
    }
  }
}

const mockFailureResponse = {
  "errors": [
      {
          "token": "Invalid token"
      }
  ]
}
const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
  },
  id: "Posts"
};

const feature = loadFeature("./__tests__/features/PostPostpone-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("User navigates to PostPostpone", ({ given, when, then }) => {
    let postponeWrapper: ShallowWrapper;
    let instance: PostPostpone;

    given("I am a User attempting to create a post", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      postponeWrapper = shallow(<PostPostpone {...screenProps} />);
    });

    when("I click on post a show", () => {
      instance = postponeWrapper.instance() as PostPostpone;
      instance.generateTimes()
    });

    then("User interacts with the screen", () => {
      postponeWrapper.findWhere(node => node.prop("testID") === "backButton").simulate("press");
      postponeWrapper.findWhere(node => node.prop("testID") === "timePicker").simulate("valueChange", "time");
      postponeWrapper.findWhere(node => node.prop("testID") === "undefinedDate").simulate("press");
      postponeWrapper.findWhere(node => node.prop("testID") === "definedDate").simulate("press");
      postponeWrapper.findWhere(node => node.prop("testID") === "btnDateSelector").simulate("press");
      postponeWrapper.findWhere(node => node.prop("testID") === "saveBtn").simulate("press");
      postponeWrapper.findWhere(node => node.prop("testID") === "hideCalendarPopup").simulate("press");
      
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("Date is empty", () => {
      instance.setState({ dateOfShow: "" })
    })

    then("Throw date empty error", () => {
      postponeWrapper.findWhere(node => node.prop("testID") === "saveBtn").simulate("press");
      expect(instance.state.dateOfShowError).toBe("Please enter date of the show")
    })

    when("Time is not selected", () => {
      instance.setState({ time: "" })
    })

    then("Throw time not selected error", () => {
      postponeWrapper.findWhere(node => node.prop("testID") === "saveBtn").simulate("press");
      expect(instance.state.timeError).toBe("Please select time")
    })

    when("Date and Time is set", ()=> {
      instance.setState({undefinedDateSelected: false, dateOfShow: "10-10-1000", time: '00:00'})
    })
 
    then("Render UI with date and time", ()=> {
      const postponeShowSuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postponeShowSuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), mockPostponeSuccess)
      instance.postponeShowAPICallID = postponeShowSuccess.messageId
      runEngine.sendMessage('Unit Test', postponeShowSuccess)

      const postponeShowFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postponeShowFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), mockFailureResponse)
      instance.postponeShowAPICallID = postponeShowFailure.messageId
      runEngine.sendMessage('Unit Test', postponeShowFailure)
      instance.handlePostponeAPI()
      expect(instance.state.undefinedDateSelected).toBe(false)
    })

    when("Undefined date is set", ()=> {
      instance.setState({undefinedDateSelected: true, dateOfShow: "", time: ''})
    })
 
    then("Render UI with undefined date", ()=> {
      const postponeShowSuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postponeShowSuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), mockPostponeSuccess)
      instance.postponeShowAPICallID = postponeShowSuccess.messageId
      runEngine.sendMessage('Unit Test', postponeShowSuccess)
      instance.handlePostponeShowAPIResponse(mockPostponeSuccess)

      const postponeShowFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postponeShowFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), mockFailureResponse)
      instance.postponeShowAPICallID = postponeShowFailure.messageId
      runEngine.sendMessage('Unit Test', postponeShowFailure)
      instance.handlePostponeShowAPIResponse(mockFailureResponse)
      expect(instance.state.undefinedDateSelected).toBe(true)
    })
  })

  test("iOS User navigates to PostPostpone", ({ given, when, then }) => {
    let postponeWrapper: ShallowWrapper;
    let instance: PostPostpone;

    given("I am a User attempting to create a post", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      postponeWrapper = shallow(<PostPostpone {...screenProps} />);
    });

    when("I click on post a show", () => {
      instance = postponeWrapper.instance() as PostPostpone;
      instance.generateTimes()
    });

    then("User interacts with the screen", () => {
      postponeWrapper.findWhere(node => node.prop("testID") === "btnTimeSelect").simulate("press");
      postponeWrapper.findWhere(node => node.prop("testID") === "timePickerModal").simulate("valueChange", "00:00");
      postponeWrapper.findWhere(node => node.prop("testID") === "hideTimeModal").simulate("press");

      expect(instance.state.time).toBe("00:00");
    });

    when("Undefined date is set", ()=> {
      instance.setState({undefinedDateSelected: true, dateOfShow: "", time: ''})
    })
 
    then("Render UI with undefined date", ()=> {
      expect(instance.state.undefinedDateSelected).toBe(true)
    })
  })
});