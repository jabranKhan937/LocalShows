import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
interface IRequest {
  id: string;
  type: string;
  attributes: {
    sender_id: number;
    status: string;
    rejection_reason: string | null;
    request_text: string;
    created_at: string;
    updated_at: string;
    reviewer_group_id: number;
    sender_full_name: string;
  };
}

interface IGroup {
  id: string;
  type: string;
  attributes: {
    name: string;
  };
}
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
  token: string;
  sentRequests: IRequest[];
  isSendModalOpen: boolean;
  requestText: string;
  groups: IGroup[];
  selectedGroupId: string;
  selectedRequest: IRequest | null;
  viewRequest: IRequest | null;
  filterKey: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class SentRequestController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  sendRequestCallId: string = "";
  deleteRequestCallId: string = "";
  getGroupsCallId: string = "";
  getAllSentRequestCallId: string = "";
  updateRequestTextCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      sentRequests: [],
      groups: [],
      selectedGroupId: "",
      isSendModalOpen: false,
      requestText: "",
      selectedRequest: null,
      viewRequest: null,
      filterKey: '',
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      runEngine.debugLog("Message Recived", message);

      const token = message.getData(getName(MessageEnum.SessionResponseToken));
      if (token) {
        this.setState({ token: token }, () => {
          this.getAllSentRequest();
          this.getGroups();
        });
      } else {
        this.showAlert("Alert", configJSON.loginAlertMessage);
      }
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (apiRequestCallId != null) {
        if (
          apiRequestCallId === this.getAllSentRequestCallId &&
          responseJson !== undefined &&
          responseJson.data
        ) {
          this.setState({ sentRequests: responseJson.data });
        } else if (
          apiRequestCallId === this.deleteRequestCallId &&
          responseJson !== undefined &&
          responseJson.data
        ) {
          this.showAlert("Alert", configJSON.deletedMsgText);
          this.getAllSentRequest();
        } else if (
          apiRequestCallId === this.getGroupsCallId &&
          responseJson !== undefined &&
          responseJson.data
        ) {
          this.setState({ groups: responseJson.data });
        } else if (
          apiRequestCallId === this.sendRequestCallId &&
          responseJson !== undefined &&
          responseJson.data
        ) {
          this.showAlert("Alert", configJSON.requestSentSuccessMsg);
          this.getAllSentRequest();
          this.toggleModal();
        } else if (
          apiRequestCallId === this.updateRequestTextCallId &&
          responseJson !== undefined &&
          responseJson.data
        ) {
          this.showAlert("Alert", configJSON.requestUpdateSuccessMsg);
          this.getAllSentRequest();
          this.toggleModal();
        }
      }
    }
  }

  componentDidMount = async () => {
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
  };

  getToken = () => {
    const tokenMsg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(tokenMsg);
  };

  getAllSentRequest = () => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    const getAllSentMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getAllSentRequestCallId = getAllSentMsg.messageId;

    getAllSentMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSentRequestApiEndpoint
    );

    getAllSentMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );
    getAllSentMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getSentRequestApiMethod
    );
    runEngine.sendMessage(getAllSentMsg.id, getAllSentMsg);
  };

  sendRequest = () => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    const httpBody = {
      data: {
        reviewer_group_id: this.state.selectedGroupId,
        request_text: this.state.requestText,
      },
    };

    const senRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.sendRequestCallId = senRequestMsg.messageId;

    senRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createSendRequestApiEndpoint
    );

    senRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    senRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.createSendRequestApiMethod
    );

    senRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(senRequestMsg.id, senRequestMsg);
  };

  deleteRequest = (deleteRequestId: string) => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    const deleteRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteRequestCallId = deleteRequestMsg.messageId;

    deleteRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.deleteRequestApiEndpoint + deleteRequestId
    );

    deleteRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    deleteRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteRequestApiMethod
    );

    runEngine.sendMessage(deleteRequestMsg.id, deleteRequestMsg);
  };

  getGroups = () => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    const getGroupsMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getGroupsCallId = getGroupsMsg.messageId;

    getGroupsMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getGroupsApiEndpoint
    );

    getGroupsMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    getGroupsMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getGroupsApiMethod
    );

    runEngine.sendMessage(getGroupsMsg.id, getGroupsMsg);
  };

  updateRequestText = () => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    const httpBody = {
      data: {
        request_text: this.state.requestText,
      },
    };

    const updateRequestTextMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateRequestTextCallId = updateRequestTextMsg.messageId;

    updateRequestTextMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateRequestTextApiEndpoint + this.state.selectedRequest?.id
    );

    updateRequestTextMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    updateRequestTextMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.updateRequestTextApiMethod
    );

    updateRequestTextMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(updateRequestTextMsg.id, updateRequestTextMsg);
  };

  toggleModal = () => {
    this.setState({
      isSendModalOpen: !this.state.isSendModalOpen,
      requestText: "",
      selectedRequest: null,
    });
  };

  onChangeRequestText = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ requestText: event.target.value });
  };

  onChangeTextRequestText = (requestText: string) => {
    this.setState({ requestText });
  };

  onChangeGroupId = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ selectedGroupId: `${event.target.value}` });
  };

  onChangeTextGroupId = (selectedGroupId: string) => {
    this.setState({ selectedGroupId });
  };

  selectRequestHandler = (selectedRequest: IRequest) => {
    this.setState({
      selectedRequest,
      isSendModalOpen: true,
      requestText: selectedRequest.attributes.request_text,
    });
  };

  navigateHandler = () => {
    const navigationMsg = new Message(getName(MessageEnum.NavigationMessage));
    navigationMsg.addData(
      getName(MessageEnum.NavigationTargetMessage),
      "RequestManagement"
    );

    navigationMsg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    
    navigationMsg.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(navigationMsg);
  };

  setViewRequest = (viewRequest: IRequest) => {
    this.setState({viewRequest})
  }
  
  closeViewModal = () => {
    this.setState({viewRequest: null})
  }

  onChangeFilterKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ filterKey: event.target.value });
  };

  onChangeTextFilterKey = (filterKey: string) => {
    this.setState({ filterKey });
  };
  // Customizable Area End
}
