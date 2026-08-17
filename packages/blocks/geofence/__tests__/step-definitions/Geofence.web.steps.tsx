import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Geofence from "../../src/Geofence.web";
import Radar from "radar-sdk-js";
import { configJSON } from "../../src/GeofenceController.web";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "Geofence",
};

const feature = loadFeature(
  "./__tests__/features/Geofence-scenario.web.feature"
);

jest.mock("radar-sdk-js", () => {
  return {
    setUserId: jest.fn(),
    initialize: jest.fn(),
    trackOnce: (coordinates: object, callback: Function) => {
      callback(null, { mockLocation: { latitude: 1 } });
    },
  };
});

defineFeature(feature, (test) => {
  const waitForPromises = () => new Promise(setImmediate);
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to Geofence", ({ given, when, then }) => {
    let geofenceBlock: ShallowWrapper;
    let instance: Geofence;

    given("I am a User loading Geofence", () => {
      Radar.getLocation = (callback: Function) => {
        callback(null, { mockLocation: { latitude: 33.33 } });
      };

      geofenceBlock = shallow(<Geofence {...screenProps} />);
    });

    when("I navigate to the Geofence", () => {
      instance = geofenceBlock.instance() as Geofence;
    });

    then("Geofence will display my location on the screen", async () => {
      await waitForPromises();
      const clientLocationTextElement = geofenceBlock.findWhere(
        (node) => node.prop("data-test-id") === "location"
      );

      const locationStringOnTheScreen = clientLocationTextElement
        .render()
        .text();

      expect(locationStringOnTheScreen.indexOf("33.33") > 0).toEqual(true);
    });
  });

  test("User navigates to Geofence with api errors", ({ given, when, then }) => {
    let geofenceBlock: ShallowWrapper;
    let instance: Geofence;
    const apiErrorText = "Api says something went wrong!";

    given("I am a User loading Geofence", () => {
      Radar.getLocation = (callback: Function) => {
        callback(apiErrorText, null);
      };

      geofenceBlock = shallow(<Geofence {...screenProps} />);
    });

    when("I navigate to the Geofence", () => {
      instance = geofenceBlock.instance() as Geofence;
    });

    then("Geofence will display error instead of my location", async () => {
      await waitForPromises();
      const clientLocationTextElement = geofenceBlock.findWhere(
        (node) => node.prop("data-test-id") === "location"
      );

      const locationStringOnTheScreen = clientLocationTextElement
        .render()
        .text();

      expect(locationStringOnTheScreen).toEqual(apiErrorText);
    });
  });
});
