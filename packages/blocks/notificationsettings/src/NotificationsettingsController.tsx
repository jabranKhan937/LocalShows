import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  checkedActionBar: boolean;
  checkedActionBarText: string;
  notificationData: any;
  token: string;

  // Customizable Area End
}

interface SS {
  id: any;
}

export default class NotificationsettingsController extends BlockComponent<
  Props,
  S,
  SS
> {
  notificationAPICallId: any;
  setNotificationAPICall: any;
  setNotificationGroupAPICall: any;
  setNotificationSubGroupAPICall: any;

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage)
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      checkedActionBar: false,
      checkedActionBarText: configJSON.notificationGroup1,
      notificationData: [],
      token: ""
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
      this.getNotificationDataRequest(token);
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
      if (responseJson.data) {
        if (apiRequestCallId === this.notificationAPICallId) {
          this.setState({ notificationData: responseJson.data });
        }
        if (apiRequestCallId === this.setNotificationAPICall) {
          var array = this.state.notificationData;
          for (let i = 0; i < array.length; i++) {
            if (array[i].id === responseJson.data.id) {
              array[i] = responseJson.data;
            }
          }
          this.setState({ notificationData: array });
        }
        if (apiRequestCallId === this.setNotificationGroupAPICall) {
          var array = this.state.notificationData;
          for (let i = 0; i < array.length; i++) {
            for (
              let j = 0;
              j < array[i].attributes.notification_groups.data.length;
              j++
            ) {
              if (
                array[i].attributes.notification_groups.data[j].id ===
                responseJson.data.id
              ) {
                array[i].attributes.notification_groups.data[j] =
                  responseJson.data;
              }
            }
          }
          this.setState({ notificationData: array });
        }
        if (apiRequestCallId === this.setNotificationSubGroupAPICall) {
          var array = this.state.notificationData;
          for (let i = 0; i < array.length; i++) {
            for (
              let j = 0;
              j < array[i].attributes.notification_groups.data.length;
              j++
            ) {
              for (
                let k = 0;
                k <
                array[i].attributes.notification_groups.data[j].attributes
                  .notification_subgroups.data.length;
                k++
              ) {
                if (
                  array[i].attributes.notification_groups.data[j].attributes
                    .notification_subgroups.data[k].id === responseJson.data.id
                ) {
                  array[i].attributes.notification_groups.data[
                    j
                  ].attributes.notification_subgroups.data[k] =
                    responseJson.data;
                }
              }
            }
          }
          this.setState({ notificationData: array });
        }
        runEngine.debugLog("API Recived", responseJson.data);
      } else if (responseJson.errors) {
        this.parseApiErrorResponse(responseJson);
        this.setState({ notificationData: this.state.notificationData });
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  }

  getNotificationDataRequest = (token: string) => {
    const header = {
      "Content-Type": configJSON.notificationApiContentType,
      token: token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.notificationAPICallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getNotificationAPIEndPoint
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

  // Customizable Area Start

  setMainCheckBox(item: any) {
    var data = {
      title: item.attributes.title,
      description: item.attributes.description,
      state: item.attributes.state === "active" ? "inactive" : "active"
    };
    this.postNotificationDataRequest(
      configJSON.updateNotificationAPIEndPoint + `${item.id}`,
      data,
      "setNotification"
    );
  }

  setGroupCheckBox(index: number, groupIndex: number, groupitem: any) {
    var data = {
      group_type: groupitem.attributes.group_type,
      group_name: groupitem.attributes.group_name,
      state: groupitem.attributes.state === "active" ? "inactive" : "active",
      notification_setting_id: groupitem.attributes.notification_setting_id
    };
    this.postNotificationDataRequest(
      configJSON.updateNotificationGroupAPIEndPoint + `${groupitem.id}`,
      data,
      "setGroupNotification"
    );
  }

  setSubGroupCheckBox = (subGroupItem: any) => {
    let data = {
      subgroup_type: subGroupItem.attributes.subgroup_type,
      subgroup_name: subGroupItem.attributes.subgroup_name,
      state: subGroupItem.attributes.state === "active" ? "inactive" : "active",
      notification_group_id: subGroupItem.attributes.notification_group_id
    };

    this.postNotificationDataRequest(
      configJSON.updateNotificationSubGroupAPIEndPoint + `${subGroupItem.id}`,
      data,
      "setSubGroupNotification"
    );
  };

  postNotificationDataRequest = (
    endPointURL: string,
    data: any,
    type: string
  ): boolean => {
    const header = {
      "Content-Type": configJSON.notificationApiContentType,
      token: this.state.token
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    if (type === "setNotification") {
      this.setNotificationAPICall = requestMessage.messageId;
    } else if (type === "setGroupNotification") {
      this.setNotificationGroupAPICall = requestMessage.messageId;
    } else if (type === "setSubGroupNotification") {
      this.setNotificationSubGroupAPICall = requestMessage.messageId;
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPointURL
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
      configJSON.httpPatchMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  // Customizable Area End
}
