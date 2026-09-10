import React from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  // Customizable Area Start
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  PermissionsAndroid,
  // Customizable Area End
} from 'react-native';
import moment from 'moment';
import { BlockComponent } from '../../framework/src/BlockComponent';
import AlertBlock from '../../blocks/alert/src/AlertBlock';
import CustomTextItem from './CustomTextItem';
import NavigationBlock from '../../framework/src/Blocks/NavigationBlock';
import SingletonFactory from '../../framework/src/SingletonFactory';

import HomeScreenAdapter from '../../blocks/adapters/src/HomeScreenAdapter';
import InfoPageAdapter from '../../blocks/adapters/src/InfoPageAdapter';
import AlertPageWebAdapter from '../../blocks/adapters/src/AlertPageWebAdapter';
                           
// Customizable Area Start
import PrivacyPolicyAdapter from '../../blocks/adapters/src/PrivacyPolicyAdapter';
import TermsAndConditionAdapter from '../../blocks/adapters/src/TermsAndConditionAdapter';
import SplashScreenAdapter from '../../blocks/adapters/src/SplashScreenAdapter';
import SocialMediaLogInAdapter from '../../blocks/adapters/src/SocialMediaLogInAdapter';
import EmailAccountLogInAdapter from '../../blocks/adapters/src/EmailAccountLogInAdapter';
import EmailAccountSignUpAdapter from '../../blocks/adapters/src/EmailAccountSignUpAdapter';
import ForgotPasswordAdapter from '../../blocks/adapters/src/ForgotPasswordAdapter';
import MobilePhoneToOTPAdapter from '../../blocks/adapters/src/MobilePhoneToOTPAdapter';
import OtpToNewPasswordAdapter from '../../blocks/adapters/src/OtpToNewPasswordAdapter';
import { DrawerActions } from '@react-navigation/native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  NavigationActions,
  StackActions,
  CommonActions,
  resetProfileTabToOwnProfile,
  handleBottomTabRepress,
  getTabStackIndex,
  isTabCurrentlySelected,
} from './NavigationCompat';
import { emitProfileTabPressReset } from '../../framework/src/profileTabReset';
import { emitHomeFeedTabScrollToTop } from '../../framework/src/homeFeedTabScroll';
import { TransitionPresets } from '@react-navigation/stack';
import RedesignTabBar from './RedesignTabBar';
// import messaging from '@react-native-firebase/messaging';
import EmailAccountLoginBlock from '../../blocks/email-account-login/src/EmailAccountLoginBlock';
import EmailAccountRegistration from '../../blocks/email-account-registration/src/EmailAccountRegistration';
import OTPInputAuth from '../../blocks/otp-input-confirmation/src/OTPInputAuth';
import {
  getStorageData,
  removeStorageData,
  setStorageData,
} from '../../framework/src/Utilities';
import { runEngine } from '../../framework/src/RunEngine';
import MessageEnum, { getName } from '../../framework/src/Messages/MessageEnum';
import { Message } from '../../framework/src/Message';
import UserProfileBasicBlock from '../../blocks/user-profile-basic/src/UserProfileBasicBlock';
import Scale from './Scale';
import AllEventScreen from '../../blocks/events/src/AllEventScreen';
import ArtistsToWatchAllScreen from '../../blocks/events/src/ArtistsToWatchAllScreen';
import ForgotPassword from '../../blocks/forgot-password/src/ForgotPassword';
import ForgotPasswordOTP from '../../blocks/forgot-password/src/ForgotPasswordOTP';
import NewPassword from '../../blocks/forgot-password/src/NewPassword';
import AllEventDetailScreen from '../../blocks/events/src/AllEventDetailScreen';
import Rolesandpermissions from '../../blocks/rolesandpermissions/src/Rolesandpermissions';
import TermsConditions from '../../blocks/termsconditions/src/TermsConditions';
import HelpCentre from '../../blocks/helpcentre/src/HelpCentre';
import Search from '../../blocks/search/src/Search';
import BrowseGenres from '../../blocks/search/src/BrowseGenres';
import Notifications from '../../blocks/notifications/src/Notifications';
import Contactus from '../../blocks/contactus/src/Contactus';
import Settings2 from '../../blocks/settings2/src/Settings2';
import EditProfile from '../../blocks/user-profile-basic/src/EditProfile';
import ChangePassword from '../../blocks/settings2/src/ChangePassword';
import Filteritems from '../../blocks/filteritems/src/Filteritems';
import SearchResult from '../../blocks/search/src/SearchResult';
import Followers from '../../blocks/followers/src/Followers';
import Icon from 'react-native-vector-icons/Feather';
import { lightTheme, PROFILE_THEME_CHANGED_EVENT, PROFILE_THEME_STORAGE_KEY, redesignTheme } from '../../blocks/utilities/src/Colors';
import AboutUs from '../../blocks/helpcentre/src/AboutUs';
import PostSelection from '../../blocks/postcreation/src/PostSelection';
import PostCreation from '../../blocks/postcreation/src/PostCreation';
import PostPostpone from '../../blocks/postcreation/src/PostPostpone';
import PostDetails from '../../blocks/postcreation/src/PostDetails';
import ImageSelection from '../../blocks/postcreation/src/ImageSelection';
import RepresentativeCertification from '../../blocks/email-account-registration/src/RepresentativeCertification';
import ClaimPage from '../../blocks/email-account-registration/src/ClaimPage';
import CreatePage from '../../blocks/email-account-registration/src/CreatePage';
import DisputeForm from '../../blocks/email-account-registration/src/DisputeForm';
import Likeapost2 from '../../blocks/likeapost2/src/Likeapost2';
import PhotoLibrary from '../../blocks/photolibrary/src/PhotoLibrary';
import Categoriessubcategories from '../../blocks/categoriessubcategories/src/Categoriessubcategories';
import Chat from '../../blocks/chat/src/Chat';
import RequestManagement from '../../blocks/requestmanagement/src/RequestManagement';
import PhotoLibraryDetail from '../../blocks/photolibrary/src/PhotoLibraryDetail';
import Share from '../../blocks/share/src/Share';
import CreateYourProfile from '../../blocks/user-profile-basic/src/CreateYourProfile';
import HomeEmptyScreen from '../../blocks/events/src/HomeEmptyScreen';
import Customisableuserprofiles2 from '../../blocks/customisableuserprofiles2/src/Customisableuserprofiles2';
import FastImage from './SafeFastImage';
import Geofence from '../../blocks/geofence/src/Geofence';
import Blockedusers from '../../blocks/blockedusers/src/Blockedusers';
import Eventregistration from '../../blocks/eventregistration/src/Eventregistration';
import ItineraryDetails from '../../blocks/eventregistration/src/ItineraryDetails';
import TopCitiesThisWeek from '../../blocks/eventregistration/src/TopCitiesThisWeek';
import { PERMISSIONS, request } from 'react-native-permissions';
export const baseURL = require('../../framework/src/config.js').baseURL;
//Assembler generated adapters start
const socialMediaLogInAdapter = new SocialMediaLogInAdapter();
const emailAccountLogInAdapter = new EmailAccountLogInAdapter();
const emailAccountSignUpAdapter = new EmailAccountSignUpAdapter();
const forgotPasswordAdapter = new ForgotPasswordAdapter();
const mobilePhoneToOTPAdapter = new MobilePhoneToOTPAdapter();
const otpToNewPasswordAdapter = new OtpToNewPasswordAdapter();

//Assembler generated adapters end

const privacyAdapter = new PrivacyPolicyAdapter();
const termAndConditionAdapter = new TermsAndConditionAdapter();
const splashScreenAdapter = new SplashScreenAdapter();
// Customizable Area End

