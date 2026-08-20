import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import PhotoLibrary from "../../src/PhotoLibrary";

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    state: {
      params: {
        event_image: {
          uri: "event_image"
        },
        isPictureExplicit: false,
      }
    },
  },
  id: "PhotoLibrary"
};

const editScreenProps = {
  navigation: {
    goBack: jest.fn(),
    state: {
      params: {
        eventId: "1"
      }
    },
  },
  id: "PhotoLibrary"
};

const feature = loadFeature(
  "./__tests__/features/PhotoLibrary-scenario.feature"
);

const mockPictureDetailResponse = {
  "data": {
    "id": "17",
    "type": "post",
    "attributes": {
      "id": 17,
      "name": null,
      "description": "Astha",
      "body": null,
      "location": null,
      "account_id": 278,
      "is_explicit": true,
      "like_by_me": true,
      "created_at": "2024-04-11T10:52:53.960Z",
      "updated_at": "2024-04-12T06:33:17.682Z",
      "model_name": "BxBlockPosts::Post",
      "images_and_videos": [
        {
          "id": 179,
          "filename": "eventImage.jpg",
          "url": "sbucket/mf72du4en7cou9e8hid3kcawxv4d",
          "type": "image"
        }
      ],
      "likes_count": 1
    }
  }
}

const mockFailureResponse = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

const mockAPISuccessCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  instance[apiCallID] = msgSucessRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgSucessRestAPI)
}

const mockAPIFailureCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgFailureRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgFailureRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgFailureRestAPI.messageId);
  msgFailureRestAPI.addData(getName(MessageEnum.RestAPIResponceErrorMessage), apiData);
  instance[apiCallID] = msgFailureRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgFailureRestAPI)
}

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([]))
}));

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "ios" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "ios");
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

    then("User interacts with UI", () => {
      photoLibrary.findWhere(node => node.prop("testID") === "container").simulate("press");
      photoLibrary.findWhere(node => node.prop("testID") === "backBtn").simulate("press");
      instance.setState({ description: "a" });
      photoLibrary.findWhere(node => node.prop("testID") === "btnPostPicture").simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Description is empty", () => {
      instance.setState({ description: "" })
    });

    then("Throw error for Description", () => {
      photoLibrary.findWhere(node => node.prop("testID") === "btnPostPicture").simulate("press");
      expect(instance.state.descriptionError).toBe("Please enter description")
    })

    when("Description is not empty", () => {
      instance.setState({ description: "description" })
    });

    then("Trigger the API for Post a Picture", () => {
      photoLibrary.findWhere(node => node.prop("testID") === "btnPostPicture").simulate("press");
      mockAPISuccessCall(instance, "postAPictureApiCallId", [])
      mockAPIFailureCall(instance, "postAPictureApiCallId", mockFailureResponse)
      expect(instance.state.descriptionError).toBe("")
    })

  });

  test("User navigates to Edit PhotoLibrary", ({ given, when, then }) => {
    let photoLibrary: ShallowWrapper;
    let instance: PhotoLibrary;

    given("I am a User loading PhotoLibrary", () => {
      photoLibrary = shallow(<PhotoLibrary {...editScreenProps} />);
    });

    when("User navigate to the PhotoLibrary", () => {
      instance = photoLibrary.instance() as PhotoLibrary;
      mockAPISuccessCall(instance, "getPictureDetailApiCallId", mockPictureDetailResponse)
      mockAPIFailureCall(instance, "getPictureDetailApiCallId", mockFailureResponse)
    });

    then("User interacts with UI", () => {
      photoLibrary.findWhere(node => node.prop("testID") === "container").simulate("press");
      photoLibrary.findWhere(node => node.prop("testID") === "backBtn").simulate("press");
      photoLibrary.findWhere(node => node.prop("testID") === "descriptionInputText").simulate("changeText", "a");
      photoLibrary.findWhere(node => node.prop("testID") === "btnPostPicture").simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Description is empty", () => {
      instance.setState({ description: "" })
    });

    then("Throw error for Description", () => {
      photoLibrary.findWhere(node => node.prop("testID") === "btnPostPicture").simulate("press");
      expect(instance.state.descriptionError).toBe("Please enter description")
    })

    when("Description is not empty", () => {
      instance.setState({ description: "description" })
    });

    then("Trigger the API for Post a Picture", () => {
      photoLibrary.findWhere(node => node.prop("testID") === "btnPostPicture").simulate("press");
      mockAPISuccessCall(instance, "postAPictureApiCallId", [])
      mockAPIFailureCall(instance, "postAPictureApiCallId", mockFailureResponse)
      expect(instance.state.descriptionError).toBe("")
    })

  });
});
