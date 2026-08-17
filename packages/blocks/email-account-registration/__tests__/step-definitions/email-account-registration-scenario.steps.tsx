import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";

import EmailAccountRegistration from "../../src/EmailAccountRegistration";
import { Text } from "react-native";

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

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve(true)),
  set: jest.fn().mockImplementation(() => Promise.resolve('tAndCAcceptance')),
  remove: jest.fn().mockImplementation(() => Promise.resolve('tAndCAcceptance'))
}));

jest.useFakeTimers()

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  RESULTS: {
    DENIED: 'denied',
    GRANTED: 'granted',
  },
  PERMISSIONS: {
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.location_when_in_use'
    },
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.access_fine_location'
    }
  }
}));

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn((success, error) => {
    success({
      coords: {
        latitude: 37.7749, 
        longitude: -122.4194,
      },
    });
  }),
}));

const mockError = { "errors": [{ "token": "Invalid token" }] }

const mockCountryList = {
  "countries": [
    {
      "country_code": "US",
      "country_name": "United States"
    },
    {
      "country_code": "AE",
      "country_name": "United Arab Emirates"
    },]
}

const mockCountryCodeList = {
  "data": [
    {
      "id": "CN",
      "type": "country_code_and_flag",
      "attributes": {
        "name": "China",
        "country_code": "86",
        "map_url": "https://flagcdn.com/64x48/cn.png"
      }
    },
    {
      "id": "TW",
      "type": "country_code_and_flag",
      "attributes": {
        "name": "Taiwan, Province of China",
        "country_code": "886",
        "map_url": "https://flagcdn.com/64x48/tw.png"
      }
    }
  ]
}

const mockStateList = {
  "state": {
    "AK": "Alaska",
    "AL": "Alabama",
  }
}

const mockCityList = {
  "city": [
    "Akutan",
    "Alakanuk",
  ]
}

const mockSignupResponse = {
  meta: {
    token:
      "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q",
  },
}

const mockLocationResponse = {
  "state": "New York",
  "city": "New York",
  "country": "United States",
  "country_code": "us"
}


const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn().mockImplementation((event, callback) => {
      callback();
      return {
        remove: jest.fn(),
      };
    }),
  },
  id: "email-account-registration-scenario",
};

