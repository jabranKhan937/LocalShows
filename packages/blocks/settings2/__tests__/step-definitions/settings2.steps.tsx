import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Settings2 from "../../src/Settings2"

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    openDrawer:jest.fn()
  },
  id: "Settings2"
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

const mockProfileResponse = {
  "data": {
    "id": "185",
    "type": "account",
    "attributes": {
      "activated": true,
      "push_notification": true,
      "country_code": null,
      "email": "astha.gupta@metafic.co",
      "first_name": "Astha",
      "full_phone_number": "11234567890",
      "phone_number": "1234567890",
      "type": null,
      "created_at": "2023-12-21T14:31:20.312Z",
      "updated_at": "2024-04-12T12:54:29.579Z",
      "device_id": null,
      "unique_auth_id": "KsXDPCcTJhF4xmu8ia4iGQtt",
      "country": "US",
      "state": "Florida",
      "city": "Arcadia",
      "private": true,
      "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
      "followers": 1,
      "following": 0,
      "category_subcat": [],
      "band_artists": null,
      "calendar_shows": [],
      "liked_events": [],
      "verify_at": null,
      "follow": null
    }
  }
}

const mockGetPrivateAccResponse = {
  "private": true
}

const mockUpdatePrivateAccResponse = {
  "message": "Account set to private successfully."
}

const mockFailure = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve("fan")),
  remove: jest.fn().mockImplementation(() => Promise.resolve())
}));

const feature = loadFeature('./__tests__/features/settings2-scenario.feature');

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
  });

  test('User navigates to settings2', ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Settings2;
    let pageTitle: ShallowWrapper;

    given('I am a User loading settings2', () => {
      exampleBlockA = shallow(<Settings2 {...screenProps} />);
    });

    when('I navigate to the settings2', () => {
      instance = exampleBlockA.instance() as Settings2
      pageTitle = exampleBlockA.findWhere((node) => node.prop('testID') === 'pageTitle')

      mockAPISuccessCall(instance, "getIsPrivateAccountAPICallID", mockGetPrivateAccResponse)
      mockAPISuccessCall(instance, "getIsPrivateAccountAPICallID", mockFailure)
      mockAPIFailureCall(instance, "getIsPrivateAccountAPICallID", mockFailure)

      exampleBlockA.findWhere((node) => node.prop('testID') === 'containerTouchable').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'navigationBackButton').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'hamburgerButton').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'personalInformation').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'privateAccount').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'privateAccount').simulate('press')

      mockAPISuccessCall(instance, "putIsPrivateAccountAPICallID", mockUpdatePrivateAccResponse)
      mockAPISuccessCall(instance, "putIsPrivateAccountAPICallID", mockFailure)
      mockAPIFailureCall(instance, "putIsPrivateAccountAPICallID", mockFailure)

      exampleBlockA.findWhere((node) => node.prop('testID') === 'pushNotifications').simulate('press')

      exampleBlockA.findWhere((node) => node.prop('testID') === 'changePassword').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'deleteMyAccount').simulate('press')

      mockAPISuccessCall(instance, "putDeleteAccountAPICallID", {
        "message": "Record not found or account not activated."
      })
      mockAPISuccessCall(instance, "putDeleteAccountAPICallID", mockFailure)
      mockAPIFailureCall(instance, "putDeleteAccountAPICallID", mockFailure)

      exampleBlockA.findWhere((node) => node.prop('testID') === 'crossBtn').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'yesBtn').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'noBtn').simulate('press')

      mockAPISuccessCall(instance, "updateProfilePatchAPICallID", mockProfileResponse)
      mockAPISuccessCall(instance, "updateProfilePatchAPICallID", mockFailure)
      mockAPIFailureCall(instance, "updateProfilePatchAPICallID", mockFailure)
    })

    then('User press a button', () => {
      expect(pageTitle).toBeDefined()
    })

    when("user click on hamburger icon" , ()=>{
      const hamburgerButton = exampleBlockA.findWhere((node) => node.prop("testID") === "hamburgerButton")
      hamburgerButton.simulate("press")
    })

  });
});