const restAPIBlock = SingletonFactory.getRestBlockInstance();
const alertBlock = new AlertBlock();
const navigationBlock = new NavigationBlock();
const sessionBlock = SingletonFactory.getSessionBlockInstance();
const userAccountManagerBlock = SingletonFactory.getUserManagerInstance();
const homeScreenAdapter = new HomeScreenAdapter();
const infoPageAdapter = new InfoPageAdapter();
const alertPageWebAdapter = new AlertPageWebAdapter();

const instructions = Platform.select({
  // Customizable Area Start
  ios: 'The iOS APP to rule them all!',
  android: 'Now with Android AI',
  web: 'Selector your adventure.',
  // Customizable Area End
});

interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

// Customizable Area Start                                                                                              
interface S {
  modalVisible: boolean;
  activeTab: 'all' | 'music' | 'art' | 'enjoyment';
}

interface SS {}
            
const Animation_disable_routes = ['EmailAccountLoginBlock'];

let dynamicTransition = (transitionProps: any, prevTransitionProps: any) => {
  const isDisabledAnimation = Animation_disable_routes.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName),
  );
  if (isDisabledAnimation) {
    return {
      transitionSpec: {
        duration: 0,
      },
      cardStyleInterpolator: ({ current, next, layouts }: any) => {
        return {
          cardStyle: {
            opacity: current.progress,
          },
          containerStyle: {
            backgroundColor: 'transparent',
          },
        };
      },
    };
  }

  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
  );
};

const LoginStack = createStackNavigator(
  {
    EmailAccountLoginBlock: {
      screen: EmailAccountLoginBlock,
      navigationOptions: {
        header: null,
      },
    },
    Rolesandpermissions: {
      screen: Rolesandpermissions,
      navigationOptions: {
        header: null,
      },
    },
    EmailAccountRegistration: {
      screen: EmailAccountRegistration,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    OTPInputAuth: {
      screen: OTPInputAuth,
      navigationOptions: {
        header: null,
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        header: null,
      },
    },
    ForgotPasswordOTP: {
      screen: ForgotPasswordOTP,
      navigationOptions: {
        header: null,
      },
    },
    NewPassword: {
      screen: NewPassword,
      navigationOptions: {
        header: null,
      },
    },
    TermsConditions: {
      screen: TermsConditions,
      navigationOptions: {
        header: null,
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        header: null,
      },
    },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {
        header: null,
      },
    },
    Settings2: {
      screen: Settings2,
      navigationOptions: {
        header: null,
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        header: null,
      },
    },
    RepresentativeCertification: {
      screen: RepresentativeCertification,
      navigationOptions: {
        header: null,
      },
    },
    CreatePage: {
      screen: CreatePage,
      navigationOptions: {
        header: null,
      },
    },
    RequestManagement: {
      screen: RequestManagement,
      navigationOptions: {
        header: null,
      },
    },
    ClaimPage: {
      screen: ClaimPage,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    transitionConfig: dynamicTransition,
  },
);

LoginStack.navigationOptions = () => ({
  tabBarOnPress: ({ navigation, defaultHandler }: any) => {
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'EmailAccountLoginBlock',
    });
    defaultHandler();
  },
});

const ProfileStack = createStackNavigator({
  UserProfileBasicBlock: {
    screen: UserProfileBasicBlock,
    navigationOptions: {
      header: null,
    },
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      header: null,
    },
  },
  AllEventDetailScreen: {
    screen: AllEventDetailScreen,
    navigationOptions: {
      header: null,
    },
  },
  Followers: {
    screen: Followers,
    navigationOptions: {
      header: null,
    },
  },
  Blockedusers: {
    screen: Blockedusers,
    navigationOptions: { header: null, title: 'Blockedusers' },
  },

  Likeapost2: {
    screen: Likeapost2,
    navigationOptions: {
      header: null,
    },
  },
  CategoriesSubCategories: {
    screen: Categoriessubcategories,
    navigationOptions: {
      header: null,
    },
  },
  RequestManagement: {
    screen: RequestManagement,
    navigationOptions: {
      header: null,
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null,
    },
  },
  Share: {
    screen: Share,
    navigationOptions: {
      header: null,
    },
  },
  Contactus: {
    screen: Contactus,
    navigationOptions: {
      header: null,
    },
  },
  AboutUs: {
    screen: AboutUs,
    navigationOptions: {
      header: null,
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null,
    },
  },
  Settings2: {
    screen: Settings2,
    navigationOptions: {
      header: null,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null,
    },
  },
  TermsConditions: {
    screen: TermsConditions,
    navigationOptions: {
      header: null,
    },
  },
  HelpCentre: {
    screen: HelpCentre,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlockArtist: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
  /** Aliases for NavigationMessage targets used from nested screens (e.g. PostDetails category row). */
  UserProfileBasicBlock2: {
    screen: UserProfileBasicBlock,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlockArtist2: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
  PhotoLibraryDetail: {
    screen: PhotoLibraryDetail,
    navigationOptions: {
      header: null,
    },
  },
  PostDetails: {
    screen: PostDetails,
    navigationOptions: {
      header: null,
    },
  },
});
                                      
ProfileStack.navigationOptions = () => ({
  tabBarOnPress: ({ navigation, defaultHandler }: any) => {
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'UserProfileBasicBlock',
    });
    defaultHandler();
  },
});
                                  
const SearchStack = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      header: null,
    },
  },
  BrowseGenres: {
    screen: BrowseGenres,
    navigationOptions: {
      header: null,
    },
  },
  SearchResult: {
    screen: SearchResult,
    navigationOptions: {
      header: null,
    },
  },
  AllEventDetailScreen: {
    screen: AllEventDetailScreen,
    navigationOptions: {
      header: null,
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null,
    },
  },
  Contactus: {
    screen: Contactus,
    navigationOptions: {
      header: null,
    },
  },
  AboutUs: {
    screen: AboutUs,
    navigationOptions: {
      header: null,
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null,
    },
  },
  Settings2: {
    screen: Settings2,
    navigationOptions: {
      header: null,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null,
    },
  },
  TermsConditions: {
    screen: TermsConditions,
    navigationOptions: {
      header: null,
    },
  },
  HelpCentre: {
    screen: HelpCentre,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlock3: {
    screen: UserProfileBasicBlock,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlockArtist3: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
  Followers: {
    screen: Followers,
    navigationOptions: {
      header: null,
    },
  },
  Likeapost2: {
    screen: Likeapost2,
    navigationOptions: {
      header: null,
    },
  },
  PhotoLibraryDetail: {
    screen: PhotoLibraryDetail,
    navigationOptions: {
      header: null,
    },
  },
  PostDetails: {
    screen: PostDetails,
    navigationOptions: {
      header: null,
    },
  },
});

SearchStack.navigationOptions = () => ({
  tabBarOnPress: ({ navigation, defaultHandler }: any) => {
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'Search',
    });
    defaultHandler();
  },
});

const CalendarStack = createStackNavigator({
  Filteritems: {
    screen: Filteritems,
    navigationOptions: {
      header: null,
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null,
    },
  },
  PostDetails: {
    screen: PostDetails,
    navigationOptions: {
      header: null,
    },
  },
  Contactus: {
    screen: Contactus,
    navigationOptions: {
      header: null,
    },
  },
  AboutUs: {
    screen: AboutUs,
    navigationOptions: {
      header: null,
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null,
    },
  },
  Settings2: {
    screen: Settings2,
    navigationOptions: {
      header: null,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null,
    },
  },
  TermsConditions: {
    screen: TermsConditions,
    navigationOptions: {
      header: null,
    },
  },
  HelpCentre: {
    screen: HelpCentre,
    navigationOptions: {
      header: null,
    },
  },
  AllEventDetailScreen: {
    screen: AllEventDetailScreen,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlock2: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
  Likeapost2: {
    screen: Likeapost2,
    navigationOptions: {
      header: null,
    },
  },
  PhotoLibraryDetail: {
    screen: PhotoLibraryDetail,
    navigationOptions: {
      header: null,
    },
  },
  Rolesandpermissions: {
    screen: Rolesandpermissions,
    navigationOptions: {
      header: null,
    },
  },
  EmailAccountLoginBlock: {
    screen: EmailAccountLoginBlock,
    navigationOptions: {
      header: null,
    },
  },
});

CalendarStack.navigationOptions = () => ({
  tabBarOnPress: ({ navigation, defaultHandler }: any) => {
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'Filteritems',
    });
    defaultHandler();
  },
});

