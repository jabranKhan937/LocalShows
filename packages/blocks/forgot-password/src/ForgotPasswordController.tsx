import { BlockComponent } from "../../../framework/src/BlockComponent";
import { IBlock } from "../../../framework/src/IBlock";
import { runEngine } from "../../../framework/src/RunEngine";
import { Message } from "../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import * as Yup from "yup";
import { imgPasswordVisible, imgPasswordInVisible } from "./assets";
import { DeviceEventEmitter } from "react-native";
import {
  getStorageData,
  isEmpty,
  setStorageData
} from "../../../framework/src/Utilities";
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from "../../utilities/src/Colors";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  accountType: string;
  emailSchema: any;
  phoneSchema: any;
  otpSchema: any;
  passwordSchema: any;
  accountStatus: any;
  passwordRules: any;
  emailValue: any;
  phoneValue: any;
  countryCodeSelected: any;
  token: any;
  enablePasswordField: Boolean;
  btnConfirmPasswordShowHide: Boolean;
  emailError: string;
  newPassword: string;
  confirmNewPassword: string;
  newPasswordError: string;
  confirmNewPasswordError: string;
  isFetching: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

// Customizable Area Start
// Customizable Area End

export default class ForgotPasswordController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  validationAPICallId: any;
  requestEmailOtpCallId: any;
  changePasswordApiCallId: any;
  requestPhoneOtpCallId: any;
  requestChangePasswordCallId: any;
  requestGoToConfirmationCallId: any;
  otpToken: any;
  isChangePassword: boolean;

  //Properties from config
  labelTextIsAccountRecovery: string = configJSON.labelTextIsAccountRecovery;
  secondLabelText: string = configJSON.secondLabelText;
  thirdLabelText: string = configJSON.thirdLabelText;
  forthLabelText: string = configJSON.forthLabelText;
  fifthLabelText: string = configJSON.fifthLabelText;
  sixthLabelText: string = configJSON.sixthLabelText;
  firstInputAutoCompleteType: any = configJSON.firstInputAutoCompleteType;
  firstInputKeyboardStyle: any = configJSON.firstInputKeyboardStyle;
  firstInputPlaceholder: string = configJSON.firstInputPlaceholder;
  firstInputErrorColor: any = configJSON.firstInputErrorColor;
  buttonTextIsNext: string = configJSON.buttonTextIsNext;
  buttonColorForNextButton: any = configJSON.buttonColorForNextButton;
  secondInputAutoCompleteType: any = configJSON.secondInputAutoCompleteType;
  secondInputKeyboardType: any = configJSON.secondInputKeyboardType;
  secondInputPlaceholder: string = configJSON.secondInputPlaceholder;
  secondInputErrorColor: any = configJSON.secondInputErrorColor;
  thirdInputPlaceholder: string = configJSON.thirdInputPlaceholder;
  thirdInputErrorColor: any = configJSON.thirdInputErrorColor;
  buttonTitleIsSMSPhoneAccount: string =
    configJSON.buttonTitleIsSMSPhoneAccount;
  buttonTitleIsEmailAccount: string = configJSON.buttonTitleIsEmailAccount;
  labelTextIsPleaseEnterYourNewPassword: string =
    configJSON.labelTextIsPleaseEnterYourNewPassword;
  labelTextIsYourPasswordHasBeenSuccessfullyChanged: string =
    configJSON.labelTextIsYourPasswordHasBeenSuccessfullyChanged;
  placeholderIsPassword: string = configJSON.placeholderIsPassword;
  imgPasswordInVisible: any = imgPasswordInVisible;
  imgPasswordVisible: any = imgPasswordVisible;
  placeholderIsReTypePassword: string = configJSON.placeholderIsReTypePassword;
  buttonTitleIsOk: string = configJSON.buttonTitleIsOk;
  buttonColorForOkButton: any = configJSON.buttonColorForOkButton;
  countryCodeSelectorPlaceholder: string =
    configJSON.countryCodeSelectorPlaceholder;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
      // Customizable Area End
    ];

    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    this.receive = this.receiveAlt.bind(this);
    //email schema
    let emailSchema = {
      email: Yup.string()
        .email(configJSON.pleaseEnterAValidEmail)
        .required(configJSON.emailIsRequired)
    };

    //phone schema
    let phoneSchema = {
      // countryCode: Yup.number()
      // .required("Country code is required"),

      phone: Yup.string()
        .matches(configJSON.phoneRegExp, configJSON.phoneNumberIsNotValid)
        .required(configJSON.phoneNumberIsRequired)
    };

    //otpSchema
    let otpSchema = {
      otpCode: Yup.number()
        .min(4)
        .required(configJSON.otpCodeIsRequired)
    };

    //passwordSchema
    let passwordSchema = {
      password: Yup.string()
        .required(configJSON.pleaseEnterAPassword)
        .min(2, configJSON.passwordMustBeAtLeast2Characters),
      confirmPassword: Yup.string()
        .required(configJSON.pleaseConfirmYourPassword)
        .when("password", {
          is: val => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref("password")],
            configJSON.passwordsMustMatch
          )
        })
    };

    this.state = {
      accountType: "sms",
      accountStatus: "ChooseAccountType",
      emailValue: "",
      phoneValue: "",
      countryCodeSelected: "",
      passwordRules: "",
      emailSchema: emailSchema,
      phoneSchema: phoneSchema,
      otpSchema: otpSchema,
      passwordSchema: passwordSchema,
      token: "",
      enablePasswordField: true,
      btnConfirmPasswordShowHide: true,
      emailError: "",
      newPassword: "",
      confirmNewPassword: "",
      newPasswordError: "",
      confirmNewPasswordError: "",
      isFetching: false,
      showPassword: false,
      showConfirmPassword: false,
      isDarkMode: true
    };

    this.isChangePassword = false;
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    this.validationRulesRequest();
    this.loadForgotPasswordTheme();
  }

  profileThemeListener: any = null;

  async componentWillUnmount(): Promise<void> {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  loadForgotPasswordTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== "false" });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  getForgotPasswordTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  validationRulesRequest = () => {
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.validationAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.profileValidationSettingsAPiEndPoint
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

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const otpAuthTkn = message.getData(
        getName(MessageEnum.AuthTokenDataMessage)
      );

      if (otpAuthTkn && otpAuthTkn.length > 0) {
        this.setState({ token: otpAuthTkn });
        if (this.isChangePassword) {
          this.setState({ accountStatus: "ChangePassword" });
        }
        this.otpToken = this.state.token;
        // runEngine.debugLog("otpAuthTkn", this.state.token);
      } else {
        const accountType = message.getData(
          getName(MessageEnum.NavigationForgotPasswordPageInfo)
        );
        if (accountType) {
          this.startForgotPassword(accountType);
        }
      }
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.validationAPICallId &&
      this.validationAPICallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson === undefined) {
        return;
      }

      if (responseJson && responseJson.data[0]) {
        const passRegex = RegExp(
          responseJson.data[0].password_validation_regexp
        );
        const emailRegex = RegExp(responseJson.data[0].email_validation_regexp);
        const passwordRulesFromValidation =
          responseJson.data[0].password_validation_rules;

        this.setState({
          //email schema
          emailSchema: {
            email: Yup.string()
              .email(configJSON.pleaseEnterAValidEmail)
              .required(configJSON.emailIsRequired)
              .matches(emailRegex, configJSON.invalidEmailAddress)
          },
          //password schema
          passwordSchema: {
            password: Yup.string()
              .required(configJSON.pleaseEnterAPassword)
              .matches(passRegex, configJSON.invalidPassword),

            confirmPassword: Yup.string()
              .required(configJSON.pleaseConfirmYourPassword)
              .when("password", {
                is: val => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                  [Yup.ref("password")],
                  configJSON.passwordsMustMatch
                )
              })
          },
          passwordRules: passwordRulesFromValidation
        });
      }
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.requestEmailOtpCallId !== null &&
      this.requestEmailOtpCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      // console.log("entered email!!!!");
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (
        responseJson !== undefined &&
        responseJson.meta &&
        responseJson.meta.token
      ) {
        this.otpToken = responseJson.meta.token;

        this.setState({ token: this.otpToken });

        //navigate to OTP page
        const msg: Message = new Message(
          getName(MessageEnum.NavigationMobilePhoneOTPMessage)
        );

        msg.addData(
          getName(MessageEnum.AuthTokenDataMessage),
          this.state.token
        );

        msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

        msg.addData(
          getName(MessageEnum.AuthTokenEmailMessage),
          this.state.emailValue
        );

        msg.addData(getName(MessageEnum.EnterOTPAsForgotPasswordMessage), true);

        this.send(msg);
      }
      //error handling
      else if (responseJson && responseJson.errors) {
        this.parseApiErrorResponse(responseJson);
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );

        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.requestPhoneOtpCallId !== null &&
      this.requestPhoneOtpCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      // console.log("entered phone!!!!");
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (
        responseJson !== undefined &&
        responseJson.meta &&
        responseJson.meta.token
      ) {
        this.otpToken = responseJson.meta.token;
        this.setState({ token: this.otpToken });

        const msg: Message = new Message(
          getName(MessageEnum.NavigationMobilePhoneOTPMessage)
        );
        msg.addData(
          getName(MessageEnum.AuthTokenDataMessage),
          this.state.token
        );

        msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

        msg.addData(
          getName(MessageEnum.AuthTokenPhoneNumberMessage),
          this.state.phoneValue
        );

        msg.addData(getName(MessageEnum.EnterOTPAsForgotPasswordMessage), true);

        this.send(msg);
      }
      //error handling
      else if (responseJson && responseJson.errors) {
        this.parseApiErrorResponse(responseJson);
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );

        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.requestGoToConfirmationCallId !== null &&
      this.requestGoToConfirmationCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      // console.log("entered 3");
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (responseJson !== undefined && responseJson.data) {
        this.setState({
          accountStatus: "Confirmation"
        });
      } else if (responseJson !== undefined && responseJson.errors) {
        this.parseApiErrorResponse(responseJson);
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );

        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (getName(MessageEnum.CountryCodeMessage) === message.id) {
      var selectedCode = message.getData(
        getName(MessageEnum.CountyCodeDataMessage)
      );

      if (selectedCode !== undefined) {
        this.setState({
          countryCodeSelected:
            selectedCode.indexOf("+") > 0
              ? selectedCode.split("+")[1]
              : selectedCode
        });
      }
    }
  }

  startForgotPassword(accountType: String) {
    this.setState({
      accountStatus: accountType === "sms" ? "EnterPhone" : "EnterEmail"
    });
  }

  goToOtpAfterEmailValidation(values: { accountType: string; email: string }) {
    //change status to OTP
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    //GO TO REQUEST STATE
    this.requestEmailOtpCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.passwordRecoveryStartOtpAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    this.setState({
      emailValue: values.email ? values.email : ""
    });

    const data = {
      type: values.accountType ? values.accountType : "email_account",
      attributes: {
        email: values.email ? values.email : ""
      }
    };

    const httpBody = {
      data: data
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  goToOtpAfterPhoneValidation(values: { phone: string }) {
    // console.log("entered phone validation code");
    if (
      !this.state.countryCodeSelected ||
      this.state.countryCodeSelected.length === 0
    ) {
      this.showAlert(
        configJSON.goToOtpAfterPhoneValidationErrorTitle,
        configJSON.goToOtpAfterPhoneValidationErrorBody
      );
      return;
    }
    console.log(this.state.countryCodeSelected);
    //change status to OTP
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    //GO TO REQUEST STATE
    this.requestPhoneOtpCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.passwordRecoveryStartOtpAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    this.setState({
      phoneValue:
        this.state.countryCodeSelected && values.phone
          ? this.state.countryCodeSelected + values.phone
          : ""
    });

    const data = {
      type: "sms_account",
      attributes: {
        full_phone_number: this.state.phoneValue
      }
    };

    const httpBody = {
      data: data
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  goToChangePasswordAfterOtp(values: { otpCode: string }) {
    //change status to change password
    //change status to OTP
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    //GO TO REQUEST STATE
    this.requestChangePasswordCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.passwordRecoveryConfirmOtpAPiEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    const data = {
      token: this.otpToken ? this.otpToken : "",
      otp_code: values.otpCode ? values.otpCode : ""
    };

    const httpBody = {
      data: data
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  goToConfirmationAfterPasswordChange(values: {
    password: any;
    confirmPassword: any;
  }) {
    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    //GO TO REQUEST STATE
    this.requestGoToConfirmationCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.passwordRecoveryChangePasswordAPiEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    const data = {
      token: this.otpToken ? this.otpToken : "",
      new_password: values.password
    };

    const httpBody = {
      data: data
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  goToHome() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationHomeScreenMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }

  goToLogin() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationEmailLogInMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }
  
  // Customizable Area Start
  validateEmail() {
    if (!this.state.emailValue.trim()) {
      this.setState({ emailError: configJSON.emailIsRequired });
      return false;
    } else if (!this.emailIsValid(this.state.emailValue.trim())) {
      this.setState({ emailError: configJSON.pleaseEnterAValidEmail });
      return false;
    }
    return true;
  }

  emailIsValid(email: string) {
    const indexOfAt = email.indexOf("@");
    if (indexOfAt === -1 || email.lastIndexOf("@") !== indexOfAt) {
      return false;
    }
    const usernamePart = email.slice(0, indexOfAt);
    const domain = email.slice(indexOfAt + 1);
    if (usernamePart === "" || domain === "") {
      return false;
    }
    const dotIndex = domain.indexOf(".");
    if (dotIndex === -1 || domain.lastIndexOf(".") !== dotIndex) {
      return false;
    }
    const validCharacters = /^[a-zA-Z0-9_.+-]+$/;
    if (!validCharacters.test(usernamePart) || !validCharacters.test(domain)) {
      return false;
    }

    return true;
  }

  submitEmail() {
    this.setState({ isFetching: true, emailError: "" });

    if (!this.validateEmail()) {
      return false;
    }

    const header = {
      "Content-Type": configJSON.forgotPasswordAPiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.requestEmailOtpCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createOtpEndpoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    const data = {
      attributes: {
        email: this.state.emailValue.trim()
      }
    };

    const httpBody = {
      data: data
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  validatePass = () => {
    this.setState({ newPassword: this.state.newPassword.trim(), confirmNewPassword: this.state.confirmNewPassword.trim() })
    let errors = false;
    this.setState({
      newPasswordError: "",
      confirmNewPasswordError: "",
      isFetching: true
    });


    if (isEmpty(this.state.newPassword)) {
      errors = true;
      this.setState({ newPasswordError: configJSON.errorNewPasswordCannotBeBlank });
    } else {
      const errorStr = this.analyzeForgotPassword(this.state.newPassword);
      if (errorStr) {
        this.setState({ newPasswordError: configJSON.errorInvalidPassword });
        errors = true;
      }
    }
    if (isEmpty(this.state.confirmNewPassword)) {
      errors = true;
      this.setState({
        confirmNewPasswordError: configJSON.errorConfirmPasswordCannotBeBlank
      });
    } else {
      const errorStr = this.analyzeForgotPassword(this.state.confirmNewPassword);
      if (errorStr) {
        this.setState({ confirmNewPasswordError: configJSON.errorInvalidPassword });
        errors = true;
      }
    }

    if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({ confirmNewPasswordError: configJSON.matchNewAndConfirmPassword })
      errors = true;
    }

    if (errors) {
      return false;
    }

    return true;
  }

  handleConfirmPasswordSubmission = async () => {
    if (this.validatePass()) {
      const token = await getStorageData("passOtp");

      const header = {
        "Content-Type": configJSON.forgotPasswordAPiContentType,
        token
      };

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
      this.changePasswordApiCallId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.createPasswordEndpoint
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );

      const data = {
        new_password: this.state.newPassword,
        confirm_password: this.state.confirmNewPassword
      };

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(data)
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  }

  async handleNavigationResponse(message: Message) {
    const otpAuthToken = message.getData(
      getName(MessageEnum.AuthTokenDataMessage)
    );

    if (otpAuthToken && otpAuthToken.length > 0) {
      this.setState({ token: otpAuthToken });
    } else {
      const accountType = message.getData(
        getName(MessageEnum.NavigationForgotPasswordPageInfo)
      );
      if (accountType) {
        this.startForgotPassword(accountType);
      }
    }
  }

  async handleEmailOtpResponse(message: Message) {
    let responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (
      responseJson !== undefined &&
      responseJson.meta &&
      responseJson.meta.token
    ) {
      this.otpToken = responseJson.meta.token;
      setStorageData("passOtp", this.otpToken);

      this.setState({ token: this.otpToken });

      const msg: Message = new Message(
        getName(MessageEnum.NavigationMobilePhoneOTPMessage)
      );
      msg.addData(getName(MessageEnum.AuthTokenDataMessage), this.state.token);
      msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      msg.addData(
        getName(MessageEnum.AuthTokenEmailMessage),
        this.state.emailValue
      );
      msg.addData(getName(MessageEnum.EnterOTPAsForgotPasswordMessage), true);
      this.send(msg);
    } else if (responseJson && responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      this.parseApiCatchErrorResponse(errorReponse);
    }

    this.setState({ isFetching: false });
  }

  async receiveAlt(from: string, message: Message) {
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleNavigationResponse(message);
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.requestEmailOtpCallId !== null &&
      this.requestEmailOtpCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.handleEmailOtpResponse(message);
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.changePasswordApiCallId !== null &&
      this.changePasswordApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.handleResetPasswordResponse(message)
    }
  }

  handleResetPasswordResponse = (message: Message) => {
    let responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if (responseJson && !responseJson.errors) {
      this.showAlert("Password Changed", "Password Changed successfully");
      const msg: Message = new Message(
        getName(MessageEnum.NavigationEmailLogInMessage)
      );
      msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      this.setState({ isFetching: false });
      this.send(msg);
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }

  handlePassword = (text: string) => {
    this.setState({ newPassword: text.replace("  ", " ") })
  }

  handleConfirmPassword = (text: string) => {
    this.setState({ confirmNewPassword: text.replace("  ", " ") })
  }

  analyzeForgotPassword(password: string) {
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
      return configJSON.errorInvalidPassword;
    }

    return "";
  }

  showPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  showConfirmPassword = () => {
    this.setState({
      showConfirmPassword: !this.state.showConfirmPassword,
    });
  };

  // Customizable Area End
}
