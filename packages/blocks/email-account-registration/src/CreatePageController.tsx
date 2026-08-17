import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import { runEngine } from '../../../framework/src/RunEngine';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';

// Customizable Area Start
import {
  getStorageData,
  isEmpty,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

interface IPlaceRecord {
  key: string;
  name: string;
}

// Customizable Area End.               
export const configJSON = require('./config');

export interface Props {
  navigation: any;
  id: string;
}

export interface S {
  // Customizable Area Start
  userRole: string;
  typeList: any[];
  selectedType: string;
  typeClicked: boolean;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  zipCode: string;
  zipCodeError: string;
  tAndC: boolean;
  typeError: string;
  nameError: string;
  emailError: string;
  passwordError: string;
  confirmPswrdError: string;
  phoneError: string;
  countryModal: boolean;
  acceptTermsConditions: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  stateList: IPlaceRecord[];
  selectedState: string;
  stateClicked: boolean;
  stateError: string;
  cityList: [];
  selectedCity: string;
  cityClicked: boolean;
  cityError: string;
  addressError?: string;
  currentLatitude: number;
  currentLongitude: number;
  city: string;
  countryClicked: boolean;
  countryList: any[];
  selectedCountry: string;
  countryError: string;
  isOtherCountrySelected: boolean;
  countryCodesList: any[];
  countryCodeClicked: boolean;
  countryCodeClickedAndroid: boolean;
  selectedCountryCode: any;
  adminName: string;
  title: string;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class CreatePageController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  createPageID: string = '';
  getStateListAPIId: string = '';
  getCityListAPIId: string = '';
  getStateCityId: string = '';
  getCountryListId: string = '';
  getCountryCodeListId: string = '';
  _isMounted: boolean = false;
  businessTypesRequiringAddress: string[] = [
    'Venue',
    'Club',
    'Bar',
    'Gallery',
    'Casino',
    'Cabaret',
    'Record_Store',
    'Theater',
    'Museum',
  ];
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage),
    ];
    this.receive = this.receive.bind(this);
    runEngine.attachBuildingBlock(this, this.subScribedMessages);
    this.state = {
      // Customizable Area Start
      userRole: '',
      // typeList: ["Band", "Artist"],
      typeList:

        ["Venue", "Club", "Theater", "Museum", "Record_Label", "Promoter", "Bar", "Gallery", "Casino", "Cabaret", "Booking_Agent", "Agency", "Record_Store"],
      // ["Venue", "Club", "Theater", "Museum", "Record_Label", "Promoter", "Bar", "Gallery", "Casino", "Cabaret", "Booking_Agent", "Agency", "Record_Store"],


      selectedType: '',
      typeClicked: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: '',
      zipCode: '',
      zipCodeError: '',
      tAndC: false,
      typeError: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPswrdError: '',
      phoneError: '',
      countryModal: false,
      acceptTermsConditions: false,
      showPassword: false,
      showConfirmPassword: false,
      stateList: [],
      selectedState: '',
      stateClicked: false,
      stateError: '',
      cityList: [],
      selectedCity: '',
      cityClicked: false,
      cityError: '',
      currentLatitude: 0,
      currentLongitude: 0,
      city: '',
      countryClicked: false,
      countryList: [],
      selectedCountry: '',
      countryError: '',
      isOtherCountrySelected: false,
      countryCodesList: [],
      countryCodeClicked: false,
      countryCodeClickedAndroid: false,
      selectedCountryCode: {},
      adminName: '',
      title: '',
      // Customizable Area End
    };
    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleNavigationPayload(message);
    }
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount() {
    this._isMounted = true;
    this.handleComponentDidMount();
  }
  async componentWillUnmount(): Promise<void> {
    this._isMounted = false;
  }

  async handleComponentDidMount() {
    if (this._isMounted) {
      // Retrieve userRole from storage if not already set
      // Check both storage keys as different parts of the app use different keys
      let storedUserRole = await getStorageData('userRole');
      if (!storedUserRole) {
        storedUserRole = await getStorageData('user_role');
      }
      if (storedUserRole && isEmpty(this.state.userRole)) {
        // Only filter typeList if userRole is 'band', otherwise keep original list
        const stateUpdate: any = { userRole: storedUserRole };
        if (storedUserRole === 'band') {
          stateUpdate.typeList = this.getFilteredTypeList(storedUserRole);
        }
        this.setState(stateUpdate);
      }
      
      this.getCountryCodeListApi();
      this.handleCountryListAPI();
      this.props.navigation.addListener('willFocus', async () => {
        const tAndCAcceptance = await getStorageData('tAndCAcceptance');
        if (tAndCAcceptance) {
          removeStorageData('tAndCAcceptance');
          this.setState({ acceptTermsConditions: tAndCAcceptance });
        }
        // Also check for userRole on focus (check both keys)
        let userRole = await getStorageData('userRole');
        if (!userRole) {
          userRole = await getStorageData('user_role');
        }
        if (userRole) {
          // Only filter typeList if userRole is 'band', otherwise keep original list
          const stateUpdate: any = { userRole };
          if (userRole === 'band') {
            stateUpdate.typeList = this.getFilteredTypeList(userRole);
          }
          this.setState(stateUpdate);
        }
      });
    }
  }

  getFilteredTypeList = (userRole: string) => {
    if (userRole === 'band') {
      return ['Band', 'Artist'];
    }
    // Return full list for all other cases
    return [
      'Band',
      'Artist',
      'Fan',
      'Venue',
      'Club',
      'Theater',
      'Museum',
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
  };

  handleNavigationPayload = (message: Message) => {
    const payloadData = message.getData(
      getName(MessageEnum.HelpCentreMessageData),
    );
    if (payloadData.userRole) {
      if (payloadData.userRole === 'band') {
        const {
          bandName,
          selectedType,
          selectedCountry,
          selectedState,
          selectedCity,
          userRole,
        } = payloadData;

        this.setState({
          userRole,
          name: bandName,
          selectedType,
          selectedCountry,
          selectedState,
          selectedCity,
          typeList: ['Band', 'Artist'],
        });
      }

      if (payloadData.userRole === 'venue') {
        const {
          placeTitle,
          selectedType,
          selectedCountry,
          selectedState,
          selectedCity,
          userRole,
        } = payloadData;
        return this.setState({
          name: placeTitle,
          selectedCity,
          selectedCountry,
          selectedState,
          selectedType,
          userRole,
        });
      }
    }
  };

  handleRestAPIResponse = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage),
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    if (apiRequestCallId && responseJson) {
      if (apiRequestCallId === this.createPageID) {
        this.handleCreatePageAPIResponse(responseJson);
      } else if (apiRequestCallId === this.getStateListAPIId) {
        this.handleStateListAPIResponse(responseJson);
      } else if (apiRequestCallId === this.getCityListAPIId) {
        this.handleCityListAPIResponse(responseJson);
      } else if (apiRequestCallId === this.getStateCityId) {
        this.handleGetCurrentStateCityResponse(responseJson);
      } else if (apiRequestCallId === this.getCountryListId) {
        this.handleGetCountryListResponse(responseJson);
      } else if (apiRequestCallId === this.getCountryCodeListId) {
        this.handleGetCountryCodeListResponse(responseJson);
      }
    } else {
      this.parseApiErrorResponse(errorResponse);
    }
  };

  handleGetCurrentStateCityResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ selectedCountry: responseJson.country }, () => {
        this.handleCountryChange(responseJson.country);
        if (responseJson.country === 'United States') {
          this.setState(
            { selectedState: responseJson.state, city: responseJson.city },
            () => {
              this.handleStateChange(responseJson.state);
            },
          );
        }
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleCreatePageAPIResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      this.handleCreatePageSuccess(responseJson);
    }
  };

  handleCreatePageSuccess = async (responseJson: any) => {
    if (this.state.address) {
      await setStorageData('user_address', this.state.address);
    }
    if (this.state.zipCode) {
      await setStorageData('user_zip_code', this.state.zipCode);
    }

    const selectedCountryObj = this.state.countryList.find(
      item =>
        item.country_code === this.state.selectedCountry ||
        item.country_name === this.state.selectedCountry,
    );
    const selectedCountryCode = selectedCountryObj
      ? selectedCountryObj.country_code
      : '';
    const payload = {
      email: this.state.email,
      data: {
        type: 'email_account',
        attributes: {
          first_name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          full_phone_number: this.state.phoneNumber.slice(-10),
          role_id: 3,
          state: this.state.selectedState,
          city: this.state.selectedCity,
          country: selectedCountryCode,
          country_code: this.state.selectedCountryCode.attributes.country_code,
        },
      },
    };
    this.props.navigation.navigate('OTPInputAuth', {
      payload,
      token: responseJson.meta.verification_token ?? responseJson.meta.token,
      endpoint: configJSON.accountsAPiEndPoint,
      redirect_to: responseJson.redirect_on ?? '',
      claim_id: responseJson.claim_ids ? responseJson.claim_ids[0] : '',
    });
  };

  handleStateListAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { state } = responseJson;
      const stateList = Object.keys(state).map(item => {
        return {
          key: item,
          name: state[item],
        };
      });
      this.setState({ stateList });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleCityListAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { city } = responseJson;
      this.setState({ cityList: city });
      const selectedCityObject = city.find(
        (item: any) => item === this.state.city,
      );
      const selectedCityKey = selectedCityObject ?? '';
      this.setState({ selectedCity: selectedCityKey }, () => { });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGetCountryListResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      // Temporarily disable automatic location check to prevent crashes
      // this.checkPermissionForLocation();
      this.setState({
        countryList: responseJson.countries,
        stateList: [],
        selectedState: '',
        cityList: [],
        selectedCity: '',
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGetCountryCodeListResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const usData = responseJson.data.find((item: any) => item.id === 'US');
      this.setState({
        countryCodesList: responseJson.data,
        selectedCountryCode: usData,
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  dynamicOpacity = (property: boolean | string) => {
    return property ? 1 : 0.5;
  };

  checkValidation = () => {
    this.setState({ password: this.state.password.trim() });
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let error = false;

    const validations = [
      {
        condition: isEmpty(this.state.selectedType),
        errorMsg: configJSON.errorTypeCannotBeBlank,
        stateKey: 'typeError',
      },
      {
        condition: isEmpty(this.state.name),
        errorMsg: configJSON.errorNameCannotBeBlank,
        stateKey: 'nameError',
      },
      {
        condition: isEmpty(this.state.email),
        errorMsg: configJSON.errorEmailCannotBeBlank,
        stateKey: 'emailError',
      },
      {
        condition:
          !isEmpty(this.state.email) && !emailRegex.test(this.state.email),
        errorMsg: configJSON.errorEmailNotValid,
        stateKey: 'emailError',
      },
      {
        condition: isEmpty(this.state.password),
        errorMsg: configJSON.errorPasswordCannotBeBlank,
        stateKey: 'passwordError',
      },
      {
        condition:
          !isEmpty(this.state.password) &&
          !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
            this.state.password,
          ),
        errorMsg: configJSON.errorPasswordNotValid,
        stateKey: 'passwordError',
      },
      {
        condition: this.state.password !== this.state.confirmPassword,
        errorMsg: configJSON.errorBothPasswordsNotSame,
        stateKey: 'confirmPswrdError',
      },
      {
        condition: isEmpty(this.state.selectedCountry),
        errorMsg: configJSON.errorCountryCannotBeBlank,
        stateKey: 'countryError',
      },
      {
        condition:
          this.state.selectedCountry === 'United States' &&
          isEmpty(this.state.selectedState),
        errorMsg: configJSON.errorStateCannotBeBlank,
        stateKey: 'stateError',
      },
      {
        condition:
          this.state.selectedCountry === 'United States' &&
          isEmpty(this.state.selectedCity),
        errorMsg: configJSON.errorCityCannotBeBlank,
        stateKey: 'cityError',
      },
      {
        condition: isEmpty(this.state.phoneNumber),
        errorMsg: configJSON.errorPhoneCannotBeBlank,
        stateKey: 'phoneError',
      },
      {
        condition:
          !isEmpty(this.state.phoneNumber) &&
          this.state.phoneNumber.length < 10,
        errorMsg: configJSON.errorPhoneNumberLength,
        stateKey: 'phoneError',
      },
      {
        condition:
          this.businessTypesRequiringAddress.includes(this.state.selectedType) &&
          isEmpty(this.state.address),
        errorMsg: configJSON.errorAddressCannotBeBlank,
        stateKey: 'addressError',
      },
      {
        condition:
          this.businessTypesRequiringAddress.includes(this.state.selectedType) &&
          isEmpty(this.state.zipCode),
        errorMsg: configJSON.errorZipCodeCannotBeBlank,
        stateKey: 'zipCodeError',
      },
      {
        condition:
          this.businessTypesRequiringAddress.includes(this.state.selectedType) &&
          !isEmpty(this.state.zipCode) &&
          this.state.zipCode.length < 5,
        errorMsg: configJSON.errorZipCodeLength,
        stateKey: 'zipCodeError',
      },
    ];

    const errorState: any = {};

    validations.forEach(({ condition, errorMsg, stateKey }) => {
      if (condition) {
        error = true;
        errorState[stateKey] = errorMsg;
      }
    });

    // Clear address and zipCode errors if not required for the selected type
    if (!this.businessTypesRequiringAddress.includes(this.state.selectedType)) {
      errorState.addressError = '';
      errorState.zipCodeError = '';
    }

    this.setState(errorState);

    return error;
  };

  handleCreatePageAPI = () => {
    if (!this.checkValidation()) {
      const selectedCountryObj = this.state.countryList.find(
        item =>
          item.country_code === this.state.selectedCountry ||
          item.country_name === this.state.selectedCountry,
      );
      const selectedCountryCode = selectedCountryObj
        ? selectedCountryObj.country_code
        : '';

      let role_id = 2; // Default to Venue/Club/etc.
      const lowerCaseType = this.state.selectedType.toLowerCase();

      if (['band', 'artist'].indexOf(lowerCaseType) > -1) {
        role_id = 3;
      } else if (lowerCaseType === 'fan') {
        role_id = 1;
      }
      const dataToSend = {
        data: {
          type: 'email_account',
          attributes: {
            account_type: this.state.selectedType,
            first_name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            full_phone_number: this.state.phoneNumber,
            phone_number: this.state.phoneNumber,
            country: selectedCountryCode,
            country_code:
              this.state.selectedCountryCode?.attributes?.country_code,
            state: this.state.selectedState,
            city: this.state.selectedCity,
            // zip_code: this.state.zipCode,
            location: this.state.name || '',
            role_id,
            country_code_name: this.state.selectedCountryCode?.id,
            title: this.state.title,
            administrator_name: this.state.adminName,
            terms_and_conditions: this.state.acceptTermsConditions,
          },
        },
      };

      console.log("---dataToSend Venue---", dataToSend);


      const header = {
        'Content-Type': configJSON.validationApiContentType,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.createPageID = requestMessage.messageId;

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
        JSON.stringify(dataToSend),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.apiMethodTypeAddDetail,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);

      return true;
    }
  };

  navigateToTermsAndConditions = () => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
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
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(message);
  };

  handleStateListAPI = (country: string) => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getStateListAPIId = requestMessage.messageId;

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
  };

  handleStateChange = (selectedState: string) => {
    this.setState(
      {
        stateClicked: false,
        selectedState,
      },
      () => this.handleCityListAPI(),
    );
  };

  handleCityListAPI = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCityListAPIId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getCitiesEndpoint + `${this.state.selectedState}`,
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

  /**
   * Returns display label for account type (replaces _ with space for UI only).
   * API continues to receive the original value with underscore.
   */
  getTypeDisplayLabel = (type: string): string => {
    if (!type || typeof type !== 'string') return type || '';
    return type.replace(/_/g, ' ');
  };

  openTypePicker = () => {
    this.setState({ typeClicked: true });
  };

  handleTypeSelection = (selectedType: string) => {
    this.setState({
      typeClicked: false,
      selectedType,
    });
  };
  handleCountryCodeSelectionIOS = (selectedCountryCode: any) => {
    this.setState({
      countryCodeClicked: false,
      selectedCountryCode,
    });
  };

  handleName = (name: string) => {
    this.setState({ name: name.replace(/ {2}/g, ' ') });
  };

  handleEmail = (email: string) => {
    this.setState({ email });
  };

  handlePassword = (text: string) => {
    this.setState({ password: text.replace('  ', ' ') });
  };

  handleConfirmPassword = (confirmPassword: string) => {
    this.setState({ confirmPassword });
  };

  handlePhoneNumber = (phoneNumber: string) => {
    if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
      return;
    }
    this.setState({ phoneNumber });
  };

  handleAddress = async (address: string) => {
    this.setState({ address });
    if (address) {
      await setStorageData('user_address', address);
    }
  };

  handleZipCode = async (zipCode: string) => {
    if (zipCode && !/^\d+$/.test(zipCode)) {
      return;
    }
    this.setState({ zipCode });
    if (zipCode) {
      await setStorageData('user_zip_code', zipCode);
    }
  };

  shouldShowAddressField = () => {
    // Show address field for all roles, but validation will make it mandatory only for type 1 roles
    return !isEmpty(this.state.selectedType);
  };

  handleTAndC = () => {
    this.setState({ acceptTermsConditions: !this.state.acceptTermsConditions });
  };

  checkPermissionForLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        this.setState({ currentLatitude: null, currentLongitude: null });
      } else if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        this.handleLocationPermissions(result);
      }
    } catch (error) {
      console.error('Permission check error:', error);
      // Skip location if permission check fails
    }
  };

  handleLocationPermissions = async (result: string) => {
    switch (result) {
      case RESULTS.DENIED:
        this.requestLocationPermissions();
        break;
      case RESULTS.GRANTED:
        this.getCurrentLatitudeLongitude();
        break;
    }
  };

  requestLocationPermissions = async () => {
    try {
      if (Platform.OS === 'ios') {
        this.setState({ currentLatitude: null, currentLongitude: null });
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getCurrentLatitudeLongitude();
        }
      }
    } catch (error) {
      console.error('Permission request error:', error);
      // Skip location if permission request fails
    }
  };

  getCurrentLatitudeLongitude = () => {
    if (Platform.OS === 'ios') {
      return;
    }

    try {
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          this.setState(
            {
              currentLatitude: coords.latitude,
              currentLongitude: coords.longitude,
            },
            () => this.getStateCity(),
          );
        },
        error => {
          console.error('Location error:', error.code, error.message);
          // Don't crash the app if location fails
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.error('Geolocation service error:', error);
      // Don't crash the app if location service is not available
    }
  };

  getStateCity = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const endpoint = `${configJSON.getCurrentStateCityAPIEndPoint}?lat=${this.state.currentLatitude}&long=${this.state.currentLongitude}`;

    this.getStateCityId = requestMessage.messageId;

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

  handleCountryListAPI = () => {
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

  handleCountryChange = (country: string) => {
    const selectedCountryObj = this.state.countryList.find(
      item => item.country_code === country || item.country_name === country,
    );
    const selectedCountryCode = selectedCountryObj
      ? selectedCountryObj.country_code
      : '';

    if (
      this.state.isOtherCountrySelected === false &&
      selectedCountryCode !== 'US'
    ) {
      this.setState({ isOtherCountrySelected: true, countryModal: true });
    }

    if (this.state.countryCodesList.length !== 0) {
      const filteredCountry = this.state.countryCodesList.find(
        country => country.id === selectedCountryCode,
      );
      this.setState({ selectedCountryCode: filteredCountry });
    }

    this.setState(
      {
        countryClicked: false,
        selectedCountry: country,
        stateList: [],
        selectedState: '',
        cityList: [],
        selectedCity: '',
      },
      () => {
        if (selectedCountryCode === 'US') {
          this.handleStateListAPI(selectedCountryCode);
        }
      },
    );
  };

  getCountryCodeListApi = () => {
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
  toogleCountryCodeModal = () => {
    this.setState(prevState => ({
      countryCodeClicked: !prevState.countryCodeClicked,
    }));
  };
  handleCountryCodeValueChangeAndroid = (selectedCountryCode: any) => {
    this.setState({ countryCodeClickedAndroid: false, selectedCountryCode });
  };
  hideModalType = () => {
    this.setState({ typeClicked: false });
  };

  openStatePicker = () => {
    this.setState({ stateClicked: true });
  };

  openCityPicker = () => {
    this.setState({ cityClicked: true });
  };

  handleCityValueChange = (selectedCity: string) => {
    this.setState({ cityClicked: false, selectedCity });
  };
  handlePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleConfirmPasswordVisibility = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };
  hideCountryModal = () => {
    this.setState({ countryModal: false });
  };
  openCountryPicker = () => {
    this.setState({ countryClicked: true });
  };

  hideModalState = () => {
    this.setState({ stateClicked: false });
  };

  hideModalCity = () => {
    this.setState({ cityClicked: false });
  };

  hideModalCountryPicker = () => {
    this.setState({ countryClicked: false });
  };

  // Customizable Area End
}