const PostStack = createStackNavigator({
  PostSelection: {
    screen: PostSelection,
    navigationOptions: {
      header: null,
    },
  },
  ImageSelection: {
    screen: ImageSelection,
    navigationOptions: {
      header: null,
    },
  },
  PostCreation: {
    screen: PostCreation,
    navigationOptions: {
      header: null,
    },
  },
  PostDetails: {
    screen: PostDetails,
    navigationOptions: {
      header: null,
    },
  },
  PostPostpone: {
    screen: PostPostpone,
    navigationOptions: {
      header: null,
    },
  },
  PhotoLibrary: {
    screen: PhotoLibrary,
    navigationOptions: {
      header: null,
    },
  },
  PhotoLibraryDetail: {
    screen: PhotoLibraryDetail,
    navigationOptions: {
      header: null,
    },
  },
  Likeapost2: {
    screen: Likeapost2,
    navigationOptions: {
      header: null,
    },
  },
  /** Same aliases as ProfileStack — PostDetails navigates here via NavigationMessage from Post tab. */
  UserProfileBasicBlock2: {
    screen: UserProfileBasicBlock,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlockArtist2: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
});

PostStack.navigationOptions = () => ({
  tabBarOnPress: ({ navigation, defaultHandler }: any) => {
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'PostSelection',
    });
    defaultHandler();
  },
});

const TravelStack = createStackNavigator({
  Eventregistration: {
    screen: Eventregistration,
    navigationOptions: {
      header: null,
    },
  },
  ItineraryDetails: {
    screen: ItineraryDetails,
    navigationOptions: {
      header: null,
    },
  },
  TopCitiesThisWeek: {
    screen: TopCitiesThisWeek,
    navigationOptions: {
      header: null,
    },
  },
  AllEventDetailScreen: {
    screen: AllEventDetailScreen,
    navigationOptions: {
      header: null,
    },
  },
  Geofence: {
    screen: Geofence,
    navigationOptions: {
      header: null,
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null,
    },
  },
  Contactus: {
    screen: Contactus,
    navigationOptions: {
      header: null,
    },
  },
  AboutUs: {
    screen: AboutUs,
    navigationOptions: {
      header: null,
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null,
    },
  },
  Settings2: {
    screen: Settings2,
    navigationOptions: {
      header: null,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null,
    },
  },
  TermsConditions: {
    screen: TermsConditions,
    navigationOptions: {
      header: null,
    },
  },
  HelpCentre: {
    screen: HelpCentre,
    navigationOptions: {
      header: null,
    },
  },
});

TravelStack.navigationOptions = () => ({
  tabBarOnPress: ({ navigation, defaultHandler }: any) => {
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'Eventregistration',
    });
    defaultHandler();
  },
});

