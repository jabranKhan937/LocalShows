import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import { runEngine } from '../../../framework/src/RunEngine';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';

import { imgPasswordInVisible, imgPasswordVisible } from './assets';
import { Keyboard, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { isEmpty } from '../../../framework/src/Utilities';

interface IPlaceRecord {
  key: string;
  name: string;
}

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  id: string;
}

export interface S {
  name: string;
  email: string;
  password: string;
  otpAuthToken: string;
  reTypePassword: string;
  data: any[];
  passwordHelperText: string;
  enablePasswordField: boolean;
  enableReTypePasswordField: boolean;
  countryCodeSelected: any;
  phone: string;
  acceptTermsConditions: boolean;
  optInEmails: boolean;
  isEighteenPlus: boolean;
  modalVisible: boolean;
  states: IPlaceRecord[];
  cities: string[];
  selectedState: string;
  selectedCity: string;

  nameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  stateError: string;
  cityError: string;
  phoneError: string;
  userRole: number;
  stateClicked: boolean;
  cityClicked: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  currentLatitude: number;
  currentLongitude: number;
  city: string;
  countries: any[];
  countrySelected: string;
  countryClicked: boolean;
  isOtherCountrySelected: boolean;
  countryError: string;
  countryCodes: any[];
  countryCodeClicked: boolean;
  countryCodeClickedAndroid: boolean;
  isLoading: boolean;
}

export interface SS {
  id: any;
}

export default class EmailAccountRegistrationController extends BlockComponent<
  Props,
  S,
  SS
