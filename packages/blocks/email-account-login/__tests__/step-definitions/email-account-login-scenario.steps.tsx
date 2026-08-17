import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import EmailAccountLoginBlock from "../../src/EmailAccountLoginBlock"

const screenProps = {
  navigation: {
    navigate: jest.fn()
  },
  id: "EmailAccountLoginBlock"
}

const mockFanLoginResponse = {
  "data": {
    "id": "185",
    "type": "email_account",
    "attributes": {
      "first_name": "Astha",
      "last_name": "",
      "full_phone_number": "11234567890",
      "country_code": 1,
      "phone_number": 1234567890,
      "email": "astha.gupta@metafic.co",
      "activated": true,
      "account_type": null,
      "country": "US",
      "state": "Florida",
      "city": "Arcadia",
      "role_id": 1,
      "i_would_like": false,
      "terms_and_conditions": true,
      "are_you_18": true,
      "private": true,
      "is_blacklisted": false,
      "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg"
    }
  },
  "meta": {
    "otp": {
      "id": 1133,
      "email": "astha.gupta@metafic.co",
      "pin": 2259,
      "activated": false,
      "valid_until": "2024-04-05T15:34:25.351Z",
      "created_at": "2024-04-05T15:31:25.351Z",
      "updated_at": "2024-04-05T15:31:25.351Z"
    },
    "message": "Verification otp send to your email successfully",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTEzMywiZXhwIjoxNzE0OTIzMDg1fQ.Xrt2k3oghihUfgzTIuB-67w9SjOY-qD3ExegSbEyA7Gi7PMjieADAh_28v8DPvcAoB67hTUZdpC5Llw2RB4pZg"
  }
}

const mockBandLoginResponse = {
  "data": {
    "id": "271",
    "type": "email_account",
    "attributes": {
      "first_name": "Rahul",
      "last_name": null,
      "full_phone_number": "19876543210",
      "country_code": 1,
      "phone_number": 9876543210,
      "email": "rahul@yopmail.com",
      "activated": true,
      "account_type": "Band",
      "country": "US",
      "state": "Alaska",
      "city": "Akutan",
      "role_id": 9,
      "i_would_like": false,
      "terms_and_conditions": false,
      "are_you_18": false,
      "private": true,
      "is_blacklisted": false,
      "profile_image": "q"
    }
  },
  "meta": {
    "otp": {
      "id": 1131,
      "email": "rahul@yopmail.com",
      "pin": 6990,
      "activated": false,
      "valid_until": "2024-04-05T15:16:52.831Z",
      "created_at": "2024-04-05T15:13:52.831Z",
      "updated_at": "2024-04-05T15:13:52.831Z"
    },
    "message": "Verification otp send to your email successfully",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTEzMSwiZXhwIjoxNzE0OTIyMDMzfQ.1rof8zW65tNU6FaYJqxpAby-d_ORmNTes5xGukwihiNg0kw7hUi5jpL4FaFH-MLiQZP0YaychFybdn_GcWMBnQ"
  }
}

const feature = loadFeature('./__tests__/features/email-account-login-scenario.feature');
jest.mock("../../../../framework/src/StorageProvider", () => ({
  getStorageData: jest.fn().mockImplementation(() => Promise.resolve([])),
  setStorageData: jest.fn().mockImplementation(() => Promise.resolve([]))
}));

const mockAPICall = (instance: any, apiCallID: string, apiData: object) => {
  const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  instance[apiCallID] = msgSucessRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgSucessRestAPI)
}

