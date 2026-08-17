import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { SelectedImage } from "./types";
import { getStorageData } from "../../../framework/src/Utilities";
// Customizable Area End

export const configJSON = require("./config");

// Customizable Area Start
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
  selectedImage: SelectedImage;
  description: string;
  pictures: any;
  isLoading: boolean;
  pictureId: string;
  showMenu: boolean;
  cancelPopup: boolean;
  pictureDetail: any;
  loginSignupPopup: boolean;
  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class PhotoLibraryDetailController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getPicDetailApiCallId: any;
  postLikePictureId: any
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.RestAPIResponceDataMessage),
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      // Customizable Area Start
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      selectedImage: { uri: "" },
      description: "",
      pictures: {},
      isLoading: true,
      pictureId: "",
      showMenu: false,
      cancelPopup: false,
      pictureDetail: {},
      loginSignupPopup: false,
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
      const payloadData = message.getData(getName(MessageEnum.PostDetailDataMessage));
      if (payloadData?.eventId) {
        this.setState({ pictureId: payloadData.eventId ?? "" }, () => {
          this.getPostAPictureDetails()
        });
      }
    }
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestApiResponse(message)
    }
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  handleRestApiResponse = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    this.handleRestApiSuccessResponse(apiRequestCallId, responseJson)
  }

  handleRestApiSuccessResponse = (apiRequestCallId: any, responseJson: any) => {
    if (apiRequestCallId === this.getPicDetailApiCallId) {
      this.handleGetPictureDetailAPIResponse(responseJson)
    } else if (apiRequestCallId === this.postLikePictureId) {
      this.handlePostLikePictureResponse(responseJson)
    }
  }

  handlePostLikePictureResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.getPostAPictureDetails()
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }

  handleGetPictureDetailAPIResponse = (responseJson: any) => {
    this.setState({isLoading: false})
    if (responseJson != null && !responseJson.errors) {
      this.handleGetPictureDetailAPISuccessResponse(responseJson.data)
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }

  handleGetPictureDetailAPISuccessResponse = (responseData: any) => {
    this.setState({
      description: responseData.attributes.description,
      pictures: {
        uri: responseData.attributes.images_and_videos[0].url
      },
      pictureDetail: responseData.attributes
    })
  }

  getPostAPictureDetails = async () => {
    let account_id = await getStorageData('user_id')
    const authToken = await getStorageData('authToken');

    const endpoint = `${configJSON.postAPictureEndPoint}/${this.state.pictureId}?account_id=${account_id}`

    const header = {
      "Content-Type": configJSON.contentTypeFormData,
      token: authToken,
    }

    const requestMessage = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getPicDetailApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  checkAuthentication = async () => {
    const authToken = await getStorageData('authToken');
    if (authToken) {
      this.handlePictureLike()
    } else {
      this.setState({ loginSignupPopup: true });
    }
  }

  handlePictureLike = async () => {
    const authToken = await getStorageData('authToken');

    const body = {
      "like": {
        "post_id": this.state.pictureId,
      }
    }

    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: authToken,
    }
    const requestMessage = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.postLikePictureId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.pictureLikeEndpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  moveToLoginSignupScreen = (navigateTo: string) => {
    this.setState({ loginSignupPopup: false }, () => {
      if (navigateTo === "login")
        this.props.navigation.navigate("EmailAccountLoginBlock");
      else
        this.props.navigation.navigate("Rolesandpermissions");
    })
  }

  handleCloseModal = () => {
    this.setState({ loginSignupPopup: false });
  }

  hideKeyboardOnScreen = () => {
    this.setState({ showMenu: false });
    this.hideKeyboard();
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  handleNavigationPostDetails = (screenToNavigate: string, infoToSend: {}, msgData: any) => {
    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), screenToNavigate);

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(msgData), infoToSend);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  }

  handleLikeTextPress = () => {
    if (this.state.token !== '') {
      const info = {
        eventID: this.state.pictureId.toString(),
        type:'post'
      }
      this.handleNavigationPostDetails("Likeapost2", info, MessageEnum.HelpCentreMessageData)
    } else {
      this.setState({ loginSignupPopup: true });
    }
  }

  // Customizable Area End
}
