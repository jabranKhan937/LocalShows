import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import BulkUploading from "../../src/BulkUploading";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "BulkUploading",
};

const feature = loadFeature(
  "./__tests__/features/BulkUploading-scenario.feature"
);

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

jest.mock("react-native-document-picker", () => ({
  pickMultiple: jest.fn().mockImplementation(() =>
    Promise.resolve([
      {
        name: "file-1.pdf",
        url: "",
        size: 6e6,
      },
      {
        name: "file-name-2.png",
        url: "",
        size: 1024,
      },
      {
        name: "file-name-3.jpg",
        url: "",
        size: 2048,
      },
    ])
  ),
}));

const mockDownloadFile = jest.fn().mockImplementation(() => ({
  promise: Promise.resolve({ statusCode: 200 }),
}));
jest.mock("react-native-fs", () => ({
  DocumentDirectoryPath: "",
  DownloadDirectoryPath: "",
  downloadFile: mockDownloadFile,
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
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
        "tokenstring"
      );

      runEngine.sendMessage("Unit Test", receivedReqApiMessage);
    });

    when("User choose file from file input", () => {
      const filePicker = bulkUploading.findWhere(
        (node) => node.prop("testID") === "filePicker"
      );

      filePicker.simulate("press");
    });

    then("User remove one file from selected files", () => {
      const selectedFile = bulkUploading.findWhere(
        (node) => node.prop("testID") === "selectedFile-1"
      );
      selectedFile.simulate("press");
      expect(selectedFile).toBeTruthy();
    });

    then("Only one file should be present in selected file", () => {
      expect(instance.state.files.length).toBe(1);
    });

    when("User press on submit button to upload files", () => {
      const submitBtn = bulkUploading.findWhere(
        (node) => node.prop("testID") === "submitBtn"
      );
      submitBtn.simulate("press");
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

    then("File uploaded status should be success", () => {
      expect(instance.state.filesStatus[0]).toBe("success");
    });

    when("User click on get uploaded button", () => {
      const getUploadedFiles = bulkUploading.findWhere(
        (node) => node.prop("testID") === "getUploadedFiles"
      );
      getUploadedFiles.simulate("press");
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

    then("User press on download button to download file", () => {
      const downloadFileBtn = bulkUploading.findWhere(
        (node) => node.prop("testID") === "downloadFileBtn-1-1"
      );
      downloadFileBtn.simulate("press");
    });

    then("downloadFile function should be call", () => {
      expect(mockDownloadFile).toBeCalled();
    });

    when("User press on delete button to delete all files", () => {
      const deleteSignleBtn = bulkUploading.findWhere(
        (node) => node.prop("testID") === "deleteAllBtn-1"
      );
      deleteSignleBtn.simulate("press");
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

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(bulkUploading).toBeTruthy();
    });
  });
});
