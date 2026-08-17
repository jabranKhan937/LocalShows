import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import TermsConditions from "../../src/TermsConditions";
import { ITermsConds } from "../../src/TermsConditionsController";
import { getStorageData, removeStorageData, setStorageData } from "../../../../framework/src/Utilities";

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
  set: jest.fn().mockImplementation(() => Promise.resolve([])),
  remove:jest.fn(),
}));

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
const screenProps = {
  navigation: {
    goBack: jest.fn(),
    openDrawer:jest.fn()
  },
  id: "TermsConditions",
};

const feature = loadFeature(
  "./__tests__/features/TermsConditions-scenario.feature"
);


const mockFailureResponse = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

const testTermsCondsList: ITermsConds[] = [
  {
    id: "1",
    description: "description",
    is_accepted: false,
    created_at: "2099-04-12T23:40:46.740Z",
  },
  {
    id: "2",
    description: "description2",
    is_accepted: true,
    created_at: "2099-04-12T23:40:48.740Z",
  },
];

const accountGroups = [
  {
    attributes: {
      accounts: [
        {
          id: 1,
          role_id: 1,
        },
      ],
    },
  },
];

const mockErrorResponse = {
  "errors": []
}

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.doMock("react-native", () => ({ Platform: { OS: "ios" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "ios");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("User navigates to TermsConditions", ({ given, when, then }) => {
    let termsConditionsWrapper: ShallowWrapper;
    let instance: TermsConditions;

    given("I am a User loading TermsConditions", () => {
      termsConditionsWrapper = shallow(<TermsConditions {...screenProps} />);
    });

    when("I navigate to TermsConditions", async () => {
      instance = termsConditionsWrapper.instance() as TermsConditions;
      jest.spyOn(instance, "send");
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.NavigationTermAndConditionMessage),
        {
          isTermsAndConditionsAccepted: true,
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);
      const msgToken = new Message(getName(MessageEnum.SessionResponseMessage));
      msgToken.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      msgToken.addData(
        getName(MessageEnum.SessionResponseData),
        JSON.stringify({ meta: { id: 1 } })
      );
      runEngine.sendMessage("Unit Test", msgToken);

      mockAPISuccessCall(instance, "getTermsCondsListCallId", {
        data: testTermsCondsList,
        meta: {
          message: "termsconds data",
        },
      })
      mockAPISuccessCall(instance, "getTermsCondsListCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getTermsCondsListCallId", mockErrorResponse)
      
      mockAPISuccessCall(instance, "getAccountGroupsCallId", {
        data: accountGroups,
        meta: {
          message: "accountGroups data",
        },
      })
      mockAPISuccessCall(instance, "getAccountGroupsCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getAccountGroupsCallId", mockErrorResponse)
      
      mockAPISuccessCall(instance, "getTAndCAPICallID", {
        "data": [
          {
            "id": 1,
            "description": "<p>dggldmlgldgldlfdfldmfl</p>",
            "created_at": "2023-11-14T09:04:29.237Z"
          }
        ]
      })
      mockAPISuccessCall(instance, "getTAndCAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getTAndCAPICallID", mockFailureResponse)
      
      mockAPISuccessCall(instance, "getTermsCondsCallId", {
        is_accepted: true,
      })
      mockAPISuccessCall(instance, "getTermsCondsCallId", mockFailureResponse)
      mockAPIFailureCall(instance, "getTermsCondsCallId", mockFailureResponse)
      
      mockAPISuccessCall(instance, "setAcceptanceOfTermsCondsId", {})
      mockAPISuccessCall(instance, "setAcceptanceOfTermsCondsId", mockFailureResponse)
      mockAPIFailureCall(instance, "setAcceptanceOfTermsCondsId", mockFailureResponse)

      mockAPISuccessCall(instance, "acceptTAndCAPICallID", {})
      mockAPISuccessCall(instance, "acceptTAndCAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "acceptTAndCAPICallID", mockFailureResponse)
      
      instance.navigateToTermsCondsDetail('test')
      instance.navigateToTermsCondsEdit()
      instance.handleCheckBoxChange(true)
      instance.renderTncContent()
      instance.setState({isTermsCondsAccepted:'false'})
      instance.handleAcceptTAndCAPIResponse({message:'You have accepted the latest terms and conditions'})
      const hamburgerButton = termsConditionsWrapper.findWhere((node) => node.prop("testID") === "hamburgerButton")
      hamburgerButton.simulate("press")
      let buttonComponent = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "btnCancel"
      );
      buttonComponent.simulate("press");
      instance.handleAcceptTAndCAPIResponse({message:'test'})
      instance.handleAccept()
      let buttonComponent2 = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "btnAcceptTerms"
      );
      buttonComponent2.simulate("press");
    });

    then("TermsConditions will load with out errors", () => {
      let testLabel = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
      expect(testLabel).toBeDefined();
    });

    then("I can press navigationBackButton", () => {
      let buttonComponent = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      );
      buttonComponent.simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    then("I can change terms and conditions acceptance value", () => {
      let buttonComponent = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "btnAcceptTerms"
      );
      buttonComponent.simulate("press");
    });

    then("I can press btnCancel", () => {
      let buttonComponent = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "btnCancel"
      );
      buttonComponent.simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    then("I can press btnAgree", () => {
      let buttonComponent = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "btnAgree"
      );
      buttonComponent.simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("user click on hamburger icon" , ()=>{
      const hamburgerButton = termsConditionsWrapper.findWhere((node) => node.prop("testID") === "hamburgerButton")
      hamburgerButton.simulate("press")
    })

  });
});
