import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import React from "react";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { runEngine } from '../../../../framework/src/RunEngine'

import DisputeForm from "../../src/DisputeForm";
import StorageProvider from '../../../../framework/src/StorageProvider'

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
  "data": {
    "id": "15",
    "type": "page",
    "attributes": {
      "id": 15,
      "page_type": "Band",
      "band_artist_name": "Asthaan",
      "city": "Akutan",
      "state": "Alaska",
      "country": "US",
      "verify_at": null
    }
  }
};

const mockErrorResponse = {
  "errors": []
}

const screenPropsWithParams = {
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
  id: "dispute-form-scenario"
};

const mockSuccessResponse = {
  "data": {
    "id": "3",
    "type": "dispute_form",
    "attributes": {
      "id": 3,
      "band_artists_name": "New Band",
      "country": "US",
      "state": "Alaska",
      "city": "Akutan",
      "verified": false
    }
  }
};

const feature = loadFeature(
  "./__tests__/features/dispute-form-scenario.feature"
);
jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
  set: jest.fn().mockImplementation(() => Promise.resolve('test')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([]))
}));

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
      OS: "android",
      select: jest.fn()
    }));
  });

  test("Dispute Form for Band Artist", ({ given, when, then }) => {
    let disputeForm: ShallowWrapper;
    let instance: DisputeForm;
    let disputeFormBackground: ShallowWrapper;

    given("I am a User attempting to Register as a Band/Artist", () => {
      disputeForm = shallow(<DisputeForm {...screenPropsWithParams} />);
    });

    when("I navigate to the Dispute Form Screen", async () => {
      instance = disputeForm.instance() as DisputeForm;
      StorageProvider.get.mockResolvedValue(JSON.stringify({
        bandName: "first_name",
        type: "Band",
        selectedState: "Alaska",
        selectedCity: "Akutan",
        claimId: "1",
        userRole: "band"
      }))
      await instance.componentDidMount()
      instance.handleNavigationPayload({bandName:'test',selectedState:"test",selectedCity:'test',claimId:'test',type:'Band',userRole:'Band'})
      instance.handleNavigationPayload(null)
     await instance.handleDisputeFormAPI()
     await instance.handleDisputeFormSuccess()
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          bandName: "test",
          type: "test",
          selectedState: "test",
          selectedCity: "test",
          claimId: "test",
          userRole: "test"
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      mockAPISuccessCall(instance, "getDisputeFormID", mockResponse)
      mockAPISuccessCall(instance, "getDisputeFormID", mockErrorResponse)
      mockAPIFailureCall(instance, "getDisputeFormID", mockErrorResponse)

      disputeFormBackground = disputeForm.findWhere(node => node.prop("testID") === "disputeFormBackground")
      disputeFormBackground.simulate("press");

      disputeForm
        .findWhere(node => node.prop("testID") === "backButton")
        .simulate("press");

      disputeForm
        .findWhere(node => node.prop("testID") === "modalClose")
        .simulate("press");

        disputeForm
        .findWhere(node => node.prop("testID") === "btnDisputeForm")
        .simulate("press");
      disputeForm
        .findWhere(node => node.prop("testID") === "btnAcceptVerification")
        .simulate("press");

      mockAPISuccessCall(instance, "disputeFormID", mockSuccessResponse)
      mockAPISuccessCall(instance, "disputeFormID", mockErrorResponse)
      mockAPIFailureCall(instance, "disputeFormID", mockErrorResponse)
      
    });

    then("User navigates back", () => {
      expect(disputeFormBackground).toBeDefined();
    });

  });

  test("Dispute Form for Venue", ({ given, when, then }) => {
    let disputeForm: ShallowWrapper;
    let instance: DisputeForm;
    let disputeFormBackground: ShallowWrapper;

    given("I am a User attempting to Register as a Venue", () => {
      disputeForm = shallow(<DisputeForm {...screenPropsWithParams} />);
    });

    when("I navigate to the Dispute Form Screen", () => {
      instance = disputeForm.instance() as DisputeForm;
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          bandName: "first_name",
          type: "Band",
          selectedState: "Alaska",
          selectedCity: "Akutan",
          claimId: "1",
          userRole: "venue"
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      const msgWithoutPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", msgWithoutPlayloadAPI);

      disputeFormBackground = disputeForm.findWhere(node => node.prop("testID") === "disputeFormBackground").simulate("press");
    });

    then("User navigates back", () => {
      expect(disputeFormBackground).toBeDefined();
    });

  });

});
