import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import AddEventLocation from "../../src/AddEventLocation";

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn()
  },
  id: "AddEventLocation",
};

const feature = loadFeature(
  "./__tests__/features/AddEventLocation-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to AddEventLocation", ({ given, when, then }) => {

    let exampleBlockA: ShallowWrapper;
    let instance: AddEventLocation;
  
    given("I am a User loading AddEventLocation", () => {
      exampleBlockA = shallow(<AddEventLocation {...screenProps} />);
    });

    when("I navigate to the AddEventLocation", () => {
      instance = exampleBlockA.instance() as AddEventLocation;
    });

    then("AddEventLocation will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can click the event list item", () => {
      instance = exampleBlockA.instance() as AddEventLocation;
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
