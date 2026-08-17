import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import Rolesandpermissions from "../../src/Rolesandpermissions";
import BandIcon from "../../src/BandIcon";
import FanIcon from "../../src/FanIcon";
import VenueIcon from "../../src/VenueIcon";

const screenProps = {
  navigation: {
    navigate: jest.fn(),
  },
  id: "Rolesandpermissions",
};

const feature = loadFeature(
  "./__tests__/features/rolesandpermissions-scenario.feature"
);

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve("band")),
  set: jest.fn().mockImplementation(() => Promise.resolve("userRole")),
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to rolesandpermissions", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let roleButtonWrapper: ShallowWrapper;
    let instance: Rolesandpermissions;

    given("I am a User loading rolesandpermissions", () => {
      exampleBlockA = shallow(<Rolesandpermissions {...screenProps} />);
    });

    when("I navigate to the rolesandpermissions", () => {
      instance = exampleBlockA.instance() as Rolesandpermissions;
    });

    then("rolesandpermissions will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then("controller functions work properly", () => {
      instance.txtInputWebProps.onChangeText("");
      instance.btnShowHideProps.onPress();
      instance.btnExampleProps.onPress();
      instance.doButtonPressed();
      instance.setEnableField();
    });

    then("Icons work properly", () => {
      shallow(<FanIcon color="#FFFFFF" />);
      shallow(<VenueIcon color="#FFFFFF" />);
      shallow(<BandIcon color="#FFFFFF" />);
    });

    then("I can select the buttons with with out errors", () => {
      const roleButtonProps = {
        testID: "btnRole",
        role: "Fan",
        fieldName: 'fan',
        icon: <></>,
        onPress: () => instance.setRole("fan"),
      };

      roleButtonWrapper = shallow(<instance.RoleButton {...roleButtonProps} />);

      let buttonComponent = roleButtonWrapper.findWhere(
        (node) => node.prop("testID") === "btnRole"
      );
      buttonComponent.simulate("press");

      buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnFan"
      );
      buttonComponent.simulate("press");

      buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnBand"
      );
      buttonComponent.simulate("press");

      expect(instance.state.selectedRole).toBe("band");
    });

    then("I can navigate to login", () => {
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("testID") === "btnGoToLogin"
      );
      buttonComponent.simulate("press");

      expect(exampleBlockA).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(exampleBlockA).toBeTruthy();
    });
  });
});
