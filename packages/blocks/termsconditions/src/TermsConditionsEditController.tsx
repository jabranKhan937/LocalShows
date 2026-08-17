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
  termsConds: string;
  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class TermsConditionsEditController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  updateTermsCondsCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      termsCondsId: "",
      termsConds: "",
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

  handleTextChange = (value: string | undefined) =>
    value && this.setState({ termsConds: value });

  sendTermsConds = (termsConds: string) => {
    const token = this.state.token;
    const header = {
      "Content-Type": configJSON.apiContentType,
      token,
    };
    const body = {
      description: termsConds,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateTermsCondsCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.createTermsCondsApiEndPoint}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
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
      if (token) this.setState({ token });
    }

    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const termsCondsData = message.getData(
        getName(MessageEnum.SessionResponseData)
      );
      if (termsCondsData) {
        const { termsConds, termsCondsId } = termsCondsData;
        this.setState({ termsConds: termsConds, termsCondsId: termsCondsId });
      }
    }

    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      apiRequestCallId === this.updateTermsCondsCallId &&
      responseJson?.data
    ) {
      this.updateTermsCondsCallId = "";
      alert(configJSON.termsCondsUpdatedMassage);
    }
    // Customizable Area End
  }
}