defineFeature(feature, (test) => {


  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
  });

  test('User navigates to Email Log In', ({ given, when, then }) => {
    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a User attempting to Log In with a Email', () => {
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />)
      expect(mobileAccountLogInWrapper).toBeTruthy()

      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock;

      const msgValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
      msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgValidationAPI.messageId);
      msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": [
            {
              "email_validation_regexp": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
              "password_validation_regexp": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
              "password_validation_rules": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_)."
            }
          ]
        });
      instance.validationApiCallId = msgValidationAPI.messageId
      runEngine.sendMessage("Unit Test", msgValidationAPI)

    });

    when('I navigate to the Log In Screen', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.sendLoginSuccessMessage()
      instance.openInfoPage()
      instance.txtInputPasswordProps.secureTextEntry = true
      instance.btnPasswordShowHideProps.onPress()
      instance.txtInputPasswordProps.secureTextEntry = false
      instance.btnPasswordShowHideProps.onPress()
      let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnEmailLogIn');
      buttonComponent.simulate('press');
      
      mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'loginBackground').simulate('press')

      instance.setState({ email: "abc" });
      buttonComponent.simulate('press');

      instance.handleEmailLoginAPIResponse({
        meta: [
          { token: "abc" }
        ]
      }, "");
    });

    then('I can enter a email address with out errors', () => {
      let textInputComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'txtInputEmail');
      textInputComponent.simulate('changeText', 'hello@aol.com');
    });

    then('I can enter a password with out errors', () => {
      let textInputComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'txtInputPassword');
      mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'passwordIcon').simulate("press");
      textInputComponent.simulate('changeText', 'passWord1!');
    });

    then('I can select the Log In button with out errors', () => {
      let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnEmailLogIn');
      buttonComponent.simulate('press');
    });

    then('I can select the Sign up button with out errors', () => {
      let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnSignUp');
      buttonComponent.simulate('press');
    });

    then('I can select the Forgot Password button with out errors', () => {
      let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnForgotPassword');
      buttonComponent.simulate('press');
    });

    then('I can leave the screen with out errors', () => {
      instance.componentWillUnmount();
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });
  });

  test('Empty Email Address', ({ given, when, then }) => {
    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a User attempting to Log In with a Email Address', () => {
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });

    when('I Log In with an empty Email Address', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock;
      instance.setState({ email: "", password: "password!" });
    });

    then('Log In Should Fail', () => {

      expect(instance.doEmailLogIn()).toBe(false);

      const msgLogInErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
      msgLogInErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgLogInErrorRestAPI);
      msgLogInErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "errors": [
            {
              "failed_login": "Login Failed"
            }
          ]
        });

      msgLogInErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgLogInErrorRestAPI.messageId);
      instance.apiEmailLoginCallId = msgLogInErrorRestAPI.messageId
      runEngine.sendMessage("Unit Test", msgLogInErrorRestAPI);
    });

  });

  test('Email Address and Empty Password', ({ given, when, then }) => {
    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a User attempting to Log In with a Email Address', () => {
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });

    when('I Log In with a Email Address and invalid Password', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "test@aol.com", password: "Test" })
      mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnEmailLogIn').simulate('press')
    });

    then('Log In Should Fail', () => {
      expect(instance.doEmailLogIn()).toBe(true);
    });

    when('I Log In with a Email Address and invalid Password', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "test@aol.com", password: "Test@" })
      mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnEmailLogIn').simulate('press')
    });

    then('Log In Should Fail', () => {
      expect(instance.doEmailLogIn()).toBe(true);
    });

    when('I Log In with a Email Address and invalid Password', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "test@aol.com", password: "1" })
      mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnEmailLogIn').simulate('press')
    });

    then('Log In Should Fail', () => {
      expect(instance.doEmailLogIn()).toBe(true);
    });
    when('I Log In with a Email Address and empty Password', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "test@aol.com", password: "" })
    });

    then('Log In Should Fail', () => {
      expect(instance.doEmailLogIn()).toBe(false);
    });

  });

  test('Password and Empty Email Address', ({ given, when, then }) => {
    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a User attempting to Log In with a Email Address', () => {
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });

    when('I Log In with a Password and empty Email Address', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "", password: "password" })
    });

    then('Log In Should Fail', () => {
      expect(instance.doEmailLogIn()).toBe(false);
    });
  });

  test('Email Address and Password', ({ given, when, then }) => {

    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a Registed User attempting to Log In with a Email Address', () => {
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });

    when('I Log In with Email Address and Password', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "abc@aol.com", password: "password" })
    });

    then('Log In Should Succeed', () => {
      expect(instance.doEmailLogIn()).toBe(true);
    });

    then('RestAPI will return token', () => {
      const msgLogInSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
      msgLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgLogInSucessRestAPI.messageId);
      msgLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), mockFanLoginResponse);
      instance.apiEmailLoginCallId = msgLogInSucessRestAPI.messageId
      runEngine.sendMessage("Unit Test", msgLogInSucessRestAPI)

    });

  });


  test('Email Address and Password for Band', ({ given, when, then }) => {

    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a Registed User attempting to Log In with a Email Address', () => {
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });

    when('I Log In with Email Address and Password', () => {
      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
      instance.setState({ email: "abc@aol.com", password: "password" })
    });

    then('Log In Should Succeed', () => {
      expect(instance.doEmailLogIn()).toBe(true);
    });

    then('RestAPI will return token for Band', () => {
      mockAPICall(instance, "apiEmailLoginCallId", mockBandLoginResponse)
      expect(instance.doEmailLogIn()).toBe(false);
    });

  });

  test('Remember Me - Email Address Account Log In', ({ given, when, then }) => {
    let mobileAccountLogInWrapper: ShallowWrapper;
    let instance: EmailAccountLoginBlock;

    given('I am a Registed User who has already Logged In and selected Remember Me', () => {
      //Force ios to render mobile layout once.
      jest.spyOn(helpers, 'getOS').mockImplementation(() => 'ios');
      mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });

    when('I navigate to Email Address Account Log In', () => {

      instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock

      const msgRestoreCreds = new Message(getName(MessageEnum.ReciveUserCredentials))
      msgRestoreCreds.addData(getName(MessageEnum.LoginPassword), "passWord1!")
      msgRestoreCreds.addData(getName(MessageEnum.LoginUserName), "test@aol.com")
      runEngine.sendMessage("Unit Test", msgRestoreCreds)

    });

    then('The Country Code, Email Address and Password will be restored', () => {
      expect(mobileAccountLogInWrapper).toBeTruthy();
    });
  });


});
