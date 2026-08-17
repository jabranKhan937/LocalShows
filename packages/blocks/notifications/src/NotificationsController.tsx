import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { CommonActions } from "@react-navigation/native";
import { imgBell } from "./assets";
import { getStorageData, setStorageData } from "../../../framework/src/Utilities";

// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  data: any[];
  selectedData: any;
  token: any;
  activeTab: string;
  notificationList: any[];
  searchInput: string;
  filteredNotificationList: any[];
  isLoading: boolean;
  selectedNotificationID: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class NotificationsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getDataCallId: string = "";
  markAsReadCallId: string = "";
  deleteCallId: string = "";
  getNotificationListCallId: string = "";
  readNotificationCallId: string = "";
  confirmRemoveRequestCallId: string = "";
  followBackRequestCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      data: [],
      selectedData: null,
      token: "",
      activeTab: 'you',
      notificationList: [],
      searchInput: '',
      filteredNotificationList: [],
      isLoading: true,
      selectedNotificationID: "",
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
        this.checkLoggedOutAndNavigateToLogin();
      });
    }
    // Customizable Area Start
    this.getNotificationListAPI();
    this.checkLoggedOutAndNavigateToLogin();
    // Customizable Area End
  }

  /** When user has logged out (e.g. from drawer), navigate to login screen. */
  checkLoggedOutAndNavigateToLogin = async () => {
    const authToken = await getStorageData("authToken");
    if (!authToken) {
      this.navigateToLoginScreen();
    }
  };

  /** Reset drawer to HomeTab with Profile tab showing EmailAccountLoginBlock (same as HomeScreen logout). */
  navigateToLoginScreen = () => {
    try {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "HomeTab",
            state: {
              index: 3,
              routes: [
                { name: "HomeFeed" },
                { name: "Search" },
                { name: "Calender" },
                {
                  name: "Profile",
                  state: {
                    index: 0,
                    routes: [{ name: "EmailAccountLoginBlock" }],
                  },
                },
              ],
            },
          },
        ],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (e) {
      // Fallback: try simple navigate to login if reset fails
      try {
        this.props.navigation.navigate("HomeTab", {
          screen: "Profile",
          params: { screen: "EmailAccountLoginBlock" },
        });
      } catch (_) {}
    }
  };

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);

    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.handleSessionResponse(message);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  iconBellProps = {
    source: imgBell,
  };

  getNotifications() {
    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getDataCallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.endPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: this.state.token ? this.state.token : "",
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getDataMethod
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  markAsRead(id: number) {
    const markAsReadMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.markAsReadCallId = markAsReadMsg.messageId;

    markAsReadMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.endPoint}/${id}`
    );

    markAsReadMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: this.state.token ? this.state.token : "",
      })
    );

    markAsReadMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.markAsReadMethod
    );

    runEngine.sendMessage(markAsReadMsg.id, markAsReadMsg);
  }

  deleteNotifications(id: number) {
    const deletedMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.deleteCallId = deletedMsg.messageId;

    deletedMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.endPoint}/${id}`
    );

    deletedMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: this.state.token ? this.state.token : "",
      })
    );

    deletedMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "DELETE"
    );

    runEngine.sendMessage(deletedMsg.id, deletedMsg);
  }

  timeSince(date: string) {
    var seconds = Math.floor(
      (new Date().valueOf() - new Date(date).valueOf()) / 1000
    );
    var interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " m ago";
    }
    return Math.floor(seconds) + " s ago";
  }
  convertDate(inputFormat: string) {
    function pad(s: any) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("-");
  }

  handleSessionResponse = (message: Message) => {
    const token = message.getData(getName(MessageEnum.SessionResponseToken));
    runEngine.debugLog("TOKEN", token);
    this.setState({ token });
    if (!token && this.isPlatformWeb() === false) {
      this.navigateToLoginScreen();
      return;
    }
    if (this.isPlatformWeb() === true)
      this.getNotifications();
  }

  handleRestAPIResponse = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (this.getDataCallId === apiRequestCallId) {
      this.setState({
        data: responseJson.data,
      });
    } else if (this.markAsReadCallId === apiRequestCallId) {
      this.getNotifications();
    } else if (this.deleteCallId === apiRequestCallId) {
      if (responseJson?.data) {
        this.showAlert("Message", configJSON.deleteMessage);
      }
      this.setState({ selectedData: null });
      this.getNotifications();
    } else if (this.getNotificationListCallId === apiRequestCallId) {
      this.handleGetNotificationAPIResponse(responseJson)
    } else if (this.readNotificationCallId === apiRequestCallId) {
      this.handleReadNotificationAPIResponse(responseJson)
    } else if (this.confirmRemoveRequestCallId === apiRequestCallId) {
      this.handleConfirmRemoveAPIRequest(responseJson)
    } else if (this.followBackRequestCallId === apiRequestCallId) {
      this.handleFollowBackAPIRequest(responseJson)
    }
  }

  handleGetNotificationAPIResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.setState({
        notificationList: responseJson.data.slice().reverse(),
        searchInput: '',
        filteredNotificationList: [],
        isLoading: false,
      });
    } else {
      this.setState({ isLoading: false })
      this.parseApiErrorResponse(responseJson)
    }
  }

  handleReadNotificationAPIResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      const notificationData = this.state.searchInput === "" ? this.state.notificationList : this.state.filteredNotificationList
      const indexToUpdate = notificationData.findIndex(item => item.id === this.state.selectedNotificationID);

      if (indexToUpdate !== -1) {
        notificationData[indexToUpdate].attributes.is_read = true;
      }
      if (this.state.searchInput === "") {
        this.setState({ notificationList: notificationData })
      } else {
        this.setState({ filteredNotificationList: notificationData })
      }
    }
    else {
      this.parseApiErrorResponse(responseJson)
    }
  }

  handleConfirmRemoveAPIRequest = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.getNotificationListAPI()
      this.readNotificationAPI()
    } else {
      this.parseApiErrorResponse(responseJson)
    }
  }

  handleFollowBackAPIRequest = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.getNotificationListAPI()
      this.readNotificationAPI()
    } else {
      this.parseApiErrorResponse(responseJson)
    }
  }

  getNotificationListAPI = async () => {
    this.setState({ isLoading: true })
    const authToken = await getStorageData('authToken');

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getNotificationListCallId = getDataMsg.messageId;
    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.notificationEndPoint}?tab=${this.state.activeTab}`
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: authToken,
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getDataMethod
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  filterData = (searchText: string) => {
    let filteredData = [...this.state.notificationList]
    this.setState({
      searchInput: searchText,
    })
    filteredData = filteredData.filter(item => item.attributes.message.toLowerCase().includes(searchText.toLowerCase()));
    this.setState({ filteredNotificationList: filteredData })
  };

  readNotificationAPI = async () => {
    const authToken = await getStorageData('authToken');

    const data = {
      id: this.state.selectedNotificationID
    }

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.readNotificationCallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.readNotificationEndPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: authToken,
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.markAsReadMethod
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  confirmRemoveRequestAPI = async (item: any, removeRequest: boolean, confirmRequest: boolean) => {
    const authToken = await getStorageData('authToken');

    const data = {
      record_id: item.attributes.record_id,
      remove: removeRequest,
      confirmed: confirmRequest,
    }

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.confirmRemoveRequestCallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.confirmRemoveRequestEndPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: authToken,
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.patchMethod
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  followBackRequestAPI = async (user_id: string) => {
    const authToken = await getStorageData('authToken');

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.followBackRequestCallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.followBackRequestEndPoint}?id=${user_id}`
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.apiContentType,
        token: authToken,
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postMethod
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  handleNotificationPress = (data: any, item: any) => {
    if (!data.is_read) {
      this.setState({ selectedNotificationID: item.id }, () => {
        this.readNotificationAPI();
      });
    }
  };

  handleTabSwitch = (tab: string) => { this.setState({ activeTab: tab, searchInput: "" }, () => { this.getNotificationListAPI() }) }

  handleUserProfileNav = async (accountId:any,accountType:any) => {
    await setStorageData("profileIdToLoad", `${accountId}`);
    const screen = accountType === 'Band' || accountType === 'Artist' ? "UserProfileBasicBlockArtist2" : "UserProfileBasicBlock2"
    this.props.navigation.push(screen, {
      isOtherUser: true
    })
  }
  // Customizable Area End
}
