import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Likeapost2 from "../../src/Likeapost2"

const mockLikeList = [
  {
    "id": "200",
    "type": "account",
    "attributes": {
      "activated": true,
      "country_code": null,
      "email": "testparth@yopmail.com",
      "first_name": "",
      "full_phone_number": "91913118761",
      "phone_number": null,
      "type": null,
      "created_at": "2024-01-17T09:37:16.208Z",
      "updated_at": "2024-02-02T11:57:58.823Z",
      "device_id": null,
      "unique_auth_id": "kVnHHMgxyxmLMvRut21eLQtt",
      "country": "India",
      "state": "MP",
      "city": "Indore",
      "profile_image": "",
      "followers": 2,
      "following": 0,
      "verify_at": null,
      "follow": true,
      "account_type":"Band"
    }
  },
  {
    "id": "185",
    "type": "account",
    "attributes": {
      "activated": true,
      "country_code": null,
      "email": "astha.gupta@metafic.co",
      "first_name": "Astha",
      "full_phone_number": "11234567890",
      "phone_number": null,
      "type": null,
      "created_at": "2023-12-21T14:31:20.312Z",
      "updated_at": "2024-02-11T06:35:53.847Z",
      "device_id": null,
      "unique_auth_id": "KsXDPCcTJhF4xmu8ia4iGQtt",
      "country": "United States",
      "state": "Alaska",
      "city": "Akutan",
      "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
      "followers": 0,
      "following": 1,
      "verify_at": null,
      "follow": false
    }
  }
]

const mockErrorResponse = {
  "errors": []
}

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    getParam: jest.fn(),
    navigate: jest.fn(),
    openDrawer: jest.fn(),
    push:jest.fn()
  },
  id: "Likeapost2"
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

const feature = loadFeature('./__tests__/features/likeapost2-scenario.feature');

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve('27')),
  set: jest.fn().mockImplementation(() => Promise.resolve('authToken'))
}));
jest.useFakeTimers()
defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }));
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
  });

  test('User navigates to likeapost2', ({ given, when, then }) => {
    let likeAPostWrapper: ShallowWrapper;
    let instance: Likeapost2;
    let search: ShallowWrapper;

    given('I am a User loading likeapost2', () => {
      likeAPostWrapper = shallow(<Likeapost2 {...screenProps} />);
    });

    when('I navigate to the likeapost2', () => {
      instance = likeAPostWrapper.instance() as Likeapost2
      search = likeAPostWrapper.findWhere((node) => node.prop('testID') === 'searchTxt')
      instance.handleNavigationUserProfile({id:123})
      instance.handleNavigationUserProfile({id:123,attributes:{
        account_type:'Artist'
      }})
      instance.handleNavigationUserProfile({id:123,attributes:{
        account_type:'Band'
      }})
      instance.handleNavigationUserProfile({id:123,attributes:{
        account_type:'fan'
      }})
      instance.handleNavigationUserProfile({id:123,attributes:null})
      instance.handleNavigationUserProfile(null)
      mockAPISuccessCall(instance, "getLikesListAPICallId", {
        data: mockLikeList
      })

      mockAPISuccessCall(instance, "getLikesListAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getLikesListAPICallId", mockErrorResponse)
      const likesList = likeAPostWrapper.findWhere(node => node.prop("testID") === "likesList");
      mockLikeList.forEach((item, index) => {
        let innerWrapper = likesList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "profile"
        ).simulate("press");

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "followBtn"
        ).simulate("press");

        innerWrapper = likesList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = likesList.renderProp("ListEmptyComponent")({});
      })

      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          eventID: "1",
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      mockAPISuccessCall(instance, "postFollowAPICallId", {})

      mockAPISuccessCall(instance, "postFollowAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "postFollowAPICallId", mockErrorResponse)
    });

    then("Render the likes list", () => {
      expect(search).toBeDefined()
    })

    when("User search for event", () => {
      mockAPISuccessCall(instance, "getLikesListAPICallId", {
        data: mockLikeList
      })
      instance.setState({likedUsersList:mockLikeList})
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'searchTxt').simulate('changeText', "Search")
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'searchTxt').simulate('changeText', "Astha")
      instance.filterList(null)
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'backBtn').simulate('press')
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'hamburgerBtn').simulate('press')
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'popupCloseButton').simulate('press')
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'createAccountBtn').simulate('press')
      likeAPostWrapper.findWhere((node) => node.prop('testID') === 'loginBtn').simulate('press')
    })

    then("Render the filtered likes list", () => {
      expect(search).toBeDefined()
    })

  });

  test('Guest User navigates to likeapost2', ({ given, when, then }) => {
    let likeAPostWrapper: ShallowWrapper;
    let instance: Likeapost2;
    let search: ShallowWrapper;

    given('I am a User loading likeapost2', () => {
      likeAPostWrapper = shallow(<Likeapost2 {...screenProps} />);

      jest.doMock("../../../../framework/src/StorageProvider", () => ({
        get: jest.fn().mockImplementation(() => Promise.resolve([])),
        set: jest.fn().mockImplementation(() => Promise.resolve('authToken'))
      }));
    });

    when('I navigate to the likeapost2', () => {
      instance = likeAPostWrapper.instance() as Likeapost2
      search = likeAPostWrapper.findWhere((node) => node.prop('testID') === 'searchTxt')

      mockAPISuccessCall(instance, "getLikesListAPICallId", {
        data: mockLikeList
      })

      mockAPISuccessCall(instance, "getLikesListAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getLikesListAPICallId", mockErrorResponse)
      const likesList = likeAPostWrapper.findWhere(node => node.prop("testID") === "likesList");
      mockLikeList.forEach((item, index) => {
        let innerWrapper = likesList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "profile"
        ).simulate("press");

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "followBtn"
        ).simulate("press");

        innerWrapper = likesList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = likesList.renderProp("ListEmptyComponent")({});
      })

      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          eventID: "1",
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      mockAPISuccessCall(instance, "postFollowAPICallId", {})

      mockAPISuccessCall(instance, "postFollowAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "postFollowAPICallId", mockErrorResponse)
    });

    then("Render the likes list", () => {
      expect(search).toBeDefined()
    })

  });


});
