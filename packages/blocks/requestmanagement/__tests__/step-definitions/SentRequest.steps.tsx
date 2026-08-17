import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import SentRequest from "../../src/SentRequest";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "SentRequest",
};

const feature = loadFeature(
  "./__tests__/features/SentRequest-scenario.feature"
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

    then("Network responed for get groups api", () => {
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
        (node) => node.prop("testID") === "deleteBtn-2"
      );
      deleteBtn.simulate("press");
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

    then("Get delete request api response", () => {
      const mockResponse = {
        data: mockRequestData[0],
      };

      const deleteRequestApiMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      deleteRequestApiMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        deleteRequestApiMessage.messageId
      );

      deleteRequestApiMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.deleteRequestCallId = deleteRequestApiMessage.messageId;
      runEngine.sendMessage("Unit Test", deleteRequestApiMessage);
    });

    when("User press on update button from the table", () => {
      const updateBtn = requestManagement.findWhere(
        (node) => node.prop("testID") === "updateBtn-2"
      );
      updateBtn.simulate("press");
    });

    then("User update request text in the text field", () => {
      const requesTextField = requestManagement.findWhere(
        (node) => node.prop("testID") === "requesTextField"
      );
      requesTextField.simulate("changeText", "accept my request");
    });

    then("Text input value should be match", () => {
      const requesTextField = requestManagement.findWhere(
        (node) => node.prop("testID") === "requesTextField"
      );
      expect(requesTextField.prop("value")).toBe("accept my request");
    });

    when("User press sent button to update request review text", () => {
      const sendRequestSubmitBtn = requestManagement.findWhere(
        (node) => node.prop("testID") === "sendRequestSubmitBtn"
      );
      sendRequestSubmitBtn.simulate("press");
    });

    then("Update request text api should be called", () => {
      expect(runEngine.sendMessage).toBeCalledWith(
        "RestAPIRequestMessage",
        expect.objectContaining({
          id: "RestAPIRequestMessage",
          initializeFromObject: expect.any(Function),
          messageId: expect.any(String),
          properties: {
            RestAPIRequestMethodMessage: "PUT",
            RestAPIResponceEndPointMessage: "request_management/requests/2",
            RestAPIRequestHeaderMessage: expect.any(String),
            RestAPIRequestBodyMessage: JSON.stringify({
              data: {
                request_text: "accept my request",
              },
            }),
          },
        })
      );
    });

    then("Get response from update request text api", () => {
      const mockResponse = {
        data: mockRequestData[0],
      };

      const updateReqApiMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      updateReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        updateReqApiMessage.messageId
      );

      updateReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.updateRequestTextCallId = updateReqApiMessage.messageId;
      runEngine.sendMessage("Unit Test", updateReqApiMessage);
    });

    when(
      "User click on sent button to open modal to create new request",
      () => {
        const sendRequestBtn = requestManagement.findWhere(
          (node) => node.prop("testID") === "sendRequestBtn"
        );
        sendRequestBtn.simulate("press");
      }
    );

    then("User click on sent button to create new request", () => {
      const sendRequestSubmitBtn = requestManagement.findWhere(
        (node) => node.prop("testID") === "sendRequestSubmitBtn"
      );
      sendRequestSubmitBtn.simulate("press");
    });

    then("Network should be called after clicking sent button", () => {
      expect(runEngine.sendMessage).toBeCalledWith(
        "RestAPIRequestMessage",
        expect.objectContaining({
          id: "RestAPIRequestMessage",
          initializeFromObject: expect.any(Function),
          messageId: expect.any(String),
          properties: {
            RestAPIRequestMethodMessage: "POST",
            RestAPIResponceEndPointMessage: "request_management/requests",
            RestAPIRequestHeaderMessage: expect.any(String),
            RestAPIRequestBodyMessage: JSON.stringify({
              data: {
                reviewer_group_id: "",
                request_text: "",
              },
            }),
          },
        })
      );
    });

    then("Get response from send request api", () => {
      const mockResponse = {
        data: mockRequestData[0],
      };

      const sendReqApiMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      sendReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        sendReqApiMessage.messageId
      );

      sendReqApiMessage.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.sendRequestCallId = sendReqApiMessage.messageId;
      runEngine.sendMessage("Unit Test", sendReqApiMessage);
    });

    when("User enter request id in input field to filter", () => {
      const filterKeyInput = requestManagement.findWhere(
        (node) => node.prop("testID") === "filterKeyInput"
      );
      filterKeyInput.simulate("changeText", "2");
    });

    then("Input field value should be update", () => {
      const filterKeyInput = requestManagement.findWhere(
        (node) => node.prop("testID") === "filterKeyInput"
      );
      expect(filterKeyInput.prop('value')).toBe("2");
    });

    when("User press on view button to view request", () => {
      const viewBtn = requestManagement.findWhere(
        (node) => node.prop("testID") === "viewBtn-2"
      );
      viewBtn.simulate("press");
    });

    then("View request modal should be opened", () => {
      const viewRequestId = requestManagement.findWhere(
        (node) => node.prop("testID") === "viewRequestId"
      );
      expect(viewRequestId).toBeDefined();
      expect(viewRequestId.prop("children").join("")).toBe("Request ID: 2");
    });
  });
});
