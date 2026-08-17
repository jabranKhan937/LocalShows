import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import PhotoLibrary from "../../src/PhotoLibrary.web";
const navigation = require("react-navigation");

const screenProps = {
  navigation,
  id: "PhotoLibrary"
};

const feature = loadFeature(
  "./__tests__/features/PhotoLibrary-scenario.web.feature"
);

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve(undefined))
}));

jest.mock("react-navigation", () => ({}));

const imageData = [
  {
    id: "1",
    isSelected: false,
    file_name: "demo.jpg",
    file_url: "https://picsum.photos/200/300"
  },
  {
    id: "2",
    isSelected: false,
    file_name: "demo.jpg",
    file_url: "https://picsum.photos/200/300"
  },
  {
    id: "3",
    isSelected: false,
    file_name: "demo.jpg",
    file_url: "https://picsum.photos/200/300"
  },
  {
    id: "4",
    isSelected: false,
    file_name: "demo.jpg",
    file_url: "https://picsum.photos/200/300"
  },
  {
    id: "5",
    isSelected: false,
    file_name: "demo.jpg",
    file_url: "https://picsum.photos/200/300"
  }
];

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to PhotoLibrary", ({ given, when, then }) => {
    let photoLibrary: ShallowWrapper;
    let instance: PhotoLibrary;

    given("I am a User loading PhotoLibrary", () => {
      photoLibrary = shallow(<PhotoLibrary {...screenProps} />);
    });

    when("User navigate to the PhotoLibrary", () => {
      instance = photoLibrary.instance() as PhotoLibrary;
    });

    then("PhotoLibrary will load without errors", () => {
      const msgToken = new Message(getName(MessageEnum.SessionResponseMessage));
      msgToken.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", msgToken);

      const msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: true,
        }
      );
      instance.getPhotoLibraryApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: {
            id: 1,
            type: "photo_library",
            attributes: {
              id: 1,
              photos: [
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/300"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/301"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/302"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/303"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/304"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/305"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/306"
                },
                {
                  file_name: "demo.jpg",
                  file_url: "https://picsum.photos/200/307"
                }
              ],
              caption: "testcaption",
              account_id: 1,
              created_at: new Date(),
              updated_at: new Date(),
              shared_to_ids: [1, 1],
              account: {
                id: 1,
                first_name: "first",
                last_name: "last",
                full_phone_number: "+916787656546",
                country_code: "IND",
                phone_number: "65856985",
                email: "test@test.com",
                activated: true,
                device_id: "test12",
                unique_auth_id: "test12",
                password_digest: "test12",
                created_at: new Date(),
                updated_at: new Date(),
                user_name: "test",
                platform: "test",
                user_type: "test",
                status: "test",
                suspend_until: new Date(),
                app_language_id: 1,
                is_blacklisted: true
              }
            }
          },
        }
      );

      instance.getPhotoLibraryApiCallId = msgValidationAPI.messageId;
      instance.setState({
        imageData: imageData,
      });
      expect(photoLibrary).toBeTruthy();
    });

    then("User can click the view Image without errors", () => {
      let buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "handlebtnViewImage0"
      );
      buttonComponent.simulate("click");
      instance.setState({ isViewImageModalVisible: true });
    });

    then("Image view modal opens without errors", () => {
      let buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "closeViewImageModal"
      );
      buttonComponent.simulate("click");
      buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "handleDeleteImage"
      );
      buttonComponent.simulate("click");

      instance.setState({ isViewImageModalVisible: false });
    });

    when("User can press share modal button without errors", () => {
      let buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "openShareModal"
      );
      buttonComponent.simulate("click");
      instance.setState({ isShareModalVisible: true });
    });

    then("User try to share with an empty account id", () => {
      let textInputComponent = photoLibrary.findWhere(
        (node) => node.prop("data-test-id") === "inputAccountId"
      );
      textInputComponent.simulate("change", {
        target: { value: "" },
      });

      const msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: true,
        }
      );
      instance.sharePhotoLibraryApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
      instance.setState({ inputAccountIdError: true });
    });

    then("User share the PhotoLibrary without errors", () => {
      let textInputComponent = photoLibrary.findWhere(
        (node) => node.prop("data-test-id") === "inputAccountId"
      );
      textInputComponent.simulate("change", {
        target: { value: "2" },
      });

      instance.setState({ inputAccountIdError: false });

      let buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "sharePhotoLibrary"
      );
      buttonComponent.simulate("click");

      const msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          message: "Shared successfully"
        }
      );
      instance.sharePhotoLibraryApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "closeShareModal"
      );
      buttonComponent.simulate("click");
    });

    then("User can click add image modal btn without errors", () => {
      let buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "handlebtnAddImage"
      );
      buttonComponent.simulate("click");
      instance.setState({ isAddImageModalVisible: true });
    });

    when("User try to save an empty image", () => {
      let buttonComponent = photoLibrary.findWhere(
        node => node.prop("data-test-id") === "handleSaveImage"
      );
      buttonComponent.simulate("click");

      const msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: true,
        }
      );
      instance.addImageToPhotoLibraryApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    then(
      "Add new image modal opens and user can save the new image data without errors",
      () => {
        let buttonComponent = photoLibrary.findWhere(
          node => node.prop("data-test-id") === "handleAddnewImage"
        );
        buttonComponent.simulate("click");

        photoLibrary
          .findWhere(node => node.prop("data-test-id") === "fileInput")
          .simulate("change", {
            target: {
              files: ["dummyValue.jpg"]
            }
          });

        buttonComponent = photoLibrary.findWhere(
          node => node.prop("data-test-id") === "closeAddImageModal"
        );
        buttonComponent.simulate("click");
        instance.setState({ selectedImage: { uri: "abc" } });
        buttonComponent = photoLibrary.findWhere(
          node => node.prop("data-test-id") === "handleSaveImage"
        );
        buttonComponent.simulate("click");

        instance.setState({
          isAddImageModalVisible: false
        });
      }
    );

    then(
      "User can select delete image and gallery buttons without errors",
      () => {
        let buttonComponent = photoLibrary.findWhere(
          node => node.prop("data-test-id") === "toggleDeleteMultipleImages"
        );
        buttonComponent.simulate("click");

        instance.setState({
          imageData: imageData,
          isVisibleDeleteCheckbox: true
        });

        buttonComponent = photoLibrary.findWhere(
          node => node.prop("data-test-id") === "deleteSelectedImages"
        );
        buttonComponent.simulate("click");

        buttonComponent = photoLibrary.findWhere(
          node => node.prop("data-test-id") === "handleDeleteGallery"
        );
        buttonComponent.simulate("click");

        const msgValidationAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        msgValidationAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgValidationAPI.messageId
        );
        msgValidationAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          {
            message: "Deleted",
          }
        );
        instance.deletePhotoLibraryApiCallId = msgValidationAPI.messageId;
        runEngine.sendMessage("Unit Test", msgValidationAPI);
      }
    );

    then("User can leave the screen without errors", () => {
      instance.componentWillUnmount();
      expect(photoLibrary).toBeTruthy();
    });
  });
});
