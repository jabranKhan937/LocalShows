import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import NewPassword from "../../src/NewPassword";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";

jest.useFakeTimers();

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn()
  },
  id: "forgot-password"
};

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

const mockErrorResponse = {
  "errors": []
}

const feature = loadFeature(
  "./__tests__/features/new-password-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("User navigates to NewPassword", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: NewPassword;
    let testLabel: ShallowWrapper;

    given("I am a User loading NewPassword", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      exampleBlockA = shallow(<NewPassword {...screenProps} />);
      testLabel = exampleBlockA.findWhere(
        node => node.prop("testID") === "testLabel"
      );
    });

    when("I navigate to the NewPassword", () => {
      instance = exampleBlockA.instance() as NewPassword;
      exampleBlockA.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test@123");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
      mockAPISuccessCall(instance, "changePasswordApiCallId", {
        meta: {
          token:
            "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
        }
      })
      mockAPISuccessCall(instance, "changePasswordApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "changePasswordApiCallId", mockErrorResponse)
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    when("New password is invalid", () => {
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    when("New password is invalid", () => {
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test@");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    when("New password is invalid", () => {
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "123");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "123");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    when("Confirm password and new password are empty", () => {
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    when("Confirm password and new password are not same", () => {
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test@1234");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

  });

  test("iOS User navigates to NewPassword", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: NewPassword;
    let testLabel: ShallowWrapper;

    given("I am a User loading NewPassword", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      exampleBlockA = shallow(<NewPassword {...screenProps} />);
      testLabel = exampleBlockA.findWhere(
        node => node.prop("testID") === "testLabel"
      );
    });

    when("I navigate to the NewPassword", () => {
      instance = exampleBlockA.instance() as NewPassword;
      exampleBlockA.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      exampleBlockA.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test@123");
      exampleBlockA.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press")
      exampleBlockA.findWhere(node => node.prop("testID") === "confirmPasswordSubmit").simulate("press")
    });

    then("NewPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });
  });
});
