import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import { Alert, Linking, Platform } from 'react-native';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';

import moment from 'moment-timezone';
import {
  getStorageData,
  isEmpty,
  setStorageData,
} from '../../../framework/src/Utilities';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  route?: any;
}

interface S {
  PostData: any;
  token: string;
  name: string;
  showCameraGalleryPopup: boolean;
  description: string;
  price: any;
  currency: string;
  category_id: string;
  image: any;
  uploadedImages: any;
  AllCategory: any[];
  id: any;
  refresh: boolean;
  file: any;
  profileImageData: any;
  selectedCategory: any;
  allCategories: any[];
  optionSelected: string;
  eventTitle: string;
  location: string;
  address: string;
  citiesList: any[];
  selectedCity: string;
  openCityPicker: boolean;
  statesList: any[];
  selectedState: string;
  openStatePicker: boolean;
  zipCode: string;
  dateOfShow: string;
  endDate: string;
  time: string;
  timeList: any[];
  openTimePicker: boolean;
  lineUpList: any[];
  rosterLineUpList: any[];
  selectedLineUp: any[];
  openLineUpPicker: boolean;
  typeOfShowsList: any[];
  selectedTypeOfShows: any[];
  openTyeOfShowsPicker: boolean;
  undefinedDateSelected: boolean;
  selectedDate: moment.Moment;
  selectedEndDate: moment.Moment;
  displayedDate: any;
  displayedEndDate: any;
  showDateSelector: boolean;
  showEndDateSelector: boolean;
  eventTitleError: string;
  locationError: string;
  addressError: string;
  stateError: string;
  cityError: string;
  zipError: string;
  dateOfShowError: string;
  endDateError: string;
  timeError: string;
  lineUpError: string;
  typeOfShowError: string;
  descriptionError: string;
  eventId: string;
  eventDetail: any;
  showMenu: boolean;
  cancelPopup: boolean;
  isLoading: boolean;
  galleryImages: any[];
  selectedImageData: any;
  isPictureExplicit: boolean;
  currentUserId: string;
  lineupText: string;
  genreList: any[];
  selectedGenres: any[];
  openGenresPicker: boolean;
  genreError: string;
  userRole: string;
  accountType: string;
  featureList: any[];
  rulesRegulations: string;
  rulesRegulationError: string;
  sold_out: boolean;
  showSoldOutToast: boolean;
  rulesAndRegulationsIcons: any[];
  selectedRulesAndRegulationsIds: (string | number)[];
  officialRulesAndRegulationsIconsList: { id: number; title: string }[];
  customRuleTxt: string;
  rosterText: string;
  selectedRosters: string[];

  ticketLink: string;
  verified: boolean;
  showDisclaimer: boolean;
  pendingTicketLink: string;
  showRulesMoreModal: boolean;
  isPreviewStep: boolean;
  isDarkMode: boolean;
}

interface SS {
  id: any;
}

export default class PostCreationCommonController extends BlockComponent<
  Props,
  S,
  SS
