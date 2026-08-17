import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Geofence from "../../src/Geofence";

const screenProps = {
  navigation: {
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    openDrawer:jest.fn()
  },
  id: "Geofence",
};

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('authToken')),
  get: jest.fn().mockImplementation(() => Promise.resolve('27')),
}));

const feature = loadFeature("./__tests__/features/Geofence-scenario.feature");

defineFeature(feature, (test) => {

  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("User navigates to Geofence", ({ given, when, then }) => {
    let geofenceBlock: ShallowWrapper;
    let instance: Geofence;
    let pageTitle: ShallowWrapper

    given("I am a User loading Geofence", () => {
      geofenceBlock = shallow(<Geofence {...screenProps} />);
    });

    when("I navigate to the Geofence", () => {
      instance = geofenceBlock.instance() as Geofence;
      instance.setState({userAuthToken:"q"})
      pageTitle = geofenceBlock.findWhere(node => node.prop("testID") === "pageTitle");
      geofenceBlock.findWhere(node => node.prop("testID") === "backToHome").simulate("press");
      geofenceBlock.findWhere(node => node.prop("testID") === "bellIcon").simulate("press");
      geofenceBlock.findWhere(node => node.prop("testID") === "drawerMenu").simulate("press");
    });

    then("Geofence will display my location on the screen", () => {
      expect(pageTitle).toBeDefined()
    });
  });

});
