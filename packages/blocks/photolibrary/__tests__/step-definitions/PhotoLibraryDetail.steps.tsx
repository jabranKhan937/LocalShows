import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { Message } from "../../../../framework/src/Message";
import { runEngine } from '../../../../framework/src/RunEngine'

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import PhotoLibraryDetail from "../../src/PhotoLibraryDetail";

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
  },
  id: "PhotoLibraryDetail"
};

const feature = loadFeature(
  "./__tests__/features/PhotoLibraryDetail-scenario.feature"
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

const mockLikeResponse = {
  "data": {
    "id": "115",
    "type": "like",
    "attributes": {
      "likeable_id": 16,
      "likeable_type": "BxBlockPosts::Post",
      "like_by_id": 278,
      "created_at": "2024-04-12T10:26:01.124Z",
      "updated_at": "2024-04-12T10:26:01.124Z"
    }
  }
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

  test("User navigates to PhotoLibraryDetail", ({ given, when, then }) => {
    let photoLibraryDetail: ShallowWrapper;
    let instance: PhotoLibraryDetail;

    given("I am a User loading PhotoLibraryDetail", () => {
      photoLibraryDetail = shallow(<PhotoLibraryDetail {...screenProps} />);
    });

    when("User navigate to the PhotoLibraryDetail", () => {
      instance = photoLibraryDetail.instance() as PhotoLibraryDetail;
      mockAPISuccessCall(instance, "getPicDetailApiCallId", mockPictureDetailResponse)
      mockAPISuccessCall(instance, "getPicDetailApiCallId", mockFailureResponse)
      mockAPIFailureCall(instance, "getPicDetailApiCallId", mockFailureResponse)
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.PostDetailDataMessage),
        {
          eventId: "1",
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);
      photoLibraryDetail.findWhere(node => node.prop("testID") === "container").simulate("press");
      photoLibraryDetail.findWhere(node => node.prop("testID") === "backBtn").simulate("press");
      photoLibraryDetail.findWhere(node => node.prop("testID") === "likePictureBtn").simulate("press");
      photoLibraryDetail.findWhere(node => node.prop("testID") === "createAccountBtn").simulate("press");
      photoLibraryDetail.findWhere(node => node.prop("testID") === "loginBtn").simulate("press");
      photoLibraryDetail.findWhere(node => node.prop("testID") === "popupCloseButton").simulate("press");
      photoLibraryDetail.findWhere(node => node.prop("testID") === "likeTextBtn").simulate("press");
      instance.setState({token:"123"})
      photoLibraryDetail.findWhere(node => node.prop("testID") === "likeTextBtn").simulate("press");

      mockAPISuccessCall(instance, "postLikePictureId", mockLikeResponse)
      mockAPISuccessCall(instance, "postLikePictureId", mockFailureResponse)
      mockAPIFailureCall(instance, "postLikePictureId", mockFailureResponse)
    });

    then("User interacts with UI", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })


  });
});
