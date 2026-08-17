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
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
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
      type:''
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
      if (payloadData?.eventID) {
        this.setState({ eventID: payloadData.eventID,type:payloadData.type }, () => {
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
      const userID = await getStorageData('user_id');
      const authToken = await getStorageData('authToken');
      this.setState({ userID, authToken, }, () => {
        this.handleLikesListAPI()

      })
    }
  }

  handleLikesListApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    this.setState({ isLoading: false })
    if (responseJson != null && !responseJson.errors) {
      this.setState({ likedUsersList: responseJson.data })
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
      const { first_name } = item.attributes;
      return (
        first_name.toLowerCase().includes(this.state.searchUserText.toLowerCase())
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
