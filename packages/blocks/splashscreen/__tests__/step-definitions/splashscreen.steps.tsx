import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import Splashscreen from "../../src/Splashscreen";
const navigation = require("react-navigation");

jest.useFakeTimers();

const screenProps = {
  navigation: navigation,
  id: "Splashscreen"
};

const feature = loadFeature(
  "./__tests__/features/splashscreen-scenario.feature"
);

let component: any;

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test("User navigates to Splashscreen", ({ given, when, then }) => {
    let splashscreen: ShallowWrapper;
    let instance: Splashscreen;

    given("I am a User loading Splashscreen", () => {
      splashscreen = shallow(<Splashscreen {...screenProps} />);
      splashscreen.setState({ timeout: 2000, spin: 0 });
    });

    when("I navigate to the Splashscreen", () => {
      instance = splashscreen.instance() as Splashscreen;
      instance.receive("", "" as any);
      jest.advanceTimersByTime(instance.state.timeout);
    });

    then("Splashscreen will load with out errors", () => {
      expect(Splashscreen).toBeTruthy();
    });

    then("I can leave the screen with out errors", async () => {
      await instance.componentWillUnmount();
      expect(Splashscreen).toBeTruthy();
    });
  });
});