const BandProfileStack = createStackNavigator({
  UserProfileBasicBlockArtist: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
  EditProfile: {
    screen: CreateYourProfile,
    navigationOptions: {
      header: null,
    },
  },
  Blockedusers: {
    screen: Blockedusers,
    navigationOptions: { header: null, title: 'Blockedusers' },
  },

  Followers: {
    screen: Followers,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlock: {
    screen: UserProfileBasicBlock,
    navigationOptions: {
      header: null,
    },
  },
  /** Aliases for NavigationMessage targets used from nested screens (e.g. PostDetails category row). */
  UserProfileBasicBlock2: {
    screen: UserProfileBasicBlock,
    navigationOptions: {
      header: null,
    },
  },
  UserProfileBasicBlockArtist2: {
    screen: Customisableuserprofiles2,
    navigationOptions: {
      header: null,
    },
  },
  Likeapost2: {
    screen: Likeapost2,
    navigationOptions: {
      header: null,
    },
  },
  AllEventDetailScreen: {
    screen: AllEventDetailScreen,
    navigationOptions: {
      header: null,
    },
  },
  PhotoLibraryDetail: {
    screen: PhotoLibraryDetail,
    navigationOptions: {
      header: null,
    },
  },
  PostDetails: {
    screen: PostDetails,
    navigationOptions: {
      header: null,
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null,
    },
  },
});

interface State {
  modalVisible: boolean;
  token: string;
  authToken: string;
  userName: string;
  userProfilePic: string;
  isLogoutConfirmationModal: boolean;
  userRole: string;
  haveUnreadChat: boolean;
  IsGettingToken: boolean;
  initialRoute: string;
  isDarkMode: boolean;
}

class HomeScreen extends BlockComponent<Props, State, SS> {
  static instance: HomeScreen;
  globalWebSocket: any;
  getChatListApiCallId: string = '';
  getFavouritesCallId: string = '';
  profileThemeListener: { remove: () => void } | null = null;
  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.AuthTokenEmailMessage),
      getName(MessageEnum.EditProfileUpdateMessage),
      getName(MessageEnum.RestAPIResponceMessage),
    ];

    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    HomeScreen.instance = this;
    this.state = {
      modalVisible: true,
      token: '',
      authToken: '',
      userName: '',
      userProfilePic: '',
      isLogoutConfirmationModal: false,
      userRole: 'fan',
      haveUnreadChat: false,
      IsGettingToken: true,
      initialRoute: 'Home',
      isDarkMode: true,
    };
  }

  getAuthToken = async () => {
    try {
      const authToken = (await getStorageData('authToken')) || '';
      const userRole = (await getStorageData('userRole')) || 'fan';

      this.setState({ authToken, userRole, IsGettingToken: false });

      if (authToken && authToken !== '') {
        const userName = (await getStorageData('user_name')) || '';
        const userProfilePic = (await getStorageData('user_profile_pic')) || '';
        this.setState({ userName, userProfilePic });
        this.checkUpcomingShows();
      }
    } catch (error) {
      this.setState({
        authToken: '',
        userRole: 'fan',
        userName: '',
        userProfilePic: '',
        IsGettingToken: false,
      });
    }
  };

  onTokenRefresh = async (newToken: string) => {
    const authToken = await getStorageData('authToken');
    if (authToken === null || authToken === '') {
      return;
    }
    const header = {
      'Content-Type': 'application/json',
      token: authToken,
    };

    const payload = {
      device_id: newToken,
    };

    const updateDeviceIdRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

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
  };

  // Check if running on emulator
  isEmulator = () => {
    return __DEV__ && (Platform.OS === 'android' || Platform.OS === 'ios');
  };

  // Validate all permission constants at startup
  validatePermissionConstants = () => {
    try {
      // Check Android permissions
      if (Platform.OS === 'android') {
        if (!PermissionsAndroid) {
          return false;
        }

        if (!PermissionsAndroid.PERMISSIONS) {
          return false;
        }

        const requiredAndroidPermissions = [
          'ACCESS_FINE_LOCATION',
          'CAMERA',
          'READ_EXTERNAL_STORAGE',
          'WRITE_EXTERNAL_STORAGE',
        ];

        // Only check POST_NOTIFICATIONS on Android API level 33+ (Android 13+)
        if (Platform.Version >= 33) {
          requiredAndroidPermissions.push('POST_NOTIFICATIONS');
        }

        for (const permission of requiredAndroidPermissions) {
          if (!(permission in PermissionsAndroid.PERMISSIONS)) {
            // Don't return false for POST_NOTIFICATIONS on older Android versions
            if (permission === 'POST_NOTIFICATIONS' && Platform.Version < 33) {
              continue;
            }
            return false;
          }
        }
      }

      // Check iOS permissions
      if (Platform.OS === 'ios') {
        if (!PERMISSIONS) {
          return false;
        }

        if (!PERMISSIONS.IOS) {
          return false;
        }

        const requiredIOSPermissions = [
          'LOCATION_WHEN_IN_USE',
          'CAMERA',
          'PHOTO_LIBRARY',
        ];

        for (const permission of requiredIOSPermissions) {
          if (!(permission in PERMISSIONS.IOS)) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // Safe iOS permission request wrapper
  safeIOSPermissionRequest = async (permission: any) => {
    try {
      // Validate permission parameter
      if (!permission || permission === null || permission === undefined) {
        return null;
      }

      // Validate that request function exists
      if (typeof request !== 'function') {
        return null;
      }

      const result = await request(permission);
      return result;
    } catch (error) {
      return null;
    }
  };

  // Safe permission request that handles emulator issues
  safeRequestPermission = async (permission: any) => {
    try {
      // Validate permission parameter
      if (!permission || permission === null || permission === undefined) {
        return false;
      }

      // Check if PermissionsAndroid is available
      if (
        !PermissionsAndroid ||
        typeof PermissionsAndroid.request !== 'function'
      ) {
        return false;
      }

      const result = await PermissionsAndroid.request(permission);
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  requestUserPermission = async () => {
    // try {
    //   // Check if messaging service is available
    //   if (!messaging) {
    //     console.log('Messaging service not available');
    //     return;
    //   }
    //   await messaging().registerDeviceForRemoteMessages()
    //   messaging().setBackgroundMessageHandler(async remoteMessage => {
    //     runEngine.debugLog('Push Notification Received',JSON.stringify(remoteMessage))
    //   });
    //   messaging().onTokenRefresh(this.onTokenRefresh);
    //   if (Platform.OS === 'android') {
    //     if (Platform.Version >= 33) {
    //       // Check if PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS is defined
    //       if (!PermissionsAndroid || !PermissionsAndroid.PERMISSIONS || !PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
    //         console.log('Android notification permission constant is not defined');
    //         return;
    //       }
    //       // Use safe permission request
    //       const hasPermission = await this.safeRequestPermission(
    //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    //       );
    //       if (hasPermission) {
    //         console.log('Notification permission granted');
    //       } else {
    //         console.log('Notification permission not granted');
    //       }
    //     }
    //     try {
    //       const token = await messaging().getToken();
    //       await setStorageData('FCMToken',token)
    //     } catch (error) {
    //       console.log('Error getting FCM token:', error);
    //     }
    //   } else {
    //     try {
    //       const authStatus = await messaging().requestPermission();
    //       if (authStatus !== 1) {
    //         console.log('Notification permission denied');
    //         return;
    //       }
    //       const token = await messaging().getToken();
    //       await setStorageData('FCMToken',token)
    //     } catch (error) {
    //       console.log('Error with iOS notification permission:', error);
    //     }
    //   }
    // } catch (error) {
    //   console.log('Error in requestUserPermission:', error);
    // }
  };

  requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        // Check if PERMISSIONS.IOS.LOCATION_WHEN_IN_USE is defined
        if (
          !PERMISSIONS ||
          !PERMISSIONS.IOS ||
          !PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        ) {
          return;
        }

        await this.safeIOSPermissionRequest(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
      } else if (Platform.OS === 'android') {
        // Check if PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION is defined
        if (
          !PermissionsAndroid ||
          !PermissionsAndroid.PERMISSIONS ||
          !PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ) {
          return;
        }

        // Use safe permission request
        const hasPermission = await this.safeRequestPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (!hasPermission) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location services to use this feature.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        }
      }
    } catch (error) {
      // Error handling without logging
    }
  };

  connectGlobalSocket = async () => {
    const token = await getStorageData('authToken');

    // Only connect if we have a valid token
    if (!token) {
      return;
    }

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
        this.globalWebSocket?.send(subscriptionMessageStr);
      };
      this.globalWebSocket.onmessage = (event: any) => {
        this.handleSocketMessage(JSON.parse(event.data));
      };
      this.globalWebSocket.onerror = (error: any) => {
        console.log('WebSocket error:', error);
      };
      this.globalWebSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.log('Failed to connect to WebSocket:', error);
    }
  };

  handleSocketMessage = (chatData: any) => {
    try {
      // Only process messages if user is authenticated
      if (!this.state.authToken) {
        return;
      }

      const message = chatData?.message;
      if (!message) return;

      const { type, sub_type } = message;
      if (
        type === 'chat' &&
        (sub_type === 'chat_message' || sub_type === 'marked_read')
      ) {
        this.getChatForUnreadCount();
      }
    } catch (error) {
      console.log('Error in handleSocketMessage:', error);
    }
  };

  async componentDidMount(): Promise<void> {
    try {
      super.componentDidMount();
      this.loadHomeTheme();

      // Add a timeout to prevent getting stuck in loading state
      setTimeout(() => {
        if (this.state.IsGettingToken) {
          console.log('Forcing loading state to false due to timeout');
          this.setState({ IsGettingToken: false });
        }
      }, 5000); // 5 second timeout

      // Get auth token safely
      try {
        await this.getAuthToken();
      } catch (error) {
        console.log('Error getting auth token:', error);
      }

      // Get push token safely
      try {
        await this.getToken();
      } catch (error) {
        console.log('Error getting push token:', error);
      }

      // Only proceed with authenticated operations if we have a token
      if (this.state.authToken && this.state.authToken !== '') {
        try {
          this.getChatForUnreadCount();
          await this.connectGlobalSocket();
        } catch (error) {
          console.log('Error in authenticated operations:', error);
        }
      }

      // Validate permission constants first - but don't block the app
      try {
        const permissionsValid = this.validatePermissionConstants();
        if (!permissionsValid) {
          console.log(
            '⚠️ Permission constants validation failed - continuing with app functionality',
          );
          // Still try to handle permissions even if validation fails
          this.handlePermissionsAsync();
        } else {
          // Handle permissions safely
          this.handlePermissionsAsync();
        }
      } catch (error) {
        console.log('Error handling permissions:', error);
        // Continue with app functionality even if permission handling fails
        this.handlePermissionsAsync();
      }

      // Add navigation listener safely
      if (this.props.navigation && this.props.navigation.addListener) {
        try {
          this.props.navigation.addListener('willFocus', async () => {
            try {
              await this.getAuthToken();
              await this.getToken();
              if (this.state.authToken && this.state.authToken !== '') {
                await this.connectGlobalSocket();
                this.getChatForUnreadCount();
              }
              this.handlePermissionsAsync();
            } catch (error) {
              console.log('Error in willFocus listener:', error);
            }
          });
        } catch (error) {
          console.log('Error adding navigation listener:', error);
        }
      }
    } catch (error) {
      console.log('Error in componentDidMount:', error);
      this.setState({ IsGettingToken: false });
    }
  }

  handlePermissionsAsync = async () => {
    // Handle permissions with error handling - don't block the app
    // Add longer delays to ensure app is fully initialized
    setTimeout(async () => {
      try {
        await this.requestUserPermission();
      } catch (error) {
        console.log('User permission request failed:', error);
      }
    }, 5000); // Delay permission requests by 5 seconds

    setTimeout(async () => {
      try {
        await this.requestLocationPermission();
      } catch (error) {
        console.log('Location permission request failed:', error);
      }
    }, 7000); // Delay location permission by 7 seconds
  };

  loadHomeTheme = async () => {
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

  getHomeTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  async componentWillUnmount(): Promise<void> {
    super.componentWillUnmount();
    // Close WebSocket connection when component unmounts
    if (this.globalWebSocket) {
      this.globalWebSocket.close();
    }
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
  }

  getChatForUnreadCount = async () => {
    // Only make API call if user is authenticated
    if (!this.state.authToken) {
      return;
    }

    // Prevent multiple simultaneous API calls
    if (this.getChatListApiCallId) {
      return;
    }

    try {
      const header = {
        'Content-Type': 'application/json',
        token: this.state.authToken,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );
      this.getChatListApiCallId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        '/bx_block_chat/chats',
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        'GET',
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    } catch (error) {
      console.log('Failed to get chat count:', error);
      this.getChatListApiCallId = '';
    }
  };

  getToken = async () => {
    const token = await getStorageData('authToken');
    const redirectionNav = await getStorageData('redirectionNav');
    this.setState({ token });
    if (redirectionNav !== null) {
      this.setState({ initialRoute: redirectionNav });
    }
  };

  hasUnreadChats = (list: any[] = []) => {
    try {
      if (!Array.isArray(list)) return false;
      return list.some((item: any) => item?.unreadCount > 0);
    } catch (error) {
      console.log('Error in hasUnreadChats:', error);
      return false;
    }
  };

  checkUpcomingShows = () => {
    if (!this.state.authToken) return;

    const { userRole } = this.state;
    // Format dates as YYYY-MM-DD for the API
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().add(1, 'days').format('YYYY-MM-DD');

    let endpoint = '';

    // Mimic Filteritems logic for endpoint selection
    if (userRole === 'fan') {
      endpoint = `/bx_block_calendar/filter_shows_by_date_range?start_date=${startDate}&end_date=${endDate}`;
    } else {
      // For other roles, use the artist/band endpoint (defaulting to type=post)
      endpoint = `/bx_block_calendar/filter_artist_show_by_date?start_date=${startDate}&end_date=${endDate}&type=post&query=`;
    }

    const header = {
      'Content-Type': 'application/json',
      token: this.state.authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getFavouritesCallId = requestMessage.messageId;

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
      'GET',
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  receive(from: string, message: Message): void {
    try {
      if (!message || !message.id) return;

      if (getName(MessageEnum.AuthTokenEmailMessage) === message.id) {
        this.getToken();
        this.getAuthToken()
          .then(() => {
            // Only make API calls if user is now authenticated
            if (this.state.authToken) {
              this.getChatForUnreadCount();
              this.connectGlobalSocket();
            }
          })
          .catch(error => {
            console.log('Error in getAuthToken:', error);
          });
      }

      if (getName(MessageEnum.EditProfileUpdateMessage) === message.id) {
        const payloadData = message.getData(
          getName(MessageEnum.EditProfileUpdateMessage),
        );

        if (payloadData) {
          this.setState({
            userName: payloadData.userName || '',
            userProfilePic: payloadData.user_profile_pic || '',
          });
        }
      } else if (message.id === getName(MessageEnum.RestAPIResponceMessage)) {
        const apiRequestCallId = message.getData(
          getName(MessageEnum.RestAPIResponceDataMessage),
        );

        if (apiRequestCallId === this.getChatListApiCallId) {
          const responseJson = message.getData(
            getName(MessageEnum.RestAPIResponceSuccessMessage),
          );
          const errorMessage = message.getData(
            getName(MessageEnum.RestAPIResponceErrorMessage),
          );

          // Clear the API call ID regardless of success or failure
          this.getChatListApiCallId = '';

          if (responseJson && responseJson.data) {
            const chatList = responseJson.data ?? [];
            let results =
              chatList?.map((item: any) => {
                return {
                  unreadCount: item?.attributes?.unread_message ?? 0,
                };
              }) || [];
            let haveUnreadChat = this.hasUnreadChats(results);
            this.setState({ haveUnreadChat });
          } else if (errorMessage) {
            const frameworkConfig = require('../../framework/src/config');
            console.log('[HomeScreen] getChatList API error:', {
              url: `${frameworkConfig.baseURL}/bx_block_chat/chats`,
              method: 'GET',
              error: errorMessage,
              response: responseJson,
            });
          }
        } else if (apiRequestCallId === this.getFavouritesCallId) {
          const responseJson = message.getData(
            getName(MessageEnum.RestAPIResponceSuccessMessage),
          );

          if (responseJson && responseJson.data) {
            // Arrays of events are in responseJson.data
            const events = Array.isArray(responseJson.data)
              ? responseJson.data
              : [];

            // Use UTC for consistent comparison as seen in Filteritems
            const today = moment().utc();
            const tomorrow = moment().add(1, 'days').utc();

            let showAlert = false;
            let alertMessage = '';

            const hasShowToday = events.some((item: any) => {
              // Use date_of_the_show as primary, fallback to event_date
              const dateStr =
                item.attributes.date_of_the_show || item.attributes.event_date;
              if (!dateStr) return false;
              // Parse as UTC
              const showDate = moment(dateStr).utc();
              return showDate.isSame(today, 'day');
            });

            if (hasShowToday) {
              showAlert = true;
              alertMessage = 'TODAY YOU HAVE A SHOW!';
            } else {
              const hasShowTomorrow = events.some((item: any) => {
                const dateStr =
                  item.attributes.date_of_the_show ||
                  item.attributes.event_date;
                if (!dateStr) return false;
                const showDate = moment(dateStr).utc();
                return showDate.isSame(tomorrow, 'day');
              });

              if (hasShowTomorrow) {
                showAlert = true;
                alertMessage = `You have a show coming up tomorrow on ${tomorrow.format(
                  'MMMM Do',
                )}!`;
              }
            }

            if (showAlert) {
              Alert.alert('Reminder', alertMessage);
            }
          }
          // Clear the API call ID
          this.getFavouritesCallId = '';
        }
      }
    } catch (error) {
      console.log('Error in receive:', error);
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<Props>,
    nextState: Readonly<State>,
    nextContext: any,
  ): boolean {
    if (
      nextState.authToken !== this.state.authToken ||
      nextState.token !== this.state.token ||
      nextState.isLogoutConfirmationModal !==
        this.state.isLogoutConfirmationModal ||
      nextState.userRole !== this.state.userRole ||
      nextState.IsGettingToken !== this.state.IsGettingToken ||
      nextState.initialRoute !== this.state.initialRoute
    ) {
      return true;
    } else {
      return false;
    }
  }

  ListHeaderComponent = (
    props: any,
    theme: typeof redesignTheme,
    ds: ReturnType<typeof createDrawerStyles>,
  ) => {
    const photoUri = (this.state.userProfilePic || '').trim();
    return (
      <View>
        <View style={ds.drawerCloseRow}>
          <TouchableOpacity
            onPress={() => props.navigation.closeDrawer()}
            style={ds.drawerCloseBtn}
            activeOpacity={0.8}
          >
            <Icon name="x" size={18} color={theme.foreground} />
          </TouchableOpacity>
        </View>
        {this.state.authToken !== null && (
          <View style={ds.drawerInnerContainer}>
            <Text style={ds.profileText}>{this.state.userName}</Text>
            <View style={ds.avatarShadowWrap}>
              <View style={ds.profileImgStyle}>
                {photoUri ? (
                  <FastImage
                    source={{
                      uri: photoUri,
                      priority: FastImage.priority.high,
                    }}
                    style={ds.profileImgFill}
                  />
                ) : (
                  <Icon name="user" size={48} color={theme.muted} />
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  renderRedDot = ({
    condition,
    color,
  }: {
    condition: boolean;
    color: string;
  }) => {
    if (condition) {
      return (
        <View
          style={{
            height: 9,
            width: 9,
            borderRadius: 32,
            backgroundColor: color,
            position: 'absolute',
            left: 22,
            top: -2,
          }}
        />
      );
    }

    return <></>;
  };

  CustomDrawer = (props: any) => {
    const drawrMenu = this.state.token
      ? [
          {
            id: 1,
            title: 'About Local Shows',
            navigation: 'navigateTo',
            icon: 'home',
          },
          {
            id: 2,
            title: 'Chat',
            navigation: 'navigateTo',
            icon: 'message-circle',
          },
          {
            id: 3,
            title: 'Contact us',
            navigation: 'navigateTo',
            icon: 'phone',
          },
          {
            id: 4,
            title: 'Settings',
            navigation: 'navigateTo',
            icon: 'settings',
          },
          {
            id: 5,
            title: 'Help Center',
            navigation: 'navigateTo',
            icon: 'help-circle',
          },
          {
            id: 6,
            title: 'Terms & Conditions',
            navigation: 'navigateTo',
            icon: 'info',
          },
          {
            id: 7,
            title: 'Privacy Policy',
            navigation: 'navigateTo',
            icon: 'shield',
          },
          {
            id: 8,
            title: 'Logout',
            navigation: 'navigateTo',
            icon: 'log-out',
          },
        ]
      : [
          {
            id: 1,
            title: 'About Local Shows',
            navigation: 'navigateTo',
            icon: 'home',
          },
          {
            id: 2,
            title: 'Contact us',
            navigation: 'navigateTo',
            icon: 'phone',
          },
          {
            id: 3,
            title: 'Help Center',
            navigation: 'navigateTo',
            icon: 'help-circle',
          },
          {
            id: 4,
            title: 'Terms & Conditions',
            navigation: 'navigateTo',
            icon: 'info',
          },
          {
            id: 5,
            title: 'Privacy Policy',
            navigation: 'navigateTo',
            icon: 'shield',
          },
        ];

    const logoutUser = async () => {
      props.navigation.closeDrawer();
      // return
      const token = await getStorageData('authToken');
      if (token) {
        console.log(
          '🧹 HomeScreen logoutUser - Clearing all cache and AsyncStorage data',
        );

        // Clear all user-related data using the helper function
        const { clearAllUserData } = require('../../framework/src/Utilities');
        await clearAllUserData();

        this.setState(
          {
            authToken: null,
            userRole: null,
            token: null,
            isLogoutConfirmationModal: false,
          },
          () => {
            // Close drawer, then reset within the tab navigator to keep bottom tabs visible.
            // Use props.navigation (Drawer) instead of this.props.navigation (root Stack).
            props.navigation.closeDrawer?.();

            const resetAction = CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'HomeTab',
                  state: {
                    index: 3, // Profile tab (HomeFeed, Search, Calender, Profile when logged out)
                    routes: [
                      { name: 'HomeFeed' },
                      { name: 'Search' },
                      { name: 'Calender' },
                      {
                        name: 'Profile',
                        state: {
                          index: 0,
                          routes: [{ name: 'EmailAccountLoginBlock' }],
                        },
                      },
                    ],
                  },
                },
              ],
            });
            props.navigation.dispatch(resetAction);
          },
        );
      }
    };
    const onPressMenu = async (item: any) => {
      if (item.title == 'Logout') {
        this.setState({ isLogoutConfirmationModal: true });
      } else if (item.title === 'Terms & Conditions') {
        const message: Message = new Message(
          getName(MessageEnum.NavigationMessage),
        );
        message.addData(getName(MessageEnum.NavigationPropsMessage), props);
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
        message.addData(
          getName(MessageEnum.NavigationRaiseMessage),
          raiseMessage,
        );
        this.send(message);
      } else if (item.title === 'Privacy Policy') {
        props.navigation.navigate('PrivacyPolicy');
      } else if (item.title === 'About Local Shows') {
        props.navigation.navigate('AboutUs');
      } else if (item.title === 'Help Center') {
        props.navigation.navigate('HelpCentre');
      } else if (item.title === 'Contact us') {
        props.navigation.navigate('Contactus');
      } else if (item.title === 'Settings') {
        props.navigation.navigate('Settings2');
      } else if (item.title === 'Chat') {
        props.navigation.navigate('Chat');
        await removeStorageData('startChatWith');
      } else {
      }
    };
    return (
      <DrawerThemedRoot
        render={(theme, ds) => {
          const renderMenu = ({ item }: any) => {
            const isLogout = item.title === 'Logout';
            return (
              <TouchableOpacity
                onPress={() => onPressMenu(item)}
                style={ds.drawerMenuItemStyle}
                activeOpacity={0.8}
              >
                <View style={ds.menuContainerStyle}>
                  <View style={ds.menuIconWrap}>
                    <Icon
                      name={item.icon}
                      size={18}
                      color={isLogout ? theme.primary : theme.foreground}
                    />
                  </View>
                  {item.title === 'Chat' &&
                    this.renderRedDot({
                      condition: this.state.haveUnreadChat,
                      color: theme.primary,
                    })}
                  <Text
                    style={[
                      ds.drawerMenuTextStyle,
                      isLogout && { color: theme.primary },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color={theme.muted} />
              </TouchableOpacity>
            );
          };

          return (
            <SafeAreaView style={ds.drawerStyle}>
              <FlatList
                ListHeaderComponent={this.ListHeaderComponent(
                  props,
                  theme,
                  ds,
                )}
                data={drawrMenu}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderMenu}
                showsVerticalScrollIndicator={false}
              />

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isLogoutConfirmationModal}
              >
                <View style={ds.modalParentView}>
                  <View style={ds.modalContainerView}>
                    <TouchableOpacity
                      style={ds.disablePopupIconContainer}
                      onPress={() =>
                        this.setState({ isLogoutConfirmationModal: false })
                      }
                    >
                      <Icon name="x" color={theme.foreground} size={22} />
                    </TouchableOpacity>
                    <Text style={ds.txtDeleteHeading}>Logout Confirmation</Text>
                    <Text style={ds.txtDelete}>
                      Are you sure you want to logout of the application?
                    </Text>
                    <TouchableOpacity
                      style={[
                        ds.deleteButtonContainer,
                        ds.keepButtonContainer,
                      ]}
                      onPress={() =>
                        this.setState({ isLogoutConfirmationModal: false })
                      }
                    >
                      <Text
                        style={[ds.textDeleteButton, ds.textKeepButton]}
                      >
                        No, Stay!
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={ds.deleteButtonContainer}
                      onPress={() => logoutUser()}
                    >
                      <Text style={ds.textDeleteButton}>Yes, Logout!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </SafeAreaView>
          );
        }}
      />
    );
  };

  render() {
    try {
      // If still loading, show a simple loading screen
      if (this.state.IsGettingToken) {
        return (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: this.getHomeTheme().background,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: this.getHomeTheme().foreground,
                marginBottom: 20,
              }}
            >
              Loading...
            </Text>
            <ActivityIndicator size={'large'} color={this.getHomeTheme().primary} />
            <TouchableOpacity
              style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: this.getHomeTheme().primary,
                borderRadius: 8,
              }}
              onPress={() => {
                console.log('Force continue pressed');
                this.setState({ IsGettingToken: false });
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>
                Continue Anyway
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        );
      }

      const HomeStack = createStackNavigator(
        {
          Home: {
            screen: AllEventScreen,
            navigationOptions: {
              header: null,
            },
          },
          AllEventDetailScreen: {
            screen: AllEventDetailScreen,
            navigationOptions: {
              header: null,
            },
          },
          ArtistsToWatchAllScreen: {
            screen: ArtistsToWatchAllScreen,
            navigationOptions: {
              header: null,
            },
          },
          Notifications: {
            screen: Notifications,
            navigationOptions: {
              header: null,
            },
          },
          Followers: {
            screen: Followers,
            navigationOptions: {
              header: null,
            },
          },
          HelpCentre: {
            screen: HelpCentre,
            navigationOptions: {
              header: null,
            },
          },
          Likeapost2: {
            screen: Likeapost2,
            navigationOptions: {
              header: null,
            },
          },
          Chat: {
            screen: Chat,
            navigationOptions: {
              header: null,
            },
          },
          Share: {
            screen: Share,
            navigationOptions: {
              header: null,
            },
          },
          PhotoLibraryDetail: {
            screen: PhotoLibraryDetail,
            navigationOptions: {
              header: null,
            },
          },

          Contactus: {
            screen: Contactus,
            navigationOptions: {
              header: null,
            },
          },
          TermsConditions: {
            screen: TermsConditions,
            navigationOptions: {
              header: null,
            },
          },
          Settings2: {
            screen: Settings2,
            navigationOptions: {
              header: null,
            },
          },
          ChangePassword: {
            screen: ChangePassword,
            navigationOptions: {
              header: null,
            },
          },
          AboutUs: {
            screen: AboutUs,
            navigationOptions: {
              header: null,
            },
          },
          UserProfileBasicBlock2: {
            screen: UserProfileBasicBlock,
            navigationOptions: {
              header: null,
            },
          },
          UserProfileBasicBlockArtist2: {
            screen: Customisableuserprofiles2,
            navigationOptions: {
              header: null,
            },
          },
          UserProfileBasicBlock3: {
            screen: UserProfileBasicBlock,
            navigationOptions: {
              header: null,
            },
          },
          UserProfileBasicBlockArtist3: {
            screen: Customisableuserprofiles2,
            navigationOptions: {
              header: null,
            },
          },
          CreateYourProfile: {
            screen: CreateYourProfile,
            navigationOptions: {
              header: null,
            },
          },
          CategoriesSubCategories: {
            screen: Categoriessubcategories,
            navigationOptions: {
              header: null,
            },
          },
          PostDetails: {
            screen: PostDetails,
            navigationOptions: {
              header: null,
            },
          },
          Rolesandpermissions: {
            screen: Rolesandpermissions,
            navigationOptions: {
              header: null,
            },
          },
          EmailAccountLoginBlock: {
            screen: EmailAccountLoginBlock,
            navigationOptions: {
              header: null,
            },
          },
        },
        { initialRouteName: this.state.initialRoute },
      );

      HomeStack.navigationOptions = () => ({
        tabBarOnPress: ({ navigation, defaultHandler }: any) => {
          navigation.dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'Home',
          });
          defaultHandler();
        },
      });

      const ProfileScreen = this.state.authToken
        ? this.state.userRole === 'fan'
          ? ProfileStack
          : BandProfileStack
        : LoginStack;
      const profileTabRootScreen = this.state.authToken
        ? this.state.userRole === 'fan'
          ? 'UserProfileBasicBlock'
          : 'UserProfileBasicBlockArtist'
        : 'EmailAccountLoginBlock';
      const isForceUpdateBlocked = async () => {
        const flag = await getStorageData('forceUpdateRequired');
        return flag === 'true';
      };
      const IsPostOrCalendar = this.state.authToken
        ? this.state.userRole === 'fan'
          ? {
              Calender: {
                screen: CalendarStack,
                navigationOptions: {
                  header: null,
                  tabBarIcon: ({
                    tintColor,
                    focused,
                  }: {
                    tintColor: string;
                    focused: boolean;
                  }) => (
                    <Image
                      source={require('../../mobile/assets/images/image_calendar.png')}
                      style={[
                        styles.searchIcons,
                        {
                          tintColor: focused
                            ? this.getHomeTheme().primary
                            : this.getHomeTheme().muted,
                        },
                      ]}
                    />
                  ),
                  tabBarLabel: 'Calendar',
                  tabStackRootScreen: 'Filteritems',
                  tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                    if (await isForceUpdateBlocked()) {
                      return;
                    }
                    setStorageData('redirectionNav', 'Home');
                    handleBottomTabRepress(
                      navigation,
                      'Calender',
                      'Filteritems',
                      defaultHandler,
                    );
                  },
                },
              },
              Travel: {
                screen: TravelStack,
                navigationOptions: {
                  header: null,
                  tabBarIcon: ({
                    tintColor,
                    focused,
                  }: {
                    tintColor: string;
                    focused: boolean;
                  }) => (
                    <Image
                      source={require('../../mobile/assets/images/flight.png')}
                      style={[
                        styles.searchIcons,
                        {
                          tintColor: focused
                            ? this.getHomeTheme().primary
                            : this.getHomeTheme().muted,
                        },
                      ]}
                    />
                  ),
                  tabBarLabel: 'Travel',
                  tabStackRootScreen: 'Eventregistration',
                  tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                    if (await isForceUpdateBlocked()) {
                      return;
                    }
                    setStorageData('redirectionNav', 'Home');
                    handleBottomTabRepress(
                      navigation,
                      'Travel',
                      'Eventregistration',
                      defaultHandler,
                    );
                  },
                },
              },
            }
          : {
              PostSelection: {
                screen: PostStack,
                navigationOptions: {
                  header: null,
                  tabBarIcon: ({
                    tintColor,
                    focused,
                  }: {
                    tintColor: string;
                    focused: boolean;
                  }) => (
                    <Image
                      source={require('../../mobile/assets/images/post_creation.png')}
                      style={[
                        styles.searchIcons,
                        {
                          tintColor: focused
                            ? this.getHomeTheme().primary
                            : this.getHomeTheme().muted,
                        },
                      ]}
                    />
                  ),
                  tabBarLabel: 'Post',
                  tabStackRootScreen: 'PostSelection',
                  tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                    if (await isForceUpdateBlocked()) {
                      return;
                    }
                    setStorageData('redirectionNav', 'Home');
                    handleBottomTabRepress(
                      navigation,
                      'PostSelection',
                      'PostSelection',
                      defaultHandler,
                    );
                  },
                },
              },
              Calender: {
                screen: CalendarStack,
                navigationOptions: {
                  header: null,
                  tabBarIcon: ({
                    tintColor,
                    focused,
                  }: {
                    tintColor: string;
                    focused: boolean;
                  }) => (
                    <Image
                      source={require('../../mobile/assets/images/image_calendar.png')}
                      style={[
                        styles.searchIcons,
                        {
                          tintColor: focused
                            ? this.getHomeTheme().primary
                            : this.getHomeTheme().muted,
                        },
                      ]}
                    />
                  ),
                  tabBarLabel: 'Calendar',
                  tabStackRootScreen: 'Filteritems',
                  tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                    if (await isForceUpdateBlocked()) {
                      return;
                    }
                    setStorageData('redirectionNav', 'Home');
                    handleBottomTabRepress(
                      navigation,
                      'Calender',
                      'Filteritems',
                      defaultHandler,
                    );
                  },
                },
              },
            }
        : {
            Calender: {
              screen: CalendarStack,
              navigationOptions: {
                header: null,
                tabBarIcon: ({
                  tintColor,
                  focused,
                }: {
                  tintColor: string;
                  focused: boolean;
                }) => (
                  <Image
                    source={require('../../mobile/assets/images/image_calendar.png')}
                    style={[
                      styles.searchIcons,
                      {
                        tintColor: focused
                          ? this.getHomeTheme().primary
                          : this.getHomeTheme().muted,
                      },
                    ]}
                  />
                ),
                tabBarLabel: 'Calendar',
                tabStackRootScreen: 'Filteritems',
                tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                  if (await isForceUpdateBlocked()) {
                    return;
                  }
                  setStorageData('redirectionNav', 'Home');
                  handleBottomTabRepress(
                    navigation,
                    'Calender',
                    'Filteritems',
                    defaultHandler,
                  );
                },
              },
            },
          };

      const TabNavigator = createBottomTabNavigator(
        {
          HomeFeed: {
            screen: HomeStack,
            navigationOptions: {
              header: null,
              tabBarIcon: ({
                tintColor,
                focused,
              }: {
                tintColor: string;
                focused: boolean;
              }) => (
                <Image
                  source={require('../../mobile/assets/images/image_home.png')}
                  style={[
                    styles.searchIcons,
                    {
                      tintColor: focused
                        ? this.getHomeTheme().primary
                        : this.getHomeTheme().muted,
                    },
                  ]}
                />
              ),
              tabBarLabel: 'Home',
              tabStackRootScreen: 'Home',
              tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                if (await isForceUpdateBlocked()) {
                  return;
                }
                handleBottomTabRepress(
                  navigation,
                  'HomeFeed',
                  'Home',
                  defaultHandler,
                  { onReturnedToRoot: emitHomeFeedTabScrollToTop },
                );
              },
            },
          },
          Search: {
            screen: SearchStack,
            navigationOptions: {
              header: null,
              tabBarIcon: ({
                tintColor,
                focused,
              }: {
                tintColor: string;
                focused: boolean;
              }) => (
                <Image
                  source={require('../../mobile/assets/images/image_search.png')}
                  style={[
                    styles.searchIcons,
                    {
                      tintColor: focused
                        ? this.getHomeTheme().primary
                        : this.getHomeTheme().muted,
                    },
                  ]}
                />
              ),
              tabBarLabel: 'Search',
              tabStackRootScreen: 'Search',
              tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                if (await isForceUpdateBlocked()) {
                  return;
                }
                setStorageData('redirectionNav', 'Home');
                handleBottomTabRepress(
                  navigation,
                  'Search',
                  'Search',
                  defaultHandler,
                );
              },
            },
          },
          ...IsPostOrCalendar,
          Profile: {
            screen: ProfileScreen,
            navigationOptions: {
              header: null,
              tabBarIcon: ({
                tintColor,
                focused,
              }: {
                tintColor: string;
                focused: boolean;
              }) => (
                <Image
                  source={require('../../mobile/assets/images/image_person.png')}
                  style={[
                    styles.searchIcons,
                    {
                      tintColor: focused
                        ? this.getHomeTheme().primary
                        : this.getHomeTheme().muted,
                    },
                  ]}
                />
              ),
              tabBarLabel: this.state.authToken ? 'Profile' : 'Log in',
              tabStackRootScreen: profileTabRootScreen,
              tabBarOnPress: async ({ navigation, defaultHandler }: any) => {
                if (await isForceUpdateBlocked()) {
                  return;
                }
                setStorageData('redirectionNav', 'Home');
                await removeStorageData('profileIdToLoad');
                await removeStorageData('IsFromCommentProfile');
                await removeStorageData('IsFromComment');

                const isReselect = isTabCurrentlySelected(
                  navigation,
                  'Profile',
                );
                const wasDeep =
                  isReselect && getTabStackIndex(navigation, 'Profile') > 0;

                resetProfileTabToOwnProfile(
                  navigation,
                  profileTabRootScreen,
                  { resetProfile: true },
                );
                emitProfileTabPressReset();

                if (!wasDeep) {
                  defaultHandler();
                }
              },
            },
          },
        },
        {
          initialRouteName: 'HomeFeed',
          tabBarOptions: {
            activeTintColor: this.getHomeTheme().primary,
            inactiveTintColor: this.getHomeTheme().muted,
            style: {
              backgroundColor: this.getHomeTheme().background,
              borderTopWidth: 0,
              elevation: 0,
              height: 88,
            },
            labelStyle: {
              fontSize: 11,
              fontWeight: '500',
            },
          },
          tabBar: (props: any) => <RedesignTabBar {...props} />,
        },
      );

      const Drawer = createDrawerNavigator(
        {
          HomeTab: {
            screen: TabNavigator,
            navigationOptions: { title: 'NavigationMenu', headerShown: false },
          },
          Notifications: {
            screen: Notifications,
            navigationOptions: {
              header: null,
            },
          },
          DisputeForm: {
            screen: DisputeForm,
            navigationOptions: {
              header: null,
            },
          },
        },
        {
          initialRouteName: 'HomeTab',
          contentComponent: this.CustomDrawer,
          headerMode: 'slide',
          drawerPosition: 'right',
          overlayColor: 'rgba(8, 8, 15, 0.45)',
          drawerBackgroundColor: 'transparent',
          drawerWidth: 314,
          drawerLockMode: 'locked-closed',
        },
      );
      if (this.state.IsGettingToken) {
        return (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: this.getHomeTheme().background,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size={'large'} color={this.getHomeTheme().primary} />
          </SafeAreaView>
        );
      }
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: this.getHomeTheme().background }}
        >
          <Drawer />
        </SafeAreaView>
      );
    } catch (error) {
      console.log('Error in render:', error);
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: this.getHomeTheme().background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: this.getHomeTheme().foreground }}>
            Something went wrong. Please restart the app.
          </Text>
        </SafeAreaView>
      );
    }
  }
}
// Customizable Area End

