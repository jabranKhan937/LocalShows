import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";

import Posts from "../../src/Posts";
import PostCreation from "../../src/PostCreation.web";
import PostDetails from "../../src/PostDetails";

jest.useFakeTimers()
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "Posts"
};

const createTestProps = (props: Object) => ({
  navigation: {
    push: jest.fn()
  },
  ...props
});
let item = {
  data: {
    id: "105",
    type: "post",
    attributes: {
      id: 105,
      name: "Test1",
      description: "Test3267",
      currency: "$",
      price: 98.0,
      created_at: "2021-01-28T09:29:00.732Z",
      updated_at: "2021-01-28T09:29:00.737Z",
      sub_category: {
        data: null
      },
      category: {
        data: {
          id: "4",
          type: "category",
          attributes: {
            id: 4,
            name: "Cat3",
            sub_categories: []
          }
        }
      },
      product_image:
        "https://sicemefullbuild-28456-ruby.28456.dev.ap-southeast-1.aws.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWkk9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fa5f1697bfb69e848d2bfe42aa0edef781b5f456/EFB1D7FD-0CA6-435D-9889-9CC897189A1C.jpg"
    }
  }
};
const feature = loadFeature("./__tests__/features/PostCreation-scenario.web.feature");

defineFeature(feature, test => {
  let props: any;
  beforeEach(() => {
    props = createTestProps({});
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to posts", ({ given, when, then }) => {
    let postCreationWrapper: ShallowWrapper;
    let postWrapper: ShallowWrapper;
    let postDetailWrapper: ShallowWrapper;
    let postCreationControllerWrapper: ShallowWrapper;
    let instance: Posts;

    given("I am a User loading posts", () => {
      ///
      postDetailWrapper = shallow(<PostDetails {...screenProps} />);
      expect(postDetailWrapper).toBeTruthy();
      ///
      ///
      postCreationWrapper = shallow(<PostCreation {...screenProps} />);
      expect(postCreationWrapper).toBeTruthy();
      ///
      postWrapper = shallow(<Posts {...screenProps} />);
      expect(postWrapper).toBeTruthy();

      instance = postWrapper.instance() as Posts;

      const getPostAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getPostAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getPostAPI.messageId
      );
      getPostAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), [
        {
          data: {
            id: "105",
            type: "post",
            attributes: {
              id: 105,
              name: "Test1",
              description: "Test3267",
              currency: "$",
              price: 98.0,
              created_at: "2021-01-28T09:29:00.732Z",
              updated_at: "2021-01-28T09:29:00.737Z",
              sub_category: {
                data: null
              },
              category: {
                data: {
                  id: "4",
                  type: "category",
                  attributes: {
                    id: 4,
                    name: "Cat3",
                    sub_categories: []
                  }
                }
              },
              product_image:
                "https://sicemefullbuild-28456-ruby.28456.dev.ap-southeast-1.aws.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWkk9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fa5f1697bfb69e848d2bfe42aa0edef781b5f456/EFB1D7FD-0CA6-435D-9889-9CC897189A1C.jpg"
            }
          }
        }
      ]);
      instance.apiPostItemCallId = getPostAPI.messageId;
      runEngine.sendMessage("Unit Test", getPostAPI);
    });

    when("I navigate to the posts", () => {
      instance = postWrapper.instance() as Posts;
    });

    then("posts will load with out errors", () => {
      expect(postWrapper).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(postWrapper).toBeTruthy();
    });
  });

  test("User can view a post", ({ given, when, then }) => {
    let postWrapper: ShallowWrapper;
    let instance: Posts;

    given("I am a User attempting to view a post", () => {
      postWrapper = shallow(<Posts {...props} />);

      expect(postWrapper).toBeTruthy();

      instance = postWrapper.instance() as Posts;
    });

    when("I click on a post", () => {
      instance = postWrapper.instance() as Posts;
      instance.navigateToDetails(item);
    });

    then("view post will load with out errors", () => {
      expect(postWrapper).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(postWrapper).toBeTruthy();
    });
  });

  test("User can delete a post", ({ given, when, then }) => {
    let postWrapper: ShallowWrapper;
    let instance: Posts;

    given("I am a User attempting to delete a post", () => {
      postWrapper = shallow(<Posts {...props} />);

      expect(postWrapper).toBeTruthy();


      instance = postWrapper.instance() as Posts;
    });

    when("I delete a post", () => {
      instance = postWrapper.instance() as Posts;
      instance.delete("1");
    });

    then("delete post should succeed", () => {
      expect(instance.delete(1)).toBe(true);
      const deletePostApi = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      deletePostApi.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        deletePostApi
      );
      deletePostApi.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );

      deletePostApi.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        deletePostApi.messageId
      );
      instance.DeleteApiCallId = deletePostApi.messageId;
      runEngine.sendMessage("Unit Test", deletePostApi);
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(postWrapper).toBeTruthy();
    });
  });

  test("User can add a post", ({ given, when, then }) => {
    let postWrapper: ShallowWrapper;
    let instance: Posts;

    given("I am a User attempting to add a post", () => {
      postWrapper = shallow(<Posts {...props} />);

      expect(postWrapper).toBeTruthy();


      instance = postWrapper.instance() as Posts;
    });

    when("I click on add post", () => {
      instance = postWrapper.instance() as Posts;
      instance.setState({
        name: "test",
        category_id: "1",
        description: "test",
        price: "100",
        profileImageData: {
          uri: "test",
          content_type: "image/jpeg",
          filename: "image.jpg"
        }
      });
    });

    then("add posts should succeed", () => {
      expect(instance.getAllCategory()).toBe(true);
    });

    then("RestAPI will return successfull response", () => {
      expect(instance.delete(1)).toBe(true);
      const addPostApi = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      addPostApi.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addPostApi
      );
      addPostApi.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [
          {
            id: "24",
            type: "category",
            attributes: {
              id: 24,
              name: "test",
              created_at: "2020-10-26T07:51:17.704Z",
              updated_at: "2020-10-26T07:51:17.704Z",
              sub_categories: []
            }
          }
        ]
      });

      addPostApi.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addPostApi.messageId
      );
      instance.addpostApiCallId = addPostApi.messageId;
      runEngine.sendMessage("Unit Test", addPostApi);
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(postWrapper).toBeTruthy();
    });
  });
});