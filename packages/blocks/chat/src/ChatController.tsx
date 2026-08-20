import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { customAlert, getStorageData, removeStorageData, setStorageData } from "../../../framework/src/Utilities";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { DeviceEventEmitter, PermissionsAndroid, Platform } from "react-native";
import {
  lightTheme,
  redesignTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
} from "../../utilities/src/Colors";
export const baseURL = require("../../../framework/src/config.js").baseURL;
// Customizable Area End

export const configJSON = require("./config");

// Customizable Area Start
export interface IChat {
  id: string;
  muted: boolean;
  unreadCount: number;
  lastMessage: string;
  name: string;
}
interface IMessage {
  type: string;
  sub_type: string;
  chat_id: number;
  message?: string;
  event?: string;
};

export interface ISocketMessage {
  identifier: string;
  message: IMessage;
};

interface IMessageAttributes {
  id: number;
  message: string;
  account_id: number;
  chat_id: number;
  show_id: null | string;
  show_title: null | string;
  show_image: string;
  show_date: null | string;
  show_time: null | string;
  show_location: null | string;
  created_at: string;
  updated_at: string;
  is_mark_read: boolean;
  message_type: string;
  attachments: string;
  from_other_party: boolean;
};

export interface IMessageItem {
  id: string;
  type: string;
  attributes: IMessageAttributes;
};

interface IChatMessageAttributes {
  id: number;
  message: string;
  account_id: number;
  chat_id: number;
  show_id: number | null;
  show_title: string | null;
  show_image: string;
  show_date: string | null;
  show_time: string | null;
  show_location: string | null;
  created_at: string;
  updated_at: string;
  is_mark_read: boolean;
  message_type: string;
  attachments: string;
  from_other_party: boolean;
};

interface ILastMessage {
  data: {
    id: string;
    type: string;
    attributes: IChatMessageAttributes;
  };
};

interface IChatAttributes {
  id: number;
  sender_id: number;
  receiver_id: number;
  name: string;
  is_deleted: boolean;
  is_archived: boolean;
  user_name: string;
  user_id: number;
  is_other_user_online: boolean;
  profile_image: string;
  unread_message: number;
  last_message: ILastMessage;
};

export interface IChatObject {
  id: string;
  type: string;
  attributes: IChatAttributes;
};