> {
  arrayholder: any[];
  passwordReg: RegExp;
  emailReg: RegExp;
  createAccountApiCallId: string = '';
  createAccountTimeoutId: any = null;
  getStatesId: string = '';
  getCitiesId: string = '';
  getCurrentStateCityId: string = '';
  imgPasswordVisible: any;
  imgPasswordInVisible: any;

  labelHeader: any;
  labelFirstName: string;
  lastName: string;
  labelEmail: string;
  labelPassword: string;
  labelRePassword: string;
  labelLegalText: string;
  labelLegalTermCondition: string;
  labelLegalPrivacyPolicy: string;
  btnTextSignUp: string;

  currentCountryCode: any;
  getCountryListId: string = '';
  getCountryCodeListId: string = '';

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage),
    ];
    this.receive = this.receive.bind(this);
    this.isStringNullOrBlank = this.isStringNullOrBlank.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    this.state = {
      name: '',
      email: '',
      password: '',
      reTypePassword: '',
      otpAuthToken: '',
      data: [],
      passwordHelperText: '',
      enablePasswordField: true,
      enableReTypePasswordField: true,
      countryCodeSelected: {},
      phone: '',
      acceptTermsConditions: false,
      optInEmails: false,
      isEighteenPlus: false,
      modalVisible: false,
      states: [],
      cities: [],
      selectedState: '',
      selectedCity: '',

      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      stateError: '',
      cityError: '',
      phoneError: '',
      userRole: 1,
      stateClicked: false,
      cityClicked: false,
      showPassword: false,
      showConfirmPassword: false,
      currentLatitude: 0,
      currentLongitude: 0,
      city: '',
      countries: [],
      countrySelected: '',
      countryClicked: false,
      isOtherCountrySelected: false,
      countryError: '',
      countryCodes: [],
      countryCodeClicked: false,
      countryCodeClickedAndroid: false,
      isLoading: false,
    };

    this.arrayholder = [];
    this.passwordReg = new RegExp('\\w+');
    this.emailReg = new RegExp('\\w+');

    this.imgPasswordVisible = imgPasswordVisible;
    this.imgPasswordInVisible = imgPasswordInVisible;

    this.labelHeader = configJSON.labelHeader;
    this.labelFirstName = configJSON.labelFirstName;
    this.lastName = configJSON.lastName;
    this.labelEmail = configJSON.labelEmail;
    this.labelPassword = configJSON.labelPassword;
    this.labelRePassword = configJSON.labelRePassword;
    this.labelLegalText = configJSON.labelLegalText;
    this.labelLegalTermCondition = configJSON.labelLegalTermCondition;
    this.labelLegalPrivacyPolicy = configJSON.labelLegalPrivacyPolicy;
    this.btnTextSignUp = configJSON.btnTextSignUp;
    this.getCountryCodeList();
    this.getCountryList();
  }

  async componentDidMount() {
    this.getCountryCodeList();
    this.getCountryList();
  }

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
      );

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage),
      );

      if (apiRequestCallId) {
        if (responseJson || errorReponse) {
          this.handleApiResponse(
            apiRequestCallId,
            responseJson || {},
            errorReponse,
          );
        } else if (apiRequestCallId === this.createAccountApiCallId) {
          this.setState({ isLoading: false });
          this.showAlert('Error', 'No response received. Please try again.');
        }
      }
    }
  }

  handleApiResponse = (
    apiRequestCallId: string,
    responseJson: any,
    errorReponse: any,
  ) => {
    if (apiRequestCallId === this.createAccountApiCallId) {
      this.handleCreateAccountResponse(responseJson, errorReponse);
    } else if (apiRequestCallId === this.getStatesId) {
      this.handleGetStatesResponse(responseJson);
    } else if (apiRequestCallId === this.getCitiesId) {
      this.handleGetCitiesResponse(responseJson);
    } else if (apiRequestCallId === this.getCurrentStateCityId) {
      this.handleGetStateCityResponse(responseJson);
    } else if (apiRequestCallId === this.getCountryListId) {
      this.handleCountryResponse(responseJson);
    } else if (apiRequestCallId === this.getCountryCodeListId) {
      this.handleCountryCodeResponse(responseJson);
    }
  };

  handleCreateAccountResponse = (responseJson: any, errorReponse: any) => {
    if (this.createAccountTimeoutId) {
      clearTimeout(this.createAccountTimeoutId);
      this.createAccountTimeoutId = null;
    }

    try {
      const hasErrors =
        responseJson?.errors &&
        (Array.isArray(responseJson.errors)
          ? responseJson.errors.length > 0
          : true);

      if (responseJson && !hasErrors) {
        const selectedCountryObj = this.state.countries.find(
          item =>
            item.country_code === this.state.countrySelected ||
            item.country_name === this.state.countrySelected,
        );
        const selectedCountryCode = selectedCountryObj
          ? selectedCountryObj.country_code
          : '';

        const token = responseJson?.meta?.token;
        if (!token) {
          console.error('No token received in response');
          this.setState({ isLoading: false });
          this.showAlert(
            'Error',
            'Failed to create account. Please try again.',
          );
          return;
        }

        const countryCode =
          this.state.countryCodeSelected?.attributes?.country_code || '';

        this.props.navigation.navigate('OTPInputAuth', {
          payload: {
            email: this.state.email,
            data: {
              type: 'email_account',
              attributes: {
                first_name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                full_phone_number: this.state.phone.slice(-10),
                state: this.state.selectedState,
                city: this.state.selectedCity,
                country: selectedCountryCode,
                country_code: countryCode,
                role_id: 1,
              },
            },
          },
          token: token,
          endpoint: configJSON.accountsAPiEndPoint,
        });

        this.setState({
          name: '',
          email: '',
          password: '',
          reTypePassword: '',
          selectedState: '',
          selectedCity: '',
          phone: '',
          acceptTermsConditions: false,
          optInEmails: false,
          isLoading: false,

          nameError: '',
          emailError: '',
          passwordError: '',
          confirmPasswordError: '',
          stateError: '',
          cityError: '',
          phoneError: '',
          countryError: '',
        });
      } else {
        //Check Error Response
        this.setState({ isLoading: false });
        this.parseApiErrorResponse(responseJson);
        this.parseApiCatchErrorResponse(errorReponse);
      }
    } catch (error) {
      console.error('Error in handleCreateAccountResponse:', error);
      this.setState({ isLoading: false });
      this.showAlert(
        'Error',
        'An unexpected error occurred. Please try again.',
      );
    }
  };

  handleGetStatesResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { state } = responseJson;
      const states = Object.keys(state).map(key => {
        return {
          key,
          name: state[key],
        };
      });
      this.setState({ states });
    } else {
      //Check Error Response
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGetCitiesResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { city } = responseJson;
      this.setState({ cities: city });
      const selectedCityObject = city.find(
        (item: any) => item === this.state.city,
      );
      const selectedCityKey = selectedCityObject ?? '';
      this.setState({ selectedCity: selectedCityKey }, () => {});
    } else {
      //Check Error Response
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGetStateCityResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ countrySelected: responseJson.country }, () => {
        this.onSelectCountry(responseJson.country);
        if (responseJson.country === 'United States') {
          this.setState(
            { selectedState: responseJson.state, city: responseJson.city },
            () => {
              this.onSelectState(responseJson.state);
            },
          );
        }
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleCountryResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({
        countries: responseJson.countries,
        states: [],
        selectedState: '',
        cities: [],
        city: '',
        selectedCity: '',
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleCountryCodeResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const usData = responseJson.data.find((item: any) => item.id === 'US');
      this.setState({
        countryCodes: responseJson.data,
        countryCodeSelected: usData,
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  isStringNullOrBlank(str_data: string) {
    return str_data === null || str_data.length === 0;
  }

  isValidEmail(email: string) {
    const atIndex = email.indexOf('@');
    if (atIndex === -1 || email.lastIndexOf('@') !== atIndex) {
      return false;
    }

    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex + 1);

    if (localPart === '' || domainPart === '') {
      return false;
    }

    const dotIndex = domainPart.indexOf('.');
    if (dotIndex === -1 || domainPart.lastIndexOf('.') !== dotIndex) {
      return false;
    }

    const validChars = /^[a-zA-Z0-9_.+-]+$/;
    if (!validChars.test(localPart) || !validChars.test(domainPart)) {
      return false;
    }

    return true;
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

    return '';
  }

  checkValidation = () => {
    const {
      name,
      email,
      password,
      reTypePassword,
      countrySelected,
      selectedState,
      selectedCity,
      phone,
    } = this.state;

    this.setState({
      password: password.trim(),
      reTypePassword: reTypePassword.trim(),
    });

    this.resetErrors();

    let error = false;

    if (this.validateName(name)) error = true;
    if (this.validateEmail(email)) error = true;
    if (this.validatePassword(password)) error = true;
    if (this.validateConfirmPassword(password, reTypePassword)) error = true;
    if (this.validateCountry(countrySelected)) error = true;
    if (this.validateLocation(countrySelected, selectedState, selectedCity))
      error = true;
    if (this.validatePhone(phone)) error = true;

    return !error;
  };

  resetErrors = () => {
    this.setState({
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      stateError: '',
      cityError: '',
      phoneError: '',
      countryError: '',
    });
  };

  validateName = (name: string) => {
    if (isEmpty(name.trim())) {
      this.setState({ nameError: configJSON.errorNameCannotBeBlank });
      return true;
    } else if (!/^[a-zA-Z| ]+$/.test(name)) {
      this.setState({ nameError: configJSON.errorNameCanOnlyContainAlphabets });
      return true;
    }
    return false;
  };

  validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (isEmpty(email.trim())) {
      this.setState({ emailError: configJSON.errorEmailCannotBeBlank });
      return true;
    } else if (!emailRegex.test(email.trim())) {
      this.setState({ emailError: configJSON.errorEmailNotValid });
      return true;
    }
    return false;
  };

  validatePassword = (password: string) => {
    if (isEmpty(password.trim())) {
      this.setState({ passwordError: configJSON.errorPasswordCannotBeBlank });
      return true;
    } else {
      const errorStr = this.analyzePassword(password.trim());
      if (errorStr) {
        this.setState({ passwordError: errorStr });
        return true;
      }
    }
    return false;
  };

  validateConfirmPassword = (password: string, reTypePassword: string) => {
    if (isEmpty(reTypePassword.trim())) {
      this.setState({
        confirmPasswordError: configJSON.errorConfirmPasswordCannotBeBlank,
      });
      return true;
    } else if (password.trim() !== reTypePassword.trim()) {
      this.setState({
        confirmPasswordError: configJSON.errorBothPasswordsNotSame,
      });
      return true;
    }
    return false;
  };

  validateCountry = (country: string) => {
    if (isEmpty(country)) {
      this.setState({ countryError: configJSON.errorCountryCannotBeBlank });
      return true;
    }
    return false;
  };

  validateLocation = (country: string, state: string, city: string) => {
    if (country === 'United States') {
      if (isEmpty(state)) {
        this.setState({ stateError: configJSON.errorStateCannotBeBlank });
        return true;
      }

      if (isEmpty(city)) {
        this.setState({ cityError: configJSON.errorCityCannotBeBlank });
        return true;
      }
    }
    return false;
  };

  validatePhone = (phone: string) => {
    if (isEmpty(phone)) {
      this.setState({ phoneError: configJSON.errorPhoneCannotBeBlank });
      return true;
    } else if (phone.length !== 10) {
      this.setState({ phoneError: configJSON.errorPhoneNumberLength });
      return true;
    }
    return false;
  };

  createAccount() {
    if (this.checkValidation()) {
      this.setState({ isLoading: true });

      if (this.createAccountTimeoutId) {
        clearTimeout(this.createAccountTimeoutId);
      }

      this.createAccountTimeoutId = setTimeout(() => {
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
          this.showAlert('Error', 'Request timed out. Please try again.');
        }
      }, 30000);

      const selectedCountryObj = this.state.countries.find(
        item =>
          item.country_code === this.state.countrySelected ||
          item.country_name === this.state.countrySelected,
      );
      const selectedCountryCode = selectedCountryObj
        ? selectedCountryObj.country_code
        : '';

      const header = {
        'Content-Type': configJSON.contentTypeApiAddDetail,
      };

      const attrs = {
        first_name: this.state.name.trim(),
        email: this.state.email.trim(),
        password: this.state.password.trim(),
        full_phone_number: this.state.phone.slice(-10),
        state: this.state.selectedState,
        city: this.state.selectedCity,
        /* Static for now */
        country: selectedCountryCode,
        country_code: this.state.countryCodeSelected?.attributes?.country_code,
        role_id: this.state.userRole,
        terms_and_conditions: this.state.acceptTermsConditions,
        i_would_like: this.state.optInEmails,
        are_you_18: this.state.isEighteenPlus,
        country_code_name: this.state.countryCodeSelected?.id,
      };

      this.setState({
        name: this.state.name.trim(),
        email: this.state.email.trim(),
      });

      const data = {
        type: 'email_account',
        attributes: attrs,
      };

      const httpBody = {
        data: data,
        token: this.state.otpAuthToken,
      };

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );
      this.createAccountApiCallId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.accountsAPiEndPoint,
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(httpBody),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.apiMethodTypeAddDetail,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  }

  getStates(country: string): boolean {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getStatesId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getStatesEndpoint + country,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  getCities(state: string): boolean {
    if (!state) {
      return false;
    }

    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCitiesId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getCitiesEndpoint + state,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  onSelectState = (selectedState: string) => {
    this.setState({ selectedState, selectedCity: '', cities: [] });
    this.getCities(selectedState);
  };

  goToLogin = () => {
    const messgae: Message = new Message(
      getName(MessageEnum.NavigationEmailLogInMessage),
    );
    messgae.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(messgae);
  };

  goToTermsAndConditions = () => {
    const messgae: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    messgae.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    messgae.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'TermsConditions',
    );
    const info = {
      isTermsAndConditionsAccepted: this.state.acceptTermsConditions,
    };
    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(
      getName(MessageEnum.NavigationTermAndConditionMessage),
      info,
    );
    messgae.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(messgae);
  };

  dynamicOpacity = (property: boolean | string) => {
    return property ? 1 : 0.5;
  };

  handlePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleConfirmPassword = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };

  handlePhoneTxtChange = (phone: string) => {
    if (phone && !/^\d+$/.test(phone)) {
      return;
    }
    this.setState({ phone: phone });
    if (phone.length === 10) {
      Keyboard.dismiss();
    }
  };

  handlePasswordTxt = (text: string) => {
    this.setState({ password: text.replace('  ', ' ') });
  };

  handleConfirmPasswordTxt = (text: string) => {
    this.setState({ reTypePassword: text.replace('  ', ' ') });
  };

  checkLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.setState({ currentLatitude: null, currentLongitude: null });
    } else if (Platform.OS === 'android') {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      this.handlePermissions(result);
    }
  };

  handlePermissions = async (result: string) => {
    switch (result) {
      case RESULTS.DENIED:
        this.requestPermission();
        break;
      case RESULTS.GRANTED:
        this.getCurrentLatLong();
        break;
    }
  };

  requestPermission = async () => {
    if (Platform.OS === 'ios') {
      this.setState({ currentLatitude: null, currentLongitude: null });
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getCurrentLatLong();
      }
    }
  };

  getCurrentLatLong = () => {
    if (Platform.OS === 'ios') {
      return;
    }

    Geolocation.getCurrentPosition(
      ({ coords }) => {
        this.setState(
          {
            currentLatitude: coords.latitude,
            currentLongitude: coords.longitude,
          },
          () => this.getCurrentStateCity(),
        );
      },
      error => {
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  getCurrentStateCity = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const endpoint = `${configJSON.getCurrentStateCityAPIEndPoint}?lat=${this.state.currentLatitude}&long=${this.state.currentLongitude}`;

    this.getCurrentStateCityId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getCountryList = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCountryListId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.countryList,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  onSelectCountry = (country: string) => {
    const selectedCountryObj = this.state.countries.find(
      item => item.country_code === country || item.country_name === country,
    );
    const selectedCountryCode = selectedCountryObj
      ? selectedCountryObj.country_code
      : '';

    if (
      this.state.isOtherCountrySelected === false &&
      selectedCountryCode !== 'US'
    ) {
      this.setState({ isOtherCountrySelected: true, modalVisible: true });
    }

    if (this.state.countryCodes.length !== 0) {
      const filteredCountry = this.state.countryCodes.find(
        country => country.id === selectedCountryCode,
      );
      this.setState({ countryCodeSelected: filteredCountry });
    }

    this.setState(
      {
        countrySelected: country,
        states: [],
        selectedState: '',
        cities: [],
        selectedCity: '',
      },
      () => {
        if (selectedCountryCode === 'US') this.getStates(selectedCountryCode);
      },
    );
  };

  handleName = (name: string) => {
    this.setState({ name });
  };

  handleEmail = (email: string) => {
    this.setState({ email: email.replace(' ', '') });
  };

  handlePasswordBlur = () => {
    this.setState({ password: this.state.password.trim() });
  };

  handleConfirmPasswordBlur = () => {
    this.setState({ reTypePassword: this.state.reTypePassword.trim() });
  };

  showCountryModal = () => {
    this.setState({ countryClicked: true, modalVisible: false });
  };

  showStateModal = () => {
    this.setState({ stateClicked: true, modalVisible: false });
  };

  showCityModal = () => {
    this.setState({ cityClicked: true, modalVisible: false });
  };

  handleCityValueAndroid = (selectedCity: string) => {
    this.setState({ selectedCity });
  };

  showCountryAlert = () => {
    this.setState({ modalVisible: true });
  };

  handleTAndC = () => {
    this.setState({ acceptTermsConditions: !this.state.acceptTermsConditions });
  };

  handleOptEmail = () => {
    this.setState({ optInEmails: !this.state.optInEmails });
  };

  handleEighteenPlus = () => {
    this.setState({ isEighteenPlus: !this.state.isEighteenPlus });
  };

  handleLogin = () => {
    this.setState(
      {
        name: '',
        email: '',
        password: '',
        reTypePassword: '',
        selectedState: '',
        selectedCity: '',
        phone: '',
        acceptTermsConditions: false,
        optInEmails: false,

        nameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        stateError: '',
        cityError: '',
        phoneError: '',
        countryError: '',
      },
      () => {
        this.goToLogin();
      },
    );
  };

  closeCountryAlert = () => {
    this.setState({ modalVisible: false });
  };

  handleCountryValueiOS = (countrySelected: string) => {
    this.setState({ countryClicked: false });
    this.onSelectCountry(countrySelected);
  };

  handleStateValueiOS = (selectedState: string) => {
    this.setState({ stateClicked: false });
    this.onSelectState(selectedState);
  };

  handleCityValueiOS = (selectedCity: string) => {
    this.setState({ cityClicked: false, selectedCity });
  };

  getCountryCodeList = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCountryCodeListId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.countryCodeList,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  showCountryCodePicker = () => {
    this.setState({ countryCodeClicked: true });
  };

  handleCountryCodeiOS = (countryCodeSelected: any) => {
    this.setState({ countryCodeClicked: false, countryCodeSelected });
  };

  handleCountryCodeAndroid = (countryCodeSelected: any) => {
    this.setState({ countryCodeClickedAndroid: false, countryCodeSelected });
  };

  hideModalCountry = () => {
    this.setState({ countryClicked: false });
  };

  hideModalState = () => {
    this.setState({ stateClicked: false });
  };

  hideModalCity = () => {
    this.setState({ cityClicked: false });
  };

  hideModalCountryCode = () => {
    this.setState({ countryCodeClicked: false });
  };
}
