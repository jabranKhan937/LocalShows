import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import SentRequest from "../../src/SentRequest.web";

const navigate = jest.fn();
const screenProps = {
  navigation: { navigate },
  id: "SentRequest",
};

const feature = loadFeature(
  "./__tests__/features/SentRequest-scenario.web.feature"
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

const mockGroup = [
  {
    id: "1",
    type: "group",
    attributes: {
      name: "group-1",
    },
  },
];

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("User navigates to SentRequest", ({ given, when, then }) => {
    let requestManagement: ShallowWrapper;
    let instance: SentRequest;

    given("I am a User loading SentRequest", () => {
      requestManagement = shallow(<SentRequest {...screenProps} />);
    });

    when("I navigate to the SentRequest", () => {
      instance = requestManagement.instance() as SentRequest;
    });

    then("SentRequest will load with out errors", () => {
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

    when("Network responed for get groups api", () => {
      const mockResponse = {
        data: mockGroup,
      };

      const groupsApiMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      groupsApiMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        groupsApiMessage.messageId
      );

      groupsApiMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.getGroupsCallId = groupsApiMessage.messageId;
      runEngine.sendMessage("Unit Test", groupsApiMessage);
    });

    then("Get sent request api should be called", () => {
      expect(runEngine.sendMessage).toBeCalledWith(
        "RestAPIRequestMessage",
        expect.objectContaining({
          id: "RestAPIRequestMessage",
          initializeFromObject: expect.any(Function),
          messageId: expect.any(String),
          properties: {
            RestAPIRequestMethodMessage: "GET",
            RestAPIResponceEndPointMessage: "request_management/requests/sent",
            RestAPIRequestHeaderMessage: expect.any(String),
          },
        })
      );
    });

    when("Network responed for sent request api", () => {
      const mockResponse = {
        data: mockRequestData,
      };

      const sentReqApiMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      sentReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        sentReqApiMessage.messageId
      );

      sentReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.getAllSentRequestCallId = sentReqApiMessage.messageId;
      runEngine.sendMessage("Unit Test", sentReqApiMessage);
    });

    then("Sent request state should ve update", () => {
      expect(instance.state.sentRequests.length).toBe(3);
    });

    when("Click delete button to delete request", () => {
      const deleteBtn = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "deleteBtn-2"
      );
      deleteBtn.simulate("click");
    });

    then("Delete request api should be call", () => {
      expect(runEngine.sendMessage).toBeCalledWith(
        "RestAPIRequestMessage",
        expect.objectContaining({
          id: "RestAPIRequestMessage",
          initializeFromObject: expect.any(Function),
          messageId: expect.any(String),
          properties: {
            RestAPIRequestMethodMessage: "DELETE",
            RestAPIResponceEndPointMessage: "request_management/requests/2",
            RestAPIRequestHeaderMessage: expect.any(String),
          },
        })
      );
    });

    when("User click on update button from the table", () => {
      const updateBtn = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "updateBtn-2"
      );
      updateBtn.simulate("click");
    });

    then("User update request text in the text field", () => {
      const requesTextField = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "requestTextField"
      );
      requesTextField.simulate("change", {
        target: { value: "accept my request" },
      });
      expect(requesTextField.prop("value")).toBe("accept my request");
    });

    when("User click sent button to update request review text", () => {
      const sendRequestSubmitBtn = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "sendRequestSubmitBtn"
      );
      sendRequestSubmitBtn.simulate("click");
    });

    then(
      "User click on receive request to navigate to receive request page",
      () => {
        const receiveRequestBtn = requestManagement.findWhere(
          (node) => node.prop("data-testid") === "receiveRequestBtn"
        );
        receiveRequestBtn.simulate("click");
      }
    );

    then("Navigate function should be call", () => {
      const navigationRaiseMessage = {
        id: "NavigationPayLoadMessage",
        initializeFromObject: expect.any(Function),
        messageId: expect.any(String),
        properties: {},
      };
      const runEngineResult = {
        id: expect.any(String),
        initializeFromObject: expect.any(Function),
        messageId: expect.any(String),
        properties: {
          NavigationPropsMessage: {
            id: "SentRequest",
            navigation: {
              navigate: expect.any(Function),
            },
          },
          NavigationRaiseMessage: navigationRaiseMessage,
          NavigationTargetMessage: "RequestManagement",
        },
      };
      expect(runEngine.sendMessage).toBeCalledWith(
        expect.any(String),
        runEngineResult
      );
    });

    when("User enter request id in input field to filter", () => {
      const filterKeyInput = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "filterKeyInput"
      );
      filterKeyInput.simulate("change", { target: { value: "2" }});
    });

    then("Input field value should be update", () => {
      const filterKeyInput = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "filterKeyInput"
      );
      expect(filterKeyInput.prop('value')).toBe("2");
    });
    
    when("User click on view button to view request", () => {
      const viewBtn = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "viewBtn-2"
      );
      viewBtn.simulate("click");
    });

    then("View request modal should be opened", () => {
      const viewRequestId = requestManagement.findWhere(
        (node) => node.prop("data-testid") === "viewRequestId"
      );
      expect(viewRequestId).toBeDefined();
      expect(viewRequestId.prop("children").join("")).toBe("Request ID: 2");
    });
    
  });
});
