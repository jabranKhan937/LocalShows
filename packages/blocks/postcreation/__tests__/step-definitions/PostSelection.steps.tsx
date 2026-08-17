import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
export const configJSON = require("../../config.json");
import React from "react";
import PostSelection from "../../src/PostSelection";

jest.useFakeTimers()

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
  },
  id: 'PostSelection'
}

const feature = loadFeature("./__tests__/features/PostSelection-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android')
  })

  test("User navigates to PostSelection", ({ given, when, then }) => {
    let postSelectionWrapper: ShallowWrapper;
    let instance: PostSelection;

    given("I am a User loading PostSelection", () => {
      postSelectionWrapper = shallow(<PostSelection {...screenProps} />);
    });

    when("I navigate to the PostSelection", () => {
      instance = postSelectionWrapper.instance() as PostSelection;
    });

    then("User interacts with UI", () => {
      postSelectionWrapper.findWhere(node => node.prop("testID") === "showBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "pictureBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "continueBtn").simulate("press")
      expect(instance.state.optionSelected).toBe("picture")
    });
  });

});