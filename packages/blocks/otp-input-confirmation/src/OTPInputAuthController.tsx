import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import { runEngine } from '../../../framework/src/RunEngine';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { CommonActions } from '@react-navigation/native';

// Customizable Area Start
import {
  getStorageData,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
// Customizable Area End

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  route?: any; // For React Navigation v6 compatibility
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export interface S {
  // Customizable Area Start
  otp: string[];
  currentIndex: number;
  otpAuthToken: string;
  userAccountID: string;
  toMessage: string;
  isFromForgotPassword: boolean;
  timer: number;
  email: string;
  isFetching: boolean;
  redirectToScreen: string;
  claimID: string;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class OTPInputAuthController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  otpAuthApiCallId: any;
  resendOTPApiCallId: any;
  btnTxtSubmitOtp: string;
  placeHolderOtp: string;
  submitButtonColor: any = configJSON.submitButtonColor;
  otpInputRefs: any[];
  interval: any;
  updateDeviceIdApiCallId: string = '';

  async componentDidMount(): Promise<void> {
    super.componentDidMount();

    // Get route parameters - try both v5 and v6 syntax for compatibility
    const routeParams =
      this.props.route?.params || this.props.navigation?.state?.params;
    console.log('OTP Route params:', routeParams);
    console.log('Navigation state:', this.props.navigation?.state);
    console.log('Route object:', this.props.route);

    this.interval = setInterval(() => {
      if (this.state.timer !== 0) {
        this.setState({ timer: this.state.timer - 1 });
      }
    }, 1000);

    this.setState({
      otpAuthToken: routeParams?.token,
      redirectToScreen: routeParams?.redirect_to,
      claimID: routeParams?.claim_id,
    });
  }

  async componentWillUnmount() {
    clearInterval(this.interval);
    super.componentWillUnmount();
  }
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.EditProfileUpdateMessage),
      // Customizable Area End
    ];

    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    // Customizable Area Start
    this.state = {
      otp: Array(4).fill(''),
      currentIndex: 0,
      otpAuthToken: '',
      userAccountID: '',
      toMessage: '',
      isFromForgotPassword: false,
      timer: 180,
      email: '',
      isFetching: false,
      redirectToScreen: '',
      claimID: '',
    };

    this.btnTxtSubmitOtp = configJSON.btnTxtSubmitOtp;
    this.placeHolderOtp = configJSON.placeHolderOtp;
    this.otpInputRefs = [];
    // Customizable Area End
  }

  async receive(from: String, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleNavigationResponse(message);
    }
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleNavigationResponse(message);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start

  handleRestAPIResponse = (message: Message) => {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );

      if (apiRequestCallId === this.otpAuthApiCallId) {
        this.handleOTPVerificationResponse(message);
      } else if (apiRequestCallId === this.resendOTPApiCallId) {
        this.handleResendOTPResponse(message);
      }
    }
  };

  handleOTPVerificationResponse(message: any) {
    this.setState({ isFetching: false });
    let hasShownError = false;
    let responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (this.state.isFromForgotPassword) {
      this.handleOTPResponseFromForgotPassword(responseJson);
    }

    if (
      responseJson &&
      (responseJson.messages || (responseJson.meta && responseJson.meta.token))
    ) {
      this.updateDeviceId(responseJson.meta.token);
      this.handleOTPResponse(responseJson);
    } else {
      this.showAlert('Error', this.getProfessionalOtpErrorMessage(responseJson));
      hasShownError = true;
    }

    let errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    if (errorReponse != null && !hasShownError) {
      this.showAlert('Error', this.getProfessionalOtpErrorMessage(null, errorReponse));
    }
  }

  getProfessionalOtpErrorMessage = (
    responseJson: any,
    errorReponse: any = null,
  ): string => {
    const defaultMessage =
      'The verification code is invalid or expired. Please try again.';

    const normalizeMessage = (raw: any): string => {
      if (!raw) return '';
      let text = String(raw);
      text = text.replace(/\[HTTP\s*\d+\]\s*/gi, '');
      text = text.replace(/[{}[\]\\]/g, '');
      text = text.replace(/["']/g, '');
      text = text.replace(/pin\s*:\s*/gi, '');
      text = text.replace(/failed_login\s*:\s*/gi, '');
      text = text.replace(/_/g, ' ');
      text = text.replace(/\s+/g, ' ').trim();
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const apiErrors = responseJson?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      for (const err of apiErrors) {
        const candidate =
          err?.full_messages?.[0] ||
          err?.message ||
          err?.error ||
          err?.pin ||
          err;
        const cleaned = normalizeMessage(candidate);
        if (cleaned) return cleaned;
      }
    }

    const messages = responseJson?.messages;
    if (Array.isArray(messages) && messages.length > 0) {
      const candidate = messages[0]?.otp || messages[0]?.message || messages[0];
      const cleaned = normalizeMessage(candidate);
      if (cleaned) return cleaned;
    }

    const metaMessage = responseJson?.message || responseJson?.error || responseJson?.pin;
    const cleanedMeta = normalizeMessage(metaMessage);
    if (cleanedMeta) return cleanedMeta;

    const cleanedNetworkError = normalizeMessage(
      errorReponse?.message || errorReponse,
    );
    if (cleanedNetworkError) return cleanedNetworkError;

    return defaultMessage;
  };

  updateDeviceId = async (token: string) => {
    let messagingToken = await getStorageData('FCMToken');
    const header = {
      'Content-Type': configJSON.apiVerifyOtpContentType,
      token,
    };

    const payload = {
      device_id: messagingToken,
    };

    const updateDeviceIdRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.updateDeviceIdApiCallId = updateDeviceIdRequestMsg.messageId;

    updateDeviceIdRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      '/account_block/accounts/update_device_id',
    );

    updateDeviceIdRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    updateDeviceIdRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      'PATCH',
    );

    updateDeviceIdRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(payload),
    );

    runEngine.sendMessage(
      updateDeviceIdRequestMsg.id,
      updateDeviceIdRequestMsg,
    );

    return true;
  };

  handleOTPResponse = async (responseJson: any) => {
    this.setState({ otp: ['', '', '', ''] });
    await removeStorageData('editMode');
    await removeStorageData('categoriesFromProfile');
    await removeStorageData('categoriesEditMode');
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.storeUserData(responseJson);

    // Get route parameters - try both v5 and v6 syntax for compatibility
    const routeParams =
      this.props.route?.params || this.props.navigation?.state?.params;

    if (routeParams?.endpoint === '/account_block/accounts') {
      this.handleAccountBlockResponse(responseJson, message);
    } else {
      this.handleNonAccountBlockResponse(responseJson, message);
    }

    this.send(message);

    const isSignupEmailConfirmationFlow =
      routeParams?.endpoint === '/account_block/accounts';

    // Login OTP: reset to Home (existing behavior). Signup OTP: do not reset — NavigationMessage +
    // redirectionNav must reach onboarding (CreateYourProfile / CategoriesSubCategories), not Home.
    if (
      !isSignupEmailConfirmationFlow &&
      this.state.redirectToScreen !== 'dispute_form' &&
      this.state.redirectToScreen !== 'claim_page'
    ) {
      this.navigateToHomeAfterLogin();
    }
  };

  navigateToHomeAfterLogin = () => {
    try {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        }),
      );
    } catch (_) {
      this.props.navigation.navigate('Home');
    }
  };

  handleAccountBlockResponse = async (responseJson: any, message: Message) => {
    let redirectionNav = '';
    let info;
    const accountType = responseJson.data.attributes.account_type;
    // Determine userRole based on account_type
    let userRole;
    if (accountType === null || accountType === 'Fan') {
      userRole = 'fan';
    } else if (accountType === 'Band' || accountType === 'Artist') {
      userRole = 'band';
    } else {
      userRole = 'venue';
    }

    // Account types that should navigate to CreateYourProfile
    // Include both underscore and space versions for compatibility
    const profileCreationTypes = [
      'Band',
      'Artist',
      'Venue',
      'Club',
      'Theater',
      'Museum',
      'Record_Label',
      'Record_Label',
      'Promoter',
      'Bar',
      'Gallery',
      'Casino',
      'Cabaret',
      'Booking_Agent',
      'Agency',
      'Record_Store',
    ];

    if (userRole !== 'fan') {
      if (this.state.redirectToScreen === 'dispute_form') {
        redirectionNav = 'DisputeForm';
        info = this.getAccountInfo(responseJson, {
          claimID: this.state.claimID,
        });
        setStorageData('DisputeInfo', JSON.stringify(info));
      } else if (this.state.redirectToScreen === 'claim_page') {
        redirectionNav = 'ClaimPage';
        info = this.getAccountInfo(responseJson);
        setStorageData('ClaimInfo', JSON.stringify(info));
      } else if (profileCreationTypes.includes(accountType)) {
        setStorageData('userRole', userRole);
        setStorageData('user_country', responseJson.data.attributes.country);
        setStorageData('editMode', 'false');
        setStorageData('account_type', accountType);
        setStorageData('signup_band_name', responseJson.data.attributes.first_name);
        redirectionNav = 'CategoriesSubCategories';
      } else {
        setStorageData('userRole', userRole);
        setStorageData('user_country', responseJson.data.attributes.country);
        setStorageData('editMode', 'false');
        setStorageData('account_type', accountType);
        setStorageData('signup_band_name', responseJson.data.attributes.first_name);
        redirectionNav = 'CreateYourProfile';
      }
    } else {
      // Fan account signup: categories/subcategories selection, not CreateYourProfile
      setStorageData('userRole', userRole);
      setStorageData('user_country', responseJson.data.attributes.country);
      setStorageData('editMode', 'false');
      setStorageData('account_type', accountType);
      setStorageData('signup_band_name', responseJson.data.attributes.first_name);
      setStorageData('user_state', responseJson.data.attributes.state);
      setStorageData('navigateBack', 'false');
      redirectionNav = 'CategoriesSubCategories';
    }

    if (
      this.state.redirectToScreen === 'dispute_form' ||
      this.state.redirectToScreen === 'claim_page'
    ) {
      message.addData(
        getName(MessageEnum.NavigationTargetMessage),
        redirectionNav,
      );
    } else {
      setStorageData('redirectionNav', redirectionNav);
      // Also set the navigation target to ensure proper navigation
      message.addData(
        getName(MessageEnum.NavigationTargetMessage),
        redirectionNav,
      );
      const authMessage = new Message(
        getName(MessageEnum.AuthTokenEmailMessage),
      );
      authMessage.addData('token', responseJson.meta.token);
      runEngine.sendMessage(authMessage.id, authMessage);
    }
  };

  handleNonAccountBlockResponse = (responseJson: any, message: Message) => {
    const { account_type } = responseJson.data.attributes;
    let userRole;
    if (account_type === null || account_type === 'Fan') {
      userRole = 'fan';
    } else if (account_type === 'Band' || account_type === 'Artist') {
      userRole = 'band';
    } else {
      userRole = 'venue';
    }
    setStorageData('userRole', userRole);

    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Home');
    const authMessage = new Message(getName(MessageEnum.AuthTokenEmailMessage));
    authMessage.addData('token', responseJson.meta.token);
    runEngine.sendMessage(authMessage.id, authMessage);
  };

  getAccountInfo = (responseJson: any, additionalInfo = {}) => {
    return {
      bandName: responseJson.data.attributes.first_name,
      type: responseJson.data.attributes.account_type,
      selectedCountry: responseJson.data.attributes.country,
      selectedState: responseJson.data.attributes.state,
      selectedCity: responseJson.data.attributes.city,
      ...additionalInfo,
    };
  };

  storeUserData = (responseJson: any) => {
    const userName = responseJson.data.attributes.first_name.trim();
    const profileImage = responseJson.data.attributes.profile_image;
    const phoneNumber = responseJson.data.attributes.full_phone_number;

    const { account_type } = responseJson.data.attributes;
    let userRole;
    if (account_type === null || account_type === 'Fan') {
      userRole = 'fan';
    } else if (account_type === 'Band' || account_type === 'Artist') {
      userRole = 'band';
    } else {
      userRole = 'venue';
    }

    const selectedState = responseJson.data.attributes.state;
    const city = responseJson.data.attributes.city;

    if (profileImage) {
      setStorageData('user_profile_pic', profileImage);
      const info = {
        user_profile_pic: profileImage,
        userName: userName,
      };
      const raiseMessage: Message = new Message(
        getName(MessageEnum.EditProfileUpdateMessage),
      );
      raiseMessage.addData(getName(MessageEnum.EditProfileUpdateMessage), info);
      this.send(raiseMessage);
    }
    if (this.state.redirectToScreen !== 'dispute_form')
      setStorageData('authToken', responseJson.meta.token);

    setStorageData('user_id', responseJson.data.id);
    setStorageData('user_email', responseJson.data.attributes.email);
    setStorageData('user_name', userName);
    setStorageData(
      'user_phone_number',
      phoneNumber ? phoneNumber.toString() : '',
    );
    setStorageData('userRole', userRole);
    setStorageData(
      'user_push_notification',
      responseJson.data.attributes.push_notification.toString(),
    );
    setStorageData('state', selectedState);
    setStorageData('city', city);
    setStorageData('user_country', responseJson.data.attributes.country);
    setStorageData(
      'tAndCAcceptance',
      responseJson.data.attributes.terms_and_conditions.toString(),
    );
  };

  handleOTPResponseFromForgotPassword = (responseJson: any) => {
    if (
      responseJson.messages &&
      responseJson.messages[0] &&
      responseJson.messages[0].otp
    ) {
      const message: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(
        getName(MessageEnum.AuthTokenDataMessage),
        this.state.otpAuthToken,
      );
      message.addData(
        getName(MessageEnum.NavigationTargetMessage),
        'NewPassword',
      );
      this.send(message);
    } else {
      this.showAlert('Error', this.getProfessionalOtpErrorMessage(responseJson));
    }
  };

  handleNavigationResponse(message: any) {
    const phoneAuthToken = message.getData(
      getName(MessageEnum.AuthTokenDataMessage),
    );

    const phoneNumber = message.getData(
      getName(MessageEnum.AuthTokenPhoneNumberMessage),
    );

    const forgotPasswordBool = message.getData(
      getName(MessageEnum.EnterOTPAsForgotPasswordMessage),
    );

    const emailValue = message.getData(
      getName(MessageEnum.AuthTokenEmailMessage),
    );

    const userAccountID = phoneNumber ? '' + phoneNumber : '' + emailValue;

    let updatedLabel = '';
    if (userAccountID && userAccountID !== 'undefined') {
      updatedLabel = updatedLabel.replace('phone', userAccountID);
    }

    this.setState({
      otpAuthToken:
        phoneAuthToken && phoneAuthToken.length > 0
          ? phoneAuthToken
          : this.state.otpAuthToken,
      userAccountID: userAccountID,
      email: emailValue,
      isFromForgotPassword:
        forgotPasswordBool === undefined
          ? this.state.isFromForgotPassword
          : forgotPasswordBool,
    });
  }

  handleResendOTPResponse(message: any) {
    this.setState({ isFetching: false });
    let responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (responseJson) {
      this.setState({ timer: 180, otpAuthToken: responseJson.meta.token });
      this.showAlert('Success', 'OTP is resent');
    } else {
      this.showAlert('Error', this.getProfessionalOtpErrorMessage(responseJson));
    }

    let errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    if (errorReponse != null) {
      this.showAlert('Error', this.getProfessionalOtpErrorMessage(null, errorReponse));
    }
  }

  async submitOtp() {
    console.log('here is ', this.state.otpAuthToken);

    this.setState({ isFetching: true });
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const headers = {
      'Content-Type': configJSON.apiVerifyOtpContentType,
      token: this.state.otpAuthToken,
    };

    this.otpAuthApiCallId = requestMessage.messageId;

    if (this.state.isFromForgotPassword) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        '/bx_block_forgot_password/confirm_otp?pin=' +
          this.state.otp[0] +
          this.state.otp[1] +
          this.state.otp[2] +
          this.state.otp[3],
      );
    } else {
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        '/account_block/accounts/email_confirmations?pin=' +
          this.state.otp[0] +
          this.state.otp[1] +
          this.state.otp[2] +
          this.state.otp[3],
      );
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify({}), // only stringify once
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiVerifyOtpMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  btnSubmitOTPProps = {
    onPress: () => this.submitOtp(),
  };

  txtMobilePhoneOTPWebProps = {
    onChangeText: (text: string) => this.setState({ otp: [text] }),
  };

  txtMobilePhoneOTPMobileProps = {
    ...this.txtMobilePhoneOTPWebProps,
    keyboardType: 'numeric',
  };

  txtMobilePhoneOTPProps = this.isPlatformWeb()
    ? this.txtMobilePhoneOTPWebProps
    : this.txtMobilePhoneOTPMobileProps;

  focusInput(index: number) {
    if (index < this.otpInputRefs.length) {
      this.otpInputRefs[index].focus();
    }
  }

  handleKeyPress = ({ nativeEvent }: any, index: any) => {
    let otpTxt = [...this.state.otp];
    if (nativeEvent.key === 'Backspace' && index > 0) {
      if (!otpTxt[index]) {
        this.otpInputRefs[index - 1].focus();
        otpTxt[index - 1] = '';
      }
      this.setState({ otp: otpTxt });
    }
  };

  handleOTPChange = (text: any, index: any) => {
    let newOtp = [...this.state?.otp];
    newOtp[index] = text;
    this.setState({ otp: newOtp });
    if (text && index < 3 && !newOtp[index + 1]) {
      this.otpInputRefs[index + 1].focus();
    }
  };

  resendOTP() {
    this?.setState({ isFetching: true });
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const headers = {
      'Content-Type': configJSON.apiVerifyOtpContentType,
    };

    // Get route parameters - try both v5 and v6 syntax for compatibility
    const routeParams =
      this.props.route?.params || this.props.navigation?.state?.params;

    this.resendOTPApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      routeParams?.endpoint,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(routeParams?.payload),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiVerifyOtpMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }
  // Customizable Area End
}
