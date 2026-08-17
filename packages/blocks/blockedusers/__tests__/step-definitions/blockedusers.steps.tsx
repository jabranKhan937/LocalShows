import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Blockedusers from "../../src/Blockedusers";
import AddBlockeduser from "../../src/AddBlockeduser";

const screenProps = {
  navigation: {},
  id: "Blockedusers",
};

const feature = loadFeature(
  "./__tests__/features/blockedusers-scenario.feature"
);


defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to Blockedusers", ({ given, when, then }) => {
    let BlockedusersWrapper: ShallowWrapper;
    let instance: Blockedusers;

    given("I am a User loading Blockedusers", () => {
      BlockedusersWrapper = shallow(<Blockedusers {...screenProps} />);
      expect(BlockedusersWrapper).toBeTruthy();
      // expect(BlockedusersWrapper).toMatchSnapshot()

      instance = BlockedusersWrapper.instance() as Blockedusers;

      const getBlockeduserAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getBlockeduserAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getBlockeduserAPI.messageId
      );
      getBlockeduserAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: [
            {
              id: 10,
              title: "Blockeduser 4",
              content:
                "<html><head>This is a head</head><body>Hello. I am a body</body></html>",
              created_at: "2020-10-13T09:37:02.001Z",
              updated_at: "2020-10-13T09:37:02.001Z",
              attributes: {
                account: {
                  id: 10,
                  first_name: "Testy",
                  last_name: "McGee",
                },
              },
            },
          ],
        }
      );
      instance.BlockeduserApiCallId = getBlockeduserAPI.messageId;
      runEngine.sendMessage("Unit Test", getBlockeduserAPI);
    });

    when("I navigate to the Blockedusers", () => {
      instance = BlockedusersWrapper.instance() as Blockedusers;
    });

    then("Blockedusers will load with out errors", () => {
      expect(BlockedusersWrapper).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(BlockedusersWrapper).toBeTruthy();
    });
  });

  test("User can view any Blockeduser", ({ given, when, then }) => {
    let BlockedusersWrapper: ShallowWrapper;
    let instance: Blockedusers;

    given("I am a User attempting to view a Blockeduser", () => {
      BlockedusersWrapper = shallow(<Blockedusers {...screenProps} />);
      expect(BlockedusersWrapper).toBeTruthy();
    });

    when("I view a Blockeduser", () => {
      instance = BlockedusersWrapper.instance() as Blockedusers;
      instance.setState({
        activeId: 1,
        activeFirstName: "Joen",
        activeLastName: "Doe",
        activeCreatedAt: "2020-10-13T09:37:02.001Z",
        activeUpdatedAt: "2020-10-13T09:37:02.001Z",
        isVisible: !instance.state.isVisible,
      });
    });

    then("I can view Blockeduser will load with out errors", () => {
      expect(instance.state.isVisible).toBe(true);
    });
  });

  test("User can delete any Blockeduser", ({ given, when, then }) => {
    let BlockedusersWrapper: ShallowWrapper;
    let instance: Blockedusers;

    given("I am a User attempting to delete a Blockeduser", () => {
      BlockedusersWrapper = shallow(<Blockedusers {...screenProps} />);
      expect(BlockedusersWrapper).toBeTruthy();
    });

    when("I delete a Blockeduser", () => {
      instance = BlockedusersWrapper.instance() as Blockedusers;
      instance.deleteBlockeduserApiCall(
        configJSON.blockedUsersListAPIEndPoint + `/1`
      );
    });

    then("I can delete Blockeduser will load with out errors", () => {
      expect(
        instance.deleteBlockeduserApiCall(
          configJSON.BlockeduserApiEndPoint + `/1`
        )
      ).toBe(true);
    });

    then("Rest Api will return success response", () => {
      const deleteSucessRestAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      deleteSucessRestAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        deleteSucessRestAPI.messageId
      );
      deleteSucessRestAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );
      instance.deleteBlockeduserApiCallId = deleteSucessRestAPI.messageId;
      runEngine.sendMessage("Unit Test", deleteSucessRestAPI);
    });
  });

  test("Empty userid", ({ given, when, then }) => {
    let AddBlockedusersWrapper: ShallowWrapper;
    let instance: AddBlockeduser;

    given("I am a user attempting to add a Blockeduser", () => {
      AddBlockedusersWrapper = shallow(<AddBlockeduser {...screenProps} />);
      instance = AddBlockedusersWrapper.instance() as AddBlockeduser;
      expect(AddBlockedusersWrapper).toBeTruthy();
    });

    when("I am adding a Blockeduser with empty userid", () => {
      instance = AddBlockedusersWrapper.instance() as AddBlockeduser;
      instance.setState({ userToBlock: "" });
    });

    then("add Blockeduser should fail", async () => {
      expect(await instance.addBlockeduserCall()).toBe(false);
    });
  });
});
