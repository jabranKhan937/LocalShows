import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import ChangePassword from "../../src/ChangePassword"

const screenProps = {
  navigation: {
    goBack: jest.fn(),
  },
  id: "ChangePassword"
}

const mockFailure = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

const feature = loadFeature('./__tests__/features/ChangePassword-scenario.feature');

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

defineFeature(feature, (test) => {

  beforeEach(() => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
  });

  test('User navigates to changePassword', ({ given, when, then }) => {
    let changePasswordBlock: ShallowWrapper;
    let instance: ChangePassword;
    let changePassword: ShallowWrapper;

    given('I am a User loading changePassword', () => {
      changePasswordBlock = shallow(<ChangePassword {...screenProps} />);
    });

    when('I navigate to the changePassword', () => {
      instance = changePasswordBlock.instance() as ChangePassword
      changePassword =  changePasswordBlock.findWhere(node => node.prop("testID") === "changePassword")
      
      changePasswordBlock.findWhere(node => node.prop("testID") === "container").simulate("press")
      changePasswordBlock.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press")
      changePasswordBlock.findWhere(node => node.prop("testID") === "currentPasswordTxt").simulate("changeText", "")
      changePasswordBlock.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press")
      changePasswordBlock.findWhere(node => node.prop("testID") === "newPasswordTxt").simulate("changeText", "")
      changePasswordBlock.findWhere(node => node.prop("testID") === "newPasswordIcon").simulate("press")
      changePasswordBlock.findWhere(node => node.prop("testID") === "confirmNewPasswordTxt").simulate("changeText", "")
      changePasswordBlock.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")

      mockAPISuccessCall(instance, "updatePasswordAPICallID", {
        "message": "Record not found or account not activated."
      })
      mockAPISuccessCall(instance, "updatePasswordAPICallID", mockFailure)
      mockAPIFailureCall(instance, "updatePasswordAPICallID", mockFailure)
    });

    then("User interacts with UI", () => {
      expect(changePassword).toBeDefined()
    })

    when("User fills the Current Password", () => {
      changePasswordBlock.findWhere(node => node.prop("testID") === "currentPasswordTxt").simulate("changeText", "Test@123")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")
    })

    then("Current Password is not empty", () => {
      expect(changePassword).toBeDefined()
    })

    when("User fills the New Password", () => {
      changePasswordBlock.findWhere(node => node.prop("testID") === "newPasswordTxt").simulate("changeText", "Test")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")
    })

    then("New Password is not empty but invalid", () => {
      expect(changePassword).toBeDefined()
    })

    when("User fills the New Password with Alphabets and character", () => {
      changePasswordBlock.findWhere(node => node.prop("testID") === "newPasswordTxt").simulate("changeText", "Test@")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")
    })

    then("New Password is not empty but invalid", () => {
      expect(changePassword).toBeDefined()
    })

    when("User fills the New Password with number", () => {
      changePasswordBlock.findWhere(node => node.prop("testID") === "newPasswordTxt").simulate("changeText", "1")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")
    })

    then("New Password is not empty but invalid", () => {
      expect(changePassword).toBeDefined()
    })

    when("User fills the New Password", () => {
      changePasswordBlock.findWhere(node => node.prop("testID") === "newPasswordTxt").simulate("changeText", "Test@123")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")
    })

    then("New Password is not empty", () => {
      expect(changePassword).toBeDefined()
    })

    when("User re-enters the New Password", () => {
      changePasswordBlock.findWhere(node => node.prop("testID") === "confirmNewPasswordTxt").simulate("changeText", "Test@123")
      changePasswordBlock.findWhere(node => node.prop("testID") === "btnUpdate").simulate("press")
    })

    then("Confirm Password matches the New Password", () => {
      expect(changePassword).toBeDefined()
    })
  });
});
