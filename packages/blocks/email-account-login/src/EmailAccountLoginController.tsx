import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { removeStorageData } from "../../../framework/src/Utilities";
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
  password: string;
  email: string;
  emailError: string;
  passwordError: string;
  enablePasswordField: boolean;
  checkedRememberMe: boolean;
  placeHolderEmail: string;
  placeHolderPassword: string;
  imgPasswordVisible: any;
  imgPasswordInVisible: any;
  labelHeader: string;
  btnTxtLogin: string;
  labelRememberMe: string;
  btnTxtSocialLogin: string;
  labelOr: string;
  showPswrd: boolean;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class EmailAccountLoginController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiEmailLoginCallId: string = "";
  validationApiCallId: string = "";
  emailReg: RegExp;
  labelTitle: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.ReciveUserCredentials),
    ];

    this.state = {
      email: __DEV__ ? "jackFan@yopmail.com" : "",
      password: __DEV__ ? "1122@Cheema" : "",
      emailError: "",
      passwordError: "",
      enablePasswordField: true,
      checkedRememberMe: false,
      placeHolderEmail: configJSON.placeHolderEmail,
      placeHolderPassword: configJSON.placeHolderPassword,
      imgPasswordVisible: configJSON.imgPasswordVisible,
      imgPasswordInVisible: imgPasswordInVisible,
      labelHeader: configJSON.labelHeader,
      btnTxtLogin: configJSON.btnTxtLogin,
      labelRememberMe: configJSON.labelRememberMe,
      btnTxtSocialLogin: configJSON.btnTxtSocialLogin,
      labelOr: configJSON.labelOr,
      showPswrd: false,
    };

    this.emailReg = new RegExp("");
    this.labelTitle = configJSON.labelTitle;
    // Customizable Area End

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    this.callGetValidationApi();
    this.send(new Message(getName(MessageEnum.RequestUserCredentials)));
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  btnSocialLoginProps = {
    onPress: () => this.goToSocialLogin(),
  };

  btnEmailLogInProps = {
    onPress: () => this.doEmailLogIn(),
  };

  async componentWillUnmount(): Promise<void> {
    super.componentWillUnmount()
  }
  btnPasswordShowHideProps = {
    onPress: () => {
      this.setState({ enablePasswordField: !this.state.enablePasswordField });
      this.txtInputPasswordProps.secureTextEntry =
        !this.state.enablePasswordField;
      this.btnPasswordShowHideImageProps.source = this.txtInputPasswordProps
        .secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  // Web Event Handling
  handleClickShowPassword = () => {
    this.setState({
      enablePasswordField: !this.state.enablePasswordField,
    });
  };

  setEmail = (text: string) => {
    this.setState({
      email: text.replace(" ", "") ,
    });
  };

  setPassword = (text: string) => {
    this.setState({
      password: text.replace("  ", " "),
    });
  };

  setRememberMe = (value: boolean) => {
    this.setState({ checkedRememberMe: value });
  };

  CustomCheckBoxProps = {
    onChangeValue: (value: boolean) => {
      this.setState({ checkedRememberMe: value });
      this.CustomCheckBoxProps.isChecked = value;
    },
    isChecked: false,
  };

  btnForgotPasswordProps = {
    onPress: () => this.goToForgotPassword(),
  };

  txtInputPasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ password: text });

      //@ts-ignore
      this.txtInputPasswordProps.value = text;
    },
    secureTextEntry: true,
  };

  btnPasswordShowHideImageProps = {
    source: imgPasswordVisible,
  };

  btnRememberMeProps = {
    onPress: () => {
      this.setState({ checkedRememberMe: !this.CustomCheckBoxProps.isChecked });
      this.CustomCheckBoxProps.isChecked = !this.CustomCheckBoxProps.isChecked;
    },
  };

  txtInputEmailWebProps = {
    onChangeText: (text: string) => {
      this.setState({ email: text });

      //@ts-ignore
      this.txtInputEmailProps.value = text;
    },
  };

  txtInputEmailMobileProps = {
    ...this.txtInputEmailWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputEmailProps = this.isPlatformWeb()
    ? this.txtInputEmailWebProps
    : this.txtInputEmailMobileProps;

  handleValidationApiResponse = (responseJson: any) => {
    let arrayholder = responseJson.data;

    if (arrayholder && arrayholder.length !== 0) {
      let regexData = arrayholder[0];

      if (regexData && regexData.email_validation_regexp) {
        this.emailReg = new RegExp(regexData.email_validation_regexp);
      }
    }
  }

  handleEmailLoginAPIResponse = (responseJson: any, errorReponse: any) => {
    if (responseJson && responseJson.meta && responseJson.meta.token) {
      removeStorageData('popupShown');
      
      const navigationParams = {
        payload: {
          email: this.state.email,
          data: {
            type: "email_account",
            attributes: {
              email: this.state.email,
              password: this.state.password,
            }
          }
        },
        token: responseJson.meta.token,
        endpoint: configJSON.loginAPiEndPoint,
      };
      
      console.log('Navigating to OTP with params:', navigationParams);
      this.props.navigation.navigate("OTPInputAuth", navigationParams);
      this.setState({ email: "", password: "", emailError: "", passwordError: "" });
    } else {
      const loginErrorMessage = this.getProfessionalLoginErrorMessage(
        responseJson,
        errorReponse,
      );
      this.showAlert("Error", loginErrorMessage);
      this.sendLoginFailMessage();
    }
  }

  getProfessionalLoginErrorMessage = (
    responseJson: any,
    errorReponse: any,
  ): string => {
    const defaultMessage =
      "Unable to log in. Please check your email and password, then try again.";

    const normalizeMessage = (raw: any): string => {
      if (!raw) return "";
      let text = String(raw);
      text = text.replace(/\[HTTP\s*\d+\]\s*/gi, "");
      text = text.replace(/[{}[\]\\]/g, "");
      text = text.replace(/["']/g, "");
      text = text.replace(/failed_login\s*:\s*/gi, "");
      text = text.replace(/_/g, " ");
      text = text.replace(/\s+/g, " ").trim();
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const apiErrors = responseJson?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      for (const err of apiErrors) {
        const candidate =
          err?.full_messages?.[0] ||
          err?.message ||
          err?.error ||
          err?.failed_login ||
          err;
        const cleaned = normalizeMessage(candidate);
        if (cleaned) return cleaned;
      }
    }

    const metaMessage =
      responseJson?.message ||
      responseJson?.error ||
      responseJson?.failed_login;
    const cleanedMeta = normalizeMessage(metaMessage);
    if (cleanedMeta) return cleanedMeta;

    const cleanedNetworkError = normalizeMessage(
      errorReponse?.message || errorReponse,
    );
    if (cleanedNetworkError) return cleanedNetworkError;

    return defaultMessage;
  };

  handleApiResponse = async (message: any) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    let responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    let errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );

    if (apiRequestCallId != null) {
      if (
        apiRequestCallId === this.validationApiCallId &&
        responseJson !== undefined
      ) {
        this.handleValidationApiResponse(responseJson);
      }

      if (apiRequestCallId === this.apiEmailLoginCallId) {
        this.handleEmailLoginAPIResponse(responseJson, errorReponse);
      }
    }

  }

  validateLoginForm = () => {
    this.setState({password: this.state.password.trim()})
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let error = false;
    this.setState({
      emailError: "",
      passwordError: ""
    })

    if (!this.state.email || this.state.email.trim().length === 0) {
      this.setState({ emailError: configJSON.errorEmailCannotBeBlank });
      error = true;
    } else if (!emailRegex.test(this.state.email)) {
      this.setState({ emailError: configJSON.errorEmailNotValid });
      error = true;
    }

    if (this.state.password === null || this.state.password.length === 0) {
      this.setState({ passwordError: configJSON.errorPasswordCannotBeBlank });
      error = true;
    } else {
      const errorStr = this.analyzePassword(this.state.password.trim());
      if (errorStr) {
        this.setState({ passwordError: errorStr });
        error = true;
      }
    }

    if (error) {
      return false;
    }

    this.doEmailLogIn();
    return true;
  }

  goToRolesandpermissions = () => {
    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), "Rolesandpermissions");
    this.send(message);
  }
  // Customizable Area End

  async receive(from: string, message: Message) {
    // Customizable Area Start

    if (getName(MessageEnum.ReciveUserCredentials) === message.id) {
      const userName = message.getData(getName(MessageEnum.LoginUserName));

      const password = message.getData(getName(MessageEnum.LoginPassword));

      const countryCode = message.getData(
        getName(MessageEnum.LoginCountryCode)
      );

      if (!countryCode && userName && password) {
        this.setState({
          email: userName,
          password: password,
          checkedRememberMe: true,
        });

        //@ts-ignore
        this.txtInputEmailProps.value = userName;

        //@ts-ignore
        this.txtInputPasswordProps.value = password;

        this.CustomCheckBoxProps.isChecked = true;
      }
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      await this.handleApiResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  sendLoginFailMessage() {
    const msg: Message = new Message(getName(MessageEnum.LoginFaliureMessage));
    this.send(msg);
  }

  sendLoginSuccessMessage() {
    const msg: Message = new Message(getName(MessageEnum.LoginSuccessMessage));

    msg.addData(getName(MessageEnum.LoginUserName), this.state.email);
    msg.addData(getName(MessageEnum.CountyCodeDataMessage), null);
    msg.addData(getName(MessageEnum.LoginPassword), this.state.password);
    msg.addData(
      getName(MessageEnum.LoginIsRememberMe),
      this.state.checkedRememberMe
    );

    this.send(msg);
  }

  openInfoPage() {
    // Merge Engine - Navigation - btnEmailLogIn - Start
    const msg: Message = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
    // Merge Engine - Navigation - btnEmailLogIn - End
  }

  goToForgotPassword() {
    // Merge Engine - Navigation - btnForgotPassword - Start
    const msg: Message = new Message(
      getName(MessageEnum.NavigationForgotPasswordMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationForgotPasswordPageInfo), "email");
    this.send(msg);
    // Merge Engine - Navigation - btnForgotPassword - End
  }

  goToSocialLogin() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationSocialLogInMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }

  doEmailLogIn(): boolean {
    if (
      this.state.email === null ||
      this.state.email.length === 0 ||
      !this.emailReg.test(this.state.email.trim())
    ) {
      this.showAlert("Error", configJSON.errorEmailNotValid);
      return false;
    }

    if (this.state.password === null || this.state.password.length === 0) {
      this.showAlert("Error", configJSON.errorPasswordNotValid);
      return false;
    }

    const header = {
      "Content-Type": configJSON.loginApiContentType,
    };

    const attrs = {
      email: this.state.email.trim(),
      password: this.state.password.trim(),
    };

    const data = {
      type: "email_account",
      attributes: attrs,
    };

    const httpBody = {
      data: data,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiEmailLoginCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.loginAPiEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.loginAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  callGetValidationApi() {
    const headers = {
      "Content-Type": configJSON.validationApiContentType,
    };

    const getValidationsMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.validationApiCallId = getValidationsMsg.messageId;

    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.urlGetValidations
    );

    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );
    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );
    runEngine.sendMessage(getValidationsMsg.id, getValidationsMsg);
  }

  analyzePassword(password: string) {
    let error = false;

    if (password.length < 8) {
      error = true;
    }

    if (!/[a-z]/.test(password)) {
      error = true;
    }

    if (!/[A-Z]/.test(password)) {
      error = true;
    }

    if (!/\d/.test(password)) {
      error = true;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      error = true;
    }

    if (error) {
      return configJSON.errorPasswordNotValid;
    }

    return "";
  }

  handlePasswordIcon = () => {
    this.setState({ showPswrd: !this.state.showPswrd })
  }

  handleForgotPassword = () => {
    this.setState({ email: "", password: "", emailError: "", passwordError: "" });
    this.goToForgotPassword();
  }

  handleSignup = () => {
    this.setState({ email: "", password: "", emailError: "", passwordError: "" });
    this.goToRolesandpermissions();
  }

  // Customizable Area End
}
