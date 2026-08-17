import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import React from "react";
import RequestManagement from "../../src/RequestManagement";

const navigate = jest.fn();
const goBack = jest.fn();

const screenProps = {
  navigation: {
    navigate,
    goBack,
  },
  id: "RequestManagement",
};

const feature = loadFeature(
  "./__tests__/features/RequestManagement-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("User navigates to RequestManagement", ({ given, when, then }) => {
    let requestManagement: ShallowWrapper;
    let testLabel: ShallowWrapper;
    let instance: RequestManagement;

    given("I am a User loading RequestManagement", () => {
      requestManagement = shallow(<RequestManagement {...screenProps} />);
      instance = requestManagement.instance() as RequestManagement;
    });

    when("I navigate to the RequestManagement", () => {
      testLabel = requestManagement.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
      requestManagement
        .findWhere((node) => node.prop("testID") === "backButton")
        .simulate("press");
      requestManagement
        .findWhere((node) => node.prop("testID") === "txtInputCategory")
        .simulate("changeText", "Abc");
      requestManagement
        .findWhere((node) => node.prop("testID") === "addNewCategoryTxt")
        .simulate("press");
      const newCategoriesList = requestManagement.findWhere(
        (node) => node.prop("testID") === "newCategoriesList"
      );
      requestManagement
        .findWhere((node) => node.prop("testID") === "btnSend")
        .simulate("press");
      requestManagement
        .findWhere((node) => node.prop("testID") === "btnCancel")
        .simulate("press");
      requestManagement
        .findWhere((node) => node.prop("testID") === "btnSend")
        .simulate("press");
      requestManagement
        .findWhere((node) => node.prop("testID") === "btnConfirm")
        .simulate("press");
    });

    then("RequestManagement will load with out errors", () => {
      expect(testLabel).toBeDefined();
    });
  });

  test("User navigates to RequestManagement with one category", ({ given, when, then }) => {
    let requestManagement: ShallowWrapper;
    let testLabel: ShallowWrapper;
    let instance: RequestManagement;

    given("I am a User loading RequestManagement", () => {
      requestManagement = shallow(<RequestManagement {...screenProps} />);
      instance = requestManagement.instance() as RequestManagement;
    });

    when("I navigate to the RequestManagement", () => {
      testLabel = requestManagement.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
      requestManagement
        .findWhere((node) => node.prop("testID") === "txtInputCategory")
        .simulate("changeText", "Abc");
      requestManagement
        .findWhere((node) => node.prop("testID") === "btnSend")
        .simulate("press");
      requestManagement
        .findWhere((node) => node.prop("testID") === "btnConfirm")
        .simulate("press");
    });

    then("RequestManagement will load with out errors", () => {
      expect(testLabel).toBeDefined();
    });
  });
});
