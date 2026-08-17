import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import Savesearch from "../../src/Savesearch.web";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "Savesearch",
};

const feature = loadFeature(
  "./__tests__/features/savesearch-scenario.web.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to savesearch", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Savesearch;

    given("I am a User loading savesearch", () => {
      exampleBlockA = shallow(<Savesearch {...screenProps} />);
    });

    when("I navigate to the savesearch", () => {
      instance = exampleBlockA.instance() as Savesearch;
    });

    then("savesearch will load with out errors", () => {
      expect(instance.state.showSearch).toBe(false);
    });
  });
});
