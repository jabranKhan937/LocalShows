import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  route: any;
  data: any;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: string;
  subscriptions: any;
  data: any;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class CustomisableusersubscriptionsController extends BlockComponent<
  Props,
  S,
  SS
> {

  // Customizable Area Start
  getListCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIRequestMessage),
      getName(MessageEnum.RestAPIResponceMessage)
    ];

    this.state = {
      token: "",
      subscriptions: [],
      data: null
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const data = message.getData(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      this.setState({ data: data });
    }
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: token }, () => {
        this.fetchSubscriptionsList();
      });
    }
    if (message.id === getName(MessageEnum.RestAPIResponceMessage)) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (apiRequestCallId && responseJson) {
        if (apiRequestCallId === this.getListCallId) {
          this.setState({
            subscriptions: responseJson.data
          });
        }
      }
    }
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  fetchSubscriptionsList = () => {
    // Customizable Area Start
    const header = {
      token: this.state.token,
      "Content-Type": configJSON.subscriptionApiContentType
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getListCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getSubscriptionAPiEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getSubscriptionAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
  };

  gotoSubDetailScreen(item:any) {
    // Customizable Area Start
    const msg = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationTargetMessage), "SubscriptionDetails");
    msg.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props
    );
    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.NavigationPayLoadMessage), item);
    msg.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(msg)
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End
}
