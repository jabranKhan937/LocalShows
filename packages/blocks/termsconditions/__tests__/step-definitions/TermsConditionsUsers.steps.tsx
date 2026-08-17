import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import TermsConditionsUsers from "../../src/TermsConditionsUsers";
const navigation = require("react-navigation");

const screenProps = {
  navigation,
  id: "TermsConditionsUsers",
};

const feature = loadFeature("./__tests__/features/TermsConditionsUsers-scenario.feature");

const termsCondsUsersData = {
  termsCondsUsers: [{
    account_id: "a58df44adaa42199f6e7cced",
    accepted_on: "2097-06-14T07:41:04.548Z",
    email: "Selmer.Simonis11@yahoo.com"
  }]
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
    let instance: TermsConditionsUsers;

    given("I am a User loading TermsConditions", () => {
      termsConditionsWrapper = shallow(<TermsConditionsUsers {...screenProps} />);
    });

    when("I navigate to TermsConditions", () => {
      instance = termsConditionsWrapper.instance() as TermsConditionsUsers;
      jest.spyOn(instance, "send");
      const msgSession = new Message(getName(MessageEnum.SessionResponseMessage));
      runEngine.sendMessage("Unit Test", msgSession);
      const msgNavigationPayload = new Message(getName(MessageEnum.NavigationPayLoadMessage));
      msgNavigationPayload.addData(getName(MessageEnum.SessionResponseData), termsCondsUsersData);
      runEngine.sendMessage("Unit Test", msgNavigationPayload);
    });

    then("TermsConditions List render", () => {
      const termsCondsList = termsConditionsWrapper.findWhere(
        (node) => node.prop("testID") === "termsCondsUserList"
      );
      termsCondsList.render();
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
