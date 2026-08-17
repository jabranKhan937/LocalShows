import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import { getStorageData, removeStorageData, setStorageData } from "../../../framework/src/Utilities";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
}

export interface S {
  // Customizable Area Start
  userRole: string;
  bandArtistName: string;
  selectedCity: string;
  selectedState: string;
  selectedCountry: string;
  disputeFormData: any;
  accountVerificationPopup: boolean;
  accountType: string;
  address: string;
  zip: string;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class DisputeFormController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  disputeFormID: string = "";
  getDisputeFormID: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
    ];
    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    this.state = {
      // Customizable Area Start
      userRole: "",
      bandArtistName: "",
      selectedCity: "",
      selectedState: "",
      selectedCountry: "United States",
      disputeFormData: {},
      accountVerificationPopup: false,
      accountType: "",
      address: "",
      zip: "zadhgkgk",
      // Customizable Area End
    };

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleClaimPageNavigationData(message);
    }
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message)
    }
    // Customizable Area End
  }

  // Customizable Area Start


  async componentDidMount() {
    this.props.navigation.addListener("willFocus", async () => {
      const DisputeInfo =  await getStorageData('DisputeInfo',true)
      if (DisputeInfo !== null) {
        this.handleNavigationPayload(DisputeInfo)
      }
    });
  }
  handleClaimPageNavigationData = (message : Message) => {
    const payloadData = message.getData(
      getName(MessageEnum.HelpCentreMessageData)
    );
    if(payloadData){
      
      const {bandArtistName, userRole, selectedCountry , selectedState, selectedCity} = payloadData
      this.setState({
        bandArtistName,
        selectedCountry,
        selectedCity,
        selectedState,
        userRole,
      })
    }
  }
  
  handleBackLoginNavigation = () => {
    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), "EmailAccountLoginBlock");
    this.send(message);
  }

  handleNavigationPayload = (payloadData:any) => {
    const { bandName, selectedState, selectedCity, claimId, type, userRole } = payloadData || {};

    if (bandName) {
      this.setState({ bandArtistName: bandName });
    }

    if (type) {
      this.setState({ accountType: type });
    }

    if (selectedState) {
      this.setState({ selectedState: selectedState });
    }

    if (selectedCity) {
      this.setState({ selectedCity: selectedCity });
    }

    if (userRole) {
      this.setState({ userRole });
    }

    if (claimId) {
      this.getData(claimId);
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

    if (apiRequestCallId && responseJson) {
      this.handleSuccessfulApiResponse(apiRequestCallId, responseJson);
    } else {
      this.parseApiErrorResponse(errorResponse);
    }
  }

  getData = (userId: string) => {
    const header = {
      "Content-Type": configJSON.validationApiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getDisputeFormID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getClaimThePageEndPoint + userId
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

    return true;
  }

  handleSuccessfulApiResponse = (apiRequestCallId: any, responseJson: any) => {
    if (apiRequestCallId === this.disputeFormID) {
      this.handleDisputeFormAPIResponse(responseJson);
    } else if (apiRequestCallId === this.getDisputeFormID) {
      this.handleGetDisputeFormResponse(responseJson);
    }
  };

  handleGetDisputeFormResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      this.setState({
        disputeFormData: responseJson.data.attributes, bandArtistName: responseJson.data.attributes.band_artist_name
      })
    }
  };

  handleDisputeFormAPIResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      this.setState({ accountVerificationPopup: true })
    }
  };


  handleDisputeFormSuccess = async () => {
    const storageKeys = [
      'authToken',
      'user_id',
      'user_email',
      'user_name',
      'user_profile_pic',
      'user_phone_number',
      'userRole',
      'user_push_notification',
      'user_country',
      "state",
      "city",
      "user_state",
    ]
    for (const key in storageKeys) {
      await removeStorageData(key);
    }
    setStorageData("userRole", 'fan');
    setStorageData('redirectionNav','Home')
    await removeStorageData('DisputeInfo')
    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), "Home");
    this.send(message);
    const authMessage = new Message(getName(MessageEnum.AuthTokenEmailMessage));
    authMessage.addData("token", "");
    runEngine.sendMessage(authMessage.id, authMessage);
  }

  handleDisputeFormAPI = async () => {
    const email = await getStorageData("user_email");
    const phoneNumber = await getStorageData("user_phone_number");
    const data = {
      email: email,
      full_phone_number: phoneNumber,
      account_type: this.state.accountType,
      band_artists_name: this.state.bandArtistName,
      country: "US",
      state: this.state.selectedState,
      city: this.state.selectedCity,
    };
    const header = {
      "Content-Type": configJSON.validationApiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.disputeFormID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.disputeFormEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeAddDetail
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  handleVerification = () => {
    this.setState({ accountVerificationPopup: false }, () => {
      this.handleDisputeFormSuccess()

    })
  }
  // Customizable Area End
}
