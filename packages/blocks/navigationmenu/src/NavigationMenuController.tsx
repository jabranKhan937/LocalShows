import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { userProfile } from "./assets";
import { Linking } from "react-native";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  drawerContent?: boolean;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  webDrawer: boolean;
  token: any;
  drawerItems: any;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class NavigationMenuController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiGetDataCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      webDrawer: false,
      token: "",
      drawerItems: [],
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      runEngine.debugLog("TOKEN", token);
      this.setState({ token: token }, () => {
        this.getMenuItems();
      });
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.apiGetDataCallId !== "" &&
      this.apiGetDataCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (responseJson) {
        this.setState({ drawerItems: responseJson });
      } else {
        this.parseApiErrorResponse(responseJson);
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  toggleDrawer = (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({ webDrawer: !this.state.webDrawer });
  };

  onPressMenuItem = (menuItem: any) => {
    let path = menuItem.url;

    var tarea_regex = /^(http|https)/;
    if (tarea_regex.test(String(path).toLowerCase())) {
      if (this.isPlatformWeb()) {
        window.open(path);
      } else {
        Linking.openURL(path);
      }
    } else {
      const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
      msg.addData(getName(MessageEnum.NavigationTargetMessage), path);
      msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      this.send(msg);
    }
  };

  userProfileProps = {
    source: userProfile,
  };

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

  getMenuItems = async () => {
    let token = this.state.token;

    const header = {
      "Content-Type": configJSON.jsonApiContentType,
      token: token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiGetDataCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getMenuItemsEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  // Customizable Area End
}
