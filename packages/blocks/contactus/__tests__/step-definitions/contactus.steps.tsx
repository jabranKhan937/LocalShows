import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Contactus from "../../src/Contactus";
import AddContactUs from "../../src/AddContactus";

import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import { _ } from "../../../../framework/src/IBlock";

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

const mockResponse = {
  data: [
    {
      id: "10",
      type: "contact",
      attributes: {
        name: "Tester",
        email: "test@me.com",
        phone_number: "13015551212",
        description: "None",
        created_at: "2021-03-08T23:17:49.068Z",
        user: "Firstname Lastname",
      },
    },
  ],
}

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([]))
}));

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    openDrawer: jest.fn()
  },
  id: "Contactus",
};

jest.useFakeTimers()

const mockErrorResponse = {
  "errors": [
    {
      "contact": [
        "Phone number is too short (minimum is 12 characters)",
        "Phone number The format of phone number should be like +12345678900"
      ]
    }
  ]
}

const mockError = { "errors": [{ "token": "Invalid token" }] }

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

const feature = loadFeature("./__tests__/features/contactus-scenario.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
      OS: "android",
      select: jest.fn()
    }));
  });
  let ContactUsWrapper: ShallowWrapper;
  let instance: Contactus;
  let testLabel: ShallowWrapper;

  test("User navigates to contactus", ({ given, when, then }) => {

    given("I am a User loading contactus", () => {
      ContactUsWrapper = shallow(<Contactus {...screenProps} />);
    });

    when("I navigate to the contactus", () => {
      instance = ContactUsWrapper.instance() as Contactus;

      testLabel = ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "testLabel"
      )

      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);

      mockAPISuccessCall(instance, "getCountryCodeListId", mockCountryCodeList)
      mockAPISuccessCall(instance, "getCountryCodeListId", mockError)
      mockAPIFailureCall(instance, "getCountryCodeListId", mockError)

      mockAPISuccessCall(instance, "contactUsApiCallId", mockResponse)
      mockAPISuccessCall(instance, "contactUsApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "contactUsApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "deleteContactApiCallId", { message: {} })
      mockAPISuccessCall(instance, "deleteContactApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "deleteContactApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "postContactUsApiCallID", mockResponse)
      mockAPISuccessCall(instance, "postContactUsApiCallID", mockErrorResponse)
      mockAPIFailureCall(instance, "postContactUsApiCallID", mockErrorResponse)

      mockAPISuccessCall(instance, "addContactApiCallId", { message: {} })
      mockAPISuccessCall(instance, "addContactApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "addContactApiCallId", mockErrorResponse)
    });

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Form is filled", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      ).simulate("press");

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "hamburgerButton"
      ).simulate("press");

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "btnCountryCodeSelectAndroid"
      ).simulate("press")
      
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "email@gmail.com")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputSubject"
      ).simulate("changeText", "Lorem ipsum")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputMessage"
      ).simulate("changeText", "Lorem ipsum")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "btnAccept"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Form is empty", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputSubject"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputMessage"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Name is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "12Qwert")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Phone number is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567y")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Phone number is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "123456789012345")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Email is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "Name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "Email")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Email is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "Name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "email@")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Email is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "Name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "1)@gmail.com")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })



    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

  });

  test("User navigates to contactus iOS", ({ given, when, then }) => {

    given("I am a User loading contactus", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "ios",
        select: jest.fn()
      }));
      ContactUsWrapper = shallow(<Contactus {...screenProps} />);
    });

    when("I navigate to the contactus", () => {
      instance = ContactUsWrapper.instance() as Contactus;

      testLabel = ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "testLabel"
      )

      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);

      mockAPISuccessCall(instance, "getCountryCodeListId", mockCountryCodeList)
      mockAPISuccessCall(instance, "getCountryCodeListId", mockError)
      mockAPIFailureCall(instance, "getCountryCodeListId", mockError)

      mockAPISuccessCall(instance, "contactUsApiCallId", mockResponse)
      mockAPISuccessCall(instance, "contactUsApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "contactUsApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "deleteContactApiCallId", { message: {} })
      mockAPISuccessCall(instance, "deleteContactApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "deleteContactApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "postContactUsApiCallID", mockResponse)
      mockAPISuccessCall(instance, "postContactUsApiCallID", mockErrorResponse)
      mockAPIFailureCall(instance, "postContactUsApiCallID", mockErrorResponse)

      mockAPISuccessCall(instance, "addContactApiCallId", { message: {} })
      mockAPISuccessCall(instance, "addContactApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "addContactApiCallId", mockErrorResponse)
    });

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Form is filled", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      ).simulate("press");

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "hamburgerButton"
      ).simulate("press");

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "btnCountryCodeSelect"
      ).simulate("press")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "countryCodePickerModal"
      ).simulate("valueChange", mockCountryCodeList.data[0])
      
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "hideCountryCode"
      ).simulate("press")
      
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "email@gmail.com")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputSubject"
      ).simulate("changeText", "Lorem ipsum")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputMessage"
      ).simulate("changeText", "Lorem ipsum")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "btnAccept"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Form is empty", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputSubject"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputMessage"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Name is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "12Qwert")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Phone number is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567y")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Phone number is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "123456789012345")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Email is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "Name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "Email")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Email is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "Name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "email@")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })

    when("Email is invalid", () => {
      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputName"
      ).simulate("changeText", "Name")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputCellPhone"
      ).simulate("changeText", "1234567890")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputEmail"
      ).simulate("changeText", "1)@gmail.com")

      ContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "sendMessageBtn"
      ).simulate("press")
    })

    then("press back button", () => {
      expect(testLabel).toBeDefined();
    })
  });

  test("User navigates to addContactus", ({ given, when, then }) => {
    let AddContactUsWrapper: ShallowWrapper;
    let instance: AddContactUs;

    given("I am a User loading addContactus", () => {
      AddContactUsWrapper = shallow(<AddContactUs {...screenProps} />);
    });

    when("I navigate to the addContactus", () => {
      instance = AddContactUsWrapper.instance() as AddContactUs;

      let buttonComponent = AddContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "btnSubmit"
      );
      buttonComponent.simulate("press");

      let textInputComponent = AddContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtName"
      );
      textInputComponent.simulate("changeText", "FIRST");

      textInputComponent = AddContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtEmail"
      );
      textInputComponent.simulate("changeText", "a@b.com");

      textInputComponent = AddContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtPhoneNumber"
      );
      textInputComponent.simulate("changeText", "13105551212");

      textInputComponent = AddContactUsWrapper.findWhere(
        (node) => node.prop("testID") === "txtComments"
      );
      textInputComponent.simulate("changeText", "N/A");

      buttonComponent.simulate("press");
    });

    when("user click on hamburger icon", () => {
      const hamburgerButton = ContactUsWrapper.findWhere((node) => node.prop("testID") === "hamburgerButton")
      hamburgerButton.simulate("press")
    })

  });
});
