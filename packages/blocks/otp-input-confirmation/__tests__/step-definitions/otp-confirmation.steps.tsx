import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import OTPConfirmation from "../../src/OTPInputAuth";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../framework/src/RunEngine";

jest.useFakeTimers();

// jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock') );
jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_id')),
  get: jest.fn().mockImplementation(() => Promise.resolve('27')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

const screenProps = {
  navigation: {
    state: {
      params: {
        payload: {
          email: "abc@a.com",
        },
        token: "token",
        endpoint: "/account_block/accounts",
        redirect_to: "claim_page",
        claim_id: ""
      }
    },
    goBack: jest.fn(),
    navigate: jest.fn(),
  },
  id: "OTPConfirmation",
};

const feature = loadFeature("./__tests__/features/otp-confirmation-scenario.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to OTPConfirmation", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: OTPConfirmation;
    let textInputComponent1: ShallowWrapper;
    let textInputComponent2: ShallowWrapper;
    let textInputComponent3: ShallowWrapper;
    let textInputComponent4: ShallowWrapper;
    let testLabel: ShallowWrapper;
  
    let testFn: () => void;

    given("I am a User loading OTPConfirmation", () => {
      exampleBlockA = shallow(<OTPConfirmation {...screenProps} />);
      testLabel = exampleBlockA.findWhere((node) => node.prop('testID') === 'testLabel');
    });

    when("I navigate to the OTPConfirmation", () => {
      instance = exampleBlockA.instance() as OTPConfirmation;
      instance.otpInputRefs = Array(4).fill({ focus: jest.fn() });
    });

    then("OTPConfirmation is rendered correctly", () => {
      expect(testLabel).toBeDefined();
    });

    given("otp inputs are rendered", () => {
      textInputComponent1 = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputOTP-0');
      textInputComponent1.simulate("focus");
      textInputComponent2 = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputOTP-1');
      textInputComponent3 = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputOTP-2');
      textInputComponent4 = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputOTP-3');
    });

    when("I enter otp", () => {
      textInputComponent1.simulate('changeText', '1');
      textInputComponent2.simulate('changeText', '2');
      textInputComponent3.simulate('changeText', '3');
      textInputComponent4.simulate('changeText', '4');
      textInputComponent1.simulate("keyPress",{nativeEvent:{ key: '1' }})
      textInputComponent2.simulate("keyPress",{nativeEvent:{ key: '2' }})
      textInputComponent3.simulate("keyPress",{nativeEvent:{ key: '3' }})
      textInputComponent4.simulate("keyPress",{nativeEvent:{ key: '4' }})
    });

    then("otp state gets updated", () => {
      expect(instance.state.otp.join()).toBe('1,2,3,4');
    });

    then("can click resend otp", () => {
      let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnResendOTP');
      buttonComponent.simulate('press');

      expect(instance.state.timer).not.toBe(0);
    });

    then("can submit otp", () => {
      let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnConfirm');
      buttonComponent.simulate('press');

      instance.setState({ isFromForgotPassword: true });
      buttonComponent.simulate('press');
      instance.otpInputRefs;
      expect(instance.state.isFetching).toBe(true);
    });

    then("can go back", () => {
      let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'navigationBackButton');
      buttonComponent.simulate('press');

      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    then("controller functions work properly", async () => {
      instance.setState({ timer: 100, isFromForgotPassword: false });
      instance.componentDidMount();

      instance.btnSubmitOTPProps.onPress();
      instance.txtMobilePhoneOTPMobileProps.onChangeText("");

      instance.otpInputRefs = [{ focus: () => { } }, { focus: () => { } }, { focus: () => { } }, { focus: () => { } },];
      instance.focusInput(1);
      instance.handleOTPChange(1, "");
      
      // Success
      let otpVerificationResponseMesaage = new Message(getName(MessageEnum.RestAPIResponceMessage))
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceDataMessage), otpVerificationResponseMesaage.messageId);
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
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
            "state": "District of Columbia",
            "city": "Washington",
            "role_id": 1,
            "i_would_like": false,
            "terms_and_conditions": true,
            "are_you_18": true,
            "private": false,
            "is_blacklisted": false,
            "push_notification": false,
            "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZzhCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fe24ff71e1f8fb4642a5fc97ca541b0af95c359e/profilePic.jpg"
          }
        },
        "meta": {
          "message": "OTP Confirmed Successfully",
          "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTg1LCJleHAiOjE3MjE3Mjc3NTJ9.sR7eQMEfGHn_CHow8goTG2sxUGh9kr1JEReNFY7gvM9X9VMtNwBQ3MIjKpa3dO4oMcZG0fvlos9LKDIDyxz_Ig"
        }
      });
      instance.otpAuthApiCallId = otpVerificationResponseMesaage.messageId
      runEngine.sendMessage("Unit Test", otpVerificationResponseMesaage)

      otpVerificationResponseMesaage = new Message(getName(MessageEnum.RestAPIResponceMessage))
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceDataMessage), otpVerificationResponseMesaage.messageId);
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
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
            "account_type": "Band",
            "country": "US",
            "state": "District of Columbia",
            "city": "Washington",
            "role_id": 1,
            "i_would_like": false,
            "terms_and_conditions": true,
            "are_you_18": true,
            "private": false,
            "is_blacklisted": false,
            "push_notification": false,
            "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZzhCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fe24ff71e1f8fb4642a5fc97ca541b0af95c359e/profilePic.jpg"
          }
        },
        "meta": {
          "message": "OTP Confirmed Successfully",
          "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTg1LCJleHAiOjE3MjE3Mjc3NTJ9.sR7eQMEfGHn_CHow8goTG2sxUGh9kr1JEReNFY7gvM9X9VMtNwBQ3MIjKpa3dO4oMcZG0fvlos9LKDIDyxz_Ig"
        }
      });
      let Mockresponse = {data:{attributes:{account_type:'Band',first_name:"",profile_image:"test",full_phone_number:'test',state:"",city:"",push_notification:"",terms_and_conditions:true},id:""},meta:{token:''}}
      const Mockresponse2 = {data:{attributes:{account_type:null}},meta:{token:''}}
      instance.props.navigation.state.params.endpoint = '/account_block/accounts'
     await instance.handleOTPResponse(Mockresponse)
      instance.props.navigation.state.params.endpoint = 'test'
    await  instance.handleOTPResponse(Mockresponse)
      instance.setState({redirectToScreen:'test'})
      instance.handleAccountBlockResponse(Mockresponse,otpVerificationResponseMesaage)
      instance.setState({redirectToScreen:'dispute_form'})
      instance.handleAccountBlockResponse(Mockresponse,otpVerificationResponseMesaage)
      instance.setState({redirectToScreen:'claim_page'})
      instance.handleAccountBlockResponse(Mockresponse,otpVerificationResponseMesaage)
      instance.handleAccountBlockResponse(Mockresponse2,otpVerificationResponseMesaage)
      instance.handleNonAccountBlockResponse({data:{attributes:{account_type:null}},meta:{token:''}},otpVerificationResponseMesaage)
      instance.handleNonAccountBlockResponse({data:{attributes:{account_type:'Band'}},meta:{token:''}},otpVerificationResponseMesaage)
      instance.handleNonAccountBlockResponse({data:{attributes:{account_type:'Artist'}},meta:{token:''}},otpVerificationResponseMesaage)
      instance.handleNonAccountBlockResponse({data:{attributes:{account_type:'Fan'}},meta:{token:''}},otpVerificationResponseMesaage)
      instance.handleNonAccountBlockResponse({data:{attributes:{account_type:'venue'}},meta:{token:''}},otpVerificationResponseMesaage)
      instance.otpAuthApiCallId = otpVerificationResponseMesaage.messageId
      instance.storeUserData(Mockresponse)
      instance.storeUserData({data:{attributes:{account_type:'Artist',first_name:"",profile_image:"test",full_phone_number:'test',state:"",city:"",push_notification:"",terms_and_conditions:true},id:""},meta:{token:''}})
      instance.storeUserData({data:{attributes:{account_type:'Fan',first_name:"",profile_image:"test",full_phone_number:'test',state:"",city:"",push_notification:"",terms_and_conditions:true},id:""},meta:{token:''}})
      instance.storeUserData({data:{attributes:{account_type:'venue',first_name:"",profile_image:"test",full_phone_number:'test',state:"",city:"",push_notification:"",terms_and_conditions:true},id:""},meta:{token:''}})
      instance.storeUserData({...Mockresponse,data:{...Mockresponse.data,attributes:{...Mockresponse.data.attributes,account_type:null}}})
      instance.handleKeyPress({ nativeEvent: { key: "Backspace" } },'1')
      runEngine.sendMessage("Unit Test", otpVerificationResponseMesaage)

      // Success but from forgot password
      instance.setState({ isFromForgotPassword: true });
      otpVerificationResponseMesaage = new Message(getName(MessageEnum.RestAPIResponceMessage))
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceDataMessage), otpVerificationResponseMesaage.messageId);
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        "messages": [{ otp: "1234" }]
      });
      instance.otpAuthApiCallId = otpVerificationResponseMesaage.messageId
      runEngine.sendMessage("Unit Test", otpVerificationResponseMesaage)

      // Error
      otpVerificationResponseMesaage = new Message(getName(MessageEnum.RestAPIResponceMessage))
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceDataMessage), otpVerificationResponseMesaage.messageId);
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {});
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {});
      instance.otpAuthApiCallId = otpVerificationResponseMesaage.messageId
      runEngine.sendMessage("Unit Test", otpVerificationResponseMesaage)

      // Success
      otpVerificationResponseMesaage = new Message(getName(MessageEnum.RestAPIResponceMessage))
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceDataMessage), otpVerificationResponseMesaage.messageId);
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        "meta": {
          "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
        }
      });
      instance.resendOTPApiCallId = otpVerificationResponseMesaage.messageId
      runEngine.sendMessage("Unit Test", otpVerificationResponseMesaage)

      // Error
      otpVerificationResponseMesaage = new Message(getName(MessageEnum.RestAPIResponceMessage))
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceDataMessage), otpVerificationResponseMesaage.messageId);
      otpVerificationResponseMesaage.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {});
      instance.resendOTPApiCallId = otpVerificationResponseMesaage.messageId
      runEngine.sendMessage("Unit Test", otpVerificationResponseMesaage)

      //Navigation
      let navigationMessage = new Message(getName(MessageEnum.NavigationPayLoadMessage))
      navigationMessage.addData(getName(MessageEnum.AuthTokenDataMessage), "abc");
      navigationMessage.addData(getName(MessageEnum.AuthTokenPhoneNumberMessage), "9876543210");
      navigationMessage.addData(getName(MessageEnum.AuthTokenEmailMessage), "abc@a.com");
      runEngine.sendMessage("Unit Test", navigationMessage)

      navigationMessage = new Message(getName(MessageEnum.NavigationPayLoadMessage))
      navigationMessage.addData(getName(MessageEnum.AuthTokenEmailMessage), "abc@a.com");
      navigationMessage.addData(getName(MessageEnum.EnterOTPAsForgotPasswordMessage), true);
      runEngine.sendMessage("Unit Test", navigationMessage)

      expect(instance.state.email).toBe("abc@a.com");
    });
  });
});
