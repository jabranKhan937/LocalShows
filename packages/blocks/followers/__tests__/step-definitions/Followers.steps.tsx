import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Followers from "../../src/Followers"
import { runEngine } from "../../../../framework/src/RunEngine";

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve("27")),
}));

const mockList = [
  {
    "id": "12",
    "type": "follow",
    "attributes": {
      "id": 12,
      "current_user_id": 204,
      "account_id": 185,
      "created_at": "2024-02-08T08:05:30.782Z",
      "updated_at": "2024-02-08T11:23:43.523Z",
      "confirmed": true,
      "name": null,
      "profile_image_url": null
    }
  },
  {
    "id": "13",
    "type": "follow",
    "attributes": {
      "id": 13,
      "current_user_id": 205,
      "account_id": 185,
      "created_at": "2024-02-08T11:02:20.909Z",
      "updated_at": "2024-02-08T11:06:37.944Z",
      "confirmed": true,
      "name": "Astha",
      "profile_image_url": "image"
    }
  }
]

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    openDrawer:jest.fn(),
    getParam:jest.fn(),
    state:
    {
      params: {
        type: "following"
      }
    },
    push:jest.fn()
  },
  id: "Followers"
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
  setStorageData: jest.fn().mockImplementation(() => Promise.resolve('user_country')),
  getStorageData: jest.fn().mockImplementation(() => Promise.resolve('US')),
  set: jest.fn().mockImplementation(() => Promise.resolve('userRole')),
  get: jest.fn().mockImplementation(() => Promise.resolve('venue')),
}));

jest.useFakeTimers();

const feature = loadFeature('./__tests__/features/Followers-scenario.feature');

defineFeature(feature, (test) => {

  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
  });

  test('User navigates to Followers', ({ given, when, then }) => {

    let exampleBlockA: ShallowWrapper;
    let instance: Followers;

    given('I am a User loading Followers', () => {
      exampleBlockA = shallow(<Followers {...screenProps} />);
    });

    when('I navigate to the Followers', async () => {
      instance = exampleBlockA.instance() as Followers;

      exampleBlockA.findWhere((node) => node.prop('testID') === 'backBtn').simulate('press')
      exampleBlockA.findWhere((node) => node.prop('testID') === 'searchTxt').simulate('changeText', "A")
      exampleBlockA.findWhere((node) => node.prop('testID') === 'hamburgerBtn').simulate('press')
      instance.setState({type:'following'})
      instance.renderRemoveBtn('test')
     await instance.getUserToken()
     instance.setState({followerFollowingList:mockList})
      mockAPISuccessCall(instance, "getFollowersFollowingsListAPICallID", mockList)
      mockAPISuccessCall(instance, "getFollowersFollowingsListAPICallID", { errors: [] })
      mockAPIFailureCall(instance, "getFollowersFollowingsListAPICallID", { errors: [] })

 
    });

    then("User navigates back", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Followers are listed", async () => {
      instance.setState({type:"followers", isLoading: false,followerFollowingList:mockList,accountId:'123',loginUserId:'123'})

      const followerFollowingList = exampleBlockA.findWhere(node => node.prop("testID") === "followerFollowingList");
      mockList.forEach((item, index) => {
      instance.setState({loginUserId:'321',accountId:'123'})
      followerFollowingList.renderProp("renderItem")({
        item: item,
        index: index,
      })
      instance.setState({loginUserId:'123',accountId:'123'})

      let innerWrapper = followerFollowingList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "profile"
        ).simulate("press");

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "removeBtn"
        ).simulate("press");

        innerWrapper = followerFollowingList.renderProp("keyExtractor")({
          item: item,
        });

        innerWrapper = followerFollowingList.renderProp("ListEmptyComponent")({});
      })
      mockAPISuccessCall(instance, "removeFollowRequestCallId", mockList)
      mockAPISuccessCall(instance, "removeFollowRequestCallId", { errors: [] })
      mockAPIFailureCall(instance, "removeFollowRequestCallId", { errors: [] })

      mockAPISuccessCall(instance, "userFollowingCallID", mockList)
      mockAPISuccessCall(instance, "userFollowingCallID", { errors: [] })
      mockAPIFailureCall(instance, "userFollowingCallID", { errors: [] })

      mockAPISuccessCall(instance, "userFollowerCallID", mockList)
      mockAPISuccessCall(instance, "userFollowerCallID", { errors: [] })
      mockAPISuccessCall(instance, "userFollowerCallID", { errors: [{message:"Not following to any user."}] })
      mockAPIFailureCall(instance, "userFollowerCallID", { errors: [] })
      mockAPIFailureCall(instance, "userFollowerCallID", { errors: [{message:"Not following to any user."}] })

      mockAPISuccessCall(instance, "addFollowerFromFollowingCallId", mockList)
      mockAPISuccessCall(instance, "addFollowerFromFollowingCallId", { errors: [] })
      mockAPIFailureCall(instance, "addFollowerFromFollowingCallId", { errors: [] })

      mockAPISuccessCall(instance, "unFollowFromFollowingCallId", mockList)
      mockAPISuccessCall(instance, "unFollowFromFollowingCallId", { errors: [] })
      mockAPIFailureCall(instance, "unFollowFromFollowingCallId", { errors: [] })  
      
      mockAPISuccessCall(instance, "followerCallId", mockList)
      mockAPISuccessCall(instance, "followerCallId", { errors: [] })
      mockAPIFailureCall(instance, "followerCallId", { errors: [] })

      instance.addFromFollowing('123')
      instance.unFollowFromFollowing('123')
      instance.followingOnPress()
      instance.followerListOnPress()
      instance.userListOnPress()
      instance.setState({type:'following'})
      await instance.handleProfileNav({attributes:{current_user_id:'123',account_id:"123",account_type:"Band"}})
      await instance.handleProfileNav({attributes:{current_user_id:'123',account_id:"123",account_type:"Artist"}})
      await instance.handleProfileNav({attributes:{current_user_id:'123',account_id:"123",account_type:"Fan"}})
      instance.setState({type:'followers'})
      await instance.handleProfileNav({attributes:{current_user_id:'123',account_id:"123",account_type:"Band"}})
      await instance.handleProfileNav({attributes:{current_user_id:'123',account_id:"123",account_type:"Artist"}})
      await instance.handleProfileNav({attributes:{current_user_id:'123',account_id:"123",account_type:"Fan"}})
    })

    then("User views followers list", () => {
      expect(instance.state.type).toBe("followers");
    })

  });

});