export interface IChatItem {
  id: string | number;
  user_name: string;
  unreadCount: number;
  lastMessage: string;
  profile_image: string;
  online: boolean;
};
// Customizable Area End
export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: string;
  accountId: number;
  chatName: string;
  chatList: any[];
  chatHistory: any;
  isVisibleModal: boolean;
  archiveList: any[];
  archiveSelected: boolean;
  showDetails: boolean;
  selectedChatId: string;
  textMessage: string;
  markedAsRead: boolean;
  userName: string;
  profileImage: string;
  isLoading: boolean;
  showId: string;
  chatId: string;
  sending: boolean;
  showCameraGalleryPopup: boolean;
  selectedPic:string,
  showBlockList:boolean,
  blockUserId:string
  userId:string,
  userAccountType:string
  isDarkMode: boolean;


  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class ChatController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  createChatRoomApiCallId: string = "";
  getChatListApiCallId: string = "";
  getChatHistoryApiCallId: string = "";
  sendMessageApiCallId: string = "";
  sendEventApiCallId: string = "";
  updateOnlineStatusApiCallId: string = "";
  chatWebSocket: any = undefined;
  deleteChatApiCallId: string = "";
    addBlockeduserApiCallId: any;
  profileThemeListener: { remove: () => void } | null = null;
  private pendingApiRequests: Record<string, { name: string; url: string; method: string; payload?: any }> = {};
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      accountId: -1,
      chatName: "",
      chatList: [],
      chatHistory: [],
      isVisibleModal: false,
      archiveList: [],
      archiveSelected: false,
      showDetails: false,
      selectedChatId: "",
      textMessage: "",
      markedAsRead: false,
      userName: "",
      profileImage: "",
      isLoading: false,
      showId: "",
      chatId: "",
      sending: false,
      showCameraGalleryPopup:false,
      selectedPic:'',
      showBlockList:false,
      blockUserId:'',
      userId:'',
      userAccountType:'',
      isDarkMode: true,

      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start

  private buildApiUrl = (endpoint: string) => {
    return endpoint.indexOf("://") === -1
      ? `${baseURL}/${endpoint}`
      : endpoint;
  };

  private trackApiRequest = (
    callId: string,
    name: string,
    endpoint: string,
    method: string,
    payload?: any
  ) => {
    const url = this.buildApiUrl(endpoint);
    this.pendingApiRequests[callId] = { name, url, method, payload };
    console.log(`[Chat] ${name} API request:`, { url, method, payload });
  };

  private logApiResponse = (
    callId: string,
    responseJson: any,
    errResponse: any
  ) => {
    const request = this.pendingApiRequests[callId];
    const apiName = request?.name || this.getApiNameByCallId(callId);

    if (errResponse || responseJson?.errors) {
      console.log(`[Chat] ${apiName} API error:`, {
        url: request?.url,
        method: request?.method,
        payload: request?.payload,
        error: errResponse || responseJson?.errors,
        response: responseJson,
      });
    } else if (request) {
      console.log(`[Chat] ${apiName} API response:`, {
        url: request.url,
        method: request.method,
        response: responseJson,
      });
    }

    delete this.pendingApiRequests[callId];
  };

  private getApiNameByCallId = (callId: string) => {
    if (callId === this.getChatListApiCallId) return "getChatList";
    if (callId === this.createChatRoomApiCallId) return "createChat";
    if (callId === this.getChatHistoryApiCallId) return "getChatHistory";
    if (callId === this.sendMessageApiCallId) return "sendMessage";
    if (callId === this.sendEventApiCallId) return "sendEvent";
    if (callId === this.updateOnlineStatusApiCallId) return "updateOnlineStatus";
    if (callId === this.deleteChatApiCallId) return "deleteChat";
    if (callId === this.addBlockeduserApiCallId) return "blockUser";
    return "unknown";
  };


  async componentDidMount() {
    super.componentDidMount();
    console.log('ChatController: componentDidMount called');
    this.getToken();
    this.loadStoredChatData();
    this.loadChatTheme();
    
    this.props.navigation.addListener("willFocus", () => {
      console.log('ChatController: willFocus listener triggered');
      this.getToken();
      this.loadStoredChatData();
    });
  }

  loadStoredChatData = async () => {
    try {
      const storedUserName = await getStorageData("chat_user_name");
      const storedProfileImage = await getStorageData("profile_image");
      
      console.log("Loading stored chat data:", { storedUserName, storedProfileImage });
      
      if (storedUserName) {
        this.setState({ userName: storedUserName });
      }
      if (storedProfileImage) {
        this.setState({ profileImage: storedProfileImage });
      }
    } catch (error) {
      console.log("Error loading stored chat data:", error);
    }
  };

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    super.componentWillUnmount();
    this.chatWebSocket.close();
    this.updateOnlineStatus(false);
  }

  loadChatTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== "false" });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  getChatTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

 

  connectSocket = async (token: string) => {
    const subscriptionMessage = {
      command: "subscribe",
      identifier: JSON.stringify({
        channel: "GlobalChannel",
      }),
    }
    const subscriptionMessageStr = JSON.stringify(subscriptionMessage);

    this.chatWebSocket = new WebSocket(`${baseURL.replace("https", "wss")}/cable?token=${encodeURIComponent(token)}`);
    this.chatWebSocket.onopen = () => {
      this.chatWebSocket.send(subscriptionMessageStr);
    };
    this.chatWebSocket.onmessage = (event: any) => {
      if (this.state.markedAsRead) {
        this.setState({ markedAsRead: false });
        return;
      }

      this.handleReceivedSocketMessage(JSON.parse(event.data));
    };
  }

  handleReceivedSocketMessage = (chatData: ISocketMessage) => {
    if(chatData.message.type !== "chat") {
      return;
    }

     const {sub_type,type} = chatData.message;

    if(sub_type === "chat_message" || sub_type === "marked_read" || type === 'chat') {
      this.getMessages(`${chatData.message.chat_id}`)
      this.getChatList(true);
    }
  }

  getToken = async () => {
    const token = await getStorageData("authToken");
    this.setState({ token : token});
    const startChatWith = await getStorageData("startChatWith");

    console.log('ChatController: getToken - startChatWith:', startChatWith);

    removeStorageData("profile_image");
    removeStorageData("show_id");
    removeStorageData("chat_user_name");
    if (startChatWith) {
      console.log('ChatController: Starting chat with user:', startChatWith);
      this.createChat(startChatWith, token);
    }
    this.getChatList();
    this.connectSocket(token);
    this.updateOnlineStatus(true);
  };

  isStringNullOrBlank = (string: string) => {
    return string === undefined || string === null || string.length === 0;
  };

  showModal = () => {
    this.setState({ isVisibleModal: true });
  };

  hideModal = () => {
    this.setState({ isVisibleModal: false });
  };

  navigateToChatView = (chatId: string) => {
    console.log('ChatController: Navigating to chat view with ID:', chatId);
    this.getMessages(chatId);
    this.setState({ showDetails: true, selectedChatId: chatId });
  };

  getChatList = async (noLoading?: boolean) => {
    if (!this.state.token) {
      return;
    }
    if(!noLoading) {
      this.setState({ isLoading: true });
    }
    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getChatListApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getChatListApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethod
    );

    this.trackApiRequest(
      requestMessage.messageId,
      "getChatList",
      configJSON.getChatListApiEndPoint,
      configJSON.getApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getMessages = async (chatId: string) => {
    if(!this.state.token)
      return;

    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    };
    const msg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getChatHistoryApiCallId = msg.messageId;

    msg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getChatHistoryApiEndPoint + chatId
    );
    msg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    msg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethod
    );

    this.trackApiRequest(
      msg.messageId,
      "getChatHistory",
      configJSON.getChatHistoryApiEndPoint + chatId,
      configJSON.getApiMethod
    );

    runEngine.sendMessage(msg.id, msg);
  };

  createChatRoom = (chatName: string) => {
    if (this.isStringNullOrBlank(chatName)) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorAllFieldsAreMandatory,
        ""
      );
    } else {
      const header = {
        "Content-Type": configJSON.apiContentType,
        token: this.state.token,
      };
      const bodyData = {
        name: chatName,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );

      this.createChatRoomApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.createChatRoomApiEndPoint
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(bodyData)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.postApiMethod
      );

      this.trackApiRequest(
        requestMessage.messageId,
        "createChatRoom",
        configJSON.createChatRoomApiEndPoint,
        configJSON.postApiMethod,
        bodyData
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  };

  async receive(_: string, message: Message) {
    console.log('ChatController: Received message:', message.id);
    
    if (message.id === getName(MessageEnum.SessionResponseMessage)) {
      console.log('ChatController: Handling SessionResponseMessage');
      this.handleSessionResponseMessage(message);
    } else if (message.id === getName(MessageEnum.RestAPIResponceMessage)) {
      console.log('ChatController: Handling RestAPIResponceMessage');
      this.handleRestApiResponse(message);
    } else if (message.id === getName(MessageEnum.NavigationPayLoadMessage)) {
      console.log('ChatController: Handling NavigationPayLoadMessage');
      this.handleNavigationPayload(message);
    }
  }

  handleSessionResponseMessage = (message: Message) => {
    const authToken: string = message.getData(
      getName(MessageEnum.SessionResponseToken)
    );
    runEngine.debugLog("authToken", authToken);
    const messageData = JSON.parse(
      message.getData(getName(MessageEnum.SessionResponseData))
    );
    const accountId: number = messageData?.meta?.id;
    this.setState({ accountId });
    if (authToken) {
      this.setState({ token: authToken }, () => this.getChatList());
    }
  };

  handleNavigationPayload = (message: Message) => {
    console.log('ChatController: Handling navigation payload message');
    // The navigation payload might contain additional data
    // For now, we'll just ensure getToken is called
    this.getToken();
  };

  handleRestApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    const errResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );

    this.logApiResponse(apiRequestCallId, responseJson, errResponse);

    console.log('ChatController: API Response received:', {
      api: this.getApiNameByCallId(apiRequestCallId),
      responseJson: responseJson ? 'Present' : 'Null',
      errResponse: errResponse ? 'Present' : 'Null',
      hasErrors: responseJson?.errors ? 'Yes' : 'No'
    });

    if (responseJson?.errors) {
      console.log('ChatController: API Response errors:', responseJson.errors);
      this.handleErrorResponses(responseJson);
    }
    if (errResponse) {
      console.log('ChatController: API Error response:', errResponse);
      this.handleErrorResponses(errResponse);
    }

    if (this.getChatListApiCallId === apiRequestCallId) {
      this.handleChatListApiResponse(responseJson)
    } else if (apiRequestCallId === this.createChatRoomApiCallId) {
      this.handleCreateChatApiResponse(responseJson)
    } else if (apiRequestCallId === this.getChatHistoryApiCallId) {
      this.handleChatHistoryResponse(responseJson);
    } else if (apiRequestCallId === this.sendMessageApiCallId) {
      this.handleSendMessageResponse(responseJson);
    } else if (this.sendEventApiCallId === apiRequestCallId) {
      this.handleSendEventAPIResponse(responseJson)
    } else if (this.deleteChatApiCallId === apiRequestCallId) {
      this.handleDeleteChatResponse(responseJson)
    }else if (this.addBlockeduserApiCallId === apiRequestCallId) {
      this.handleBlockResponse(responseJson)
    }
  }
  handleBlockResponse=(responseJson:any)=>{
    if (responseJson != null && !responseJson.errors) {
      this.getChatList();
    }
    customAlert('User is blocked')
    this.setState({showBlockList: false})
  }
  dotBtnPress=(id:string)=>{
    this.setState({showBlockList:true,blockUserId:id})
  }
  handleDeleteChatResponse = async (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.getChatList();
    }
    this.setState({isLoading: false, archiveSelected: false});
  }

  handleSendEventAPIResponse = async (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.getMessages(this.state.selectedChatId);
      this.setState({showId: ""});
      await removeStorageData("startChatWith");
      await removeStorageData("profile_image");
      await removeStorageData("show_id");
    }
  }

  handleSendMessageResponse = (responseJson: any) => {
    if (responseJson.data) {
      this.setState({ textMessage: "", sending: false,selectedPic:'' }, () => {
        this.getMessages(this.state.selectedChatId);
      });
      
    }
  }

  handleChatHistoryResponse = (responseJson: any) => {
    if (responseJson.data.length !== 0) {
      const fromOtherParty = responseJson.data[responseJson.data.length - 1].attributes.from_other_party;
      if (fromOtherParty) {
        this.markAsRead();
        this.setState({ markedAsRead: true })
      }
      this.setState({ chatHistory: responseJson.data.reverse() });
    }
  }

  handleChatListApiResponse = (responseJson: any) => {
    if (responseJson.data) {
      const chatList = responseJson.data;
      this.getChatListApiCallId = "";
      const results = chatList.filter((item: any) => !item.attributes.is_archived).map((item: any) => {
        return {
          id: item.id,
          user_name: item.attributes.user_name,
          unreadCount:
            item.attributes.unread_message,
          lastMessage: item.attributes.last_message.data ? item.attributes.last_message.data.attributes : "",
          profile_image: item.attributes.account_type==="Band" || item.attributes.account_type === 'Artist'?item.attributes.photo:item.attributes.profile_image,
          online: item.attributes.is_other_user_online,
          user_id: item.attributes.user_id,
          account_type:item.attributes.account_type,
        };
      });
      const archivedChats = chatList.filter((item: any) => item.attributes.is_archived).map((item: any) => {
        return {
          id: item.id,
          user_name: item.attributes.user_name,
          unreadCount:
            item.attributes.unread_message,
          lastMessage: item.attributes.last_message.data ? item.attributes.last_message.data.attributes.message : "",
          profile_image: item.attributes.profile_image,
          online: item.attributes.is_other_user_online,
          user_id: item.attributes.user_id,
          account_type:item.attributes.account_type,
        };
      });
      this.setState({
        chatList: results,
        archiveList: archivedChats,
      });
    }
    this.setState({ isLoading: false });
  }

  handleCreateChatApiResponse = (responseJson: any) => {
    console.log('ChatController: Chat creation response:', JSON.stringify(responseJson, null, 2));
    
    if (responseJson.data[0]) {
      console.log('ChatController: Navigating to chat with ID:', responseJson.data[0].id);
      this.navigateToChatView(responseJson.data[0].id);
    } else if (responseJson.data && responseJson.data.id) {
      console.log('ChatController: Navigating to chat with ID:', responseJson.data.id);
      this.navigateToChatView(responseJson.data.id);
    } else {
      console.log('ChatController: No valid chat ID in response, refreshing chat list');
      this.getChatList();
    }
  }

  handleChatAction = (chat_id: number, actionType: string) => {
    if (this.state.archiveSelected) {
      this.handleArchiveData(chat_id, actionType)
    } else {
      this.handleChatData(chat_id, actionType)
    }
  }

  handleArchiveData = (chatID: number, actionType: string) => {
    let archiveList = [...this.state.archiveList]
    let chatList = [...this.state.chatList]

    archiveList = archiveList.filter((conversation: any, index: number) => {
      if (conversation.id === chatID) {
        if (actionType === 'archive')
          chatList.push(conversation)
        return false;
      }
      return true;
    });
    this.setState({ archiveList, chatList })
  }

  handleChatData = (chatID: number, actionType: string) => {
    let chatList = [...this.state.chatList]
    let archiveList = this.state.archiveList.length !== 0 ? [...this.state.archiveList] : []
    chatList = chatList.filter((conversation: any) => {
      if (conversation.id === chatID) {
        if (actionType === 'archive')
          archiveList.push(conversation);
        return false;
      }
      return true;
    });

    this.setState({ chatList, archiveList })
  }

  handleSendMessage = () => {
    if (!this.state.token) {
      return;
    }
    this.setState({sending: true});

    if (this.state.selectedPic !== '') {
      this.handleSendImage()
    }else{
      const sendMsgRequest = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
  
      this.sendMessageApiCallId = sendMsgRequest.messageId;
  
      sendMsgRequest.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.sendMessageApiEndPoint
      );
      sendMsgRequest.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          "Content-Type": configJSON.apiContentType,
          token: this.state.token,
        })
      );
      sendMsgRequest.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.postApiMethod
      );
      sendMsgRequest.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify({
          chat_id: this.state.selectedChatId,
          message: this.state.textMessage.trim(),
          message_type: "text",
        })
      );

      this.trackApiRequest(
        sendMsgRequest.messageId,
        "sendMessage",
        configJSON.sendMessageApiEndPoint,
        configJSON.postApiMethod,
        {
          chat_id: this.state.selectedChatId,
          message: this.state.textMessage.trim(),
          message_type: "text",
        }
      );
  
      runEngine.sendMessage(sendMsgRequest.id, sendMsgRequest);
    }

  
  }

  markAsRead = () => {
    if (!this.state.selectedChatId || !this.state.token) {
      return;
    }

    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    };

    const markReadMsgRequest = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    markReadMsgRequest.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateReadMessageApiEndPoint + this.state.selectedChatId
    );
    markReadMsgRequest.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    markReadMsgRequest.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.putApiMethod
    );

    this.trackApiRequest(
      markReadMsgRequest.messageId,
      "markAsRead",
      configJSON.updateReadMessageApiEndPoint + this.state.selectedChatId,
      configJSON.putApiMethod
    );

    runEngine.sendMessage(markReadMsgRequest.id, markReadMsgRequest);
  }

  createChat = (accountId: string, token: string) => {
    console.log('ChatController: Creating chat with accountId:', accountId);
    
    if(!token) {
      console.log('ChatController: No token provided for chat creation');
      return;
    }

    const header = {
      "Content-Type": configJSON.apiContentType,
      token,
    };

    const data = {
      "chat": {
        "name": "Some Chat",
        "receiver_id": accountId
      }
    }

    console.log('ChatController: Chat creation data:', JSON.stringify(data, null, 2));

    const createChatRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.createChatRoomApiCallId = createChatRequestMsg.messageId;

    createChatRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createChatRoomApiEndPoint
    );
    createChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    createChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod
    );
    createChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    this.trackApiRequest(
      createChatRequestMsg.messageId,
      "createChat",
      configJSON.createChatRoomApiEndPoint,
      configJSON.postApiMethod,
      data
    );

    console.log('ChatController: Sending chat creation request...');
    runEngine.sendMessage(createChatRequestMsg.id, createChatRequestMsg);
  }

  handleShareAPI = async () => {
    if(!this.state.token)
      return;

    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    }
    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.sendEventApiCallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.sendMessageApiEndPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify({
        chat_id: this.state.selectedChatId,
        show_id: this.state.showId,
        message_type: "event",
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod
    );

    this.trackApiRequest(
      getDataMsg.messageId,
      "sendEvent",
      configJSON.sendMessageApiEndPoint,
      configJSON.postApiMethod,
      {
        chat_id: this.state.selectedChatId,
        show_id: this.state.showId,
        message_type: "event",
      }
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  updateOnlineStatus = async (status: boolean) => {
    
    if (!this.state.token) {
      return;
    }

    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    }
    const updateOnineStatusMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.updateOnlineStatusApiCallId = updateOnineStatusMsg.messageId;

    updateOnineStatusMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updatOnlineStatusApiEndpoint
    );

    updateOnineStatusMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    updateOnineStatusMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify({
        is_online: status
      })
    );

    updateOnineStatusMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.updatOnlineStatusApiMethod
    );

    this.trackApiRequest(
      updateOnineStatusMsg.messageId,
      "updateOnlineStatus",
      configJSON.updatOnlineStatusApiEndpoint,
      configJSON.updatOnlineStatusApiMethod,
      { is_online: status }
    );

    runEngine.sendMessage(updateOnineStatusMsg.id, updateOnineStatusMsg);
  }

  deleteChat = async (chatId: string) => {
    this.setState({isLoading: true});
    if(!this.state.token)
      return;

    const headers = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    }
    const deleteChatRequestMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.deleteChatApiCallId = deleteChatRequestMsg.messageId;

    deleteChatRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.deleteChatApiEndpoint}/${chatId}`
    );

    deleteChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    deleteChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteChatApiMethod
    );

    this.trackApiRequest(
      deleteChatRequestMsg.messageId,
      "deleteChat",
      `${configJSON.deleteChatApiEndpoint}/${chatId}`,
      configJSON.deleteChatApiMethod
    );

    runEngine.sendMessage(deleteChatRequestMsg.id, deleteChatRequestMsg);
  }

  archiveChat = async (chatId: string, action: "archived" | "unarchived") => {
    this.setState({isLoading: true});
    const authToken = await getStorageData('authToken');

    const headers = {
      "Content-Type": configJSON.apiContentType,
      token: authToken,
    }
    const archiveChatRequestMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.deleteChatApiCallId = archiveChatRequestMsg.messageId;

    archiveChatRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.archiveChatApiEndpoint}?chat_id=${chatId}&${action}=true`
    );

    archiveChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    archiveChatRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.archiveChatApiMethod
    );

    this.trackApiRequest(
      archiveChatRequestMsg.messageId,
      "archiveChat",
      `${configJSON.archiveChatApiEndpoint}?chat_id=${chatId}&${action}=true`,
      configJSON.archiveChatApiMethod
    );

    runEngine.sendMessage(archiveChatRequestMsg.id, archiveChatRequestMsg);
  }

  onPressBackFromDetails = async () => {
   const ChatFromProfile = await getStorageData('ChatFromProfile',true)
   if (ChatFromProfile !== null && ChatFromProfile) {
    this.props.navigation.goBack()
    removeStorageData('ChatFromProfile')
   }else{
    this.setState({
      showDetails: false,
      selectedChatId: "",
      chatHistory: [],
      userId:'',
      userAccountType:''
    });
    this.getChatList();
   }
  
  }

  getDateFormatted = (show_time: string) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  
    const date = new Date(show_time);
  
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${dayName} ${monthName} ${day}. ${year}`;
  }

  handleSelectPic = async () => {
    this.setState({ showCameraGalleryPopup: true })
  }


  handleSendImage = () => {
    if (!this.state.token) {
      return;
    }
    const formData = new FormData();

    this.setState({sending: true});

    const sendMsgRequest = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.sendMessageApiCallId = sendMsgRequest.messageId;

    sendMsgRequest.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.sendMessageApiEndPoint
    );
    sendMsgRequest.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.contentTypeFormData,
        token: this.state.token,
      })
    );
    sendMsgRequest.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod
    );
    

    const selectedPic = {
      uri: Platform.OS === 'ios' ? this.state.selectedPic.replace('file://', '') : this.state.selectedPic,
      type: 'image/jpeg',
      name: 'SelectedPic.jpg',
    };
    formData.append('chat_id',this.state.selectedChatId)
    formData.append('message_type','image')
    formData.append('file',selectedPic as any)
    formData.append('message',this.state.textMessage)
    sendMsgRequest.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      formData
    );

    this.trackApiRequest(
      sendMsgRequest.messageId,
      "sendImage",
      configJSON.sendMessageApiEndPoint,
      configJSON.postApiMethod,
      {
        chat_id: this.state.selectedChatId,
        message_type: "image",
      }
    );

    runEngine.sendMessage(sendMsgRequest.id, sendMsgRequest);
  }

  handleCamera = async () => {
    this.setState({ isLoading: true, showCameraGalleryPopup: false });

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ isLoading: false });
        this.showAlert("Error", "Permission is denied!");
        return;
      }
    }

   setTimeout( async () => {
    const cameraData = await launchCamera({ mediaType: 'photo', maxWidth: 500, maxHeight: 600, quality: 0.7,presentationStyle:'fullScreen' });
    if (cameraData && cameraData.assets && cameraData.assets.length > 0 && cameraData.assets[0].uri !== undefined) {
      const uriData = cameraData.assets[0].uri;

      this.setState(prevState => ({
        ...prevState,
        selectedPic: uriData,
        isLoading: false
      }));

    }else{
      this.setState({ isLoading: false });
    }
   }, 100);
   
  }

  handleGallery = async () => {
    this.setState({ isLoading: true, showCameraGalleryPopup: false });

    const galleryData: any = await launchImageLibrary({ mediaType: 'photo', maxWidth: 500, maxHeight: 600, quality: 0.7,presentationStyle:'fullScreen' });
      if (galleryData && galleryData.assets && galleryData.assets.length > 0) {
        this.setState(prevState => ({
          ...prevState,
          selectedPic: galleryData.assets[0].uri,
          isLoading: false
        }));

      }else{
        this.setState({ isLoading: false });
      }
  }

  handleCancelPopup = () => {
    this.setState({ showCameraGalleryPopup: false })
  }

  NavToUserProfile = async (id:any,type:any) => {
    await setStorageData("profileIdToLoad", `${id}`);
    const screen = type === 'Band' || type === 'Artist' ? "UserProfileBasicBlockArtist2" : "UserProfileBasicBlock2"
  this.props.navigation.push(screen, {
    isOtherUser: true
  })
  }
    addBlockeduserCall = async() => {
      let bodyData = {
        block_user_id  :this.state.blockUserId  
        };
      const token= await getStorageData("authToken")
      const header = {
        "Content-Type": configJSON.apiContentType,
        token: token,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
      this.addBlockeduserApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.BlockeduserApiEndPoint
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(bodyData)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.postApiMethod
      );

      this.trackApiRequest(
        requestMessage.messageId,
        "blockUser",
        configJSON.BlockeduserApiEndPoint,
        configJSON.postApiMethod,
        bodyData
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
  };
  handleErrorResponses=(errors:any)=>{
    console.warn("Errors",`${errors}`)
  }
  // Customizable Area End
}
