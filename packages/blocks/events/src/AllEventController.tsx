import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';
import { navigateToNotificationsScreen } from '../../../framework/src/navigateToNotifications';
import { subscribeHomeFeedTabScrollToTop } from '../../../framework/src/homeFeedTabScroll';

// Customizable Area Start
import {
  getStorageData,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from '../../utilities/src/Colors';
import {
  Alert,
  BackHandler,
  DeviceEventEmitter,
  InteractionManager,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import GeolocationServices from 'react-native-geolocation-service';

/** Set to true to use GPS for the home feed (lat/long APIs). Off: avoids native geolocation crashes on some Android builds. */
const DEVICE_GEOLOCATION_ENABLED_FOR_FEED = false;

/** Number of shows revealed on the home feed at a time. */
export const HOME_FEED_PAGE_SIZE = 10;

type HomeFeedEventsCache = {
  authenticatedEventsList: any[];
  filteredEventList: any[];
  stateNameList: string[];
  selectedState: string;
};

/** Keeps the home feed list across remounts (e.g. returning from event details). */
let homeFeedEventsCache: HomeFeedEventsCache | null = null;
/** Full band/artist directory from all_band_artists, shared across home and See all. */
let allBandsListCache: any[] = [];
import Geocoder from 'react-native-geocoding';
import { check, PERMISSIONS } from 'react-native-permissions';
import _ from 'lodash';
import VersionCheck from 'react-native-version-check';
export const baseURL = require('../../../framework/src/config.js').baseURL;
import { ISocketMessage } from '../../chat/src/ChatController';
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
const FORCE_UPDATE_TEST_MODE = false;
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
// import messaging from "@react-native-firebase/messaging";
import moment from 'moment-timezone';
import { createRef } from 'react';
// Customizable Area End

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  modalVisible: boolean;
  selectedCategoryID: string;
  expandedItems: string[];
  showFullText: boolean;
  authToken: string | null;
  authenticatedEventsList: any[];
  selectedEventId: string;
  eventDetail: any;
  from: string;
  isLoading: boolean;
  hasLocationPermission: boolean;
  stateNameList: string[];
  selectedState: string;
  stateClicked: boolean;
  filteredEventList: any[];
  loginPopup: boolean;
  categoriesList: any[];
  selectedFilterIndex: number;
  searchText: string;
  showMenu: boolean;
  showComments: boolean;
  commentText: string;
  commentsList: any[];
  commentsLoading: boolean;
  showReportModal: boolean;
  reportReason: string;
  reportComment: string;
  reportError: string;
  showRepliesFor: string[];
  eventId: string;
  replying: boolean;
  commentId: string;
  userId: string;
  isEditing: boolean;
  showReplies: boolean;
  commentWithReply: any;
  replyId: string;
  userProfilePic: string;
  allBandsList: any[];
  newNotification: boolean;
  newMessage: boolean;
  unreadNotificationCount: number;
  detailsLoading: boolean;
  detailsLoadError: string | null;
  removeEventModalVisible: boolean;
  showRulesMoreModal: boolean;
  showTncModal: boolean;
  isLoadingComments: boolean;
  type: string;
  showId: any;
  showType: any;
  selectedSortBy: string;
  sortClicked: boolean;
  /** US state / region name from reverse geocode of the device location (shown in state dropdown). */
  currentLocationState: string;
  forceUpdateRequired: boolean;
  forceUpdateStoreUrl: string;
  isDarkMode: boolean;
  visibleShowsCount: number;
  guestSignupBannerDismissed: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AllEventController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  getEventsListApiCallId: any;
  lastEventsListApiUrl: string = '';
  postLikeDislikeEventApiCallId: any;
  getEventDetailApiCallID: any;
  addEventToCalendarAPICallID: any;
  removeEventFromCalendarAPICallID: any;
  getCategoriesListAPICallID: any;
  getCommentsAPICallID: any;
  createCommentAPICallID: any;
  likeCommentAPICallID: any;
  getAllBandsListApiCallId: any;
  getChatListApiCallId: any;
  reportShowApiCallId: any;
  checkUnreadNotificationsApiCallId: any;
  globalWebSocket?: WebSocket = undefined;
  isComponentMounted: boolean = false;
  navigationListeners: any[] = [];
  loadingTimeoutId: any = null;
  forceUpdateBackHandler: { remove: () => void } | null = null;

  commentTextInput: any;
  /** Main events feed list; used to scroll to top when the Home tab is pressed */
  eventsFeedListRef = createRef<any>();
  homeFeedTabScrollListenerAttached = false;
  profileThemeListener: { remove: () => void } | null = null;
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      modalVisible: false,
      selectedCategoryID: '0',
      expandedItems: [],
      showFullText: false,
      authToken: '',
      authenticatedEventsList: [],
      selectedEventId: '',
      eventDetail: {},
      from: '',
      isLoading: true,
      hasLocationPermission: false,
      stateNameList: [],
      selectedState: 'All',
      stateClicked: false,
      filteredEventList: [],
      loginPopup: false,
      categoriesList: [],
      selectedFilterIndex: 0,
      searchText: '',
      showMenu: false,
      showComments: false,
      commentText: '',
      commentsList: [],
      commentsLoading: false,
      showReportModal: false,
      reportReason: '',
      reportComment: '',
      reportError: '',
      showRepliesFor: [],
      eventId: '',
      replying: false,
      commentId: '',
      userId: '',
      isEditing: false,
      showReplies: false,
      commentWithReply: {},
      replyId: '',
      userProfilePic: '',
      allBandsList: [],
      newNotification: false,
      newMessage: false,
      unreadNotificationCount: 0,
      detailsLoading: true,
      detailsLoadError: null,
      removeEventModalVisible: false,
      showRulesMoreModal: false,
      showTncModal: false,
      isLoadingComments: false,
      type: '',
      showId: '',
      showType: '',
      selectedSortBy: '',
      sortClicked: false,
      currentLocationState: '',
      forceUpdateRequired: false,
      forceUpdateStoreUrl: '',
      isDarkMode: true,
      visibleShowsCount: HOME_FEED_PAGE_SIZE,
      guestSignupBannerDismissed: false,
      // Customizable Area End
    };

    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  // Safe setState method to prevent updates on unmounted components
  safeSetState = (newState: any, callback?: () => void) => {
    if (this.isComponentMounted) {
      this.setState(newState, callback);
    }
  };

  async componentDidMount() {
    this.isComponentMounted = true;
    if (!this.isEventDetailScreen()) {
      this.restoreHomeFeedCacheIfNeeded();
    }
    this.getToken();
    this.getAuthToken();
    this.handlePayloadFromNav();
    this.loadHomeTheme();

    if (DEVICE_GEOLOCATION_ENABLED_FOR_FEED) {
      try {
        await this.requestLocationPermission();
      } catch (error) {
        // Don't let permission errors crash the app
      }
    }

    if (this.isPlatformWeb() === false) {
      const willFocusListener = this.props.navigation.addListener(
        'willFocus',
        () => {
          if (this.isComponentMounted) {
            this.getToken();
            this.getAuthToken();
          }
        },
      );
      this.navigationListeners.push(willFocusListener);
    }
    // Customizable Area Start
    this.handleWithComponentDidMount();

    // Home feed only: clear detail loading if it was never used.
    if (!this.isEventDetailScreen()) {
      this.loadingTimeoutId = setTimeout(() => {
        if (this.state.detailsLoading) {
          this.safeSetState({ detailsLoading: false, isLoading: false });
        }
      }, 5000);
    }
    // Customizable Area End
  }

  isEventDetailScreen = () => {
    if (this.props.id === 'AllEventDetailScreen') {
      return true;
    }
    const routeName =
      (this.props as any).route?.name ||
      this.props.navigation?.state?.routeName;
    return routeName === 'AllEventDetailScreen';
  };

  hasCachedHomeFeedEvents = () =>
    !this.isEventDetailScreen() &&
    (this.state.authenticatedEventsList.length > 0 ||
      (homeFeedEventsCache?.authenticatedEventsList?.length ?? 0) > 0);

  restoreHomeFeedCacheIfNeeded = () => {
    this.restoreAllBandsListCacheIfNeeded();
    if (this.isEventDetailScreen() || !homeFeedEventsCache) {
      return;
    }
    if (this.state.authenticatedEventsList.length > 0) {
      return;
    }
    this.safeSetState({
      authenticatedEventsList: homeFeedEventsCache.authenticatedEventsList,
      filteredEventList: homeFeedEventsCache.filteredEventList,
      stateNameList: homeFeedEventsCache.stateNameList,
      selectedState: homeFeedEventsCache.selectedState,
      isLoading: false,
      detailsLoading: false,
    });
  };

  restoreAllBandsListCacheIfNeeded = () => {
    if (this.state.allBandsList.length > 0 || allBandsListCache.length === 0) {
      return;
    }
    this.safeSetState({ allBandsList: allBandsListCache });
  };

  getAllBandsListRecords = () => {
    if (this.state.allBandsList.length > 0) {
      return this.state.allBandsList;
    }
    return allBandsListCache;
  };

  saveHomeFeedEventsCache = (cache: HomeFeedEventsCache) => {
    if (this.isEventDetailScreen()) {
      return;
    }
    homeFeedEventsCache = cache;
  };

  hasValidEventDetail = () => {
    const attributes = this.state.eventDetail?.attributes;
    return Boolean(
      attributes && (attributes.id || attributes.event_title),
    );
  };

  startDetailLoadingTimeout = () => {
    if (!this.isEventDetailScreen()) {
      return;
    }
    if (this.loadingTimeoutId) {
      clearTimeout(this.loadingTimeoutId);
    }
    this.loadingTimeoutId = setTimeout(() => {
      if (this.state.detailsLoading) {
        this.safeSetState({
          detailsLoading: false,
          detailsLoadError:
            'This is taking longer than expected. Please check your connection and try again.',
        });
      }
    }, 15000);
  };

  beginEventDetailLoad = () => {
    if (!this.isEventDetailScreen()) {
      return;
    }
    this.startDetailLoadingTimeout();
    this.safeSetState({
      detailsLoading: true,
      detailsLoadError: null,
      eventDetail: {},
      commentsList: [],
    });
  };

  retryEventDetailLoad = () => {
    if (!this.state.selectedEventId) {
      this.goBack();
      return;
    }
    this.beginEventDetailLoad();
    this.getAllBandsList();
    this.getEventDetailAPI();
  };

  confirmEventDetailParamsOrError = () => {
    if (!this.isEventDetailScreen() || !this.isComponentMounted) {
      return;
    }

    const route = (this.props as any).route;
    let payloadData =
      route?.params || this.props.navigation.state?.params;
    if (!payloadData?.eventId && this.props.navigation.getParam) {
      const eventId = this.props.navigation.getParam('eventId');
      if (eventId != null) {
        payloadData = {
          eventId,
          eventState: this.props.navigation.getParam('eventState'),
        };
      }
    }

    if (payloadData?.eventId || this.state.selectedEventId) {
      return;
    }

    this.safeSetState({
      detailsLoading: false,
      detailsLoadError:
        'Show information is missing. Please go back and try again.',
    });
  };

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage),
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handlePayload(message);
    } else this.handleRestAPIResponse(message);
    // Customizable Area End
  }

  // Customizable Area Start
  async componentWillUnmount(): Promise<void> {
    super.componentWillUnmount();
    this.isComponentMounted = false;
    this.detachForceUpdateBackHandler();

    // Clear loading timeout
    if (this.loadingTimeoutId) {
      clearTimeout(this.loadingTimeoutId);
    }

    // Remove all navigation listeners
    this.navigationListeners.forEach(listener => {
      if (listener && listener.remove) {
        listener.remove();
      }
    });
    this.navigationListeners = [];
    this.homeFeedTabScrollListenerAttached = false;

    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }

    // Close WebSocket connection
    if (this.globalWebSocket) {
      this.globalWebSocket.close();
      this.globalWebSocket = undefined;
    }
  }

  checkForceUpdateRequirement = async () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }
    if (FORCE_UPDATE_TEST_MODE) {
      if (!this.isComponentMounted) {
        return;
      }
      void setStorageData('forceUpdateRequired', 'true');
      this.safeSetState(
        {
          forceUpdateRequired: true,
          forceUpdateStoreUrl:
            Platform.OS === 'ios'
              ? 'https://apps.apple.com/app/id1234567890'
              : 'https://play.google.com/store/apps/details?id=com.localshows.events',
        },
        this.attachForceUpdateBackHandler,
      );
      return;
    }
    try {
      const currentVersion = VersionCheck.getCurrentVersion();
      console.log(`[ForceUpdate] Current app version: ${currentVersion}`);

      const result = await VersionCheck.needUpdate({
        depth: 3,
        ignoreErrors: true,
        ...(Platform.OS === 'ios'
          ? {
              provider: 'appStore',
              country: 'us',
            }
          : {}),
      });
      console.log('[ForceUpdate] needUpdate result:', JSON.stringify(result));

      let required = Boolean(result?.isNeeded);
      let storeUrl = typeof result?.storeUrl === 'string' ? result.storeUrl : '';

      // iOS fallback: App Store metadata can be flaky via needUpdate() only.
      if (Platform.OS === 'ios') {
        const latestVersion = await VersionCheck.getLatestVersion({
          provider: 'appStore',
          country: 'us',
        });
        console.log(
          `[ForceUpdate][iOS] App Store latest version: ${String(latestVersion)}`,
        );
        if (!required) {
          if (
            typeof latestVersion === 'string' &&
            this.isVersionLower(currentVersion, latestVersion)
          ) {
            required = true;
          }
        }

        if (!storeUrl) {
          const appStoreUrl = await VersionCheck.getStoreUrl({
            provider: 'appStore',
            country: 'us',
          });
          console.log(
            `[ForceUpdate][iOS] App Store URL from getStoreUrl: ${String(appStoreUrl)}`,
          );
          if (typeof appStoreUrl === 'string') {
            storeUrl = appStoreUrl;
          }
        }
      }
      console.log(`[ForceUpdate] Final required=${required} storeUrl=${storeUrl}`);

      if (!this.isComponentMounted) {
        return;
      }

      this.safeSetState(
        {
          forceUpdateRequired: required,
          forceUpdateStoreUrl: storeUrl,
        },
        () => {
          void setStorageData('forceUpdateRequired', required ? 'true' : 'false');
          if (required) {
            this.attachForceUpdateBackHandler();
          } else {
            this.detachForceUpdateBackHandler();
          }
        },
      );
    } catch (_error) {
      if (this.isComponentMounted) {
        this.safeSetState({
          forceUpdateRequired: false,
          forceUpdateStoreUrl: '',
        });
      }
      void setStorageData('forceUpdateRequired', 'false');
      this.detachForceUpdateBackHandler();
    }
  };

  isVersionLower = (currentVersion: string, latestVersion: string) => {
    const sanitize = (value: string) =>
      String(value)
        .split('.')
        .map(part => parseInt(part.replace(/[^\d]/g, ''), 10))
        .map(part => (isNaN(part) ? 0 : part));

    const currentParts = sanitize(currentVersion);
    const latestParts = sanitize(latestVersion);
    const maxLen = Math.max(currentParts.length, latestParts.length);

    for (let index = 0; index < maxLen; index += 1) {
      const currentPart = currentParts[index] ?? 0;
      const latestPart = latestParts[index] ?? 0;
      if (currentPart < latestPart) {
        return true;
      }
      if (currentPart > latestPart) {
        return false;
      }
    }
    return false;
  };

  attachForceUpdateBackHandler = () => {
    if (Platform.OS !== 'android') {
      return;
    }
    this.detachForceUpdateBackHandler();
    this.forceUpdateBackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
  };

  detachForceUpdateBackHandler = () => {
    if (this.forceUpdateBackHandler) {
      this.forceUpdateBackHandler.remove();
      this.forceUpdateBackHandler = null;
    }
  };

  openForceUpdateStore = () => {
    const url = this.state.forceUpdateStoreUrl;
    if (typeof url === 'string' && url.length > 0) {
      if (Platform.OS === 'ios' && url.indexOf('apps.apple.com') !== -1) {
        const appStoreUrl = url.replace(/^https?:\/\//, 'itms-apps://');
        void Linking.openURL(appStoreUrl);
        return;
      }
      void Linking.openURL(url);
    }
  };

  private isForceUpdateBlocking = () => this.state.forceUpdateRequired === true;

  /** Override in AllEventScreen for home-feed-only refresh logic. */
  onHomeFeedScreenFocus = async () => {};

  handleHomeFeedScreenFocus = async () => {
    if (!this.isComponentMounted) {
      return;
    }
    await this.onHomeFeedScreenFocus();
    this.showPopup();
    this.initialiseLocation();
    this.getUnreadChatCount();
    setTimeout(() => {
      if (this.isComponentMounted) {
        this.getUnreadNotificationsCount();
      }
    }, 100);
  };

  handleHomeFeedScreenBlur = () => {
    if (!this.isComponentMounted) {
      return;
    }
    this.safeSetState({
      showComments: false,
      showReplies: false,
      showRepliesFor: [],
      replying: false,
      stateClicked: false,
      sortClicked: false,
      showMenu: false,
      removeEventModalVisible: false,
      showReportModal: false,
    });
  };

  attachHomeFeedNavigationListeners = () => {
    if (this.isPlatformWeb()) {
      return;
    }
    const focusListener = this.props.navigation.addListener('focus', () => {
      void this.handleHomeFeedScreenFocus();
    });
    this.navigationListeners.push(focusListener);

    const blurListener = this.props.navigation.addListener('blur', () => {
      this.handleHomeFeedScreenBlur();
    });
    this.navigationListeners.push(blurListener);
  };

  async handleWithComponentDidMount() {
    this.getAuthToken();
    this.getUnreadChatCount();
    this.getUnreadNotificationsCount();
    this.attachHomeFeedTabScrollListener();
  }

  /** When the bottom-tab Home button is pressed, scroll the feed to the top and optionally reload. */
  scrollFeedToTopAndReload = (returnedFromDeep = false) => {
    if (!this.isComponentMounted) {
      return;
    }
    const list = this.eventsFeedListRef.current;
    if (list?.scrollToOffset) {
      list.scrollToOffset({ offset: 0, animated: true });
    }
    if (returnedFromDeep) {
      return;
    }
    this.handleRefresh({ silent: true });
  };

  /** Listens for Home tab re-tap (see HomeScreen tabBarOnPress + homeFeedTabScroll). */
  attachHomeFeedTabScrollListener = () => {
    if (this.isPlatformWeb() || this.homeFeedTabScrollListenerAttached) {
      return;
    }
    const sub = subscribeHomeFeedTabScrollToTop(({ returnedFromDeep }) => {
      requestAnimationFrame(() => {
        if (this.isComponentMounted) {
          this.scrollFeedToTopAndReload(returnedFromDeep);
        }
      });
    });
    this.navigationListeners.push(sub);
    this.homeFeedTabScrollListenerAttached = true;
  };

  getUnreadChatCount = async () => {
    if (!this.isComponentMounted) {
      return;
    }

    let token = this.state.authToken;
    const header = {
      'Content-Type': 'application/json',
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.getChatListApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.chatsEndPoint,
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

  handlePayload = (message: Message) => {
    if (!this.isComponentMounted) {
      return;
    }
    // Ignore payload when this screen is not focused (e.g. Home under AllEventDetail).
    if (
      typeof this.props.navigation?.isFocused === 'function' &&
      !this.props.navigation.isFocused()
    ) {
      return;
    }

    const payloadData =
      message.getData(getName(MessageEnum.HelpCentreMessageData)) ||
      message.getData(getName(MessageEnum.PostDetailDataMessage));
    if (payloadData) {
      if (payloadData.eventId) {
        const sameEventAlreadyLoaded =
          this.isEventDetailScreen() &&
          String(payloadData.eventId) === String(this.state.selectedEventId) &&
          this.hasValidEventDetail();

        if (!sameEventAlreadyLoaded) {
          if (this.isEventDetailScreen()) {
            this.beginEventDetailLoad();
          }
          this.setState({ selectedEventId: payloadData.eventId }, () => {
            if (this.isComponentMounted) {
              this.getAllBandsList();
              this.getEventDetailAPI();
              this.prefetchDetailComments({
                data: { id: payloadData.eventId, type: 'show' },
              });
            }
          });
        }
      }
      if (payloadData.isPostPictureSuccessfullyCreated) {
        const { title, description } = payloadData.successMessage;
        return this.showAlert(title, description);
      }
    }
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
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleUnreadNotificationsApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

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
    // Swagger returns: {"has_unread_notifications": true, "unread_count": 12}
    // But might also be wrapped in data array or object

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
    // Check if it's an empty data array (what user is seeing)
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

  handlePayloadFromNav = () => {
    if (!this.isComponentMounted) {
      return;
    }

    // React Navigation v6 route.params; fall back to v4 state.params / getParam.
    const route = (this.props as any).route;
    let payloadData =
      route?.params || this.props.navigation.state?.params;
    if (!payloadData?.eventId && this.props.navigation.getParam) {
      const eventId = this.props.navigation.getParam('eventId');
      if (eventId != null) {
        payloadData = {
          eventId,
          eventState: this.props.navigation.getParam('eventState'),
        };
      }
    }

    if (payloadData) {
      if (payloadData.eventId) {
        const sameEventAlreadyLoaded =
          this.isEventDetailScreen() &&
          String(payloadData.eventId) === String(this.state.selectedEventId) &&
          this.hasValidEventDetail();

        if (!sameEventAlreadyLoaded) {
          if (this.isEventDetailScreen()) {
            this.beginEventDetailLoad();
          }
          this.setState({ selectedEventId: payloadData.eventId }, () => {
            if (this.isComponentMounted) {
              this.getAllBandsList();
              this.getEventDetailAPI();
              this.prefetchDetailComments({
                data: { id: payloadData.eventId, type: 'show' },
              });
            }
          });
        }
      }
      if (payloadData.isPostPictureSuccessfullyCreated) {
        const { title, description } = payloadData.successMessage;
        return this.showAlert(title, description);
      }
    } else if (this.isEventDetailScreen()) {
      if (!this.state.selectedEventId) {
        this.safeSetState({
          detailsLoading: true,
          detailsLoadError: null,
        });
      }
    } else {
      // No detail-navigation params: only clear detail loading. Feed list loading
      // stays tied to isLoading until getEventsListAPI completes (do not clear here
      // or the empty state appears before shows load).
      this.setState({ detailsLoading: false });
    }
  };
  initialiseLocation = async () => {
    if (!DEVICE_GEOLOCATION_ENABLED_FOR_FEED) {
      this.safeSetState({ hasLocationPermission: false });
      return;
    }
    try {
      const status = await this.hasLocationPermission();
      this.safeSetState({ hasLocationPermission: status });

      // If permission check fails on emulator, request permission
      if (!status) {
        const requestStatus = await this.requestLocationPermission();
        this.safeSetState({ hasLocationPermission: requestStatus });
      }
    } catch (error) {
      this.safeSetState({ hasLocationPermission: false });
    }
  };

  connectGlobalSocket = async () => {
    if (!this.isComponentMounted) {
      return;
    }

    const token = await getStorageData('authToken');
    const subscriptionMessage = {
      command: 'subscribe',
      identifier: JSON.stringify({
        channel: 'GlobalChannel',
      }),
    };
    const subscriptionMessageStr = JSON.stringify(subscriptionMessage);

    try {
      this.globalWebSocket = new WebSocket(
        `${baseURL.replace('https', 'wss')}/cable?token=${encodeURIComponent(
          token,
        )}`,
      );
      this.globalWebSocket.onopen = () => {
        if (this.isComponentMounted && this.globalWebSocket) {
          this.globalWebSocket.send(subscriptionMessageStr);
        }
      };
      this.globalWebSocket.onmessage = (event: any) => {
        if (!this.isComponentMounted) {
          return;
        }
        try {
          const parsed = JSON.parse(event.data);
          this.handleSocketMessage(parsed);
        } catch (_e) {
          // Ignore non-JSON or malformed cable payloads
        }
      };
      this.globalWebSocket.onerror = (_error: any) => {};
      this.globalWebSocket.onclose = () => {};
    } catch (_error) {}
  };

  handleSocketMessage = (chatData: ISocketMessage) => {
    if (!this.isComponentMounted) {
      return;
    }

    const message = chatData?.message;
    if (!message || typeof message !== 'object') {
      return;
    }
    const { type, sub_type } = message;

    if (type === 'follow') {
      this.setState({ newNotification: true });
      this.getUnreadNotificationsCount();
    }

    if (
      (type === 'chat' && sub_type === 'chat_message') ||
      sub_type === 'marked_read'
    ) {
      this.getUnreadChatCount();
    }
  };

  hasUnreadChatsInChat = (list: []) => {
    return list.some((item: any) => item.unreadCount > 0);
  };

  handleRestAPIResponse = (message: Message) => {
    // console.log('📨 Received API response message:', message.id);

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );

      // console.log('🔍 Processing API response for call ID:', apiRequestCallId);
      // console.log(
      //   '🔍 Current createCommentAPICallID:',
      //   this.createCommentAPICallID,
      // );

      if (apiRequestCallId === this.getEventsListApiCallId) {
        this.handleEventsListApiResponse(message);
      } else if (apiRequestCallId === this.postLikeDislikeEventApiCallId) {
        this.handleLikeDislikeEventResponse(message);
      } else if (apiRequestCallId === this.getEventDetailApiCallID) {
        this.handleEventDetailApiResponse(message);
      } else if (apiRequestCallId === this.addEventToCalendarAPICallID) {
        this.handleAddEventToCalendarApiResponse(message);
      } else if (apiRequestCallId === this.removeEventFromCalendarAPICallID) {
        this.handleRemoveEventFromCalendarApiResponse(message);
      } else if (apiRequestCallId === this.getCategoriesListAPICallID) {
        this.handleAllCategoriesAPIResponse(message);
      } else if (apiRequestCallId === this.getCommentsAPICallID) {
        this.handleCommentsApiResponse(message);
      } else if (apiRequestCallId === this.createCommentAPICallID) {
        this.handleCreateCommentAPIResponse(message);
      } else if (apiRequestCallId === this.likeCommentAPICallID) {
        this.handleLikeCommentAPIResponse(message);
      } else if (apiRequestCallId === this.getAllBandsListApiCallId) {
        this.handleAllBandsListApiResponse(message);
      } else if (apiRequestCallId === this.getChatListApiCallId) {
        this.handleChatListApiResponse(message);
      } else if (apiRequestCallId === this.reportShowApiCallId) {
        this.handleReportShowApiResponse(message);
      } else if (apiRequestCallId === this.checkUnreadNotificationsApiCallId) {
        this.handleUnreadNotificationsApiResponse(message);
      }
    } else if (
      getName(MessageEnum.RestAPIResponceErrorMessage) === message.id
    ) {
      // Handle API errors
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );

      // Clear loading state for failed API calls
      if (apiRequestCallId === this.getEventsListApiCallId) {
        console.log('[HomeFeed] shows API URL (error):', this.lastEventsListApiUrl);
        console.log(
          '[HomeFeed] shows API network/error response:',
          message.getData(getName(MessageEnum.RestAPIResponceErrorMessage)),
        );
        this.setState({ isLoading: false });
      } else if (apiRequestCallId === this.getCategoriesListAPICallID) {
        this.setState({ categoriesList: [] });
      } else if (apiRequestCallId === this.createCommentAPICallID) {
        this.setState({
          commentsLoading: false,
          commentText: '', // Restore the comment text so user can try again
        });
      } else if (apiRequestCallId === this.likeCommentAPICallID) {
        this.handleLikeCommentAPIError();
      } else if (apiRequestCallId === this.reportShowApiCallId) {
        this.setState({
          reportError: 'Failed to submit report. Please try again later.',
        });
      } else if (apiRequestCallId === this.postLikeDislikeEventApiCallId) {
        if (this.isEventDetailScreen()) {
          this.safeSetState({ detailsLoading: false });
        }
      } else if (apiRequestCallId === this.checkUnreadNotificationsApiCallId) {
        this.setState({
          unreadNotificationCount: 0,
          newNotification: false,
        });
      } else if (apiRequestCallId === this.getEventDetailApiCallID) {
        if (this.loadingTimeoutId) {
          clearTimeout(this.loadingTimeoutId);
        }
        if (this.isEventDetailScreen()) {
          this.setState({
            detailsLoading: false,
            detailsLoadError:
              'Unable to load show details. Please try again.',
          });
        } else {
          this.setState({ detailsLoading: false });
        }
      }
    }
  };

  handleCreateCommentAPIResponse = (message: Message) => {
    if (!this.isComponentMounted) {
      return;
    }

    // Clear loading state immediately and refresh comments without setting loading again
    this.setState(
      {
        isEditing: false,
        commentsLoading: false,
      },
      () => {
        if (this.isComponentMounted) {
          // Refresh comments list to show the new comment (without setting loading state)
          this.refreshCommentsAfterCreation();
          // Also refresh events list to update comment count
          this.getEventsListAPI();
        }
      },
    );
  };

  handleLikeCommentAPIResponse = (message: Message) => {
    if (!this.isComponentMounted) {
      return;
    }

    // The optimistic update has already been applied, so we just need to refresh the comments
    // to ensure the server state is in sync
    this.refreshCommentsAfterCreation();
  };

  handleLikeCommentAPIError = () => {
    if (!this.isComponentMounted) {
      return;
    }

    // Revert the optimistic update by refreshing comments from server
    this.refreshCommentsAfterCreation();
  };

  handleReportShowApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    if (responseJson != null && !responseJson.errors) {
      Alert.alert(
        'Report Submitted',
        'Thanks for letting us know. Our team will review this show shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.closeReportModal();
            },
          },
        ],
        { cancelable: true },
      );
      this.setState({
        reportReason: '',
        reportComment: '',
        reportError: '',
        showMenu: false,
      });
    } else {
      this.setState({
        reportError: 'Failed to submit report. Please try again later.',
      });
      this.parseApiErrorResponse(responseJson);
    }
  };
  handleChatListApiResponse = (message: Message) => {
    if (!this.isComponentMounted) {
      return;
    }

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    if (responseJson.data) {
      const chatList = responseJson.data;
      this.getChatListApiCallId = '';
      let results = [];
      results = chatList.map((item: any) => {
        return {
          unreadCount: item?.attributes?.unread_message,
        };
      });
      let newMessage = this.hasUnreadChatsInChat(results);
      this.setState({ newMessage });
    }
  };

  handleCommentsApiResponse = (message: Message) => {
    const response = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    if (response?.errors) {
      this.setState({ commentsLoading: false, isLoadingComments: false });
      return;
    }
    const data = response?.data ?? [];
    const newList = [];
    if (data.length) {
      data.forEach((responseItem: any) => {
        responseItem.key = responseItem.id;
        if (
          responseItem.attributes.replies &&
          responseItem.attributes.replies.length > 0
        ) {
          responseItem.attributes.replies.forEach((reply: any) => {
            reply.key = reply.id;
          });
        }
        if (this.state.commentId === responseItem.id) {
          this.setState({ commentWithReply: responseItem });
        }
        newList.push(responseItem);
      });
    }
    this.setState({
      commentsLoading: false,
      isLoadingComments: false,
      commentsList: newList,
      ...this.getDetailCommentsCountState(newList),
    });
  };

  getDetailCommentsCountState = (commentsList: any[]) => {
    if (!this.isEventDetailScreen()) {
      return {};
    }
    const attributes = this.state.eventDetail?.attributes;
    if (!attributes) {
      return {};
    }
    const count = Array.isArray(commentsList) ? commentsList.length : 0;
    return {
      eventDetail: {
        ...this.state.eventDetail,
        attributes: {
          ...attributes,
          comments_count: count,
        },
      },
    };
  };

  prefetchDetailComments = (eventDetail?: any) => {
    if (!this.isEventDetailScreen()) {
      return;
    }
    if ((this.state.commentsList || []).length > 0) {
      return;
    }
    const eventId =
      this.state.selectedEventId ||
      eventDetail?.data?.id ||
      eventDetail?.attributes?.id;
    if (!eventId) {
      return;
    }
    const type = eventDetail?.data?.type || 'show';
    const postType = type === 'show' ? 'Show' : 'BxBlockPosts::Post';
    this.getCommentsAPI(String(eventId), postType);
  };

  handleAllCategoriesAPIResponse = (message: Message) => {
    removeStorageData('editMode');
    const response = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (response.data) {
      const newCategory = {
        id: '0',
        type: 'category',
        attributes: {
          id: '0',
          name: 'All',
          created_at: '2023-11-09T07:04:18.294Z',
          updated_at: '2023-11-09T07:29:26.573Z',
        },
      };

      const normalizedCategories = Array.isArray(response.data)
        ? response.data.filter(
            (item: any) =>
              item &&
              typeof item === 'object' &&
              item.id != null &&
              item.attributes &&
              typeof item.attributes === 'object' &&
              typeof item.attributes.name === 'string',
          )
        : [];

      let categoriesList = [newCategory, ...normalizedCategories];

      this.setState(
        {
          categoriesList,
          selectedFilterIndex: 0, // Always start with first tab (All) selected
          selectedCategoryID: '0', // Ensure this matches the first category ID
        },
        () => {
          this.getEventsListAPI();
        },
      );
    } else {
      this.setState({ isLoading: false });
      this.parseApiErrorResponse(response);
    }
  };

  handleAddEventToCalendarApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (responseJson != null && !responseJson.errors) {
      if (this.state.from === 'detail') {
        this.getEventDetailAPI();
      } else {
        const { authenticatedEventsList, selectedEventId } = this.state;
        const updatedEventsList = authenticatedEventsList.map(state => ({
          ...state,
          shows: (Array.isArray(state.shows) ? state.shows : []).map(
            (event: any) => ({
              ...event,
              added_in_calendar:
                event.id === selectedEventId ? true : event.added_in_calendar,
            }),
          ),
        }));
        this.setState({ authenticatedEventsList: updatedEventsList });
      }
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleEventsListApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    console.log('[HomeFeed] shows API URL:', this.lastEventsListApiUrl);
    this.logTopHomeFeedShows(responseJson);
    if (errorResponse) {
      console.log('[HomeFeed] shows API error:', errorResponse);
    }

    if (responseJson != null && !responseJson.errors) {
      this.handleEventsListApiSuccess(responseJson);
    } else {
      this.setState({ isLoading: false });
      if (responseJson?.errors?.[0]?.token?.toLowerCase?.().includes('expired'))
        this.showTokenExpiredPopup();
      else this.parseApiErrorResponse(responseJson);
    }
  };

  logTopHomeFeedShows = (responseJson: any) => {
    const regions =
      Array.isArray(responseJson?.data) && responseJson.data.length > 0
        ? responseJson.data[0]
        : null;

    if (!regions || typeof regions !== 'object') {
      console.log('[HomeFeed] top 5 shows on screen: []');
      return;
    }

    const flatShows: any[] = [];
    Object.keys(regions).forEach(stateName => {
      const shows = Array.isArray(regions[stateName]) ? regions[stateName] : [];
      shows.forEach((show: any) => {
        if (
          show &&
          typeof show === 'object' &&
          (show.type === 'show' || show.type === 'post')
        ) {
          flatShows.push({
            state: stateName,
            id: show.id,
            type: show.type,
            name: show.event_title || show.name || show.band_name || '',
            band_name: show.band_name || '',
            location: show.location || show.city || '',
            date_of_the_show: show.date_of_the_show || show.created_at || '',
            likes_count: show.likes_count ?? 0,
            comments_count: show.comments_count ?? 0,
            description: show.description || '',
            line_ups: show.line_ups || [],
            images_and_videos: show.images_and_videos || null,
            profile_image: show.profile_image || show.band_profile_image || null,
            like_by_me: show.like_by_me,
            added_in_calendar: show.added_in_calendar,
          });
        }
      });
    });

    const top5 = flatShows.slice(0, 5);
    try {
      console.log(
        `[HomeFeed] top ${top5.length} shows on screen (of ${flatShows.length}):`,
        JSON.stringify(top5, null, 2),
      );
    } catch (e) {
      console.log('[HomeFeed] top 5 shows on screen:', top5);
    }
  };

  handleEventsListApiSuccess = async (responseJson: any) => {
    const data = responseJson?.data;
    if (Array.isArray(data) && data.length !== 0) {
      const regions = data[0];
      if (!regions || typeof regions !== 'object') {
        const stateNameList = await this.mergeFanProfileStatesIntoList(
          this.sortStateName(['All']),
        );
        this.setState(
          {
            authenticatedEventsList: [],
            stateNameList,
            filteredEventList: [],
            isLoading: false,
            visibleShowsCount: HOME_FEED_PAGE_SIZE,
          },
          () => {
            this.saveHomeFeedEventsCache({
              authenticatedEventsList: [],
              filteredEventList: [],
              stateNameList,
              selectedState: this.state.selectedState,
            });
          },
        );
        return;
      }
      const stateList = await this.getStateList(regions);
      console.log('[renderStates] stateNameList from getStateList:', stateList);
      const newData = this.getTransformedData(regions);
      const filteredStateList = stateList.filter(e => e !== '');
      const { selectedState } = this.state;
      const filteredEventList =
        selectedState && selectedState !== 'All'
          ? newData.filter((e: any) => e.state_name === selectedState)
          : newData;
      this.setState(
        {
          authenticatedEventsList: newData,
          stateNameList: filteredStateList,
          filteredEventList,
          isLoading: false,
          visibleShowsCount: HOME_FEED_PAGE_SIZE,
        },
        () => {
          this.saveHomeFeedEventsCache({
            authenticatedEventsList: newData,
            filteredEventList,
            stateNameList: filteredStateList,
            selectedState,
          });
        },
      );
    } else {
      // Clear the events list when no events are found for the selected category
      const stateNameList = await this.mergeFanProfileStatesIntoList(
        this.sortStateName(['All']),
      );
      this.setState(
        {
          authenticatedEventsList: [],
          stateNameList,
          filteredEventList: [],
          isLoading: false,
          visibleShowsCount: HOME_FEED_PAGE_SIZE,
        },
        () => {
          this.saveHomeFeedEventsCache({
            authenticatedEventsList: [],
            filteredEventList: [],
            stateNameList,
            selectedState: this.state.selectedState,
          });
        },
      );
    }
  };

  refreshUserSelectionStateList = async () => {
    try {
      const authToken = await getStorageData('authToken');
      const url = `${baseURL}${configJSON.getUserSelectionEndPoint}`;
      const headers = {
        'Content-Type': configJSON.validationApiContentType,
        ...(authToken ? { token: authToken } : {}),
      };
      console.log('[renderStates] refreshUserSelectionStateList API:', url);
      console.log('[renderStates] refreshUserSelectionStateList payload:', {
        method: 'GET',
        headers,
      });
      const res = await fetch(url, {
        method: 'GET',
        headers,
      });
      const json = await res.json().catch(() => ({}));
      console.log('[renderStates] refreshUserSelectionStateList response:', json);
      const states =
        json?.data?.attributes?.states &&
        Array.isArray(json.data.attributes.states) &&
        json.data.attributes.states.length > 0
          ? json.data.attributes.states
          : null;
      if (states && states.length > 0) {
        const merged = await this.mergeFanProfileStatesIntoList(
          this.sortStateName(['All', ...states]),
        );
        this.setState({ stateNameList: merged });
      }
    } catch (_err) {
      // Keep existing stateNameList on error
    }
  };

  getStateList = async (regions: { [key: string]: any[] }): Promise<string[]> => {
    try {
      const authToken = await getStorageData('authToken');
      const url = `${baseURL}${configJSON.getUserSelectionEndPoint}`;
      const headers = {
        'Content-Type': configJSON.validationApiContentType,
        ...(authToken ? { token: authToken } : {}),
      };
      console.log('[renderStates] getStateList API:', url);
      console.log('[renderStates] getStateList payload:', {
        method: 'GET',
        headers,
      });
      const res = await fetch(url, {
        method: 'GET',
        headers,
      });
      const json = await res.json().catch(() => ({}));
      console.log('[renderStates] getStateList response:', json);
      const states =
        json?.data?.attributes?.states &&
        Array.isArray(json.data.attributes.states) &&
        json.data.attributes.states.length > 0
          ? json.data.attributes.states
          : null;
      if (states && states.length > 0) {
        const merged = await this.mergeFanProfileStatesIntoList(
          this.sortStateName(['All', ...states]),
        );
        console.log('[renderStates] getStateList final (from user selection):', merged);
        return merged;
      }
    } catch (_err) {
      console.log('[renderStates] getStateList user selection API failed, using regions fallback');
    }
    const stateList = ['All', 'California'];
    Object.keys(regions).forEach(regionKey => {
      const regionShows = regions[regionKey];
      if (Array.isArray(regionShows) && regionShows.length > 0) {
        stateList.push(regionKey);
      }
    });
    const fallback = await this.mergeFanProfileStatesIntoList(
      this.sortStateName(stateList),
    );
    console.log('[renderStates] getStateList final (from events regions fallback):', fallback);
    return fallback;
  };

  sortStateName = (stateList: string[]) => {
    const unique = [...new Set(stateList)];
    unique.sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a.localeCompare(b);
    });
    return unique;
  };

  /** Fan profile stores home state(s) in storage; merge so the state picker always lists them. */
  mergeFanProfileStatesIntoList = async (
    stateList: string[],
  ): Promise<string[]> => {
    const userRole = await getStorageData('userRole');
    if (String(userRole).toLowerCase() !== 'fan') {
      return stateList;
    }
    const home = await getStorageData('user_state');
    const alt = await getStorageData('alternate_state');
    const extras = [home, alt].filter(
      (s): s is string =>
        typeof s === 'string' && s.trim() !== '' && s !== 'null',
    );
    if (extras.length === 0) {
      return stateList;
    }
    return this.sortStateName([...stateList, ...extras]);
  };

  getTransformedData = (regions: {
    [key: string]: any[];
  }): { state_name: string; shows: any[] }[] => {
    const newData: any = [];
    Object.keys(regions).forEach(regionKey => {
      const shows = regions[regionKey];
      if (Array.isArray(shows) && shows.length > 0) {
        const filteredShows = this.getFilteredShows(shows);
        if (filteredShows.length > 0) {
          const transformedShows = this.getTransformedShows(filteredShows);
          newData.push({ state_name: regionKey, shows: transformedShows });
        }
      }
    });
    return newData;
  };

  getFilteredShows = (shows: any[]): any[] => {
    if (!Array.isArray(shows)) {
      return [];
    }
    return shows.filter(
      item =>
        item &&
        typeof item === 'object' &&
        (item.type === 'show' || item.type === 'post'),
    );
  };

  getTransformedShows = (filteredShows: any[]): any[] => {
    return filteredShows.map(
      ({
        id,
        event_title,
        name,
        date_of_the_show,
        created_at,
        updated_at,
        time = '',
        description = '',
        city = '',
        state = '',
        country = '',
        address = '',
        location,
        zip_code = '',
        like_by_me,
        added_in_calendar = false,
        account_id,
        type_of_show = '',
        category_id = null,
        lat = '',
        long = '',
        genre = null,
        type,
        likes_count = 0,
        comments_count = 0,
        show_features = [],
        line_ups = [],
        images_and_videos,
        profile_image,
        band_name,
        band_profile_image,
      }) => ({
        id,
        event_title: event_title || name,
        date_of_the_show: date_of_the_show || created_at,
        time,
        line_up: null,
        description,
        created_at,
        updated_at: updated_at,
        city,
        state,
        country,
        address,
        location,
        zip_code,
        like_by_me,
        added_in_calendar,
        account_id,
        type_of_show,
        category_id,
        lat,
        long,
        genre,
        type,
        likes_count,
        comments_count,
        show_features,
        line_ups,
        profile_image:
          images_and_videos && images_and_videos.length > 0
            ? images_and_videos[0]
            : profile_image,
        band_name,
        band_profile_image,
      }),
    );
  };

  handleLikeDislikeEventResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (responseJson != null && !responseJson.errors) {
      if (this.state.from === 'list') {
        this.updateEventList();
      } else if (this.state.from === 'detail') {
        this.updateEventDetail();
      }
      if (this.isEventDetailScreen()) {
        this.safeSetState({ detailsLoading: false });
      }
    } else {
      if (this.isEventDetailScreen()) {
        this.safeSetState({ detailsLoading: false });
      }
      this.parseApiErrorResponse(responseJson);
    }
  };

  updateEventList = () => {
    const mockEventList = this.state.authenticatedEventsList.map(event => {
      return {
        ...event,
        shows: (Array.isArray(event.shows) ? event.shows : []).map(
          (show: any) => {
            if (show.id === this.state.selectedEventId) {
              return this.updateShowLike(show);
            }
            return show;
          },
        ),
      };
    });

    this.setState({ authenticatedEventsList: mockEventList });
  };

  updateEventDetail = () => {
    const { eventDetail } = this.state;
    if (!eventDetail?.attributes) {
      return;
    }

    const wasLiked = Boolean(eventDetail.attributes.like_by_me);
    const likesCount = parseInt(eventDetail.attributes.likes_count, 10) || 0;

    this.setState({
      eventDetail: {
        ...eventDetail,
        attributes: {
          ...eventDetail.attributes,
          like_by_me: !wasLiked,
          likes_count: wasLiked ? Math.max(0, likesCount - 1) : likesCount + 1,
        },
      },
      detailsLoading: false,
    });
  };

  updateShowLike = (show: any) => {
    return {
      ...show,
      like_by_me: !show.like_by_me,
      likes_count: parseInt(show.likes_count) + (show.like_by_me ? -1 : 1),
    };
  };

  handleAllBandsListApiResponse = (message: Message) => {
    const response = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    if (response != null && !response.errors) {
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
      allBandsListCache = list;
      this.setState({ allBandsList: list });
    } else {
      this.setState({ isLoading: false });
    }
  };

  handleEventDetailApiResponse = (message: Message) => {
    // Clear timeout since we got API response
    if (this.loadingTimeoutId) {
      clearTimeout(this.loadingTimeoutId);
    }

    const response = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );

    const detailLoadFailedState = {
      isLoading: false,
      detailsLoading: false,
      detailsLoadError: this.isEventDetailScreen()
        ? 'Unable to load show details. Please try again.'
        : null,
    };

    // Handle error response
    if (errorResponse) {
      this.parseApiErrorResponse(errorResponse);
      this.setState(detailLoadFailedState);
      return;
    }

    if (response != null && !response.errors) {
      try {
        const result = this.handleLineups(response);
        if (!result?.attributes) {
          throw new Error('Invalid event detail response');
        }
        this.setState(
          {
            eventDetail: result,
            isLoading: false,
            detailsLoading: false,
            detailsLoadError: null,
          },
          () => {
            this.prefetchDetailComments(result);
          },
        );
      } catch {
        this.setState(detailLoadFailedState);
      }
    } else {
      this.parseApiErrorResponse(response);
      this.setState(detailLoadFailedState);
    }
  };

  handleLineups = (responseData: any) => {
    const attributes = responseData?.data?.attributes;
    if (!attributes) {
      throw new Error('Missing event attributes');
    }

    const rawLineups = Array.isArray(attributes.line_ups)
      ? attributes.line_ups
      : [];
    const line_ups = rawLineups.map((lineupName: any) => {
      const band = this.state.allBandsList.find(
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
    });

    return {
      ...responseData,
      attributes: {
        ...attributes,
        line_ups: line_ups,
      },
    };
  };

  getAuthToken = async () => {
    this.getUnreadChatCount();
    const authToken = await getStorageData('authToken');
    const userId = await getStorageData('user_id');
    const userProfilePic = await getStorageData('user_profile_pic');
    this.setState(
      { authToken: authToken, userId: userId, userProfilePic: userProfilePic },
      () => {
        this.getCategoriesListAPI();
        this.getUnreadNotificationsCount();
        if (this.isEventDetailScreen() && this.state.eventDetail?.attributes) {
          this.prefetchDetailComments(this.state.eventDetail);
        }
      },
    );
  };

  handleNotification = () => {
    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   this.handleNotificationNavigation();
    // });
    // messaging()
    //   .getInitialNotification()
    //   .then((remoteMessage) => {
    //     if (remoteMessage) {
    //       this.handleNotificationNavigation();
    //     }
    //   });
    // messaging().onMessage(async (remoteMessage) => {
    //   this.setState({ newNotification: true });
    // });
  };

  showPopup = async () => {
    const popupShown = await getStorageData('popupShown');
    if (popupShown === null) {
      this.modalYesClicked();
    }
  };

  onPressDrawer = () => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    this.props.navigation.openDrawer();
  };

  toggleSeeMore = (stateName: string) => {
    this.setState(prevState => ({
      expandedItems: prevState.expandedItems.includes(stateName)
        ? prevState.expandedItems.filter(state_name => state_name !== stateName)
        : [...prevState.expandedItems, stateName],
    }));
  };

  isHomeFeedShowItem = (item: any, includePosts: boolean) => {
    if (!item || typeof item !== 'object') {
      return false;
    }
    if (item.type === 'show') {
      return true;
    }
    return includePosts && item.type === 'post';
  };

  flattenHomeFeedShows = (eventList: any[], includePosts: boolean) => {
    const flattened: { show: any; group: any }[] = [];
    if (!Array.isArray(eventList)) {
      return flattened;
    }
    eventList.forEach(group => {
      const shows = Array.isArray(group?.shows) ? group.shows : [];
      shows.forEach((show: any) => {
        if (this.isHomeFeedShowItem(show, includePosts)) {
          flattened.push({ show, group });
        }
      });
    });
    return flattened;
  };

  getVisibleHomeFeedGroups = (eventList: any[], includePosts: boolean) => {
    const flattened = this.flattenHomeFeedShows(eventList, includePosts);
    const visibleShowsCount =
      this.state.visibleShowsCount > 0
        ? this.state.visibleShowsCount
        : HOME_FEED_PAGE_SIZE;
    const visible = flattened.slice(0, visibleShowsCount);
    const groups: any[] = [];
    const groupIndexByKey: Record<string, number> = {};
    visible.forEach(({ show, group }) => {
      const key = String(group?.state_name ?? '');
      if (groupIndexByKey[key] === undefined) {
        groupIndexByKey[key] = groups.length;
        groups.push({ ...group, shows: [show] });
      } else {
        groups[groupIndexByKey[key]].shows.push(show);
      }
    });
    return {
      groups,
      totalShowCount: flattened.length,
      hasMoreShows: flattened.length > visibleShowsCount,
    };
  };

  handleShowMore = () => {
    this.setState(prevState => ({
      visibleShowsCount: prevState.visibleShowsCount + HOME_FEED_PAGE_SIZE,
    }));
  };

  openPrefs = () => {
    Linking.canOpenURL('App-Prefs:LOCATION_SERVICES')
      .then(supported => {
        if (supported) {
          Linking.openURL('App-Prefs:LOCATION_SERVICES').catch(() => {
            Alert.alert('Failed to open settings');
          });
        } else {
          Linking.openSettings().catch(() => {
            Alert.alert('Failed to open settings');
          });
        }
      })
      .catch(_error => {});
  };

  requestLocationPermissionIos = async () => {
    // Location is disabled on iOS for this app.
    return false;
  };

  hasLocationPermissionIOS = async () => {
    // Location is disabled on iOS for this app.
    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await this.hasLocationPermissionIOS();
      return status;
    }

    if (Platform.OS === 'android' && +Platform.Version < 23) {
      return true;
    }

    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission === null) {
        return false;
      }

      return hasPermission;
    } catch (error) {
      return false;
    }
  };

  requestLocationPermission = async () => {
    let status = false;

    if (Platform.OS === 'ios') {
      status = await this.requestLocationPermissionIos();
    } else {
      status = await this.requestLocationPermissionAndroid();
    }

    return status;
  };

  requestLocationPermissionAndroid = async () => {
    try {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (status === null) {
        return false;
      }

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Location Permission Required',
          'Location permission has been permanently denied. Please enable it in the app settings to see events near you.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }

    } catch (_error) {}

    return false;
  };

  /**
   * Reverse-geocode device coordinates so the state filter dropdown can list
   * the user's current location state alongside API / event states.
   */
  resolveCurrentLocationStateForDropdown = async (
    latitude: number,
    longitude: number,
  ) => {
    try {
      if (!Geocoder.isInit()) {
        Geocoder.init('AIzaSyAQu429K52drmir9450TvUYcy82ZL3QQ9I');
      }
      const json = await Geocoder.from(latitude, longitude);
      if (json.status !== 'OK' || !json.results?.[0]?.address_components) {
        return;
      }
      const components = json.results[0].address_components;
      const stateComp = components.find((c: { types: string[] }) =>
        c.types.includes('administrative_area_level_1'),
      );
      const stateName = stateComp?.long_name?.trim();
      if (stateName && this.isComponentMounted) {
        this.safeSetState({ currentLocationState: stateName });
      }
    } catch (_err) {
      // Optional; feed still loads via lat/long
    }
  };

  getEventsFromLocation = () => {
    if (Platform.OS === 'ios') {
      this.getEventsListAPI(true);
      return;
    }

    if (!DEVICE_GEOLOCATION_ENABLED_FOR_FEED) {
      this.getEventsListAPI(true);
      return;
    }
    if (!this.state.hasLocationPermission) {
      this.getEventsListAPI(true); // Skip location check
      return;
    }

    const requestPosition = () => {
      if (!this.isComponentMounted) {
        return;
      }
      try {
        GeolocationServices.getCurrentPosition(
          position => {
            if (this.isComponentMounted) {
              const { latitude, longitude } = position.coords;
              void this.resolveCurrentLocationStateForDropdown(
                latitude,
                longitude,
              );
              this.getEventsByLatLong(latitude, longitude);
            }
          },
          _error => {
            this.getEventsListAPI(true);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } catch (_error) {
        this.getEventsListAPI(true);
      }
    };

    // Avoid calling fused location while the feed header / lists are still mounting (reduces native crashes on Android).
    if (Platform.OS === 'android') {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(requestPosition, 80);
      });
    } else {
      requestPosition();
    }
  };

  getEventsByLatLong = (latitude: number, longitude: number) => {
    if (!this.hasCachedHomeFeedEvents()) {
      this.safeSetState({ isLoading: true });
    }
    const getEventsListAPIMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getEventsListApiCallId = getEventsListAPIMsg.messageId;

    const categoryID =
      this.state.selectedCategoryID === '0'
        ? ''
        : this.state.selectedCategoryID;
    if (this.state.authToken) {
      // Build query parameters for logged-in users with location
      const queryParams = [];
      if (this.state.searchText.trim()) {
        queryParams.push(`query=${encodeURIComponent(this.state.searchText.trim())}`);
      }
      if (categoryID) {
        queryParams.push(`category_id=${categoryID}`);
      }
      queryParams.push(`latitude=${latitude}`);
      queryParams.push(`longitude=${longitude}`);
      // Add sort_by parameter if selected
      if (this.state.selectedSortBy) {
        queryParams.push(`sort_by=${this.state.selectedSortBy}`);
      }
      // Add state parameter if selected and not 'All'
      if (this.state.selectedState && this.state.selectedState !== 'All') {
        queryParams.push(`state=${encodeURIComponent(this.state.selectedState)}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const endpoint = `${configJSON.userEventsEndPoint}${queryString}`;
      this.lastEventsListApiUrl = `${baseURL}${endpoint}`;
      console.log('[HomeFeed] getEventsByLatLong API URL:', this.lastEventsListApiUrl);
      console.log('[HomeFeed] getEventsByLatLong payload:', {
        method: configJSON.validationApiMethodType,
        headers: {
          'Content-Type': configJSON.validationApiContentType,
          token: this.state.authToken,
        },
        queryParams,
      });
      getEventsListAPIMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      getEventsListAPIMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          'Content-Type': configJSON.validationApiContentType,
          token: this.state.authToken,
        }),
      );
    } else {
      // Build query parameters for guest users with location
      const queryParams = [];
      if (this.state.searchText) {
        queryParams.push(`query=${encodeURIComponent(this.state.searchText)}`);
      }
      if (categoryID) {
        queryParams.push(`category_id=${categoryID}`);
      }
      queryParams.push(`latitude=${latitude}`);
      queryParams.push(`longitude=${longitude}`);
      // Add sort_by parameter if selected
      if (this.state.selectedSortBy) {
        queryParams.push(`sort_by=${this.state.selectedSortBy}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const endpoint = `${configJSON.guestEventsEndPoint}${queryString}`;
      this.lastEventsListApiUrl = `${baseURL}${endpoint}`;
      console.log('[HomeFeed] getEventsByLatLong API URL:', this.lastEventsListApiUrl);
      console.log('[HomeFeed] getEventsByLatLong payload:', {
        method: configJSON.validationApiMethodType,
        headers: { 'Content-Type': configJSON.validationApiContentType },
        queryParams,
      });
      getEventsListAPIMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      getEventsListAPIMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          'Content-Type': configJSON.validationApiContentType,
        }),
      );
    }
    getEventsListAPIMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getEventsListAPIMsg.id, getEventsListAPIMsg);
  };

  modalYesClicked = async () => {
    setStorageData('popupShown', 'true');
    this.setState({
      modalVisible: false,
    });
    if (!DEVICE_GEOLOCATION_ENABLED_FOR_FEED) {
      this.getEventsListAPI(true);
      return;
    }
    const status = await this.hasLocationPermission();
    if (status) {
      this.getEventsFromLocation();
    } else {
      const granted = await this.requestLocationPermission();
      if (granted) {
        this.getEventsFromLocation();
      }
    }
  };

  getPermissionErrorMessage = (status: string | null) => {
    if (status === null) {
      return 'Permission request was cancelled or failed';
    }

    switch (status) {
      case PermissionsAndroid.RESULTS.DENIED:
        return 'Permission denied';
      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        return 'Never ask again';
      case PermissionsAndroid.RESULTS.GRANTED:
        return 'Permission granted';
      default:
        return `Unknown permission status: ${status}`;
    }
  };

  getEventsListAPI = (
    skipLocationCheck?: boolean,
    options?: { silent?: boolean },
  ) => {
    if (!options?.silent && !this.hasCachedHomeFeedEvents()) {
      this.safeSetState({ isLoading: true });
    }
    if (!skipLocationCheck && this.state.hasLocationPermission) {
      this.getEventsFromLocation();
      return;
    }

    const getEventsListMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getEventsListApiCallId = getEventsListMsg.messageId;

    const category_id =
      this.state.selectedCategoryID === '0'
        ? ''
        : this.state.selectedCategoryID;

    if (this.state.authToken) {
      // Build query parameters for logged-in users
      const queryParams = [];
      if (this.state.searchText.trim()) {
        queryParams.push(`query=${encodeURIComponent(this.state.searchText.trim())}`);
      }
      if (category_id) {
        queryParams.push(`category_id=${category_id}`);
      }
      // Add sort_by parameter if selected
      if (this.state.selectedSortBy) {
        queryParams.push(`sort_by=${this.state.selectedSortBy}`);
      }
      // Add state parameter if selected and not 'All'
      if (this.state.selectedState && this.state.selectedState !== 'All') {
        queryParams.push(`state=${encodeURIComponent(this.state.selectedState)}`);
      }
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const endpoint = `${configJSON.userEventsEndPoint}${queryString}`;
      this.lastEventsListApiUrl = `${baseURL}${endpoint}`;
      console.log('[HomeFeed] getEventsListAPI URL:', this.lastEventsListApiUrl);
      console.log('[HomeFeed] getEventsListAPI payload:', {
        method: configJSON.validationApiMethodType,
        headers: {
          'Content-Type': configJSON.validationApiContentType,
          token: this.state.authToken,
        },
        queryParams,
      });
      getEventsListMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      getEventsListMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          'Content-Type': configJSON.validationApiContentType,
          token: this.state.authToken,
        }),
      );
    } else {
      // Build query parameters for guest users
      const queryParams = [];
      if (this.state.searchText) {
        queryParams.push(`query=${encodeURIComponent(this.state.searchText)}`);
      }
      if (category_id) {
        queryParams.push(`category_id=${category_id}`);
      }
      if (this.state.selectedSortBy) {
        queryParams.push(`sort_by=${this.state.selectedSortBy}`);
      }
      if (this.state.selectedState && this.state.selectedState !== 'All') {
        queryParams.push(`state=${encodeURIComponent(this.state.selectedState)}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const endpoint = `${configJSON.guestEventsEndPoint}${queryString}`;
      this.lastEventsListApiUrl = `${baseURL}${endpoint}`;
      console.log('[HomeFeed] getEventsListAPI URL:', this.lastEventsListApiUrl);
      console.log('[HomeFeed] getEventsListAPI payload:', {
        method: configJSON.validationApiMethodType,
        headers: { 'Content-Type': configJSON.validationApiContentType },
        queryParams,
      });
      getEventsListMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      getEventsListMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          'Content-Type': configJSON.validationApiContentType,
        }),
      );
    }
    getEventsListMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getEventsListMsg.id, getEventsListMsg);
  };

  formatEventMonth = (eventDate: string) => {
    const inputDate = new Date(eventDate);
    if (Number.isNaN(inputDate.getTime())) {
      return '';
    }
    // Use UTC so the badge matches the show calendar date from the API
    // (local getMonth + UTC getDate caused mismatches like "Aug 1" for Sep 1).
    const formattedMonth = monthNames[inputDate.getUTCMonth()];
    return formattedMonth;
  };

  formatEventDate = (eventDate: string) => {
    const inputDate = new Date(eventDate);
    if (Number.isNaN(inputDate.getTime())) {
      return '';
    }
    return inputDate.getUTCDate();
  };

  likeDislikeEventAPI = (type: string) => {
    const likeShowData = {
      like: {
        show_id: this.state.selectedEventId,
      },
    };
    const likePostData = {
      like: {
        post_id: this.state.selectedEventId,
      },
    };
    const postLikeDislikeEventMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    const endpoint =
      type === 'show'
        ? configJSON.likeDiskeEventEndPoint
        : configJSON.pictureLikeEndpoint;
    const body =
      type === 'show'
        ? JSON.stringify(likeShowData)
        : JSON.stringify(likePostData);
    this.postLikeDislikeEventApiCallId = postLikeDislikeEventMsg.messageId;

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      body,
    );

    postLikeDislikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(postLikeDislikeEventMsg.id, postLikeDislikeEventMsg);
  };

  getAllBandsList = async () => {
    const authToken = await getStorageData('authToken');
    const getAllBandsRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getAllBandsListApiCallId = getAllBandsRequestMsg.messageId;

    getAllBandsRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.allBandsEndpoint,
    );

    getAllBandsRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: authToken,
      }),
    );

    getAllBandsRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getAllBandsRequestMsg.id, getAllBandsRequestMsg);
  };

  getEventDetailAPI = async () => {
    const authToken = await getStorageData('authToken');
    const userId = await getStorageData('user_id');
    const getEventsListMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getEventDetailApiCallID = getEventsListMsg.messageId;

    const { eventDetailEndPoint } = configJSON;
    const { selectedEventId } = this.state;
    const eventId = selectedEventId === '0' ? '' : selectedEventId;

    const endpoint = authToken
      ? `${eventDetailEndPoint}/${eventId}?account_id=${userId}`
      : `${eventDetailEndPoint}/${eventId}`;

    getEventsListMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    getEventsListMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
      }),
    );

    getEventsListMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getEventsListMsg.id, getEventsListMsg);
  };

  openGoogleMaps = (data: any) => {
    if (data) {
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
        .catch(() => {});
    }
  };

  openWebsiteURL = (website: string) => {
    const link =
      website.includes('http://') || website.includes('https://')
        ? website
        : 'https://' + website;
    Linking.canOpenURL(link)
      .then(supported => {
        if (supported) {
          Linking.openURL(link);
        }
      })
      .catch(() => {});
  };

  addEventToCalendarAPI = () => {
    const addEventToCalendarMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addEventToCalendarAPICallID = addEventToCalendarMsg.messageId;

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.addEventToCalendarEndPoint}${this.state.selectedEventId}`,
    );

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(addEventToCalendarMsg.id, addEventToCalendarMsg);
  };

  filterEvents = () => {
    const dataList = [...this.state.authenticatedEventsList];
    const filteredEvent = dataList.filter(
      (event: any) => event.state_name === this.state.selectedState,
    );
    this.setState({ filteredEventList: filteredEvent, isLoading: false });
  };

  moveToLoginScreen = (navigateTo: string) => {
    this.setState({ loginPopup: false }, () => {
      if (navigateTo === 'login')
        this.props.navigation.navigate('EmailAccountLoginBlock');
      else this.props.navigation.navigate('Rolesandpermissions');
    });
  };

  getCategoriesListAPI = () => {
    const getCategoriesListMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCategoriesListAPICallID = getCategoriesListMsg.messageId;

    getCategoriesListMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.allCategoriesEndPoint,
    );

    getCategoriesListMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
      }),
    );

    getCategoriesListMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getCategoriesListMsg.id, getCategoriesListMsg);
  };

  performSearch = async () => {
    try {
      this.setState({ visibleShowsCount: HOME_FEED_PAGE_SIZE });
      this.getEventsListAPI();
    } catch (_error) {}
  };

  debouncedSearch = _.debounce(this.performSearch, 1000);

  handleSearchTxtChange = (text: string) => {
    this.setState({ searchText: text.replace('  ', ' ') });
    this.debouncedSearch();
  };

  convertTime(timeString: string) {
    const hours = timeString.substring(0, 2);
    const minutes = timeString.substring(3, 5);
    const convertedTime = hours + 'h' + minutes;
    return convertedTime;
  }

  convertDateFormat = (inputDate: string) => {
    return moment.utc(inputDate).format('dddd, MMM D, YYYY');
  };
  handleEmojiSelected = (emoji: string) => {
    this.setState({ commentText: this.state.commentText + emoji });
  };

  handleShowCommentClicked = async (eventId: string, type: string) => {
    const postType = type === 'show' ? 'Show' : 'BxBlockPosts::Post';
    this.setState({
      showComments: true,
      eventId,
      type: postType,
      commentText: '',
      isLoadingComments: true,
    });
    this.getCommentsAPI(eventId, postType);
  };

  refreshCommentsAfterCreation = () => {
    const message = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getCommentsAPICallID = message.messageId;

    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getCommentsEndpoint}?commentable_id=${this.state.eventId}&commentable_type=${this.state.type}`,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(message.id, message);
  };

  getCommentsAPI = async (eventId: string, type: any) => {
    this.setState({ commentsLoading: true });
    const authToken =
      this.state.authToken || (await getStorageData('authToken'));
    if (authToken && authToken !== this.state.authToken) {
      this.setState({ authToken });
    }
    const message = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getCommentsAPICallID = message.messageId;

    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getCommentsEndpoint}?commentable_id=${eventId}&commentable_type=${type}`,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: authToken,
      }),
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(message.id, message);
  };

  createComment = () => {
    const commentText = this.state.commentText.trim();
    const isNewComment =
      !this.state.isEditing && !this.state.replying && !this.state.showReplies;

    const optimisticList = isNewComment
      ? [
          {
            id: `optimistic-${Date.now()}`,
            key: `optimistic-${Date.now()}`,
            attributes: {
              comment: commentText,
              created_at: new Date().toISOString(),
              account: { first_name: 'You' },
              account_id: this.state.userId,
              replies: [],
              like_by_me: false,
              profile_image_url: this.state.userProfilePic || null,
            },
            },
          ...this.state.commentsList,
        ]
      : this.state.commentsList;

    this.setState({
      commentText: '',
      showRepliesFor: [],
      // Only show loading overlay for reply/edit; new comments appear optimistically
      ...(isNewComment ? { commentsList: optimisticList } : { commentsLoading: true }),
    });

    const message = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.createCommentAPICallID = message.messageId;

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

    const dataToSend = {
      comment: {
        commentable_id: this.state.eventId,
        commentable_type: this.state.type,
        comment: this.state.commentText.trim(),
      },
    };
    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(message.id, message);

    // Timeout fallback to clear loading state if API never responds
    setTimeout(() => {
      if (this.isComponentMounted && this.state.commentsLoading) {
        this.setState({
          commentsLoading: false,
          commentText: '',
        });
      }
    }, 8000);
  };

  handleReply = (commentId: string) => {
    this.setState({ replying: true, commentId });
    this.commentTextInput.focus();
  };

  handleSubmitEditing = () => {
    if (this.state.commentText.trim() !== '') {
      this.hideKeyboard();
      if (this.state.replying || this.state.showReplies) {
        this.replyToComment();
      } else {
        this.createComment();
      }
    }
  };

  replyToComment = () => {
    const replyText = this.state.commentText.trim();
    const parentCommentId = this.state.commentId;
    const isInRepliesModal = this.state.showReplies;

    const optimisticReply = {
      id: `optimistic-reply-${Date.now()}`,
      key: `optimistic-reply-${Date.now()}`,
      account_id: this.state.userId,
      account_type: 'AccountBlock::User',
      account_name: 'You',
      profile_image: this.state.userProfilePic || null,
      reply: replyText,
      created_at: new Date().toISOString(),
    };

    if (isInRepliesModal && this.state.commentWithReply?.attributes) {
      const currentReplies =
        this.state.commentWithReply.attributes.replies || [];
      this.setState({
        commentText: '',
        showRepliesFor: [],
        replying: false,
        commentWithReply: {
          ...this.state.commentWithReply,
          attributes: {
            ...this.state.commentWithReply.attributes,
            replies: [optimisticReply, ...currentReplies],
          },
        },
      });
    } else {
      const commentIndex = this.state.commentsList.findIndex(
        (c: any) => c.id === parentCommentId,
      );
      if (commentIndex !== -1) {
        const comment = this.state.commentsList[commentIndex];
        const currentReplies = comment.attributes?.replies || [];
        const updatedCommentsList = [...this.state.commentsList];
        updatedCommentsList[commentIndex] = {
          ...comment,
          attributes: {
            ...comment.attributes,
            replies: [optimisticReply, ...currentReplies],
          },
        };
        this.setState({
          commentText: '',
          showRepliesFor: [],
          replying: false,
          commentsList: updatedCommentsList,
        });
      } else {
        this.setState({
          commentText: '',
          showRepliesFor: [],
          replying: false,
        });
      }
    }

    const replyToCommentRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createCommentAPICallID = replyToCommentRequestMsg.messageId;

    let endpoint;
    if (this.state.isEditing) {
      endpoint = `${configJSON.createCommentEndpoint}/${this.state.replyId}`;
    } else {
      endpoint = configJSON.createCommentEndpoint;
    }

    const methodType = this.state.isEditing
      ? `${configJSON.putApiMethodType}`
      : configJSON.postApiMethodType;

    const dataToSend = {
      comment: {
        commentable_id: parentCommentId,
        commentable_type: 'BxBlockComments::Comment',
        comment: replyText,
      },
    };

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(
      replyToCommentRequestMsg.id,
      replyToCommentRequestMsg,
    );

    // Timeout fallback to clear loading state if API never responds
    setTimeout(() => {
      if (this.isComponentMounted && this.state.commentsLoading) {
        this.setState({ commentsLoading: false, commentText: '' });
      }
    }, 8000);
  };

  likeComment = (comment_id: string) => {
    // Find the comment in the current comments list
    const commentIndex = this.state.commentsList.findIndex(
      (comment: any) => comment.id === comment_id,
    );

    if (commentIndex === -1) {
      return;
    }

    const comment = this.state.commentsList[commentIndex];
    const isCurrentlyLiked = comment.attributes.like_by_me;
    const currentLikesCount = comment.attributes.likes_count || 0;

    // Optimistic UI update - immediately update the UI
    const updatedCommentsList = [...this.state.commentsList];
    updatedCommentsList[commentIndex] = {
      ...comment,
      attributes: {
        ...comment.attributes,
        like_by_me: !isCurrentlyLiked,
        likes_count: isCurrentlyLiked
          ? currentLikesCount - 1
          : currentLikesCount + 1,
      },
    };

    this.setState({
      commentsList: updatedCommentsList,
    });

    // Now make the API call
    const likeCommentRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.likeCommentAPICallID = likeCommentRequestMsg.messageId;

    const dataToSend = {
      like: {
        comment_id,
      },
    };

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeCommentEndpoint,
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(likeCommentRequestMsg.id, likeCommentRequestMsg);
  };

  closeRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  deleteCommentAPI = (commentID: string) => {
    this.setState({
      commentsLoading: true,
      commentText: '',
      showRepliesFor: [],
    });

    const message = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.createCommentAPICallID = message.messageId;

    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.createCommentEndpoint}/${commentID}`,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteApiMethodType,
    );

    runEngine.sendMessage(message.id, message);
  };

  timeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'm', seconds: 2592000 },
      { label: 'w', seconds: 604800 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
      { label: 's', seconds: 1 },
    ];

    const result = intervals.find(interval => seconds >= interval.seconds);

    if (result) {
      const count = Math.floor(seconds / result.seconds);
      return `${count}${result.label}`;
    }

    return 'just now';
  }

  handleShareNavigation = async (shareId: string, eventType?: string) => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Share');

    const info = {
      eventId: shareId,
      eventType,
    };

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  showProfile = async (accountId: string, accountType: string) => {
    if (this.state.authToken) {
      this.setState({ showComments: false, showReplies: false });

      await setStorageData('profileIdToLoad', `${accountId}`);
      await setStorageData('IsFromComment', JSON.stringify(true));

      const screen =
        accountType === 'Band' || accountType === 'Artist'
          ? 'UserProfileBasicBlockArtist2'
          : 'UserProfileBasicBlock2';
      if (this.state.userId === accountId.toString()) {
        this.props.navigation.navigate('Profile', {
          isOtherUser: false,
        });
      } else {
        this.props.navigation.push(screen, {
          isOtherUser: true,
        });
      }
    } else {
      this.setState({ loginPopup: true });
    }
  };

  formatEventCreatorAccountTypeLabel = (accountType: string) => {
    const map: Record<string, string> = {
      'Record Label': 'Record Label',
      Record_Label: 'Record Label',
      Promoter: 'Promoter',
      Booking_Agent: 'Booking Agent',
      Agency: 'Agency',
    };
    if (map[accountType]) return map[accountType];
    return accountType.replace(/_/g, ' ');
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

  /** Same as PostDetails category row — opens other-user profile for event creator account types. */
  openEventCreatorProfileForCategoryRow = async (
    accountId: string,
    _accountType?: string | null,
  ) => {
    if (!this.state.authToken) {
      this.setState({ loginPopup: true });
      return;
    }
    await setStorageData('profileIdToLoad', `${accountId}`);
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'UserProfileBasicBlockArtist2',
    );
    this.send(message);
  };

  handleThreeDots = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  openReportModal = () => {
    this.setState({
      showReportModal: true,
      showMenu: false,
      reportReason: '',
      reportComment: '',
      reportError: '',
    });
  };

  closeReportModal = () => {
    this.setState({
      showReportModal: false,
      reportError: '',
    });
  };

  selectReportReason = (reason: string) => {
    this.setState({
      reportReason: reason,
      reportError: '',
    });
  };

  handleReportCommentChange = (text: string) => {
    this.setState({ reportComment: text });
  };

  submitReport = () => {
    if (!this.state.reportReason) {
      this.setState({ reportError: 'Please select a reason to continue.' });
      return;
    }

    const showId =
      this.state.selectedEventId ||
      this.state.eventDetail?.data?.id ||
      this.state.eventDetail?.attributes?.id;

    if (!showId) {
      this.setState({
        reportError: 'Unable to submit report right now. Please try again.',
      });
      return;
    }

    const message: Message = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.reportShowApiCallId = message.messageId;

    const body = {
      report: {
        reason: this.state.reportReason,
        comment: this.state.reportComment?.trim() || '',
      },
    };

    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.reportShowEndpoint}/${showId}/reports`,
    );
    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.authToken,
      }),
    );
    message.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body),
    );
    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(message.id, message);
  };

  handleLikeDislikePress = () => {
    if (this.state.authToken) {
      this.setState({ from: 'detail' }, () => this.likeDislikeEventAPI('show'));
    } else {
      this.setState({ loginPopup: true });
    }
  };

  handleLikeTextPress = () => {
    if (this.state.authToken) {
      const info = {
        eventID: this.state.selectedEventId.toString(),
        type: this.state.eventDetail.data?.type,
      };
      this.handleNavigation(
        'Likeapost2',
        info,
        MessageEnum.HelpCentreMessageData,
      );
    } else {
      this.setState({ loginPopup: true });
    }
  };

  handleTicketDirectionButton = () => {
    this.openGoogleMaps(this.state.eventDetail.attributes);
  };

  handleBuyTicketPress = () => {
    const website = this.state.eventDetail.attributes?.website;
    if (website) {
      this.openWebsiteURL(website);
    } else {
      // If no website is available, show coming soon message
      Alert.alert('Buy Ticket', 'Coming soon');
    }
  };

  handleCloseBtn = () => {
    this.setState({ loginPopup: false });
  };

  handleAddToCalendarPress = () => {
    const { eventDetail, authToken } = this.state;
    const addedInCalendar = eventDetail.attributes?.added_in_calendar;

    if (authToken) {
      this.setState({ showMenu: false });
      if (!addedInCalendar)
        this.setState({ from: 'detail' }, () => {
          this.addEventToCalendarAPI();
        });
    } else {
      this.setState({ loginPopup: true, showMenu: false });
    }
  };

  handleShareWithFriends = () => {
    const { id: eventId, type: eventType } = this.state.eventDetail.attributes;
    const { authToken } = this.state;
    if (authToken) {
      this.setState({ showMenu: false }, () => {
        this.handleShareNavigation(eventId, eventType);
      });
    } else {
      this.setState({ loginPopup: true, showMenu: false });
    }
  };

  handleEntireScreen = () => {
    this.setState({ showMenu: false });
  };

  handleRefresh = (options?: { silent?: boolean }) => {
    this.setState({ visibleShowsCount: HOME_FEED_PAGE_SIZE });
    this.getCategoriesListAPI();
    this.getEventsListAPI(undefined, options);
  };

  handleEventNavigation = () => {
    setTimeout(() => {
      const message: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(getName(MessageEnum.NavigationTargetMessage), 'Home');
      this.send(message);
    }, 500);
  };

  handleNotificationNavigation = () => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    // Only reset the newNotification flag, don't reset the count
    // The count should be updated by the API when we return to this screen
    navigateToNotificationsScreen(this.props.navigation);
    this.setState({ newNotification: false });
  };

  handleLike = async (eventId: string, type: string) => {
    this.setState({ selectedEventId: eventId, from: 'list' }, () => {
      this.likeDislikeEventAPI(type);
    });
  };

  handleAddEventToCalendar = async (eventId: string) => {
    this.setState({ selectedEventId: eventId, from: 'list' }, () => {
      this.addEventToCalendarAPI();
    });
  };

  handlePopupCloseButton = () => {
    setStorageData('popupShown', 'true');
    this.setState({
      modalVisible: false,
    });
  };

  handleCloseCommentPopup = () => {
    this.setState({ showComments: false, showRepliesFor: [], replying: false });
  };

  handleCommentTextChange = (commentText: string) => {
    this.setState({ commentText });
  };

  handleCommentOnBlur = () => {
    this.setState({ replying: false });
  };

  handleBackNav = () => {
    this.setState({ expandedItems: [] });
  };

  handleCategoryFilter = (categoryId: string, index: number) => {
    this.setState(
      {
        selectedFilterIndex: index,
        selectedCategoryID: categoryId,
        isLoading: true,
        visibleShowsCount: HOME_FEED_PAGE_SIZE,
      },
      () => {
        this.getEventsListAPI();
      },
    );
  };

  showState = () => {
    this.setState({ stateClicked: true });
  };

  handleStateValueChangeAndroid = (selectedState: string) => {
    this.setState(
      { selectedState, isLoading: true, visibleShowsCount: HOME_FEED_PAGE_SIZE },
      () => {
        this.getEventsListAPI();
      },
    );
  };

  handleStateValueChangeIOS = (selectedState: string) => {
    this.setState(
      {
        stateClicked: false,
        selectedState,
        isLoading: true,
        visibleShowsCount: HOME_FEED_PAGE_SIZE,
      },
      () => {
        this.getEventsListAPI();
      },
    );
  };

  showSort = () => {
    this.setState({ sortClicked: true });
  };

  handleSortValueChangeAndroid = (selectedSortBy: string) => {
    this.setState(
      {
        selectedSortBy,
        isLoading: true,
        visibleShowsCount: HOME_FEED_PAGE_SIZE,
      },
      () => {
        this.getEventsListAPI();
      },
    );
  };

  handleSortValueChangeIOS = (selectedSortBy: string) => {
    this.setState(
      {
        sortClicked: false,
        selectedSortBy,
        isLoading: true,
        visibleShowsCount: HOME_FEED_PAGE_SIZE,
      },
      () => {
        this.getEventsListAPI();
      },
    );
  };

  hideModalSort = () => {
    this.setState({ sortClicked: false });
  };

  handleEditComments = (item: any, rowMap: any) => {
    this.setState(
      {
        commentText: item.attributes.comment,
        isEditing: true,
        commentId: item.id,
      },
      () => {
        this.commentTextInput.focus();
        this.closeRow(rowMap, item.key);
      },
    );
  };

  handleReplyButton = (item: any) => {
    this.setState({
      replying: true,
      commentId: item.id,
      commentWithReply: item,
      showReplies: true,
      showComments: false,
      commentText: '',
    });
  };

  handleEditReply = (item: any, rowMap: any) => {
    this.setState(
      {
        commentText: item.reply,
        isEditing: true,
        replyId: item.id,
        replying: false,
      },
      () => {
        this.commentTextInput.focus();
        this.closeRow(rowMap, item.key);
      },
    );
  };

  handleReplyBackNav = () => {
    this.setState({
      showReplies: false,
      replying: false,
      commentId: '',
      showComments: true,
      commentText: '',
    });
  };

  closeReplyPopup = () => {
    this.setState({
      showComments: true,
      showRepliesFor: [],
      showReplies: false,
      replying: false,
    });
  };

  handleNavigation = (
    screenToNavigate: string,
    infoToSend: Record<string, unknown>,
    _msgData: any,
  ) => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    const navParams = { ...infoToSend };
    if (typeof this.props.navigation.push === 'function') {
      this.props.navigation.push(screenToNavigate, navParams);
    } else {
      this.props.navigation.navigate(screenToNavigate, navParams);
    }
  };

  navigateToBandProfile = async (accountId: number) => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    if (accountId == null || `${accountId}` === '') {
      return;
    }
    if (!this.state.authToken) {
      this.setState({ loginPopup: true });
      return;
    }

    await setStorageData('profileIdToLoad', `${accountId}`);

    if (this.state.userId === accountId.toString()) {
      this.props.navigation.navigate('Profile', {
        isOtherUser: false,
      });
      return;
    }

    const screen = 'UserProfileBasicBlockArtist2';
    const params = { isOtherUser: true };
    try {
      if (typeof this.props.navigation.push === 'function') {
        this.props.navigation.push(screen, params);
        return;
      }
    } catch (_error) {}
    try {
      if (typeof this.props.navigation.navigate === 'function') {
        this.props.navigation.navigate(screen, params);
        return;
      }
    } catch (_error) {}

    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), screen);
    this.send(message);
  };

  showTokenExpiredPopup = () => {
    Alert.alert(`Token has been expired.`, '', [
      { text: 'OK', onPress: this.handleTokenExpired },
    ]);
  };

  handleTokenExpired = async () => {
    await removeStorageData('authToken');
    await removeStorageData('user_id');
    await removeStorageData('user_email');
    await removeStorageData('user_name');
    await removeStorageData('user_profile_pic');
    await removeStorageData('user_phone_number');
    await removeStorageData('userRole');
    await removeStorageData('user_push_notification');
    await removeStorageData('state');
    await removeStorageData('city');
    await removeStorageData('user_title');
    await removeStorageData('administrator_name');
    await removeStorageData('user_country');
    await removeStorageData('user_state');
    setStorageData('userRole', 'fan');
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'HomeTab');
    const authMessage = new Message(getName(MessageEnum.AuthTokenEmailMessage));
    authMessage.addData('token', '');
    runEngine.sendMessage(authMessage.id, authMessage);
  };

  handleEventLaunch = (show: any, stateName: string) => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    if (!show || typeof show !== 'object') {
      return;
    }
    if (`${show.account_id}` === this.state.userId) {
      this.props.navigation.navigate('PostDetails', {
        eventId: show.id,
        eventState: stateName,
      });
    } else {
      const info = {
        eventId: show.id,
        eventState: stateName,
      };
      const screen =
        show.type === 'show' ? 'AllEventDetailScreen' : 'PhotoLibraryDetail';
      const msgData =
        show.type === 'show'
          ? MessageEnum.HelpCentreMessageData
          : MessageEnum.PostDetailDataMessage;
      this.handleNavigation(screen, info, msgData);
    }
  };

  handleLikeNavigation = (id: string, type: any) => {
    const info = {
      eventID: id,
      type,
    };
    this.handleNavigation(
      'Likeapost2',
      info,
      MessageEnum.HelpCentreMessageData,
    );
  };

  openRemoveFromCalendarPopup = () => {
    if (this.state.authToken)
      this.setState({
        removeEventModalVisible: true,
        showMenu: false,
      });
    else this.setState({ loginPopup: true, showMenu: false });
  };

  handleRemoveFromCalendar = () => {
    this.setState({ removeEventModalVisible: false });

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: this.state.authToken,
    };

    const endpoint = `${configJSON.removeEventEndpoint}?show_id=${this.state.selectedEventId}`;

    this.removeEventFromCalendarAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeDelete,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  closeRemoveFromCalendar = () => {
    this.setState({
      removeEventModalVisible: false,
      showMenu: false,
    });
  };

  hideModalState = () => {
    this.setState({ stateClicked: false });
  };

  closeTnCModal = () => {
    this.setState({ showTncModal: false });
  };

  handleTncUpdateCheckOut = async () => {
    this.closeTnCModal();
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'TermsConditions',
    );
    const tAndCAcceptance = await getStorageData('tAndCAcceptance');
    const info = {
      isTermsAndConditionsAccepted: tAndCAcceptance,
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

  showLineupProfile = async (accountId: string, lineupEmail: string) => {
    if (this.state.authToken) {
      this.setState({ showComments: false, showReplies: false });
      const emailMatch = this.state.allBandsList.some(
        item => item.email === lineupEmail,
      );

      if (emailMatch) {
        const userRole = await getStorageData('userRole');
        const targetPage =
          userRole === 'fan'
            ? 'UserProfileBasicBlockArtist2'
            : 'UserProfileBasicBlock2';
        await setStorageData('profileIdToLoad', `${accountId}`);
        const message: Message = new Message(
          getName(MessageEnum.NavigationMessage),
        );
        message.addData(
          getName(MessageEnum.NavigationPropsMessage),
          this.props,
        );
        message.addData(
          getName(MessageEnum.NavigationTargetMessage),
          targetPage,
        );
        this.send(message);
      }
    } else {
      this.setState({ loginPopup: true });
    }
  };

  handleRemoveEventFromCalendarApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (responseJson != null && !responseJson.errors) {
      if (this.state.from === 'detail') {
        // Refresh detail to show "Add to calendar" again
        this.getEventDetailAPI();
      } else {
        // Refresh list
        const { authenticatedEventsList, selectedEventId } = this.state;
        const updatedEventsList = authenticatedEventsList.map(state => ({
          ...state,
          shows: (Array.isArray(state.shows) ? state.shows : []).map(
            (event: any) => ({
              ...event,
              added_in_calendar:
                event.id === selectedEventId ? false : event.added_in_calendar,
            }),
          ),
        }));
        this.setState({ authenticatedEventsList: updatedEventsList });
      }

      Alert.alert('Success', 'Event removed from calendar successfully.', [
        { text: 'OK' },
      ]);
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  goBack = () => {
    if (typeof this.props.navigation.canGoBack === 'function') {
      if (this.props.navigation.canGoBack()) {
        this.props.navigation.goBack();
        return;
      }
    }
    if (typeof this.props.navigation.pop === 'function') {
      this.props.navigation.pop();
    }
  };

  loadHomeTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.safeSetState({ isDarkMode: savedTheme !== 'false' });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.safeSetState({ isDarkMode });
        },
      );
    }
  };

  getHomeTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };
  // Customizable Area End
}
