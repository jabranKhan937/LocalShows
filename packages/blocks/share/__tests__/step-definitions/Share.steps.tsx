import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Share from "../../src/Share"

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    openDrawer:jest.fn()
  },
  id: "Share"
}

const mockAPISuccessCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  instance[apiCallID] = msgSucessRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgSucessRestAPI)
}

const mockAPIFailureCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgFailureRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgFailureRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgFailureRestAPI.messageId);
  msgFailureRestAPI.addData(getName(MessageEnum.RestAPIResponceErrorMessage), apiData);
  instance[apiCallID] = msgFailureRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgFailureRestAPI)
}

const mockSuccessResponse = {
  "data": [
    {
      "id": "34",
      "type": "follow",
      "attributes": {
        "id": 34,
        "current_user_id": 284,
        "account_id": 287,
        "created_at": "2024-04-16T09:29:21.320Z",
        "updated_at": "2024-04-16T09:29:34.232Z",
        "confirmed": true,
        "name": "A Yopmail",
        "followed_back": true,
        "profile_image_url": null
      }
    },
    {
      "id": "33",
      "type": "follow",
      "attributes": {
        "id": 33,
        "current_user_id": 284,
        "account_id": 287,
        "created_at": "2024-04-16T09:29:21.320Z",
        "updated_at": "2024-04-16T09:29:34.232Z",
        "confirmed": true,
        "name": "A Yopmail",
        "followed_back": true,
        "profile_image_url": "profile_image_url"
      }
    }
  ],
  "meta": {
    "message": "List of followers."
  }
}

const mockSuccessEmptyResponse = {
  "data": [],
  "meta": {
    "message": "List of followers."
  }
}

const mockMessageResponse = {
  "data": {
    "id": 96,
    "account_id": 287,
    "chat_id": 6,
    "message": null,
    "created_at": "2024-04-19T05:33:55.103Z",
    "updated_at": "2024-04-19T05:33:55.103Z",
    "is_mark_read": false,
    "message_type": "event",
    "attachment": null,
    "show_id": 190
  },
  "event": {
    "id": 190,
    "event_title": "Event with likes",
    "date_of_the_show": "2024-04-16",
    "time": "2000-01-01T04:00:00.000Z",
    "line_ups": "baba",
    "description": "Description",
    "rules_and_regulations": "Rules",
    "created_at": "2024-04-09T08:13:29.777Z",
    "updated_at": "2024-04-19T04:40:54.286Z",
    "city": "Washington",
    "state": "District of Columbia",
    "country": "US",
    "address": "Address",
    "location": "Location",
    "zip_code": 12345,
    "like_by_me": true,
    "added_in_calendar": false,
    "account_id": 277,
    "type_of_show": "Art"
  }
}

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
  set:jest.fn()
}));

