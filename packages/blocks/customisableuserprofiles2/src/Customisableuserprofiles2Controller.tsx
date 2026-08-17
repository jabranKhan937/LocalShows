import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from './assets';
import {
  getStorageData,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
import { CommonActions } from '@react-navigation/native';
import { Linking, TextInput, ScrollView, View } from 'react-native';
import { RowMap } from 'react-native-swipe-list-view';
import React from 'react';

const monthsShort = [
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

const monthsFull = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface ICommentItem {
  key: string;
  attributes: {
    account_id: number | string;
    account: {
      id: number;
      first_name: string;
      account_type: string;
    };
    profile_image_url: string;
    comment: string;
    created_at: string;
    replies: IReplyItem[];
    likes_count: number;
    like_by_me: boolean;
  };
  id: number;
}

export interface IReplyItem {
  id: number;
  key: string;
  account_id: number | string;
  profile_image: string | null;
  account_name: string;
  reply: string;
  created_at: string;
  account_type: string;
}

// Customizable Area End

export const configJSON = require('./config');

const RULES_AND_REGULATIONS_ICONS_API =
  'https://api.localshows.com/bx_block_roles_permissions/rules_and_regulations_icons';

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  // Customizable Area Start
  isPageLoading: boolean;
  userProfileData: any;
  profileIdToLoad: string;
  userID: string;
  isOtherUser: boolean;
  expandedShows: boolean;
  expandedPosts: boolean;
  commentModalOpen: boolean;
  comments: ICommentItem[];
  comment: string;
  replying: boolean;
  showRepliesFor: string[];
  editingComment: boolean;
  commentId: string;
  commentsLoading: boolean;
  showReplies: boolean;
  commentWithReply: ICommentItem;
  eventId: string;
  replyId: string;
  showTncPopup: boolean;
  isLoadingComments: boolean;
  loadedProfileID: string;
  unreadNotificationCount: number;
  newNotification: boolean;
  showRulesMoreModal: boolean;
  officialRulesAndRegulationsIconsList: { id: number; title: string }[];
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class Customisableuserprofiles2Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  userDetailGetApiCallId: string = '';
  createFollowApiCallID: string = '';
  toggleLikeApiCallId: string = '';
  commentTextInput: TextInput | null = null;
  deleteCommentAPICallID: string = '';
  fetchCommentsAPICallID: string = '';
  postCommentAPICallID: string = '';
  createCommentAPICallID: any;
  checkUnreadNotificationsApiCallId: any;
  defaultEmojisForSelectionStrip = [
    '️💖',
    '🙌',
    '🔥',
    '👏',
    '😢',
    '😍',
    '😲',
    '😂',
  ];
  scrollViewRef = React.createRef<ScrollView>();
  postViewRef = React.createRef<View>();
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: '',
      txtSavedValue: 'A',
      enableField: false,
      // Customizable Area Start
      isPageLoading: true,
      userProfileData: {},
      profileIdToLoad: '',
      userID: '',
      isOtherUser: false,
      expandedShows: false,
      expandedPosts: false,
      commentModalOpen: false,
      comments: [],
      comment: '',
      replying: false,
      showRepliesFor: [],
      editingComment: false,
      commentId: '',
      commentsLoading: false,
      showReplies: false,
      commentWithReply: {
        key: '',
        attributes: {
          account_id: 0,
          account: {
            id: 0,
            first_name: '',
            account_type: '',
          },
          profile_image_url: '',
          comment: '',
          created_at: '',
          replies: [],
          likes_count: 0,
          like_by_me: false,
        },
        id: 0,
      },
      eventId: '',
      replyId: '',
      showTncPopup: false,
      isLoadingComments: false,
      loadedProfileID: '',
      unreadNotificationCount: 0,
      newNotification: false,
      showRulesMoreModal: false,
      officialRulesAndRegulationsIconsList: [],
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog('Message Recived', message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        'Change Value',
        'From: ' + this.state.txtSavedValue + ' To: ' + value,
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
    this.handleRestAPIResponse(message);
    // Customizable Area End
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: 'email',
    keyboardType: 'email-address',
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue,
    );
    this.send(msg);
  }

  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  // Customizable Area Start
  focusListener: any = null;
  willFocusListener: any = null;
  screenId: string = Math.random().toString(36).substring(7);

  fetchOfficialRulesAndRegulationsIcons = async () => {
    try {
      const authToken = await getStorageData('authToken');
      const response = await fetch(RULES_AND_REGULATIONS_ICONS_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: authToken || '',
        },
      });
      const json = await response.json();
      if (json && Array.isArray(json.data)) {
        this.setState({
          officialRulesAndRegulationsIconsList: json.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
          })),
        });
      }
    } catch (error) {
      console.log(
        'Customisableuserprofiles2Controller - fetchOfficialRulesAndRegulationsIcons error:',
        error,
      );
    }
  };

  async componentDidMount() {
    if (this.isPlatformWeb() === false) {
      // Only use ONE focus listener to avoid double calls
      this.focusListener = this.props.navigation.addListener('focus', () => {
        this.handleWillFocus();
        setTimeout(() => {
          this.getUnreadNotificationsCount();
        }, 100);
      });
    }

    this.fetchOfficialRulesAndRegulationsIcons();

    // Load profile data on initial mount
    await this.loadProfileData(true);
    // Call notification count API on mount
    setTimeout(() => {
      this.getUnreadNotificationsCount();
    }, 100);
  }

  componentWillUnmount() {
    // Clean up listeners to prevent memory leaks
    if (this.focusListener) {
      this.focusListener();
    }
    if (this.willFocusListener) {
      this.willFocusListener();
    }
  }

  isViewingOwnProfile = (): boolean => {
    const loggedInUserId = String(this.state.userID ?? '');
    const viewedProfileId = String(this.state.loadedProfileID ?? '');
    if (loggedInUserId && viewedProfileId) {
      return loggedInUserId === viewedProfileId;
    }
    return !this.state.isOtherUser;
  };

  hasCachedProfileForAccount = (accountId: string): boolean => {
    if (!accountId) {
      return false;
    }
    if (String(this.state.loadedProfileID) !== String(accountId)) {
      return false;
    }
    const profile = this.state.userProfileData;
    return Boolean(profile && Object.keys(profile).length > 0);
  };

  loadProfileData = async (isInitialMount: boolean = false) => {
    const userID = await getStorageData('user_id');
    const authToken = await getStorageData('authToken');

    // Get navigation params (support both React Navigation 4 and 5)
    const navigationParams =
      this.props.navigation?.state?.params ||
      (this.props as any).route?.params ||
      {};
    const resetProfile = navigationParams?.resetProfile;
    const isOtherUserParam = navigationParams?.isOtherUser;

    // Case 1: Explicit reset requested (e.g., Profile tab pressed)
    if (resetProfile === true) {
      await removeStorageData('profileIdToLoad');
      this.setState({ profileIdToLoad: '', userID, isOtherUser: false });
      if (authToken) this.getUserDetailsApi(userID, true);
      return;
    }

    // Case 2: Initial mount - use navigation params to determine which profile to show
    if (isInitialMount) {
      if (isOtherUserParam === true) {
        const profileIdToLoad = await getStorageData('profileIdToLoad');
        const isOwnProfile =
          !profileIdToLoad ||
          String(profileIdToLoad) === String(userID ?? '');
        if (isOwnProfile) {
          await removeStorageData('profileIdToLoad');
          this.setState({ profileIdToLoad: '', userID, isOtherUser: false });
          if (authToken) this.getUserDetailsApi(userID, true);
        } else {
          this.setState({ profileIdToLoad, userID, isOtherUser: true });
          if (authToken && profileIdToLoad) {
            this.getUserDetailsApi(profileIdToLoad, true);
          }
        }
      } else {
        await removeStorageData('profileIdToLoad');
        this.setState({ profileIdToLoad: '', userID, isOtherUser: false });
        if (authToken) this.getUserDetailsApi(userID, true);
      }
      return;
    }

    // Case 3: Screen refocused — refresh the profile this screen is showing.
    let accountIdToLoad = userID;
    let isOtherUser = false;

    if (isOtherUserParam === true) {
      const profileIdToLoad =
        this.state.profileIdToLoad ||
        (await getStorageData('profileIdToLoad'));
      if (
        profileIdToLoad &&
        String(profileIdToLoad) !== String(userID ?? '')
      ) {
        accountIdToLoad = profileIdToLoad;
        isOtherUser = true;
      }
    } else if (
      this.state.isOtherUser &&
      this.state.profileIdToLoad &&
      String(this.state.profileIdToLoad) !== String(userID ?? '')
    ) {
      accountIdToLoad = this.state.profileIdToLoad;
      isOtherUser = true;
    } else if (
      this.state.loadedProfileID &&
      String(this.state.loadedProfileID) !== String(userID ?? '')
    ) {
      accountIdToLoad = String(this.state.loadedProfileID);
      isOtherUser = true;
    }

    this.setState({
      userID,
      isOtherUser,
      profileIdToLoad: isOtherUser ? accountIdToLoad : '',
    });
    if (authToken && accountIdToLoad) {
      this.getUserDetailsApi(accountIdToLoad);
    }
  };

  handleWillFocus = async () => {
    // Refresh profile data when screen comes into focus
    await this.loadProfileData();
    // Refresh notification count when screen comes into focus
    setTimeout(() => {
      this.getUnreadNotificationsCount();
    }, 100);
  };

  handleBackButton = () => {
    if (this.state.isOtherUser) {
      this.props.navigation.goBack();
    } else {
      const message: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      message.addData(getName(MessageEnum.NavigationTargetMessage), 'Home');
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      this.send(message);
    }
    removeStorageData('profileIdToLoad');
  };

  navigateToNotifications = () => {
    // Only reset the newNotification flag, don't reset the count
    // The count should be updated by the API when we return to this screen
    const nestedNotificationRoute = {
      name: 'Home',
      params: {
        screen: 'HomeTab',
        params: {
          screen: 'Profile',
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
          screen: 'Profile',
          params: {
            screen: 'Notifications',
          },
        },
      });
      this.props.navigation.navigate('Notifications');
    }

    this.setState({ newNotification: false });
  };

  getUnreadNotificationsCount = async () => {
    const authToken = await getStorageData('authToken');
    if (!authToken) {
      return;
    }

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
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

  handleRestAPIResponse = (message: Message) => {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );

      if (apiRequestCallId === this.userDetailGetApiCallId) {
        this.handleUserDetailApiResponse(message);
      } else if (apiRequestCallId === this.createFollowApiCallID) {
        this.handleFollowApiResponse(message);
      } else if (apiRequestCallId === this.toggleLikeApiCallId) {
        this.toggleLikeCallback();
      } else if (apiRequestCallId === this.deleteCommentAPICallID) {
        this.handleCommentsApiResponse(message);
      } else if (apiRequestCallId === this.fetchCommentsAPICallID) {
        this.handleCommentsApiResponse(message);
      } else if (apiRequestCallId === this.postCommentAPICallID) {
        this.handleCommentsUpdateApiResponse();
      } else if (apiRequestCallId === this.createCommentAPICallID) {
        this.handleCommentsUpdateApiResponse();
      } else if (apiRequestCallId === this.checkUnreadNotificationsApiCallId) {
        const responseJson = message.getData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
        );
        this.handleUnreadNotificationsApiResponse(responseJson);
      }
    } else if (
      getName(MessageEnum.RestAPIResponceErrorMessage) === message.id
    ) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );
      if (apiRequestCallId === this.checkUnreadNotificationsApiCallId) {
        this.setState({
          unreadNotificationCount: 0,
          newNotification: false,
        });
      }
    }
  };
  handleCommentsUpdateApiResponse = () => {
    this.setState({ editingComment: false }, () => {
      this.fetchCommentsAPI(this.state.eventId);
    });
  };

  handleCommentsApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({
      commentsLoading: false,
      comments: [],
      isLoadingComments: false,
    });
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
      this.setState({ comments: responseJson.data });
    }
  };

  toggleLikeCallback = async () => {
    const profileIdToLoad = await getStorageData('profileIdToLoad');
    const userID = await getStorageData('user_id');
    if (profileIdToLoad) {
      this.getUserDetailsApi(profileIdToLoad);
    } else {
      this.getUserDetailsApi(userID);
    }
  };

  handleFollowApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ isPageLoading: false });
    if (responseJson != null && !responseJson.errors) {
      this.setState(prevState => ({
        userProfileData: {
          ...prevState.userProfileData,
          follow: !this.state.userProfileData.follow,
        },
      }));
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleUserDetailApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ isPageLoading: false });
    if (responseJson != null && !responseJson.errors) {
      const id =
        responseJson.data.type === 'profile'
          ? responseJson.data.attributes.account_id
          : responseJson.data.id;
      const viewedProfileId = String(id ?? '');
      const loggedInUserId = String(this.state.userID ?? '');
      const isOtherUser =
        Boolean(loggedInUserId && viewedProfileId) &&
        loggedInUserId !== viewedProfileId;
      this.setState({
        userProfileData: responseJson.data.attributes,
        isPageLoading: false,
        loadedProfileID: id,
        isOtherUser,
        profileIdToLoad: isOtherUser ? viewedProfileId : '',
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  async getUserDetailsApi(accountId: string, forceLoading: boolean = false) {
    const shouldShowLoading =
      forceLoading || !this.hasCachedProfileForAccount(accountId);
    if (shouldShowLoading) {
      this.setState({ isPageLoading: true });
    }
    const authToken = await getStorageData('authToken');
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.userDetailGetApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.userDetailEndPoint + accountId,
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
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  navigateToBandEditProfile = async () => {
    const edit =
      this.state.userProfileData.bio && this.state.userProfileData.bio !== '';
    await setStorageData('editMode', edit === true ? 'true' : 'false');
    await setStorageData('user_country', this.state.userProfileData.country);
    await setStorageData('state', this.state.userProfileData.state);
    await setStorageData('city', this.state.userProfileData.city);
    this.props.navigation.navigate('EditProfile', {
      editMode: true,
    });
  };

  navigateToCategoriesSubCategories = async () => {
    // Set edit mode so that categories and rules are loaded from user profile
    await setStorageData('categoriesEditMode', 'true');
    this.props.navigation.navigate('CategoriesSubCategories', {
      navigationBarTitleText: 'Categories & Subcategories',
      fromProfile: true, // Flag to indicate navigation from profile screen
    });
  };

  navigateToCalendarScreen = () => {
    const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationTargetMessage), 'Filteritems');
    this.send(msg);
  };

  handleOfficialWebsite = (socialMediaUrl: string) => {
    const link =
      socialMediaUrl.includes('http://') || socialMediaUrl.includes('https://')
        ? socialMediaUrl
        : 'https://' + socialMediaUrl;
    Linking.canOpenURL(link)
      .then(supported => {
        if (supported) {
          Linking.openURL(link);
        } else {
          console.error("Don't know how to open URI: " + link);
        }
      })
      .catch(error => console.error('An error occurred', error));
  };
  goToBlockedUserScreen = () => {
    const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationTargetMessage), 'Blockedusers');
    this.send(msg);
  };

  handleFollowerFollowingsNavigation = (screen: string) => {
    const info = {
      type: screen,
      accountId: this.state.loadedProfileID,
    };

    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Followers');

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  handleFollowUserApi = async () => {
    const authToken = await getStorageData('authToken');
    const apiHeader = {
      'Content-Type': configJSON.exampleApiContentType,
      token: authToken,
    };

    const apiRequestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createFollowApiCallID = apiRequestMessage.messageId;

    const dataToSend = {
      data: {
        attributes: {
          account_id: parseInt(this.state.profileIdToLoad),
        },
      },
    };

    const endpoint = this.state.userProfileData.follow
      ? `${configJSON.createFollowApiEndpoint}/${this.state.profileIdToLoad}`
      : configJSON.createFollowApiEndpoint;
    const methodType = this.state.userProfileData.follow
      ? configJSON.deleteMethodType
      : configJSON.exampleAPiMethod;

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

    if (!this.state.userProfileData.follow) {
      apiRequestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(dataToSend),
      );
    }

    runEngine.sendMessage(apiRequestMessage.id, apiRequestMessage);
  };

  navigateToChatScreen = async () => {
    await setStorageData('startChatWith', this.state.profileIdToLoad);
    await setStorageData(
      'chat_user_name',
      this.state.userProfileData.first_name,
    );
    await setStorageData(
      'profile_image',
      this.state.userProfileData.profile_image,
    );
    await setStorageData('ChatFromProfile', JSON.stringify(true));
    const chatNavMessage: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    chatNavMessage.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'Chat',
    );
    chatNavMessage.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    this.send(chatNavMessage);
  };

  normalizeSocialHandle = (value: string) => {
    if (!value) return '';
    return value
      .trim()
      .replace(/^@+/, '')
      .replace(/^\/+|\/+$/g, '')
      .split('?')[0];
  };

  normalizeSocialUrl = (socialMediaUrl: string, webBaseUrl: string) => {
    const normalizedInput = (socialMediaUrl || '').trim();
    if (!normalizedInput || normalizedInput === 'undefined') {
      return '';
    }

    if (
      normalizedInput.startsWith('http://') ||
      normalizedInput.startsWith('https://')
    ) {
      return normalizedInput;
    }

    return `${webBaseUrl}${this.normalizeSocialHandle(normalizedInput)}`;
  };

  openSocialUrl = async (url: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Unable to open social media URL', error);
    }
  };

  handleFacebookLink = (socialMediaUrl: string) => {
    const webUrl = this.normalizeSocialUrl(
      socialMediaUrl,
      'https://www.facebook.com/',
    );
    this.openSocialUrl(webUrl);
  };

  handleInstagramLink = (socialMediaUrl: string) => {
    const webUrl = this.normalizeSocialUrl(
      socialMediaUrl,
      'https://www.instagram.com/',
    );
    this.openSocialUrl(webUrl);
  };

  handleLinkedInLink = (socialMediaUrl: string) => {
    const normalizedInput = (socialMediaUrl || '').trim();
    const webUrl =
      normalizedInput.startsWith('http://') ||
      normalizedInput.startsWith('https://')
        ? normalizedInput
        : this.normalizeSocialUrl(normalizedInput, 'https://www.linkedin.com/in/');
    this.openSocialUrl(webUrl);
  };

  getShowsLength = () => {
    try {
      if (this.state.userProfileData.show_list.length > 0) {
        return this.state.userProfileData.show_list.length;
      } else {
        return 0;
      }
    } catch (_) {
      return 0;
    }
  };

  showsData = () => {
    if (this.getShowsLength() === 0) {
      return [];
    }

    const list = this.state.userProfileData.show_list;

    if (this.state.expandedShows) {
      return list;
    }

    return list.slice(0, 1);
  };

  getShowsLabel = () => {
    if (this.state.expandedShows) {
      return 'See less';
    } else {
      return 'See more';
    }
  };

  toggleShowsExpand = () => {
    this.setState({ expandedShows: !this.state.expandedShows });
  };

  getPostsLength = () => {
    try {
      if (this.state.userProfileData.post_list.length > 0) {
        return this.state.userProfileData.post_list.length;
      } else {
        return 0;
      }
    } catch (_) {
      return 0;
    }
  };

  postsData = () => {
    if (this.getPostsLength() === 0) {
      return [];
    }

    const list = this.state.userProfileData.post_list;

    if (this.state.expandedPosts) {
      return list;
    }

    return list.slice(0, 1);
  };

  getPostsLabel = () => {
    if (this.state.expandedPosts) {
      return 'See less';
    } else {
      return 'See more';
    }
  };

  togglePostsExpand = () => {
    this.setState({ expandedPosts: !this.state.expandedPosts });
  };

  getFormattedFullMonth = (dateString: string) => {
    const { monthIndex } = this.getDateParts(dateString);
    return monthsFull[monthIndex];
  };

  getDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getUTCDate(),
      monthIndex: date.getUTCMonth(),
      dayOfWeekIndex: date.getUTCDay(),
      year: date.getUTCFullYear(),
    };
  };

  getFullDate = (dateString: string) => {
    const { dayOfWeekIndex, day, monthIndex, year } =
      this.getDateParts(dateString);
    const dayName = daysOfWeek[dayOfWeekIndex];
    const month = monthsShort[monthIndex];
    return `${dayName}, ${day} ${month}, ${year}`;
  };

  handleProfileNavigation = async (userID: number) => {
    await setStorageData('profileIdToLoad', `${userID}`);
    if (this.state.userID === userID.toString()) {
      this.props.navigation.navigate('Profile', {
        isOtherUser: false,
      });
    } else {
      this.props.navigation.push('UserProfileBasicBlockArtist', {
        isOtherUser: true,
      });
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
      .catch(error => console.error('An error occurred', error));
  };

  handleShowDetails = (show: any, stateName: string) => {
    if (show.account_id.toString() === this.state.userID) {
      this.props.navigation.navigate('PostDetails', {
        eventId: show.id,
        eventState: show.state,
      });
    } else {
      const info = {
        eventId: show.id,
        eventState: stateName,
      };
      const screen = 'AllEventDetailScreen';
      const msgData = MessageEnum.HelpCentreMessageData;
      const message: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(getName(MessageEnum.NavigationTargetMessage), screen);

      const raiseMessage: Message = new Message(
        getName(MessageEnum.NavigationPayLoadMessage),
      );
      raiseMessage.addData(getName(msgData), info);

      message.addData(
        getName(MessageEnum.NavigationRaiseMessage),
        raiseMessage,
      );

      this.send(message);
    }
  };

  formatMonth = (dateString: string) => {
    const { monthIndex } = this.getDateParts(dateString);
    return monthsShort[monthIndex];
  };

  formatDate = (dateString: string) => {
    const { day } = this.getDateParts(dateString);
    return day;
  };

  toggleLikeApi = async (eventId: string, type: string) => {
    const token = await getStorageData('authToken');

    const likeShowData = {
      like: {
        show_id: eventId,
      },
    };

    const likePostData = {
      like: {
        post_id: eventId,
      },
    };
    const toggleLikeRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const endpoint =
      type === 'show'
        ? configJSON.toggleLikeApiEndPoint
        : configJSON.pictureLikeEndpoint;
    const body =
      type === 'show'
        ? JSON.stringify(likeShowData)
        : JSON.stringify(likePostData);

    this.toggleLikeApiCallId = toggleLikeRequestMsg.messageId;

    toggleLikeRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    toggleLikeRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    toggleLikeRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      body,
    );

    toggleLikeRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod,
    );

    runEngine.sendMessage(toggleLikeRequestMsg.id, toggleLikeRequestMsg);
  };

  handleShareEvent = async (eventId: string, eventType: string) => {
    const navigationMsg: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    navigationMsg.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    navigationMsg.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'Share',
    );
    const info = {
      eventId: eventId,
      eventType,
    };
    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);
    navigationMsg.addData(
      getName(MessageEnum.NavigationRaiseMessage),
      raiseMessage,
    );
    this.send(navigationMsg);
  };

  handleLikeNav = (itemData: any, Itemtype: string) => {
    const infoNavData = {
      eventID: itemData.id,
      type: Itemtype,
    };

    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Likeapost2');

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(
      getName(MessageEnum.HelpCentreMessageData),
      infoNavData,
    );

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  handleShowComments = async (eventId: string) => {
    this.setState({
      commentModalOpen: true,
      eventId,
      comment: '',
      isLoadingComments: true,
    });
    this.fetchCommentsAPI(eventId);
  };

  handleCloseCommentsModal = () => {
    this.toggleLikeCallback();
    this.setState({ commentModalOpen: false, replying: false });
  };

  handleEmojiSelection = (emoji: string) => {
    this.setState({ comment: `${this.state.comment}${emoji}` });
  };

  handleCommentChange = (comment: string) => {
    this.setState({ comment });
  };

  handleSubmit = () => {
    if (this.state.comment.trim() !== '') {
      this.hideKeyboard();
      if (this.state.replying || this.state.showReplies) {
        this.postReplyToComment();
      } else {
        this.postComment();
      }
    }
  };

  handleOnBlur = () => {
    this.setState({ replying: false });
  };

  closeRow = (
    rowMap: RowMap<ICommentItem> | RowMap<IReplyItem>,
    rowKey: string,
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  handleEditComment = (item: ICommentItem, rowMap: RowMap<ICommentItem>) => {
    this.setState(
      {
        comment: item.attributes.comment,
        editingComment: true,
        commentId: `${item.id}`,
      },
      () => {
        if (this.commentTextInput) {
          this.commentTextInput.focus();
        }
        this.closeRow(rowMap, item.key);
      },
    );
  };

  handleEditAReply = (item: IReplyItem, rowMap: RowMap<IReplyItem>) => {
    this.setState(
      {
        comment: item.reply,
        editingComment: true,
        replyId: `${item.id}`,
        replying: false,
      },
      () => {
        if (this.commentTextInput) {
          this.commentTextInput.focus();
        }
        this.closeRow(rowMap, item.key);
      },
    );
  };

  showProfile = async (accountId: string, accountType: string) => {
    this.setState({ commentModalOpen: false, showReplies: false });

    await setStorageData('profileIdToLoad', `${accountId}`);

    const screen =
      accountType === 'Band' || accountType === 'Artist'
        ? 'UserProfileBasicBlockArtist'
        : 'UserProfileBasicBlock';
    if (this.state.userID === accountId.toString()) {
      this.props.navigation.navigate('Profile', {
        isOtherUser: false,
      });
    } else {
      this.props.navigation.push(screen, {
        isOtherUser: true,
      });
    }
  };

  timeSince(timestamp: string): string {
    const timestampDate = new Date(timestamp);
    const CurrentDate = new Date();
    const ParsedSeconds = Math.floor(
      (CurrentDate.getTime() - timestampDate.getTime()) / 1000,
    );

    const Stampintervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'm', seconds: 2592000 },
      { label: 'w', seconds: 604800 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
      { label: 's', seconds: 1 },
    ];

    const result = Stampintervals.find(
      Stampinterval => ParsedSeconds >= Stampinterval.seconds,
    );

    if (result) {
      const count = Math.floor(ParsedSeconds / result.seconds);
      return `${count}${result.label}`;
    }

    return 'just now';
  }

  fetchCommentsAPI = async (eventId: string) => {
    const token = await getStorageData('authToken');

    this.setState({ commentsLoading: true });
    const fetchCommentsMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.fetchCommentsAPICallID = fetchCommentsMessage.messageId;

    fetchCommentsMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.fetchCommentsEndpoint}?commentable_id=${eventId}&commentable_type=Show`,
    );

    fetchCommentsMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    fetchCommentsMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(fetchCommentsMessage.id, fetchCommentsMessage);
  };

  postComment = async () => {
    const token = await getStorageData('authToken');

    const dataToSend = {
      comment: {
        commentable_id: this.state.eventId,
        commentable_type: 'Show',
        comment: this.state.comment.trim(),
      },
    };

    this.setState({ commentsLoading: true, comment: '', showRepliesFor: [] });

    const postCommentMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.postCommentAPICallID = postCommentMsg.messageId;

    let endpoint;
    if (this.state.editingComment) {
      if (this.state.showReplies) {
        endpoint = `${configJSON.createCommentApiEndpoint}/${this.state.replyId}`;
      } else {
        endpoint = `${configJSON.createCommentApiEndpoint}/${this.state.commentId}`;
      }
    } else {
      endpoint = configJSON.createCommentApiEndpoint;
    }
    const methodType = this.state.editingComment
      ? `${configJSON.editCommentMethodType}`
      : configJSON.exampleAPiMethod;

    postCommentMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    postCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    postCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    postCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(postCommentMsg.id, postCommentMsg);
  };

  closeReplyModal = () => {
    this.setState({
      commentModalOpen: true,
      showRepliesFor: [],
      showReplies: false,
      replying: false,
    });
  };

  handleReplyBack = () => {
    this.setState({
      showReplies: false,
      replying: false,
      commentId: '',
      commentModalOpen: true,
      comment: '',
    });
  };

  handleReplyPressed = (commentId: string) => {
    this.setState({ replying: true, commentId });
    if (this.commentTextInput) {
      this.commentTextInput.focus();
    }
  };

  handleShowReplies = (item: ICommentItem) => {
    this.setState({
      replying: true,
      commentId: `${item.id}`,
      commentWithReply: item,
      showReplies: true,
      commentModalOpen: false,
      comment: '',
    });
  };

  postReplyToComment = async () => {
    this.setState({ replying: false });
    const token = await getStorageData('authToken');

    const dataToSend = {
      comment: {
        commentable_id: this.state.commentId,
        commentable_type: 'BxBlockComments::Comment',
        comment: this.state.comment.trim(),
      },
    };

    let endpoint;
    if (this.state.editingComment) {
      endpoint = `${configJSON.createCommentApiEndpoint}/${this.state.replyId}`;
    } else {
      endpoint = configJSON.createCommentApiEndpoint;
    }

    const methodType = this.state.editingComment
      ? `${configJSON.editCommentMethodType}`
      : configJSON.exampleAPiMethod;

    this.setState({ commentsLoading: true, comment: '', showRepliesFor: [] });

    const postReplyMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.postCommentAPICallID = postReplyMsg.messageId;

    postReplyMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    postReplyMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    postReplyMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    postReplyMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(postReplyMsg.id, postReplyMsg);
  };

  closeTnCModalPopup = () => {
    this.setState({ showTncPopup: false });
  };

  handleTnCUpdateCheckOutModal = async () => {
    this.closeTnCModalPopup();
    const TncNavMessage: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    TncNavMessage.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    TncNavMessage.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'TermsConditions',
    );
    const tAndCAcceptanceStatus = await getStorageData('tAndCAcceptance');
    const Datainfo = {
      isTermsAndConditionsAccepted: tAndCAcceptanceStatus,
    };
    const raiseTncNavMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseTncNavMessage.addData(
      getName(MessageEnum.NavigationTermAndConditionMessage),
      Datainfo,
    );
    TncNavMessage.addData(
      getName(MessageEnum.NavigationRaiseMessage),
      raiseTncNavMessage,
    );
    this.send(TncNavMessage);
  };

  likeCommentsAPI = async (comment_id: string) => {
    const token = await getStorageData('authToken');
    const likeCommentRequestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createCommentAPICallID = likeCommentRequestMessage.messageId;

    const dataToSend = {
      like: {
        comment_id,
      },
    };

    likeCommentRequestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeCommentEndpoint,
    );

    likeCommentRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: token,
      }),
    );

    likeCommentRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod,
    );

    likeCommentRequestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(
      likeCommentRequestMessage.id,
      likeCommentRequestMessage,
    );
  };

  deleteACommentAPI = async (commentId: string) => {
    const token = await getStorageData('authToken');
    this.setState({ commentsLoading: true, comment: '', showRepliesFor: [] });

    const deleteCommentMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.deleteCommentAPICallID = deleteCommentMessage.messageId;

    deleteCommentMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.createCommentApiEndpoint}/${commentId}`,
    );

    deleteCommentMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    deleteCommentMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteApiMethodType,
    );

    runEngine.sendMessage(deleteCommentMessage.id, deleteCommentMessage);
  };

  handlePostDetail = (showId: string) => {
    const info = {
      eventId: showId,
    };
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'PhotoLibraryDetail',
    );

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.PostDetailDataMessage), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  scrollToPosts = () => {
    this.postViewRef.current?.measureLayout(
      this.scrollViewRef.current as any,
      (x, y) => {
        this.scrollViewRef.current?.scrollTo({ y, animated: true });
      },
      () => console.error('error'),
    );
  };
  // Customizable Area End
}
