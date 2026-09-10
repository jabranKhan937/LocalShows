import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { getStorageData, setStorageData } from "../../../framework/src/Utilities";
import { DeviceEventEmitter } from "react-native";
import {
  lightTheme,
  redesignTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
} from "../../utilities/src/Colors";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  route?: any;
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  // Customizable Area Start
  searchUserText: string;
  likedUsersList: any[];
  filteredUserList: any[];
  isLoading: boolean;
  userID: string;
  authToken: string;
  eventID: string;
  loginPopup: boolean;
  type:string
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class Likeapost2Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getLikesListAPICallId: any
  postFollowAPICallId: any
  profileThemeListener: { remove: () => void } | null = null
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.RestAPIResponceDataMessage),
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      // Customizable Area Start
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      searchUserText: "",
      likedUsersList: [],
      filteredUserList: [],
      isLoading: true,
      userID: "",
      authToken: "",
      eventID: "",
      loginPopup: false,
      type:'',
      isDarkMode: true,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        "Change Value",
        "From: " + this.state.txtSavedValue + " To: " + value
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
    else if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const payloadData = message.getData(getName(MessageEnum.HelpCentreMessageData));
      const eventID = payloadData?.eventID || payloadData?.eventId;
      if (eventID) {
        this.setState({
          eventID: String(eventID),
          type: payloadData.type || this.state.type || 'show',
        }, () => {
          this.handleLikesListAPI()
        });
      }
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      if (apiRequestCallId === this.getLikesListAPICallId) {
        this.handleLikesListApiResponse(message);
      } else if (apiRequestCallId === this.postFollowAPICallId) {
        this.handleFollowApiResponse(message);
      }
    }
    // Customizable Area End
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  // Customizable Area Start
  async componentDidMount() {
    if (!this.isPlatformWeb()) {
      this.loadLikesTheme();
      const userID = await getStorageData('user_id');
      const authToken = await getStorageData('authToken');
      const { eventID, type } = this.getLikesNavParams();
      this.setState({
        userID,
        authToken,
        ...(eventID ? { eventID, type } : {}),
      }, () => {
        if (this.state.eventID) {
          this.handleLikesListAPI();
        } else {
          this.setState({ isLoading: false });
        }
      })
    }
  }

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  loadLikesTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== 'false' });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  getLikesTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  getLikesNavParams = () => {
    const routeParams = this.props.route?.params || {};
    const navStateParams = this.props.navigation?.state?.params || {};
    const getParam = this.props.navigation?.getParam;
    const eventID =
      routeParams.eventID ||
      routeParams.eventId ||
      navStateParams.eventID ||
      navStateParams.eventId ||
      (typeof getParam === 'function' ? getParam('eventID') || getParam('eventId') : undefined);
    const type =
      routeParams.type ||
      navStateParams.type ||
      (typeof getParam === 'function' ? getParam('type') : undefined) ||
      'show';
    return {
      eventID: eventID ? String(eventID) : '',
      type: type || 'show',
    };
  };

  handleLikesListApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    this.setState({ isLoading: false })
    if (responseJson != null && !responseJson.errors) {
      const likesData = Array.isArray(responseJson.data)
        ? responseJson.data
        : Array.isArray(responseJson)
          ? responseJson
          : [];
      this.setState({ likedUsersList: likesData })
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }

  handleFollowApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

  
    if (responseJson != null && !responseJson.errors) {
      this.handleLikesListAPI()
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }

  handleLikesListAPI = async () => {
    if (!this.state.eventID) {
      this.setState({ isLoading: false, likedUsersList: [] });
      return;
    }

    const authToken = await getStorageData('authToken');

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getLikesListAPICallId = getDataMsg.messageId;

    const header = {
      "Content-Type": configJSON.exampleApiContentType,
      token: authToken,
    };

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.likesEndPoint}?id=${this.state.eventID}&type=${this.state.type}`
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  handleFollowAPI = (accountId: string) => {
    const dataToSend = {
      data: {
        attributes: {
          account_id: accountId
        }
      }
    }
    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.postFollowAPICallId = getDataMsg.messageId;

    const header = {
      "Content-Type": configJSON.exampleApiContentType,
      token: this.state.authToken
    };

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.followEndPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  filterList = (list:any) => {
    if(!list){
      return []
    }
    const results = list.filter((item:any) => {
      const firstName = item?.attributes?.first_name || item?.attributes?.name || "";
      return (
        firstName.toLowerCase().includes(this.state.searchUserText.toLowerCase())
      );
    });
    return results
  }

  navigateToLoginScreen = (navigateTo: string) => {
    this.setState({ loginPopup: false }, () => {
      if (navigateTo === "login")
        this.props.navigation.navigate("EmailAccountLoginBlock");
      else
        this.props.navigation.navigate("Rolesandpermissions");
    })
  }

  handleFollowPress(item: any) {
    if (!this.state.authToken)
      this.setState({ loginPopup: true });
    else if (!item.attributes.follow)
      this.handleFollowAPI(item.id);
    else
      this.handleUnfollowAPI(item.id);
  }

  hideLoginPopup = () => {
    this.setState({ loginPopup: false });
  }

  handleSearchTextChange = (searchUserText: string) => {
    this.setState({ searchUserText });
  }

  handleUnfollowAPI = (accountId: string) => {
    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.postFollowAPICallId = getDataMsg.messageId;

    const header = {
      "Content-Type": configJSON.exampleApiContentType,
      token: this.state.authToken
    };

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.unfollowEndPoint + accountId
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteMethodType
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  handleNavigationUserProfile = async (user:any) => {
    await setStorageData("profileIdToLoad", `${user?.id}`);
    let accountType = user?.attributes?.account_type
    const screen = accountType === 'Band' || accountType === 'Artist' ? "UserProfileBasicBlockArtist2" : "UserProfileBasicBlock2"
  this.props.navigation.push(screen, {
    isOtherUser: true
  })
  }


  // Customizable Area End
}
