import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { getStorageData } from "../../../framework/src/Utilities";
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
  receivedRequests: IRequest[];
  rejectText: string;
  rejectTextError: string | null;
  selectedId: string | null;
  viewRequest: IRequest | null;
  filterKey: string;
  fetching: boolean;
  newCategoryText: string;
  showConfirmationModal: boolean;
  newCategories: string[];
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class RequestManagementController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getAllReceivedRequestCallId: string = "";
  updateRequestReviewCallId: string = "";
  deleteRequestCallId: string = "";
  addCategoryApiCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      receivedRequests: [],
      rejectText: "",
      rejectTextError: null,
      selectedId: null,
      viewRequest: null,
      filterKey: '',
      fetching: false,
      newCategoryText: "",
      showConfirmationModal: false,
      newCategories: [],
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (apiRequestCallId != null) {
        if (
          apiRequestCallId === this.addCategoryApiCallId &&
          responseJson !== undefined
        ) {
          this.setState({fetching: false});
          this.props.navigation.goBack();
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

  getToken = async () => {
    const token = await getStorageData("authToken");
    this.setState({token});
  };

  getAllReceivedRequest = () => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    const getAllRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getAllReceivedRequestCallId = getAllRequestMsg.messageId;

    getAllRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getReceivedRequestApiEndpoint
    );

    getAllRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );
    getAllRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getReceivedRequestApiMethod
    );
    runEngine.sendMessage(getAllRequestMsg.id, getAllRequestMsg);
  };

  updateRequestReview = (requestReviewId: string, is_accepted: boolean) => {
    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    if (!is_accepted && this.state.rejectText.length < 1) {
      this.setState({ rejectTextError: configJSON.rejectTextFieldIsRequired });
      return;
    }

    const httpBody = {
      is_accepted,
      ...(!is_accepted && {
        rejection_reason: this.state.rejectText,
      }),
    };

    const updateRequestReviewMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateRequestReviewCallId = updateRequestReviewMsg.messageId;

    updateRequestReviewMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateRequestApiEndpointStart +
        requestReviewId +
        configJSON.updateRequestApiEndpointEnd
    );

    updateRequestReviewMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    updateRequestReviewMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.updateRequestApiMethod
    );

    updateRequestReviewMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(updateRequestReviewMsg.id, updateRequestReviewMsg);
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

  onChangeRejectText = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rejectText: event.target.value });
  };

  onChangeTextRejectText = (rejectText: string) => {
    this.setState({ rejectText });
  };

  setSelectedId = (selectedId: string | null) => {
    this.setState({ selectedId, rejectText: "", rejectTextError: null });
  };

  navigateHandler = () => {
    const navigationMsg = new Message(getName(MessageEnum.NavigationMessage));
    navigationMsg.addData(getName(MessageEnum.NavigationTargetMessage), "SentRequest");

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

  enableSendButton = () => {
    if(this.state.newCategoryText || this.state.newCategories.length !== 0) {
      return true;
    }
    return false;
  }

  handleAddNewCategoryAPICall = () => {
    this.setState({ fetching: true, showConfirmationModal: false });

    const headers = {
      "Content-Type": configJSON.requestApiContentType,
      token: this.state.token,
    };

    let categories;

    categories = this.state.newCategories.map(category => ({ name: category }))
    if(this.state.newCategoryText) {
      categories = [...categories, {name: this.state.newCategoryText}];
    }

    const dataToSend = {
      categories: categories
    };
    const addCategoryRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.addCategoryApiCallId = addCategoryRequestMsg.messageId;

    addCategoryRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.addCategoryApiEndpoint
    );

    addCategoryRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    addCategoryRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.addCategoryApiMethod
    );

    addCategoryRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend)
    );

    runEngine.sendMessage(addCategoryRequestMsg.id, addCategoryRequestMsg);
  }

  handleAddNewCategory = () => {
    let newCategoryList = [...this.state.newCategories]
    const trimmedCategory = this.state.newCategoryText.trim();
    if (trimmedCategory !== "" && !newCategoryList.includes(trimmedCategory)) {
      newCategoryList.push(trimmedCategory);
    }
    this.setState({ newCategoryText: "", newCategories: newCategoryList })
  }

  handleRemoveCategory = (category_name: string) => {
    const { newCategories } = this.state;
    const updatedCategory = newCategories.filter(category => category !== category_name);
    this.setState({ newCategories: updatedCategory });
  }
  // Customizable Area End
}