const feature = loadFeature('./__tests__/features/Share-scenario.feature');

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
  });

  test('User navigates to Share', ({ given, when, then }) => {
    let shareBlock: ShallowWrapper;
    let instance: Share;

    given('I am a User loading Share', () => {
      shareBlock = shallow(<Share {...screenProps} />)
    });

    when('I navigate to the Share', () => {
      instance = shareBlock.instance() as Share
    });

    then('Share will load with out errors', () => {
      expect(shareBlock).toBeTruthy()
    });

    then('I can select the button with with out errors', () => {
      let buttonComponent = shareBlock.findWhere((node) => node.prop('testID') === 'btnShare');
      buttonComponent.simulate('press')
    });

  });


  test('User navigates to Share for mobile', ({ given, when, then }) => {
    let shareBlock: ShallowWrapper;
    let instance: Share;

    given('User loads Share screen', () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      shareBlock = shallow(<Share {...screenProps} />)
    });

    when('User navigate to the Share screen', () => {
      instance = shareBlock.instance() as Share
      const hamburgerButton = shareBlock.findWhere((node) => node.prop("testID") === "hamburgerBtn")
      hamburgerButton.simulate("press")
      const KeaboardDismissBtn = shareBlock.findWhere((node) => node.prop("testID") === "KeaboardDismissBtn")
      KeaboardDismissBtn.simulate('press')
      const data = [{
        attributes:{
          is_selected:true
        }
      }]
      instance.renderUsersList({item:data[0]})
      const noPayload = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", noPayload);

      const payloadWithEventId = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      payloadWithEventId.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          eventId: 1,
        }
      );
      runEngine.sendMessage("Unit Test", payloadWithEventId);

      mockAPISuccessCall(instance, "getUsersListAPICallId", mockSuccessResponse)
      mockAPIFailureCall(instance, "getUsersListAPICallId", {
        "errors": [
          {
            "token": "Invalid token"
          }
        ]
      })
    });

    then("User list have some value", () => {
      expect(instance.state.userList).toBe(mockSuccessResponse.data)
    })

    when("User clicks back", () => {
      shareBlock.findWhere((node) => node.prop('testID') === 'backBtn').simulate('press')
    })

    then('User navigates back', () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("User uses search box", () => {
      shareBlock.findWhere((node) => node.prop('testID') === 'hamburgerBtn').simulate('press')
      shareBlock.findWhere((node) => node.prop('testID') === 'searchTxt').simulate('changeText', "search")
    })

    then("Search box has value", () => {
      expect(instance.state.searchInput).toBe("search")
    })

    when("User selects the User list", () => {
      shareBlock.findWhere((node) => node.prop('testID') === 'searchTxt').simulate('changeText', "")
      const flatList = shareBlock.findWhere(node => node.prop("testID") === "usersList");
      mockSuccessResponse.data.forEach((item, index) => {
        let innerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "ProfileNavBtn").simulate('press')
        let flatlistButtonComponent = innerWrapper.findWhere(
          (node) => node.prop("testID") === "profile"
        );
        flatlistButtonComponent.simulate("press");
        shareBlock.findWhere((node) => node.prop('testID') === 'btnShare').simulate('press')

        innerWrapper = flatList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = flatList.renderProp("ListEmptyComponent")({});
      })
    })

    then("Search is blank", () => {
      expect(instance.state.userList).toStrictEqual(mockSuccessResponse.data)
    })

    when("User list is empty", () => {
      mockAPISuccessCall(instance, "getUsersListAPICallId", mockSuccessEmptyResponse)
      shareBlock.findWhere((node) => node.prop('testID') === 'searchTxt').simulate('changeText', "")
      const flatList = shareBlock.findWhere(node => node.prop("testID") === "usersList");
      mockSuccessEmptyResponse.data.forEach((item) => {
        let innerWrapper = flatList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = flatList.renderProp("ListEmptyComponent")({});
      })
    })

    then("Empty list component is rendered", () => {
      expect(instance.state.userList).toStrictEqual(mockSuccessEmptyResponse.data)
    })

    when("User interacts with share button", () => {
      shareBlock.findWhere((node) => node.prop('testID') === 'btnShare').simulate('press')

    })

    then("Send message API is triggered", () => {
      expect(instance.state.searchInput).toBe("")
    })

    when("share event API is called", async () => {
      const shareEventRequestMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      shareEventRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        shareEventRequestMsg.messageId
      );

      shareEventRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );

      instance.shareEventAPICallID = shareEventRequestMsg.messageId;
      const selectedItems = [{
        attributes: {
          current_user_id: 123,
          name: 'John Doe',
          profile_image_url: 'https://example.com/profile.jpg',
          is_selected:true
        }
      }];
      instance.setState({userList:selectedItems})
      await instance.handleRestAPIResponse(shareEventRequestMsg)
      runEngine.sendMessage("Unit Test", shareEventRequestMsg);
    });

    then("navigate is invoked", () => {
      expect(shareBlock.exists()).toBe(true);
    });
  });


});
