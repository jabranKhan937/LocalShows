import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { getStorageData } from "../../../framework/src/Utilities";
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
  Blockeduser: any;
  activeRecordId: number;
  activeId: number;
  activeFirstName: string;
  activeLastName: string;
  activeCreatedAt: string;
  activeUpdatedAt: string;
  userToBlock: string;
  value: any;
  type: string;
  isLoading: boolean,
  searchText:string,
  filteredList: any[];
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class BlockedusersController extends BlockComponent<
  Props,
  S,
  SS
> {
  value: any;
  editorState: any;
  BlockeduserApiCallId: any;
  deleteBlockeduserApiCallId: any;
  addBlockeduserApiCallId: any;
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
      Blockeduser: [],
      activeRecordId: 0,
      activeId: 0,
      activeFirstName: "",
      activeLastName: "",
      activeCreatedAt: "",
      activeUpdatedAt: "",
      userToBlock: "",
      value: this.value,
      type: "blocked",
      isLoading: true,
      searchText: "",
      filteredList: []
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
    // Customizable Area Start
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    this.getBlockeduser()
    // Customizable Area End
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
      // this.getBlockeduser(token);
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
        if (apiRequestCallId === this.BlockeduserApiCallId) {
          this.setState({ Blockeduser: responseJson.data,isLoading:false });
        }
        if (apiRequestCallId === this.addBlockeduserApiCallId) {
          this.props.navigation.goBack();
        }
      } else if (
        responseJson &&
        !responseJson.data &&
        apiRequestCallId === this.deleteBlockeduserApiCallId
      ) {
        this.setState({isLoading:false})
        this.getBlockeduser()
      } else if (responseJson && responseJson.errors) {
        this.setState({isLoading:false });
        this.parseApiErrorResponse(responseJson);
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  handleBlockUserSearch = (text: string) => {
    this.setState({ searchText: text }, () => {
      this.filterBlockList()
    })
  }
  filterBlockList = () => {
    let filteredData = [...this.state.Blockeduser]
    filteredData = filteredData.filter(item => item.attributes.block_user.attributes.first_name && item.attributes.block_user.attributes.first_name .toLowerCase().includes(this.state.searchText.toLowerCase()));
    this.setState({ filteredList: filteredData })
  }
  addBlockeduser() {
    //@ts-ignore
    this.props.navigation.navigate("AddBlockeduser");
  }

  deleteBlockeduser(id: number|string) {
    this.deleteBlockeduserApiCall(configJSON.BlockeduserApiEndPoint + `/${id}`);
  }
  addBlockeduserCall = () => {
    if (this.state.userToBlock.trim() === "") {
      this.showAlert(configJSON.configError, configJSON.configErrorTitle);
      return false;
    } else {
      var bodyData = {
        data: {
          attributes: {
            account_id: this.state.userToBlock,
          },
        },
      };

      const header = {
        "Content-Type": configJSON.blockeduserApiApiContentType,
        token: this.state.token,
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
        configJSON.httpPostType
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    }
  };

  deleteBlockeduserApiCall = async(endPointURL: string) => {
    const token= await getStorageData("authToken")
    this.setState({isLoading:true})
    const header = {
      "Content-Type": configJSON.blockeduserApiApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteBlockeduserApiCallId = requestMessage.messageId;

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
      configJSON.httpDeleteType
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  getBlockeduser = async() => {
    const token= await getStorageData("authToken")
    const header = {
      "Content-Type": configJSON.blockeduserApiApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.BlockeduserApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.BlockeduserApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  // Customizable Area End
}
