import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import TermsConditions from "../../src/TermsConditions.web";
import { ITermsConds } from "../../src/TermsConditionsController";
const navigation = require("react-navigation");

const screenProps = {
  navigation,
  id: "TermsConditions",
};

const feature = loadFeature("./__tests__/features/TermsConditions-scenario.web.feature");

const testTermsCondsList: ITermsConds[] = [
  { id: "1", description: "description", is_accepted: false, created_at: "2099-04-12T23:40:46.740Z" },
  { id: "2", description: "description2", is_accepted: true, created_at: "2099-04-12T23:40:48.740Z" },
];

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("User navigates to TermsConditions", ({ given, when, then }) => {
    let termsConditionsWrapper: ShallowWrapper;
    let instance: TermsConditions;
    let termsCondsList: ShallowWrapper<any, any>; 

    given("I am a User loading TermsConditions", () => {
      termsConditionsWrapper = shallow(<TermsConditions {...screenProps} />);
    });

    when("I navigate to TermsConditions", () => {
      instance = termsConditionsWrapper.instance() as TermsConditions;
      jest.spyOn(instance, "send");
      const msgToken = new Message(getName(MessageEnum.SessionResponseMessage));
      msgToken.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      msgToken.addData(getName(MessageEnum.SessionResponseData), JSON.stringify({meta:{id:1}}));
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
          data: testTermsCondsList,
          meta: {
            message: "termsconds data",
          },
        }
      );

      instance.getTermsCondsListCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    then('TermsConditions will load with out errors', () => {
      expect(termsConditionsWrapper).toBeTruthy();
    });

    when("TermsConditions List render", () => {
      instance.setState({termsConds: testTermsCondsList[0]})
      instance.getTermsConds("TOKEN");
      termsCondsList = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "termsCondsList"
      );
      termsCondsList.render();
    });

    then("I can press navigateDetailBtn", () => {
      termsCondsList.props().renderItem({item: testTermsCondsList[0]}).props.onPress();
      expect(termsConditionsWrapper).toBeTruthy();
    });

    then("I can press navigateEditBtn", () => {
      termsCondsList.props().ListFooterComponent.props.children.props.onPress();
      expect(termsConditionsWrapper).toBeTruthy();
    });

    then("I can change terms and conditions acceptance value", () => {
      instance.setState({ isAdminUser: false });
      const checkbox = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "checkbox"
      );
      checkbox.simulate("changeValue", true);
      expect(termsConditionsWrapper).toBeTruthy();
    });

    then("I can leave the screen", () => {
      instance.componentWillUnmount();
      expect(termsConditionsWrapper).toBeTruthy();
    });
  });
});
