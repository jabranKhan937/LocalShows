import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Notifications from "../../src/Notifications"

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn(),
    openDrawer:jest.fn(),
    push:jest.fn()
  },
  id: "forgot-password"
};

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_id')),
  get: jest.fn().mockImplementation(() => Promise.resolve('1')),
}));

const mockNotificationList = [
  {
    "id": "361",
    "type": "activity_log",
    "attributes": {
      "id": 361,
      "message": "You Are Successfully Logged In With localshowapp!!",
      "account_id": 185,
      "is_read": true,
      "notification_type": null,
      "record_id": null,
      "is_confirm": false,
      "user_id": null,
      "user_name": null,
      "profile_image": "",
      "follow_back": null,
      "created_at": "2024-04-16T09:25:47.990Z",
    }
  },
  {
    "id": "363",
    "type": "activity_log",
    "attributes": {
      "id": 363,
      "message": "Asthaone  sent you a friend request",
      "account_id": 185,
      "is_read": false,
      "notification_type": "follow",
      "record_id": 12,
      "is_confirm": false,
      "user_id": 204,
      "user_name": "Asthaone ",
      "profile_image": "",
      "follow_back": null,
      "created_at": "2024-04-15T10:25:48.701Z",
    }
  },
  {
    "id": "363",
    "type": "activity_log",
    "attributes": {
      "id": 363,
      "message": "Asthaone  sent you a friend request",
      "account_id": 185,
      "is_read": false,
      "notification_type": "follow",
      "record_id": 12,
      "is_confirm": false,
      "user_id": 204,
      "user_name": "Asthaone ",
      "profile_image": "",
      "follow_back": "",
      "created_at": "2024-03-16T09:25:47.990Z",
    }
  },
  {
    "id": "365",
    "type": "activity_log",
    "attributes": {
      "id": 365,
      "message": "Asthatwo  sent you a friend request",
      "account_id": 185,
      "is_read": true,
      "notification_type": "follow",
      "record_id": 13,
      "is_confirm": true,
      "user_id": 205,
      "user_name": "Asthatwo ",
      "profile_image": "rails/active_storage/blobs/--26f5b9c980c349f522cfdf82333d62230e86f328/profilePicture.jpg",
      "follow_back": 'true',
      "created_at": "2023-04-16T09:25:47.990Z",
    }
  },
  {
    "id": "366",
    "type": "activity_log",
    "attributes": {
      "id": 366,
      "message": "Asthathree  sent you a friend request",
      "account_id": 184,
      "is_read": true,
      "notification_type": "follow",
      "record_id": 13,
      "is_confirm": true,
      "user_id": 203,
      "user_name": "Asthathree ",
      "profile_image": "rails/active_storage/blobs/--26f5b9c980c349f522cfdf82333d62230e86f328/profilePicture.jpg",
      "follow_back": 'pending',
      "created_at": "2024-04-15T11:25:48.701Z",
    }
  },
  {
    "id": "366",
    "type": "activity_log",
    "attributes": {
      "id": 366,
      "message": "Asthathree  sent you a friend request",
      "account_id": 184,
      "is_read": true,
      "notification_type": "follow",
      "record_id": 13,
      "is_confirm": true,
      "user_id": 203,
      "user_name": "Asthathree ",
      "profile_image": "rails/active_storage/blobs/--26f5b9c980c349f522cfdf82333d62230e86f328/profilePicture.jpg",
      "follow_back": 'following',
      "created_at": "2024-04-16T09:25:47.990Z",
    }
  }
]

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

const feature = loadFeature('./__tests__/features/Notifications-scenario.feature');

