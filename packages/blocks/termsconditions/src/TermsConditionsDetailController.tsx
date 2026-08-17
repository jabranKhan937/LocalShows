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

// Customizable Area Start
export interface ITermsConditions {
  id: string;
  attributes: {
    created_at: string;
    description: string;
    accepted_by: [
      {
        account_id: string;
        accepted_on: string;
        email: string;
      }
    ];
  };
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
  termsCondsId: string;
  termsConds: ITermsConditions | null;
  isLoading: boolean;
  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class TermsConditionsDetailController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getTermsCondsCallId: string = "";
  // Customizable Area Ends

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      termsCondsId: "",
      termsConds: null,
      isLoading: false,
      // Customizable Area End
    };

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (!this.isPlatformWeb()) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
  }

  getToken = () => {
    const message: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(message);
  };

  navigateToTermsCondsUsers = (termsConds: ITermsConditions) => {
    const message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      "TermsConditionsUsers"
    );

    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.SessionResponseData), {
      termsCondsUsers: termsConds.attributes?.accepted_by,
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
    raiseMessage.addData(getName(MessageEnum.SessionResponseData), {
      termsConds: this.state.termsConds?.attributes?.description,
      termsCondsId: this.state.termsConds?.id,
    });
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  getTermsCondsDetails = (token: string, termsCondsId: string) => {
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
      `${configJSON.getAllTermsCondsApiEndPoint}/${termsCondsId}`
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
  // Customizable Area End

  async receive(from: string, message: Message) {
    // Customizable Area Start
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

    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      const token: string = message.getData(
        getName(MessageEnum.SessionResponseToken)
      );
      runEngine.debugLog("TOKEN", token);
      if (token)
        this.setState({ token }, () => {
          if (this.state.termsCondsId) {
            this.getTermsCondsDetails(token, this.state.termsCondsId);
          }
        });
    }

    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const termsCondsData = message.getData(
        getName(MessageEnum.SessionResponseData)
      );
      const { termsCondsId } = termsCondsData;
      if (termsCondsId) {
        this.setState({ termsCondsId }, () =>
          this.getTermsCondsDetails(this.state.token, termsCondsId)
        );
      }
    }

    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      apiRequestCallId === this.getTermsCondsCallId &&
      responseJson?.data
    ) {
      this.getTermsCondsCallId = "";
      this.setState({
        termsConds: responseJson.data,
        isLoading: false,
      });
    }
    // Customizable Area End
  }
}
