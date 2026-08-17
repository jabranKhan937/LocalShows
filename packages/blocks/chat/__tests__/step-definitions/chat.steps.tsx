import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Chat from "../../src/Chat";
import { IChatObject, ISocketMessage, baseURL } from "../../src/ChatController";
import { PermissionsAndroid, Platform } from "react-native";
import StorageProvider from "../../../../framework/src/StorageProvider";
import { getStorageData } from "../../../../framework/src/Utilities";

jest.mock('react-native-swipe-list-view', () => ({
  SwipeListView: jest.fn()
}));

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn(),
    openDrawer: jest.fn(),
    push:jest.fn()
  },
  id: "Chat",
};

const mockResponse: any[] = [
  {
    id: "4",
    type: "chat_only",
    attributes: {
      id: 4,
      sender_id: 276,
      receiver_id: 0,
      name: "First Chat",
      user_name: "Abc",
      user_id: 0,
      profile_image: "",
      unread_message: 11,
      is_archived: false,
      is_deleted: true,
      is_other_user_online: true,
      last_message: {
        data: {
          id: "26",
          type: "chat_message",
          attributes: {
            id: 26,
            message: "Let's check it now",
            account_id: 276,
            chat_id: 4,
            created_at: "2024-04-10T10:21:04.294Z",
            updated_at: "2024-04-10T10:21:04.294Z",
            is_mark_read: false,
            message_type: "text",
            attachments: "",
            from_other_party: false,
            show_id: 0,
            show_title: "",
            show_image: "",
            show_date: "",
            show_time: "",
            show_location: "",
          },
        },
      },
    },
  },
  {
    id: "5",
    type: "chat_only",
    attributes: {
      id: 5,
      sender_id: 277,
      receiver_id: 276,
      name: "Some Chat",
      user_name: "Someone",
      user_id: 276,
      profile_image: "",
      unread_message: 18,
      is_archived: false,
      is_deleted: true,
      is_other_user_online: false,
      last_message: {
        data: {
          id: "44",
          type: "chat_message",
          attributes: {
            id: 44,
            message: "You are gone again",
            account_id: 277,
            chat_id: 5,
            created_at: "2024-04-12T06:50:47.676Z",
            updated_at: "2024-04-12T06:50:47.676Z",
            is_mark_read: false,
            message_type: "text",
            attachments: "",
            from_other_party: false,
            show_id: 0,
            show_title: "",
            show_image: "",
            show_date: "",
            show_time: "",
            show_location: "",
          },
        },
      },
    },
  },
];

const feature = loadFeature("./__tests__/features/chat-scenario.feature");

const token = "TOKEN";
const accountId = 1;

const EXAMPLE_CHATLIST_RESPONSE: { data: any[] } = {
  data: [
    {
      id: "4",
      type: "chat_only",
      attributes: {
        id: 4,
        sender_id: 276,
        receiver_id: 0,
        name: "First Chat",
        user_name: "",
        user_id: 0,
        profile_image: "",
        unread_message: 11,
        is_archived: false,
        is_deleted: true,
        is_other_user_online: true,
        account_type:"Band",
        last_message: {
          data: {
            id: "26",
            type: "chat_message",
            attributes: {
              id: 26,
              message: "Let's check it now",
              account_id: 276,
              chat_id: 4,
              created_at: "2024-04-10T10:21:04.294Z",
              updated_at: "2024-04-10T10:21:04.294Z",
              is_mark_read: false,
              message_type: "text",
              attachments: "",
              from_other_party: false,
              show_id: 0,
              show_title: "",
              show_image: "",
              show_date: "",
              show_time: "",
              show_location: "",
            },
          },
        },
      },
    },
    {
      id: "4",
      type: "chat_only",
      attributes: {
        id: 4,
        sender_id: 276,
        receiver_id: 0,
        name: "First Chat",
        user_name: "",
        user_id: 0,
        photo: undefined,
        unread_message: 11,
        is_archived: false,
        is_deleted: true,
        is_other_user_online: true,
        account_type:"Band",
        last_message: {
          data: {
            id: "26",
            type: "chat_message",
            attributes: {
              id: 26,
              message: "Let's check it now",
              account_id: 276,
              chat_id: 4,
              created_at: "2024-04-10T10:21:04.294Z",
              updated_at: "2024-04-10T10:21:04.294Z",
              is_mark_read: false,
              message_type: "text",
              attachments: "",
              from_other_party: false,
              show_id: 0,
              show_title: "",
              show_image: "",
              show_date: "",
              show_time: "",
              show_location: "",
            },
          },
        },
      },
    },
    {
      id: "5",
      type: "chat_only",
      attributes: {
        id: 5,
        sender_id: 276,
        receiver_id: 0,
        name: "First Chat",
        user_name: "",
        user_id: 0,
        profile_image: "",
        unread_message: 11,
        is_archived: true,
        is_deleted: false,
        is_other_user_online: true,
        last_message: {
          data: {
            id: "26",
            type: "chat_message",
            attributes: {
              id: 26,
              message: "Let's check it now",
              account_id: 276,
              chat_id: 4,
              created_at: "2024-04-10T10:21:04.294Z",
              updated_at: "2024-04-10T10:21:04.294Z",
              is_mark_read: false,
              message_type: "text",
              attachments: "",
              from_other_party: false,
              show_id: 0,
              show_title: "",
              show_image: "",
              show_date: "",
              show_time: "",
              show_location: "",
            },
          },
        },
      },
    },
  ],
};



jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve("27")),
  set: jest.fn().mockImplementation(() => Promise.resolve([])),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(),
  PERMISSIONS: {
    CAMERA: 'mock_camera_permission',
    WRITE_EXTERNAL_STORAGE: 'mock_write_external_storage_permission',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    NEVER_ASK_AGAIN: 'never_ask_again',
  },
}));

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData.js', () => ({
  ExceptionsManager:{
    handleException:jest.fn()
  },
  isDisabled:jest.fn()
}));

const mockAPICall = jest.fn().mockImplementation((instance: any, apiCallID: string, apiData: any, linkingProps: any) => {
  const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  msgSucessRestAPI.addData(getName(MessageEnum.NavigationPropsMessage), linkingProps);
  instance[apiCallID] = msgSucessRestAPI.messageId
  const { receive: mockResponse } = instance
  mockResponse("test", msgSucessRestAPI)
})

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.doMock("react-native", () => ({ Platform: { OS: "ios" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "ios");
    jest.spyOn(runEngine, "sendMessage");

    global.setTimeout=jest.fn().mockImplementation((params1 : any,params2)=>{
      params1()
      }) as any

  });

  test("Rendering of the Chat Screen", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      jest.spyOn(instance, "send");
    });

    when("I navigate to Chat", async () => {
      // The initial required APIs

      const msgToken = new Message(getName(MessageEnum.SessionResponseMessage));
      msgToken.addData(getName(MessageEnum.SessionResponseToken), token);
      const meta = { meta: { id: accountId } };
      msgToken.addData(
        getName(MessageEnum.SessionResponseData),
        JSON.stringify(meta)
      );
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
        EXAMPLE_CHATLIST_RESPONSE
      );

      instance.getChatListApiCallId = msgValidationAPI.messageId;
      instance.createChatRoomApiCallId = msgValidationAPI.messageId;
      instance.createChatRoom("room")
      instance.createChatRoom('')
      runEngine.sendMessage("Unit Test", msgValidationAPI);
      await instance.getToken()
    const  mockchatresposne = {
        "data": [
            {
                "id": "265",
                "type": "chat",
                "attributes": {
                    "id": 265,
                    "name": "First chat",
                    "sender_id": 657,
                    "receiver_id": 718
                }
            }
        ],
        "meta": {
            "message": "Conversation already present"
        }
    }
    const  mockchatresposne2 = {
      "data": 
          {
              "id": "265",
              "type": "chat",
              "attributes": {
                  "id": 265,
                  "name": "First chat",
                  "sender_id": 657,
                  "receiver_id": 718
              }
          }
    
  }
      instance.handleCreateChatApiResponse(mockchatresposne)
      instance.handleCreateChatApiResponse(mockchatresposne2)
      const getChatListMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getChatListMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getChatListMsg.messageId
      );
      getChatListMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [
            {
              token: "Invalid token",
            },
          ],
        }
      );
      instance.getChatListApiCallId = getChatListMsg.messageId;
      runEngine.sendMessage("Unit Test", getChatListMsg);
      instance.setState({showDetails:true,selectedPic:'test'})
      instance.setState({selectedPic:'test'})
      let textInputComponent = chatWrapper.findWhere(
        (node) => node.prop("testID") === "txtMsg" 
      );
      textInputComponent.prop("onChangeText")( "message");
      
      instance.handleSendMessage()
      chatWrapper
      .findWhere((node) => node.prop("testID") === "cancelSendImage")
      .simulate("press");
      instance.setState({ archiveList: mockResponse,archiveSelected:true,showDetails:false });
      
      chatWrapper
        .findWhere((node) => node.prop("testID") === "navigationBackButton")
        .simulate("press");
        chatWrapper
        .findWhere((node) => node.prop("testID") === "navigationBackButton")
        .simulate("press");
      chatWrapper
        .findWhere((node) => node.prop("testID") === "archivedTxt")
        .simulate("press");

      const flatList = chatWrapper.findWhere(
        (node) => node.prop("testID") === "swipeListView"
      );
      mockResponse.forEach(() => {
        let hiddenItem = flatList.renderProp("renderHiddenItem")(
          {
            item: {
              id: 1,
              user_name: "Abc",
              unreadCount: 0,
              lastMessage: "",
              profile_image: "",
              online: true,
            },
          },
          []
        );

        hiddenItem
          .findWhere((node) => node.prop("testID") === "archiveChat")
          .simulate("press");

        hiddenItem
          .findWhere((node) => node.prop("testID") === "deleteChat")
          .simulate("press");
      });
    });

    then("Chat will load", () => {
      expect(instance.state.archiveSelected).toBe(true);
    });
  });

  test("Testing archival of chats", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      jest.spyOn(instance, "send");
    });

    when("archiveList is empty and archiveSelected is false", () => {
      instance.setState({
        archiveList: [],
        archiveSelected: false,
      });

      const flatList = chatWrapper.findWhere(
        (node) => node.prop("testID") === "swipeListView"
      );
      let visible = chatWrapper.findWhere((node) => node.prop("data-testID") === "Press");
            let modalOpen = chatWrapper.findWhere((node) => node.prop("testID") === "blockBtn");
            modalOpen.simulate("press");
      mockAPICall(instance,'addBlockeduserApiCallId',{})
      let modalPress = chatWrapper.findWhere((node) => node.prop("testID") === "modalClose");
      modalPress.simulate("press");

      
      mockResponse.forEach(() => {
        let hiddenItem = flatList.renderProp("renderHiddenItem")(
          {
            item: {
              id: 1,
              user_name: "Abc",
              unreadCount: 0,
              lastMessage: "",
              profile_image: "",
              online: false,
            },
          },
          []
        );

        hiddenItem
          .findWhere((node) => node.prop("testID") === "archiveChat")
          .simulate("press");

        hiddenItem
          .findWhere((node) => node.prop("testID") === "deleteChat")
          .simulate("press");
      });
    });

    then(
      "Render UI when archiveList is empty and archiveSelected is false",
      () => {
        expect(instance.state.archiveSelected).toBe(false);
      }
    );

    when("User archives a chat", () => {
      instance.setState({ archiveSelected: true, chatList: mockResponse });

      chatWrapper
        .findWhere((node) => node.prop("testID") === "navigationBackButton")
        .simulate("press");
      const flatList = chatWrapper.findWhere(
        (node) => node.prop("testID") === "swipeListView"
      );
      mockResponse.forEach(() => {
        let hiddenItem = flatList.renderProp("renderHiddenItem")(
          {
            item: {
              id: 1,
              user_name: "Abc",
              unreadCount: 0,
              lastMessage: "",
              profile_image: "",
              online: false,
            },
          },
          []
        );

        hiddenItem
          .findWhere((node) => node.prop("testID") === "archiveChat")
          .simulate("press");

        hiddenItem
          .findWhere((node) => node.prop("testID") === "deleteChat")
          .simulate("press");
      });
    });

    then("Chat will load with archived list", () => {
      expect(instance.state.archiveSelected).toBe(false);
    });
  });

  test("Testing APIs", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      jest.spyOn(instance, "send");
    });

    when("I send the API requests through runengine", () => {

      const getChatListApi = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getChatListApi.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getChatListApi.messageId
      );

      getChatListApi.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        EXAMPLE_CHATLIST_RESPONSE
      );

      instance.getChatListApiCallId = getChatListApi.messageId;
      instance.createChatRoomApiCallId = getChatListApi.messageId;
      runEngine.sendMessage("Unit Test", getChatListApi);

      const sendMessage = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      sendMessage.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        sendMessage.messageId
      );
      sendMessage.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: {
          id: 65,
          account_id: 277,
          chat_id: 5,
          message: "Hello again",
          created_at: "2024-04-12T08:32:14.295Z",
          updated_at: "2024-04-12T08:32:14.295Z",
          is_mark_read: false,
          message_type: "text",
          attachment: null,
        },
      });
      instance.sendMessageApiCallId = sendMessage.messageId;
      runEngine.sendMessage("Unit Test", sendMessage);

      const createRoom = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      createRoom.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        createRoom.messageId
      );
      createRoom.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: {
          id: "5",
          type: "chat",
          attributes: {
            id: 5,
            name: "Some Chat",
            sender_id: 277,
            receiver_id: 276,
          },
        },
      });
      instance.createChatRoomApiCallId = createRoom.messageId;
      runEngine.sendMessage("Unit Test", createRoom);

      const getMessages = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getMessages.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getMessages.messageId
      );
      getMessages.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [
          {
            id: "10",
            type: "chat_message",
            attributes: {
              id: 10,
              message: "Hey",
              account_id: 276,
              chat_id: 4,
              created_at: "2024-04-09T05:27:42.496Z",
              updated_at: "2024-04-09T07:22:49.079Z",
              is_mark_read: true,
              message_type: "text",
              attachments: "",
              from_other_party: false,
            },
          },
          {
            id: "26",
            type: "chat_message",
            attributes: {
              id: 26,
              message: "Let's check it now",
              account_id: 276,
              chat_id: 4,
              created_at: "2024-04-10T10:21:04.294Z",
              updated_at: "2024-04-10T10:21:04.294Z",
              is_mark_read: false,
              message_type: "text",
              attachments: "",
              from_other_party: true,
            },
          },
        ],
      });
      instance.getChatHistoryApiCallId = getMessages.messageId;
      runEngine.sendMessage("Unit Test", getMessages);

      const getMessagesFail = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getMessagesFail.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getMessagesFail.messageId
      );
      getMessagesFail.addData(getName(MessageEnum.RestAPIResponceErrorMessage), []);
      instance.getChatHistoryApiCallId = getMessagesFail.messageId;
      runEngine.sendMessage("Unit Test", getMessagesFail);
    });

    then("the data is saved properly", () => {
      expect(instance.getChatHistoryApiCallId).toBeDefined();
    });
  });

  test("UI rendering", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;
    let renderConversationItem: ShallowWrapper;
    let chatItemTouchable: ShallowWrapper;

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      jest.spyOn(instance, "send");
    });

    when("I am loading renderConversationItem with correct parameter", () => {
      renderConversationItem = shallow(
        <instance.renderConversationItem
          item={{
            id: 1,
            user_name: "Abc",
            unreadCount: 2,
            lastMessage: "",
            profile_image: "",
            online: false,
          }}
        />
      );
      renderConversationItem = shallow(
        <instance.renderConversationItem
          item={{
            id: 1,
            user_name: "Abc",
            unreadCount: 0,
            lastMessage: "",
            profile_image: "Abc",
            online: true,
          }}
        />
      );
      chatItemTouchable = renderConversationItem.findWhere(
        (node) => node.prop("testID") === "chatItem"
      );
      chatItemTouchable.simulate("press");
      chatItemTouchable = renderConversationItem.findWhere(
        (node) => node.prop("testID") === "dotBtn"
      );
      chatItemTouchable.simulate("press");
    });

    then("renderConversationItem loads up", () => {
      expect(chatItemTouchable).toBeDefined();
    });
  });

  test("User interactions", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;
    let chatItemTouchable: ShallowWrapper;
    let renderConversationItem: ShallowWrapper;

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      jest.spyOn(instance, "send");
    });

    when("I change text in txtMsgInput", () => {
      renderConversationItem = shallow(
        <instance.renderConversationItem
          item={{
            id: 1,
            user_name: "Abc",
            unreadCount: 0,
            lastMessage: "",
            profile_image: "Abc",
            online: true,
          }}
        />
      );
      chatItemTouchable = renderConversationItem.findWhere(
        (node) => node.prop("testID") === "chatItem"
      );
      chatItemTouchable.simulate("press");
      chatWrapper
        .findWhere((node) => node.prop("testID") === "txtMsgInput")
        .simulate("changeText", "message");

    });
    then("the value gets updated", () => {
      expect(instance.state.textMessage).toBe("message");
    });

    when("I click btnSend", () => {
      chatWrapper
        .findWhere((node) => node.prop("testID") === "btnSend")
        .simulate("press");
    });

    then("the api is called", () => {
      expect(instance.sendMessageApiCallId).toBeDefined();
    });

    when("I click the back button", () => {
      chatWrapper
        .findWhere((node) => node.prop("testID") === "navigationBackButton")
        .simulate("press");
    });

    then("it navigates back", () => {

    });
  });

  test("Cleaning up", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;
    let renderConversationItem: ShallowWrapper;
    let chatItemTouchable: ShallowWrapper;

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      jest.spyOn(instance, "send");
    });

    when("I exit the screen", () => {
      renderConversationItem = shallow(
        <instance.renderConversationItem
          item={{
            id: 1,
            user_name: "Abc",
            unreadCount: 0,
            lastMessage: "",
            profile_image: "Abc",
            online: false,
          }}
        />
      );
      chatItemTouchable = renderConversationItem.findWhere(
        (node) => node.prop("testID") === "chatItem"
      );
      chatItemTouchable.simulate("press");
      chatWrapper.unmount();
    });

    then("socket is closed", () => {
      expect(chatWrapper.exists()).toBe(true);
    });
  });

  test("API Calls", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;
    let renderConversationItem: ShallowWrapper;
    let chatItemTouchable: ShallowWrapper;

    let testFn = jest.fn();

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
    });

    when("I call the send event API", () => {
      instance.getMessages = testFn;

      let sendEventApiRequestMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      sendEventApiRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        sendEventApiRequestMsg.messageId
      );

      sendEventApiRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceErrorMessage),
        {}
      );

      instance.sendEventApiCallId = sendEventApiRequestMsg.messageId;
      runEngine.sendMessage("Unit Test", sendEventApiRequestMsg);

      sendEventApiRequestMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      sendEventApiRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        sendEventApiRequestMsg.messageId
      );

      sendEventApiRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );

      instance.sendEventApiCallId = sendEventApiRequestMsg.messageId;
      runEngine.sendMessage("Unit Test", sendEventApiRequestMsg);
    });

    then("getMessages is called", () => {
      expect(testFn).toHaveBeenCalled();
    });
  });

  test("Web socket", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let instance: Chat;

    let tmpFn = (msg: ISocketMessage) => { };

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;

      tmpFn = instance.handleReceivedSocketMessage
    });

    when("websocket is created", () => {
      tmpFn({
        identifier: 'unique_identifier',
        message: {
          type: 'comments',
          sub_type: 'chat_message',
          chat_id: 12345,
          message: 'Hello, this is a test message',
          event: 'message_received'
        }
      });

      tmpFn({
        identifier: 'unique_identifier',
        message: {
          type: 'chat',
          sub_type: 'chat_message',
          chat_id: 12345,
          message: 'Hello, this is a test message',
          event: 'message_received'
        }
      });

      tmpFn({
        identifier: 'unique_identifier',
        message: {
          type: 'chat',
          sub_type: 'marked_read',
          chat_id: 12345,
          message: 'Hello, this is a test message',
          event: 'message_received'
        }
      });
    });

    then("it can connect to it", () => {
      expect(chatWrapper.exists()).toBe(true);
    });
  });

  test("Render event", ({ given, when, then }) => {
    let chatWrapper: ShallowWrapper;
    let renderEventWrapper: ShallowWrapper;
    let instance: Chat;
    let handleSendImage = jest.fn()
    let handleSelectPic = jest.fn()

    given("The initial setup", () => {

      // Setup the scenario

      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
      instance.showModal()
      instance.hideModal()
      instance.isStringNullOrBlank('')
      instance.setState({ selectedChatId: '' })
      instance.markAsRead()
      instance.setState({ selectedChatId: '176' })
      instance.markAsRead()
      instance.handleShareAPI()
      instance.handleChatAction(28, 'Test')
      instance.setState({ archiveSelected: true })
      const conversation = [
         {
          id: 28,
        },
        {
          id: 29,
        }]
      const conversation2 = [
        {
          id: 27,
        }
      ]
      instance.setState({ archiveList: conversation })
      
      instance.handleArchiveData(28, 'archive')
      instance.handleChatData(28, 'archive')
      instance.setState({ archiveList: [] })
      instance.handleChatData(28, 'Test')
      instance.handleChatAction(20, 'Test')
      instance.setState({ chatList: conversation2 })
      instance.handleChatData(28, 'Test')

    let data =  [{
        "id": "80",
        "type": "chat_only",
        "attributes": {
            "id": 80,
            "sender_id": 565,
            "receiver_id": 507,
            "name": "testsanjay",
            "is_deleted": false,
            "is_archived": false,
            "user_name": "Zeke",
            "user_id": 507,
            "is_other_user_online": false,
            "profile_image": "",
            "unread_message": 0,
            "last_message": {
                "data": {
                    "id": "786",
                    "type": "chat_message",
                    "attributes": {
                        "id": 786,
                        "message": null,
                        "account_id": 565,
                        "chat_id": 80,
                        "show_id": null,
                        "show_title": null,
                        "show_image": "",
                        "show_date": null,
                        "show_time": null,
                        "show_location": null,
                        "created_at": "2024-09-16T02:42:07.908-07:00",
                        "updated_at": "2024-09-16T02:46:40.397-07:00",
                        "is_mark_read": true,
                        "message_type": "image",
                        "attachments": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBblFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--b75927d27de48a981a352095df70d48b64d32893/1864472.png",
                        "from_other_party": false
                    }
                }
            }
        }
    },
    {
      "id": "80",
      "type": "chat_only",
      "attributes": {
          "id": 80,
          "sender_id": 565,
          "receiver_id": 507,
          "name": "testsanjay",
          "is_deleted": false,
          "is_archived": true,
          "user_name": "Zeke",
          "user_id": 507,
          "is_other_user_online": false,
          "profile_image": "",
          "unread_message": 0,
          "last_message": {
              "data": {
                  "id": "786",
                  "type": "chat_message",
                  "attributes": {
                      "id": 786,
                      "message": null,
                      "account_id": 565,
                      "chat_id": 80,
                      "show_id": null,
                      "show_title": null,
                      "show_image": "",
                      "show_date": null,
                      "show_time": null,
                      "show_location": null,
                      "created_at": "2024-09-16T02:42:07.908-07:00",
                      "updated_at": "2024-09-16T02:46:40.397-07:00",
                      "is_mark_read": true,
                      "message_type": "image",
                      "attachments": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBblFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--b75927d27de48a981a352095df70d48b64d32893/1864472.png",
                      "from_other_party": false
                  }
              }
          }
      }
  }]

    let data2 =  [{
      "id": "80",
      "type": "chat_only",
      "attributes": {
          "id": 80,
          "sender_id": 565,
          "receiver_id": 507,
          "name": "testsanjay",
          "is_deleted": false,
          "is_archived": false,
          "user_name": "Zeke",
          "user_id": 507,
          "is_other_user_online": false,
          "profile_image": "",
          "unread_message": 0,
          "last_message": {
            
          }
      }
  },
  {
    "id": "80",
    "type": "chat_only",
    "attributes": {
        "id": 80,
        "sender_id": 565,
        "receiver_id": 507,
        "name": "testsanjay",
        "is_deleted": false,
        "is_archived": true,
        "user_name": "Zeke",
        "user_id": 507,
        "is_other_user_online": false,
        "profile_image": "",
        "unread_message": 0,
        "last_message": {
          
        }
    }
}]

    instance.handleChatListApiResponse({data:data})
    instance.handleChatListApiResponse({data:data2})

      let msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );

      instance.deleteChatApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceErrorMessage),
        {}
      );

      instance.deleteChatApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    when("renderEvent is invoked", () => {
      const sampleItem = {
        attributes: {
          from_other_party: false,
          show_image: "https://example.com/image.jpg",
          show_title: "Sample Event Title",
          show_date: "2023-07-24",
          show_time: "2023-07-24T15:30:00Z",
          show_location: "123 Sample Street, Sample City",
          is_mark_read: true,
        }
      };
      renderEventWrapper = shallow(<instance.renderEvent {...sampleItem} />);
    });

    then("it renders properly", () => {
      expect(chatWrapper.exists()).toBe(true);
    });

    when("user click on hamburger icon", () => {
      instance.setState({ showDetails: false })
      chatWrapper.findWhere((node) => node.prop("testID") === "hamburgerButton").simulate("press")
      instance.setState({ showDetails: true })
      chatWrapper.findWhere((node) => node.prop("testID") === "hamburgerButton").simulate("press")
    })

    when('renderMessage invoked', async () => {
      const item = [
        {
          id: "15",
          type: "chat_message",
          attributes: {
            id: 15,
            message: "gd!",
            account_id: 10,
            chat_id: 28,
            created_at: "2024-03-21T08:56:25.771Z",
            updated_at: "2024-03-21T08:56:25.771Z",
            is_mark_read: true,
            attachments: null,
            from_other_party: false,
            message_type: 'text',
          }
        },
        {
          id: "15",
          type: "chat_message",
          attributes: {
            id: 15,
            message: "gd!",
            account_id: 10,
            chat_id: 28,
            created_at: "2024-03-21T08:56:25.771Z",
            updated_at: "2024-03-21T08:56:25.771Z",
            is_mark_read: false,
            attachments: null,
            from_other_party: true,
            message_type: 'image',
          }
        },

        {
          id: "15",
          type: "chat_message",
          attributes: {
            id: 15,
            message: "gd!",
            account_id: 10,
            chat_id: 28,
            created_at: "2024-03-21T08:56:25.771Z",
            updated_at: "2024-03-21T08:56:25.771Z",
            is_mark_read: false,
            attachments: null,
            from_other_party: false,
            message_type: 'text',
          }
        },
        {
          id: "15",
          type: "chat_message",
          attributes: {
            id: 15,
            message: "gd!",
            account_id: 10,
            chat_id: 28,
            created_at: "2024-03-21T08:56:25.771Z",
            updated_at: "2024-03-21T08:56:25.771Z",
            is_mark_read: false,
            attachments: null,
            from_other_party: false,
            message_type: 'event',
            eventable: {
              title: 'event Title',
              description: 'event Description',
              date: '2024-03-21',
              image: 'image-test',
              time: '03:00',
              location: 'London'
            }
          }
        },
      ]
      instance.renderChat({ item: item[0] })
      instance.renderChat({ item: item[1] })
      instance.renderChat({ item: item[2] })
      instance.renderChat({ item: item[3] })
      const events = [
        {
          id: "15",
          type: "chat_message",
          attributes: {
            id: 15,
            message: "gd!",
            account_id: 10,
            chat_id: 28,
            created_at: "2024-03-21T08:56:25.771Z",
            updated_at: "2024-03-21T08:56:25.771Z",
            is_mark_read: false,
            attachments: null,
            from_other_party: false,
            message_type: 'test event',
            eventable: {
              date: '2024-03-21',
              image: 'image-test',
              time: '03:00',
              location: 'London'
            }
          }
        },
        {
          id: "15",
          type: "chat_message",
          attributes: {
            id: 15,
            message: "gd!",
            account_id: 10,
            chat_id: 28,
            created_at: "2024-03-21T08:56:25.771Z",
            updated_at: "2024-03-21T08:56:25.771Z",
            is_mark_read: false,
            attachments: null,
            from_other_party: true,
            message_type: 'test event',
            eventable: {
              date: '2024-03-21',
              image: 'image-test',
              time: '03:00',
              location: 'London'
            }
          }
        },
      ]

      instance.renderEvent(events[0])
      instance.renderEvent(events[1])
      const eventMockData = {
        attachments: 'test',
        message_type: 'event',
        show_title: 'test',
      }
      const mockLastEventMessage = {
        eventable: {
          date: '2024-08-16',
          image: 'test',
        },
        ...eventMockData
      }
      const mockLastEventMessage1 = {
        eventable: {
          date: null,
          image: 'test',
        },
        ...eventMockData
      }

      
     
      const mockLastEventMessage2 = {
        eventable: {
          date: '2024-08-16',
          image: 'test',
        },
        show_title: 'test',
        attachments: 'test',
        message_type: 'image',
        
      }
      instance.renderLastMessage(mockLastEventMessage)
      instance.renderLastMessage(mockLastEventMessage1)
      instance.renderLastMessage(mockLastEventMessage2)
    })
    when('i want to send image from gallary', async () => {
      chatWrapper.setState({ showDetails: true })
      const cameraBtn = chatWrapper.findWhere(node => node.prop("testID") === "btnShowPicSelector")
      cameraBtn.simulate('press')
      instance.handleSelectPic = handleSelectPic
      handleSelectPic()
      instance.setState({ showCameraGalleryPopup: true })
      chatWrapper.findWhere(node => node.prop("testID") === "galleryOption").simulate('press')
      instance.setState({ isLoading: true, showCameraGalleryPopup: false })
      Platform.OS = 'ios'
      await instance.handleGallery()
      handleSendImage()
    })

    when('i want to send image from Camera', async () => {
      chatWrapper.setState({ showDetails: true })
      const cameraBtn = chatWrapper.findWhere(node => node.prop("testID") === "btnShowPicSelector")
      cameraBtn.simulate('press')
      instance.handleSelectPic = handleSelectPic
      handleSelectPic()
      chatWrapper.findWhere(node => node.prop("testID") === "cameraOption").simulate('press')
      Platform.OS = 'android'
      await instance.handleCamera();
      Platform.OS = 'ios'
      await instance.handleCamera();
      handleSendImage()
    })

    when('i cancel to pick image',  async () => {
      instance.handleCancelPopup()
      instance.setState({showDetails:true})
      StorageProvider.get.mockResolvedValue(JSON.stringify(true))
      await instance.onPressBackFromDetails()
      StorageProvider.get.mockResolvedValue(JSON.stringify(null))
      await instance.onPressBackFromDetails()
    })
  });

  test("Profile Nav From Chat", ({given, when, then}) => {
    let chatWrapper: ShallowWrapper;
    let renderEventWrapper: ShallowWrapper;
    let instance: Chat;

    given('Render Profile Nav Buttons', () => {
      chatWrapper = shallow(<Chat {...screenProps} />);
      instance = chatWrapper.instance() as Chat;
    })

    when("User Try To Navigate To Other User Profile", () => {
      const flatList = chatWrapper.findWhere(
        (node) => node.prop("testID") === "swipeListView"
      );
      let hiddenItem = flatList.renderProp("renderItem")(
        {
          item: {
            id: 1,
            user_name: "Abc",
            unreadCount: 0,
            lastMessage: "",
            profile_image: undefined,
            online: true,
            account_type:'Band'
          },
        },
        []
      );
      instance.handleShareAPI()
      hiddenItem
        .findWhere((node) => node.prop("testID") === "ChatListUserProfileNav")
        .simulate("press");
      
       hiddenItem = flatList.renderProp("renderItem")(
          {
            item: {
              id: 1,
              user_name: "Abc",
              unreadCount: 0,
              lastMessage: "",
              profile_image: "",
              online: true,
              account_type:'Artist',
              attributes:{              account_type:'Artist'
              }
            },
          },
          []
        );

        hiddenItem
        .findWhere((node) => node.prop("testID") === "ChatListUserProfileNav")
        .simulate("press");


        hiddenItem = flatList.renderProp("renderItem")(
          {
            item: {
              id: 1,
              user_name: "Abc",
              unreadCount: 0,
              lastMessage: "",
              profile_image: "",
              online: true,
              account_type:'Fan'
            },
          },
          []
        );

        hiddenItem
        .findWhere((node) => node.prop("testID") === "ChatListUserProfileNav")
        .simulate("press");

      instance.setState({showDetails:true})
      chatWrapper
      .findWhere((node) => node.prop("testID") === "ChatDetailsUserProfileNav")
      .simulate("press");
    })
  })
  test("The APIs should not be called if token is empty",({given,when,then})=>{
    let chatWrapper:ShallowWrapper;
    let instance:Chat;
        given("user enters chat page",()=>{
          chatWrapper = shallow(<Chat {...screenProps}/>);
          instance =  chatWrapper.instance() as Chat
        });
        when("token is empty or invalid",async()=>{
          instance.setState({token:""});
        })
        then("the api would not be called",async()=>{
          spyOn(instance,"handleSendMessage")
          instance.handleSendMessage();
          await instance.NavToUserProfile("dfjk",'test');
          instance.handleSendImage();
          await instance.deleteChat("45");
          await instance.handleShareAPI();
          instance.createChat("34","")
          instance.updateOnlineStatus(true)
          expect(instance.handleSendMessage).toBeCalledTimes(1)
        })
      })

      test("The APIs should be called if token is valid",({given,when,then})=>{
        let chatWrapper:ShallowWrapper;
        let instance:Chat;
            given("user enters chat page",()=>{
              chatWrapper = shallow(<Chat {...screenProps}/>);
              instance =  chatWrapper.instance() as Chat
            });
            when("token is valid",async()=>{
              instance.setState({token:"token"});
            })
            then("the api would be called",async()=>{
              spyOn(instance,"handleSendMessage")
              instance.handleSendMessage();
              await instance.NavToUserProfile("dfjk",'test');
              instance.handleSendImage();
              await instance.deleteChat("45");
              await instance.handleShareAPI();
              instance.createChat("34","")
              instance.updateOnlineStatus(true)
              instance.markAsRead();
              instance.handleSendMessage()
              expect(instance.handleSendMessage).toBeCalledTimes(2)
            })
          })
});
