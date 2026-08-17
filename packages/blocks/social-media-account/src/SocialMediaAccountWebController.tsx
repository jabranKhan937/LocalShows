import { runEngine } from "../../../framework/src/RunEngine";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { IBlock } from "../../../framework/src/IBlock";

import googleController, { GoogleWebDelegate } from "./GoogleWebController";

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  loading: boolean;
  isRegistration: boolean;
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  // Customizable Area End
}

export default class SocialMediaAccountWebController
  extends BlockComponent<Props, S, SS>
  implements GoogleWebDelegate {
  createAccountAPICallId: any;
  googleUser: any;
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [];
    this.receive = this.receive.bind(this);
    runEngine.attachBuildingBlock(this as IBlock, [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage)
      // Customizable Area End
    ]);

    this.state = {
      // Customizable Area Start
      loading: false,
      isRegistration: false
      // Customizable Area End
    };
  }

  // Customizable Area Start
  //When facebook sends back the reponse this gets called
  googleUserStatusChanged(userInfo: any): void {
    if (this.state.isRegistration) {
      this.createAccountFromSocial(userInfo.email, userInfo.id, this.props);
    } else {
      this.logInWithSocial(
        userInfo.email,
        userInfo.email,
        userInfo.id,
        this.props
      );
    }
  }

  startLoading = () => {
    this.setState({ loading: true });
  };

  stopLoading = () => {
    this.setState({ loading: false });
  };

  responseFacebook = (response: any) => {
    this.stopLoading();
    if (this.state.isRegistration) {
      this.createAccountFromSocial(response.email, response.id, this.props);
    } else {
      this.logInWithSocial(
        response.email,
        response.email,
        response.id,
        this.props
      );
    }
    runEngine.debugLog(response);
  };

  googleLogIn = (isRegistration: boolean, credential: string) => {
    const self = this;
 
    googleController.googleLogIn(this, credential)?.then(
      function() {
        self.stopLoading();
        runEngine.debugLog("User SIGNED IN.");
      },
      function(error: any) {
        self.stopLoading();
        if (error.error === "popup_closed_by_user") {
          //handle window closed event
        }
      }
    );
  };
  // Customizable Area End

  async receive(from: string, message: Message) {
    // Customizable Area Start
    this.stopLoading();

    if (getName(MessageEnum.SessionSaveMessage) === message.id) {
      this.openInfoPage();
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.createAccountAPICallId != null &&
      this.createAccountAPICallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson && responseJson.meta && responseJson.meta.token) {
        this.saveLoggedInUserData(responseJson);
      } else if (responseJson && responseJson.errors) {
        this.parseApiErrorResponse(responseJson);
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  async createAccountFromSocial(
    incomingEmail: String,
    incomingId: String,
    props: Props
  ) {
    if (
      !incomingEmail ||
      incomingEmail.length === 0 ||
      !incomingId ||
      incomingId.length === 0
    ) {
      runEngine.debugLog("createAccountFromSocial empty info");
      return;
    }

    this.startLoading();

    const header = {
      "Content-Type": configJSON.urlHeaderTypeJSON
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.createAccountAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createAccountURL
    );

    const httpBodyData = {
      type: "social_account",
      attributes: {
        email: incomingEmail,
        password: incomingEmail,
        unique_auth_id: incomingId
      }
    };

    const httpBody = {
      data: httpBodyData
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    requestMessage.addData(getName(MessageEnum.NavigationPropsMessage), props);

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postHttpRequest
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  async logInWithSocial(
    incomingEmail: string,
    incomingPassword: string,
    incomingId: string,
    props: Props
  ) {
    if (
      !incomingEmail ||
      incomingEmail.length === 0 ||
      !incomingId ||
      incomingId.length === 0
    ) {
      runEngine.debugLog("createAccountFromSocial empty info");
      return;
    }

    this.startLoading();

    const header = {
      "Content-Type": "application/json"
    };

    const attrs = {
      email: incomingEmail,
      password: incomingPassword,
      unique_auth_id: incomingId
    };

    const httpBodyData = {
      type: "social_account",
      attributes: {
        email: incomingEmail,
        password: incomingEmail,
        unique_auth_id: incomingId
      }
    };

    const httpBody = {
      data: httpBodyData
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.createAccountAPICallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.loginAccountURL
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    requestMessage.addData(getName(MessageEnum.NavigationPropsMessage), props);

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  navigate() {
    runEngine.debugLog("this.isRegistration");
    runEngine.debugLog(this.state.isRegistration);
    if (this.state.isRegistration) {
      runEngine.debugLog("Registration");
      runEngine.debugLog(this.state.isRegistration);
      this.navigateToSignup();
    } else {
      runEngine.debugLog("Registration");
      runEngine.debugLog(this.state.isRegistration);
      this.navigateToLogin();
    }
  }

  navigateToSignup() {
    const navigateToSignupMessage: Message = new Message(
      getName(MessageEnum.NavigateEmailSignUpMessage)
    );
    navigateToSignupMessage.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(navigateToSignupMessage);
  }

  navigateToLogin() {
    const navigateToLoginMessage: Message = new Message(
      getName(MessageEnum.NavigationEmailLogInMessage)
    );
    navigateToLoginMessage.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(navigateToLoginMessage);
  }

  saveLoggedInUserData(responseJson: any) {
    if (responseJson && responseJson.meta && responseJson.meta.token) {
      const saveSessionMessage: Message = new Message(getName(MessageEnum.SessionSaveMessage));

      saveSessionMessage.addData(
        getName(MessageEnum.SessionResponseData),
        JSON.stringify(responseJson)
      );

      saveSessionMessage.addData(
        getName(MessageEnum.SessionResponseToken),
        responseJson.meta.token
      );

      this.send(saveSessionMessage);
    }
  }

  openInfoPage() {
    const openInfoPageMessage = new Message(
      getName(
        this.state.isRegistration
          ? MessageEnum.AccoutResgistrationSuccess
          : MessageEnum.AccoutLoginSuccess
      )
    );
    openInfoPageMessage.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(openInfoPageMessage);
  }

  //Create response callback.
  responseInfoCallback(error: any, result: any) {
    if (error) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorDescription + error.toString()
      );
    } else {
      runEngine.debugLog("Result Name: " + result.name);
    }
  }

  btnFacebookLogInProps = {
    onPress: () => {
      this.startLoading();
    },
    callback: this.responseFacebook
  };

  btnGoogleLogInProps = {
    useOneTap: true,
    onResponse: (credential: string) => {
      this.googleLogIn(this.state.isRegistration, credential);
      this.startLoading();
    },
    onError: (error: string) => {
      alert(error);
    }
  };

  btnNavigateProps = {
    onPress: () => this.navigate()
  };
  // Customizable Area End
}