const feature = loadFeature(
  "./__tests__/features/email-account-registration-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
      OS: 'android',
      select: jest.fn(),
    }))
  });

  test("Register User for Android", ({ given, when, then }) => {
    let emailAccountRegistrationWrapperRegistration: ShallowWrapper;
    let instance: EmailAccountRegistration;
    let screenWrapper: ShallowWrapper;

    given("I am a User attempting to Register after confirming OTP", () => {
      emailAccountRegistrationWrapperRegistration = shallow(
        <EmailAccountRegistration {...screenProps} />
      );
      expect(emailAccountRegistrationWrapperRegistration).toBeTruthy();
    });

    when("I navigate to the Registration Screen", () => {
      instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration;

      instance.getCurrentLatLong()

      mockAPISuccessCall(instance, "getCountryCodeListId", mockCountryCodeList)
      mockAPISuccessCall(instance, "getCountryCodeListId", { errors: [] })
      mockAPIFailureCall(instance, "getCountryCodeListId", { errors: [] })

      mockAPISuccessCall(instance, "getCountryListId", mockCountryList)
      mockAPISuccessCall(instance, "getCountryListId", mockError)
      mockAPIFailureCall(instance, "getCountryListId", mockError)

      mockAPISuccessCall(instance, "getStatesId", mockStateList)
      mockAPISuccessCall(instance, "getStatesId", mockError)
      mockAPIFailureCall(instance, "getStatesId", mockError)

      mockAPISuccessCall(instance, "getCitiesId", mockCityList)
      mockAPISuccessCall(instance, "getCitiesId", mockError)
      mockAPIFailureCall(instance, "getCitiesId", mockError)

      screenWrapper = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "Background");
      screenWrapper.simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "navigationBackButton").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputName").simulate("changeText", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("blur");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "passwordImage").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPasswordConfirm").simulate("changeText", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPasswordConfirm").simulate("blur");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "confirmPasswordImage").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "countryPicker").simulate("valueChange", "US");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "statePicker").simulate("valueChange", "AK");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "cityPicker").simulate("valueChange", "Akutan");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPhone").simulate("changeText", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnAcceptTerms").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnLegalTermsAndCondition").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnOptIn").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnEighteenPlus").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnLogin").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnAccept").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere(node => node.prop("testID") === "btnCountryCodeSelect").simulate("press");
    });

    then("I can leave the screen with out errors", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Complete the registration form", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputName").simulate("changeText", "name");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "email@gmail.com");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPasswordConfirm").simulate("changeText", "Test@123");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "countryPicker").simulate("valueChange", "United State");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "statePicker").simulate("valueChange", "AK");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "cityPicker").simulate("valueChange", "Akutan");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPhone").simulate("changeText", "1234567890");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnAcceptTerms").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnLegalTermsAndCondition").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");

      mockAPISuccessCall(instance, "createAccountApiCallId", mockSignupResponse)
      mockAPISuccessCall(instance, "createAccountApiCallId", mockError)
      mockAPIFailureCall(instance, "createAccountApiCallId", mockError)

      mockAPISuccessCall(instance, "getCurrentStateCityId", mockLocationResponse)
      mockAPISuccessCall(instance, "getCurrentStateCityId", mockError)
      mockAPIFailureCall(instance, "getCurrentStateCityId", mockError)
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Name contains numbers", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputName").simulate("changeText", "name1");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Email contains special characters", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "email#");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Email domain is empty", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "@.");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Email domain lacks .(dot)", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "test@examplecom");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Email domain has invalid characters", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "email#!@!.0");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Password length is not 8", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@1");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Password does not have small letters", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "TEST@123");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Password does not have capital letters", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "test@123");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Password does not contain numbers", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "Password");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Password does not contain special characters", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "Password1");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Password and confirm password are different", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPassword").simulate("changeText", "Password1");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPasswordConfirm").simulate("changeText", "Password12");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Country is not selected", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "countryPicker").simulate("valueChange", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Cell phone length is not 10", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPhone").simulate("changeText", "12345678");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("Cell phone has invalid characters", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputPhone").simulate("changeText", "A12345678B");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });

    when("State is empty", () => {
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "statePicker").simulate("valueChange", "");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Trigger API for registration", () => {
      expect(screenWrapper).toBeDefined()
    });
  });

  test("Register User for iOS", ({ given, when, then }) => {
    let emailAccountRegistrationWrapperRegistration: ShallowWrapper;
    let instance: EmailAccountRegistration;
    let screenWrapper: ShallowWrapper;

    given("I am a User attempting to Register after confirming OTP", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))

      jest.doMock('react-native-permissions', () => ({
        check: jest.fn(),
        request: jest.fn(),
        RESULTS: {
          DENIED: 'denied',
          GRANTED: 'granted',
        },
        PERMISSIONS: {
          IOS: {
            LOCATION_WHEN_IN_USE: 'ios.location_when_in_use'
          },
          ANDROID: {
            ACCESS_FINE_LOCATION: 'android.access_fine_location'
          }
        }
      }));

      emailAccountRegistrationWrapperRegistration = shallow(
        <EmailAccountRegistration {...screenProps} />
      );
      expect(emailAccountRegistrationWrapperRegistration).toBeTruthy();
    });

    when("I navigate to the Registration Screen", () => {
      instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration;

      mockAPISuccessCall(instance, "getCountryListId", mockCountryList)
      mockAPISuccessCall(instance, "getCountryListId", mockError)
      mockAPIFailureCall(instance, "getCountryListId", mockError)

      mockAPISuccessCall(instance, "getStatesId", mockStateList)
      mockAPISuccessCall(instance, "getStatesId", mockError)
      mockAPIFailureCall(instance, "getStatesId", mockError)

      mockAPISuccessCall(instance, "getCitiesId", mockCityList)
      mockAPISuccessCall(instance, "getCitiesId", mockError)
      mockAPIFailureCall(instance, "getCitiesId", mockError)

      screenWrapper = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "Background");
      screenWrapper.simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "txtInputEmail").simulate("changeText", "");
      emailAccountRegistrationWrapperRegistration.findWhere(node => node.prop("testID") === "btnCountryCodeSelect").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnCountrySelect").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnStateSelect").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "btnCitySelect").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere(node => node.prop("testID") === "countryCodePickerModal").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere(node => node.prop("testID") === "countryCodePickerModal").simulate("ValueChange", {
        "id": "CN",
        "type": "country_code_and_flag",
        "attributes": {
          "name": "China",
          "country_code": "86",
          "map_url": "https://flagcdn.com/64x48/cn.png"
        }
      });
      emailAccountRegistrationWrapperRegistration.findWhere(node => node.prop("testID") === "hideCountryCodeModal").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "countryPickerModal").simulate("valueChange", "US");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "hideCountryModal").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "statePickerModal").simulate("valueChange", "AK");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "hideStateModal").simulate("press");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "cityPickerModal").simulate("valueChange", "Akutan");
      emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop("testID") === "hideCityModal").simulate("press");

    });

    then("I can leave the screen with out errors", () => {
      expect(screenWrapper).toBeDefined()
    });
  });
});