// Customizable Area Start
type DrawerTheme = typeof redesignTheme;

const createDrawerStyles = (theme: DrawerTheme) =>
  StyleSheet.create({
    drawerStyle: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 8,
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: -6, height: 0 },
          shadowOpacity: 0.28,
          shadowRadius: 16,
        },
        android: {
          elevation: 16,
        },
      }),
    },
    drawerCloseRow: {
      alignItems: 'flex-end',
      marginBottom: 8,
    },
    drawerCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileText: {
      color: theme.foreground,
      fontWeight: '800',
      textAlign: 'center',
      fontSize: 22,
      letterSpacing: 0.2,
      marginVertical: Scale(10),
    },
    drawerInnerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: Scale(8),
    },
    avatarShadowWrap: {
      borderRadius: Scale(66),
      backgroundColor: 'transparent',
      marginVertical: Scale(12),
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    profileImgStyle: {
      width: Scale(112),
      height: Scale(112),
      borderRadius: Scale(56),
      borderWidth: 3,
      borderColor: theme.primary,
      backgroundColor: theme.input,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    profileImgFill: {
      width: '100%',
      height: '100%',
    },
    drawerMenuItemStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Scale(16),
      borderColor: theme.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuContainerStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingRight: 8,
    },
    menuIconWrap: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    drawerMenuTextStyle: {
      marginLeft: Scale(14),
      color: theme.foreground,
      fontSize: Scale(15),
      fontWeight: '600',
    },
    modalParentView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(8, 8, 15, 0.72)',
    },
    modalContainerView: {
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 35,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 100,
    },
    txtDeleteHeading: {
      fontWeight: '700',
      fontSize: 26,
      lineHeight: 28,
      marginBottom: 10,
      marginTop: 25,
      color: theme.foreground,
    },
    txtDelete: {
      fontSize: 18,
      color: theme.muted,
    },
    deleteButtonContainer: {
      backgroundColor: theme.primary,
      width: '100%',
      padding: 15,
      borderRadius: 10,
      marginTop: 15,
    },
    textDeleteButton: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 18,
      alignSelf: 'center',
    },
    keepButtonContainer: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.divider,
    },
    textKeepButton: {
      color: theme.foreground,
    },
    disablePopupIconContainer: {
      position: 'absolute',
      right: 20,
      top: 20,
    },
  });

const darkDrawerStyles = createDrawerStyles(redesignTheme);
const lightDrawerStyles = createDrawerStyles(lightTheme);

const DrawerThemedRoot = ({
  render,
}: {
  render: (
    theme: DrawerTheme,
    ds: ReturnType<typeof createDrawerStyles>,
  ) => React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    getStorageData(PROFILE_THEME_STORAGE_KEY).then((saved: string) => {
      if (mounted) {
        setIsDarkMode(saved !== 'false');
      }
    });
    const sub = DeviceEventEmitter.addListener(
      PROFILE_THEME_CHANGED_EVENT,
      (value: boolean) => setIsDarkMode(!!value),
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  const theme = isDarkMode ? redesignTheme : lightTheme;
  const ds = isDarkMode ? darkDrawerStyles : lightDrawerStyles;
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {render(theme, ds)}
    </View>
  );
};

const styles = StyleSheet.create({
  instructions: {
    textAlign: 'center',
    color: '#6200EE',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
  },
  searchIcons: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginVertical: 5,
  },
});
// Customizable Area End
export default HomeScreen;
