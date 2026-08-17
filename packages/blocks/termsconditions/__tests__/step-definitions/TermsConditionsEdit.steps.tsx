import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import TermsConditionsEdit from "../../src/TermsConditionsEdit";
const navigation = require("react-navigation");

const screenProps = {
  navigation,
  id: "TermsConditionsEdit",
};

const feature = loadFeature("./__tests__/features/TermsConditionsEdit-scenario.feature");

const termsCondsData = {
  termsConds: 'description',
  termsCondsId: '"'
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
    let instance: TermsConditionsEdit;

    given("I am a User loading TermsConditions", () => {
      termsConditionsWrapper = shallow(<TermsConditionsEdit {...screenProps} />);
    });

    when("I navigate to TermsConditions", () => {
      instance = termsConditionsWrapper.instance() as TermsConditionsEdit;
      jest.spyOn(instance, "send");
      const msgNavigationPayload = new Message(getName(MessageEnum.NavigationPayLoadMessage));
      msgNavigationPayload.addData(getName(MessageEnum.SessionResponseData), termsCondsData);
      runEngine.sendMessage("Unit Test", msgNavigationPayload);

      const msgToken = new Message(getName(MessageEnum.SessionResponseMessage));
      msgToken.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", msgToken);

      const msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: "success",
        }
      );
      instance.updateTermsCondsCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    then("I can change termsCondsInput value", () => {
      const description = 'terms and condition description';
      const termsCondsInput = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "termsCondsInput"
      );
      termsCondsInput.simulate('changeText', description);
      expect(instance.state.termsConds).toEqual(description);
      expect(termsConditionsWrapper).toBeTruthy();
    });

    then("I can press btnSendTermsConds", () => {
      const btnSendTermsConds = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "btnSendTermsConds"
      );
      btnSendTermsConds.simulate('press');
      expect(termsConditionsWrapper).toBeTruthy();
    });

    then("TermsConditions will load", () => {
      expect(termsConditionsWrapper).toBeTruthy();
    });

    then("I can leave the screen", () => {
      instance.componentWillUnmount();
      expect(termsConditionsWrapper).toBeTruthy();
    });
  });
});
