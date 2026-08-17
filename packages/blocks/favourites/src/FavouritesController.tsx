import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// Customizable Area Start
// Customizable Area End
export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
}

interface S {
  // Customizable Area Start
  token: string;
  favourites: any;
  isVisible: boolean;
  activeId: number;
  favouriteId: number;
  favouriteType: string;
  activeCreatedAt: string;
  activeUpdatedAt: string;
  title: string;
  content: string;
  value: any;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class FavouritesController extends BlockComponent<Props, S, SS> {
  value: any;
  editorState: any;
  favouritesApiCallId: any;
  deleteFavouritesApiCallId: any;
  addFavouritesApiCallId: any;
  richtext: any;
  editor: any;
  onChange: (editorState: any) => void;
  setEditor: (editor: any) => void;
  focusEditor: () => void;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.editorState = null; //createEditorStateWithText("");

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
    ];

    this.state = {
      token: "",
      favourites: [],
      isVisible: false,
      activeId: 0,
      favouriteId: 0,
      favouriteType: "",
      activeCreatedAt: "",
      activeUpdatedAt: "",
      title: "",
      content: "",
      value: this.value,
    };
    this.onChange = (value) => {
      this.value = value;
      this.setState({ value: value });
    };
    this.setEditor = (editor) => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }
  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      runEngine.debugLog("Message Recived", message);

      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: token });
      this.getFavourites(token);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      runEngine.debugLog("API Message Recived", message);
      if (responseJson && responseJson.data) {
        if (apiRequestCallId === this.favouritesApiCallId) {
          this.setState({ favourites: responseJson.data });
        }
        if (apiRequestCallId === this.addFavouritesApiCallId) {
          this.props.navigation.goBack();
        }
      } else if (
        responseJson &&
        !responseJson.data &&
        apiRequestCallId === this.deleteFavouritesApiCallId
      ) {
        this.setState({ isVisible: false });
        this.getFavourites(this.state.token);
      } else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.addFavouritesApiCallId) {
          this.showAlert("Error", responseJson.errors);
        } else {
          this.parseApiErrorResponse(responseJson);
          this.parseApiCatchErrorResponse(errorReponse);
        }
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  setModal = (item: any) => {
    this.setState({
      activeId: item.id,
      favouriteId: item.attributes.favouriteable_id,
      favouriteType: item.attributes.favouriteable_type,
      activeCreatedAt: item.attributes.created_at,
      activeUpdatedAt: item.attributes.updated_at,
      isVisible: !this.state.isVisible,
    });
  };
  hideModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  addFavourites() {
    //@ts-ignore
    this.props.navigation.navigate("AddFavourites");
  }

  setType = (txt: string) => {
    this.setState({ favouriteType: txt });
  };

  setID = (txt: string) => {
    this.setState({ favouriteId: Number(txt) });
  };

  deleteFavorite(id: number) {
    this.deleteFavouritesApiCall(configJSON.favouritesApiEndPoint + `/${id}`);
  }

  addFavouritesCall = () => {
    if (this.state.favouriteType.trim() === "") {
      this.showAlert(configJSON.configError, configJSON.configErrorType);
      return false;
    } else if (this.state.favouriteId <= 0) {
      this.showAlert(configJSON.configError, configJSON.configErrorId);
      return false;
    } else {
      var data = {
        favouriteable_id: this.state.favouriteId,
        favouriteable_type: this.state.favouriteType,
      };

      const header = {
        "Content-Type": configJSON.favouritesApiApiContentType,
        token: this.state.token,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );

      this.addFavouritesApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.favouritesApiEndPoint
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify({ data: data })
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    }
  };

  deleteFavouritesApiCall = (endPointURL: string) => {
    const header = {
      "Content-Type": configJSON.favouritesApiApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteFavouritesApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPointURL
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  getFavourites = (token: string) => {
    const header = {
      "Content-Type": configJSON.favouritesApiApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.favouritesApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.favouritesApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  // Customizable Area End
}
