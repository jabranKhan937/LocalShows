import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import RequestManagement from "../../src/RequestManagement.web";

const navigate = jest.fn();

const screenProps = {
  navigation: { navigate },
  id: "RequestManagement",
};

const feature = loadFeature(
  "./__tests__/features/RequestManagement-scenario.web.feature"
);

const mockRequestData = [
  {
    id: "1",
    type: "request",
    attributes: {
      sender_id: 1,
      status: "pending",
      rejection_reason: null,
      request_text: "accept my request",
      created_at: "",
      updated_at: "",
      reviewer_group_id: "1",
      sender_full_name: "test name",
    },
  },
  {
    id: "2",
    type: "request",
    attributes: {
      sender_id: 2,
      status: "rejected",
      rejection_reason: "not accepted",
      request_text: "accept my request",
      created_at: "",
      updated_at: "",
      reviewer_group_id: "2",
      sender_full_name: "test name",
    },
  },
  {
    id: "3",
    type: "request",
    attributes: {
      sender_id: 3,
      status: "accepted",
      rejection_reason: null,
      request_text: "accept my request",
      created_at: "",
      updated_at: "",
      reviewer_group_id: "3",
      sender_full_name: "test name",
    },
  },
];

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("User navigates to RequestManagement", ({ given, when, then }) => {
    let requestManagement: ShallowWrapper;
    let instance: RequestManagement;

    given("I am a User loading RequestManagement", () => {
      requestManagement = shallow(<RequestManagement {...screenProps} />);
    });

    when("I navigate to the RequestManagement", () => {
      instance = requestManagement.instance() as RequestManagement;
    });

    then("RequestManagement will load with out errors", () => {
      expect(requestManagement).toBeTruthy();
    });

    then("Get token function shoudl be called", () => {
      const receivedReqApiMessage = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );

      receivedReqApiMessage.addData(
        getName(MessageEnum.SessionResponseToken),
        "tokenstring"
      );

      runEngine.sendMessage("Unit Test", receivedReqApiMessage);
    });

    when("Network responed for received request api", () => {
      const mockResponse = {
        data: mockRequestData,
      };

      const receivedReqApiMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      receivedReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        receivedReqApiMessage.messageId
      );

      receivedReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.getAllReceivedRequestCallId = receivedReqApiMessage.messageId;
      runEngine.sendMessage("Unit Test", receivedReqApiMessage);
    });

    then("ReceivedRequests state should be update", () => {
      expect(instance.state.receivedRequests.length).toBe(0);
    });
  });
});