defineFeature(feature, (test) => {


  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
  });

  test('User navigates to Notifications', ({ given, when, then }) => {
    let notificationsBlock: ShallowWrapper;
    let instance: Notifications;
    
    given('I am a User loading Notifications', () => {
      notificationsBlock = shallow(<Notifications {...screenProps} />)
    });

    when('I navigate to the Notifications', async () => {
      instance = notificationsBlock.instance() as Notifications
     await instance.handleUserProfileNav(123,'Band')
     await instance.handleUserProfileNav(123,'Artist')
     await instance.handleUserProfileNav(123,'Fan')
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "backButton"
      ).simulate("press");

      mockAPISuccessCall(instance, "getNotificationListCallId", mockNotificationList)
      mockAPIFailureCall(instance, "getNotificationListCallId", [])
    });

    then('Notifications will load with out errors', () => {
      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      )
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), 'TOKEN')
      runEngine.sendMessage('Unit Test', tokenMsg)

      mockAPISuccessCall(instance, "getDataCallId", { "data": mockNotificationList, "meta": { "message": "List of notifications." } })
      mockAPISuccessCall(instance, "deleteCallId", { "message": "Deleted." })
      mockAPISuccessCall(instance, "markAsReadCallId", { "message": "Done." })

      expect(instance.state.activeTab).toBe('you')
    });

    when("User interacts with the screen components", ()=>{
      const flatList = notificationsBlock.findWhere(node => node.prop("testID") === "youNotificationList");
      mockNotificationList.forEach((item, index) => {
        let innerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        let flatlistButtonComponent = innerWrapper.findWhere(
          (node) => node.prop("testID") === "notificationItem"
        );
        flatlistButtonComponent.simulate("press");

        innerWrapper = flatList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = flatList.renderProp("ListEmptyComponent")({});
      })

      notificationsBlock.findWhere((node)=>node.prop('testID') === "hamburgerButton").simulate('press')

    })

    then("User navigates back", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("User clicks the You tab", ()=>{
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "youTab"
      ).simulate("press");
    })

    then("You tab gets active", () => {
      expect(instance.state.activeTab).toBe('you')
    })

    when("User clicks the Your Friend tab", ()=> {
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "yourFriendTab"
      ).simulate("press");
    })

    then("Your Friend tab gets active", () => {
      expect(instance.state.activeTab).toBe('your')
    })

    when("User has follow request notification", () => {
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "youTab"
      ).simulate("press");
      const flatList = notificationsBlock.findWhere(node => node.prop("testID") === "youNotificationList");
      mockNotificationList.forEach((item, index) => {
        const innerWrapper = flatList.renderProp("renderItem")({
          item: item,
        });

        if (index === 1) {

          let flatlistButtonComponent = innerWrapper.findWhere(
            (node) => node.prop("testID") === "positiveButton"
          );
          flatlistButtonComponent.simulate("press");

          flatlistButtonComponent = innerWrapper.findWhere(
            (node) => node.prop("testID") === "negativeButton"
          );
          flatlistButtonComponent.simulate("press");
        }
      })

      mockAPISuccessCall(instance, "readNotificationCallId", [])
      mockAPIFailureCall(instance, "readNotificationCallId", [])

      mockAPISuccessCall(instance, "confirmRemoveRequestCallId", [])
      mockAPIFailureCall(instance, "confirmRemoveRequestCallId", [])

      mockAPISuccessCall(instance, "followBackRequestCallId", [])
      mockAPIFailureCall(instance, "followBackRequestCallId", [])
    })

    then("Render Follow and remove buttons", () => {
      expect(instance.state.searchInput).toBe("")
    })

    when("User confirms the request notification", () => {
      mockAPISuccessCall(instance, "getNotificationListCallId", mockNotificationList)
      const flatList = notificationsBlock.findWhere(node => node.prop("testID") === "youNotificationList");
      mockNotificationList.forEach((item, index) => {
        const innerWrapper = flatList.renderProp("renderItem")({
          item: item,
        });
        if (index === 3) {
          let flatlistButtonComponent = innerWrapper.findWhere(
            (node) => node.prop("testID") === "followBackButton"
          );
          flatlistButtonComponent.simulate("press");
        }
      })
    })

    then("Render Follow back button", () => {
      expect(instance.state.selectedNotificationID).toBe("363")
    })

    when("User is switched to Your Friend tab", () => {
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "yourFriendTab"
      ).simulate("press");
      const flatList = notificationsBlock.findWhere(node => node.prop("testID") === "youNotificationList");
      mockNotificationList.forEach((item) => {
        flatList.renderProp("renderItem")({
          item: item,
        });

        flatList.renderProp("ListEmptyComponent")({});
      })
    })

    then("Render Your Friends tab UI", () => {
      expect(instance.state.activeTab).toBe("your")
    })

    when("Search input has data", () => {
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "youTab"
      ).simulate("press");
      notificationsBlock.findWhere(
        (node) => node.prop("testID") === "searchTextInput"
      ).simulate("ChangeText", "event");
      const flatList = notificationsBlock.findWhere(node => node.prop("testID") === "youNotificationList");
      mockNotificationList.forEach((item, index) => {
        let innerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        let flatlistButtonComponent = innerWrapper.findWhere(
          (node) => node.prop("testID") === "notificationItem"
        );
        flatlistButtonComponent.simulate("press");

        innerWrapper = flatList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = flatList.renderProp("ListEmptyComponent")({});
      })
      mockAPISuccessCall(instance, "readNotificationCallId", [])
      mockAPIFailureCall(instance, "readNotificationCallId", [])

      mockAPISuccessCall(instance, "confirmRemoveRequestCallId", [])
      mockAPIFailureCall(instance, "confirmRemoveRequestCallId", [])

      mockAPISuccessCall(instance, "followBackRequestCallId", [])
      mockAPIFailureCall(instance, "followBackRequestCallId", [])
    })

    then("Render API with search input", () => {
      expect(instance.state.searchInput).toBe("event")
    })

  });


});
