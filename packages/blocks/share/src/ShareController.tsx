import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { DeviceEventEmitter } from "react-native";
import { getStorageData, setStorageData } from "../../../framework/src/Utilities";
import {
  lightTheme,
  redesignTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
} from "../../utilities/src/Colors";

const frameworkConfig = require("../../../framework/src/config");

// Customizable Area End

export const configJSON = require("./config");

import Share from "react-native-share";

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  searchInput: string;
  userList: any[];
  filteredList: any[];
  showId: string;
  fetching: boolean;
  eventType?: string;
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class ShareController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  getUsersListAPICallId: string;
  shareEventAPICallID: string = "";
  profileThemeListener: { remove: () => void } | null = null;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.getUsersListAPICallId = ""

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      searchInput: "",
      userList: [],
      filteredList: [],
      showId: "",
      fetching: false,
      eventType : 'show',
      isDarkMode: true,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const payloadData = message.getData(getName(MessageEnum.HelpCentreMessageData));
      if (payloadData?.eventId) {
        const {eventId , eventType} = payloadData

        this.setState({ showId: eventId.toString(), eventType}  );
      }
    }
    else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  componentDidMount = async () => {
    await this.loadShareTheme();
    if (this.isPlatformWeb() === false)
      this.getUsersList();
  };

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  loadShareTheme = async () => {
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

  getShareTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  handleRestAPIResponse = async (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (this.getUsersListAPICallId === apiRequestCallId) {
      this.handleUsersListAPIResponse(responseJson)
    }

    if (this.shareEventAPICallID === apiRequestCallId) {
      console.log("[Share] shareEvent API response:", {
        url: `${frameworkConfig.baseURL}/${configJSON.shareEventEndpoint}`,
        method: configJSON.shareEventApiMethod,
        response: responseJson,
      });
      let selectedItems = this.state.userList.filter(item => item.attributes.is_selected);
      if(selectedItems.length > 0 && selectedItems.length <= 1){
        await setStorageData("startChatWith", JSON.stringify(selectedItems[0].attributes.current_user_id));
        await setStorageData("chat_user_name", selectedItems[0].attributes.name);
        await setStorageData("profile_image", selectedItems[0].attributes.profile_image_url);
        await setStorageData("show_id", this.state.showId);
      }
      this.setState({fetching: false});      
      const chatNavMessage: Message = new Message(getName(MessageEnum.NavigationMessage));
      chatNavMessage.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      chatNavMessage.addData(getName(MessageEnum.NavigationTargetMessage), "Chat");
      this.send(chatNavMessage);
    }
  }

  handleUsersListAPIResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      responseJson.data.forEach((obj: any) => {
        obj.attributes['is_selected'] = false;
      });
      this.setState({
        userList: responseJson.data,
        searchInput: '',
        filteredList: [],
      });
    } else {
      this.parseApiErrorResponse(responseJson)
    }
  }

  getUsersList = async () => {
    const authToken = await getStorageData('authToken');

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getUsersListAPICallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.followerListEndPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
        token: authToken,
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  filterList = () => {
    let filteredData = [...this.state.userList]
    filteredData = filteredData.filter(item => item.attributes.name && item.attributes.name.toLowerCase().includes(this.state.searchInput.toLowerCase()));
    this.setState({ filteredList: filteredData })
  }

  handleUserSelection = (id: string) => {
    const userData = [...this.state.userList]
    userData.forEach((obj: any) => {
      if (obj.attributes.id === id) {
        obj.attributes.is_selected = !obj.attributes.is_selected;
      }
    });
    this.setState({ userList: userData })
  }

  shareEvent = async () => {
    const {showId , eventType , userList} = this.state
    this.setState({fetching: true});
    const token = await getStorageData("authToken");
    const eventKey = eventType === 'show' ? 'show_id' : 'post_id'

    const payload = {
      [eventKey]: Number(showId),
      chat_ids: userList.filter(item => item.attributes.is_selected).map(item => item.attributes.current_user_id),
    }

    const shareEventRequestMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));
    this.shareEventAPICallID = shareEventRequestMsg.messageId;

    shareEventRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.shareEventEndpoint
    );

    shareEventRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
        token,
      })
    );

    shareEventRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(payload)
    );

    shareEventRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.shareEventApiMethod
    );

    const shareEventUrl = `${frameworkConfig.baseURL}/${configJSON.shareEventEndpoint}`;
    console.log("[Share] shareEvent API request:", {
      url: shareEventUrl,
      method: configJSON.shareEventApiMethod,
      payload,
    });

    runEngine.sendMessage(shareEventRequestMsg.id, shareEventRequestMsg);
  }

  handleSearch = (text: string) => {
    this.setState({ searchInput: text }, () => {
      this.filterList()
    })
  }

  handleUserNavToProfile = async (accountId:any,accountType:any) => {
    await setStorageData("profileIdToLoad", `${accountId}`);
    const screen = accountType === 'Band' || accountType === 'Artist' ? "UserProfileBasicBlockArtist2" : "UserProfileBasicBlock2"
    this.props.navigation.push(screen, {
      isOtherUser: true
    })
  }

  // Customizable Area End
}
