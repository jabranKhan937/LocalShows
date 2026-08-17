import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';

// Customizable Area Start
import { imgPasswordVisible } from './assets';
import {
  getStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
import { Platform } from 'react-native';
import { pushOtherUserProfileScreen } from '../../../components/src/NavigationCompat';
export interface DataListItem {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    email: string;
    is_follow: string;
  };
}

export interface DataListItemTwo {
  id: string;
  attributes: {
    account_email: string;
    email: string;
    current_user_id: string;
    account_id: string;
  };
}

export interface DataListItemThree {
  id: string;
  attributes: {
    account_email: string;
    email: string;
    current_user_id: string;
    account_id: string;
    user_name: string;
    is_follow: boolean;
  };
}
// Customizable Area End

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  route?: any; // For React Navigation v6 compatibility
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  tabPanelNo: number;
  listData: DataListItem[];
  followingData: DataListItem[];
  openModal: boolean;
  errorMsg: string;
  openFollowerModel: boolean;
  postsCount: number;
  followersCount: string;
  userList: boolean;
  token: string;
  followerList: boolean;
  loder: boolean;
  followingList: boolean;
  searchTerm: string;
  profilePhoto: string;
  showFollowersScreen: boolean;
  userListData: DataListItemThree[];
  userFollowerListData: DataListItemTwo[];
  userFollowingListData: DataListItemTwo[];
  isLoading: boolean;
  type: string;
  followerFollowingList: any[];
  searchText: string;
  filteredList: any[];
  userToken: '';
  accountId: string;
  loginUserId: string;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: string;
  // Customizable Area End
}

