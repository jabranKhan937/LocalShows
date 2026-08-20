import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';
import { CommonActions } from '@react-navigation/native';

// Customizable Area Start
import { URLSearchParams } from 'url';
import {
  Alert,
  DeviceEventEmitter,
  InteractionManager,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  getStorageData,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import _ from 'lodash';
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from '../../utilities/src/Colors';
const searchApiBaseURL = require('../../../framework/src/config.js').baseURL;
interface IPlaceRecord {
  key: string;
  name: string;
}

const monthNames = [
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

// Customizable Area End

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  route?: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: string;
  searchText: string;
  searchList: any;
  activeId: number;
  activeFirstName: string;
  activeLastName: string;
  activeUserName: string;
  activeEmail: string;
  activePhoneNumber: string;
  activeCountryCode: string;
  activeType: string;
  activeDeviceId: string;
  activeCreatedAt: string;
  isVisible: boolean;
  wholeStateSelected: boolean;
  isLoading: boolean;
  statesList: IPlaceRecord[];
  selectedState: string;
  stateClicked: boolean;
  citiesList: string[];
  selectedCity: string;
  cityClicked: boolean;
  stateError: string;
  cityError: string;
  eventList: any;
  selectedEventId: string;
  authToken: string | null;
  loginPopup: boolean;
  maxMiles: string;
  minRange: number;
  maxRange: number;
  selectRange: boolean;
  latitude: number | null;
  longitude: number | null;
  showComments: boolean;
  showRepliesFor: string[];
  userProfilePic: string;
  replying: boolean;
  commentText: string;
  commentsList: any[];
  userId: string;
  isEditing: boolean;
  commentId: string;
  commentWithReply: any;
  showReplies: boolean;
  replyId: string;
  commentsLoading: boolean;
  eventId: string;
  SelectedTab: string;
  LoadingUsers: boolean;
  UserList: any;
  NoUserFound: boolean;
  FollowUserId: string;
  unreadNotificationCount: number;
  newNotification: boolean;
  isDarkMode: boolean;
  searchFilter: string;
  categoriesList: any[];
  genreList: any[];
  pendingGenreCategoryIds: string[];
  showAllGenres: boolean;
  nearMeShows: any[];
  loadingNearMeShows: boolean;
  catalogShowResults: any[];
  loadingCatalogShows: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class SearchController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  searchApiCallId: any;
  getStatesAPICallId: any;
  getCitiesAPICallId: any;
  getSearchShowAPICallId: any;
  postLikeDislikeApiCallId: any;
  addEventToCalendarAPICallId: any;
  getCommentsAPICallID: any;
  addNewCommentAPICallID: any;
  getSearchUserListAPICallID: any;
  commentTextInput: any;
  createSearchFollowApiCallID: string = '';
  checkUnreadNotificationsApiCallId: any;
  getCategoriesAPICallId: any;
  getGenresAPICallId: any;
  getGenreArtworkAPICallId: any;
  searchAllShowsAPICallId: any;
  previewNearMeAPICallId: any;
  catalogShowsCache: any[] = [];
  genreArtworkByName: {[key: string]: string} = {};
  upcomingShowsByName: {[key: string]: number} = {};
  genreByName: {[key: string]: string} = {};
  venueArtworkByName: {[key: string]: string} = {};
  venueCityByName: {[key: string]: string} = {};
  venueProfileApiCallIds: {[key: string]: string} = {};
  venueProfileInFlight: {[key: string]: boolean} = {};
  indexedUpcomingShowIds: {[key: string]: boolean} = {};
  profileThemeListener: any;
  debouncedLoadNearMePreview: any;
  debouncedLiveSearch: any;
  isNearMePreviewInFlight: boolean = false;
  nearMePreviewTimer: ReturnType<typeof setTimeout> | null = null;
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: '',
      searchText: '',
      searchList: [],
      activeId: 0,
      activeFirstName: '',
      activeLastName: '',
      activeUserName: '',
      activeEmail: '',
      activePhoneNumber: '',
      activeCountryCode: '',
      activeType: '',
      activeDeviceId: '',
      activeCreatedAt: '',
      isVisible: false,
      wholeStateSelected: false,
      isLoading: false,
      statesList: [],
      selectedState: '',
      stateClicked: false,
      citiesList: [],
      selectedCity: '',
      cityClicked: false,
      stateError: '',
      cityError: '',
      eventList: {},
      selectedEventId: '',
      authToken: '',
      loginPopup: false,
      maxMiles: '100',
      minRange: 0,
      maxRange: 0,
      selectRange: true,
      latitude: 0,
      longitude: 0,
      showComments: false,
      showRepliesFor: [],
      userProfilePic: '',
      replying: false,
      commentText: '',
      commentsList: [],
      userId: '',
      isEditing: false,
      commentId: '',
      commentWithReply: {},
      showReplies: false,
      replyId: '',
      commentsLoading: false,
      eventId: '',
      SelectedTab: 'Shows',
      LoadingUsers: false,
      UserList: [],
      NoUserFound: false,
      FollowUserId: '',
      unreadNotificationCount: 0,
      newNotification: false,
      isDarkMode: true,
      searchFilter: 'All',
      categoriesList: [],
      genreList: [],
      pendingGenreCategoryIds: [],
      showAllGenres: false,
      nearMeShows: [],
      loadingNearMeShows: false,
      catalogShowResults: [],
      loadingCatalogShows: false,
      // Customizable Area End
    };
    // Customizable Area Start
    this.debouncedLoadNearMePreview = _.debounce(() => {
      this.loadNearMePreview();
    }, 500);
    this.debouncedLiveSearch = _.debounce(() => {
      this.runLiveSearch();
    }, 400);
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Load states on initial mount
    this.getUserAuthToken();
    this.getStatesListAPI();
    this.getUnreadNotificationsCount();
    this.loadSearchTheme();
    this.getCategoriesListAPI();
    this.getGenreArtworkFromShowsAPI();
    this.scheduleNearMePreview();

    // Check for navigation params immediately on mount
    const initialResponse =
      this.props.route?.params?.eventList ||
      this.props.navigation.state?.params?.eventList;

    if (initialResponse) {
      this.getUserProfilePic();
      this.setEventList(initialResponse);
    } else {
      this.setState({
        selectRange: true,
        selectedState: '',
        selectedCity: '',
        wholeStateSelected: false,
        searchText: '',
      });
      // Skip location permission check to avoid native module crash
      this.setState({ latitude: null, longitude: null });
    }

    if (this.isPlatformWeb() === false) {
      // React Navigation v4 listener
      this.props.navigation.addListener('willFocus', async () => {
        if (this.applyPendingGenreSearch()) {
          this.getUserAuthToken();
          this.getUnreadNotificationsCount();
          return;
        }
        let IsFromComment = await getStorageData('IsFromCommentSearch', true);
        if (IsFromComment !== null && IsFromComment) {
          this.setState({ showComments: true });
          removeStorageData('IsFromComment');
        }
        this.setState({
          stateError: '',
          cityError: '',
        });
        this.getUserAuthToken();
        this.getUnreadNotificationsCount();
        const response =
          this.props.route?.params?.eventList ||
          this.props.navigation.state?.params?.eventList;
        if (response) {
          this.getUserProfilePic();
          this.setEventList(response);
        } else {
          this.setState({
            selectRange: true,
            selectedState: '',
            selectedCity: '',
            wholeStateSelected: false,
            searchText: '',
          });
          // Skip location permission check to avoid native module crash
          this.setState({ latitude: null, longitude: null });
          this.getStatesListAPI();
        }
      });

      // React Navigation v5+ listener
      this.props.navigation.addListener('focus', async () => {
        if (this.applyPendingGenreSearch()) {
          this.getUserAuthToken();
          this.getUnreadNotificationsCount();
          return;
        }
        let IsFromComment = await getStorageData('IsFromCommentSearch', true);
        if (IsFromComment !== null && IsFromComment) {
          this.setState({ showComments: true });
          removeStorageData('IsFromComment');
        }
        this.setState({
          stateError: '',
          cityError: '',
        });
        this.getUserAuthToken();
        this.getUnreadNotificationsCount();
        const response =
          this.props.route?.params?.eventList ||
          this.props.navigation.state?.params?.eventList;
        if (response) {
          this.getUserProfilePic();
          this.setEventList(response);
        } else {
          this.setState({
            selectRange: true,
            selectedState: '',
            selectedCity: '',
            wholeStateSelected: false,
            searchText: '',
          });
          // Skip location permission check to avoid native module crash
          this.setState({ latitude: null, longitude: null });
          this.getStatesListAPI();
        }
      });
    }
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage),
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      runEngine.debugLog('TOKEN', token);
      this.setState({ token: token });
      if (this.isPlatformWeb() === true) this.getSearchList(token);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponseMessage(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start

  getUserAuthToken = async () => {
    const authToken = await getStorageData('authToken');
    this.setState({ authToken });
  };

  setEventList = (response: any) => {
    if (!response) {
      this.setState({ eventList: [] });
      return;
    }
    if (Array.isArray(response)) {
      this.setState({ eventList: response });
      return;
    }
    if (response.data) {
      this.setState({
        eventList: Array.isArray(response.data) ? response.data : [],
      });
    } else {
      this.setState({ eventList: [] });
    }
  };

  setSelectedTab = (tab: string) => {
    this.setState(
      {
        SelectedTab: tab,
        searchFilter:
          tab === 'People' ? 'People' : tab === 'Shows' ? 'Shows' : tab,
      },
      () => {
        this.runLiveSearch();
      },
    );
  };

  handleSearchFilter = (filter: string) => {
    if (filter === 'People' || filter === 'Bands' || filter === 'Venues') {
      this.setState(
        {
          searchFilter: filter,
          SelectedTab: 'People',
        },
        () => {
          this.runLiveSearch();
        },
      );
      return;
    }

    this.setState(
      {
        searchFilter: filter,
        SelectedTab: 'Shows',
      },
      () => {
        this.runLiveSearch();
      },
    );
  };

  handleRestAPIResponseMessage = (message: Message) => {
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

    if (apiRequestCallId === this.previewNearMeAPICallId) {
      this.handleNearMePreviewApi(responseJson);
      return;
    }

    if (apiRequestCallId === this.getSearchShowAPICallId) {
      const mode = this.state.selectRange ? 'shows_near_me' : 'shows_by_state';
      if (responseJson) {
        console.log('[Search] Search API success response', {
          mode,
          responseJson,
        });
      } else {
        console.warn('[Search] Search API error response', {
          mode,
          errorResponse,
        });
      }
    }

    if (apiRequestCallId && responseJson) {
      this.handleSuccessfulApiResponse(apiRequestCallId, responseJson);
    } else {
      this.parseApiErrorResponse(errorResponse);
    }
  };

  handleSuccessfulApiResponse = (apiRequestCallId: any, responseJson: any) => {
    if (apiRequestCallId === this.searchApiCallId) {
      this.handleSearchAPI(responseJson);
    } else if (apiRequestCallId === this.getStatesAPICallId) {
      this.handleGetStateApi(responseJson);
    } else if (apiRequestCallId === this.getCitiesAPICallId) {
      this.handleGetCityApi(responseJson);
    } else if (apiRequestCallId === this.getSearchShowAPICallId) {
      this.handleSearchApiResponse(responseJson);
    } else if (apiRequestCallId === this.postLikeDislikeApiCallId) {
      this.handleLikeDislikeEventAPIResponse(responseJson);
    } else if (apiRequestCallId === this.addEventToCalendarAPICallId) {
      this.handleAddEventToCalendarApiResponse(responseJson);
    } else if (apiRequestCallId === this.getCommentsAPICallID) {
      this.handleCommentsApiResponse(responseJson);
    } else if (apiRequestCallId === this.addNewCommentAPICallID) {
      this.handleCreateCommentApiResponse();
    } else if (apiRequestCallId === this.getSearchUserListAPICallID) {
      this.handleSearchUserAPIResponse(responseJson.data);
    } else if (apiRequestCallId === this.createSearchFollowApiCallID) {
      this.handleSearchFollowandUnfollowAPIResponse(responseJson);
    } else if (apiRequestCallId === this.checkUnreadNotificationsApiCallId) {
      this.handleUnreadNotificationsApiResponse(responseJson);
    } else if (apiRequestCallId === this.getCategoriesAPICallId) {
      this.handleGetCategoriesApi(responseJson);
    } else if (apiRequestCallId === this.getGenresAPICallId) {
      this.handleGetGenresApi(responseJson);
    } else if (apiRequestCallId === this.getGenreArtworkAPICallId) {
      this.handleGenreArtworkFromShowsApi(responseJson);
    } else if (apiRequestCallId === this.searchAllShowsAPICallId) {
      this.handleSearchAllShowsApi(responseJson);
    } else if (apiRequestCallId === this.previewNearMeAPICallId) {
      this.handleNearMePreviewApi(responseJson);
    } else if (this.venueProfileApiCallIds[apiRequestCallId]) {
      const venueId = this.venueProfileApiCallIds[apiRequestCallId];
      delete this.venueProfileApiCallIds[apiRequestCallId];
      this.handleVenueProfileApi(venueId, responseJson);
    }
  };

  handleCreateCommentApiResponse = () => {
    this.setState({ isEditing: false }, () => {
      this.getComments(this.state.eventId);
    });
  };

  handleCommentsApiResponse = (responseJson: any) => {
    this.setState({ commentsLoading: false, commentsList: [] });
    if (responseJson != null && !responseJson.errors) {
      if (responseJson.data.length) {
        responseJson.data.forEach((item: any) => {
          item.key = item.id;
          if (item.attributes.replies && item.attributes.replies.length > 0) {
            item.attributes.replies.forEach((reply: any) => {
              reply.key = reply.id;
            });
          }
          if (this.state.commentId === item.id) {
            this.setState({ commentWithReply: item });
          }
        });
        this.setState({ commentsList: responseJson.data });
      }
    } else this.parseApiErrorResponse(responseJson);
  };

  handleSearchApiResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      const selectedStateObject = this.state.statesList.find(
        item => item.key === this.state.selectedState,
      );
      const stateName = selectedStateObject ? selectedStateObject.name : '';
      const cityName = this.state.wholeStateSelected
        ? ''
        : this.state.selectedCity;
      this.props.navigation.navigate('SearchResult', {
        eventList: responseJson,
        searchAreaLabel: cityName || stateName || 'All areas',
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleAddEventToCalendarApiResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.showAlert('LocalShows_App', responseJson.message);
      this.handleEventUpdate();
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleEventUpdate = () => {
    const mockEventList = [...this.state.eventList];
    mockEventList.forEach(item => {
      if (item.id === this.state.selectedEventId) {
        item.attributes.added_in_calendar = true;
      }
    });
    this.setState({ eventList: mockEventList });
  };

  handleLikeDislikeEventAPIResponse = (responseJson: any) => {
    if (responseJson != null && !responseJson.errors) {
      this.updateEventList();
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  updateEventList = () => {
    const mockEventList = [...this.state.eventList];
    mockEventList.forEach(item => {
      if (item.id === this.state.selectedEventId) {
        item.attributes.like_by_me = !item.attributes.like_by_me;
        item.attributes.likes_count += item.attributes.like_by_me ? 1 : -1;
      }
    });
    this.setState({ eventList: mockEventList });
  };

  handleGetCityApi = (responseJson: any) => {
    if (!responseJson.errors) {
      const { city } = responseJson;
      this.setState({ citiesList: city });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGetStateApi = (responseJson: any) => {
    if (!responseJson.errors) {
      const { state } = responseJson;
      const states = Object.keys(state).map(item => {
        return {
          key: item,
          name: state[item],
        };
      });
      this.setState({ statesList: states });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleSearchAPI = (responseJson: any) => {
    if (!responseJson.errors) {
      this.setState({ searchList: responseJson.data }, () => {
        if (responseJson.data.length === 0) {
          this.showAlert('Alert', 'No Items', '');
        }
      });
    } else {
      this.showAlert('Alert', 'API Error', '');
    }
  };

  setSearchText = (text: string) => {
    this.setState({ searchText: text });
  };

  hideModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  setModal = (item: any) => {
    this.setState({
      activeId: item.id,
      activeFirstName: item.attributes.first_name,
      activeLastName: item.attributes.last_name,
      activeUserName: item.attributes.user_name,
      activeEmail: item.attributes.email,
      activePhoneNumber: item.attributes.phone_number,
      activeCountryCode: item.attributes.country_code,
      activeType: item.type,
      activeDeviceId: item.attributes.device_id,
      activeCreatedAt: item.attributes.created_at,
      isVisible: !this.state.isVisible,
    });
  };

  getSearchList = (token: string) => {
    const header = {
      'Content-Type': configJSON.searchApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const attrs = {
      query: this.state.searchText,
    };

    this.searchApiCallId = requestMessage.messageId;
    let urlParams = new URLSearchParams(attrs).toString();

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getSearchApiEndPoint}?${urlParams}`,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getStatesListAPI = () => {
    const header = {
      'Content-Type': configJSON.searchApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getStatesAPICallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getStatesEndpoint + 'US',
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  onSelectState = (selectedState: string) => {
    this.setState({ selectedState, selectedCity: '', citiesList: [] });
    this.getCitiesListAPI(selectedState);
  };

  handleStateBoxPress = (stateKey: string) => {
    if (!stateKey) {
      return;
    }
    this.setState(
      {
        selectRange: false,
        stateError: '',
        cityError: '',
        wholeStateSelected: false,
      },
      () => {
        this.onSelectState(stateKey);
      },
    );
  };

  handleBackToStateGrid = () => {
    this.setState({
      selectedState: '',
      selectedCity: '',
      citiesList: [],
      wholeStateSelected: false,
      stateError: '',
      cityError: '',
    });
  };

  handleCityBoxPress = (cityName: string) => {
    if (!cityName) {
      return;
    }
    this.setState(
      {
        selectRange: false,
        wholeStateSelected: false,
        selectedCity: cityName,
        cityError: '',
      },
      () => {
        this.getSearchShowAPI();
      },
    );
  };

  handleWholeStateBoxPress = () => {
    this.setState(
      {
        selectRange: false,
        wholeStateSelected: true,
        selectedCity: '',
        cityError: '',
      },
      () => {
        this.getSearchShowAPI();
      },
    );
  };

  getCitiesListAPI(state: string): boolean {
    if (!state) {
      return false;
    }

    const header = {
      'Content-Type': configJSON.searchApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCitiesAPICallId = requestMessage.messageId;

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
      configJSON.httpGetMethod,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  dynamicOpacity = (property: boolean | string) => {
    return property ? 1 : 0.5;
  };

  isStringNullOrBlank(strText: string) {
    return strText === null || strText.length === 0;
  }

  checkValidation = () => {
    let error = false;

    this.setState({
      stateError: '',
      cityError: '',
    });

    if (!this.state.selectRange) {
      if (this.isStringNullOrBlank(this.state.selectedState)) {
        this.setState({ stateError: configJSON.errorStateCannotBeBlank });
        error = true;
      }

      if (
        !this.state.wholeStateSelected &&
        this.isStringNullOrBlank(this.state.selectedCity)
      ) {
        this.setState({ cityError: configJSON.errorCityCannotBeBlank });
        error = true;
      }
    }
    if (error) {
      return false;
    }
    return true;
  };

  getSearchShowAPI = async () => {
    if (this.checkValidation()) {
      const userId = await getStorageData('user_id');
      const selectedStateObject = this.state.statesList.find(
        item => item.key === this.state.selectedState,
      );
      const state = selectedStateObject ? selectedStateObject.name : '';

      const city = this.state.wholeStateSelected ? '' : this.state.selectedCity;

      const header = {
        'Content-Type': configJSON.searchApiContentType,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.getSearchShowAPICallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.getSearchShowEndpoint +
          `${encodeURIComponent(state)}&city=${encodeURIComponent(
            city,
          )}&whole_state=${
            this.state.wholeStateSelected
          }&query=${encodeURIComponent(
            (this.state.searchText ?? '').trim(),
          )}&account_id=${userId ?? ''}`,
      );

      console.log('[Search] Search API request payload', {
        mode: 'shows_by_state',
        endpoint: configJSON.getSearchShowEndpoint,
        payload: {
          state,
          city,
          whole_state: this.state.wholeStateSelected,
          query: (this.state.searchText ?? '').trim(),
          account_id: userId ?? '',
        },
      });

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpGetMethod,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  };

  openGoogleMaps = (data: any) => {
    const location = `${data.address} ${data.city} ${data.state} ${data.zip_code}`;
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
      .catch(error => {});
  };

  formatMonth = (eventDate: string) => {
    const inputDate = new Date(eventDate);
    const formattedMonth = monthNames[inputDate.getUTCMonth()];
    return formattedMonth;
  };

  formatDate = (eventDate: string) => {
    const inputDate = new Date(eventDate);
    const formattedDate = inputDate.getUTCDate();
    return formattedDate;
  };

  likeDislikeEventAPICall = () => {
    const dataToSend = {
      like: {
        show_id: this.state.selectedEventId,
      },
    };
    const postLikeDislikeMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.postLikeDislikeApiCallId = postLikeDislikeMsg.messageId;

    postLikeDislikeMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeDiskeEventEndPoint,
    );

    postLikeDislikeMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      }),
    );

    postLikeDislikeMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    postLikeDislikeMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(postLikeDislikeMsg.id, postLikeDislikeMsg);
  };

  addEventToCalendarAPI = () => {
    const addEventToCalendarMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addEventToCalendarAPICallId = addEventToCalendarMsg.messageId;

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.addEventToCalendarEndPoint}${this.state.selectedEventId}`,
    );

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      }),
    );

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(addEventToCalendarMsg.id, addEventToCalendarMsg);
  };

  moveToLoginSignupScreen = (navigateTo: string) => {
    this.setState({ loginPopup: false }, () => {
      if (navigateTo === 'login')
        this.props.navigation.navigate('EmailAccountLoginBlock');
      else this.props.navigation.navigate('Rolesandpermissions');
    });
  };

  handleLikeOnPress = (itemId: string) => {
    if (this.state.authToken)
      this.setState({ selectedEventId: itemId }, () => {
        this.likeDislikeEventAPICall();
      });
    else this.setState({ loginPopup: true });
  };

  handleCalendarOnPress = (itemId: string) => {
    if (this.state.authToken)
      this.setState({ selectedEventId: itemId }, () => {
        this.addEventToCalendarAPI();
      });
    else this.setState({ loginPopup: true });
  };

  handleLikeCountOnPress = (itemId: string, itemType: any) => {
    if (this.state.authToken) {
      const info = {
        eventID: itemId,
        type: itemType,
      };
      this.handleNavigationSearch('Likeapost2', info);
    } else this.setState({ loginPopup: true });
  };

  handleLoginPopup = () => {
    this.setState({ loginPopup: false });
  };

  handleCommentsOnPress = () => {
    if (!this.state.authToken) this.setState({ loginPopup: true });
  };

  showStateClicked = () => {
    if (!this.state.selectRange) this.setState({ stateClicked: true });
  };

  showCityClicked = () => {
    if (!this.state.selectRange) this.setState({ cityClicked: true });
  };

  handleSelectedCityAndroid = (selectedCity: string) =>
    this.setState({ selectedCity });

  handleSearchText = (searchText: string) => {
    const cleanedText = searchText.replace('  ', ' ');
    this.setState({ searchText: cleanedText }, () => {
      if (this.debouncedLiveSearch) {
        this.debouncedLiveSearch();
      }
    });
  };

  runLiveSearch = async () => {
    try {
      if (this.isPeopleSearchTab()) {
        const token = await getStorageData('authToken');
        this.getSearchUserList(this.state.searchText, token);
        return;
      }
      if (this.isAllSearchTab() && this.hasSearchQuery()) {
        const token = await getStorageData('authToken');
        this.getSearchUserList(this.state.searchText, token);
        this.searchAllShows();
        return;
      }
      if (this.isShowsSearchTab() && this.hasSearchQuery()) {
        this.searchAllShows();
        return;
      }
      if (this.isShowsSearchTab() || this.isAllSearchTab()) {
        this.setState({ catalogShowResults: [], loadingCatalogShows: false });
      }
      if (this.state.selectedState && !this.state.selectRange) {
        if ((this.state.searchText || '').trim()) {
          this.getSearchShowAPI();
        }
        return;
      }
      this.isNearMePreviewInFlight = false;
      this.loadNearMePreview();
    } catch {
      return;
    }
  };

  clearSearchText = () => {
    this.handleSearchText('');
  };

  handleWholeStateSelection = () => {
    if (!this.state.selectRange)
      this.setState({ wholeStateSelected: !this.state.wholeStateSelected });
  };

  hideStateClicked = (selectedState: string) => {
    this.setState({ stateClicked: false });
    this.onSelectState(selectedState);
  };

  hideCityClicked = (selectedCity: string) => {
    this.setState({ cityClicked: false, selectedCity });
  };

  handleNotificationNavigation = () => {
    if (!this.state.authToken) {
      this.setState({ loginPopup: true });
    } else {
      const nestedNotificationRoute = {
        name: 'Home',
        params: {
          screen: 'HomeTab',
          params: {
            screen: 'Search',
            params: {
              screen: 'Notifications',
            },
          },
        },
      };

      if (
        this.props.navigation &&
        typeof this.props.navigation.dispatch === 'function'
      ) {
        this.props.navigation.dispatch(
          CommonActions.navigate(nestedNotificationRoute),
        );
      } else if (
        this.props.navigation &&
        typeof this.props.navigation.navigate === 'function'
      ) {
        this.props.navigation.navigate('Home', {
          screen: 'HomeTab',
          params: {
            screen: 'Search',
            params: {
              screen: 'Notifications',
            },
          },
        });
        this.props.navigation.navigate('Notifications');
      }
    }
  };

  handleBackNavigation = () => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Home');
    this.send(message);
  };

  handleMilesRange = (maxRng: number) => {
    if (maxRng.toString() !== this.state.maxMiles)
      this.setState(
        {
          maxMiles: maxRng.toString(),
        },
        () => {
          if (this.state.selectRange && this.debouncedLoadNearMePreview) {
            this.debouncedLoadNearMePreview();
          }
        },
      );
  };

  handleShowsNearMe = () => {
    this.setState({ selectRange: true }, () => {
      this.scheduleNearMePreview();
    });
  };

  handleShowsByState = () => {
    this.setState({ selectRange: false });
  };

  handleEventSearchAPICall = async () => {
    try {
      let token = await getStorageData('authToken');

      if (this.state.SelectedTab === 'People') {
        this.getSearchUserList(this.state.searchText, token);
      } else {
        if (this.state.selectRange) {
          const location = await this.ensureLocationForNearMeSearch();
          if (!location) {
            this.showAlert(
              'Location required',
              'Please enable location and try near me search again.',
            );
            return;
          }
          this.getShowsNearMeAPI(false, location);
        } else {
          this.getSearchShowAPI();
        }
      }
    } catch {
      this.showAlert(
        'Search',
        'Something went wrong while starting your search. Please try again.',
      );
    }
  };

  ensureLocationForNearMeSearch = async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    const hasValidLocation = this.isValidCoordinatePair(
      this.state.latitude,
      this.state.longitude,
    );

    if (hasValidLocation) {
      return {
        latitude: this.state.latitude as number,
        longitude: this.state.longitude as number,
      };
    }

    if (this.isPlatformWeb()) {
      return null;
    }

    const locationDisabled = await getStorageData('locationDisabled');
    if (locationDisabled === 'true') {
      return null;
    }

    try {
      if (Platform.OS === 'ios') {
        let permissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (permissionResult === RESULTS.DENIED) {
          permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }
        if (
          permissionResult !== RESULTS.GRANTED &&
          permissionResult !== RESULTS.LIMITED
        ) {
          return null;
        }
      } else if (Platform.OS === 'android') {
        const hasFinePermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        let granted = hasFinePermission
          ? PermissionsAndroid.RESULTS.GRANTED
          : await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return null;
        }
      } else {
        return null;
      }

      return await new Promise(resolve => {
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            this.setState({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
            resolve({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
          },
          () => {
            this.setState({ latitude: null, longitude: null });
            resolve(null);
          },
          {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 60000,
            showLocationDialog: Platform.OS === 'android',
            forceRequestLocation: Platform.OS === 'android',
            forceLocationManager: Platform.OS === 'android',
          },
        );
      });
    } catch (error) {
      return null;
    }
  };

  isValidCoordinatePair = (
    latitude: number | null,
    longitude: number | null,
  ) => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return false;
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return false;
    }
    // 0,0 is a common placeholder from initial state and should not be used.
    if (latitude === 0 && longitude === 0) {
      return false;
    }
    return true;
  };

  getShowsNearMeAPI = (
    isPreview = false,
    coords?: { latitude: number; longitude: number },
  ) => {
    const latitude = coords?.latitude ?? this.state.latitude;
    const longitude = coords?.longitude ?? this.state.longitude;
    if (!this.isValidCoordinatePair(latitude, longitude)) {
      if (isPreview) {
        this.isNearMePreviewInFlight = false;
        this.setState({ loadingNearMeShows: false });
      }
      return;
    }

    const header = {
      'Content-Type': configJSON.searchApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const q = (this.state.searchText ?? '').trim();
    const apiEndpoint =
      configJSON.searchByLatLong +
      `${latitude}&long=${longitude}&min_range=0&max_range=${
        this.state.maxMiles
      }&query=${encodeURIComponent(q)}`;

    console.log('[Search] Search API request payload', {
      mode: isPreview ? 'shows_near_me_preview' : 'shows_near_me',
      endpoint: configJSON.searchByLatLong,
      payload: {
        lat: latitude,
        long: longitude,
        min_range: 0,
        max_range: this.state.maxMiles,
        query: q,
      },
      fullEndpoint: apiEndpoint,
    });

    if (isPreview) {
      this.previewNearMeAPICallId = requestMessage.messageId;
    } else {
      this.getSearchShowAPICallId = requestMessage.messageId;
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      apiEndpoint,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  scheduleNearMePreview = () => {
    if (this.nearMePreviewTimer) {
      clearTimeout(this.nearMePreviewTimer);
      this.nearMePreviewTimer = null;
    }
    const start = () => {
      this.nearMePreviewTimer = setTimeout(() => {
        this.loadNearMePreview();
      }, 400);
    };
    if (Platform.OS === 'android') {
      InteractionManager.runAfterInteractions(start);
    } else {
      start();
    }
  };

  loadNearMePreview = async () => {
    if (this.isNearMePreviewInFlight) {
      return;
    }
    this.isNearMePreviewInFlight = true;
    this.setState({
      loadingNearMeShows:
        !Array.isArray(this.state.nearMeShows) ||
        this.state.nearMeShows.length === 0,
    });
    try {
      const location = await this.ensureLocationForNearMeSearch();
      if (!location) {
        this.isNearMePreviewInFlight = false;
        this.setState({ loadingNearMeShows: false });
        return;
      }
      this.getShowsNearMeAPI(true, location);
    } catch {
      this.isNearMePreviewInFlight = false;
      this.setState({ loadingNearMeShows: false });
    }
  };

  parseNearMeShows = (responseJson: any) => {
    if (!responseJson) {
      return [];
    }
    let shows: any[] = [];
    if (Array.isArray(responseJson)) {
      shows = responseJson;
    } else if (Array.isArray(responseJson.data)) {
      shows = responseJson.data;
    } else if (responseJson.data && typeof responseJson.data === 'object') {
      shows = Object.values(responseJson.data);
    }
    const seen = new Set<string>();
    return shows.filter(item => {
      if (!item || typeof item !== 'object') {
        return false;
      }
      const id = item.id ?? item.attributes?.id;
      if (id == null) {
        return true;
      }
      const key = String(id);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  handleNearMePreviewApi = (responseJson: any) => {
    this.isNearMePreviewInFlight = false;
    if (!responseJson) {
      this.setState({ loadingNearMeShows: false });
      return;
    }
    const shows = this.parseNearMeShows(responseJson);
    console.log('[Search] Near me preview response', { count: shows.length });
    this.setState(
      {
        nearMeShows: shows,
        loadingNearMeShows: false,
      },
      () => {
        this.applyGenreArtworkFromShows(shows);
      },
    );
  };

  normalizeMediaUrl = (value: any): string => {
    if (!value) {
      return '';
    }
    if (typeof value === 'object') {
      return this.normalizeMediaUrl(value.url || value.uri || value.image);
    }
    if (typeof value !== 'string') {
      return '';
    }
    let trimmed = value.trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
      return '';
    }
    if (trimmed.startsWith('//')) {
      trimmed = `https:${trimmed}`;
    } else if (trimmed.startsWith('/') || trimmed.startsWith('rails/')) {
      const origin = String(searchApiBaseURL || '').replace(/\/$/, '');
      trimmed = `${origin}/${trimmed.replace(/^\//, '')}`;
    }
    return trimmed.replace(/^(https?:\/\/[^/]+)\/\//, '$1/');
  };

  getNearMeShowImage = (item: any) => {
    const attrs = item?.attributes || item || {};
    return (
      this.normalizeMediaUrl(attrs.profile_image) ||
      this.normalizeMediaUrl(attrs.band_profile_image) ||
      this.normalizeMediaUrl(
        Array.isArray(attrs.images_and_videos)
          ? attrs.images_and_videos[0]
          : '',
      )
    );
  };

  formatNearMeWhen = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) {
      return '';
    }
    const eventDate = new Date(dateStr);
    if (Number.isNaN(eventDate.getTime())) {
      return '';
    }
    const now = new Date();
    const isSameDay =
      eventDate.getUTCFullYear() === now.getUTCFullYear() &&
      eventDate.getUTCMonth() === now.getUTCMonth() &&
      eventDate.getUTCDate() === now.getUTCDate();
    if (isSameDay) {
      return 'Tonight';
    }
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[eventDate.getUTCDay()] || '';
    return `${weekday}, ${this.formatMonth(dateStr)} ${this.formatDate(
      dateStr,
    )}`.trim();
  };

  handleNearMeShowPress = (item: any) => {
    if (!item?.id) {
      return;
    }
    const attrs = item.attributes || {};
    this.handleNavigationSearch('AllEventDetailScreen', {
      eventId: item.id,
      eventState: attrs.state || item.state || '',
    });
  };

  handleNavigationSearch = (screen: string, dataToPass: {}) => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), screen);
    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(
      getName(MessageEnum.HelpCentreMessageData),
      dataToPass,
    );
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(message);
  };

  checkLocationPermission = async () => {
    // Add a safety check to disable location if we've had issues before
    const locationDisabled = await getStorageData('locationDisabled');
    if (locationDisabled === 'true') {
      this.setState({ latitude: null, longitude: null });
      return;
    }

    try {
      if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        this.handlePermissionResult(result);
      } else if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        this.handlePermissionResult(result);
      }
    } catch (error) {
      // Continue without location if permission check fails
      this.setState({ latitude: null, longitude: null });
    }
  };

  handlePermissionResult = async (result: string) => {
    switch (result) {
      case RESULTS.DENIED:
        this.setState({ latitude: null, longitude: null });
        break;
      case RESULTS.GRANTED:
        // Add a small delay to prevent immediate native module calls
        setTimeout(() => {
          this.getLocation();
        }, 100);
        break;
      case RESULTS.BLOCKED:
        this.setState({ latitude: null, longitude: null });
        break;
      default:
        this.setState({ latitude: null, longitude: null });
        break;
    }
  };

  requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result === RESULTS.GRANTED) {
          this.getLocation();
        }
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getLocation();
        }
      }
    } catch (error) {
      this.setState({ latitude: null, longitude: null });
    }
  };

  getLocation = () => {
    // Set a timeout to prevent hanging if the native module is broken
    const locationTimeout = setTimeout(() => {
      this.setState({ latitude: null, longitude: null });
    }, 5000); // 5 second timeout

    try {
      // Check if Geolocation is available before calling
      if (
        !Geolocation ||
        typeof Geolocation.getCurrentPosition !== 'function'
      ) {
        clearTimeout(locationTimeout);
        this.setState({ latitude: null, longitude: null });
        return;
      }

      Geolocation.getCurrentPosition(
        ({ coords }) => {
          clearTimeout(locationTimeout);
          this.setState({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        },
        error => {
          clearTimeout(locationTimeout);
          try {
            const code = error?.code;
            const msg = error?.message;
            const messageStr = typeof msg === 'string' ? msg : '';
            if (
              code === 1 ||
              code === '1' ||
              messageStr.includes('RNFusedLocation') ||
              messageStr.includes('FusedLocationProviderClient')
            ) {
              setStorageData('locationDisabled', 'true');
            }
          } catch {
            // ignore — never let the error callback take down the app (Android Hermes)
          }
          this.setState({ latitude: null, longitude: null });
        },
        {
          enableHighAccuracy: false, // Reduce accuracy to avoid native module issues
          timeout: 3000, // Reduce timeout to 3 seconds
          maximumAge: 60000, // Increase cache time to reduce calls
          showLocationDialog: false, // Prevent automatic location dialog
          forceRequestLocation: false, // Don't force location request
        },
      );
    } catch (error) {
      clearTimeout(locationTimeout);

      // If this is a native module error, disable location services permanently
      if (
        error &&
        (error.toString().includes('RNFusedLocation') ||
          error.toString().includes('FusedLocationProviderClient'))
      ) {
        setStorageData('locationDisabled', 'true');
      }

      this.setState({ latitude: null, longitude: null });
    }
  };

  handleShowCommentClicked = (eventId: string) => {
    if (this.state.authToken) {
      this.setState({ showComments: true, eventId, commentText: '' });
      this.getComments(eventId);
    } else {
      this.setState({ loginPopup: true });
    }
  };

  getComments = (eventId: string) => {
    this.setState({ commentsLoading: true });
    const getCommentsMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCommentsAPICallID = getCommentsMsg.messageId;

    getCommentsMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getCommentsEndpoint}?commentable_id=${eventId}&commentable_type=Show`,
    );

    getCommentsMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      }),
    );

    getCommentsMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );

    runEngine.sendMessage(getCommentsMsg.id, getCommentsMsg);
  };

  addNewComment = () => {
    this.setState({
      commentsLoading: true,
      commentText: '',
      showRepliesFor: [],
    });

    const addNewCommentMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addNewCommentAPICallID = addNewCommentMsg.messageId;
    const header = {
      'Content-Type': configJSON.searchApiContentType,
      token: this.state.authToken,
    };

    let endpoint;
    if (this.state.isEditing) {
      if (this.state.showReplies) {
        endpoint = `${configJSON.createCommentEndpoint}/${this.state.replyId}`;
      } else {
        endpoint = `${configJSON.createCommentEndpoint}/${this.state.commentId}`;
      }
    } else {
      endpoint = configJSON.createCommentEndpoint;
    }
    const methodType = this.state.isEditing
      ? `${configJSON.putApiMethodType}`
      : configJSON.postApiMethodType;

    const newComment = {
      comment: {
        commentable_id: this.state.eventId,
        commentable_type: 'Show',
        comment: this.state.commentText.trim(),
      },
    };

    addNewCommentMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    addNewCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    addNewCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    addNewCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(newComment),
    );

    runEngine.sendMessage(addNewCommentMsg.id, addNewCommentMsg);
  };

  handleReplyClick = (commentId: string) => {
    this.setState({ replying: true, commentId });
    this.commentTextInput.focus();
  };

  handleCommentSubmitEditing = () => {
    if (this.state.commentText.trim() !== '') {
      this.hideKeyboard();
      if (this.state.replying || this.state.showReplies) {
        this.handleReplyToComment();
      } else {
        this.addNewComment();
      }
    }
  };

  handleReplyToComment = () => {
    this.setState({
      commentsLoading: true,
      commentText: '',
      showRepliesFor: [],
    });

    const sendReplyRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addNewCommentAPICallID = sendReplyRequestMsg.messageId;

    const replyData = {
      comment: {
        commentable_id: this.state.commentId,
        commentable_type: 'BxBlockComments::Comment',
        comment: this.state.commentText.trim(),
      },
    };

    let endpoint;
    if (this.state.isEditing) {
      endpoint = `${configJSON.createCommentEndpoint}/${this.state.replyId}`;
    } else {
      endpoint = configJSON.createCommentEndpoint;
    }

    const methodType = this.state.isEditing
      ? `${configJSON.putApiMethodType}`
      : configJSON.postApiMethodType;

    sendReplyRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    sendReplyRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      }),
    );

    sendReplyRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    sendReplyRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(replyData),
    );

    runEngine.sendMessage(sendReplyRequestMsg.id, sendReplyRequestMsg);
  };

  handleLikeAComment = (comment_id: string) => {
    const likeACommentRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addNewCommentAPICallID = likeACommentRequestMsg.messageId;

    const dataToSend = {
      like: {
        comment_id,
      },
    };

    likeACommentRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeCommentEndpoint,
    );

    likeACommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      }),
    );

    likeACommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    likeACommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(likeACommentRequestMsg.id, likeACommentRequestMsg);
  };

  closeCommentRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  handleDeleteCommentAPI = (commentID: string) => {
    this.setState({
      commentsLoading: true,
      commentText: '',
      showRepliesFor: [],
    });

    const deleteCommentMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addNewCommentAPICallID = deleteCommentMsg.messageId;

    const endpoint = `${configJSON.createCommentEndpoint}/${commentID}`;

    deleteCommentMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    deleteCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      }),
    );

    deleteCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteApiMethodType,
    );

    runEngine.sendMessage(deleteCommentMsg.id, deleteCommentMsg);
  };

  timeAgo(timestamp: string): string {
    const now: Date = new Date();
    const date: Date = new Date(timestamp);
    const elapsed: number = now.getTime() - date.getTime();

    const second: number = Math.floor(elapsed / 1000);
    const minute: number = Math.floor(second / 60);
    const hour: number = Math.floor(minute / 60);
    const day: number = Math.floor(hour / 24);

    if (day > 0) {
      return `${day}d`;
    } else if (hour > 0) {
      return `${hour}h`;
    } else if (minute > 0) {
      return `${minute}m`;
    } else {
      return `${second}s`;
    }
  }

  handleEmojiSelected = (emoji: string) => {
    this.setState({ commentText: this.state.commentText + emoji });
  };

  getUserProfilePic = async () => {
    const userId = await getStorageData('user_id');
    const userProfilePic = await getStorageData('user_profile_pic');
    this.setState({ userId, userProfilePic });
  };

  handleProfileNavigation = async (accountId: string, accountType: string) => {
    if (this.state.authToken) {
      this.setState({ showComments: false, showReplies: false });
      await setStorageData('profileIdToLoad', `${accountId}`);
      await setStorageData('IsFromCommentSearch', JSON.stringify(true));
      const screenToNav =
        accountType === 'Band' ||
        accountType === 'Artist' ||
        accountType === 'Venue' ||
        accountType === 'Club' ||
        accountType === 'Theater' ||
        accountType === 'Museum' ||
        accountType === 'Record_Label' ||
        accountType === 'Promoter' ||
        accountType === 'Bar' ||
        accountType === 'Gallery' ||
        accountType === 'Casino' ||
        accountType === 'Booking_Agent' ||
        accountType === 'Agency' ||
        accountType === 'Record_Store'
          ? 'UserProfileBasicBlockArtist3'
          : 'UserProfileBasicBlock3';
      if (this.state.userId === accountId.toString())
        this.props.navigation.navigate('Profile', {
          isOtherUser: false,
        });
      else
        this.props.navigation.push(screenToNav, {
          isOtherUser: true,
        });
    } else {
      this.setState({ loginPopup: true });
    }
  };

  handleEditCommentSwipe = (data: any, rowMap: any) => {
    this.setState(
      {
        commentText: data.item.attributes.comment,
        isEditing: true,
        commentId: data.item.id,
      },
      () => {
        this.commentTextInput.focus();
        this.closeCommentRow(rowMap, data.item.key);
      },
    );
  };

  handleViewMoreReplies = (item: any) => {
    this.setState({
      replying: true,
      commentId: item.id,
      commentWithReply: item,
      showReplies: true,
      showComments: false,
      commentText: '',
    });
  };

  handleEditReplySwipe = (data: any, rowMap: any) => {
    this.setState(
      {
        commentText: data.item.reply,
        isEditing: true,
        replyId: data.item.id,
        replying: false,
      },
      () => {
        this.commentTextInput.focus();
        this.closeCommentRow(rowMap, data.item.key);
      },
    );
  };

  handleReplyBackModal = () => {
    this.setState({
      showReplies: false,
      replying: false,
      commentId: '',
      showComments: true,
      commentText: '',
    });
  };

  handleReplyCloseModal = () => {
    this.setState({
      showComments: true,
      showRepliesFor: [],
      showReplies: false,
    });
  };

  handleCommentTxtChange = (commentText: string) => {
    this.setState({ commentText });
  };

  handleCloseCommentModal = () => {
    this.setState({ showComments: false, showRepliesFor: [] });
  };

  redirectToBandProfile = async (accountId: number) => {
    if (this.state.authToken) {
      await setStorageData('profileIdToLoad', `${accountId}`);
      if (this.state.userId === accountId.toString()) {
        this.props.navigation.navigate('Profile', {
          isOtherUser: false,
        });
      } else {
        this.props.navigation.push('UserProfileBasicBlockArtist3', {
          isOtherUser: true,
        });
      }
    } else {
      this.setState({ loginPopup: true });
    }
  };

  hideModalState = () => {
    this.setState({ stateClicked: false });
  };

  hideModalCity = () => {
    this.setState({ cityClicked: false });
  };

  getSearchUserList = async (query: string, token: any) => {
    if (!query.trim()) {
      this.setState({
        UserList: [],
        LoadingUsers: false,
      });
      return;
    }

    this.setState({ LoadingUsers: true, UserList: [] });

    const header = token
      ? {
          'Content-Type': configJSON.searchApiContentType,
          token: token,
        }
      : {
          'Content-Type': configJSON.searchApiContentType,
        };

    const endpoint = token
      ? `/bx_block_search/users?query=${query}`
      : `/bx_block_search/users_search?query=${query}`;

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getSearchUserListAPICallID = requestMessage.messageId;

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
      configJSON.httpGetMethod,
    );

    console.log(
      '[Search People] Rest API:',
      configJSON.httpGetMethod,
      endpoint,
      token ? '(with auth token)' : '(guest / no token)',
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleSearchFollowandUnfollowAPIResponse = (responseJSONData: any) => {
    let updatedList = this.state.UserList.map((item: any, index: any) => {
      if (item.id === this.state.FollowUserId) {
        return {
          ...item,
          attributes: {
            ...item.attributes,
            is_following: !item.attributes.is_following,
          },
        };
      }
      return item;
    });
    this.setState({ UserList: updatedList, isLoading: false });
  };

  handleSearchUserAPIResponse = (data: any) => {
    if (!data || data === null) {
      this.setState({ NoUserFound: true, LoadingUsers: false });
      return;
    }
    if (data.length <= 0) {
      this.setState({ NoUserFound: true, LoadingUsers: false });
      return;
    }

    this.venueProfileInFlight = {};
    this.setState(
      {
        NoUserFound: false,
        UserList: data,
        LoadingUsers: false,
      },
      () => {
        this.enrichVenueSearchResults();
      },
    );
  };

  followAndUnfollowUserAPICall = async (
    accountIdFollowUser: string,
    isFollowSearch: boolean,
  ) => {
    let authToken = await getStorageData('authToken');
    if (authToken === null) {
      this.setState({ loginPopup: true });
    } else {
      this.setState({ FollowUserId: accountIdFollowUser, isLoading: true });
      const apiHeader = {
        'Content-Type': configJSON.searchApiContentType,
        token: this.state.authToken,
      };

      const apiRequestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.createSearchFollowApiCallID = apiRequestMessage.messageId;

      const dataToSend = {
        data: {
          attributes: {
            account_id: parseInt(accountIdFollowUser),
          },
        },
      };
      const endpoint =
        isFollowSearch === true
          ? `${configJSON.createFollowApiEndpoint}/${accountIdFollowUser}`
          : configJSON.createFollowApiEndpoint;
      const methodType =
        isFollowSearch === true
          ? configJSON.deleteApiMethodType
          : configJSON.postApiMethodType;

      apiRequestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      apiRequestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(apiHeader),
      );

      apiRequestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        methodType,
      );

      if (isFollowSearch === false)
        apiRequestMessage.addData(
          getName(MessageEnum.RestAPIRequestBodyMessage),
          JSON.stringify(dataToSend),
        );

      runEngine.sendMessage(apiRequestMessage.id, apiRequestMessage);
    }
  };

  renderProfileUserSearch = async (accountId: string, accountType: string) => {
    console.log('this is account type', accountType, accountId);

    // return;

    let authToken = await getStorageData('authToken');
    if (authToken === null) {
      this.setState({ loginPopup: true });
    } else {
      await setStorageData('profileIdToLoad', `${accountId}`);
      const screen =
        accountType === 'Band' ||
        accountType === 'Artist' ||
        accountType === 'Venue' ||
        accountType === 'Club' ||
        accountType === 'Theater' ||
        accountType === 'Museum' ||
        accountType === 'Record_Label' ||
        accountType === 'Promoter' ||
        accountType === 'Bar' ||
        accountType === 'Gallery' ||
        accountType === 'Casino' ||
        accountType === 'Booking_Agent' ||
        accountType === 'Agency' ||
        accountType === 'Record_Store'
          ? 'UserProfileBasicBlockArtist3'
          : 'UserProfileBasicBlock3';
      if (this.state.userId === accountId.toString()) {
        this.props.navigation.navigate('Profile', {
          isOtherUser: false,
        });
      } else {
        this.props.navigation.push(screen, {
          isOtherUser: true,
        });
      }
    }
  };

  getOpacity = () => {
    if (this.state.SelectedTab === 'People') {
      if (this.state.searchText === '') {
        return 0.5;
      }
      return 1;
    }
    return 1;
  };

  getName = (first_name: any, last_name: any) => {
    let name = '';
    if (first_name !== null) {
      name = first_name;
    }
    if (last_name !== null) {
      if (name === '') {
        name = last_name;
      } else {
        name = name + ' ' + last_name;
      }
    }
    return name;
  };

  formatAccountTypeLabel = (accountType: any) => {
    if (typeof accountType !== 'string' || !accountType.trim()) {
      return '';
    }
    return accountType.replace(/_/g, ' ').trim();
  };

  getUserAvatarUrl = (item: any) => {
    const attrs = item?.attributes || item || {};
    return (
      this.normalizeMediaUrl(attrs.photo) ||
      this.normalizeMediaUrl(attrs.profile_image_url) ||
      this.normalizeMediaUrl(attrs.profile_image) ||
      this.normalizeMediaUrl(attrs.band_profile_image) ||
      this.normalizeMediaUrl(attrs.cover_photo) ||
      this.normalizeMediaUrl(attrs.cover_image)
    );
  };

  getGenreLabelFromValue = (value: any): string => {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        const label = this.getGenreLabelFromValue(value[index]);
        if (label) {
          return label;
        }
      }
      return '';
    }
    if (typeof value === 'object') {
      return this.getGenreLabelFromValue(
        value.name ||
          value.title ||
          value.genre ||
          value.attributes?.name ||
          value.sub_category?.name,
      );
    }
    return '';
  };

  getUserGenreLabel = (attrs: any) => {
    return (
      this.getGenreLabelFromValue(attrs?.genre) ||
      this.getGenreLabelFromValue(attrs?.user_sub_categories) ||
      this.getGenreLabelFromValue(attrs?.sub_categories) ||
      this.getGenreLabelFromValue(attrs?.categories)
    );
  };

  indexUpcomingShow = (show: any) => {
    const showId = String(show?.id ?? show?.attributes?.id ?? '');
    if (showId && this.indexedUpcomingShowIds[showId]) {
      return;
    }
    if (showId) {
      this.indexedUpcomingShowIds[showId] = true;
    }
    const attrs = show?.attributes || show || {};
    const names: string[] = [];
    if (typeof attrs.band_name === 'string') {
      names.push(attrs.band_name);
    }
    if (Array.isArray(attrs.line_ups)) {
      attrs.line_ups.forEach((name: any) => {
        if (typeof name === 'string') {
          names.push(name);
        }
      });
    }
    const primaryGenre = this.getShowGenreNames(show)[0] || '';
    names.forEach(name => {
      const key = name.trim().toLowerCase();
      if (key) {
        this.upcomingShowsByName[key] =
          (this.upcomingShowsByName[key] || 0) + 1;
        if (primaryGenre && !this.genreByName[key]) {
          this.genreByName[key] = primaryGenre;
        }
      }
    });
    this.indexVenueFromShow(show);
  };

  indexVenueFromShow = (show: any) => {
    const attrs = show?.attributes || show || {};
    const venueNames = [attrs.location, attrs.venue].filter(
      (name: any) => typeof name === 'string' && name.trim(),
    );
    if (venueNames.length === 0) {
      return;
    }
    const image = this.getNearMeShowImage(show);
    const city =
      (typeof attrs.city === 'string' && attrs.city.trim()) || '';
    venueNames.forEach((name: string) => {
      const key = name.trim().toLowerCase();
      if (!key) {
        return;
      }
      if (image && !this.venueArtworkByName[key]) {
        this.venueArtworkByName[key] = image;
      }
      if (city && !this.venueCityByName[key]) {
        this.venueCityByName[key] = city;
      }
    });
  };

  getUserSubtitle = (item: any) => {
    const attrs = item?.attributes || {};
    const displayName = this.getName(attrs.first_name, attrs.last_name)
      .trim()
      .toLowerCase();
    const genre =
      this.getUserGenreLabel(attrs) ||
      (displayName && this.genreByName[displayName]) ||
      '';
    const typeLabel = this.formatAccountTypeLabel(attrs.account_type);
    const genericTypes = [
      'band',
      'artist',
      'venue',
      'club',
      'theater',
      'museum',
      'bar',
      'gallery',
      'casino',
      'fan',
      'user',
    ];
    const roleLabel =
      typeLabel && !genericTypes.includes(typeLabel.toLowerCase())
        ? typeLabel
        : '';
    const upcoming =
      (displayName && this.upcomingShowsByName[displayName]) || 0;
    const parts = [];
    if (genre) {
      parts.push(genre);
    } else if (roleLabel) {
      parts.push(roleLabel);
    }
    if (upcoming > 0) {
      parts.push(`${upcoming} upcoming`);
    }
    return parts.join(' · ');
  };

  getPeopleSectionTitle = () => {
    const filter = this.state.searchFilter;
    if (filter === 'Bands') {
      return 'BANDS & ARTISTS';
    }
    if (filter === 'Venues') {
      return 'VENUES';
    }
    return 'PEOPLE';
  };

  getUnreadNotificationsCount = async () => {
    let token = this.state.authToken;
    if (!token) {
      token = await getStorageData('authToken');
    }
    if (!token) {
      return;
    }

    const header = {
      'Content-Type': 'application/json',
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.checkUnreadNotificationsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.checkUnreadNotificationsEndpoint,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleUnreadNotificationsApiResponse = (responseJson: any) => {
    if (!responseJson) {
      return;
    }

    // Check for errors first
    if (responseJson.errors) {
      this.setState({
        unreadNotificationCount: 0,
        newNotification: false,
      });
      return;
    }

    // Handle different response structures
    let unreadCount = 0;
    let hasUnread = false;

    // Check if data is directly in response (Swagger format)
    if (responseJson.unread_count !== undefined) {
      unreadCount = responseJson.unread_count;
      hasUnread = !!responseJson.has_unread_notifications;
    }
    // Check if wrapped in data object
    else if (
      responseJson.data &&
      typeof responseJson.data === 'object' &&
      !Array.isArray(responseJson.data)
    ) {
      unreadCount = responseJson.data.unread_count || 0;
      hasUnread = !!responseJson.data.has_unread_notifications;
    }
    // Check if wrapped in data array (first element)
    else if (Array.isArray(responseJson.data) && responseJson.data.length > 0) {
      const firstItem = responseJson.data[0];
      unreadCount = firstItem.unread_count || 0;
      hasUnread = !!firstItem.has_unread_notifications;
    }
    // Check if it's an empty data array
    else if (
      Array.isArray(responseJson.data) &&
      responseJson.data.length === 0
    ) {
      unreadCount = 0;
      hasUnread = false;
    } else {
      unreadCount = 0;
      hasUnread = false;
    }

    // Ensure unreadCount is a number
    const count =
      typeof unreadCount === 'number'
        ? unreadCount
        : parseInt(unreadCount, 10) || 0;

    this.setState({
      unreadNotificationCount: count,
      newNotification: hasUnread && count > 0,
    });
  };

  loadSearchTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== 'false' });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  getSearchTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  isPeopleSearchTab = () => {
    return (
      this.state.SelectedTab === 'People' ||
      this.state.searchFilter === 'People' ||
      this.state.searchFilter === 'Bands' ||
      this.state.searchFilter === 'Venues'
    );
  };

  hasSearchQuery = () => {
    return Boolean((this.state.searchText || '').trim());
  };

  isShowsSearchTab = () => {
    return this.state.searchFilter === 'Shows';
  };

  isAllSearchTab = () => {
    return this.state.searchFilter === 'All';
  };

  getBandAccountTypes = () => [
    'Band',
    'Artist',
    'Record_Label',
    'Promoter',
    'Booking_Agent',
    'Agency',
    'Record_Store',
  ];

  getVenueAccountTypes = () => [
    'Venue',
    'Club',
    'Theater',
    'Museum',
    'Bar',
    'Gallery',
    'Casino',
  ];

  matchesAccountType = (accountType: any, types: string[]) => {
    if (typeof accountType !== 'string' || !accountType.trim()) {
      return false;
    }
    return types.some(
      typeName => typeName.toLowerCase() === accountType.toLowerCase(),
    );
  };

  isBandAccountType = (accountType: any) =>
    this.matchesAccountType(accountType, this.getBandAccountTypes());

  isVenueAccountType = (accountType: any) =>
    this.matchesAccountType(accountType, this.getVenueAccountTypes());

  isPeopleAccountType = (accountType: any) =>
    !this.isBandAccountType(accountType) &&
    !this.isVenueAccountType(accountType);

  getUsersForGroup = (group: 'bands' | 'venues' | 'people') => {
    const list = Array.isArray(this.state.UserList) ? this.state.UserList : [];
    return list.filter((item: any) => {
      const accountType = item?.attributes?.account_type;
      if (group === 'bands') {
        return this.isBandAccountType(accountType);
      }
      if (group === 'venues') {
        return this.isVenueAccountType(accountType);
      }
      return this.isPeopleAccountType(accountType);
    });
  };

  formatCapacityLabel = (raw: any) => {
    if (raw === null || raw === undefined || raw === '') {
      return '';
    }
    const numeric = Number(raw);
    if (!Number.isNaN(numeric) && numeric > 0) {
      return `Cap. ${Math.round(numeric).toLocaleString('en-US')}`;
    }
    const text = String(raw).trim();
    return text ? `Cap. ${text}` : '';
  };

  getUserCityStateLabel = (attrs: any) => {
    const city =
      (typeof attrs?.city === 'string' && attrs.city.trim()) ||
      (typeof attrs?.location === 'string' && attrs.location.trim()) ||
      '';
    const state =
      (typeof attrs?.state === 'string' && attrs.state.trim()) || '';
    if (city && state) {
      return `${city}, ${state}`;
    }
    return city || state;
  };

  getVenueDisplayName = (item: any) => {
    const attrs = item?.attributes || {};
    return this.getName(attrs.first_name, attrs.last_name).trim();
  };

  getVenueImageUrl = (item: any) => {
    const fromProfile = this.getUserAvatarUrl(item);
    if (fromProfile) {
      return fromProfile;
    }
    const match = this.findCatalogVenueMatch(this.getVenueDisplayName(item));
    return match?.image || '';
  };

  getVenueSubtitle = (item: any) => {
    const attrs = item?.attributes || {};
    const match = this.findCatalogVenueMatch(this.getVenueDisplayName(item));
    const city =
      (typeof attrs.city === 'string' && attrs.city.trim()) ||
      (typeof attrs.location === 'string' && attrs.location.trim()) ||
      match?.city ||
      '';
    const state =
      (typeof attrs.state === 'string' && attrs.state.trim()) ||
      match?.state ||
      '';
    let place = '';
    if (city && state && city.toLowerCase() !== state.toLowerCase()) {
      place = `${city}, ${state}`;
    } else {
      place = city || state;
    }
    if (!place && typeof attrs.address === 'string' && attrs.address.trim()) {
      place = attrs.address.trim();
    }
    const capacity = this.formatCapacityLabel(
      attrs.maximum_people_capacity ?? attrs.capacity ?? attrs.max_capacity,
    );
    return [place, capacity].filter(Boolean).join(' · ');
  };

  findCatalogVenueMatch = (venueName: string) => {
    const needle = String(venueName || '').trim().toLowerCase();
    if (!needle) {
      return null;
    }
    if (this.venueArtworkByName[needle] || this.venueCityByName[needle]) {
      return {
        image: this.venueArtworkByName[needle] || '',
        city: this.venueCityByName[needle] || '',
        state: '',
      };
    }
    const shows = Array.isArray(this.catalogShowsCache)
      ? this.catalogShowsCache
      : [];
    for (let index = 0; index < shows.length; index += 1) {
      const attrs = shows[index]?.attributes || shows[index] || {};
      const location =
        (typeof attrs.location === 'string' && attrs.location.trim()) ||
        (typeof attrs.venue === 'string' && attrs.venue.trim()) ||
        '';
      if (!location) {
        continue;
      }
      const key = location.toLowerCase();
      if (key === needle || key.includes(needle) || needle.includes(key)) {
        return {
          image: this.getNearMeShowImage(shows[index]),
          city:
            (typeof attrs.city === 'string' && attrs.city.trim()) || '',
          state:
            (typeof attrs.state === 'string' && attrs.state.trim()) || '',
        };
      }
    }
    return null;
  };

  enrichVenueSearchResults = async () => {
    if (
      this.state.searchFilter !== 'Venues' &&
      this.state.searchFilter !== 'All'
    ) {
      return;
    }
    const merged = this.mergeVenueDetailsFromCatalog(this.state.UserList);
    if (merged !== this.state.UserList) {
      this.setState({ UserList: merged });
    }
    let token = this.state.authToken;
    if (!token) {
      token = await getStorageData('authToken');
    }
    const list = merged;
    if (!token) {
      return;
    }
    list
      .filter((venue: any) => this.isVenueAccountType(venue?.attributes?.account_type))
      .slice(0, 20)
      .forEach((venue: any) => {
        const id = String(venue?.id || '');
        if (!id || this.venueProfileInFlight[id]) {
          return;
        }
        if (this.getVenueImageUrl(venue) && this.getVenueSubtitle(venue)) {
          return;
        }
        this.fetchVenueProfileDetails(id, token);
      });
  };

  mergeVenueDetailsFromCatalog = (list: any[]) => {
    if (!Array.isArray(list) || list.length === 0) {
      return list;
    }
    let changed = false;
    const next = list.map((item: any) => {
      if (!this.isVenueAccountType(item?.attributes?.account_type)) {
        return item;
      }
      const match = this.findCatalogVenueMatch(this.getVenueDisplayName(item));
      if (!match) {
        return item;
      }
      const attrs = item.attributes || {};
      const nextImage =
        this.getUserAvatarUrl(item) || match.image || '';
      const nextCity =
        (typeof attrs.city === 'string' && attrs.city.trim()) ||
        match.city ||
        '';
      const nextState =
        (typeof attrs.state === 'string' && attrs.state.trim()) ||
        match.state ||
        '';
      if (
        nextImage === this.getUserAvatarUrl(item) &&
        nextCity === (attrs.city || '') &&
        nextState === (attrs.state || '')
      ) {
        return item;
      }
      changed = true;
      return {
        ...item,
        attributes: {
          ...attrs,
          city: nextCity || attrs.city,
          state: nextState || attrs.state,
          photo: attrs.photo || nextImage,
          profile_image: attrs.profile_image || nextImage,
        },
      };
    });
    return changed ? next : list;
  };

  fetchVenueProfileDetails = (accountId: string, token: string) => {
    this.venueProfileInFlight[accountId] = true;
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.venueProfileApiCallIds[requestMessage.messageId] = accountId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.showUserProfileEndPoint}${accountId}`,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
        token,
      }),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleVenueProfileApi = (venueId: string, responseJson: any) => {
    delete this.venueProfileInFlight[venueId];
    const payload = responseJson?.data || responseJson;
    const attrs = payload?.attributes || payload;
    if (!attrs || typeof attrs !== 'object' || responseJson?.errors) {
      return;
    }
    const list = Array.isArray(this.state.UserList) ? this.state.UserList : [];
    const updated = list.map((item: any) => {
      if (String(item?.id) !== String(venueId)) {
        return item;
      }
      return {
        ...item,
        attributes: {
          ...item.attributes,
          city: item.attributes?.city || attrs.city || '',
          state: item.attributes?.state || attrs.state || '',
          address: item.attributes?.address || attrs.address || '',
          location: item.attributes?.location || attrs.location || '',
          photo: item.attributes?.photo || attrs.photo || '',
          profile_image:
            item.attributes?.profile_image || attrs.profile_image || '',
          profile_image_url:
            item.attributes?.profile_image_url ||
            attrs.profile_image_url ||
            '',
          cover_photo: item.attributes?.cover_photo || attrs.cover_photo || '',
          maximum_people_capacity:
            item.attributes?.maximum_people_capacity ||
            attrs.maximum_people_capacity ||
            '',
        },
      };
    });
    this.setState({ UserList: updated });
  };

  getPeopleLocationLabel = (item: any) => {
    const attrs = item?.attributes || {};
    return this.getUserCityStateLabel(attrs);
  };

  getShowSearchHaystack = (show: any) => {
    const attrs = show?.attributes || show || {};
    const lineUps = Array.isArray(attrs.line_ups) ? attrs.line_ups : [];
    const parts = [
      attrs.event_title,
      attrs.name,
      attrs.band_name,
      attrs.location,
      attrs.city,
      attrs.state,
      attrs.venue,
      ...lineUps,
      ...this.getShowGenreNames(show),
    ];
    return parts
      .filter(part => typeof part === 'string' && part.trim())
      .join(' ')
      .toLowerCase();
  };

  filterCatalogShows = (shows: any[], query: string) => {
    const needle = (query || '').trim().toLowerCase();
    if (!needle || !Array.isArray(shows)) {
      return [];
    }
    return shows.filter(show => this.getShowSearchHaystack(show).includes(needle));
  };

  mergeCatalogShowsCache = (shows: any[]) => {
    if (!Array.isArray(shows) || shows.length === 0) {
      return;
    }
    const byId = new Map<string, any>();
    this.catalogShowsCache.forEach(show => {
      const id = String(show?.id ?? show?.attributes?.id ?? '');
      if (id) {
        byId.set(id, show);
      }
    });
    shows.forEach(show => {
      const id = String(show?.id ?? show?.attributes?.id ?? '');
      if (id) {
        byId.set(id, show);
      }
    });
    this.catalogShowsCache = Array.from(byId.values());
  };

  applyCatalogShowResults = () => {
    if (
      !this.hasSearchQuery() ||
      (!this.isShowsSearchTab() && !this.isAllSearchTab())
    ) {
      return;
    }
    const query = (this.state.searchText || '').trim();
    this.setState({
      catalogShowResults: this.filterCatalogShows(this.catalogShowsCache, query),
      loadingCatalogShows: false,
    });
  };

  searchAllShows = () => {
    const query = (this.state.searchText || '').trim();
    if (!query) {
      this.setState({ catalogShowResults: [], loadingCatalogShows: false });
      return;
    }
    if (this.catalogShowsCache.length > 0) {
      this.setState({
        catalogShowResults: this.filterCatalogShows(this.catalogShowsCache, query),
        loadingCatalogShows: false,
      });
      return;
    }
    this.setState({ loadingCatalogShows: true, catalogShowResults: [] });
    this.fetchAllShowsForSearch();
  };

  fetchAllShowsForSearch = () => {
    const query = (this.state.searchText || '').trim();
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.searchAllShowsAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      query
        ? `${configJSON.getAllShowEndPoint}?query=${encodeURIComponent(query)}`
        : configJSON.getAllShowEndPoint,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
      }),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleSearchAllShowsApi = (responseJson: any) => {
    const shows = this.flattenCatalogShows(responseJson);
    this.mergeCatalogShowsCache(shows);
    this.applyGenreArtworkFromShows(shows);
    this.applyCatalogShowResults();
  };

  getShowTicketPriceLabel = (item: any) => {
    const attrs = item?.attributes || item || {};
    const raw =
      attrs.ticket_price ?? attrs.price ?? attrs.cost ?? attrs.ticket_cost;
    if (raw === null || raw === undefined || raw === '') {
      return '';
    }
    const numeric = Number(raw);
    if (!Number.isNaN(numeric)) {
      return `$${Number.isInteger(numeric) ? numeric : numeric.toFixed(2)}`;
    }
    const text = String(raw).trim();
    if (!text) {
      return '';
    }
    return text.startsWith('$') ? text : `$${text}`;
  };

  getDisplayedUserList = () => {
    const list = Array.isArray(this.state.UserList) ? this.state.UserList : [];
    const filter = this.state.searchFilter;
    if (filter !== 'Bands' && filter !== 'Venues') {
      return list;
    }

    return list.filter((item: any) => {
      const accountType = item?.attributes?.account_type;
      if (typeof accountType !== 'string' || accountType === '') {
        return filter !== 'Venues';
      }
      return filter === 'Bands'
        ? this.isBandAccountType(accountType)
        : this.isVenueAccountType(accountType);
    });
  };

  normalizeBrowseItem = (item: any) => {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const attributes =
      item.attributes && typeof item.attributes === 'object'
        ? item.attributes
        : {};
    const name =
      (typeof attributes.name === 'string' && attributes.name.trim()) ||
      (typeof item.name === 'string' && item.name.trim()) ||
      '';
    if (!name) {
      return null;
    }
    const image = this.normalizeMediaUrl(
      attributes.image ||
        attributes.image_url ||
        attributes.photo ||
        attributes.photo_url ||
        attributes.profile_image ||
        item.image ||
        item.image_url,
    );
    const id = item.id != null ? String(item.id) : name;
    return { id, name, image: image || null };
  };

  getCategoriesListAPI = () => {
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.getCategoriesAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.allCategoriesEndPoint,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
      }),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getGenreListAPI = (categoryId: string) => {
    if (!categoryId) {
      return;
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.getGenresAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.genreEndPoint + categoryId,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
      }),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleGetCategoriesApi = (responseJson: any) => {
    const rawList = Array.isArray(responseJson?.data) ? responseJson.data : [];
    const categories = rawList
      .map((item: any) => this.normalizeBrowseItem(item))
      .filter((item: any) => item != null);

    const musicIds: string[] = [];
    const otherIds: string[] = [];
    rawList.forEach((item: any) => {
      if (item?.id == null || String(item.id) === '0') {
        return;
      }
      const name = String(
        item?.attributes?.name || item?.name || '',
      ).toLowerCase();
      if (name.includes('music')) {
        musicIds.push(String(item.id));
      } else {
        otherIds.push(String(item.id));
      }
    });
    const pendingGenreCategoryIds = [...musicIds, ...otherIds];

    this.setState({ categoriesList: categories, pendingGenreCategoryIds }, () => {
      if (pendingGenreCategoryIds.length > 0) {
        this.fetchNextGenreCategory();
      } else {
        this.setState({ genreList: categories });
      }
    });
  };

  fetchNextGenreCategory = () => {
    const remaining = Array.isArray(this.state.pendingGenreCategoryIds)
      ? [...this.state.pendingGenreCategoryIds]
      : [];
    const nextId = remaining.shift();
    this.setState({ pendingGenreCategoryIds: remaining });
    if (nextId) {
      this.getGenreListAPI(nextId);
    } else if (
      !Array.isArray(this.state.genreList) ||
      this.state.genreList.length === 0
    ) {
      this.setState(
        {
          genreList: Array.isArray(this.state.categoriesList)
            ? this.state.categoriesList
            : [],
        },
        () => {
          this.mergeGenreArtworkIntoList();
        },
      );
    } else {
      this.mergeGenreArtworkIntoList();
    }
  };

  handleGetGenresApi = (responseJson: any) => {
    const rawList = Array.isArray(responseJson?.data) ? responseJson.data : [];
    const incoming = rawList
      .map((item: any) => this.normalizeBrowseItem(item))
      .filter((item: any) => item != null);
    const existing = Array.isArray(this.state.genreList)
      ? this.state.genreList
      : [];
    const merged = [...existing];
    incoming.forEach((genre: any) => {
      const alreadyListed = merged.some(
        (item: any) =>
          String(item?.name || '').toLowerCase() ===
          String(genre?.name || '').toLowerCase(),
      );
      if (!alreadyListed) {
        merged.push(genre);
      }
    });

    this.setState({ genreList: merged }, () => {
      this.mergeGenreArtworkIntoList();
      this.fetchNextGenreCategory();
    });
  };

  flattenCatalogShows = (responseJson: any): any[] => {
    const data = responseJson?.data ?? responseJson;
    if (!data) {
      return [];
    }
    if (Array.isArray(data)) {
      return data.reduce((acc: any[], item: any) => {
        if (Array.isArray(item)) {
          return acc.concat(item);
        }
        if (item && typeof item === 'object' && !item.id && !item.attributes) {
          Object.values(item).forEach((value: any) => {
            if (Array.isArray(value)) {
              acc.push(...value);
            }
          });
          return acc;
        }
        acc.push(item);
        return acc;
      }, []);
    }
    if (typeof data === 'object') {
      return Object.values(data).reduce((acc: any[], value: any) => {
        if (Array.isArray(value)) {
          return acc.concat(value);
        }
        return acc;
      }, []);
    }
    return [];
  };

  getShowGenreNames = (show: any): string[] => {
    const source = show?.attributes || show || {};
    const genre = source.genre;
    if (typeof genre === 'string' && genre.trim()) {
      return [genre.trim()];
    }
    if (Array.isArray(genre)) {
      return genre
        .map((item: any) => {
          if (typeof item === 'string') {
            return item.trim();
          }
          return String(item?.name || item?.attributes?.name || '').trim();
        })
        .filter(Boolean);
    }
    return [];
  };

  findArtworkForGenre = (genreName: string) => {
    const key = String(genreName || '').trim().toLowerCase();
    if (!key) {
      return '';
    }
    if (this.genreArtworkByName[key]) {
      return this.genreArtworkByName[key];
    }
    const match = Object.keys(this.genreArtworkByName).find(
      stored => key.includes(stored) || stored.includes(key),
    );
    return match ? this.genreArtworkByName[match] : '';
  };

  applyGenreArtworkFromShows = (shows: any[]) => {
    if (!Array.isArray(shows) || shows.length === 0) {
      this.mergeGenreArtworkIntoList();
      return;
    }
    shows.forEach(show => {
      this.indexUpcomingShow(show);
      const image = this.getNearMeShowImage(show);
      if (!image) {
        return;
      }
      this.getShowGenreNames(show).forEach(name => {
        const key = name.toLowerCase();
        if (!this.genreArtworkByName[key]) {
          this.genreArtworkByName[key] = image;
        }
      });
    });
    this.mergeGenreArtworkIntoList();
  };

  mergeGenreArtworkIntoList = () => {
    const genres = Array.isArray(this.state.genreList)
      ? this.state.genreList
      : [];
    if (genres.length === 0) {
      return;
    }
    const updated = genres.map((genre: any) => {
      const currentImage = this.normalizeMediaUrl(genre?.image);
      if (currentImage) {
        return currentImage === genre.image
          ? genre
          : { ...genre, image: currentImage };
      }
      const artwork = this.findArtworkForGenre(genre?.name);
      return artwork ? { ...genre, image: artwork } : genre;
    });
    updated.sort((left: any, right: any) => {
      const leftHasImage = left?.image ? 1 : 0;
      const rightHasImage = right?.image ? 1 : 0;
      return rightHasImage - leftHasImage;
    });
    this.setState({ genreList: updated });
  };

  getGenreArtworkFromShowsAPI = () => {
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.getGenreArtworkAPICallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getAllShowEndPoint,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.searchApiContentType,
      }),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod,
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleGenreArtworkFromShowsApi = (responseJson: any) => {
    const shows = this.flattenCatalogShows(responseJson);
    this.mergeCatalogShowsCache(shows);
    this.applyGenreArtworkFromShows(shows);
    this.applyCatalogShowResults();
    if (
      this.hasSearchQuery() &&
      (this.state.searchFilter === 'Venues' || this.state.searchFilter === 'All')
    ) {
      this.enrichVenueSearchResults();
    }
  };

  handleShowAllGenres = () => {
    this.props.navigation.navigate('BrowseGenres', {
      genres: this.state.genreList,
      isDarkMode: this.state.isDarkMode,
    });
  };

  getSelectedGenreParam = () => {
    return (
      this.props.route?.params?.selectedGenre ||
      this.props.navigation.state?.params?.selectedGenre ||
      this.props.navigation.getParam?.('selectedGenre') ||
      ''
    );
  };

  applyPendingGenreSearch = () => {
    const genreName = this.getSelectedGenreParam();
    if (!genreName) {
      return false;
    }
    if (this.props.navigation.setParams) {
      this.props.navigation.setParams({selectedGenre: null});
    }
    this.handleGenrePress(genreName);
    return true;
  };

  handleGenrePress = (genreName: string) => {
    if (!genreName) {
      return;
    }
    this.setState(
      {
        searchText: genreName,
        SelectedTab: 'Shows',
        searchFilter: 'Shows',
        selectRange: true,
      },
      () => {
        this.runLiveSearch();
      },
    );
  };

  async componentWillUnmount() {
    if (this.debouncedLoadNearMePreview?.cancel) {
      this.debouncedLoadNearMePreview.cancel();
    }
    if (this.debouncedLiveSearch?.cancel) {
      this.debouncedLiveSearch.cancel();
    }
    if (this.nearMePreviewTimer) {
      clearTimeout(this.nearMePreviewTimer);
      this.nearMePreviewTimer = null;
    }
    this.isNearMePreviewInFlight = false;
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }
  // Customizable Area End
}
