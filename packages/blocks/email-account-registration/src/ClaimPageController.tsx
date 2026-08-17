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
interface IPlaceRecord {
  key: string;
  name: string;
}
// Customizable Area End

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
  bandArtist: string;
  cityList: any[];
  selectedCity: string;
  cityClicked: boolean;
  stateList: IPlaceRecord[];
  selectedState: string;
  stateClicked: boolean;
  selectedCountry: string;
  countryModal: boolean;
  verificationText: string;
  typeErrorText: string;
  bandArtistErrorText: string;
  stateErrorText: string;
  cityErrorText: string;
  payloadData: any;
  address: string;
  addressErrorText: string;
  zip: string;
  zipErrorText: string;
  countryList: any[];
  countryError: string;
  isOtherCountrySelected: boolean;
  countryClicked: boolean;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class ClaimPageController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  getStatesId: string = '';
  getCitiesId: string = '';
  claimPageID: string = '';
  getCountryListAPICallId: string = '';
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
      typeList: ['Band', 'Artist'],
      selectedType: '',
      typeClicked: false,
      bandArtist: '',
      cityList: [],
      selectedCity: '',
      cityClicked: false,
      stateList: [],
      selectedState: '',
      stateClicked: false,
      selectedCountry: '',
      countryModal: false,
      verificationText: '',
      typeErrorText: '',
      bandArtistErrorText: '',
      stateErrorText: '',
      cityErrorText: '',
      payloadData: {},
      address: '',
      addressErrorText: '',
      zip: '',
      zipErrorText: '',
      countryList: [],
      countryError: '',
      isOtherCountrySelected: false,
      countryClicked: false,
      // Customizable Area End
    };

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const navigationData = message.getData(
        getName(MessageEnum.HelpCentreMessageData),
      );
      const { userRole, bandName, placeTitle } = navigationData;
      const bandArtist = userRole === 'venue' ? placeTitle : bandName;
      this.setState({
        userRole,
        bandArtist,
      });
    }
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount() {
    this.props.navigation.addListener('willFocus', async () => {
      this.handleCountryAPI();
      const ClaimInfo = await getStorageData('ClaimInfo', true);
      if (ClaimInfo !== null) {
        this.handleNavigationPayload(ClaimInfo);
      }
    });

    this.handleCountryAPI();
    const ClaimInfo = await getStorageData('ClaimInfo', true);
    if (ClaimInfo !== null) {
      this.handleNavigationPayload(ClaimInfo);
    }

    this.getRole();
  }
  getRole = async () => {
    const userRole = await getStorageData('user_role');
    this.setState({ userRole }, () => {
      this.getTypeList(userRole);
    });
  };
  getTypeList = (userRole: string) => {
    if (userRole === 'venue') {
      return this.setState({
        typeList: [
          'Club / Venue',
          'Theater',
          'Museum',
          'Record_Label',
          'Promoter',
        ],
      });
    }
  };

  handleNavigationPayload = (payloadData: any) => {
    if (payloadData?.bandName) {
      this.setState({ bandArtist: payloadData.bandName });
    }
    if (payloadData?.type) {
      this.setState({ selectedType: payloadData.type });
    }
    if (payloadData?.selectedState) {
      this.setState({ payloadData: payloadData });
    }
    if (payloadData?.userRole) {
      this.setState({ userRole: payloadData.userRole });
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

    runEngine.debugLog('API Message Recived', message);

    if (apiRequestCallId && responseJson) {
      this.handleSuccessfulApiResponse(apiRequestCallId, responseJson);
    } else {
      this.parseApiErrorResponse(errorResponse);
    }
  };

  handleSuccessfulApiResponse = (apiRequestCallId: any, responseJson: any) => {
    if (apiRequestCallId === this.getStatesId) {
      this.handleStateAPIResponse(responseJson);
    } else if (apiRequestCallId === this.getCitiesId) {
      this.handleCityAPIResponse(responseJson);
    } else if (apiRequestCallId === this.claimPageID) {
      this.handleClaimPageAPIResponse(responseJson);
    } else if (apiRequestCallId === this.getCountryListAPICallId) {
      this.handleCountryAPIResponse(responseJson);
    }
  };

  handleStateAPIResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      const { state } = responseJson;
      const stateList = Object.keys(state).map(item => {
        return {
          key: item,
          name: state[item],
        };
      });

      const selectedStateObject = stateList.find(
        item =>
          item.key === state ||
          item.name === this.state.payloadData.selectedState,
      );
      const selectedStateKey = selectedStateObject
        ? selectedStateObject.key
        : '';
      this.setState({ stateList, selectedState: selectedStateKey }, () => {
        if (selectedStateKey !== '') {
          this.handleCityAPI(selectedStateKey);
        }
      });
    }
  };

  handleCityAPIResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      const { city } = responseJson;
      this.setState({
        cityList: city,
        selectedCity: this.state.payloadData.selectedCity,
      });
    }
  };

  handleClaimPageAPIResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.handleClaimPageError();
    } else {
      this.handleClaimPageSuccess();
    }
  };
  handleClaimPageError = () => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'DisputeForm',
    );

    const info = {
      bandArtistName: this.state.bandArtist.trim(),
      userRole: this.state.userRole,
      selectedCountry: this.state.selectedCountry,
      selectedState: this.state.selectedState,
      selectedCity: this.state.selectedCity,
    };

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(message);
  };

  handleClaimPageSuccess = async () => {
    await setStorageData('editMode', 'false');
    await removeStorageData('ClaimInfo');

    const info = {
      bandName: this.state.bandArtist.trim(),
      userRole: this.state.userRole,
      selectedCountry: this.state.selectedCountry,
      selectedState: this.state.selectedState,
      selectedCity: this.state.selectedCity,
      selectedType: this.state.selectedType,
      placeTitle: this.state.bandArtist.trim(),
    };

    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'CreatePage');

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(message);
  };

  handleCountryAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState(
        {
          countryList: responseJson.countries,
          stateList: [],
          selectedState: '',
          cityList: [],
          selectedCity: '',
        },
        () => {
          const country = responseJson.countries.find(
            (item: any) =>
              item.country_code === this.state.payloadData?.selectedCountry,
          );
          const countryName = country ? country.country_name : '';
          this.setState({ selectedCountry: countryName }, () => {
            this.handleStateAPI(this.state.payloadData?.selectedCountry);
          });
        },
      );
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  onSelectState = (selectedState: string) => {
    this.setState({ selectedState, selectedCity: '', cityList: [] }, () => {
      this.handleCityAPI(selectedState);
    });
  };

  dynamicOpacity = (property: boolean | string) => {
    return property ? 1 : 0.5;
  };

  checkValidation = () => {
    let error = false;
    this.setState({
      typeErrorText: '',
      bandArtistErrorText: '',
      stateErrorText: '',
      cityErrorText: '',
      countryError: '',
    });

    if (isEmpty(this.state.selectedType)) {
      this.setState({ typeErrorText: configJSON.errorTypeCannotBeBlank });
      error = true;
    }

    if (isEmpty(this.state.bandArtist)) {
      const errorMessage =
        this.state.userRole === 'band'
          ? configJSON.errorBandArtistNameCannotBeBlank
          : configJSON.errorLocationNameCannotBeBlank;
      this.setState({
        bandArtistErrorText: errorMessage,
      });
      error = true;
    }

    if (isEmpty(this.state.selectedCountry)) {
      this.setState({ countryError: configJSON.errorCountryCannotBeBlank });
      error = true;
    }

    if (this.state.selectedCountry === 'United States') {
      if (isEmpty(this.state.selectedState)) {
        this.setState({ stateErrorText: configJSON.errorStateCannotBeBlank });
        error = true;
      }

      if (isEmpty(this.state.selectedCity)) {
        this.setState({ cityErrorText: configJSON.errorCityCannotBeBlank });
        error = true;
      }
    }

    if (error) {
      return false;
    }
    return true;
  };

  handleClaimPageAPI = () => {
    if (this.checkValidation()) {
      const selectedStateObject = this.state.stateList.find(
        item => item.key === this.state.selectedState,
      );
      const selectedStateName = selectedStateObject
        ? selectedStateObject.key
        : '';

      const selectedCountryObj = this.state.countryList.find(
        item =>
          item.country_code === this.state.selectedCountry ||
          item.country_name === this.state.selectedCountry,
      );
      const selectedCountryName = selectedCountryObj
        ? selectedCountryObj.country_name
        : '';

      const data = {
        band_artist_name: this.state.bandArtist,
        page_type: this.state.selectedType,
        city: this.state.selectedCity,
        state: selectedStateName,
        country: selectedCountryName,
        role_id: this.state.userRole === 'venue' ? 2 : 3,
      };
      const header = {
        'Content-Type': configJSON.validationApiContentType,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.claimPageID = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.claimThePageEndPoint,
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(data),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.apiMethodTypeAddDetail,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);

      return true;
    }
  };

  handleStateAPI = (country: string) => {
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
  };

  handleCityAPI = (state: string) => {
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
  };

  handleCreatePageNavigation = async () => {
    const selectedCountryObj = this.state.countryList?.find(
      item =>
        item.country_code === this.state.selectedState ||
        item.country_name === this.state.selectedState,
    );
    const selectedCountryCode = selectedCountryObj
      ? selectedCountryObj.country_code
      : '';

    await setStorageData('user_country', selectedCountryCode);
    await setStorageData('user_role', this.state.userRole);
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'EmailAccountLoginBlock',
    );
    this.send(message);
  };
  handleGoBack = () => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'RepresentativeCertification',
    );
    this.send(message);
  };

  showType = () => {
    this.setState({ typeClicked: true });
  };

  handleTypeSelection = (selectedType: string) => {
    this.setState({ selectedType, typeClicked: false });
  };

  handleBandArtist = (bandArtist: string) => {
    this.setState({ bandArtist });
  };

  showState = () => {
    this.setState({ stateClicked: true });
  };

  showCity = () => {
    this.setState({ cityClicked: true });
  };

  handleCitySelection = (selectedCity: string) => {
    this.setState({ selectedCity, cityClicked: false });
  };

  hideCountryModal = () => {
    this.setState({ countryModal: false });
  };

  handleState = (selectedState: string) => {
    this.setState({ stateClicked: false }, () => {
      this.onSelectState(selectedState);
    });
  };

  handleAddress = (address: string) => {
    this.setState({ address });
  };

  onZipTextChange = (zip: string) => {
    if (zip && !/^\d+$/.test(zip)) {
      return;
    }
    this.setState({ zip });
  };

  handleCountryAPI = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCountryListAPICallId = requestMessage.messageId;

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
    const selectedCountryObj = this.state.countryList?.find(
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

    this.setState(
      {
        selectedCountry: country,
        stateList: [],
        selectedState: '',
        cityList: [],
        selectedCity: '',
      },
      () => {
        if (selectedCountryCode === 'US')
          this.handleStateAPI(selectedCountryCode);
      },
    );
  };

  showCountry = () => {
    this.setState({ countryClicked: true });
  };

  handleCountry = (selectedCountry: string) => {
    this.setState({ countryClicked: false }, () => {
      this.onSelectCountry(selectedCountry);
    });
  };

  hideTypeModal = () => {
    this.setState({ typeClicked: false });
  };

  hideCountryPickerModal = () => {
    this.setState({ countryClicked: false });
  };

  hideStateModal = () => {
    this.setState({ stateClicked: false });
  };

  hideCityModal = () => {
    this.setState({ cityClicked: false });
  };

  // Customizable Area End
}
