import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import ForgotPassword from "../../src/ForgotPassword";
import ForgotPasswordOTP from "../../src/ForgotPasswordOTP";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../framework/src/RunEngine";

jest.useFakeTimers();

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
  },
  id: "forgot-password",
};

const feature = loadFeature(
  "./__tests__/features/forgot-password-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to ForgotPassword", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: ForgotPassword;
    let testLabel: ShallowWrapper;

    given("I am a User loading ForgotPassword", () => {
      exampleBlockA = shallow(<ForgotPassword {...screenProps} />);
      testLabel = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
    });

    when("I navigate to the ForgotPassword", () => {
      instance = exampleBlockA.instance() as ForgotPassword;
      instance.isPlatformiOS = () => {
        return true;
      };
      instance.isPlatformWeb = () => {
        return false;
      };
    });

    then("ForgotPassword is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    then("user can enter email successfully", () => {
      let textInputComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      );
      textInputComponent.simulate("changeText", "hello@aol.com");
      expect(instance.state.emailValue).toBe("hello@aol.com");
    });

    then("user can submit email successfully", () => {
      let textInputComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      );
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnEmailSubmit"
      );

      textInputComponent.simulate("changeText", "");
      buttonComponent.simulate("press");

      textInputComponent.simulate("changeText", "hello");
      buttonComponent.simulate("press");

      textInputComponent.simulate("changeText", "hello@");
      buttonComponent.simulate("press");

      textInputComponent.simulate("changeText", "@aol.com");
      buttonComponent.simulate("press");

      textInputComponent.simulate("changeText", "hello@aol.co.m");
      buttonComponent.simulate("press");

      textInputComponent.simulate("changeText", "$#^$lo@aol.com");
      buttonComponent.simulate("press");

      textInputComponent.simulate("changeText", "hello@aol.com");
      buttonComponent.simulate("press");

      expect(instance.state.isFetching).toBe(true);
    });

    then("user can go back", () => {
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      );
      buttonComponent.simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    then("controller functions work properly", () => {
      // Email OTP API success

      let msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        meta: {
          token:
            "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q",
        },
      });
      instance.requestEmailOtpCallId = msg.messageId;
      runEngine.sendMessage("Unit Test", msg);

      // Error
      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        errors: true,
      });
      instance.requestEmailOtpCallId = msg.messageId;
      runEngine.sendMessage("Unit Test", msg);

      // Failure
      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {
        errors: true,
      });
      instance.requestEmailOtpCallId = msg.messageId;
      runEngine.sendMessage("Unit Test", msg);

      // Change Password API success

      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        meta: {
          token:
            "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q",
        },
      });
      instance.changePasswordApiCallId = msg.messageId;
      runEngine.sendMessage("Unit Test", msg);

      // Navigation Payload
      msg = new Message(getName(MessageEnum.NavigationPayLoadMessage));
      instance.isChangePassword = true;
      msg.addData(getName(MessageEnum.AuthTokenDataMessage), "token");
      runEngine.sendMessage("Unit Test", msg);

      msg = new Message(getName(MessageEnum.NavigationPayLoadMessage));
      msg.addData(
        getName(MessageEnum.NavigationForgotPasswordPageInfo),
        "email"
      );
      runEngine.sendMessage("Unit Test", msg);
    });
  });

  test("User navigates to ForgotPasswordOTP", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: ForgotPasswordOTP;
    let testLabel: ShallowWrapper;
    let textInputComponent1: ShallowWrapper;
    let textInputComponent2: ShallowWrapper;
    let textInputComponent3: ShallowWrapper;
    let textInputComponent4: ShallowWrapper;

    given("I am a User loading ForgotPasswordOTP", () => {
      exampleBlockA = shallow(<ForgotPasswordOTP {...screenProps} />);
      testLabel = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
    });

    when("I navigate to the ForgotPasswordOTP", () => {
      instance = exampleBlockA.instance() as ForgotPasswordOTP;
      instance.otpInputRefs = Array(4).fill({ focus: jest.fn() });
      instance.setState({ timer: 0 });
    });

    then("ForgotPasswordOTP is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    then("user can enter otp", () => {
      textInputComponent1 = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "txtInput-0"
      );
      textInputComponent1.simulate("focus");
      textInputComponent2 = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "txtInput-1"
      );
      textInputComponent3 = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "txtInput-2"
      );
      textInputComponent4 = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "txtInput-3"
      );

      textInputComponent1.simulate("changeText", "1");
      textInputComponent2.simulate("changeText", "2");
      textInputComponent3.simulate("changeText", "3");
      textInputComponent4.simulate("changeText", "4");
      textInputComponent1.simulate("keyPress", { nativeEvent: { key: "1" } });
      textInputComponent2.simulate("keyPress", { nativeEvent: { key: "2" } });
      textInputComponent3.simulate("keyPress", { nativeEvent: { key: "3" } });
      textInputComponent4.simulate("keyPress", { nativeEvent: { key: "4" } });
      instance.setState({ isFetching: true });

      expect(instance.state.otp.join()).toBe("1,2,3,4");
    });

    then("user can resend otp", () => {
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnResendCode"
      );
      buttonComponent.simulate("press");
      expect(instance.state.timer).toBe(180);
    });

    then("user can submit otp", () => {
      const testFn = jest.fn();
      const tmpSubmitFn = instance.submitOtp;
      instance.submitOtp = async () => {
        tmpSubmitFn();
        testFn();
      };
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnConfirm"
      );
      buttonComponent.simulate("press");
      expect(testFn).toHaveBeenCalled();
    });

    then("user can go back", () => {
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      );
      buttonComponent.simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });
  });
});
