import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { getStorageData, setStorageData } from "../../../framework/src/Utilities";
import { Dimensions } from "react-native";
// Customizable Area End

export const configJSON = require("./config");

// Customizable Area Start
export interface ITermsConds {
  id: string;
  description: string;
  is_accepted: boolean;
  created_at: string;
}

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
  isAdminUser: boolean;
  accountId: number;
  termsConds: ITermsConds | null;
  termsCondsList: ITermsConds[];
  isTermsCondsAccepted: string;
  isLoading: boolean;
  tAndCAPIData: string;
  WebViewHeight:number,
  isChecked:boolean
  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class TermsConditionsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getTermsCondsCallId: string = "";
  getTermsCondsListCallId: string = "";
  getAccountGroupsCallId: string = "";
  setAcceptanceOfTermsCondsId: string = "";
  getTAndCAPICallID: any;
  acceptTAndCAPICallID:any
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.SessionResponseMessage),
      
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      accountId: -1,
      termsCondsList: [],
      isAdminUser: true,
      termsConds: null,
      isTermsCondsAccepted: 'false', 
      isLoading: false,
      tAndCAPIData: "",
      WebViewHeight:Dimensions.get('screen').height,
      isChecked:false
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start

  async componentDidMount() {
    if (!this.isPlatformWeb())
      this.getTAndCApi()
  }

  navigateToTermsCondsDetail = (termsCondsId: string) => {
    const message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      "TermsConditionsDetail"
    );

    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.SessionResponseData), {
      termsCondsId: termsCondsId,
    });
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  navigateToTermsCondsEdit = () => {
    const message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      "TermsConditionsEdit"
    );

    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.SessionResponseData), null);
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  getAccountGroups = async (token: string) => {
    const header = {
      "Content-Type": configJSON.apiContentType,
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getAccountGroupsCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getAccountGroupsApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    this.setState({ isLoading: true });
  };

  getTermsCondsList = async (token: string) => {
    const header = {
      "Content-Type": configJSON.apiContentType,
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getTermsCondsListCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getAllTermsCondsApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getTermsConds = async (token: string) => {
    const header = {
      "Content-Type": configJSON.apiContentType,
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getTermsCondsCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getTermsCondsApiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleCheckBoxChange = (value: boolean) => {
    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    };
    const body = {
      id: this.state.termsConds?.id,
      is_accepted: value,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.setAcceptanceOfTermsCondsId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.setTermsCondsAcceptanceApiEndPoint
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
  };

  getTAndCApi = () => {
    const header = {
      "Content-Type": configJSON.apiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getTAndCAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.tAndCEndpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  handleSessionResponse = (message: Message) => {
    const token: string = message.getData(
      getName(MessageEnum.SessionResponseToken)
    );
    if (token) {
      runEngine.debugLog("TOKEN", token);
      const messageData = JSON.parse(
        message.getData(getName(MessageEnum.SessionResponseData))
      );
      const accountId: number = messageData?.meta?.id;
      this.setState({ accountId });

      this.setState({ token, accountId }, () => this.getAccountGroups(token));
    } 
  }

  handleRestAPIResponse = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );
    if (errorResponse) this.parseApiCatchErrorResponse(errorResponse);
    if (responseJson?.errors) this.parseApiErrorResponse(responseJson);

    if (apiRequestCallId && responseJson) {
      if (apiRequestCallId === this.getTermsCondsListCallId) {
        this.handleGetTermsCondsListAPIResponse(responseJson);
      } else if (apiRequestCallId === this.getTermsCondsCallId) {
        this.handleGetTermsCondsAPIResponse(responseJson);
      } else if (apiRequestCallId === this.setAcceptanceOfTermsCondsId) {
        this.handleSetAcceptanceOfTermsCondsAPIResponse();
      } else if (apiRequestCallId === this.getAccountGroupsCallId) {
        this.handleGetAccountGroupsAPIResponse(responseJson);
      } else if (apiRequestCallId === this.getTAndCAPICallID) {
        this.handleGetTAndCAPIResponse(responseJson);
      }else if (apiRequestCallId=== this.acceptTAndCAPICallID){
        this.handleAcceptTAndCAPIResponse(responseJson)
      }
    }
  }
  handleAcceptTAndCAPIResponse= async (responseJson:any)=>{
    if (responseJson.message === 'You have accepted the latest terms and conditions') {
      await setStorageData("tAndCAcceptance", (true).toString())
      this.props.navigation.goBack()
    }else{
      await setStorageData("tAndCAcceptance", (false).toString())
      this.showAlert('',responseJson.message)
    }
  }
  handleGetTermsCondsListAPIResponse = (responseJson: any) => {
    this.setState({
      termsCondsList: responseJson.data,
      isLoading: false,
    });
  }

  handleGetTermsCondsAPIResponse = (responseJson: any) => {
    this.setState({
      termsConds: responseJson,
      isTermsCondsAccepted: responseJson.is_accepted,
      isLoading: false,
    });
  }

  handleSetAcceptanceOfTermsCondsAPIResponse = () => {
      this.setState({
        isChecked: !this.state.isChecked,
      });
   
  }

  handleGetAccountGroupsAPIResponse = (responseJson: any) => {
    const isAdminUser = responseJson.data.some(
      (group: { attributes: { accounts: [] } }) =>
        group.attributes.accounts.some(
          (account: { id: number; role_id: number | null }) =>
            account.id === this.state.accountId && account.role_id === 1
        )
    );
    this.setState({ isAdminUser: isAdminUser });
    if (isAdminUser) {
      this.getTermsCondsList(this.state.token);
    } else {
      this.getTermsConds(this.state.token);
    }
  }

  handleGetTAndCAPIResponse = (responseJson: any) => {
    const data =`
    <head>
    <meta content="width=width, initial-scale=1, maximum-scale=1" name="viewport"></meta>
  </head>
    <style>
        body {
            font-size: 16px;
            
        }
    </style>
    ${responseJson.data[0].description}`
    this.setState({ tAndCAPIData: data });
  }

  handleAccept = async () => {
    const authToken = await getStorageData('authToken');

  if(authToken !== null){
    const header = {
      "Content-Type": configJSON.apiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.acceptTAndCAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.accepttermandConditions
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }else{
    await setStorageData("tAndCAcceptance", (this.state.isTermsCondsAccepted).toString())
    this.props.navigation.goBack()
  }
  }
  // Customizable Area End

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const payloadData = message.getData(getName(MessageEnum.NavigationTermAndConditionMessage));
      if (payloadData?.isTermsAndConditionsAccepted) {
        this.setState({ isTermsCondsAccepted: payloadData.isTermsAndConditionsAccepted ?? "" });
      }
    }

    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.handleSessionResponse(message)
    }

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message)
    }
    // Customizable Area End
  }
}
