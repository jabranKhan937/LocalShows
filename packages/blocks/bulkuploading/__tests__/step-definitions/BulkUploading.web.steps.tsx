import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import BulkUploading from "../../src/BulkUploading.web";
const navigation = require("react-navigation");

const feature = loadFeature(
  "./__tests__/features/BulkUploading-scenario.web.feature"
);

const screenProps = {
  navigation: navigation,
  id: "BulkUploading",
};

const mockData = [
  {
    data: {
      id: "1",
      type: "attachment",
      attributes: {
        id: 1,
        account_id: 2,
        files: [
          {
            id: 1,
            file_name: "file-name.png",
            file_url: "directory/file-name.png",
          },
        ],
        status: "completed",
      },
    },
    meta: {
      message: "Attachment Created Successfully",
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

  test("User navigates to BulkUploading", ({ given, when, then }) => {
    let bulkUploading: ShallowWrapper;
    let instance: BulkUploading;

    given("I am a User loading BulkUploading", () => {
      bulkUploading = shallow(<BulkUploading {...screenProps} />);
    });

    when("I navigate to the BulkUploading", () => {
      instance = bulkUploading.instance() as BulkUploading;
    });

    then("BulkUploading will load with out errors", () => {
      expect(bulkUploading).toBeTruthy();
    });

    then("Set token from session response", () => {
      const receivedReqApiMessage = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );

      receivedReqApiMessage.addData(
        getName(MessageEnum.SessionResponseToken),
        ""
      );

      runEngine.sendMessage("Unit Test", receivedReqApiMessage);
    });

    when("I can choose file from file input", () => {
      const filePicker = bulkUploading.findWhere(
        (node) => node.prop("data-testid") === "filePicker"
      );
      const event = {
        target: {
          files: [
            {
              name: "file-1.pdf",
              size: 6e6,
            },
            {
              name: "file-name-2.png",
              size: 1024,
            },
            {
              name: "file-name-3.jpg",
              size: 2048,
            },
          ],
        },
      };
      filePicker.simulate("change", event);
    });

    then("User remove one file from selected files", () => {
      const selectedFile = bulkUploading.findWhere(
        (node) => node.prop("data-testid") === "selectedFile-1"
      );
      selectedFile.simulate("click");
      expect(selectedFile).toBeTruthy();
    });

    then("Only one file should be present in selected file", () => {
      expect(instance.state.filesWeb.length).toBe(1);
    });

    when("User click on submit button to upload files", () => {
      const submitBtn = bulkUploading.findWhere(
        (node) => node.prop("data-testid") === "submitBtn"
      );
      submitBtn.simulate("click");
    });

    then("Network response for create bulk uploading files", () => {
      const mockResponse = {
        data: {},
      };

      const createBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        createBulkUploadMsg.messageId
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.createBulkUploadCallId = createBulkUploadMsg.messageId;
      runEngine.sendMessage("Unit Test", createBulkUploadMsg);
    });

    when("User click on get button to get all bulk uploaded", () => {
      const getUploadedFiles = bulkUploading.findWhere(
        (node) => node.prop("data-testid") === "getUploadedFiles"
      );
      getUploadedFiles.simulate("click");
    });

    then("Network call should be call to get upload files", () => {
      expect(runEngine.sendMessage).toBeCalledWith(
        "RestAPIRequestMessage",
        expect.objectContaining({
          id: "RestAPIRequestMessage",
          initializeFromObject: expect.any(Function),
          messageId: expect.any(String),
          properties: {
            RestAPIRequestMethodMessage: "GET",
            RestAPIResponceEndPointMessage: "bulk_uploading/attachments",
            RestAPIRequestHeaderMessage: expect.any(String),
          },
        })
      );
    });

    then("Set network response for get upload files", () => {
      const getBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      getBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getBulkUploadMsg.messageId
      );

      getBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockData
      );

      instance.getBulkUploadCallId = getBulkUploadMsg.messageId;

      runEngine.sendMessage("Unit Test", getBulkUploadMsg);
    });

    then("User click on download button to download file", () => {
      const downloadFileBtn = bulkUploading.findWhere(
        (node) => node.prop("data-testid") === "downloadFileBtn-1-1"
      );
      downloadFileBtn.simulate("click");
    });

    when("User click on delete button to delete all files", () => {
      const deleteSignleBtn = bulkUploading.findWhere(
        (node) => node.prop("data-testid") === "deleteAllBtn-1"
      );
      deleteSignleBtn.simulate("click");
    });

    then("Network should be call to delete all file", () => {
      expect(runEngine.sendMessage).toBeCalledWith(
        "RestAPIRequestMessage",
        expect.objectContaining({
          id: "RestAPIRequestMessage",
          initializeFromObject: expect.any(Function),
          messageId: expect.any(String),
          properties: {
            RestAPIRequestMethodMessage: "DELETE",
            RestAPIResponceEndPointMessage: "bulk_uploading/attachments/1",
            RestAPIRequestHeaderMessage: expect.any(String),
          },
        })
      );
    });

    then("Set network response for delete all file", () => {
      const mockResponse = {
        data: {},
      };

      const deleteBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      deleteBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        deleteBulkUploadMsg.messageId
      );

      deleteBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.deleteBulkUploadCallId = deleteBulkUploadMsg.messageId;
      runEngine.sendMessage("Unit Test", deleteBulkUploadMsg);
    });

    then("User can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(bulkUploading).toBeTruthy();
    });
  });
});
