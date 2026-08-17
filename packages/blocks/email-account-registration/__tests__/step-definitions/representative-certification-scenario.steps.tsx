import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import React from "react";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
export const configJSON = require("../../config.json");
import RepresentativeCertification from "../../src/RepresentativeCertification";
import { runEngine } from '../../../../framework/src/RunEngine'
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
  id: "representative-certification-scenario"
};

const feature = loadFeature(
  "./__tests__/features/representative-certification-scenario.feature"
);

const mockAPISuccessCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  instance[apiCallID] = msgSucessRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgSucessRestAPI)
}

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve("band")),
  set: jest.fn().mockImplementation(() => Promise.resolve("userRole")),
}));

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
      OS: "android",
      select: jest.fn()
    }));
  });

  test("Representative Certification for Band Artist", ({
    given,
    when,
    then
  }) => {
    let representativeCertificationWrapper: ShallowWrapper;
    let instance: RepresentativeCertification;
    let pageTitle: ShallowWrapper

    given("I am a User attempting to Register as a Band/Artist", () => {
      representativeCertificationWrapper = shallow(
        <RepresentativeCertification {...screenProps} />
      );
    });

    when("I navigate to the Representative Certification Screen", () => {
      instance = representativeCertificationWrapper.instance() as RepresentativeCertification;
      instance.setState({
        userRole: 'band'
      })
      pageTitle = representativeCertificationWrapper.findWhere(node => node.prop("testID") === "pageTitle")
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "Background").simulate("press");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "backButton").simulate("press");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputTitle").simulate("changeText", "");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputFullName").simulate("changeText", "");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputBandName").simulate("changeText", "");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnAuthorizePage").simulate("press");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnCreateAccount").simulate("press");
    });

    then("Press Event is performed", () => {
      expect(pageTitle).toBeDefined()
    });

    when("Title is contains characters and numbers", () => {
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputTitle").simulate("changeText", "title1#");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnAuthorizePage").simulate("press");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnCreateAccount").simulate("press");
    })

    then("Press Event is performed", () => {
      expect(pageTitle).toBeDefined()
    });

    when("Form is filled", () => {
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputTitle").simulate("changeText", "title");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputFullName").simulate("changeText", "full name");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputBandName").simulate("changeText", "band");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnAuthorizePage").simulate("press");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnCreateAccount").simulate("press");
    })

    then("Press Event is performed", () => {
      expect(pageTitle).toBeDefined()
    });

  });

  test("Representative Certification for Band Artist in iOS", ({ given, when, then }) => {
    let representativeCertificationWrapper: ShallowWrapper;
    let instance: RepresentativeCertification;
    let pageTitle: ShallowWrapper

    given("User attempting to RepresentativeCertification", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      representativeCertificationWrapper = shallow(
        <RepresentativeCertification {...screenProps} />
      );
    });

    when("I navigate to the Representative Certification Screen", () => {
      instance = representativeCertificationWrapper.instance() as RepresentativeCertification;
      pageTitle = representativeCertificationWrapper.findWhere(node => node.prop("testID") === "pageTitle")
    });

    then("Press Event is performed", () => {
      expect(pageTitle).toBeDefined()
    });

  });

  test("Representative Certification for Venue on Android device", ({given, when , then }) => {
    let representativeCertificationWrapper: ShallowWrapper;
    let instance: RepresentativeCertification;
    let pageTitle: ShallowWrapper

    given("User attempting to RepresentativeCertification on Android device", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      representativeCertificationWrapper = shallow(
        <RepresentativeCertification {...screenProps} />
      );
    });
    when("I navigate to the Representative Certification Screen with a Venue account", () => {
      
      instance = representativeCertificationWrapper.instance() as RepresentativeCertification;
     
    });

    
    when('I try to submit values with empty value' ,() => {
      instance = representativeCertificationWrapper.instance() as RepresentativeCertification;
      jest.spyOn(instance, 'checkValidation')
      instance.setState({
        userRole: 'venue',
        placeName:''

      })
     
    })
    then("I expect checkValidation to be called", () => {
      expect(instance.checkValidation()).toBe(false)
    });
  })

  test("User Verification Account to claim page", ({given, when , then }) => {
    let representativeCertificationWrapper: ShallowWrapper;
    let instance: RepresentativeCertification;
    let pageTitle: ShallowWrapper

    given("I am a User attempting to Register as a Band/Artist", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      representativeCertificationWrapper = shallow(
        <RepresentativeCertification {...screenProps} />
      );
    });
    when("I navigate to the Representative Certification Screen and fill all the fields", () => {
      
      instance = representativeCertificationWrapper.instance() as RepresentativeCertification;
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputTitle").simulate("changeText", "title");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputFullName").simulate("changeText", "full name");
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "txtInputBandName").simulate("changeText", "band");
      instance.setState({
        userRole: 'band'
      })
      jest.spyOn(instance, 'handleVerifyMyAccount')
      jest.spyOn(instance, 'checkValidation')
      jest.spyOn(instance, 'handleNavigation')
      jest.spyOn(runEngine, 'sendMessage')
    });

    when('I press the verification account button' ,() => {
      representativeCertificationWrapper.findWhere(node => node.prop("testID") === "btnCreateAccount").simulate("press");
      expect(instance.handleVerifyMyAccount).toBeCalled()
      expect(instance.checkValidation()).toBe(true)
     
    })
    then("I expect to call the API", () => {
      const respData = {
        data: {
          attributes: {
            page_used: true
          }
        }
      }
      mockAPISuccessCall(instance,'postVerifyMyAccountID', respData)
      expect(runEngine.sendMessage).toBeCalled();
    });
    then("I expect to be redirected to the claim Page", () => {
      expect(instance.handleNavigation).toBeCalledWith(true)
    });

  })
})
