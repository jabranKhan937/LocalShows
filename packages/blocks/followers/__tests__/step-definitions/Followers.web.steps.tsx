import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"
import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import Followers from "../../src/Followers.web"

const navigation = require("react-navigation")

const userListData = [
  {
    id: '1',
    attributes: {
      account_email: 'test@gmail.com',
      email: 'test@gmail.com', current_user_id: '1',
      account_id: '1',
      user_name: 'test',
      is_follow: false
    },
  },
  {
    id: '2',
    attributes: {
      account_email: 'test2@gmail.com',
      email: 'test2@gmail.com', current_user_id: '2',
      account_id: '2',
      user_name: 'test2',
      is_follow: false
    },
  }, {
    id: '3',
    attributes: {
      account_email: 'test3@gmail.com',
      email: 'test3@gmail.com', current_user_id: '3',
      account_id: '3',
      user_name: 'test3',
      is_follow: false
    },
  }
]

const feature = loadFeature('./__tests__/features/Followers-scenario.web.feature');

const screenProps = {
  id: "Followers",
  navigation: navigation
}

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
  });

  test("User navigates to Followers", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Followers;

    given("I am a User loading Followers", () => {
      exampleBlockA = shallow(<Followers {...screenProps} />);
    });

    when('I navigate to the Followers', () => {
      instance = exampleBlockA.instance() as Followers
    });

    then("Followers will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then('Tab will load without errors', () => {
      instance.setState({
        tabPanelNo: 0,
      })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 2);
      expect(instance.state.tabPanelNo).toEqual(2);
    })

    then('UserList Table will load with out errors', () => {
      instance.setState({ userListData: userListData })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 0);
      expect(instance.state.tabPanelNo).toEqual(0);
    });

    then('FollowingList Table will load with out errors', () => {
      instance.setState({ userFollowerListData: userListData })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 1);
      expect(instance.state.tabPanelNo).toEqual(1);
      expect(exampleBlockA).toBeTruthy();
    });

    then('FollowerList Table will load with out errors', () => {
      instance.setState({ userFollowingListData: userListData })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 2);
      expect(instance.state.tabPanelNo).toEqual(2);
      expect(exampleBlockA).toBeTruthy();
    });

    then('TabPanel will load without error', () => {
      const tabPanel = shallow(<instance.TabPanel children={<h1>Test</h1>} value={1} index={0} />);
      expect(tabPanel).toBeTruthy();
    })

    then('Select TabPanel will load without error', () => {
      const tabPanel = shallow(<instance.TabPanel children={<h1>Test</h1>} value={1} index={1} />);
      expect(tabPanel).toBeTruthy();
    })

    then('GenTable will load without error', () => {
      const GenTable = shallow(<instance.GenTable functionTestID={"test"} key={"test"} bodyText={"test"} buttonText={"test"} buttonFunction={instance.unFollowFromFollowing} functionPara={"2"} />);
      expect(GenTable).toBeTruthy();
      let functionBtn = GenTable.findWhere(node => node.prop('data-test-id') === 'test');
      functionBtn.simulate('click');
      expect(functionBtn).toBeTruthy();
    })
  });

  test("User can view a user list and follow other user", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Followers;

    given("I am a User attempting to view a user list", () => {
      exampleBlockA = shallow(<Followers {...screenProps} />);
    });

    when('I click on a user list', () => {
      instance = exampleBlockA.instance() as Followers
      instance.setState({ userListData: userListData })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 0);
      expect(instance.state.tabPanelNo).toEqual(0);
    });

    then("user list will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then('Followers will get the user list on API call', () => {
      const msgLoadDataAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadDataAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadDataAPI.messageId
      );
      msgLoadDataAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: userListData
        }
      );
      instance.followerCallId = msgLoadDataAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadDataAPI);
      expect(instance.state.userListData).toEqual(userListData)
    });

    then('I can select the follow button without errors', () => {
      let buttonComponent = exampleBlockA.findWhere((node) => node.prop('data-test-id') === 'userFollowBtn').first();
      buttonComponent.simulate('click')
      expect(buttonComponent).toBeTruthy();
    });

    then('User cilck on the follow button and call the API', () => {
      const addFollowerFromFollowingId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      addFollowerFromFollowingId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addFollowerFromFollowingId.messageId
      );
      addFollowerFromFollowingId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: userListData
        }
      );
      instance.addFollowerFromFollowingCallId = addFollowerFromFollowingId.messageId;
      runEngine.sendMessage("Unit Test", addFollowerFromFollowingId);
      expect(addFollowerFromFollowingId).toBeTruthy();
    });

    then('User cilck on the follow button and get error on API', () => {
      const addFolloerListErrorData = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      addFolloerListErrorData.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addFolloerListErrorData.messageId
      );
      addFolloerListErrorData.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [{}]
        }
      );
      instance.addFollowerFromFollowingCallId = addFolloerListErrorData.messageId;
      runEngine.sendMessage("Unit Test", addFolloerListErrorData);
      expect(addFolloerListErrorData).toBeTruthy();
      expect(instance.state.errorMsg).toEqual([{}])
    });

    then('Followers will get the error user list API call', () => {
      const msgLoadDataErrorAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadDataErrorAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadDataErrorAPI.messageId
      );
      msgLoadDataErrorAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [{}]
        }
      );
      instance.followerCallId = msgLoadDataErrorAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadDataErrorAPI);
      expect(instance.state.errorMsg).toEqual([{}])
    });

  });

  test("User can view a Follower list and unfollow other user", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Followers;

    given("I am a User attempting to view a Follower list", () => {
      exampleBlockA = shallow(<Followers {...screenProps} />);
    });

    when('I click on a Follower list', () => {
      instance = exampleBlockA.instance() as Followers
      instance.setState({ userListData: userListData })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 1);
      expect(instance.state.tabPanelNo).toEqual(1);
    });

    then("Follower list will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then('User get the follower list on API Call', () => {
      const addFolloerListData = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      addFolloerListData.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addFolloerListData.messageId
      );
      addFolloerListData.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: userListData
        }
      );
      instance.userFollowerCallID = addFolloerListData.messageId;
      runEngine.sendMessage("Unit Test", addFolloerListData);
      expect(instance.state.userFollowerListData).toEqual(userListData)
    });

    then('I navigate to Following list Table', () => {
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 1);
      expect(instance.state.tabPanelNo).toEqual(1);
      expect(exampleBlockA).toBeTruthy();
    })

    then('I can select the Unfollow button without errors', () => {
      let buttonComponent = exampleBlockA.findWhere((node) => node.prop('data-test-id') === 'UnfollowBtn').first();
      buttonComponent.simulate('click')
      expect(buttonComponent).toBeTruthy();
    });

    then('User cilck on the Unfollow button and call the API', () => {
      const unFollowingSuggestionCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      unFollowingSuggestionCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        unFollowingSuggestionCallId.messageId
      );

      unFollowingSuggestionCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: userListData
        }
      );

      instance.unFollowFromFollowingCallId = unFollowingSuggestionCallId.messageId;
      runEngine.sendMessage("Unit Test", unFollowingSuggestionCallId);
      expect(unFollowingSuggestionCallId).toBeTruthy();
    });

    then('User cilck on the Unfollow button and get error on API', () => {
      const unFollowingSuggestionErrorCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      unFollowingSuggestionErrorCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        unFollowingSuggestionErrorCallId.messageId
      );

      unFollowingSuggestionErrorCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [{}]
        }
      );

      instance.unFollowFromFollowingCallId = unFollowingSuggestionErrorCallId.messageId;
      runEngine.sendMessage("Unit Test", unFollowingSuggestionErrorCallId);

      expect(unFollowingSuggestionErrorCallId).toBeTruthy();
      expect(instance.state.errorMsg).toEqual([{}])
    });

    then('User get the error follower list on API Call', () => {
      const errorAddFolloerListErrorData = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      errorAddFolloerListErrorData.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        errorAddFolloerListErrorData.messageId
      );
      errorAddFolloerListErrorData.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [{ message: 'Not following to any user.' }]
        }
      );
      instance.userFollowerCallID = errorAddFolloerListErrorData.messageId;
      runEngine.sendMessage("Unit Test", errorAddFolloerListErrorData);
      expect(instance.state.errorMsg).toEqual([{ message: 'Not following to any user.' }])
    });

  });

  test("User can view a Following list and follow other user", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Followers;

    given("I am a User attempting to view a Following list", () => {
      exampleBlockA = shallow(<Followers {...screenProps} />);
    });

    when('I click on a Following list', () => {
      instance = exampleBlockA.instance() as Followers
      instance.setState({ userListData: userListData })
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 2);
      expect(instance.state.tabPanelNo).toEqual(2);
    });

    then("Following list will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

      then('User get the following list on API Call', () => {
      const addFollwingListData = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      addFollwingListData.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addFollwingListData.messageId
      );
      addFollwingListData.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: userListData
        }
      );
      instance.userFollowingCallID = addFollwingListData.messageId;
      runEngine.sendMessage("Unit Test", addFollwingListData);
      expect(instance.state.userFollowingListData).toEqual(userListData)

    });

    then('I navigate to Follower list Table', () => {
      let tabContainer = exampleBlockA.findWhere(node => node.prop('data-test-id') === 'TabContainer');
      expect(tabContainer).toBeTruthy();
      tabContainer.simulate('change', {}, 2);
      expect(instance.state.tabPanelNo).toEqual(2);
      expect(exampleBlockA).toBeTruthy();
    })

    then('I can select the follow button without errors', () => {
      let buttonComponent = exampleBlockA.findWhere((node) => node.prop('data-test-id') === 'followingFollowBtn').first();
      buttonComponent.simulate('click')
      expect(buttonComponent).toBeTruthy();
    });

    then('User get the error following list on API Call', () => {
      const addFolloerListErrorData = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      addFolloerListErrorData.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        addFolloerListErrorData.messageId
      );
      addFolloerListErrorData.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [{}]
        }
      );
      instance.userFollowingCallID = addFolloerListErrorData.messageId;
      runEngine.sendMessage("Unit Test", addFolloerListErrorData);
      expect(instance.state.errorMsg).toEqual([{}])
    });

    then('I can leave the screen without errors', () => {
      instance.componentWillUnmount();
      expect(exampleBlockA).toBeTruthy();
    });

  });

});