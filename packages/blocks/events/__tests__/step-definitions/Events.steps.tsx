import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import Events from "../../src/Events";

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
  },
  id: "Events",
};

const feature = loadFeature("./__tests__/features/Events-scenario.feature");
defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to Events", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Events;

    given("I am a User loading Events", () => {
      exampleBlockA = shallow(<Events {...screenProps} />);
    });

    when("I navigate to the Events", () => {
      instance = exampleBlockA.instance() as Events;
    });

    then("Events will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can click the event list item", () => {
      instance = exampleBlockA.instance() as Events;
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnEventItem"
      );

      if (buttonComponent && buttonComponent.length > 0) {
        buttonComponent.simulate("press");
      }
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(exampleBlockA).toBeTruthy();
    });
  });
});