> {
  apiPostItemCallId: string = '';
  apiGetCategoryCallID: string = '';
  PostApiCallId: string = '';
  DeleteApiCallId: any;
  DeletePostDetailApiCallId: any;
  addpostApiCallId: any;
  updatePostApiCallId: any;
  getStatesAPICallId: any;
  getCitiesAPICallId: any;
  createShowApiCallID: any;
  postponeShowAPICallID: any;
  postDetailApiCallID: any;
  postDetailShowApiCallID: any;
  postDetailPostApiCallID: any;
  postDetailResponseReceived: boolean = false;
  postDetailShowErrorReceived: boolean = false;
  postDetailPostErrorReceived: boolean = false;
  cancelShowAPICallID: any;
  likeDislikeShowApiCallID: any;
  getLineupsAPICallID: any;
  getTypeOfShowAPICallID: any;
  getGenreAPICallID: any;
  getEventFeaturesAPICallID: string = '';
  markAsSoldoutAPICallID: any;
  getUserProfileAPICallId: any;

  /** When userRole is venue or accountType is one of these, auto-fill location from first_name.
   * Excludes RECORD LABEL / BOOKING AGENT / AGENCY / PROMOTER so location fields stay empty by default. */
  VENUE_ACCOUNT_TYPES_LOCATION_FROM_FIRST_NAME = [
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

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
    ];

    this.state = {
      token: '',
      showCameraGalleryPopup: false,
      PostData: [],
      name: '',
      description: '',
      price: '',
      currency: '$',
      category_id: '',
      image: '',
      id: '',
      uploadedImages: [],
      AllCategory: [],
      file: '',
      refresh: false,
      profileImageData: {},
      selectedCategory: '',
      allCategories: [],
      optionSelected: '',
      eventTitle: '',
      location: '',
      address: '',
      citiesList: [],
      selectedCity: '',
      openCityPicker: false,
      statesList: [],
      selectedState: '',
      openStatePicker: false,
      zipCode: '',
      dateOfShow: '',
      endDate: '',
      time: '',
      timeList: [],
      openTimePicker: false,
      lineUpList: [],
      rosterLineUpList: [],
      selectedLineUp: [],
      openLineUpPicker: false,
      typeOfShowsList: [],
      selectedTypeOfShows: [],
      openTyeOfShowsPicker: false,
      undefinedDateSelected: false,
      selectedDate: moment(),
      selectedEndDate: moment(),
      displayedDate: moment(),
      displayedEndDate: moment(),
      showDateSelector: false,
      showEndDateSelector: false,
      eventTitleError: '',
      locationError: '',
      addressError: '',
      stateError: '',
      cityError: '',
      zipError: '',
      dateOfShowError: '',
      endDateError: '',
      timeError: '',
      lineUpError: '',
      typeOfShowError: '',
      descriptionError: '',
      eventId: '',
      eventDetail: null,
      showMenu: false,
      cancelPopup: false,
      isLoading: true,
      galleryImages: [],
      selectedImageData: {},
      isPictureExplicit: false,
      currentUserId: '',
      lineupText: '',
      genreList: [],
      openGenresPicker: false,
      selectedGenres: [],
      genreError: '',
      userRole: '',
      accountType: '',
      featureList: [],
      rulesRegulations: '',
      rulesRegulationError: '',
      sold_out: false,
      showSoldOutToast: false,
      rulesAndRegulationsIcons: [],
      selectedRulesAndRegulationsIds: [],
      officialRulesAndRegulationsIconsList: [],
      customRuleTxt: '',
      rosterText: '',
      selectedRosters: [],
      ticketLink: '',
      verified: false,
      showDisclaimer: false,
      pendingTicketLink: '',
      showRulesMoreModal: false,
      isPreviewStep: false,
      isDarkMode: true,
    };

    console.disableYellowBox = true;
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    const eventImage =
      this.props.route?.params?.event_image ||
      this.props.navigation.state?.params?.event_image;

    console.log(
      'PostCreationCommonController - componentDidMount - eventImage:',
      eventImage,
    );
    console.log(
      'PostCreationCommonController - componentDidMount - route.params:',
      this.props.route?.params,
    );
    console.log(
      'PostCreationCommonController - componentDidMount - navigation.state.params:',
      this.props.navigation.state?.params,
    );

    if (eventImage) {
      console.log(
        'PostCreationCommonController - componentDidMount - Setting selectedImageData immediately',
      );
      this.setState({ selectedImageData: eventImage }, () => {
        console.log(
          'PostCreationCommonController - componentDidMount - selectedImageData set to:',
          this.state.selectedImageData,
        );
      });
    }

    const token = await getStorageData('authToken');
    const bandUserName = await getStorageData('user_name');
    const bandUserId = await getStorageData('user_id');
    const userRole = await getStorageData('userRole');
    const accountType = await getStorageData('account_type') || await getStorageData('accountType') || '';

    if (userRole === 'venue') this.getEventFeatures();

    this.getUserProfile();

    this.getLineupListAPI();
    this.getTypeOfShowsListAPI();

    const eventId =
      this.props.route?.params?.eventId ||
      this.props.navigation.state?.params?.eventId;

    const defaultBandLineup =
      userRole === 'band' &&
      !eventId &&
      bandUserName
        ? [
            {
              id: bandUserId || '',
              first_name: bandUserName,
              email: '',
              created_at: '',
              role_id: 9,
              isDefaultBandLineup: true,
            },
          ]
        : [];

    this.setState({
      currentUserId: bandUserId,
      selectedLineUp: defaultBandLineup,
      userRole,
      accountType,
      token: token,
    });

    const selectedType =
      this.props.route?.params?.from ||
      this.props.navigation.state?.params?.from;
    console.log('PostCreation - selectedType from params:', selectedType);

    if (selectedType === 'show') {
      console.log('PostCreation - Calling getStatesListAPI');
      this.generateTimes();
      this.getStatesListAPI();
    }

    const eventData =
      this.props.route?.params?.eventData ||
      this.props.navigation.state?.params?.eventData;

    console.log('PostCreation - eventImage from params:', eventImage);
    if (eventId) {
      console.log(
        'PostCreation - componentDidMount: Found eventId, setting up PostDetails',
      );

      this.postDetailResponseReceived = false;
      this.postDetailShowErrorReceived = false;
      this.postDetailPostErrorReceived = false;
      this.setState({ eventId }, () => {
        console.log(
          'PostCreation - componentDidMount: Calling APIs for PostDetails',
        );
        this.getLineupListAPI();
        this.handlePostDetailAPI();

        if (eventData) {
          console.log(
            'PostCreation - Found eventData in params, populating state immediately',
          );
          const isPost =
            eventData.type === 'post' ||
            eventData.attributes?.model_name === 'BxBlockPosts::Post';
          if (isPost) {
            this.getPostDetails(eventData);
          } else {
            this.handleLineups({ data: eventData });
            this.getDetails(eventData);
          }
        }
      });
    }

    const authTokenReq = new Message(
      getName(MessageEnum.SessionRequestMessage),
    );
    this.send(authTokenReq);
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog('Message Recived', message);

    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleNavigationPayLoadResponse(message);
    } else if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.handleSessionResponse();
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      console.log('PostCreation - Received REST API response message');
      this.handleRestAPIResponse(message);
    }
  }

  handleSessionResponse = async () => {
    console.log(
      'PostCreation - handleSessionResponse called (Logic moved to componentDidMount)',
    );
  };

  handleRestAPIResponse = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage),
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    const errorMessage = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    if (errorMessage) {
      console.log('PostCreation - API Error received:', errorMessage);
    }

    const errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    const isPostDetailCall =
      apiRequestCallId === this.postDetailShowApiCallID ||
      apiRequestCallId === this.postDetailPostApiCallID ||
      apiRequestCallId === this.postDetailApiCallID;

    if (responseJson) {
      if (isPostDetailCall) {
        this.handlePostDetailAPIResponse(responseJson, apiRequestCallId);
      } else {
        this.handleRestAPISuccessResponse(apiRequestCallId, responseJson);
      }
    } else if (apiRequestCallId === this.DeleteApiCallId) {
      this.getPostData();
    } else if (apiRequestCallId === this.DeletePostDetailApiCallId) {
      if (!errorReponse) {
        this.props.navigation.navigate('Home');
      } else {
        this.parseApiErrorResponse(errorReponse);
        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (errorReponse) {
      if (isPostDetailCall) {
        this.handlePostDetailAPIError(apiRequestCallId, errorReponse);
      } else if (apiRequestCallId === this.markAsSoldoutAPICallID) {
        this.setState({ isLoading: false });
        Alert.alert(
          'Error',
          'Failed to mark show as sold out. Please try again.',
        );
      } else {
        this.setState({ refresh: false });
        this.parseApiErrorResponse(errorReponse);
        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (apiRequestCallId === this.markAsSoldoutAPICallID) {
      this.setState({ isLoading: false });
      Alert.alert('Error', 'No response from server. Please try again.');
    }
  };

  handleRestAPISuccessResponse = (apiRequestCallId: any, responseJson: any) => {
    switch (apiRequestCallId) {
      case this.apiPostItemCallId:
        this.handlePostItemAPIResponse(responseJson);
        break;
      case this.addpostApiCallId:
        this.handleAddPostAPIResponse();
        break;
      case this.apiGetCategoryCallID:
        this.handleCategoriesAPIResponse(responseJson);
        break;
      case this.updatePostApiCallId:
        this.handleUpdatePostAPIResponse();
        break;
      case this.DeleteApiCallId:
        this.getPostData();
        break;
      case this.DeletePostDetailApiCallId:
        this.props.navigation.navigate('Home');
        break;
      case this.getStatesAPICallId:
        this.handleStatesAPIResponse(responseJson);
        break;
      case this.getCitiesAPICallId:
        this.handleCityAPIResponse(responseJson);
        break;
      case this.createShowApiCallID:
        console.log('PostCreation - Processing createShow API response');
        this.handleCreateShowAPIResponse(responseJson);
        break;
      case this.postponeShowAPICallID:
        this.handlePostponeShowAPIResponse(responseJson);
        break;
      case this.postDetailApiCallID:
      case this.postDetailShowApiCallID:
      case this.postDetailPostApiCallID:
        this.handlePostDetailAPIResponse(responseJson, apiRequestCallId);
        break;
      case this.cancelShowAPICallID:
        this.handleCancelShowAPIResponse(responseJson);
        break;
      case this.likeDislikeShowApiCallID:
        this.handleLikeDislikeShow(responseJson);
        break;
      case this.getLineupsAPICallID:
        this.handleLineUpResponse(responseJson);
        break;
      case this.getTypeOfShowAPICallID:
        this.handleTypeOfShowApiResponse(responseJson);
        break;
      case this.getGenreAPICallID:
        this.handleGenreApiResponse(responseJson);
        break;
      case this.getEventFeaturesAPICallID:
        this.handleEventFeaturesAPIResponse(responseJson);
        break;
      case this.getUserProfileAPICallId:
        this.handleUserProfileAPIResponse(responseJson);
        break;
      case this.markAsSoldoutAPICallID:
        console.log('=== markAsSoldoutAPICallID response received ===');
        console.log('responseJson:', JSON.stringify(responseJson));
        this.setState({ isLoading: false });
        if (responseJson && !responseJson.errors) {
          this.setState({ sold_out: true });
          Alert.alert('Success', 'Show has been marked as sold out');
        } else {
          const errorMessage =
            responseJson?.errors?.[0]?.message ||
            responseJson?.error ||
            'Failed to mark show as sold out';
          Alert.alert('Error', errorMessage);
        }
        break;
      default:
        console.log(`Unhandled API call ID: ${apiRequestCallId}`);
        break;
    }
  };

  handleEventFeaturesAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ featureList: responseJson.data });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  getUserProfile = async () => {
    const authToken = await getStorageData('authToken');
    const userId = await getStorageData('user_id');

    console.log('PostCreation - getUserProfile called with userId:', userId);

    if (!userId) {
      console.log('PostCreation - getUserProfile: No user_id found');
      return;
    }

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };

    const endpoint = `${configJSON.showUserProfileEndPoint}?id=${userId}`;
    console.log('PostCreation - getUserProfile endpoint:', endpoint);

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getUserProfileAPICallId = requestMessage.messageId;
    console.log(
      'PostCreation - getUserProfile API call ID:',
      this.getUserProfileAPICallId,
    );

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

  handleUserProfileAPIResponse = (responseJson: any) => {
    console.log(
      'PostCreation - handleUserProfileAPIResponse called with:',
      JSON.stringify(responseJson, null, 2),
    );
    if (
      !responseJson.errors &&
      responseJson.data &&
      responseJson.data.attributes
    ) {
      const verifiedAttr = responseJson.data.attributes.verified;
      const verified =
        verifiedAttr === true || verifiedAttr === 'true';
      console.log('PostCreation - Verified status:', {
        verifiedAttr,
        verified,
      });
      console.log(
        'PostCreation - All Attributes Keys:',
        Object.keys(responseJson.data.attributes),
      );
      const rulesAndRegulationsIconsRaw =
        responseJson.data.attributes.rules_and_regulations_icons || [];
      
      // Normalize rulesAndRegulationsIcons to always be an array of objects with title property
      const rulesAndRegulationsIcons = rulesAndRegulationsIconsRaw.map((item: any) => {
        if (typeof item === 'string') {
          return { title: item, id: item };
        } else if (item && typeof item === 'object') {
          return {
            title: item.title || item.name || String(item),
            id: item.id || item.title || item.name || String(item),
          };
        }
        return { title: String(item), id: String(item) };
      });
      const rostersRaw = responseJson.data.attributes.rosters || [];

      const rosters = rostersRaw.map((roster: any) => {
        if (typeof roster === 'string') {
          return roster;
        } else if (roster && typeof roster === 'object' && roster.name) {
          return roster.name;
        } else if (roster && typeof roster === 'object' && roster.title) {
          return roster.title;
        }
        return String(roster);
      });

      const profileAddress = responseJson.data.attributes.address || '';
      const profileStateName = responseJson.data.attributes.state || '';
      const profileCity = responseJson.data.attributes.city || '';
      const profileZipCodeRaw = responseJson.data.attributes.postal_code
        ? responseJson.data.attributes.postal_code.toString()
        : responseJson.data.attributes.zip_code
        ? responseJson.data.attributes.zip_code.toString()
        : '';
      // Pad zip code to 5 digits with leading zeros
      const profileZipCode = profileZipCodeRaw
        ? String(profileZipCodeRaw).trim().replace(/\D/g, '').padStart(5, '0').slice(0, 5)
        : '';

      const { statesList } = this.state;
      const selectedStateKey =
        statesList.length !== 0 && profileStateName
          ? statesList.find(
              item =>
                item.name === profileStateName || item.key === profileStateName,
            )?.key ?? ''
          : '';

      console.log(
        'PostCreation - Extracted rules_and_regulations_icons:',
        rulesAndRegulationsIcons,
      );
      console.log('PostCreation - Extracted rosters (raw):', rostersRaw);
      console.log('PostCreation - Extracted rosters (processed):', rosters);
      console.log('PostCreation - Extracted address:', profileAddress);
      console.log('PostCreation - Extracted state name:', profileStateName);
      console.log('PostCreation - Extracted state key:', selectedStateKey);
      console.log('PostCreation - Extracted city:', profileCity);
      console.log('PostCreation - Extracted zip code:', profileZipCode);

      const rosterLineups = rosters.map((rosterName: string) => ({
        id: '',
        first_name: rosterName,
        email: '',
        created_at: '',
        role_id: 9,
      }));

      console.log(
        'PostCreation - Converting roster items to lineup format:',
        rosterLineups,
      );
      console.log(
        'PostCreation - Number of roster items:',
        rosterLineups.length,
      );

      const accountType = responseJson.data.attributes.account_type || 
                          responseJson.data.attributes.accountType || 
                          this.state.accountType || 
                          '';

      const userRole =
        responseJson.data.attributes.user_role ||
        responseJson.data.attributes.userRole ||
        responseJson.data.attributes.role ||
        this.state.userRole ||
        '';

      const profileFirstName =
        responseJson.data.attributes.first_name ||
        responseJson.data.attributes.full_name ||
        responseJson.data.attributes.name ||
        responseJson.data.attributes.user_name ||
        responseJson.data.attributes.business_name ||
        responseJson.data.attributes.venue_name ||
        responseJson.data.attributes.account_name;

      const stateUpdate: any = {
        rulesAndRegulationsIcons,
        selectedRulesAndRegulationsIds: rulesAndRegulationsIcons.map(
          (item: any) =>
            typeof item === 'string' ? item : item?.id ?? item?.title ?? item?.name ?? '',
        ).filter(Boolean),
        rosterLineUpList: rosterLineups,
        verified,
        accountType,
        ...(userRole ? { userRole } : {}),
      };

      const accountTypeStr = String(accountType || '').toLowerCase();
      const isAccountTypeInAutoFillList = this.VENUE_ACCOUNT_TYPES_LOCATION_FROM_FIRST_NAME.some(
        type => accountTypeStr === (type || '').toLowerCase() || accountTypeStr === (type || '').toLowerCase().replace(/\s+/g, '_'),
      );
      const isVenueWithAutoFillAccountType =
        (userRole || '').toLowerCase() === 'venue' &&
        (accountTypeStr === '1' ||
          accountTypeStr === '2' ||
          isAccountTypeInAutoFillList);

      const shouldAutoFillLocation =
        !this.state.eventId &&
        (isVenueWithAutoFillAccountType || isAccountTypeInAutoFillList);

      if (shouldAutoFillLocation) {
        stateUpdate.address = profileAddress;
        stateUpdate.selectedState = selectedStateKey || profileStateName;
        stateUpdate.selectedCity = profileCity;
        stateUpdate.zipCode = profileZipCode;
        if (profileFirstName) {
          stateUpdate.location = profileFirstName;
        }
      }
      if (
        ((userRole || '').toLowerCase() === 'band' ||
          this.state.userRole === 'band') &&
        !this.state.eventId &&
        profileFirstName
      ) {
        const currentSelected = this.state.selectedLineUp || [];
        const defaultEntry = {
          id: this.state.currentUserId || '',
          first_name: profileFirstName,
          email: '',
          created_at: '',
          role_id: 9,
          isDefaultBandLineup: true,
        };
        const others = currentSelected.filter(
          (item: any) => !item.isDefaultBandLineup,
        );
        stateUpdate.selectedLineUp = [defaultEntry, ...others];
      }

      this.setState(stateUpdate, () => {
        console.log(
          'PostCreation - State updated with rulesAndRegulationsIcons:',
          this.state.rulesAndRegulationsIcons,
        );
        console.log(
          'PostCreation - State updated with rosterLineUpList:',
          this.state.rosterLineUpList,
        );

        if (shouldAutoFillLocation) {
          console.log(
            'PostCreation - State updated with address:',
            this.state.address,
          );
          console.log(
            'PostCreation - State updated with selectedState:',
            this.state.selectedState,
          );
          console.log(
            'PostCreation - State updated with selectedCity:',
            this.state.selectedCity,
          );
          console.log(
            'PostCreation - State updated with zipCode:',
            this.state.zipCode,
          );

          if (selectedStateKey || profileStateName) {
            this.getCitiesListAPI(selectedStateKey || profileStateName);
          }
        }
      });
    } else {
      console.log(
        'PostCreation - Error in handleUserProfileAPIResponse:',
        responseJson.errors,
      );
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleAPIErrors = (responseJson: any) => {
    this.setState({ refresh: false });
    this.parseApiErrorResponse(responseJson);
  };

  handlePostItemAPIResponse = (responseJson: any) => {
    this.setState({ PostData: responseJson, refresh: false });
  };

  handleAddPostAPIResponse = () => {
    this.setState({ refresh: true });
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
  };

  handleCategoriesAPIResponse = (responseJson: any) => {
    let allCategories: any[] = [];
    let categories: string[] = [];

    const response = responseJson;

    response.forEach((item: any) => {
      if (categories.indexOf(item.data.attributes.name) === -1) {
        let category = {
          value: item.data.attributes.id,
          label: item.data.attributes.name,
        };
        allCategories.push(category);
        categories.push(item.data.attributes.name);
      }
    });

    this.setState({
      AllCategory: responseJson,
      allCategories: allCategories,
    });
    this.getPostData();
  };

  handleUpdatePostAPIResponse = () => {
    this.setState({ refresh: true });
    this.getPostData();
    this.props.navigation.state.params.callback();
    this.props.navigation.goBack();
  };

  handleStatesAPIResponse = (responseJson: any) => {
    console.log('PostCreation - States API Response received:', responseJson);
    this.setState({ isLoading: false });
    this.getLineupListAPI();
    this.getTypeOfShowsListAPI();
    if (!responseJson.errors) {
      const { state } = responseJson;
      const states = Object.keys(state).map(item => {
        return {
          key: item,
          name: state[item],
        };
      });
      this.setState({ statesList: states }, () => {
        const currentSelectedState = this.state.selectedState;
        if (
          currentSelectedState &&
          !states.find(s => s.key === currentSelectedState)
        ) {
          const matchingState = states.find(
            s => s.name === currentSelectedState,
          );
          if (matchingState) {
            this.setState({ selectedState: matchingState.key }, () => {
              this.getCitiesListAPI(matchingState.key);
            });
          }
        } else if (currentSelectedState) {
          this.getCitiesListAPI(currentSelectedState);
        }
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleCityAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { city } = responseJson;
      this.setState({ citiesList: city }, () => {
        if (
          this.state.eventId !== undefined &&
          this.state.eventId !== null &&
          this.state.eventId !== ''
        ) {
          const selectedCityObject = this.state.citiesList?.find(
            item => item === this.state.selectedCity,
          );
          const selectedCityKey = selectedCityObject ?? '';
          this.setState({ selectedCity: selectedCityKey }, () => {});
        }
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleCreateShowAPIResponse = (responseJson: any) => {
    runEngine.debugLog('API Message create show', responseJson);
    console.log(
      'PostCreation - Create show API response received:',
      responseJson,
    );
    console.log('PostCreation - Setting isLoading: false');
    this.setState({ isLoading: false });
    if (!responseJson.errors) {
      const selectedStateObject = this.state.statesList.find(
        item => item.key === responseJson.data.attributes.state,
      );
      const selectedStateName = selectedStateObject
        ? selectedStateObject.name
        : '';

      this.props.navigation.replace('PostDetails', {
        eventId: responseJson.data.id,
        eventState: selectedStateName,
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handlePostponeShowAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const selectedStateObject = this.state.statesList.find(
        item => item.name === responseJson.data.attributes.state,
      );
      const selectedStateName = selectedStateObject
        ? selectedStateObject.name
        : '';

      this.props.navigation.replace('PostDetails', {
        eventId: responseJson.data.id,
        eventState: selectedStateName,
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handlePostDetailAPIError = (apiRequestCallId: any, errorResponse: any) => {
    console.log('PostCreation - handlePostDetailAPIError called');
    console.log('PostCreation - API Call ID:', apiRequestCallId);
    console.log('PostCreation - Error response:', errorResponse);

    const errorMessage = errorResponse?.message || errorResponse || '';
    const isShowNotPresent =
      typeof errorMessage === 'string' &&
      errorMessage.toLowerCase().includes('show with this id is not present');

    if (apiRequestCallId === this.postDetailShowApiCallID) {
      this.postDetailShowErrorReceived = true;
      console.log('PostCreation - Show endpoint returned error');
      if (isShowNotPresent) {
        console.log(
          'PostCreation - Show not present, will use post endpoint response',
        );
      }
    } else if (apiRequestCallId === this.postDetailPostApiCallID) {
      this.postDetailPostErrorReceived = true;
      console.log('PostCreation - Post endpoint returned error');
    }

    if (
      this.postDetailShowErrorReceived &&
      this.postDetailPostErrorReceived &&
      !this.postDetailResponseReceived
    ) {
      console.log('PostCreation - Both endpoints failed, showing error');
      this.setState({ refresh: false, isLoading: false });
      this.parseApiErrorResponse(errorResponse);
      this.parseApiCatchErrorResponse(errorResponse);
    } else {
      console.log('PostCreation - Waiting for other endpoint response');
    }
  };

  handlePostDetailAPIResponse = async (
    responseJson: any,
    apiRequestCallId: any,
  ) => {
    console.log('PostCreation - handlePostDetailAPIResponse called');
    console.log('PostCreation - API Call ID:', apiRequestCallId);
    console.log('PostCreation - Response data:', responseJson);

    const errorMessage =
      responseJson?.message ||
      responseJson?.errors?.message ||
      (Array.isArray(responseJson?.errors)
        ? responseJson.errors[0]
        : responseJson?.errors) ||
      '';
    const isShowNotPresent =
      typeof errorMessage === 'string' &&
      errorMessage.toLowerCase().includes('show with this id is not present');

    if (apiRequestCallId === this.postDetailShowApiCallID && isShowNotPresent) {
      console.log(
        'PostCreation - Show endpoint returned "Show with this id is not present", waiting for post endpoint',
      );
      this.postDetailShowErrorReceived = true;

      if (
        this.postDetailPostErrorReceived &&
        !this.postDetailResponseReceived
      ) {
        console.log(
          'PostCreation - Both endpoints failed (Show not present + Post error), showing error',
        );
        this.setState({ refresh: false, isLoading: false });
        this.parseApiErrorResponse(responseJson);
      } else {
        console.log('PostCreation - Waiting for post endpoint');
      }

      return;
    }

    if (this.postDetailResponseReceived) {
      if (this.state.isLoading) {
        this.setState({ isLoading: false });
      }
      console.log(
        'PostCreation - Already received a successful response, ignoring this one',
      );
      return;
    }

    if (!responseJson.errors && !isShowNotPresent) {
      console.log('PostCreation - No errors, processing response data');
      console.log('PostCreation - Event data:', responseJson.data);

      this.postDetailResponseReceived = true;

      const isPost =
        responseJson.data.type === 'post' ||
        responseJson.data.attributes?.model_name === 'BxBlockPosts::Post';
      console.log('PostCreation - Detected type:', isPost ? 'post' : 'show');
      if (isPost) {
        this.getPostDetails(responseJson.data);
      } else {
        this.handleLineups(responseJson);
        this.getDetails(responseJson.data);
      }
    } else {
      console.log(
        'PostCreation - API errors found:',
        responseJson.errors || errorMessage,
      );

      if (apiRequestCallId === this.postDetailShowApiCallID) {
        this.postDetailShowErrorReceived = true;
        console.log(
          'PostCreation - Show endpoint returned error, waiting for post endpoint',
        );
      } else if (apiRequestCallId === this.postDetailPostApiCallID) {
        this.postDetailPostErrorReceived = true;
        console.log('PostCreation - Post endpoint returned error');
      }

      if (
        this.postDetailShowErrorReceived &&
        this.postDetailPostErrorReceived &&
        !this.postDetailResponseReceived
      ) {
        console.log('PostCreation - Both endpoints failed, showing error');
        this.setState({ refresh: false, isLoading: false });
        this.parseApiErrorResponse(responseJson);
      } else {
        console.log('PostCreation - Waiting for other endpoint response');
      }
    }
  };

  getPostDetails = async (data: any) => {
    console.log('PostCreation - getPostDetails called with data:', data);
    const { attributes } = data;
    console.log('PostCreation - Post attributes:', attributes);

    const imageData =
      attributes.images_and_videos && attributes.images_and_videos.length > 0
        ? { uri: attributes.images_and_videos[0].url }
        : {};

    this.setState({
      eventDetail: data,
      eventId: data.id,
      eventTitle: attributes.name || attributes.description || '',
      location: attributes.location || '',
      address: attributes.address || '',
      selectedState: attributes.state || '',
      selectedCity: attributes.city || '',
      zipCode: (() => {
        const zipRaw = attributes.zip_code
          ? attributes.zip_code.toString()
          : attributes.postal_code
          ? attributes.postal_code.toString()
          : '';
        // Pad zip code to 5 digits with leading zeros
        return zipRaw
          ? String(zipRaw).trim().replace(/\D/g, '').padStart(5, '0').slice(0, 5)
          : '';
      })(),
      dateOfShow: '',
      endDate: '',
      selectedDate: this.state.selectedDate,
      selectedEndDate: this.state.selectedEndDate,
      selectedLineUp: [],
      selectedTypeOfShows: [],
      selectedGenres: [],
      time: '',
      description: attributes.description || '',
      isLoading: false,
      selectedImageData: imageData,
      undefinedDateSelected: false,
      sold_out: attributes.sold_out || false,
    });
  };

  handleLineups = (responseData: any) => {
    if (!responseData.data.attributes.line_ups) {
      return;
    }
    const line_ups = responseData.data.attributes.line_ups.map(
      (lineupName: any) => {
        const band = this.state.lineUpList.find(
          band => band.first_name === lineupName,
        );
        return (
          band || {
            id: null,
            first_name: lineupName,
            email: '',
            created_at: '',
            role_id: 9,
          }
        );
      },
    );
    this.setState({ selectedLineUp: line_ups });
  };

  getDetails = async (data: any) => {
    console.log('PostCreation - getDetails called with data:', data);
    const { attributes } = data;
    console.log('PostCreation - Event attributes:', attributes);
    console.log('PostCreation - Address from attributes:', attributes.address);
    console.log('PostCreation - Zip from attributes:', attributes.zip_code);

    const { statesList, lineUpList } = this.state;

    const selectedStateKey =
      statesList.length !== 0
        ? statesList.find(
            item =>
              item.key === attributes.state || item.name === attributes.state,
          )?.key ?? ''
        : attributes.state;

    const bandUserName = await getStorageData('user_name');

    const updatedLineups = attributes.line_ups
      ? attributes.line_ups.map((lineupName: string) => {
          const match = lineUpList.find(
            lineup => lineup.first_name === lineupName,
          );
          return match
            ? match
            : {
                id: bandUserName === lineupName ? this.state.currentUserId : '',
                first_name: lineupName,
                email: '',
                created_at: '',
                role_id: 9,
              };
        })
      : [];

    const dateOfShow =
      attributes.date_of_the_show === '2999-12-31'
        ? ''
        : this.formatDate(attributes.date_of_the_show);

    const endDate = attributes.end_date
      ? this.formatDate(attributes.end_date)
      : '';

    const time =
      dateOfShow && attributes.time
        ? attributes.time.split(':').slice(0, 2).join('h')
        : '';

    const isDateUndefined = attributes.date_of_the_show === '2999-12-31';

    // Extract rules and regulations icons
    // Check multiple possible field names
    const rulesAndRegulationsIconsRaw =
      attributes.rules_and_regulations_icons ||
      attributes.rules_and_regulations ||
      (attributes.rules_and_regulations_icons === null
        ? []
        : attributes.rules_and_regulations_icons) ||
      [];
    
    // Normalize rulesAndRegulationsIcons to always be an array of objects with title property
    const rulesAndRegulationsIcons = rulesAndRegulationsIconsRaw.map((item: any) => {
      if (typeof item === 'string') {
        return { title: item, id: item };
      } else if (item && typeof item === 'object') {
        return {
          title: item.title || item.name || String(item),
          id: item.id || item.title || item.name || String(item),
        };
      }
      return { title: String(item), id: String(item) };
    });

    console.log(
      'PostCreation - getDetails - Extracted rules_and_regulations_icons:',
      rulesAndRegulationsIcons,
    );
    console.log(
      'PostCreation - getDetails - attributes.rules_and_regulations_icons:',
      attributes.rules_and_regulations_icons,
    );
    console.log(
      'PostCreation - getDetails - attributes.rules_and_regulations:',
      attributes.rules_and_regulations,
    );
    console.log(
      'PostCreation - getDetails - All attributes keys:',
      Object.keys(attributes),
    );

    // Extract rosters and convert to lineup format
    const rostersRaw = attributes.rosters || [];
    console.log('PostCreation - getDetails - Extracted rosters (raw):', rostersRaw);
    const rosters = rostersRaw.map((roster: any) => {
      if (typeof roster === 'string') {
        return roster;
      } else if (roster && typeof roster === 'object' && roster.name) {
        return roster.name;
      } else if (roster && typeof roster === 'object' && roster.title) {
        return roster.title;
      }
      return String(roster);
    });

    const rosterLineups = rosters.map((rosterName: string) => ({
      id: '',
      first_name: rosterName,
      email: '',
      created_at: '',
      role_id: 9,
    }));

    // Combine regular lineups with roster lineups (avoid duplicates)
    const allLineups = [...updatedLineups];
    rosterLineups.forEach((rosterLineup: any) => {
      const exists = allLineups.some(
        (lineup: any) => lineup.first_name === rosterLineup.first_name,
      );
      if (!exists) {
        allLineups.push(rosterLineup);
      }
    });

    this.setState(
      {
        eventDetail: data,
        eventId: data.id,
        eventTitle:
          attributes.event_title || attributes.name || attributes.title || '',
        location: attributes.location || '',
        address: attributes.address || '',
        selectedState: selectedStateKey,
        selectedCity: attributes.city || '',
        zipCode: attributes.zip_code
          ? attributes.zip_code.toString()
          : attributes.postal_code
          ? attributes.postal_code.toString()
          : '',
        dateOfShow,
        endDate,
        selectedDate: dateOfShow
          ? moment(dateOfShow, 'MM-DD-YYYY')
          : this.state.selectedDate,
        selectedEndDate: endDate
          ? moment(endDate, 'MM-DD-YYYY')
          : this.state.selectedEndDate,
        selectedLineUp: allLineups,
        selectedTypeOfShows: attributes.type_of_show || [],
        selectedGenres: attributes.genre ?? [],
        time,
        description: attributes.description || '',
        isLoading: false,
        selectedImageData: {
          uri: attributes.profile_image || '',
        },
        undefinedDateSelected: isDateUndefined,
        sold_out: attributes.sold_out || false,
        ticketLink: attributes.ticket_link || '',
        rulesAndRegulationsIcons,
        selectedRulesAndRegulationsIds: rulesAndRegulationsIcons.map(
          (item: any) =>
            typeof item === 'string' ? item : item?.id ?? item?.title ?? item?.name ?? '',
        ).filter(Boolean),
        rulesRegulations: attributes.rules_regulations || attributes.custom_rules || '',
        rosterLineUpList: rosterLineups,
      },
      () => {
        if (selectedStateKey) {
          this.getCitiesListAPI(selectedStateKey);
        }
        if (
          attributes.type_of_show &&
          attributes.type_of_show.length > 0 &&
          attributes.type_of_show[0].id
        ) {
          this.getGenreListAPI(attributes.type_of_show[0].id);
        }
      },
    );
  };

  formatDate = (isoDate: string): string => {
    return moment.utc(isoDate).format('MM-DD-YYYY');
  };

  handleCancelShowAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      Alert.alert('Success', 'Show cancelled successfully');
      if (this.state.eventDetail) {
        const updatedDetail = {
          ...this.state.eventDetail,
          attributes: {
            ...this.state.eventDetail.attributes,
            is_canceled: true,
          },
        };
        this.setState({ eventDetail: updatedDetail });
      }
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleLineUpResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ lineUpList: responseJson.data });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleTypeOfShowApiResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ typeOfShowsList: responseJson.data });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGenreApiResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ genreList: responseJson.data });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleLikeDislikeShow = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      const eventDetail = this.state.eventDetail;
      if (eventDetail?.attributes) {
        const wasLiked = Boolean(eventDetail.attributes.like_by_me);
        const likesCount = parseInt(eventDetail.attributes.likes_count, 10) || 0;
        this.setState({
          isLoading: false,
          eventDetail: {
            ...eventDetail,
            attributes: {
              ...eventDetail.attributes,
              like_by_me: !wasLiked,
              likes_count: wasLiked ? Math.max(0, likesCount - 1) : likesCount + 1,
            },
          },
        });
      } else {
        this.postDetailResponseReceived = false;
        this.postDetailShowErrorReceived = false;
        this.postDetailPostErrorReceived = false;
        this.handlePostDetailAPI();
      }
    } else {
      this.setState({ isLoading: false });
      this.parseApiErrorResponse(responseJson);
    }
  };

  generateTimes = () => {
    const timeList: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeList.push(`${formattedHour}h${formattedMinute}`);
      }
    }
    this.setState({ timeList });
  };

  getStatesListAPI = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getStatesAPICallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getStatesAPIEndPoint + 'US',
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

  getCitiesListAPI = (state: string) => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCitiesAPICallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getCitiesAPIEndPoint + state,
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

  showDateSelector = () => {
    this.setState({
      showDateSelector: true,
      dateOfShow: '',
      displayedDate: moment(),
    });
  };

  setDates = (dates: any) => {
    if (dates.startDate) {
      const selectedDate = moment(dates.startDate);
      this.setState({
        dateOfShow: selectedDate.format('MM-DD-YYYY'),
        showDateSelector: false,
        selectedDate,
      });
    }
    if (dates.displayedDate) {
      this.setState({
        displayedDate: dates.displayedDate,
      });
    }
  };

  showEndDateSelector = () => {
    this.setState({
      showEndDateSelector: true,
      displayedEndDate: moment(),
    });
  };

  setEndDate = (dates: any) => {
    if (dates.startDate) {
      const selectedEndDate = moment(dates.startDate);
      this.setState({
        endDate: selectedEndDate.format('MM-DD-YYYY'),
        showEndDateSelector: false,
        selectedEndDate,
      });
    }
    if (dates.displayedDate) {
      this.setState({
        displayedEndDate: dates.displayedDate,
      });
    }
  };
  checkCreateShowValidation = () => {
    let error = false;
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{5,100}$/;
    this.setState({
      eventTitleError: '',
      locationError: '',
      addressError: '',
      stateError: '',
      cityError: '',
      zipError: '',
      dateOfShowError: '',
      endDateError: '',
      timeError: '',
      lineUpError: '',
      typeOfShowError: '',
      descriptionError: '',
      genreError: '',
    });

    if (isEmpty(this.state.eventTitle)) {
      console.log('PostCreation - Validation Failed: eventTitle is empty');
      this.setState({ eventTitleError: configJSON.emptyEventTitle });
      error = true;
    }

    if (isEmpty(this.state.location)) {
      console.log('PostCreation - Validation Failed: location is empty');
      this.setState({ locationError: configJSON.emptyLocation });
      error = true;
    }

    if (isEmpty(this.state.address)) {
      console.log('PostCreation - Validation Failed: address is empty');
      this.setState({ addressError: configJSON.emptyAddress });
      error = true;
    } else if (this.state.address.length < 5) {
      console.log('PostCreation - Validation Failed: address too short');
      this.setState({ addressError: configJSON.emptyAddressValid });
      error = true;
    } else if (!addressRegex.test(this.state.address)) {
      console.log('PostCreation - Validation Failed: address regex mismatch');
      this.setState({ addressError: configJSON.emptyAddressValid });
      error = true;
    }

    if (isEmpty(this.state.selectedState)) {
      console.log('PostCreation - Validation Failed: selectedState is empty');
      this.setState({ stateError: configJSON.emptyState });
      error = true;
    }

    if (isEmpty(this.state.selectedCity)) {
      console.log('PostCreation - Validation Failed: selectedCity is empty');
      this.setState({ cityError: configJSON.emptyCity });
      error = true;
    }

    if (isEmpty(this.state.zipCode)) {
      console.log('PostCreation - Validation Failed: zipCode is empty');
      this.setState({ zipError: configJSON.emptyZip });
      error = true;
    } else if (this.state.zipCode.length !== 5) {
      console.log('PostCreation - Validation Failed: zipCode must be exactly 5 digits');
      this.setState({ zipError: configJSON.invalidZip || 'Zip code must be exactly 5 digits' });
      error = true;
    }

    if (isEmpty(this.state.dateOfShow)) {
      console.log('PostCreation - Validation Failed: dateOfShow is empty');
      this.setState({ dateOfShowError: configJSON.emptyDate });
      error = true;
    }

    if (
      this.state.endDate &&
      this.state.dateOfShow &&
      moment(this.state.endDate, 'MM-DD-YYYY').isBefore(
        moment(this.state.dateOfShow, 'MM-DD-YYYY'),
      )
    ) {
      console.log(
        'PostCreation - Validation Failed: endDate before dateOfShow',
      );
      this.setState({ endDateError: configJSON.invalidEndDate });
      error = true;
    }

    if (isEmpty(this.state.time)) {
      console.log('PostCreation - Validation Failed: time is empty');
      this.setState({ timeError: configJSON.emptyTime });
      error = true;
    }

    if (this.state.selectedLineUp.length === 0) {
      console.log('PostCreation - Validation Failed: selectedLineUp is empty');
      this.setState({ lineUpError: configJSON.emptyLineUp });
      error = true;
    }

    if (this.state.selectedTypeOfShows.length === 0) {
      console.log(
        'PostCreation - Validation Failed: selectedTypeOfShows is empty',
      );
      this.setState({ typeOfShowError: configJSON.emptyTypeOfShow });
      error = true;
    }

    if (this.state.selectedGenres.length === 0) {
      console.log('PostCreation - Validation Failed: selectedGenres is empty');
      this.setState({ genreError: configJSON.emptyGenre });
      error = true;
    }

    if (isEmpty(this.state.description)) {
      console.log('PostCreation - Validation Failed: description is empty');
      this.setState({ descriptionError: configJSON.emptyDescription });
      error = true;
    }

    if (error) {
      return false;
    }
    return true;
  };

  handleCreateShowBody = () => {
    console.log(
      'PostCreation - handleCreateShowBody: Checking state values...',
    );
    console.log('PostCreation - selectedDate:', this.state.selectedDate);
    console.log('PostCreation - selectedLineUp:', this.state.selectedLineUp);
    console.log(
      'PostCreation - selectedTypeOfShows:',
      this.state.selectedTypeOfShows,
    );
    console.log('PostCreation - selectedGenres:', this.state.selectedGenres);

    const {
      address,
      description,
      eventTitle,
      location,
      selectedCity,
      selectedDate,
      selectedEndDate,
      selectedGenres,
      selectedImageData,
      selectedLineUp,
      selectedTypeOfShows,
      time,
      zipCode,
      endDate,
    } = this.state;
    const selectedStateObject = this.state.statesList.find(
      item => item.key === this.state.selectedState,
    );
    const selectedStateName = selectedStateObject
      ? selectedStateObject.name
      : this.state.selectedState || '';
    const selectedDateFormatted = moment
      .utc({
        year: selectedDate.year(),
        month: selectedDate.month(),
        date: selectedDate.date(),
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const selectedEndDateFormatted =
      endDate && selectedEndDate
        ? moment
            .utc({
              year: selectedEndDate.year(),
              month: selectedEndDate.month(),
              date: selectedEndDate.date(),
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            })
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        : '';
    const typeOfShowsNamesList: any[] = [];
    const genresNamesList: any[] = [];
    const formData = new FormData();
    formData.append('show[event_title]', eventTitle.trim());
    formData.append('show[location]', location.trim());
    formData.append('show[address]', address.trim());
    formData.append('show[country]', 'US');
    formData.append('show[state]', selectedStateName);
    formData.append('show[city]', selectedCity.trim());
    
    // Format zip code to exactly 5 digits with leading zeros
    const formattedZipCode = zipCode
      ? String(zipCode).trim().replace(/\D/g, '').padStart(5, '0').slice(0, 5)
      : '';
    console.log('PostCreation - Original zipCode:', zipCode);
    console.log('PostCreation - Formatted zipCode:', formattedZipCode);
    formData.append('show[zip_code]', formattedZipCode);
    formData.append('show[date_of_the_show]', selectedDateFormatted.trim());
    if (selectedEndDateFormatted) {
      formData.append('show[end_date]', selectedEndDateFormatted.trim());
    }
    formData.append('show[time]', time.trim());

    const safeSelectedLineUp = selectedLineUp || [];
    const safeSelectedTypeOfShows = selectedTypeOfShows || [];
    const safeSelectedGenres = selectedGenres || [];

    console.log('PostCreation - Safe arrays:', {
      safeSelectedLineUp,
      safeSelectedTypeOfShows,
      safeSelectedGenres,
    });

    safeSelectedLineUp.forEach(item => {
      if (item.id === '') formData.append('show[line_ups][]', item.first_name);
      else formData.append('show[line_ups][]', item.id);
    });
    safeSelectedTypeOfShows.forEach(item => {
      if (item.attributes) {
        typeOfShowsNamesList.push(item.attributes.name);
      } else {
        typeOfShowsNamesList.push(item.name);
      }
    });
    formData.append('show[type_of_show]', typeOfShowsNamesList.toString());
    safeSelectedGenres.forEach(item => {
      if (item.attributes) {
        genresNamesList.push(item.attributes.name);
      } else {
        genresNamesList.push(item.name);
      }
    });
    formData.append('show[genre]', genresNamesList.toString());
    formData.append('show[description]', description.trim());

    console.log('PostCreation - selectedImageData:', selectedImageData);
    console.log(
      'PostCreation - selectedImageData type:',
      typeof selectedImageData,
    );
    console.log(
      'PostCreation - selectedImageData.uri:',
      selectedImageData?.uri,
    );
    console.log(
      'PostCreation - Object.keys(selectedImageData):',
      selectedImageData ? Object.keys(selectedImageData) : 'null',
    );

    if (selectedImageData && selectedImageData.uri) {
      console.log('PostCreation - Image URI found:', selectedImageData.uri);
      if (
        !selectedImageData.uri.includes('https:') &&
        !selectedImageData.uri.includes('http:')
      ) {
        const eventImage = {
          uri: selectedImageData.uri,
          type: 'image/jpeg',
          name: 'eventImage.jpg',
        };
        formData.append('show[profile_image]', eventImage as any);
        console.log(
          'PostCreation - Appended local image to form data:',
          eventImage,
        );
      } else {
        console.log(
          'PostCreation - Remote image URL detected, skipping append to preserve existing image:',
          selectedImageData.uri,
        );
      }
    } else {
      console.log(
        'PostCreation - No image data found, profile_image will be blank',
      );
      console.log('PostCreation - selectedImageData is falsy or has no uri');

      console.log(
        'PostCreation - Adding placeholder image to prevent API error',
      );
      const placeholderImage = {
        uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        type: 'image/jpeg',
        name: 'placeholder.jpg',
      };
      formData.append('show[profile_image]', placeholderImage as any);
      console.log('PostCreation - Added placeholder image to form data');
    }

    console.log('PostCreation - FormData created successfully');
    console.log('PostCreation - FormData type:', typeof formData);
    console.log(
      'PostCreation - FormData constructor:',
      formData.constructor.name,
    );
    formData.append('show[ticket_link]', this.state.ticketLink);

    // Append only selected rules_and_regulations_icon_ids to API
    const rulesAndRegulationsIcons =
      this.state.rulesAndRegulationsIcons || [];
    const selectedIds = this.state.selectedRulesAndRegulationsIds || [];
    const selectedIdStrList = selectedIds.map(id =>
      typeof id === 'string' ? id : String(id),
    );
    const isSelected = (idStr: string) =>
      selectedIdStrList.indexOf(idStr) !== -1;
    rulesAndRegulationsIcons.forEach((item: any) => {
      const itemId =
        typeof item === 'string'
          ? item
          : item?.id ?? item?.title ?? item?.name ?? '';
      const idStr = itemId ? String(itemId) : '';
      if (idStr && isSelected(idStr)) {
        const value =
          typeof item === 'string'
            ? item
            : item?.title || item?.id || item?.name || '';
        if (value) {
          formData.append('show[rules_and_regulations_icon_ids][]', value);
        }
      }
    });

    return formData;
  };

  handleCreateShowAPI = async () => {
    console.log('PostCreation - handleCreateShowAPI called');
    const validationPassed = this.checkCreateShowValidation();
    console.log('PostCreation - Validation passed:', validationPassed);
    if (validationPassed) {
      console.log(
        'PostCreation - Starting create show API, setting isLoading: true',
      );
      this.setState({ isLoading: true });
      const authToken = await getStorageData('authToken');
      console.log(
        'PostCreation - Auth token:',
        authToken ? 'Present' : 'Missing',
      );

      console.log('PostCreation - Creating form data...');
      let formData;
      try {
        formData = this.handleCreateShowBody();
        console.log('PostCreation - Form data created successfully',formData);
      } catch (error) {
        console.log('PostCreation - Error creating form data:', error);
        this.setState({ isLoading: false });
        return;
      }
      //  return

      console.log('PostCreation - Setting up endpoint...');
      const endPoint =
        this.state.eventId !== ''
          ? `${configJSON.createShowEndPoint}/${this.state.eventId}`
          : configJSON.createShowEndPoint;
      const mehodType =
        this.state.eventId !== ''
          ? configJSON.putMethodType
          : configJSON.PostAPiMethod;
      console.log('PostCreation - Endpoint and method set');

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.createShowApiCallID = requestMessage.messageId;
      console.log('PostCreation - API Call ID:', this.createShowApiCallID);
      console.log('PostCreation - API Endpoint:', endPoint);

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endPoint,
      );

      const header = {
        'Content-Type': configJSON.contentTypeFormData,
        token: authToken,
      };
      console.log('PostCreation - Request headers:', header);

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        formData,
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        mehodType,
      );

      console.log('PostCreation - Sending API request message');
      runEngine.sendMessage(requestMessage.id, requestMessage);
      console.log('PostCreation - API request sent, waiting for response...');

      setTimeout(() => {
        if (this.state.isLoading) {
          console.log(
            'PostCreation - API call timeout! No response received after 10 seconds',
          );
        }
      }, 10000);
    } else {
      console.log('PostCreation - Validation failed, not making API call');
    }
  };

  checkPostponeValidations = () => {
    if (!this.state.undefinedDateSelected) {
      let error = false;

      this.setState({
        dateOfShowError: '',
        timeError: '',
      });

      if (isEmpty(this.state.dateOfShow)) {
        this.setState({ dateOfShowError: configJSON.emptyDate });
        error = true;
      }

      if (isEmpty(this.state.time)) {
        this.setState({ timeError: configJSON.emptyTime });
        error = true;
      }

      if (error) {
        return false;
      }
    }
    return true;
  };

  handlePostponeAPI = async () => {
    if (this.checkPostponeValidations()) {
      const authToken = await getStorageData('authToken');

      let definedData;
      if (!this.state.undefinedDateSelected && this.state.dateOfShow) {
        let formattedTime = this.state.time || '00:00:00';
        if (formattedTime && formattedTime.includes('h')) {
          formattedTime = formattedTime.replace('h', ':') + ':00';
        }

        const timeParts = formattedTime.split(':');
        const hours = timeParts[0] ? parseInt(timeParts[0], 10) : 0;
        const minutes = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

        let selectedMoment;
        if (this.state.selectedDate && this.state.selectedDate.isValid()) {
          selectedMoment = this.state.selectedDate.clone();
        } else if (this.state.dateOfShow) {
          const dateParts = this.state.dateOfShow.split('-');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0], 10) - 1;
            const day = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            selectedMoment = moment().year(year).month(month).date(day);
          } else {
            selectedMoment = moment(this.state.dateOfShow);
          }
        } else {
          selectedMoment = moment();
        }

        selectedMoment = selectedMoment
          .set('hour', hours)
          .set('minute', minutes)
          .set('second', 0)
          .set('millisecond', 0);

        const dateOfShowFormatted = selectedMoment.format(
          'YYYY-MM-DDTHH:mm:ss.SSSZ',
        );

        console.log(
          'PostCreation - handlePostponeAPI - dateOfShow:',
          this.state.dateOfShow,
        );
        console.log(
          'PostCreation - handlePostponeAPI - time:',
          this.state.time,
        );
        console.log(
          'PostCreation - handlePostponeAPI - formatted date:',
          dateOfShowFormatted,
        );
        console.log(
          'PostCreation - handlePostponeAPI - formatted time:',
          formattedTime,
        );

        definedData = {
          show: {
            date_of_the_show: dateOfShowFormatted,
            time: formattedTime,
          },
        };
      } else {
        console.log('PostCreation - handlePostponeAPI - Using fallback data');
        definedData = {
          show: {
            date_of_the_show: this.state.dateOfShow,
            time: this.state.time
              ? this.state.time.replace('h', ':') + ':00'
              : '00:00:00',
          },
        };
      }

      const undefinedData = {
        show: {
          date_of_the_show: '2999-12-31T00:00:00.000Z',
          time: '00:00:00',
        },
        undefined: 'true',
      };

      const dataToSend = this.state.undefinedDateSelected
        ? undefinedData
        : definedData;

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.postponeShowAPICallID = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        `${configJSON.postponeShowEndPoint}${this.state.eventId}`,
      );

      const header = {
        'Content-Type': configJSON.validationApiContentType,
        token: authToken,
      };

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
        configJSON.putMethodType,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  };

  handlePostDetailAPI = async () => {
    console.log('PostCreation - handlePostDetailAPI called');
    console.log('PostCreation - eventId:', this.state.eventId);
    console.log('PostCreation - currentUserId:', this.state.currentUserId);

    this.postDetailResponseReceived = false;
    this.postDetailShowErrorReceived = false;
    this.postDetailPostErrorReceived = false;
    this.setState({ isLoading: true });

    let accountId = this.state.currentUserId;
    if (!accountId) {
      accountId = await getStorageData('user_id');
      console.log('PostCreation - Fetched account_id from storage:', accountId);

      if (accountId) {
        this.setState({ currentUserId: accountId });
      }
    }

    const showEndpoint = accountId
      ? `${configJSON.createShowEndPoint}/${this.state.eventId}?account_id=${accountId}`
      : `${configJSON.createShowEndPoint}/${this.state.eventId}`;

    const postEndpoint = accountId
      ? `/bx_block_posts/posts/${this.state.eventId}?account_id=${accountId}`
      : `/bx_block_posts/posts/${this.state.eventId}`;

    console.log('PostCreation - Calling both endpoints:');
    console.log('PostCreation - Show endpoint:', showEndpoint);
    console.log('PostCreation - Post endpoint:', postEndpoint);

    const token = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };

    const showRequestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.postDetailShowApiCallID = showRequestMessage.messageId;
    showRequestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      showEndpoint,
    );
    showRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );
    showRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );
    runEngine.sendMessage(showRequestMessage.id, showRequestMessage);
    console.log(
      'PostCreation - Sent show API request with ID:',
      this.postDetailShowApiCallID,
    );

    const postRequestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.postDetailPostApiCallID = postRequestMessage.messageId;
    postRequestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      postEndpoint,
    );
    postRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );
    postRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );
    runEngine.sendMessage(postRequestMessage.id, postRequestMessage);
    console.log(
      'PostCreation - Sent post API request with ID:',
      this.postDetailPostApiCallID,
    );
  };

  handleCancelShowAPI = async () => {
    const authToken = await getStorageData('authToken');

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.cancelShowAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `cancel_show/${this.state.eventId}`,
    );

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.putMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleMarkAsSoldOut = async (eventId: string) => {
    console.log('=== handleMarkAsSoldOut called ===');
    console.log('eventId:', eventId);

    if (!eventId) {
      Alert.alert('Error', 'Event ID not found');
      return;
    }

    this.setState({ isLoading: true });
    const authToken = await getStorageData('authToken');
    console.log('authToken exists:', !!authToken);

    setTimeout(() => {
      if (this.state.isLoading) {
        console.log('=== API timeout - stopping loading ===');
        this.setState({ isLoading: false });
        Alert.alert('Error', 'Request timed out. Please try again.');
      }
    }, 15000);

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.markAsSoldoutAPICallID = requestMessage.messageId;
    console.log('markAsSoldoutAPICallID:', this.markAsSoldoutAPICallID);

    const endpoint = `/mark_as_sold_out/${eventId}`;
    console.log('API endpoint:', endpoint);

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.putMethodType,
    );

    console.log('Sending API request...');
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  openGoogleMaps = () => {
    const location = `${this.state.address} ${this.state.selectedCity} ${this.state.selectedState} ${this.state.zipCode}`;
    const locationUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      location,
    )}`;

    Linking.canOpenURL(locationUrl)
      .then(supported => {
        if (!supported) {
          alert('Google Maps is not installed on your device.');
        } else {
          return Linking.openURL(locationUrl);
        }
      })
      .catch(error => console.error('An error occurred', error));
  };

  showCameraAccessDisabledAlert = () => {
    Alert.alert('', 'Navigate to app settings to allow camera access.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };

  /**
   * iOS/Android image-picker may return `permission`, and Android also returns
   * `others` with a message when CAMERA is declared in the manifest but not granted.
   */
  isCameraAccessDeniedImagePickerResponse = (result: {
    errorCode?: string;
    errorMessage?: string;
  }) => {
    if (result.errorCode === 'permission') {
      return true;
    }
    if (
      result.errorCode === 'others' &&
      result.errorMessage &&
      /camera/i.test(result.errorMessage) &&
      /permission/i.test(result.errorMessage)
    ) {
      return true;
    }
    return false;
  };

  ensureCameraAccessGranted = async (): Promise<boolean> => {
    const cameraPerm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    try {
      let status = await check(cameraPerm);
      if (status === RESULTS.DENIED) {
        status = await request(cameraPerm);
      }
      return status === RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  /** iOS 13 and below: photo library access is required for UIImagePicker-based library. */
  ensureLegacyIOSPhotoLibraryAccess = async (): Promise<boolean> => {
    if (Platform.OS !== 'ios' || Number(Platform.Version) >= 14) {
      return true;
    }
    try {
      const perm = PERMISSIONS.IOS.PHOTO_LIBRARY;
      let status = await check(perm);
      if (status === RESULTS.DENIED) {
        status = await request(perm);
      }
      return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
    } catch {
      return false;
    }
  };

  handleGallery = async () => {
    this.setState({ showCameraGalleryPopup: false });

    const legacyLibraryOk = await this.ensureLegacyIOSPhotoLibraryAccess();
    if (!legacyLibraryOk) {
      this.showCameraAccessDisabledAlert();
      return;
    }

    try {
      const galleryData = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.7,
        presentationStyle: 'fullScreen',
      });

      if (galleryData?.didCancel) {
        return;
      }
      if (galleryData?.errorCode === 'permission') {
        this.showCameraAccessDisabledAlert();
        return;
      }

      if (galleryData?.assets && galleryData.assets.length > 0) {
        console.log(
          'ImageSelection - Gallery image selected:',
          galleryData.assets[0],
        );
        this.setState({ selectedImageData: galleryData.assets[0] });
      } else if (galleryData?.errorCode) {
        console.error(
          'Image library error:',
          galleryData.errorCode,
          galleryData.errorMessage,
        );
      } else {
        console.error(
          "No assets available or 'galleryData' structure is not as expected",
        );
      }
    } catch (error) {
      console.error('Error while accessing image library:', error);
      this.showCameraAccessDisabledAlert();
    }
  };

  handleCameraImage = async () => {
    this.setState({ showCameraGalleryPopup: false });

    const permitted = await this.ensureCameraAccessGranted();
    if (!permitted) {
      this.showCameraAccessDisabledAlert();
      return;
    }

    try {
      const cameraData = await launchCamera({
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.7,
      });

      if (cameraData.didCancel) {
        return;
      }
      if (this.isCameraAccessDeniedImagePickerResponse(cameraData)) {
        this.showCameraAccessDisabledAlert();
        return;
      }
      if (cameraData?.assets && cameraData.assets.length > 0) {
        console.log(
          'ImageSelection - Camera image selected:',
          cameraData.assets[0],
        );
        this.setState({ selectedImageData: cameraData.assets[0] });
      } else {
        this.setState({ isLoading: false });
        console.error(
          "No assets available or 'data' structure is not as expected",
        );
      }
    } catch (error) {
      console.error('Error while accessing user camera:', error);
      this.showCameraAccessDisabledAlert();
    }
  };
  handleOpenCameraPopup = () => {
    this.setState({ showCameraGalleryPopup: true });
  };
  handleCameraGalleryCancelPopup = () => {
    this.setState({ showCameraGalleryPopup: false });
  };

  changeTimeFormat(timeString: string) {
    const hours = timeString.substring(0, 2);
    const minutes = timeString.substring(3, 5);
    const convertedTime = hours + 'h' + minutes;
    return convertedTime;
  }

  changeDateFormat = (inputDate: string) => {
    const date = new Date(inputDate);
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
  };

  handleSelectedGalleryItem = (item: string) => {
    console.log('ImageSelection - Gallery item selected:', item);
    this.setState({
      selectedImageData: {
        uri: item,
      },
    });
  };

  getLineupListAPI = async () => {
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getLineupsAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.lineupEndPoint,
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

  handleSelectedLineUps = (lineUp: any) => {
    const { selectedLineUp } = this.state;
    const isDuplicate = selectedLineUp.some(
      item => item.first_name === lineUp.first_name,
    );
    if (!isDuplicate) {
      const updatedLineUp = [...selectedLineUp, lineUp];
      this.setState({
        selectedLineUp: updatedLineUp,
        lineupText: '',
        openLineUpPicker: false,
      });
    } else {
      this.setState({
        selectedLineUp,
        lineupText: '',
        openLineUpPicker: false,
      });
    }
  };

  showLineUpPicker = () => {
    this.setState({ openLineUpPicker: true });
  };

  hideLineUpPicker = () => {
    this.setState({ openLineUpPicker: false });
  };

  handleIosLineUpValueChange = (value: any) => {
    if (value !== '') {
      this.handleSelectedLineUps(value);
    } else {
      this.setState({ openLineUpPicker: false });
    }
  };

  handleRemoveLineup = (item: any) => {
    if (item.isDefaultBandLineup) return;
    const { selectedLineUp } = this.state;
    const updatedLineUp = selectedLineUp.filter(lineUp => lineUp !== item);
    this.setState({ selectedLineUp: updatedLineUp });
  };

  getTypeOfShowsListAPI = async () => {
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getTypeOfShowAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.typeOfShowEndPoint,
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

  getGenreListAPI = async (cat_id: string) => {
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getGenreAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.genreEndPoint + cat_id,
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

  handleSelectedTypeOfShow = async (typeOfShow: any) => {
    this.setState(
      {
        selectedTypeOfShows: [typeOfShow],
        openTyeOfShowsPicker: false,
        selectedGenres: [],
      },
      () => {
        this.getGenreListAPI(typeOfShow.id);
      },
    );
  };

  handleSelectedGenre = (genre: any) => {
    const { selectedGenres } = this.state;
    const combinedData = [...selectedGenres, genre];
    const seenIds = new Set();

    const uniqueGenres = combinedData.filter(genre => {
      if (genre.id && !seenIds.has(genre.id.toString())) {
        seenIds.add(genre.id);
        return true;
      }
      return false;
    });

    this.setState({ selectedGenres: uniqueGenres });
  };

  handleRemoveTypeOfShow = (item: any) => {
    const { selectedTypeOfShows } = this.state;
    const updatedTypeOfShow = selectedTypeOfShows.filter(
      typeOfShow => typeOfShow !== item,
    );
    this.setState({ selectedTypeOfShows: updatedTypeOfShow });
  };

  handleRemoveGenre = (item: any) => {
    const { selectedGenres } = this.state;
    const updatedGenre = selectedGenres.filter(genre => genre !== item);
    this.setState({ selectedGenres: updatedGenre });
  };

  likeDislikeEventAPI = async () => {
    const authToken = await getStorageData('authToken');
    const dataToSend = {
      like: {
        show_id: this.state.eventId,
      },
    };
    const postLikeDislikeEventMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.likeDislikeShowApiCallID = postLikeDislikeEventMsg.messageId;

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeDiskeEventEndPoint,
    );

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: authToken,
      }),
    );

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.PostAPiMethod,
    );

    runEngine.sendMessage(postLikeDislikeEventMsg.id, postLikeDislikeEventMsg);
  };

  showProfile = async (accountId: string) => {
    await setStorageData('profileIdToLoad', `${accountId}`);

    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'UserProfileBasicBlock2',
    );
    this.send(message);
  };

  eventCreatorCategoryAccountTypes = [
    'Record Label',
    'Record_Label',
    'Promoter',
    'Booking_Agent',
    'Agency',
  ];

  isEventCreatorCategoryAccountType = (
    accountType: string | undefined | null,
  ): boolean => {
    if (!accountType) return false;
    return this.eventCreatorCategoryAccountTypes.includes(accountType);
  };

  /** Opens the correct other-user profile screen for the event creator (PostDetails category row). */
  openEventCreatorProfileForCategoryRow = async (
    accountId: string,
    accountType?: string | null,
  ) => {
    await setStorageData('profileIdToLoad', `${accountId}`);
    const screen ='UserProfileBasicBlockArtist2';
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), screen);
    this.send(message);
  };

  handleLineupTxt = (text: string) => {
    this.setState({ lineupText: text.replace('  ', ' ') });
  };

  handleLineupSubmit = () => {
    if (this.state.lineupText.trim() !== '') {
      let bandData;
      this.state.lineUpList.forEach(item => {
        if (item.first_name === this.state.lineupText) {
          bandData = item;
        }
      });

      if (!bandData) {
        bandData = {
          id: '',
          first_name: this.state.lineupText,
          email: '',
          created_at: '',
          role_id: 9,
        };
      }
      this.handleSelectedLineUps(bandData);
    } else this.setState({ lineupText: '' });
  };

  handleRosterTxt = (text: string) => {
    this.setState({ rosterText: text.replace('  ', ' ') });
  };

  handleRosterSubmit = () => {
    if (this.state.rosterText.trim() !== '') {
      const rosterValue = this.state.rosterText.trim();

      const rosterExists = this.state.selectedRosters.some((roster: any) => {
        const rosterName =
          typeof roster === 'string'
            ? roster
            : roster?.name || roster?.title || String(roster);
        return rosterName === rosterValue;
      });
      if (!rosterExists) {
        this.setState({
          selectedRosters: [...this.state.selectedRosters, rosterValue],
          rosterText: '',
        });
      } else {
        this.setState({ rosterText: '' });
      }
    } else {
      this.setState({ rosterText: '' });
    }
  };

  handleRemoveRoster = (rosterToRemove: string) => {
    const updatedRosters = this.state.selectedRosters.filter((roster: any) => {
      const rosterName =
        typeof roster === 'string'
          ? roster
          : roster?.name || roster?.title || String(roster);
      return rosterName !== rosterToRemove;
    });
    this.setState({ selectedRosters: updatedRosters });
  };

  showStatePicker = () => {
    this.setState({ openStatePicker: true });
  };

  handleStateValueChange = (selectedState: string) => {
    this.setState({ openStatePicker: false, selectedState }, () =>
      this.getCitiesListAPI(selectedState),
    );
  };

  showCityPicker = () => {
    this.setState({ openCityPicker: true });
  };

  handleCityValueChange = (selectedCity: string) => {
    this.setState({ openCityPicker: false, selectedCity });
  };

  showTimePicker = () => {
    this.setState({ openTimePicker: true });
  };

  handleTimeValueChange = (time: string) => {
    this.setState({ openTimePicker: false, time });
  };

  showTypeOfShowPicker = () => {
    this.setState({ openTyeOfShowsPicker: true });
  };

  showGenrePicker = () => {
    this.setState({ openGenresPicker: true });
  };

  onZipcodeTextChange = (zipCode: string) => {
    if (zipCode && !/^\d+$/.test(zipCode)) {
      return;
    }
    this.setState({ zipCode });
  };

  handleTitleInput = (eventTitle: string) => {
    this.setState({ eventTitle });
  };

  handleLocationInput = (location: string) => {
    this.setState({ location });
  };

  handleAddressInput = (address: string) => {
    this.setState({ address });
  };

  handleDescriptionInput = (description: string) => {
    this.setState({ description });
  };

  handleIosTypeValueChange = (value: string) => {
    this.setState({ openTyeOfShowsPicker: false }, () => {
      if (this.state.selectedTypeOfShows.length < 1)
        this.handleSelectedTypeOfShow(value);
    });
  };

  handleIosGenreValueChange = (value: string) => {
    this.setState({ openGenresPicker: false }, () => {
      if (this.state.selectedGenres.length < 3) this.handleSelectedGenre(value);
    });
  };

  hideDateSelector = () => {
    this.setState({ showDateSelector: false });
  };

  hideEndDateSelector = () => {
    this.setState({ showEndDateSelector: false });
  };

  getEventFeatures = async () => {
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getEventFeaturesAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getShowFeaturesAPIEndPoint,
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

  handleAddCustomRule = () => {
    const text = (this.state.customRuleTxt || '').trim();
    if (!text) return;
    const currentIcons = this.state.rulesAndRegulationsIcons || [];
    const exists = currentIcons.some((item: any) => {
      const title = typeof item === 'string' ? item : (item?.title || item?.name || '');
      return (title || '').trim().toLowerCase() === text.toLowerCase();
    });
    if (exists) {
      this.setState({ customRuleTxt: '' });
      return;
    }
    const newId = `custom-${Date.now()}`;
    const newRule = { id: newId, title: text, isCustom: true };
    const currentSelected = this.state.selectedRulesAndRegulationsIds || [];
    this.setState({
      rulesAndRegulationsIcons: [...currentIcons, newRule],
      selectedRulesAndRegulationsIds: [...currentSelected, newId],
      customRuleTxt: '',
    });
  };

  handleToggleRulesRegulation = (id: string | number) => {
    const idKey = typeof id === 'number' ? id : id;
    this.setState(prev => {
      const current = prev.selectedRulesAndRegulationsIds || [];
      const idStr = String(idKey);
      const isSelected = current.some(c => String(c) === idStr);
      const next = isSelected
        ? current.filter(c => String(c) !== idStr)
        : [...current, idKey];
      return { selectedRulesAndRegulationsIds: next };
    });
  };

  hideStateModal = () => {
    this.setState({ openStatePicker: false });
  };

  hideCityModal = () => {
    this.setState({ openCityPicker: false });
  };

  hideTimeModal = () => {
    this.setState({ openTimePicker: false });
  };

  hideTypeOfShowModal = () => {
    this.setState({ openTyeOfShowsPicker: false });
  };

  hideGenreModal = () => {
    this.setState({ openGenresPicker: false });
  };

  showSoldOutPopup = () => {
    this.setState({ showSoldOutToast: true });
  };

  handleLikeListScreenNav = (id: any, type: any) => {
    const Navinfo = {
      eventID: id,
      type,
    };

    const LikeNavMessage: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    LikeNavMessage.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    LikeNavMessage.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'Likeapost2',
    );

    const raiseLikeNavMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseLikeNavMessage.addData(
      getName(MessageEnum.HelpCentreMessageData),
      Navinfo,
    );

    LikeNavMessage.addData(
      getName(MessageEnum.NavigationRaiseMessage),
      raiseLikeNavMessage,
    );

    this.send(LikeNavMessage);
  };
}