export default class FollowersController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  followerCallId: string = '';
  userFollowerCallID: string = '';
  userFollowingCallID: string = '';
  addFollowerFromFollowingCallId: string = '';
  unFollowFromFollowingCallId: string = '';
  getFollowersFollowingsListAPICallID: any;
  removeFollowRequestCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.ReciveUserCredentials),
      getName(MessageEnum.RestAPIResponceDataMessage),
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      tabPanelNo: 0,
      listData: [],
      followingData: [],
      openModal: false,
      errorMsg: '',
      searchTerm: '',
      showFollowersScreen: true,
      userList: true,
      followerList: false,
      followingList: false,
      loder: false,
      userFollowerListData: [],
      userListData: [],
      userFollowingListData: [],
      followersCount: imgPasswordVisible,
      token: '',
      postsCount: 20,
      profilePhoto: 'https://via.placeholder.com/150',
      openFollowerModel: false,
      isLoading: false,
      type: 'followers',
      followerFollowingList: [],
      searchText: '',
      filteredList: [],
      userToken: '',
      accountId: '',
      loginUserId: '',
      // Customizable Area End
    };

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    // Customizable Area Start
    await this.getUserToken();
    this.checkPreviousScreen();
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start

    runEngine.debugLog('Message Recived', message);

    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handlePayload(message);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start

  checkPreviousScreen = () => {
    // Method 1: Check navigation state (React Navigation v5+)
    const navigationState = this.props.navigation?.getState?.();
    if (navigationState) {
      const routes = navigationState.routes;
      const currentIndex = navigationState.index;

      if (currentIndex > 0) {
        const previousRoute = routes[currentIndex - 1];
        console.log('📍 Previous Screen (from state):', previousRoute.name);
        console.log('📍 Previous Screen Params:', previousRoute.params);
        return previousRoute.name;
      }
    }

    // Method 2: Check from navigation params (if passed explicitly)
    const fromScreen = this.props.navigation?.state?.params?.fromScreen;
    if (fromScreen) {
      console.log('📍 Previous Screen (from params):', fromScreen);
      return fromScreen;
    }

    // Method 3: Check from route params (React Navigation v6)
    const routeFromScreen = this.props.route?.params?.fromScreen;
    if (routeFromScreen) {
      console.log('📍 Previous Screen (from route):', routeFromScreen);
      return routeFromScreen;
    }

    console.log('📍 No previous screen information found');
    return null;
  };

  getPreviousScreenName = () => {
    // Get the previous screen name
    const navigationState = this.props.navigation?.getState?.();
    if (navigationState) {
      const routes = navigationState.routes;
      const currentIndex = navigationState.index;

      if (currentIndex > 0) {
        return routes[currentIndex - 1].name;
      }
    }

    // Fallback to params
    return (
      this.props.navigation?.state?.params?.fromScreen ||
      this.props.route?.params?.fromScreen ||
      null
    );
  };

  handlePayload = async (message: Message) => {
    const payloadData = message.getData(
      getName(MessageEnum.HelpCentreMessageData),
    );
    if (payloadData?.type) {
      const authToken = await getStorageData('authToken');
      this.setState(
        {
          userToken: authToken,
          type: payloadData.type,
          accountId: payloadData.accountId,
        },
        () => {
          this.getFollowerFollowingListAPI();
        },
      );
    }
  };

  handleRestAPIResponse = (message: Message) => {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage),
      );

      if (apiRequestCallId === this.followerCallId) {
        this.handleResponseForSuggestion(message);
      } else if (apiRequestCallId === this.unFollowFromFollowingCallId) {
        this.handleResForUnFollowFromFollowing(message);
      } else if (apiRequestCallId === this.addFollowerFromFollowingCallId) {
        this.handleResponseForAddFromFollowing(message);
      } else if (apiRequestCallId === this.userFollowerCallID) {
        this.handleResponseForSuggestionFollowers(message);
      } else if (apiRequestCallId === this.userFollowingCallID) {
        this.handleResponseForSuggestionFollowing(message);
      } else if (
        apiRequestCallId === this.getFollowersFollowingsListAPICallID
      ) {
        this.handleFollowersFollowingsListResponse(message);
      } else if (apiRequestCallId === this.removeFollowRequestCallId) {
        this.handleRemoveFollowRequestResponse(message);
      }
    }
  };

  getUserToken = async () => {
    const token: string = await getStorageData('token-access');

    const loginUserId = await getStorageData('user_id');

    this.setState({ token: token, loginUserId });
    if (this.isPlatformWeb() === true) {
      await this.getListOfSuggestionData();
      await this.getListOfSuggestionDataFollowers();
      await this.getListOfSuggestionDataFollowing();
    }
  };

  handleProfileNav = async (user: any) => {
    // Check which screen we came from
    const previousScreen = this.getPreviousScreenName();
    console.log('📍 Navigating to profile from screen:', previousScreen);
    console.log('👤 User data:', user);

    let accountId =
      this.state.type === 'following'
        ? user.attributes.account_id
        : user.attributes.current_user_id;
    let accountType = user.attributes.account_type;

    console.log('🔍 Account ID:', accountId);
    console.log('🔍 Account Type:', accountType);

    await setStorageData('profileIdToLoad', `${accountId}`);

    const isArtistType =
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
      accountType === 'Record_Store';

    const navigated = pushOtherUserProfileScreen(
      this.props.navigation,
      isArtistType,
      { isOtherUser: true },
    );

    console.log('🚀 Profile navigation dispatched:', navigated);

    // let authToken = await getStorageData('authToken')
    //   if(authToken === null){
    //     this.setState({ loginPopup: true })
    //   }else{
    //     await setStorageData("profileIdToLoad", `${accountId}`);
    //     const screen = accountType === 'Band' || accountType === 'Artist' ? "UserProfileBasicBlockArtist3" : "UserProfileBasicBlock3"
    //     if (this.state.userId === accountId.toString()) {
    //       this.props.navigation.navigate('Profile', {
    //         isOtherUser: false
    //       })
    //     } else {
    //       this.props.navigation.push(screen, {
    //         isOtherUser: true
    //       })
    //     }
    //   }
  };

  getListOfSuggestionData = async () => {
    this.setState({ loder: true });
    const token = await this.state.token;
    const headers = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    const followerDataMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.followerCallId = followerDataMessage.messageId;

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.userListEndPoint,
    );

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(followerDataMessage.id, followerDataMessage);
  };

  getListOfSuggestionDataFollowers = async () => {
    const token = await this.state.token;
    const headers = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    const followerDataMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.userFollowerCallID = followerDataMessage.messageId;

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.userListFollowersEndPoint,
    );

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(followerDataMessage.id, followerDataMessage);
  };

  getListOfSuggestionDataFollowing = async () => {
    const token = await this.state.token;
    const headers = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    const followerDataMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.userFollowingCallID = followerDataMessage.messageId;

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.userListFollowingEndPoint,
    );

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    followerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(followerDataMessage.id, followerDataMessage);
  };

  addFromFollowing = async (account_id: string) => {
    this.setState({ loder: true });
    const token = await this.state.token;
    let headers = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    let httpBody = {};
    httpBody = {
      data: {
        attributes: {
          account_id: account_id,
        },
      },
    };
    const addFollowerDataMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addFollowerFromFollowingCallId = addFollowerDataMessage.messageId;

    addFollowerDataMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.addFollowingApiEndPoint}`,
    );

    addFollowerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );
    addFollowerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody),
    );
    addFollowerDataMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      `${configJSON.postApiMethodType}`,
    );

    runEngine.sendMessage(addFollowerDataMessage.id, addFollowerDataMessage);
  };

  unFollowFromFollowing = async (account_id: string) => {
    this.setState({ loder: true });
    const token = await this.state.token;
    const headers = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    const unFollowDataUserMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.unFollowFromFollowingCallId = unFollowDataUserMessage.messageId;

    unFollowDataUserMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.unFollowApisApiEndPoint}/${account_id}`,
    );

    unFollowDataUserMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    unFollowDataUserMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      `${configJSON.deleteApiMethodType}`,
    );

    runEngine.sendMessage(unFollowDataUserMessage.id, unFollowDataUserMessage);
  };

  followingOnPress = () => {
    this.setState({
      userList: false,
      followerList: false,
      followingList: true,
    });
  };

  followerListOnPress = () => {
    this.setState({
      userList: false,
      followerList: true,
      followingList: false,
    });
  };

  userListOnPress = () => {
    this.setState({
      userList: true,
      followerList: false,
      followingList: false,
    });
  };

  handleResponseForSuggestion = (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ loder: false });
    if (apiResponse.errors) {
      this.setState({ errorMsg: apiResponse.errors });
    } else {
      this.setState({ userListData: apiResponse.data });
    }
  };

  handleResponseForSuggestionFollowers = (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ loder: false });

    if (apiResponse.errors) {
      this.setState({ errorMsg: apiResponse.errors });
      if (apiResponse.errors[0].message == 'Not following to any user.') {
        this.setState({ userFollowerListData: [] });
      }
    } else {
      this.setState({ userFollowerListData: apiResponse.data });
    }
  };

  handleResponseForSuggestionFollowing = (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ loder: false });

    if (apiResponse.errors) {
      this.setState({ errorMsg: apiResponse.errors });
    } else {
      this.setState({ userFollowingListData: apiResponse.data });
    }
  };

  handleResponseForAddFromFollowing = async (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (apiResponse.errors) {
      this.setState({ errorMsg: apiResponse.errors });
    } else {
      await this.getListOfSuggestionData();
      await this.getListOfSuggestionDataFollowers();
      await this.getListOfSuggestionDataFollowing();
    }
  };

  handleResForUnFollowFromFollowing = async (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (apiResponse.errors) {
      this.setState({ errorMsg: apiResponse.errors });
    } else {
      await this.getListOfSuggestionData();
      await this.getListOfSuggestionDataFollowers();
      await this.getListOfSuggestionDataFollowing();
    }
  };

  handleFollowersFollowingsListResponse = (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ isLoading: false });
    if (!apiResponse.errors) {
      this.setState({
        followerFollowingList: apiResponse.data,
        filteredList: [],
      });
    } else {
      this.parseApiErrorResponse(apiResponse);
    }
  };

  handleRemoveFollowRequestResponse = (message: Message) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    this.setState({ isLoading: false });
    if (!apiResponse.errors) {
      this.getFollowerFollowingListAPI();
    } else {
      this.parseApiErrorResponse(apiResponse);
    }
  };

  //for Web File
  hanleTabs = (event: object, value: number) => {
    this.setState({ tabPanelNo: value });
  };

  getFollowerFollowingListAPI = async () => {
    this.setState({ isLoading: true });

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getFollowersFollowingsListAPICallID = getDataMsg.messageId;

    const header = JSON.stringify({
      'Content-Type': configJSON.validationApiContentType,
      token: this.state.userToken,
    });

    const endpoint =
      this.state.type === 'following'
        ? `${configJSON.followingListEndPoint}?account_id=${this.state.accountId}`
        : `${configJSON.followerListEndPoint}?account_id=${this.state.accountId}`;
    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      header,
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  };

  filterList = () => {
    let filteredData = [...this.state.followerFollowingList];
    filteredData = filteredData.filter(
      item =>
        item.attributes.name &&
        item.attributes.name
          .toLowerCase()
          .includes(this.state.searchText.toLowerCase()),
    );
    this.setState({ filteredList: filteredData });
  };

  removeRequestAPI = async (id: string) => {
    const authToken = await getStorageData('authToken');

    const data = {
      record_id: id,
      remove: true,
      confirmed: false,
    };

    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.removeFollowRequestCallId = getDataMsg.messageId;

    const header = JSON.stringify({
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    });

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.removeRequestEndPoint,
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      header,
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data),
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.patchApiMethodType,
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  };

  handleSearch = (text: string) => {
    this.setState({ searchText: text }, () => {
      this.filterList();
    });
  };

  handleRemoveButton = (id: string) => {
    this.state.type === 'followers' && this.removeRequestAPI(id);
  };
  // Customizable Area End
}
