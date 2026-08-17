import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import { runEngine } from '../../../framework/src/RunEngine';
import { CommonActions } from '@react-navigation/native';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
                   
import {
  getStorageData,
  isEmpty,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { Platform, TextInput, Linking, Alert, ToastAndroid } from 'react-native';
import { RowMap } from 'react-native-swipe-list-view';
import { createRef } from 'react';
                 
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
       
interface IPlaceRecord {
  key: string;
  name: string;
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

interface ICommentsResponse {
  data: ICommentItem[];
}

export interface ISubcategory {
  id: number;
  name: string;
  approved_by_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface IEvent {
  id: number;
  event_title: string;
  date_of_the_show: string;
  time: string;
  description: string;
  rules_and_regulations: string;
  city: string;
  state: string;
  country: string;
  zip_code: number;
  address: string;
  type: string;
  location: string;
  like_by_me: boolean;
  added_in_calendar: boolean;
  account_id: number;
  show_features: string[];
  website: string;
  likes_count: number;
  comment_count: number;
  model_name: string;
  band_name: string;
  band_profile_image: string;
  profile_image: string;
  type_of_show: ISubcategory[];
  genre: ISubcategory[];
  line_ups: string[];
}

export interface ICategoryItem {
  name: string;
  subcategories: string[];
}

interface IFollowerItem {
  attributes: {
    account_id: string | number;
  };
}

export const configJSON = require('./config');
export interface Props {
  navigation: any;
  id: string;
}

interface S {
  firstName: any;
  lastName: any;
  email: any;
  phoneNumber: any;
  currentCountryCode: any;
  data: any[];
  passwordHelperText: String;
  enablePasswordField: boolean;
  enableReTypePasswordField: boolean;
  enableNewPasswordField: boolean;

  edtEmailEnabled: boolean;
  llDoChangePwdContainerVisible: boolean;
  llChangePwdDummyShowContainerVisible: boolean;

  currentPasswordText: any;
  newPasswordText: any;
  reTypePasswordText: any;

  edtMobileNoEnabled: boolean;
  countryCodeEnabled: boolean;

  saveButtonDisable: boolean;
  profileData: any;
  userID: string;
  isLoading: boolean;
  modalVisible: boolean;
  states: IPlaceRecord[];
  cities: string[];
  selectedState: string;
  selectedCity: string;
  nameError: string;
  emailError: string;
  stateError: string;
  cityError: string;
  phoneError: string;
  profilePic: string;
  profilePicData: any;
  stateClicked: boolean;
  cityClicked: boolean;
  showPickerModal: boolean;
  modalValues: string[];
  bandType: 'Band' | 'Artist';
  website: string;
  aboutUs: string;
  aboutUsError: string;
  affiliatesList: string[];
  affiliateText: string;
  influencesList: string[];
  influenceText: string;
  artists: string[];
  musicType: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  passedAccountId: string;
  showCameraGalleryPopup: boolean;
  userRole: string;
  coverPic: string;
  coverPicData: any;
  selectedPic: string;
  categoriesList: any[];
  subCategoriesList: any[];
  selectedCategoryName: string;
  selectedCategoryID: string;
  selectedSubCategoryName: string[];
  commentsModalOpen: boolean;
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
  stateChanged: boolean;
  categoryPickerModal: boolean;
  subCategoryPickerModal: boolean;
  expandSubcat: boolean;
  title: string;
  expandedLikedEvents: boolean;
  editMode: boolean;
  adminName: string;
  countryClicked: boolean;
  countriesList: any[];
  selectedCountry: string;
  otherCountrySelected: boolean;
  countryError: string;
  countryCodesList: any[];
  countryCodeClicked: boolean;
  countryCodeClickedAndroid: boolean;
  selectedCountryCode: any;
  instagramLinkError: string;
  facebookLinkError: string;
  linkedInLinkError: string;
  websiteError: string;
  countryChanged: boolean;
  selectedEventId: string;
  showTncPopup: boolean;
  isLoadingComments: boolean;
  isCountryModified: boolean;
  isOtherUser: boolean;
  unreadNotificationCount: number;
  newNotification: boolean;
  canShowAccountInfo: boolean;
  expandedCalendarEvents: boolean;
  address: string;
  addressError: string;
  zipCode: string;
  zipCodeError: string;
  capacity: string;
  capacityError: string;
  openAtPickerModal: boolean;
  openTimeSlots: string[];
  closeTimeSlots: string[];
  openAt: string;
  closeAtPickerModal: boolean;
  closeAt: string;
  featureList: any[];
  rulesRegulations: string;
  rulesRegulationError: string;
  accountType: string;
  rulesAndRegulations: any[];
  selectedRulesAndRegulationsIds: number[];
  customRules: string[]; // Track custom rules that have been added (regardless of selection)
  customRuleTxt: string;
  roster: string[];
  rosterTxt: string;
  selectedBusinessDays: string[];
  savedCategoriesAndSubcategories: Record<string, string[]>; // Saved categories from Categoriessubcategories screen
}

interface SS {
  id: any;
}

export default class UserProfileBasicController extends BlockComponent<
  Props,
  S,
  SS
> {
  labelFirstName: string;
  lastName: string;
  labelArea: string;
  labelMobile: string;
  labelEmail: string;
  labelCurrentPassword: string;
  labelNewPassword: string;
  labelRePassword: string;
  btnTextCancelPasswordChange: string;
  btnTextSaveChanges: string;
  labelHeader: any;
  btnTextChangePassword: string;

  arrayholder: any[];
  passwordReg: RegExp;
  emailReg: RegExp;
  apiCallMessageUpdateProfileRequestId: any;
  validationApiCallId: string = '';
  getFollowersListAPICallID: string = '';
  apiChangePhoneValidation: any;
  registrationAndLoginType: string = '';
  authToken: any;
  uniqueSessionRequesterId: any;
  userProfileGetApiCallId: any;
  profileApiCalled: boolean = false;
  userAttr: any;
  userDetailGetApiCallId: any;
  checkUnreadNotificationsApiCallId: string = '';
  getCityApiCallId: any;
  getStatesApiCallId: any;
  editProfilePatchApiCallID: any;
  getBandArtistsAPICallID: any;
  createBandProfileApiCallID: any;
  editBandProfileApiCallID: any;
  createFollowApiCallID: string = '';
  toggleLikeApiCallId: string = '';
  getCategoriesListAPICallID: string = '';
  getSubCategoriesListAPICallID: string = '';
  commentTextInput: TextInput | null = null;
  deleteCommentAPICallID: string = '';
  fetchCommentsAPICallID: string = '';
  postCommentAPICallID: string = '';
  getCountriesListAPICallID: string = '';
  getCountryCodeListID: string = '';
  createCommentAPICallID: any;
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
  InstaInputRef: any;
  FBInputRef: any;
  LdinInputRef: any;
  modalCallback = (_: any) => {};
  navigationUnsubscribers: (() => void)[] = [];
  focusListener: any = null;
  getRulesAndRegulationsApiCallId: any;
  updateRulesAndRegulationsApiCallId: any;
  updateRostersApiCallId: any;

  constructor(props: Props) {
    super(props);
    (this as any)._instanceId = Math.random().toString(36).substring(7);
    console.log(
      '🔍 UserProfileBasicController INSTANCE CREATED:',
      (this as any)._instanceId,
    );
    this.receive = this.receive.bind(this);

    this.InstaInputRef = createRef();
    this.FBInputRef = createRef();
    this.LdinInputRef = createRef();
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.CountryCodeMessage),
    ];

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      currentCountryCode: configJSON.hintCountryCode,
      data: [],
      passwordHelperText: '',
      enablePasswordField: true,
      enableReTypePasswordField: true,
      enableNewPasswordField: true,

      edtEmailEnabled: true,
      llDoChangePwdContainerVisible: false,
      llChangePwdDummyShowContainerVisible: false,

      currentPasswordText: '',
      newPasswordText: '',
      reTypePasswordText: '',

      edtMobileNoEnabled: true,
      countryCodeEnabled: true,
      saveButtonDisable: false,
      profileData: {},
      userID: '',
      isLoading: true,
      modalVisible: false,
      states: [],
      cities: [],
      selectedState: '',
      selectedCity: '',
      nameError: '',
      emailError: '',
      stateError: '',
      cityError: '',
      phoneError: '',
      profilePic: '',
      profilePicData: {},
      stateClicked: false,
      cityClicked: false,
      showPickerModal: false,
      modalValues: [],
      bandType: 'Band',
      website: '',
      aboutUs: '',
      aboutUsError: '',
      affiliatesList: [],
      affiliateText: '',
      influencesList: [],
      artists: [],
      musicType: 'Punk',
      instagram: '',
      facebook: '',
      linkedin: '',
      passedAccountId: '',
      showCameraGalleryPopup: false,
      userRole: '',
      coverPic: '',
      coverPicData: {},
      selectedPic: '',
      categoriesList: [],
      subCategoriesList: [],
      selectedCategoryName: '',
      selectedCategoryID: '',
      selectedSubCategoryName: [],
      commentsModalOpen: false,
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
      stateChanged: false,
      categoryPickerModal: false,
      subCategoryPickerModal: false,
      expandSubcat: false,
      title: '',
      influenceText: '',
      expandedLikedEvents: false,
      editMode: false,
      adminName: '',
      countryClicked: false,
      countriesList: [],
      selectedCountry: '',
      otherCountrySelected: false,
      countryError: '',
      countryCodesList: [],
      countryCodeClicked: false,
      countryCodeClickedAndroid: false,
      selectedCountryCode: {},
      instagramLinkError: '',
      facebookLinkError: '',
      linkedInLinkError: '',
      websiteError: '',
      countryChanged: false,
      selectedEventId: '',
      showTncPopup: false,
      isLoadingComments: false,
      isCountryModified: false,
      isOtherUser: false,
      unreadNotificationCount: 0,
      newNotification: false,
      canShowAccountInfo: true,
      expandedCalendarEvents: false,
      address: '',
      addressError: '',
      zipCode: '',
      zipCodeError: '',
      capacity: '',
      capacityError: '',
      openAtPickerModal: false,
      openTimeSlots: [],
      closeTimeSlots: [],
      openAt: '',
      closeAt: '',
      closeAtPickerModal: false,
      selectedBusinessDays: [],
      featureList: [],
      rulesRegulations: '',
      rulesRegulationError: '',
      accountType: '',
      rulesAndRegulations: [],
      selectedRulesAndRegulationsIds: [],
      customRules: [],
      customRuleTxt: '',
      roster: [],
      rosterTxt: '',
      savedCategoriesAndSubcategories: {},
    };

    this.arrayholder = [];
    this.passwordReg = new RegExp('\\w+');
    this.emailReg = new RegExp('\\w+');

    this.labelFirstName = configJSON.labelFirstName;
    this.lastName = configJSON.lastName;
    this.labelMobile = configJSON.labelMobile;
    this.labelArea = configJSON.labelArea;
    this.labelCurrentPassword = configJSON.labelCurrentPassword;
    this.labelEmail = configJSON.labelEmail;
    this.labelRePassword = configJSON.labelRePassword;
    this.labelNewPassword = configJSON.labelNewPassword;
    this.btnTextSaveChanges = configJSON.btnTextSaveChanges;
    this.btnTextCancelPasswordChange = configJSON.btnTextCancelPasswordChange;
    this.btnTextChangePassword = configJSON.btnTextChangePassword;
    this.labelHeader = configJSON.labelHeader;

    runEngine.attachBuildingBlock(this, this.subScribedMessages);
  }

  async receive(from: String, message: Message) {
    this.handleSessionResponseMessage(message);
    this.handleRestAPIResponseMessage(message);
    this.handleCountryCodeMessage(message);
  }

  /**
   * Returns display label for account type (underscores as spaces for UI only).
   * Band/Artist → "Band / Artist"; Record_Label → "Record Label"; etc.
   * API continues to receive the original value with underscore.
   */
  getAccountTypeDisplayLabel = (accountType: string): string => {
    if (!accountType || typeof accountType !== 'string') return accountType || '';
    if (accountType === 'Band' || accountType === 'Artist') return 'Band / Artist';
    return accountType.replace(/_/g, ' ');
  };

  validateMobileAndThenUpdateUserProfile() {
    let countryCode: any = this.state.currentCountryCode;
    let mobileNo: any = this.state.phoneNumber;

    let error: any = '';

    error = this.validateCountryCodeAndPhoneNumber(countryCode, mobileNo);

    if (error) {
      this.showAlert(configJSON.errorTitle, error);

      return;
    }

    if (this.userAttr) {
      const countryCodeOld = this.userAttr.country_code;
      const mobileNoOld = this.userAttr.phone_number;

      if (
        Number.parseInt(countryCode) === Number.parseInt(countryCodeOld) ||
        countryCode === configJSON.hintCountryCode
      ) {
        countryCode = null;
      }

      if (
        Number.parseInt(this.state.phoneNumber) === Number.parseInt(mobileNoOld)
      ) {
        mobileNo = null;
      }
    }

    if (mobileNo && countryCode) {
      this.validateMobileOnServer(
        this.state.currentCountryCode,
        this.state.phoneNumber,
      );
    } else {
      this.validateAndUpdateProfile();
    }
  }

  validateEmail(email: string) {
    let error = null;

    if (!this.isValidEmail(email)) {
      error = configJSON.errorEmailNotValid;
    }

    return error;
  }

  validateLastName(lastName: String) {
    return !this.isNonNullAndEmpty(lastName)
      ? 'Last name ' + configJSON.errorBlankField
      : null;
  }

  validateFirstName(firstName: String) {
    return !this.isNonNullAndEmpty(firstName)
      ? 'First name ' + configJSON.errorBlankField
      : null;
  }

  validateCountryCodeAndPhoneNumber(countryCode: string, phoneNumber: string) {
    let error = null;

    if (this.isNonNullAndEmpty(phoneNumber)) {
      if (
        !this.isNonNullAndEmpty(String(countryCode)) ||
        configJSON.hintCountryCode === countryCode
      ) {
        error = configJSON.errorCountryCodeNotSelected;
      }
    } else if (
      this.isNonNullAndEmpty(countryCode) &&
      configJSON.hintCountryCode !== countryCode
    ) {
      if (!this.isNonNullAndEmpty(phoneNumber)) {
        error = 'Phone ' + configJSON.errorBlankField;
      }
    }

    return error;
  }

  validateAndUpdateProfile() {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let countryCode: any = this.state.currentCountryCode;

    let mobileNo = this.state.phoneNumber;
    let email = this.state.email;

    let currentPwd = this.state.currentPasswordText;
    let newPwd = this.state.newPasswordText;
    let reTypePwd = this.state.reTypePasswordText;

    const errorFirstName = this.validateFirstName(firstName);
    const errorLastName = this.validateLastName(lastName);

    const errorMobileNo = this.validateCountryCodeAndPhoneNumber(
      countryCode,
      mobileNo,
    );
    const errorEmail = this.validateEmail(email);

    const errorCurrentPwd = this.validateCurrentPwd(currentPwd);
    const errorNewPwd = this.validatePassword(newPwd);
    const errorRetypePwd = this.validateRePassword(reTypePwd);

    let isValidForSignUp: boolean = true;

    if (errorFirstName != null) {
      this.showAlert(configJSON.errorTitle, errorFirstName);
      return false;
    } else if (errorLastName != null) {
      this.showAlert(configJSON.errorTitle, errorLastName);
      return false;
    }

    if (configJSON.ACCOUNT_TYPE_EMAIL === this.registrationAndLoginType) {
      if (errorMobileNo !== null) {
        this.showAlert(configJSON.errorTitle, errorMobileNo);
        return false;
      }
    } else if (
      configJSON.ACCOUNT_TYPE_SOCIAL === this.registrationAndLoginType
    ) {
      if (errorMobileNo != null) {
        this.showAlert(configJSON.errorTitle, errorMobileNo);
        return false;
      }
    } else if (
      configJSON.ACCOUNT_TYPE_PHONE === this.registrationAndLoginType
    ) {
      if (errorEmail != null) {
        this.showAlert(configJSON.errorTitle, errorEmail);

        return false;
      }
    } else {
      if (errorMobileNo != null) {
        this.showAlert(configJSON.errorTitle, errorMobileNo);

        return false;
      } else if (errorEmail != null) {
        this.showAlert(configJSON.errorTitle, errorEmail);

        return false;
      }
    }

    if (
      configJSON.ACCOUNT_TYPE_SOCIAL !== this.registrationAndLoginType &&
      this.state.llDoChangePwdContainerVisible
    ) {
      if (errorCurrentPwd != null) {
        this.showAlert(configJSON.errorTitle, errorCurrentPwd);
        return false;
      } else if (errorNewPwd != null) {
        this.showAlert(configJSON.errorTitle, errorNewPwd);
        return false;
      } else if (errorRetypePwd != null) {
        this.showAlert(configJSON.errorTitle, errorRetypePwd);
        return false;
      } else if (newPwd !== reTypePwd) {
        this.showAlert(
          configJSON.errorTitle,
          configJSON.errorBothPasswordsNotSame,
        );
        return false;
      } else if (currentPwd === newPwd) {
        this.showAlert(
          configJSON.errorTitle,
          configJSON.errorCurrentNewPasswordMatch,
        );
        return false;
      }
    }

    //Call update API
    if (this.userAttr) {
      let firstNameOld = this.userAttr.first_name;
      let lastNameOld = this.userAttr.last_name;
      let countryCodeOld = this.userAttr.country_code + '';
      let mobileNoOld = this.userAttr.phone_number + '';
      let emailOld = this.userAttr.email;
      this.registrationAndLoginType = this.userAttr.type;

      if (this.isNonNullAndEmpty(firstName) && firstName === firstNameOld) {
        firstName = null;
      }

      if (this.isNonNullAndEmpty(lastName) && lastName === lastNameOld) {
        lastName = null;
      }

      if (
        this.isNonNullAndEmpty(countryCode) &&
        countryCode === countryCodeOld
      ) {
        countryCode = null;
      }

      if (this.isNonNullAndEmpty(mobileNo) && mobileNo === mobileNoOld) {
        mobileNo = null;
      }

      if (countryCode != null || mobileNo != null) {
        if (countryCode == null) {
          countryCode = countryCodeOld;
        }

        if (mobileNo == null) {
          mobileNo = mobileNoOld;
        }
      }

      if (this.isNonNullAndEmpty(email) && email === emailOld) {
        email = null;
      }
    }

    if (
      this.isNonNullAndEmpty(firstName) ||
      this.isNonNullAndEmpty(lastName) ||
      this.isNonNullAndEmpty(countryCode) ||
      this.isNonNullAndEmpty(mobileNo) ||
      this.isNonNullAndEmpty(email) ||
      (this.isNonNullAndEmpty(currentPwd) && this.isNonNullAndEmpty(newPwd))
    ) {
      const header = {
        'Content-Type': configJSON.contentTypeApiUpdateUser,
        token: this.authToken,
      };

      let data: any = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
      };

      if (this.state.edtMobileNoEnabled) {
        if (
          configJSON.hintCountryCode !== countryCode &&
          this.isNonNullAndEmpty(String(countryCode)) &&
          this.isNonNullAndEmpty(String(mobileNo))
        ) {
          data = {
            ...data,
            ...{ new_phone_number: String(countryCode) + String(mobileNo) },
          };
        }
      }

      if (this.isNonNullAndEmpty(email)) {
        data = { ...data, ...{ new_email: email } };
      }

      if (
        this.isNonNullAndEmpty(currentPwd) &&
        this.isNonNullAndEmpty(newPwd)
      ) {
        data = {
          ...data,
          ...{ current_password: currentPwd, new_password: newPwd },
        };
      }

      const httpBody = {
        data: data,
      };

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );
      this.apiCallMessageUpdateProfileRequestId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.apiEndPointUpdateUser,
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
        configJSON.apiUpdateUserType,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  }

  validateCurrentPwd(currentPwd: any) {
    if (!this.isNonNullAndEmpty(currentPwd)) {
      return configJSON.errorCurrentPasswordNotValid;
    } else {
      return null;
    }
  }

  validatePassword(newPwd: any) {
    if (!this.passwordReg.test(newPwd)) {
      return configJSON.errorNewPasswordNotValid;
    } else {
      return null;
    }
  }

  validateRePassword(reTypePwd: any) {
    if (!this.passwordReg.test(reTypePwd)) {
      return configJSON.errorReTypePasswordNotValid;
    } else {
      return null;
    }
  }

  isNonNullAndEmpty(value: String) {
    return (
      value !== undefined &&
      value !== null &&
      value !== 'null' &&
      value.trim().length > 0
    );
  }

  validateMobileOnServer(countryCode: any, mobileNo: any) {
    const header = {
      'Content-Type': configJSON.contenttypeApiValidateMobileNo,
      token: this.authToken,
    };

    const data = {
      new_phone_number: countryCode + mobileNo,
    };

    const httpBody = {
      data: data,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.apiChangePhoneValidation = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.endPointApiValidateMobileNo,
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
      configJSON.callTypeApiValidateMobileNo,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  enableDisableEditPassword(isEditable: boolean) {
    if (configJSON.ACCOUNT_TYPE_SOCIAL === this.registrationAndLoginType) {
      this.setState({
        edtEmailEnabled: false,
        llDoChangePwdContainerVisible: false,
        llChangePwdDummyShowContainerVisible: false,
      });
    } else {
      if (isEditable) {
        this.setState({
          llDoChangePwdContainerVisible: true,
          llChangePwdDummyShowContainerVisible: false,
        });
      } else {
        this.setState({
          llDoChangePwdContainerVisible: false,
          llChangePwdDummyShowContainerVisible: true,
          currentPasswordText: '',
          newPasswordText: '',
          reTypePasswordText: '',
        });
      }
    }
  }

  goToPrivacyPolicy() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationPrivacyPolicyMessage),
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }

  goToTermsAndCondition() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationTermAndConditionMessage),
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }

  isStringNullOrBlank(str: string) {
    return str === null || str.length === 0;
  }

  isValidEmail(email: string) {
    return this.emailReg.test(email);
  }

  requestSessionData() {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage),
    );
    this.uniqueSessionRequesterId = msg.messageId;
    this.send(msg);
  }

  getUserProfile() {
    console.log('🚀 getUserProfile() called');
    console.log('🔍 Auth token:', this.authToken);
    console.log('🔍 API endpoint:', configJSON.endPointApiGetUserProfile);
    console.log('🔍 API method:', configJSON.methodTypeApiGetUserProfile);

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.userProfileGetApiCallId = requestMessage.messageId;
    console.log('🆔 Profile API Call ID set to:', this.userProfileGetApiCallId);

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.endPointApiGetUserProfile,
    );

    const header = {
      'Content-Type': configJSON.contentTypeApiGetUserProfile,
      token: this.authToken,
    };

    console.log('🔍 Request header:', header);

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.methodTypeApiGetUserProfile,
    );

    console.log('📤 Sending profile API request...');
    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  getValidations() {
    const headers = {
      'Content-Type': configJSON.validationApiContentType,
    };

    const getValidationsMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.validationApiCallId = getValidationsMsg.messageId;

    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.urlGetValidations,
    );

    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );
    getValidationsMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );
    runEngine.sendMessage(getValidationsMsg.id, getValidationsMsg);
  }

  async componentDidMount() {
    this.handleComponentDidMount();
    this.updateBottomTabVisibility();

    if (this.isPlatformWeb() === false) {
      const unsubscribeFocus = this.props.navigation.addListener(
        'focus',
        async () => {
          await this.loadProfileData();
          if (!this.isProfileEditMode()) {
            const { influencesList, affiliatesList } =
              await this.resolveInfluencesAndAffiliatesForProfile(false);
            this.setState({ influencesList, affiliatesList });
          }
          this.updateBottomTabVisibility();
          if (
            this.state.rulesAndRegulations &&
            this.state.rulesAndRegulations.length > 0
          ) {
            await this.loadSavedRulesTexts();
          }
        },
      );

      this.navigationUnsubscribers = [unsubscribeFocus];
    }
  }

  componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<S>) {
    if (prevState.editMode !== this.state.editMode) {
      this.updateBottomTabVisibility();
    }
  }

  async componentWillUnmount() {
    this.showBottomTabBar();
    if (this.navigationUnsubscribers) {
      this.navigationUnsubscribers.forEach(unsubscribe => unsubscribe());
      this.navigationUnsubscribers = [];
    }
  }

  updateBottomTabVisibility = () => {
    const editMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    const parentNavigator = (this.props as any).navigation?.getParent?.();
    if (!parentNavigator?.setOptions) return;

    parentNavigator.setOptions({
      tabBarStyle: editMode ? undefined : { display: 'none' },
    });
  };

  showBottomTabBar = () => {
    const parentNavigator = (this.props as any).navigation?.getParent?.();
    if (!parentNavigator?.setOptions) return;

    parentNavigator.setOptions({
      tabBarStyle: undefined,
    });
  };

  handleShowDetailsNav = (show: any, stateName: string) => {
    const infoNav = {
      eventId: show.id,
      eventState: stateName,
    };
    const screenToNav = 'AllEventDetailScreen';
    const msgDataNav = MessageEnum.HelpCentreMessageData;
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), screenToNav);

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(msgDataNav), infoNav);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  isViewingOwnProfile = (): boolean => {
    const loggedInUserId = String(this.state.userID ?? '');
    const viewedProfileId = String(this.state.profileData?.data?.id ?? '');
    if (loggedInUserId && viewedProfileId) {
      return loggedInUserId === viewedProfileId;
    }
    return !this.state.isOtherUser;
  };

  hasCachedProfileForAccount = (accountId: string): boolean => {
    if (!accountId) {
      return false;
    }
    if (String(this.state.profileData?.data?.id ?? '') !== String(accountId)) {
      return false;
    }
    return Boolean(this.state.profileData?.data?.attributes);
  };

  loadProfileData = async (isInitialMount: boolean = false) => {
    const userID = await getStorageData('user_id');
    const authToken = await getStorageData('authToken');

    const navigationParams =
      this.props.navigation?.state?.params ||
      (this.props as any).route?.params ||
      {};
    const resetProfile = navigationParams?.resetProfile;
    const isOtherUserParam = navigationParams?.isOtherUser;

    console.log('🔄 loadProfileData called:', {
      isInitialMount,
      resetProfile,
      isOtherUserParam,
      userID,
    });

    if (resetProfile === true) {
      console.log(
        '✅ Reset profile requested - loading logged-in user profile',
      );
      await removeStorageData('profileIdToLoad');
      this.setState({ passedAccountId: '', userID, isOtherUser: false });
      if (authToken) {
        this.authToken = authToken;
        this.getUserDetailsAPI(userID, true);
      }
      return;
    }

    if (isInitialMount) {
      if (isOtherUserParam === true) {
        const profileIdToLoad = await getStorageData('profileIdToLoad');
        const isOwnProfile =
          !profileIdToLoad ||
          String(profileIdToLoad) === String(userID ?? '');
        if (isOwnProfile) {
          console.log(
            '🔍 Initial mount - profile id matches logged-in user; loading self',
          );
          await removeStorageData('profileIdToLoad');
          this.setState({ passedAccountId: '', userID, isOtherUser: false });
          if (authToken) {
            this.authToken = authToken;
            this.getUserDetailsAPI(userID, true);
          }
        } else {
          console.log(
            '🔍 Initial mount - loading other user profile:',
            profileIdToLoad,
          );
          this.setState({
            passedAccountId: profileIdToLoad || '',
            userID,
            isOtherUser: true,
          });
          if (authToken && profileIdToLoad) {
            this.authToken = authToken;
            this.getUserDetailsAPI(profileIdToLoad, true);
          }
        }
      } else {
        console.log('🔍 Initial mount - loading logged-in user profile');
        await removeStorageData('profileIdToLoad');
        this.setState({ passedAccountId: '', userID, isOtherUser: false });
        if (authToken) {
          this.authToken = authToken;
          this.getUserDetailsAPI(userID, true);
        }
      }
      return;
    }

    let accountIdToLoad = userID;
    let isOtherUser = false;

    if (isOtherUserParam === true) {
      const profileIdToLoad =
        this.state.passedAccountId ||
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
      this.state.passedAccountId &&
      String(this.state.passedAccountId) !== String(userID ?? '')
    ) {
      accountIdToLoad = this.state.passedAccountId;
      isOtherUser = true;
    } else if (
      this.state.profileData?.data?.id &&
      String(this.state.profileData.data.id) !== String(userID ?? '')
    ) {
      accountIdToLoad = String(this.state.profileData.data.id);
      isOtherUser = true;
    }

    this.setState({
      userID,
      isOtherUser,
      passedAccountId: isOtherUser ? accountIdToLoad : '',
    });
    if (authToken) {
      this.authToken = authToken;
      this.getUserDetailsAPI(accountIdToLoad);
    }
  };

  handleComponentDidMount = async () => {
    this.handleCountryCodeListAPI();
    this.getCountryList();

    let userRole = await getStorageData('userRole');
    if (!userRole) {
      userRole = await getStorageData('user_role');
    }
    if (userRole === 'venue') {
      this.generateOpenTimeSlots();
    }
    const userTitle = await getStorageData('user_title');
    const adminName = await getStorageData('administrator_name');
    const phoneNumber = await getStorageData('user_phone_number');
    const accountType = await getStorageData('account_type');
    const savedAddress = await getStorageData('user_address');
    const savedZipCode = await getStorageData('user_zip_code');

    const storageEditMode = (await getStorageData('editMode')) === 'true';
    const navEditMode = this.props.navigation?.state?.params?.editMode === true;
    const profileEditMode = storageEditMode || navEditMode;

    console.log('🔍 Edit mode determination:', {
      storageEditMode,
      navEditMode,
      finalEditMode: profileEditMode,
    });

    if (profileEditMode) {
      const updatedInfluencesStr = await getStorageData('updated_influences');
      const updatedAffiliatesStr = await getStorageData('updated_affiliates');

      if (updatedInfluencesStr) {
        const updatedInfluences = JSON.parse(updatedInfluencesStr);
        console.log(
          '🔄 Loading updated influences from CategoriesSubCategories (edit mode):',
          updatedInfluences,
        );
        this.setState({ influencesList: updatedInfluences });
      }

      if (updatedAffiliatesStr) {
        const updatedAffiliates = JSON.parse(updatedAffiliatesStr);
        console.log(
          '🔄 Loading updated affiliates from CategoriesSubCategories (edit mode):',
          updatedAffiliates,
        );
        this.setState({ affiliatesList: updatedAffiliates });
      }
    } else {
      console.log(
        '🆕 Create mode: Loading influences and affiliates from AsyncStorage',
      );
      const { influencesList, affiliatesList } =
        await this.resolveInfluencesAndAffiliatesForProfile(false);
      console.log(
        '🔄 Loaded influences and affiliates (create mode):',
        influencesList,
        affiliatesList,
      );
      this.setState({ influencesList, affiliatesList });

      // Load saved categories and subcategories from AsyncStorage
      const savedCategoriesStr = await getStorageData('savedCategoriesAndSubcategories');
      if (savedCategoriesStr) {
        try {
          const savedCategories = JSON.parse(savedCategoriesStr);
          console.log('🔄 Loading saved categories from AsyncStorage (create mode):', savedCategories);
          
          // Get the first category as default
          const categoryKeys = Object.keys(savedCategories);
          if (categoryKeys.length > 0) {
            const firstCategory = categoryKeys[0];
            const firstCategorySubcategories = savedCategories[firstCategory] || [];
            
            console.log('📋 Setting default category:', firstCategory);
            console.log('📋 Default subcategories:', firstCategorySubcategories);
            
            // Store saved categories in state for later use when category changes
            this.setState({
              savedCategoriesAndSubcategories: savedCategories,
              selectedCategoryName: firstCategory,
              selectedSubCategoryName: firstCategorySubcategories,
            });
          }
        } catch (error) {
          console.error('❌ Error parsing saved categories:', error);
        }
      }

      const signupBandName = await getStorageData('signup_band_name');
      if (signupBandName && signupBandName.trim() !== '') {
        console.log('🆕 Pre-filling band name from signup:', signupBandName);
        this.setState({ firstName: signupBandName, adminName: signupBandName });
      }
    }

    // Load address and zip code from storage if available (only if not in edit mode or if state is empty)
    const stateUpdate: any = {
      title: userTitle,
      editMode: profileEditMode,
      adminName: adminName || this.state.adminName,
      userRole,
      phoneNumber,
      accountType: accountType || '',
    };

    // Only load from storage if not in edit mode (edit mode will load from API)
    // or if the current state is empty
    if (!profileEditMode) {
      if (savedAddress && !this.state.address) {
        stateUpdate.address = savedAddress;
      }
      if (savedZipCode && !this.state.zipCode) {
        stateUpdate.zipCode = savedZipCode;
      }
    }

    this.setState(stateUpdate);
    this.getCategoriesList();

    this.getBandArtist();

    // Ensure authToken is set before fetching rules
    if (!this.authToken) {
      const token = await getStorageData('authToken');
      if (token) {
        this.authToken = token;
        console.log('✅ AuthToken set from storage in handleComponentDidMount');
      }
    }

    // Always fetch rules and regulations (needed for both create and edit mode)
    this.getRulesAndRegulations();
    
    // Load saved rosters from AsyncStorage
    const savedRostersStr = await getStorageData('savedRosters');
    if (savedRostersStr) {
      try {
        const savedRosters = JSON.parse(savedRostersStr);
        console.log('✅ Loaded saved rosters from AsyncStorage:', savedRosters);
        this.setState({ roster: savedRosters });
      } catch (error) {
        console.error('❌ Error parsing saved rosters:', error);
      }
    }
    
    // Also try to load saved texts immediately (in case API fails, we can still show saved texts)
    // This will create a display list from saved texts if rules API fails
    setTimeout(async () => {
      const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
      if (savedRulesTextsStr && (!this.state.rulesAndRegulations || this.state.rulesAndRegulations.length === 0)) {
        try {
          const savedRulesTexts = JSON.parse(savedRulesTextsStr);
          console.log('⚠️ Rules API may have failed, creating display from saved texts:', savedRulesTexts);
          
          // Create display rules from saved texts
          const displayRules = savedRulesTexts.map((text: string, index: number) => ({
            id: index + 1000,
            title: text,
          }));
          
          this.setState({
            rulesAndRegulations: displayRules,
            selectedRulesAndRegulationsIds: displayRules.map((r: any) => r.id),
          }, () => {
            console.log('✅ Created display rules from saved texts (fallback)');
            console.log('✅ Rules count:', this.state.rulesAndRegulations.length);
          });
        } catch (error) {
          console.error('❌ Error creating fallback rules:', error);
        }
      }
    }, 2000); // Wait 2 seconds for API call, then check if we need fallback

    // Auto-fetch profile data when in edit mode
    if (profileEditMode) {
      console.log('🔄 Edit mode detected - loading profile data');
      this.loadProfileData(true);
    }
  };

  handleAddAffiliatesItem = () => {
    const trimmedText = this.state.affiliateText.trim();
    console.log(
      '🔍 handleAddAffiliatesItem called with affiliateText:',
      this.state.affiliateText,
    );
    console.log('🔍 Trimmed text:', trimmedText);
    console.log('🔍 Current affiliatesList:', this.state.affiliatesList);

    if (trimmedText !== '') {
      const currentList = Array.isArray(this.state.affiliatesList)
        ? this.state.affiliatesList
        : [];

      const trimmedAffiliatesList = currentList.map(item =>
        String(item).trim().toLowerCase(),
      );
      const textToAdd = trimmedText.toLowerCase();

      if (!trimmedAffiliatesList.includes(textToAdd)) {
        console.log('🔍 Adding affiliate:', trimmedText);
        this.setState(
          {
            affiliateText: '',
            affiliatesList: [...currentList, trimmedText],
          },
          () => {
            console.log(
              '🔍 Updated affiliatesList:',
              this.state.affiliatesList,
            );
          },
        );
      } else {
        console.log('🔍 Affiliate already exists, clearing input');
        this.setState({ affiliateText: '' });
      }
    } else {
      this.setState({ affiliateText: '' });
    }
  };

  handleArtistSelection = () => {
    const trimmedText = this.state.influenceText.trim();
    console.log(
      '🔍 handleArtistSelection called with influenceText:',
      this.state.influenceText,
    );
    console.log('🔍 Trimmed text:', trimmedText);
    console.log('🔍 Current influencesList:', this.state.influencesList);

    if (trimmedText !== '') {
      const currentList = Array.isArray(this.state.influencesList)
        ? this.state.influencesList
        : [];

      const trimmedInfluencesList = currentList.map(item =>
        String(item).trim().toLowerCase(),
      );
      const textToAdd = trimmedText.toLowerCase();

      if (!trimmedInfluencesList.includes(textToAdd)) {
        console.log('🔍 Adding influence:', trimmedText);
        this.setState(
          {
            influenceText: '',
            influencesList: [...currentList, trimmedText],
          },
          () => {
            console.log(
              '🔍 Updated influencesList:',
              this.state.influencesList,
            );
          },
        );
      } else {
        console.log('🔍 Influence already exists, clearing input');
        this.setState({ influenceText: '' });
      }
    } else {
      this.setState({ influenceText: '' });
    }
  };

  handleCountryCodeMessage = (message: Message) => {
    if (getName(MessageEnum.CountryCodeMessage) === message.id) {
      const selectedCode = message.getData(
        getName(MessageEnum.CountyCodeDataMessage),
      );

      if (selectedCode !== undefined) {
        this.setState({
          currentCountryCode:
            selectedCode.indexOf('+') > 0
              ? selectedCode.split('+')[1]
              : selectedCode,
        });
      }
    }
  };

  handleRestAPIResponseMessage = (message: Message) => {
    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );
    const successResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage),
    );

    // Log for createBandProfile API calls
    if (apiRequestCallId === this.createBandProfileApiCallID || 
        apiRequestCallId === this.editBandProfileApiCallID) {
      console.log('📨 ========== API RESPONSE RECEIVED ==========');
      console.log('📨 API Request Call ID:', apiRequestCallId);
      console.log('📨 Has success response?', !!successResponse);
      console.log('📨 Has error response?', !!errorResponse);
      if (errorResponse) {
        console.log('📨 Error Response:', JSON.stringify(errorResponse, null, 2));
      }
      if (successResponse) {
        console.log('📨 Success Response:', JSON.stringify(successResponse, null, 2));
      }
      console.log('📨 ===========================================');
    }

    if (apiRequestCallId && successResponse) {
      this.handleSuccessfulAPIResponse(apiRequestCallId, successResponse);
    } else {
      this.handleErrorResponse(errorResponse);
    }
  };

  handleSuccessfulAPIResponse = (
    apiRequestCallID: string,
    responseJson: any,
  ) => {
    const instanceId = (this as any)._instanceId;
    console.log(
      `🔍 [${instanceId}] handleSuccessfulAPIResponse called with ID:`,
      apiRequestCallID,
    );
    console.log(
      `🔍 [${instanceId}] Expected userDetailGetApiCallId:`,
      this.userDetailGetApiCallId,
    );
    console.log(
      '🔍 Expected editBandProfileApiCallID:',
      this.editBandProfileApiCallID,
    );
    console.log(
      '🔍 Expected getRulesAndRegulationsApiCallId:',
      this.getRulesAndRegulationsApiCallId,
    );
    console.log('🔍 Response has data?', !!responseJson.data);
    console.log('🔍 Response has errors?', !!responseJson.errors);

    switch (apiRequestCallID) {
      case this.userProfileGetApiCallId:
        console.log('✅ Profile API response matched! Calling handler...');
        this.handleUserProfileApiResponse(responseJson);
        break;
      case this.userDetailGetApiCallId:
        console.log('✅ User detail API response matched!');
        this.handleUserDetailApiResponse(responseJson);
        break;
      case this.getBandArtistsAPICallID:
        console.log('✅ Band artists API response matched!');
        this.setState({
          artists: responseJson.data.map((item: any) => item.first_name),
        });
        if (!this.state.editMode) {
          this.setState({ isLoading: false });
        }
        break;
      case this.editProfilePatchApiCallID:
        this.handleEditProfileAPIResponse(responseJson);
        break;
      case this.getCityApiCallId:
        this.handleCitiesResponse(responseJson);
        break;
      case this.getStatesApiCallId:
        this.handleStateAPIResponse(responseJson);
        break;
      case this.editBandProfileApiCallID:
        console.log('✅ EDIT Band Profile API response matched!');
        this.handleEditBandProfile(responseJson);
        break;
      case this.toggleLikeApiCallId:
        this.toggleLikeCallback();
        break;
      case this.createFollowApiCallID:
        this.updateFollowButton(responseJson);
        break;
      case this.createBandProfileApiCallID:
        console.log('✅ CREATE Band Profile API response matched!');
        this.handleCreateBandProfileResponse(responseJson);
        break;
      case this.getCategoriesListAPICallID:
        this.handleCategoriesApiResponse(responseJson);
        break;
      case this.getSubCategoriesListAPICallID:
        this.handleSubCategoriesApiResponse(responseJson);
        break;
      case this.deleteCommentAPICallID:
        this.handleCommentsUpdateApiResponse();
        break;
      case this.fetchCommentsAPICallID:
        this.handleCommentsApiResponse(responseJson);
        break;
      case this.postCommentAPICallID:
        this.handleCommentsUpdateApiResponse();
        break;
      case this.getCountriesListAPICallID:
        this.handleCountryAPIResponse(responseJson);
        break;
      case this.getCountryCodeListID:
        this.handleGetCountryCodeListResponse(responseJson);
        break;
      case this.createCommentAPICallID:
        this.handleCommentsUpdateApiResponse();
        break;
      case this.getFollowersListAPICallID:
        this.handleCheckFollowersForPrivateAccount(responseJson);
        break;
      case this.getRulesAndRegulationsApiCallId:
        console.log('✅ Rules API response received! Call ID matched');
        this.handleGetRulesAndRegulationsResponse(responseJson);
        break;
      case this.checkUnreadNotificationsApiCallId:
        this.handleUnreadNotificationsApiResponse(responseJson);
        break;
      case this.updateRulesAndRegulationsApiCallId:
        this.handleUpdateRulesAndRegulationsResponse(responseJson);
        break;
      case this.updateRostersApiCallId:
        this.handleUpdateRostersResponse(responseJson);
        break;
      default:
        console.log('⚠️ DEFAULT case reached - no matching API call ID');
        console.log('⚠️ Unhandled API Call ID:', apiRequestCallID);
        console.log('⚠️ Response type:', responseJson?.data?.type);
        console.log('⚠️ Checking if this is a rules and regulations response...');

        // Check if this is a rules and regulations response
        if (
          Array.isArray(responseJson?.data) &&
          responseJson.data.length > 0 &&
          (responseJson.data[0]?.title || responseJson.data[0]?.attributes?.title)
        ) {
          console.log('🔄 Found rules and regulations response - handling it');
          this.handleGetRulesAndRegulationsResponse(responseJson);
        } else if (
          responseJson?.data?.type === 'profile' &&
          responseJson?.data?.attributes
        ) {
          console.log(
            '🔄 Found profile response without matching ID - handling as profile API',
          );
          this.handleUserProfileApiResponse(responseJson);
        } else {
          console.log('⚠️ Response does not match any known pattern');
          console.log('⚠️ Stopping loader if it is running...');
          if (this.state.isLoading) {
            this.setState({ isLoading: false });
            console.log('⛔ Loader stopped due to unhandled response');
          }
        }
        break;
    }
  };

  handleCountryAPIResponse = (responseJson: any) => {
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      this.setState(
        {
          countriesList: responseJson.countries,
          states: [],
          selectedState: '',
          cities: [],
          selectedCity: '',
        },
        async () => {
          let userRole = await getStorageData('userRole');
          if (!userRole) {
            userRole = await getStorageData('user_role');
          }
          userRole === 'fan' && this.setCountryFan();
          (userRole === 'band' || userRole === 'venue') &&
            this.setCountryBand();
        },
      );
    }
  };

  setCountryFan = async () => {
    const profileData =
      this.props.navigation.state?.params?.profileData ||
      (this.props as any).route?.params?.profileData ||
      this.state.profileData;

    if (profileData?.data?.attributes) {
      this.getProfileData(profileData);
    }
  };

  setCountryBand = async () => {
    const countryCode = await getStorageData('user_country');
    const country = this.state.countriesList.find(
      (item: any) => item.country_code === countryCode,
    );
    const countryName = country ? country.country_name : '';
    this.setState({ selectedCountry: countryName }, () => {
      if (countryCode === 'US') this.getStateList(countryCode);
    });
  };

  handleGetCountryCodeListResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const usData = responseJson.data.find((item: any) => item.id === 'US');
      this.setState(
        { countryCodesList: responseJson.data, selectedCountryCode: usData },
        () => {
          if (this.state.userRole === 'fan') {
            const profileData =
              this.props.navigation.state?.params?.profileData ||
              (this.props as any).route?.params?.profileData ||
              this.state.profileData;

            if (profileData?.data?.attributes) {
              this.getProfileData(profileData);
            }
          }
        },
      );
    } else this.parseApiErrorResponse(responseJson);
  };

  updateFollowButton = (responseJson: any) => {
    this.setState({ isLoading: false });
    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      this.handleFollowAPISuccess();
    }
  };

  handleFollowAPISuccess = () => {
    this.setState(prevState => {
      const { follow } = prevState.profileData.data.attributes;
      const updatedFollow = !follow;

      return {
        profileData: {
          ...prevState.profileData,
          data: {
            ...prevState.profileData.data,
            attributes: {
              ...prevState.profileData.data.attributes,
              follow: updatedFollow,
            },
          },
        },
      };
    });
  };

  handleEditBandProfile = async (responseJson: any) => {
    this.setState({ isLoading: false });
    await setStorageData('editMode', 'true');
    const info = {
      user_profile_pic: responseJson.data.attributes.profile_image,
      userName: responseJson.data.attributes.name,
    };
    await setStorageData('user_name', responseJson.data.attributes.name);
    await setStorageData(
      'user_profile_pic',
      responseJson.data.attributes.profile_image,
    );
    const raiseMessage: Message = new Message(
      getName(MessageEnum.EditProfileUpdateMessage),
    );
    raiseMessage.addData(getName(MessageEnum.EditProfileUpdateMessage), info);
    this.send(raiseMessage);

    const isEditMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    if (isEditMode) {
      console.log('🔙 Edit mode: Profile saved successfully, navigating back');
      console.log('🔍 Edit mode check:', {
        stateEditMode: this.state.editMode,
        navigationEditMode: this.props.navigation?.state?.params?.editMode,
        routeEditMode: (this.props as any).route?.params?.editMode,
        finalIsEditMode: isEditMode,
      });
      this.props.navigation.goBack();
      return;
    }

    console.log(
      '🔄 Profile created successfully, navigating to CategoriesSubCategories',
    );
    await setStorageData('navigateBack', 'false');

    const combinedInfluences = [
      ...this.state.influencesList,
      ...this.state.selectedSubCategoryName,
    ];

    const uniqueInfluences = [...new Set(combinedInfluences)];

    console.log('📊 Passing data to CategoriesSubCategories (Edit mode):');
    console.log('  - Manual influences:', this.state.influencesList);
    console.log('  - Subcategories:', this.state.selectedSubCategoryName);
    console.log('  - Combined influences:', uniqueInfluences);
    console.log('  - Affiliates:', this.state.affiliatesList);

    await setStorageData(
      'updated_influences',
      JSON.stringify(uniqueInfluences),
    );
    await setStorageData(
      'updated_affiliates',
      JSON.stringify(this.state.affiliatesList),
    );

    const navInfo = {
      influences: uniqueInfluences,
      affiliates: this.state.affiliatesList,
    };

    // Prepare the raise message with navigation data
    const navRaiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    navRaiseMessage.addData(
      getName(MessageEnum.HelpCentreMessageData),
      navInfo,
    );

    // Navigate directly to CategoriesSubCategories since both screens are in the same HomeStack
    if (this.props.navigation) {
      try {
        // Try direct navigation first (both screens are in the same HomeStack)
        this.props.navigation.navigate('CategoriesSubCategories', {
          navigationBarTitleText: 'Categories & Subcategories',
          fromProfile: true,
        });
        // Send the raise message after a short delay
        setTimeout(() => {
          this.send(navRaiseMessage);
        }, 100);
      } catch (error) {
        console.log('Navigate failed, trying push:', error);
        try {
          // Fallback: Try push navigation within same stack
          this.props.navigation.push('CategoriesSubCategories', {
            navigationBarTitleText: 'Categories & Subcategories',
            fromProfile: true,
          });
          setTimeout(() => {
            this.send(navRaiseMessage);
          }, 100);
        } catch (pushError) {
          console.log(
            'Push failed, using message-based navigation:',
            pushError,
          );
          // Final fallback: Use message-based navigation
          const message: Message = new Message(
            getName(MessageEnum.NavigationMessage),
          );
          message.addData(
            getName(MessageEnum.NavigationPropsMessage),
            this.props,
          );
          message.addData(
            getName(MessageEnum.NavigationTargetMessage),
            'CategoriesSubCategories',
          );
          message.addData(
            getName(MessageEnum.NavigationRaiseMessage),
            navRaiseMessage,
          );
          this.send(message);
        }
      }
    } else {
      // Fallback: Use message-based navigation
      const message: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(
        getName(MessageEnum.NavigationTargetMessage),
        'CategoriesSubCategories',
      );
      message.addData(
        getName(MessageEnum.NavigationRaiseMessage),
        navRaiseMessage,
      );
      this.send(message);
    }
  };

  handleCategoriesApiResponse = (responseJson: any) => {
    if (responseJson.errors) this.parseApiErrorResponse(responseJson);
    else this.setState({ categoriesList: responseJson.data });
  };

  handleSubCategoriesApiResponse = (responseJson: any) => {
    if (responseJson.errors) this.parseApiErrorResponse(responseJson);
    else this.setState({ subCategoriesList: responseJson.data });
  };

  handleCreateBandProfileResponse = async (responseJson: any) => {
    console.log('📥 handleCreateBandProfileResponse called');
    console.log('📦 ========== API RESPONSE ==========');
    console.log('📦 Full Response:', JSON.stringify(responseJson, null, 2));
    console.log('📦 ====================================');

    this.setState({ isLoading: false });

    if (responseJson.errors) {
      console.error('❌ ========== API ERROR IN RESPONSE ==========');
      console.error('❌ Errors:', JSON.stringify(responseJson.errors, null, 2));
      console.error('❌ Error Type:', typeof responseJson.errors);
      if (Array.isArray(responseJson.errors)) {
        console.error('❌ Errors is an array with length:', responseJson.errors.length);
        responseJson.errors.forEach((error: any, index: number) => {
          console.error(`❌ Error[${index}]:`, JSON.stringify(error, null, 2));
        });
      } else if (typeof responseJson.errors === 'object') {
        console.error('❌ Errors object keys:', Object.keys(responseJson.errors));
        Object.keys(responseJson.errors).forEach(key => {
          console.error(`❌ Error[${key}]:`, JSON.stringify(responseJson.errors[key], null, 2));
        });
      }
      console.error('❌ ============================================');
      this.parseApiErrorResponse(responseJson);
    } else {
      console.log('✅ Profile created successfully, navigating to Home...');
      await removeStorageData('popupShown');
      await removeStorageData('signup_band_name');
      await setStorageData('editMode', 'true');
      await setStorageData('redirectionNav', 'Home');

      // Navigate to Home screen (signup complete)
      const tokenMsg = new Message(getName(MessageEnum.AuthTokenEmailMessage));
      tokenMsg.addData('token', this.authToken);
      runEngine.sendMessage(tokenMsg.id, tokenMsg);

      const message: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(getName(MessageEnum.NavigationTargetMessage), 'Home');
      this.send(message);
    }
  };

  handleCommentsUpdateApiResponse = () => {
    this.setState({ editingComment: false }, () => {
      this.fetchComments(this.state.eventId);
    });
  };

  handleCommentsApiResponse = (response: ICommentsResponse) => {
    this.setState({
      commentsLoading: false,
      comments: [],
      isLoadingComments: false,
    });
    if (response.data.length) {
      response.data.forEach((item: any) => {
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
      this.setState({ comments: response.data });
    }
  };

  toggleLikeCallback = async () => {
    const profileIdToLoad = await getStorageData('profileIdToLoad');
    const userID = await getStorageData('user_id');
    if (profileIdToLoad) {
      this.getUserDetailsAPI(profileIdToLoad);
    } else {
      this.getUserDetailsAPI(userID);
    }
  };

  handleUserDetailApiResponse = async (responseJson: any) => {
    // Log API Response
    console.log('=== Get User Profile API Response ===');
    console.log('Response:', JSON.stringify(responseJson, null, 2));
    
    console.log(
      '🔍 handleUserDetailApiResponse RECEIVED:',
      JSON.stringify(responseJson, null, 2),
    );

    let attributes, id;
    if (responseJson.data) {
      console.log('🔍 responseJson has data property');
      attributes = responseJson.data.attributes;
      id = responseJson.data.id;
    } else {
      console.log(
        '🔍 responseJson DOES NOT have data property - using direct access',
      );
      attributes = responseJson.attributes;
      id = responseJson.id;
    }

    console.log(
      '🔍 Extracted attributes:',
      JSON.stringify(attributes, null, 2),
    );

    this.handlePrivateAccount(attributes?.private, id);
    this.updateCoverPhoto(attributes?.cover_photo);

    const responseForHandler = responseJson.data
      ? responseJson
      : { data: responseJson };

    console.log(
      '🔍 Constructed responseForHandler:',
      JSON.stringify(responseForHandler, null, 2),
    );

    const viewedProfileId = String(responseForHandler.data?.id ?? '');
    const loggedInUserId = String(this.state.userID ?? '');
    const isOtherUser =
      Boolean(loggedInUserId && viewedProfileId) &&
      loggedInUserId !== viewedProfileId;

    this.setState({
      profileData: responseForHandler,
      isOtherUser,
      passedAccountId: isOtherUser ? viewedProfileId : '',
      isLoading: false,
    });

    await this.handleUserProfileApiResponse(responseForHandler);

    if (this.shouldUpdateBandDetails()) this.updateBandDetails(attributes);
  };

  handleUserProfileApiResponse = async (responseJson: any) => {
    // Log Profile API Response with field mapping details
    console.log('=== Profile API Response - Field Mapping ===');
    console.log('Full Response:', JSON.stringify(responseJson, null, 2));
    
    if (responseJson?.data?.attributes) {
      const attrs = responseJson.data.attributes;
      console.log('=== Profile Fields Being Populated ===');
      console.log('First Name:', attrs?.first_name);
      console.log('Email:', attrs?.email);
      console.log('Title:', attrs?.title);
      console.log('Administrator Name:', attrs?.administrator_name);
      console.log('Bio/About Us:', attrs?.bio);
      console.log('Website:', attrs?.official_website);
      console.log('Instagram:', attrs?.social_media?.instagram);
      console.log('Facebook:', attrs?.social_media?.facebook);
      console.log('LinkedIn:', attrs?.social_media?.linkedin);
      console.log('Phone Number:', attrs?.full_phone_number);
      console.log('Address:', attrs?.address);
      console.log('Country:', attrs?.country);
      console.log('State:', attrs?.state);
      console.log('City:', attrs?.city);
      console.log('Capacity:', attrs?.maximum_people_capacity);
      console.log('Rules/Regulations:', attrs?.rules_and_regulations);
      console.log('Influences:', attrs?.influences);
      console.log('Affiliates:', attrs?.affiliates);
      console.log('Category:', attrs?.category_subcat);
      console.log('Profile Image:', attrs?.profile_image);
      console.log('Cover Photo:', attrs?.cover_photo);
    }
    
    console.log('Profile API Response:', responseJson);

    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
      return;
    }

    const { data } = responseJson;
    const { attributes } = data || {};

    if (attributes) {
      console.log(
        '🔍 Full responseJson structure:',
        JSON.stringify(responseJson, null, 2),
      );
      console.log('🔍 Data structure:', JSON.stringify(data, null, 2));
      console.log(
        '🔍 Attributes structure:',
        JSON.stringify(attributes, null, 2),
      );

      this.setState({ profileData: responseJson });

      let sub_cat: string[] = [];
      let categoryName = '';
      let categoryID = '';

      if (
        attributes?.category_subcat?.length !== 0 &&
        attributes?.category_subcat?.[0]?.subcategories?.length !== 0
      ) {
        attributes?.category_subcat[0].subcategories.forEach(
          (item: { id: number; name: string }) => sub_cat.push(item.name),
        );
        categoryName = attributes?.category_subcat[0].name;
        categoryID = attributes?.category_subcat[0].id;
      }

      const country = this.state.countriesList.find(
        (item: any) => item.country_code === attributes?.country,
      );
      const selectedCountryName = country ? country.country_name : '';

      const userTitle = await getStorageData('user_title');
      const adminName = await getStorageData('administrator_name');

      console.log(
        '🔍 API Response - attributes.influences:',
        attributes?.influences,
      );
      console.log(
        '🔍 API Response - attributes.affiliates:',
        attributes?.affiliates,
      );

      const isEditMode = this.isProfileEditMode();
      const { influencesList, affiliatesList } =
        await this.resolveInfluencesAndAffiliatesForProfile(
          isEditMode,
          attributes,
        );
      const { address, zipCode } = await this.resolveAddressAndZipForProfile(
        attributes,
        isEditMode,
      );

      this.setState({ isLoading: false });

      this.setState(
        {
          firstName: attributes?.first_name || '',
          email: attributes?.email || '',
          website:
            attributes?.official_website &&
            attributes?.official_website !== 'undefined'
              ? attributes?.official_website
              : '',
          instagram:
            attributes?.social_media?.instagram &&
            attributes?.social_media?.instagram !== 'undefined'
              ? this.parseInstagramUrl(attributes?.social_media?.instagram)
              : '',
          facebook:
            attributes?.social_media?.facebook &&
            attributes?.social_media?.facebook !== 'undefined'
              ? this.parseFaceBookUrl(attributes?.social_media?.facebook)
              : '',
          linkedin:
            attributes?.social_media?.linkedin &&
            attributes?.social_media?.linkedin !== 'undefined'
              ? this.parseLinkedinUrl(attributes?.social_media?.linkedin)
              : '',
          aboutUs: attributes?.bio || '',

          influencesList,
          affiliatesList,
          selectedCountry: selectedCountryName,
          selectedState: attributes?.state || '',
          selectedCity: attributes?.city || '',
          selectedCategoryName: categoryName,
          selectedCategoryID: categoryID,
          selectedSubCategoryName: sub_cat,
          title: attributes?.title || userTitle || '',
          adminName: attributes?.administrator_name || adminName || '',
          profilePic: attributes?.profile_image || '',
          phoneNumber: attributes?.full_phone_number
            ? attributes?.full_phone_number.toString()
            : '',
          address,
          zipCode,
          capacity: attributes?.maximum_people_capacity
            ? attributes?.maximum_people_capacity.toString()
            : '',
          rulesRegulations: attributes?.rules_and_regulations || '',
          accountType: attributes?.account_type || '',
          openAt: this.parseISOTimeToDisplay(attributes?.open_time) || '',
          closeAt: this.parseISOTimeToDisplay(attributes?.close_time) || '',
          selectedBusinessDays: this.mapBusinessDaysToAbbreviated(
            attributes?.business_days,
          ) || [],
        },
        () => {
          if (isEditMode) {
            this.generateOpenTimeSlots();
            const rulesAndRegulationsIcons =
              attributes?.rules_and_regulations_icons;
            if (
              rulesAndRegulationsIcons &&
              Array.isArray(rulesAndRegulationsIcons)
            ) {
              const selectedIds = rulesAndRegulationsIcons.map(
                (rule: any) => rule.id,
              );
              this.setState({ selectedRulesAndRegulationsIds: selectedIds });
              
              // Extract texts from rules_and_regulations_icons and save to AsyncStorage
              // This ensures the texts are available for matching when rules API loads
              const rulesTexts: string[] = [];
              rulesAndRegulationsIcons.forEach((rule: any) => {
                // Try to get text from various possible fields
                const ruleText = rule.title || rule.name || rule.text || rule.attributes?.title || rule.attributes?.name || '';
                if (ruleText && !rulesTexts.includes(ruleText)) {
                  rulesTexts.push(ruleText);
                }
              });
              
              if (rulesTexts.length > 0) {
                setStorageData('selectedRulesAndRegulationsTexts', JSON.stringify(rulesTexts)).then(() => {
                  console.log('✅ Saved rules texts from API response to AsyncStorage:', rulesTexts);
                });
              } else {
                // If no texts found, try to get them from the rule objects themselves
                // Some APIs might return the text differently
                console.log('⚠️ No rule texts found in rules_and_regulations_icons, will rely on loadSavedRulesTexts()');
              }
            }

            const rosters = attributes?.rosters || [];
            if (rosters && Array.isArray(rosters) && rosters.length > 0) {
              const rosterNames = rosters
                .map((roster: any) => roster.name || roster)
                .filter((name: any) => name);
              this.setState({ roster: rosterNames });
              
              // Also save to AsyncStorage for consistency
              setStorageData('savedRosters', JSON.stringify(rosterNames)).then(() => {
                console.log('✅ Saved rosters to AsyncStorage from API response:', rosterNames);
              });
            } else if (rosters && Array.isArray(rosters)) {
              this.setState({ roster: [] });
            } else {
              // If no rosters from API, try to load from AsyncStorage
              getStorageData('savedRosters').then((savedRostersStr) => {
                if (savedRostersStr) {
                  try {
                    const savedRosters = JSON.parse(savedRostersStr);
                    console.log('✅ Loaded saved rosters from AsyncStorage (edit mode):', savedRosters);
                    this.setState({ roster: savedRosters });
                  } catch (error) {
                    console.error('❌ Error parsing saved rosters:', error);
                  }
                }
              });
            }

            this.getRulesAndRegulations();
          }
          console.log('Profile data set in state successfully');
          if (categoryID && categoryID !== '')
            this.getSubCategoriesAPI(categoryID);
          this.getStateList(attributes?.country);
        },
      );
    } else {
      this.setState({ isLoading: false });
    }
  };

  handlePrivateAccount = async (isPrivate: boolean, accountId: string) => {
    const userId = await getStorageData('user_id');
    if (accountId === userId) {
      this.setState({ canShowAccountInfo: true });
      return;
    }
    if (isPrivate) {
      this.getFollowersList();
    } else {
      this.setState({ canShowAccountInfo: true });
    }
  };

  getFollowersList = async () => {
    this.setState({ isLoading: true });

    const getFollowersRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getFollowersListAPICallID = getFollowersRequestMsg.messageId;

    const authToken = await getStorageData('authToken');

    const header = JSON.stringify({
      'Content-Type': configJSON.followersListAPIContentType,
      token: authToken,
    });

    getFollowersRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.followersListEndPoint,
    );

    getFollowersRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      header,
    );

    getFollowersRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.followersListAPIMethod,
    );

    runEngine.sendMessage(getFollowersRequestMsg.id, getFollowersRequestMsg);
  };

  handleCheckFollowersForPrivateAccount = async (responseJson: any) => {
    const profileIdToLoad = await getStorageData('profileIdToLoad');
    let foundId = false;
    this.setState({ isLoading: false });
    if (responseJson?.data) {
      const { data } = responseJson;
      data.forEach((item: IFollowerItem) => {
        if (item?.attributes?.account_id?.toString() === profileIdToLoad) {
          foundId = true;
          this.setState({ canShowAccountInfo: true });
        }
      });
      if (!foundId) {
        this.setState({ canShowAccountInfo: false });
      }
    } else {
      this.setState({ canShowAccountInfo: false });
    }
  };

  updateCoverPhoto = (coverImage: string | null) => {
    if (coverImage) this.setState({ coverPic: coverImage });
  };

  shouldUpdateBandDetails = () => {
    const isEditMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    return this.state.userRole === 'band' && isEditMode;
  };

  parseInstagramUrl = (url: string) => {
    let link = '';
    if (url === null || !url) {
      return link;
    }
    if (url.includes('http://')) {
      const parts = url.split('/');
      link = parts[parts.length - 1];
    } else if (url.includes('https://')) {
      link = url.replace('https://www.instagram.com/', ' ');
    } else {
      link = url;
    }
    return link.trim();
  };

  parseFaceBookUrl = (url: string) => {
    let link = '';
    if (url === null || !url) {
      return link;
    }

    if (url.includes('http://')) {
      const parts = url.split('/');
      link = parts[parts.length - 1];
    } else if (url.includes('https://')) {
      link = url.replace('https://www.facebook.com/', ' ');
    } else {
      link = url;
    }
    return link.trim();
  };

  parseLinkedinUrl = (url: string) => {
    let link = '';
    if (url === null || !url) {
      return link;
    }
    if (url.includes('http://')) {
      const parts = url.split('/');
      link = parts[parts.length - 1];
    } else if (url.includes('https://')) {
      link = url.replace('https://www.linkedin.com/in/', ' ');
    } else {
      link = url;
    }
    return link.trim();
  };

  updateBandDetails = async (attributes: any) => {
    runEngine.debugLog('band attributes', attributes);

    console.log(
      '🔍 updateBandDetails - attributes.influences:',
      attributes?.influences,
    );
    console.log(
      '🔍 updateBandDetails - attributes.affiliates:',
      attributes?.affiliates,
    );

    let sub_cat: string[] = [];
    let categoryName = '';
    let categoryID = '';

    if (
      attributes?.category_subcat.length !== 0 &&
      attributes?.category_subcat[0].subcategories.length !== 0
    ) {
      attributes?.category_subcat[0].subcategories.forEach(
        (item: { id: number; name: string }) => sub_cat.push(item.name),
      );
      categoryName = attributes?.category_subcat[0].name;
      categoryID = attributes?.category_subcat[0].id;
    }
    const country = this.state.countriesList.find(
      (item: any) => item.country_code === attributes?.country,
    );
    const selectedCountryName = country ? country.country_name : '';

    const userTitle = await getStorageData('user_title');
    const adminName = await getStorageData('administrator_name');

    const isEditMode = this.isProfileEditMode();
    const { influencesList, affiliatesList } =
      await this.resolveInfluencesAndAffiliatesForProfile(
        isEditMode,
        attributes,
      );
    const { address, zipCode } = await this.resolveAddressAndZipForProfile(
      attributes,
      isEditMode,
    );

    this.setState({ isLoading: false });
    this.setState(
      {
        firstName: attributes?.first_name,
        email: attributes?.email,
        address,
        zipCode,
        rulesRegulations: attributes?.rules_and_regulations,
        capacity: attributes?.maximum_people_capacity,
        accountType: attributes?.account_type || '',
        website:
          attributes?.official_website !== 'undefined'
            ? attributes?.official_website
            : '',
        instagram:
          attributes?.social_media?.instagram !== 'undefined'
            ? this.parseInstagramUrl(attributes?.social_media?.instagram)
            : '',
        facebook:
          attributes?.social_media?.facebook !== 'undefined'
            ? this.parseFaceBookUrl(attributes?.social_media?.facebook)
            : '',
        linkedin:
          attributes?.social_media?.linkedin !== 'undefined'
            ? this.parseLinkedinUrl(attributes?.social_media?.linkedin)
            : '',
        aboutUs: attributes?.bio,

        influencesList,
        affiliatesList,
        selectedCountry: selectedCountryName,
        selectedState: attributes?.state,
        selectedCity: attributes?.city,
        selectedCategoryName: categoryName,
        selectedCategoryID: categoryID,
        selectedSubCategoryName: sub_cat,
        title: attributes?.title ?? userTitle,
        adminName: attributes?.administrator_name ?? adminName,
        profilePic: attributes?.profile_image,
        phoneNumber: attributes?.full_phone_number
          ? attributes?.full_phone_number.toString()
          : '',
      },
      () => {
        if (categoryID && categoryID !== '')
          this.getSubCategoriesAPI(categoryID);
        this.getStateList(attributes?.country);
      },
    );
  };

  handleEditProfileAPIResponse = (responseJson: any) => {
    this.setState({ isLoading: false });

    if (responseJson.errors) {
      this.parseApiErrorResponse(responseJson);
    } else {
      const phoneNumber = responseJson.data.attributes.phone_number;
      const userName = responseJson.data.attributes.first_name.trim();
      const countrycode =
        responseJson.data.attributes.country_code !== null
          ? responseJson.data.attributes.country_code.toString()
          : '';
      setStorageData(
        'user_phone_number',
        phoneNumber ? phoneNumber.toString() : '',
      );
      setStorageData('user_name', userName);
      setStorageData('user_email', responseJson.data.attributes.email);
      setStorageData(
        'user_profile_pic',
        responseJson.data.attributes.profile_image,
      );
      setStorageData('user_country_code', countrycode);
      const info = {
        user_profile_pic: responseJson.data.attributes.profile_image,
        userName: userName,
      };
      const raiseMessage: Message = new Message(
        getName(MessageEnum.EditProfileUpdateMessage),
      );
      raiseMessage.addData(getName(MessageEnum.EditProfileUpdateMessage), info);
      this.send(raiseMessage);
      this.props.navigation.goBack();
    }
  };

  handleErrorResponse = (errorResponse: any) => {
    console.log('❌ ========== API ERROR RESPONSE ==========');
    console.log('❌ Error Response Type:', typeof errorResponse);
    console.log('❌ Error Response:', JSON.stringify(errorResponse, null, 2));
    
    // Try to extract more details
    if (typeof errorResponse === 'string') {
      console.log('❌ Error is a string:', errorResponse);
    } else if (errorResponse && typeof errorResponse === 'object') {
      console.log('❌ Error object keys:', Object.keys(errorResponse));
      if (errorResponse.errors) {
        console.log('❌ Error errors field:', JSON.stringify(errorResponse.errors, null, 2));
      }
      if (errorResponse.message) {
        console.log('❌ Error message field:', errorResponse.message);
      }
      if (errorResponse.data) {
        console.log('❌ Error data field:', JSON.stringify(errorResponse.data, null, 2));
      }
    }
    console.log('❌ =========================================');
    
    this.setState({ isLoading: false });
    
    // Handle string error responses
    if (typeof errorResponse === 'string') {
      this.showAlert('Error', errorResponse);
    } else {
      this.parseApiErrorResponse(errorResponse);
    }
  };

  handleSessionResponseMessage = (message: Message) => {
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      const requesterId = message.getData(
        getName(MessageEnum.SessionRequestedBy),
      );

      if (requesterId === this.uniqueSessionRequesterId) {
        const sessionToken = message.getData(
          getName(MessageEnum.SessionResponseToken),
        );
        this.authToken = sessionToken;
        this.getUserProfile();
      }
    }
  };

  handleStateAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { state } = responseJson;
      const states = Object.keys(state).map(key => {
        return {
          key,
          name: state[key],
        };
      });
      this.setState({ states }, async () => {
        this.state.userRole === 'fan' && this.setStateFan();
        (this.state.userRole === 'band' || this.state.userRole === 'venue') &&
          !this.state.isCountryModified &&
          this.setStateBand();
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  setStateFan = () => {
    if (!this.state.countryChanged) {
      const profileData =
        this.props.navigation.state?.params?.profileData ||
        (this.props as any).route?.params?.profileData;
      if (profileData !== undefined && profileData !== null) {
        const selectedStateObject = this.state.states.find(
          item =>
            item.key === profileData.data.attributes.state ||
            item.name === profileData.data.attributes.state,
        );
        const selectedStateKey = selectedStateObject
          ? selectedStateObject.key
          : '';
        this.setState({ selectedState: selectedStateKey }, () => {
          if (selectedStateKey !== '') this.getCityList(selectedStateKey);
        });
      }
    }
  };

  setStateBand = async () => {
    const isEditMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    // In edit mode, use the selectedState already set from API response
    // In non-edit mode (signup), use storage value
    let stateName: string;
    if (isEditMode && this.state.selectedState) {
      stateName = this.state.selectedState;
    } else {
      stateName = await getStorageData('state');
    }

    const stateObj = this.state.states.find(
      (item: any) => item.name === stateName || item.key === stateName,
    );
    const stateKey = stateObj ? stateObj.key : '';
    this.setState({ selectedState: stateKey }, () => {
      this.getCityList(stateKey);
    });
  };

  handleCitiesResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { city } = responseJson;
      this.setState({ cities: city }, async () => {
        this.state.userRole === 'fan' && this.setCityFan();
        (this.state.userRole === 'band' || this.state.userRole === 'venue') &&
          !this.state.isCountryModified &&
          this.setCityBand();
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  setCityFan = () => {
    if (!this.state.stateChanged) {
      const profileData =
        this.props.navigation.state?.params?.profileData ||
        (this.props as any).route?.params?.profileData;
      if (profileData !== undefined && profileData !== null) {
        const selectedCityObject = this.state.cities.find(
          item => item === profileData.data.attributes.city,
        );
        const selectedCityKey = selectedCityObject ?? '';
        this.setState({ selectedCity: selectedCityKey });
      }
    }
  };

  setCityBand = async () => {
    const isEditMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    // In edit mode, use the selectedCity already set from API response
    // In non-edit mode (signup), use storage value
    let cityName: string;
    if (isEditMode && this.state.selectedCity) {
      cityName = this.state.selectedCity;
    } else {
      cityName = await getStorageData('city');
    }

    const cityObj = this.state.cities.find((item: any) => item === cityName);
    const citySelected = cityObj ?? '';
    this.setState({ selectedCity: citySelected });
  };

  getBandArtist = async () => {
    const token = await getStorageData('authToken');

    const headerParams = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    const getBandsArtistsRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getBandArtistsAPICallID = getBandsArtistsRequestMsg.messageId;

    getBandsArtistsRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.bandArtistsAPIEndpoint,
    );
    getBandsArtistsRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headerParams),
    );

    getBandsArtistsRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(
      getBandsArtistsRequestMsg.id,
      getBandsArtistsRequestMsg,
    );
  };

  getUserID = async () => {
    const userID = await getStorageData('user_id');

    let userRole = await getStorageData('userRole');
    if (!userRole) {
      userRole = await getStorageData('user_role');
    }
    const profileIdToLoad = await getStorageData('profileIdToLoad');

    console.log('🔍 getUserID - userID:', userID);
    console.log('🔍 getUserID - profileIdToLoad:', profileIdToLoad);
    console.log('🔍 getUserID - userRole:', userRole);

    if (profileIdToLoad && profileIdToLoad !== userID) {
      console.log("🔍 Loading other user's profile:", profileIdToLoad);
      this.setState({ passedAccountId: profileIdToLoad }, () => {
        this.getUserDetailsAPI(profileIdToLoad);
      });
      return;
    }

    console.log("🔍 Loading current user's own profile");

    const isEditMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    this.setState({ userID, userRole }, () => {
      if (isEditMode) {
        console.log(
          '🔄 Edit mode detected - fetching fresh profile data from API',
        );
        this.getUserDetailsAPI(userID);
      } else if ((userRole === 'band' || userRole === 'venue') && !isEditMode) {
        this.getStoredData();
      } else {
        this.getUserDetailsAPI(userID);
      }
    });
  };

  isProfileEditMode = (): boolean => {
    return (
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode === true ||
      (this.props as any).route?.params?.editMode === true
    );
  };

  resolveAddressAndZipForProfile = async (
    attributes: any,
    isEditMode: boolean,
  ): Promise<{ address: string; zipCode: string }> => {
    const apiAddress = attributes?.address || '';
    const apiZipCode = attributes?.postal_code
      ? attributes.postal_code.toString()
      : attributes?.zip_code
      ? attributes.zip_code.toString()
      : '';

    if (isEditMode) {
      return { address: apiAddress, zipCode: apiZipCode };
    }

    const savedAddress = await getStorageData('user_address');
    const savedZipCode = await getStorageData('user_zip_code');

    return {
      address: apiAddress || savedAddress || this.state.address || '',
      zipCode: apiZipCode || savedZipCode || this.state.zipCode || '',
    };
  };

  resolveInfluencesAndAffiliatesForProfile = async (
    isEditMode: boolean,
    attributes?: any,
  ): Promise<{ influencesList: string[]; affiliatesList: string[] }> => {
    if (isEditMode) {
      return {
        influencesList: attributes?.influences || [],
        affiliatesList: attributes?.affiliates || [],
      };
    }

    const updatedInfluencesStr = await getStorageData('updated_influences');
    const updatedAffiliatesStr = await getStorageData('updated_affiliates');

    let influencesList: string[] = Array.isArray(this.state.influencesList)
      ? this.state.influencesList
      : [];
    let affiliatesList: string[] = Array.isArray(this.state.affiliatesList)
      ? this.state.affiliatesList
      : [];

    if (updatedInfluencesStr) {
      try {
        const parsed = JSON.parse(updatedInfluencesStr);
        if (Array.isArray(parsed)) {
          influencesList = parsed;
        }
      } catch (error) {
        console.error('❌ Error parsing updated influences:', error);
      }
    }

    if (updatedAffiliatesStr) {
      try {
        const parsed = JSON.parse(updatedAffiliatesStr);
        if (Array.isArray(parsed)) {
          affiliatesList = parsed;
        }
      } catch (error) {
        console.error('❌ Error parsing updated affiliates:', error);
      }
    }

    return { influencesList, affiliatesList };
  };

  getStoredData = async () => {
    const selectedState = await getStorageData('state');
    const city = await getStorageData('city');
    const userName = await getStorageData('user_name');
    const { influencesList, affiliatesList } =
      await this.resolveInfluencesAndAffiliatesForProfile(false);

    const selectedStateObject = this.state.states.find(
      item => item.key === selectedState || item.name === selectedState,
    );
    const selectedStateKey = selectedStateObject ? selectedStateObject.key : '';
    this.setState(
      {
        firstName: userName,
        selectedState: selectedStateKey,
        selectedCity: city,
        influencesList,
        affiliatesList,
        isLoading: false,
      },
      () => {
        selectedStateKey !== '' && this.getCityList(selectedStateKey);
      },
    );
  };

  txtInputFirstNameProps = {
    onChangeText: (text: string) => {
      this.setState({ firstName: text });

      //@ts-ignore
      this.txtInputFirstNameProps.value = text;
    },
  };

  txtInputLastNameProps = {
    onChangeText: (text: string) => {
      this.setState({ lastName: text });

      //@ts-ignore
      this.txtInputLastNameProps.value = text;
    },
  };

  txtInputPhoneNumberlWebProps = {
    onChangeText: (text: string) => {
      if (this.txtInputPhoneNumberlWebProps.editable) {
        this.setState({ phoneNumber: text });

        //@ts-ignore
        this.txtInputPhoneNumberProps.value = text;
      }
    },
    editable: true,
  };

  txtInputPhoneNumberlMobileProps = {
    ...this.txtInputPhoneNumberlWebProps,
    autoCompleteType: 'tel',
    keyboardType: 'phone-pad',
  };

  txtInputPhoneNumberProps = this.isPlatformWeb()
    ? this.txtInputPhoneNumberlWebProps
    : this.txtInputPhoneNumberlMobileProps;

  txtInputEmailWebProps = {
    value: '',
    editable: true,
    onChangeText: (text: string) => {
      if (this.txtInputEmailProps.editable) {
        this.setState({ email: text });
        this.txtInputEmailProps.value = text;
      }
    },
  };

  txtInputEmailMobileProps = {
    ...this.txtInputEmailWebProps,
    keyboardType: 'email-address',
  };

  txtInputEmailProps = this.isPlatformWeb()
    ? this.txtInputEmailWebProps
    : this.txtInputEmailMobileProps;

  btnEnableEditPasswordProps = {
    onPress: () => this.enableDisableEditPassword(true),
  };

  txtInputCurrentPasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ currentPasswordText: text });
      this.txtInputCurrentPasswordProps.value = text;
    },
    value: '',
    secureTextEntry: true,
  };

  txtInputNewPasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ newPasswordText: text });
      this.txtInputNewPasswordProps.value = text;
    },
    value: '',
    secureTextEntry: true,
  };

  txtInputReTypePasswordProps = {
    onChangeText: (text: string) => {
      this.setState({ reTypePasswordText: text });
      this.txtInputReTypePasswordProps.value = text;
    },
    secureTextEntry: true,
    value: '',
  };

  btnDisableEditPasswordProps = {
    onPress: () => this.enableDisableEditPassword(false),
  };

  async getUserDetailsAPI(accountId: string, forceLoading: boolean = false) {
    const shouldShowLoading =
      forceLoading || !this.hasCachedProfileForAccount(accountId);
    if (shouldShowLoading) {
      this.setState({ isLoading: true });
    }
    this.getCategoriesList();
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.contentTypeApiGetUserProfile,
      token: authToken,
    };

    const getUserDetailsRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.userDetailGetApiCallId = getUserDetailsRequestMsg.messageId;
    console.log(
      '🔍 getUserDetailsAPI called. Setting userDetailGetApiCallId to:',
      this.userDetailGetApiCallId,
      ' for instance:',
      (this as any)._instanceId,
    );

    const endpoint = `${configJSON.userDetailEndPoint}?id=${accountId}`;
    const method = configJSON.methodTypeApiGetUserProfile;
    const baseURL = require('../../../framework/src/config.js').baseURL;
    const fullURL = `${baseURL}${endpoint}`;

    // Log API details
    console.log('=== Get User Profile API Call ===');
    console.log('URL:', fullURL);
    console.log('Method:', method);
    console.log('Account ID:', accountId);
    console.log('Headers:', JSON.stringify(header, null, 2));

    getUserDetailsRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    getUserDetailsRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    getUserDetailsRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method,
    );

    runEngine.sendMessage(
      getUserDetailsRequestMsg.id,
      getUserDetailsRequestMsg,
    );
  }

  onSelectState = (state_name: string) => {
    this.setState(
      {
        selectedState: state_name,
        selectedCity: '',
        cities: [],
        stateChanged: true,
      },
      () => {
        this.getCityList(state_name);
      },
    );
  };

  getStateList(country: string) {
    const header = {
      'Content-Type': configJSON.contentTypeApiGetUserProfile,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getStatesApiCallId = requestMessage.messageId;

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
      configJSON.methodTypeApiGetUserProfile,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  getCityList(stateSelected: string) {
    const headers = {
      'Content-Type': configJSON.contentTypeApiGetUserProfile,
    };

    const getCityListRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCityApiCallId = getCityListRequestMsg.messageId;

    getCityListRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getCitiesEndpoint + stateSelected,
    );

    getCityListRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers),
    );

    getCityListRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.methodTypeApiGetUserProfile,
    );

    runEngine.sendMessage(getCityListRequestMsg.id, getCityListRequestMsg);
  }

  getProfileData = (data: any) => {
    if (!data?.data?.attributes) {
      console.log('⚠️ getProfileData called with invalid data:', data);
      return;
    }
    const {
      first_name,
      email,
      profile_image,
      country,
      country_code,
      country_code_name,
    } = data.data.attributes;
    const fullName = `${first_name.trim()}`;
    const phoneNumber = data.data.attributes.phone_number.toString() ?? '';
    if (profile_image !== null && profile_image !== '') {
      this.setState({ profilePic: profile_image });
    }
    const selectedCountryObject = this.state.countriesList.find(
      item => item.country_code === country,
    );
    const selectedCountryKey = selectedCountryObject
      ? selectedCountryObject.country_name
      : 'United States';
    let usData;
    if (country_code_name !== null)
      usData = this.state.countryCodesList.find(
        (item: any) => item.id === country_code_name,
      );
    else if (country_code !== null)
      usData = this.state.countryCodesList.find(
        (item: any) => item.attributes.country_code === country_code.toString(),
      );
    else
      usData = this.state.countryCodesList.find(
        (item: any) => item.id === country,
      );

    this.setState(
      {
        firstName: fullName,
        email,
        selectedCountryCode: usData,
        phoneNumber,
        userID: data.data.id,
        isLoading: false,
        selectedCountry: selectedCountryKey,
      },
      () => {
        if (selectedCountryKey !== '') this.getStateList(country);
      },
    );
  };

  handleProfilePic = async (selectedPic: string) => {
    this.setState({ showCameraGalleryPopup: true, selectedPic });
  };

  updateProfile = async () => {
    if (this.checkDataValidation()) {
      this.setState({ isLoading: true });

      const selectedCountryObj = this.state.countriesList.find(
        item =>
          item.country_code === this.state.selectedCountry ||
          item.country_name === this.state.selectedCountry,
      );
      const selectedCountryCode = selectedCountryObj
        ? selectedCountryObj.country_code
        : '';

      const userEmail = await getStorageData('user_email');
      const authToken = await getStorageData('authToken');

      const formData = new FormData();
      const selectedStateObject = this.state.states.find(
        item => item.key === this.state.selectedState,
      );
      const selectedStateName = selectedStateObject
        ? selectedStateObject.name
        : '';
      const name = this.state.firstName + ' ' + this.state.lastName;
      formData.append('data[full_phone_number]', this.state.phoneNumber);
      formData.append('data[address]', this.state.address);
      formData.append('data[zip_code]', this.state.zipCode);
      formData.append('data[title]', this.state.title);
      formData.append('data[state]', selectedStateName);
      formData.append('data[country]', selectedCountryCode);
      formData.append(
        'data[country_code]',
        this.state.selectedCountryCode.attributes.country_code,
      );
      formData.append('data[first_name]', name.trim());
      formData.append('data[city]', this.state.selectedCity);
      formData.append(
        'data[country_code_name]',
        this.state.selectedCountryCode.id,
      );
      if (userEmail.trim() !== this.state.email.trim())
        formData.append('data[email]', this.state.email);

      // Business hours: open_time, close_time (API format "HH:mm"), business_days (lowercase full day names)
      if (this.state.openAt && this.state.openAt.trim() !== '') {
        formData.append(
          'data[open_time]',
          this.convertTo24Hour(this.state.openAt.trim()),
        );
      }
      if (this.state.closeAt && this.state.closeAt.trim() !== '') {
        formData.append(
          'data[close_time]',
          this.convertTo24Hour(this.state.closeAt.trim()),
        );
      }
      const dayAbbrToFull: Record<string, string> = {
        Mon: 'monday',
        Tue: 'tuesday',
        Wed: 'wednesday',
        Thu: 'thursday',
        Fri: 'friday',
        Sat: 'saturday',
        Sun: 'sunday',
      };
      if (
        this.state.selectedBusinessDays &&
        this.state.selectedBusinessDays.length > 0
      ) {
        this.state.selectedBusinessDays.forEach((abbr: string) => {
          const fullDay = dayAbbrToFull[abbr] || abbr.toLowerCase();
          formData.append('data[business_days][]', fullDay);
        });
      }

      const profilePic = {
        uri: this.state.profilePicData.uri,
        type: 'image/jpeg',
        name: 'profilePic.jpg',
      };
      this.state.profilePicData.uri !== undefined &&
        this.state.profilePicData.uri !== null &&
        this.state.profilePicData.uri !== '' &&
        formData.append('data[profile_image]', profilePic as any);

      // Include rules and regulations texts (not IDs) if available
      // Use selectedRulesAndRegulationsTexts as the source of truth - it contains both API rules and custom rules
      let selectedRulesTexts: string[] = [];
      
      // First, try to get from state if available
      const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
      if (savedRulesTextsStr) {
        try {
          selectedRulesTexts = JSON.parse(savedRulesTextsStr);
          console.log('📦 Loaded selected rules texts from AsyncStorage (update):', selectedRulesTexts);
        } catch (error) {
          console.error('Error parsing saved texts:', error);
        }
      }
      
      // Also ensure API rules from selected IDs are included
      if (
        this.state.selectedRulesAndRegulationsIds &&
        this.state.selectedRulesAndRegulationsIds.length > 0 &&
        this.state.rulesAndRegulations &&
        this.state.rulesAndRegulations.length > 0
      ) {
        this.state.rulesAndRegulations.forEach((rule: any) => {
          const ruleId = rule.id || rule.attributes?.id;
          if (this.state.selectedRulesAndRegulationsIds.indexOf(ruleId) !== -1) {
            const ruleTitle = rule.title || rule.attributes?.title || '';
            if (ruleTitle && !selectedRulesTexts.includes(ruleTitle)) {
              selectedRulesTexts.push(ruleTitle);
            }
          }
        });
      }
      
      // Send texts as array (includes both API rules and custom rules)
      if (selectedRulesTexts.length > 0) {
        selectedRulesTexts.forEach((text: string) => {
          formData.append(
            'data[rules_and_regulations_icon_ids][]',
            text,
          );
        });
        console.log('📦 Added rules_and_regulations texts to formData (update):', selectedRulesTexts);
        console.log('📦 Includes custom rules:', selectedRulesTexts.filter(text => {
          const isApiRule = this.state.rulesAndRegulations?.some((rule: any) => {
            const ruleTitle = (rule.title || rule.attributes?.title || '').trim();
            return ruleTitle === text.trim() || ruleTitle.toLowerCase() === text.trim().toLowerCase();
          });
          return !isApiRule;
        }));
        
        // Save selected rules texts to AsyncStorage so they can be loaded when editing
        await setStorageData(
          'selectedRulesAndRegulationsTexts',
          JSON.stringify(selectedRulesTexts)
        );
        console.log('✅ Saved selected rules texts to AsyncStorage (update):', selectedRulesTexts);
      } else {
        // If no rules selected, clear the saved texts
        await setStorageData('selectedRulesAndRegulationsTexts', JSON.stringify([]));
        console.log('✅ Cleared selected rules texts from AsyncStorage (no rules selected)');
      }

      // Include rosters if available
      if (this.state.roster && this.state.roster.length > 0) {
        this.state.roster.forEach((item: string) => {
          formData.append('data[rosters][]', item);
        });
        console.log('📦 Added rosters to formData (update):', this.state.roster);
      } else {
        formData.append('data[rosters][]', '');
      }

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.editProfilePatchApiCallID = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.editProfileEndPoint,
      );

      const header = {
        'Content-Type': configJSON.contentTypeFormData,
        token: authToken,
      };

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
        configJSON.methodTypeApiPatchUserProfile,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  };

  validateBandProfile = () => {
    console.log('🔍 ===== VALIDATING BAND PROFILE =====');
    console.log('📝 Admin Name:', this.state.adminName);
    console.log('📝 About Us:', this.state.aboutUs?.substring(0, 50) + '...');
    console.log('📝 Selected Country:', this.state.selectedCountry);
    console.log('📝 Phone Number:', this.state.phoneNumber);
    console.log('📝 Selected State:', this.state.selectedState);
    console.log('📝 Selected City:', this.state.selectedCity);

    let error = false;
    this.resetErrors();
    const businessTypesRequiringAddress: string[] = [
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
    const validations = [
      {
        condition: isEmpty(this.state.aboutUs),
        errorMsg: configJSON.bioUnavilableError,
        stateKey: 'aboutUsError',
        field: 'Bio/About Us',
      },
      {
        condition: isEmpty(this.state.selectedCountry),
        errorMsg: configJSON.errorCountryCannotBeBlank,
        stateKey: 'countryError',
        field: 'Country',
      },
      {
        condition: isEmpty(this.state.phoneNumber),
        errorMsg: configJSON.errorPhoneCannotBeBlank,
        stateKey: 'phoneError',
        field: 'Phone Number',
      },
      {
        condition:
          !isEmpty(this.state.phoneNumber) &&
          this.state.phoneNumber.length !== 10,
        errorMsg: configJSON.errorPhoneNumberLength,
        stateKey: 'phoneError',
        field: 'Phone Number (length)',
      },
      {
        condition:
          this.state.selectedCountry === 'United States' &&
          isEmpty(this.state.selectedState),
        errorMsg: configJSON.errorStateCannotBeBlank,
        stateKey: 'stateError',
        field: 'State (US only)',
      },
      {
        condition:
          this.state.selectedCountry === 'United States' &&
          isEmpty(this.state.selectedCity),
        errorMsg: configJSON.errorCityCannotBeBlank,
        stateKey: 'cityError',
        field: 'City (US only)',
      },
      {
        condition:
          this.state.userRole === 'venue' &&
          this.state.accountType &&
          businessTypesRequiringAddress.includes(this.state.accountType) &&
          isEmpty(this.state.address),
        errorMsg: configJSON.errorAddressCannotBeBlank,
        stateKey: 'addressError',
        field: 'Address',
      },
      {
        condition:
          this.state.userRole === 'venue' &&
          this.state.accountType &&
          businessTypesRequiringAddress.includes(this.state.accountType) &&
          isEmpty(this.state.zipCode),
        errorMsg: configJSON.errorZipCodeCannotBeBlank,
        stateKey: 'zipCodeError',
        field: 'Zip Code',
      },
      {
        condition:
          this.state.userRole === 'venue' &&
          this.state.accountType &&
          businessTypesRequiringAddress.includes(this.state.accountType) &&
          !isEmpty(this.state.zipCode) &&
          this.state.zipCode.length < 5,
        errorMsg: configJSON.errorZipCodeLength,
        stateKey: 'zipCodeError',
        field: 'Zip Code (length)',
      },
    ];

    const errorState: any = {};

    validations.forEach(({ condition, errorMsg, stateKey, field }) => {
      if (condition) {
        console.error('❌ Validation FAILED for:', field);
        console.error('   Error message:', errorMsg);
        error = true;
        errorState[stateKey] = errorMsg;
      } else {
        console.log('✅ Validation PASSED for:', field);
      }
    });

    this.setState(errorState);

    if (error) {
      console.log('❌ Overall validation FAILED - stopping save');
    } else {
      console.log('✅ Overall validation PASSED - proceeding with save');
    }

    return error;
  };

  resetErrors = () => {
    this.setState({
      nameError: '',
      instagramLinkError: '',
      facebookLinkError: '',
      linkedInLinkError: '',
      aboutUsError: '',
      countryError: '',
      stateError: '',
      cityError: '',
      phoneError: '',
      emailError: '',
      addressError: '',
      zipCodeError: '',
    });
  };

  getLocation = () => {
    const city = this.state.selectedCity;

    const selectedStateObject = this.state.states.find(
      item =>
        item.key === this.state.selectedState ||
        item.name === this.state.selectedState,
    );
    const selectedStateKey = selectedStateObject
      ? selectedStateObject.name
      : '';
    const state = selectedStateKey ?? this.state.selectedState;

    const selectedCountryObj = this.state.countriesList.find(
      item =>
        item.country_code === this.state.selectedCountry ||
        item.country_name === this.state.selectedCountry,
    );
    const country = selectedCountryObj ? selectedCountryObj.country_code : '';

    if (city && state) {
      return `${city}, ${state}`;
    }

    return country;
  };

  getStateName = () => {
    const selectedStateObject = this.state.states.find(
      item => item.key === this.state.selectedState,
    );
    const selectedStateName = selectedStateObject
      ? selectedStateObject.name
      : '';
    return selectedStateName;
  };

  getCountryCode = () => {
    const selectedCountryObj = this.state.countriesList.find(
      item =>
        item.country_code === this.state.selectedCountry ||
        item.country_name === this.state.selectedCountry,
    );
    const selectedCountryCode = selectedCountryObj
      ? selectedCountryObj.country_code
      : '';
    return selectedCountryCode;
  };

  handleCreateBandProfileBody = async () => {
    const stateName = this.getStateName();
    const countryCode = this.getCountryCode();

    const website = this.state.website === null ? '' : this.state.website;
    const instagram = this.state.instagram === '' ? '' : this.state.instagram;
    const linkedin = this.state.linkedin === '' ? '' : this.state.linkedin;
    const facebook = this.state.facebook === '' ? '' : this.state.facebook;

    console.log('🔍 Debug - influencesList:', this.state.influencesList);
    console.log('🔍 Debug - affiliatesList:', this.state.affiliatesList);

    // Log all payload values before creating FormData
    console.log('📦 ========== API PAYLOAD ==========');
    console.log('📦 profile[name]:', this.state.firstName);
    console.log('📦 profile[address]:', this.state.address);
    console.log('📦 profile[zip_code]:', this.state.zipCode);
    console.log('📦 profile[maximum_people_capacity]:', this.state.capacity);
    console.log('📦 profile[rules_and_regulations]:', this.state.rulesRegulations);
    console.log('📦 profile[administrator_name]:', this.state.adminName);
    console.log('📦 profile[country_code]:', '1');
    console.log('📦 profile[country]:', countryCode);
    console.log('📦 profile[state]:', stateName);
    console.log('📦 profile[city]:', this.state.selectedCity);
    console.log('📦 profile[title]:', this.state.title);
    console.log('📦 profile[bio]:', this.state.aboutUs);
    console.log('📦 profile[official_website]:', website);
    console.log('📦 profile[social_media_attributes[instagram]]:', instagram);
    console.log('📦 profile[social_media_attributes[linkedin]]:', linkedin);
    console.log('📦 profile[social_media_attributes[facebook]]:', facebook);
    console.log('📦 profile[phone_number]:', this.state.phoneNumber);
    console.log('📦 profile[full_phone_number]:', this.state.phoneNumber);
    console.log('📦 profile[affiliates]:', this.state.affiliatesList);
    console.log('📦 profile[influences]:', this.state.influencesList);
    console.log('📦 profile[categories]:', this.state.selectedCategoryName);
    console.log('📦 profile[subcategories]:', this.state.selectedSubCategoryName);
    console.log('📦 profile[photo]:', this.state.profilePicData.uri ? 'Present' : 'Not present');
    console.log('📦 profile[cover_photo]:', this.state.coverPicData.uri ? 'Present' : 'Not present');
    console.log('📦 ====================================');

    const formData = new FormData();
    formData.append('profile[name]', this.state.firstName);
    formData.append('profile[address]', this.state.address);
    formData.append('profile[zip_code]', this.state.zipCode);
    formData.append('profile[maximum_people_capacity]', this.state.capacity);
    formData.append(
      'profile[rules_and_regulations]',
      this.state.rulesRegulations,
    );

    formData.append('profile[administrator_name]', this.state.adminName.trim());
    formData.append('profile[country_code]', '1');
    formData.append('profile[country]', countryCode);
    formData.append('profile[state]', stateName);
    formData.append('profile[city]', this.state.selectedCity);
    formData.append('profile[title]', this.state.title);
    formData.append('profile[bio]', this.state.aboutUs.trim());
    formData.append('profile[official_website]', website);
    formData.append('profile[social_media_attributes[instagram]]', instagram);
    formData.append('profile[social_media_attributes[linkedin]]', linkedin);
    formData.append('profile[social_media_attributes[facebook]]', facebook);
    formData.append('profile[phone_number]', this.state.phoneNumber);
    formData.append('profile[full_phone_number]', this.state.phoneNumber);

    // Business hours: open_time, close_time (API format "HH:mm"), business_days (lowercase full day names)
    if (this.state.openAt && this.state.openAt.trim() !== '') {
      formData.append(
        'profile[open_time]',
        this.convertTo24Hour(this.state.openAt.trim()),
      );
    }
    if (this.state.closeAt && this.state.closeAt.trim() !== '') {
      formData.append(
        'profile[close_time]',
        this.convertTo24Hour(this.state.closeAt.trim()),
      );
    }
    const dayAbbrToFull: Record<string, string> = {
      Mon: 'monday',
      Tue: 'tuesday',
      Wed: 'wednesday',
      Thu: 'thursday',
      Fri: 'friday',
      Sat: 'saturday',
      Sun: 'sunday',
    };
    if (
      this.state.selectedBusinessDays &&
      this.state.selectedBusinessDays.length > 0
    ) {
      this.state.selectedBusinessDays.forEach((abbr: string) => {
        const fullDay = dayAbbrToFull[abbr] || abbr.toLowerCase();
        formData.append('profile[business_days][]', fullDay);
      });
    }

    if (this.state.affiliatesList && this.state.affiliatesList.length !== 0)
      this.state.affiliatesList.forEach(item => {
        formData.append('profile[affiliates][]', item);
      });
    else formData.append('profile[affiliates][]', '');

    if (this.state.influencesList && this.state.influencesList.length !== 0)
      this.state.influencesList.forEach(item => {
        formData.append('profile[influences][]', item);
      });
    else formData.append('profile[influences][]', '');

    // Use savedCategoriesAndSubcategories when coming from Categoriessubcategories (has all selected categories)
    // Otherwise use selectedCategoryName + selectedSubCategoryName (single category from CreateYourProfile picker)
    if (
      this.state.savedCategoriesAndSubcategories &&
      Object.keys(this.state.savedCategoriesAndSubcategories).length > 0
    ) {
      const allCategoryNames: string[] = [];
      const allSubcategoryNames: string[] = [];
      Object.keys(this.state.savedCategoriesAndSubcategories).forEach(
        (catName: string) => {
          allCategoryNames.push(catName);
          const subcats =
            this.state.savedCategoriesAndSubcategories[catName] || [];
          subcats.forEach((sub: string) => allSubcategoryNames.push(sub));
        },
      );
      allCategoryNames.forEach((cat: string) =>
        formData.append('profile[categories][]', cat),
      );
      allSubcategoryNames.forEach((sub: string) =>
        formData.append('profile[subcategories][]', sub),
      );
      console.log('📦 profile[categories] (from saved):', allCategoryNames);
      console.log('📦 profile[subcategories] (from saved):', allSubcategoryNames);
    } else {
      if (this.state.selectedCategoryName) {
        formData.append('profile[categories][]', this.state.selectedCategoryName);
      }
      this.state.selectedSubCategoryName &&
        this.state.selectedSubCategoryName.forEach(item => {
          formData.append('profile[subcategories][]', item);
        });
    }

    const isEditMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    // Include rules and regulations texts (not IDs) if available
    // Use selectedRulesAndRegulationsTexts as the source of truth - it contains both API rules and custom rules
    let selectedRulesTexts: string[] = [];
    
    // First, try to get from state if available
    const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
    if (savedRulesTextsStr) {
      try {
        selectedRulesTexts = JSON.parse(savedRulesTextsStr);
        console.log('📦 Loaded selected rules texts from AsyncStorage:', selectedRulesTexts);
      } catch (error) {
        console.error('Error parsing saved texts:', error);
      }
    }
    
    // Also ensure API rules from selected IDs are included
    if (
      this.state.selectedRulesAndRegulationsIds &&
      this.state.selectedRulesAndRegulationsIds.length > 0 &&
      this.state.rulesAndRegulations &&
      this.state.rulesAndRegulations.length > 0
    ) {
      this.state.rulesAndRegulations.forEach((rule: any) => {
        const ruleId = rule.id || rule.attributes?.id;
        if (this.state.selectedRulesAndRegulationsIds.indexOf(ruleId) !== -1) {
          const ruleTitle = rule.title || rule.attributes?.title || '';
          if (ruleTitle && !selectedRulesTexts.includes(ruleTitle)) {
            selectedRulesTexts.push(ruleTitle);
          }
        }
      });
    }
    
    // Send texts as array (includes both API rules and custom rules)
    if (selectedRulesTexts.length > 0) {
      selectedRulesTexts.forEach((text: string) => {
        formData.append(
          'profile[rules_and_regulations_icon_ids][]',
          text,
        );
      });
      console.log('📦 Added rules_and_regulations texts to formData:', selectedRulesTexts);
      console.log('📦 Includes custom rules:', selectedRulesTexts.filter(text => {
        const isApiRule = this.state.rulesAndRegulations?.some((rule: any) => {
          const ruleTitle = (rule.title || rule.attributes?.title || '').trim();
          return ruleTitle === text.trim() || ruleTitle.toLowerCase() === text.trim().toLowerCase();
        });
        return !isApiRule;
      }));
      
      // Save selected rules texts to AsyncStorage so they can be loaded when editing
      await setStorageData(
        'selectedRulesAndRegulationsTexts',
        JSON.stringify(selectedRulesTexts)
      );
      console.log('✅ Saved selected rules texts to AsyncStorage:', selectedRulesTexts);
    } else {
      // If no rules selected, clear the saved texts
      await setStorageData('selectedRulesAndRegulationsTexts', JSON.stringify([]));
      console.log('✅ Cleared selected rules texts from AsyncStorage (no rules selected)');
    }

    // Include rosters if account type requires rosters (for both create and edit mode)
    if (this.shouldHideRulesAndRegulationsTab()) {
      if (this.state.roster && this.state.roster.length > 0) {
        this.state.roster.forEach((item: string) => {
          formData.append('profile[rosters][]', item);
        });
        console.log('📦 Added rosters to formData (create):', this.state.roster);
      } else {
        formData.append('profile[rosters][]', '');
      }
    }

    const profilePic = {
      uri: this.state.profilePicData.uri,
      type: 'image/jpeg',
      name: 'profilePic.jpg',
    };
    this.state.profilePicData.uri !== undefined &&
      this.state.profilePicData.uri !== null &&
      this.state.profilePicData.uri !== '' &&
      formData.append('profile[photo]', profilePic as any);

    const coverPic = {
      uri: this.state.coverPicData.uri,
      type: 'image/jpeg',
      name: 'coverPic.jpg',
    };
    this.state.coverPicData.uri !== undefined &&
      this.state.coverPicData.uri !== null &&
      this.state.coverPicData.uri !== '' &&
      formData.append('profile[cover_photo]', coverPic as any);

    return formData;
  };

  createBandProfile = async () => {
    console.log('🔵 createBandProfile called');

    if (this.validateBandProfile()) {
      console.log('❌ Validation failed, returning early');
      return;
    }

    try {
      console.log('✅ Validation passed, starting API call');
      this.setState({ isLoading: true });

      const token = await getStorageData('authToken');
      console.log(
        '🔑 Token retrieved:',
        token ? 'Token exists' : 'No token found',
      );

      if (!token) {
        console.error('❌ No auth token found');
        this.setState({ isLoading: false });
        this.showAlert(
          'Error',
          'Authentication token not found. Please login again.',
        );
        return;
      }

      const formData = await this.handleCreateBandProfileBody();
      console.log('📝 FormData prepared',formData);


      const header = {
        'Content-Type': configJSON.contentTypeFormData,
        token,
      };

      const createBandProfileRequestMsg = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      const isEditMode =
        this.state.editMode ||
        this.props.navigation?.state?.params?.editMode ||
        (this.props as any).route?.params?.editMode ||
        false;

      console.log('Edit mode check', {
        isEditMode,
        navigationEditMode: this.props.navigation?.state?.params?.editMode,
        routeEditMode: (this.props as any).route?.params?.editMode,
        finalIsEditMode: isEditMode,
      });

      if (isEditMode) {
        this.editBandProfileApiCallID = createBandProfileRequestMsg.messageId;
        console.log(
          '🔧 Edit mode - API Call ID:',
          this.editBandProfileApiCallID,
        );
      } else {
        this.createBandProfileApiCallID = createBandProfileRequestMsg.messageId;
        console.log(
          '🆕 Create mode - API Call ID:',
          this.createBandProfileApiCallID,
        );
      }

      const endpoint = isEditMode
        ? configJSON.editBandProfileEndpoint
        : configJSON.createBandProfileEndpoint;
      const method = isEditMode
        ? configJSON.editBandProfileApiMethod
        : configJSON.createBandProfileApiMethod;

      console.log('🌐 API Endpoint:', endpoint);
      console.log('📤 API Method:', method);

      createBandProfileRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      createBandProfileRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      createBandProfileRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        formData,
      );

      createBandProfileRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        method,
      );

      console.log('📨 Sending API request...');
      runEngine.sendMessage(
        createBandProfileRequestMsg.id,
        createBandProfileRequestMsg,
      );
      console.log('✉️ API request sent successfully');
    } catch (error) {
      console.error('❌ Error in createBandProfile:', error);
      this.setState({ isLoading: false });
      this.showAlert(
        'Error',
        'An error occurred while saving. Please try again.',
      );
    }
  };

  checkDataValidation = () => {
    let error = false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const businessTypesRequiringAddress: string[] = [
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

    this.setState({
      cityError: '',
      nameError: '',
      phoneError: '',
      stateError: '',
      emailError: '',
      countryError: '',
      addressError: '',
      zipCodeError: '',
    });

    if (isEmpty(this.state.firstName.trim())) {
      this.setState({ nameError: configJSON.errorNameCannotBeBlank });
      error = true;
    } else if (!/^[a-zA-Z| ]+$/.test(this.state.firstName)) {
      this.setState({ nameError: configJSON.errorNameCanOnlyContainAlphabets });
      error = true;
    }

    if (isEmpty(this.state.email)) {
      this.setState({ emailError: configJSON.errorEmailCannotBeBlank });
      error = true;
    } else if (!emailRegex.test(this.state.email)) {
      this.setState({ emailError: configJSON.errorEmailNotValid });
      error = true;
    }

    if (isEmpty(this.state.phoneNumber)) {
      this.setState({ phoneError: configJSON.errorPhoneCannotBeBlank });
      error = true;
    } else if (this.state.phoneNumber.length !== 10) {
      this.setState({ phoneError: configJSON.errorPhoneNumberLength });
      error = true;
    }

    if (isEmpty(this.state.selectedCountry)) {
      this.setState({ countryError: configJSON.errorCountryCannotBeBlank });
      error = true;
    }

    if (this.state.selectedCountry === 'United States') {
      if (isEmpty(this.state.selectedState)) {
        this.setState({ stateError: configJSON.errorStateCannotBeBlank });
        error = true;
      }

      if (isEmpty(this.state.selectedCity)) {
        this.setState({ cityError: configJSON.errorCityCannotBeBlank });
        error = true;
      }
    }

    // Validate address and zip code for venue users with business types requiring address
    if (
      this.state.userRole === 'venue' &&
      this.state.accountType &&
      businessTypesRequiringAddress.includes(this.state.accountType)
    ) {
      if (isEmpty(this.state.address)) {
        this.setState({ addressError: configJSON.errorAddressCannotBeBlank });
        error = true;
      }

      if (isEmpty(this.state.zipCode)) {
        this.setState({ zipCodeError: configJSON.errorZipCodeCannotBeBlank });
        error = true;
      } else if (this.state.zipCode.length < 5) {
        this.setState({ zipCodeError: configJSON.errorZipCodeLength });
        error = true;
      }
    }

    if (error) {
      return false;
    }
    return true;
  };

  isEmailValid = (email: string) => {
    const atCharIndex = email.indexOf('@');
    if (atCharIndex === -1 || email.lastIndexOf('@') !== atCharIndex) {
      return false;
    }

    const firstPart = email.slice(0, atCharIndex);
    const secondPart = email.slice(atCharIndex + 1);

    if (firstPart === '' || secondPart === '') {
      return false;
    }

    const dotIndex = secondPart.indexOf('.');
    if (dotIndex === -1 || secondPart.lastIndexOf('.') !== dotIndex) {
      return false;
    }

    const validChars = /^[a-zA-Z0-9_.+-]+$/;
    if (!validChars.test(firstPart) || !validChars.test(secondPart)) {
      return false;
    }

    return true;
  };

  deleteComment = async (commentID: string) => {
    const token = await getStorageData('authToken');
    this.setState({ commentsLoading: true, comment: '', showRepliesFor: [] });

    const deleteCommentMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.deleteCommentAPICallID = deleteCommentMsg.messageId;

    deleteCommentMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.createCommentApiEndpoint}/${commentID}`,
    );

    deleteCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    deleteCommentMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteApiMethodType,
    );

    runEngine.sendMessage(deleteCommentMsg.id, deleteCommentMsg);
  };

  dynamicOpacity = (property: boolean | string) => {
    return property ? 1 : 0.5;
  };

  navigateToStartChat = async () => {
    console.log('UserProfileBasic: Starting chat navigation');
    console.log(
      'UserProfileBasic: passedAccountId:',
      this.state.passedAccountId,
    );
    console.log('UserProfileBasic: profileData:', this.state.profileData);
    console.log('UserProfileBasic: profilePic:', this.state.profilePic);

    await setStorageData('startChatWith', this.state.passedAccountId);
    await setStorageData(
      'chat_user_name',
      this.state.profileData.data?.attributes?.first_name,
    );
    await setStorageData('profile_image', this.state.profilePic);
    await setStorageData('ChatFromProfile', JSON.stringify(true));

    console.log(
      'UserProfileBasic: Navigation data stored, navigating to Chat screen',
    );

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

  handleCamera = async () => {
    this.setState({ showCameraGalleryPopup: false });

    const permitted = await this.ensureCameraAccessGranted();
    if (!permitted) {
      this.showCameraAccessDisabledAlert();
      return;
    }

    setTimeout(async () => {
      const cameraData: any = await launchCamera({
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 600,
        quality: 0.7,
        presentationStyle: 'fullScreen',
      });

      if (cameraData.didCancel) {
        return;
      }
      if (this.isCameraAccessDeniedImagePickerResponse(cameraData)) {
        this.showCameraAccessDisabledAlert();
        return;
      }
      if (!cameraData.assets?.length) {
        return;
      }

      const uriData = cameraData.assets[0].uri ?? '';
      const { selectedPic } = this.state;
      const updateState: any =
        selectedPic === 'profile'
          ? { profilePic: uriData, profilePicData: cameraData.assets[0] }
          : { coverPic: uriData, coverPicData: cameraData.assets[0] };

      this.setState({ ...updateState });
    }, 100);
  };

  handleGallery = async () => {
    this.setState({ showCameraGalleryPopup: false });

    const legacyLibraryOk = await this.ensureLegacyIOSPhotoLibraryAccess();
    if (!legacyLibraryOk) {
      this.showCameraAccessDisabledAlert();
      return;
    }

    try {
      const galleryData: any = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 600,
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
        const selectedPicKey =
          this.state.selectedPic === 'profile' ? 'profilePic' : 'coverPic';
        const selectedPicDataKey =
          this.state.selectedPic === 'profile'
            ? 'profilePicData'
            : 'coverPicData';
        const uriData = galleryData.assets[0]?.uri ?? '';

        this.setState(prevState => ({
          ...prevState,
          [selectedPicKey]: uriData,
          [selectedPicDataKey]: galleryData.assets[0],
        }));
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

  handleCameraGalleryCancelPopup = () => {
    this.setState({ showCameraGalleryPopup: false });
  };

  handleName = (name: string) => {
    this.setState({ firstName: name });
  };

  handleEmail = (email: string) => {
    this.setState({ email: email.trim().toLowerCase() });
  };

  showCountryCodeDropdown = () => {
    this.setState({ modalVisible: true });
  };

  handleStateClick = () => {
    this.setState({ stateClicked: true });
  };

  handleCityClick = () => {
    this.setState({ cityClicked: true });
  };

  handleSelectedCity = (selectedCity: string) => {
    this.setState({ selectedCity });
  };

  handlePhoneNumber = (phone: string) => {
    if (phone && !/^\d+$/.test(phone)) {
      return;
    }
    this.setState({ phoneNumber: phone });
  };

  handleCapacity = (capacity: string) => {
    if (capacity && !/^\d+$/.test(capacity)) {
      return;
    }
    this.setState({ capacity });
  };

  handleZipCode = (zipCode: string) => {
    if (zipCode && !/^\d+$/.test(zipCode)) {
      return;
    }
    this.setState({ zipCode });
  };

  handlePhoneDropdown = () => {
    this.setState({ modalVisible: true });
  };

  hideCountryCodeDropdown = () => {
    this.setState({ modalVisible: false });
  };

  handleSelectedCityIOS = (selectedCity: string) => {
    this.setState({ cityClicked: false, selectedCity });
  };

  handleSelectedStateIOS = (selectedState: string) => {
    this.setState({ stateClicked: false });
    this.onSelectState(selectedState);
  };

  handleRemoveInfluence = async (itemToRemove: string) => {
    let items = [...this.state.influencesList];
    let influencesList = items.filter((item: string) => item !== itemToRemove);
    this.setState({ influencesList });
  };

  handleRemoveAffiliate = async (itemToRemove: string) => {
    let items = [...this.state.affiliatesList];
    let affiliatesList = items.filter((item: string) => item !== itemToRemove);
    this.setState({ affiliatesList });
  };

  handleNavigateToNotifications = () => {
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

    if (typeof this.props.navigation?.dispatch === 'function') {
      this.props.navigation.dispatch(
        CommonActions.navigate(nestedNotificationRoute),
      );
    } else     if (typeof this.props.navigation?.navigate === 'function') {
      this.props.navigation.navigate('Home', {
        screen: 'HomeTab',
        params: {
          screen: 'Profile',
          params: {
            screen: 'Notifications',
          },
        },
      });
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

    if (responseJson.errors) {
      this.setState({
        unreadNotificationCount: 0,
        newNotification: false,
      });
      return;
    }

    let unreadCount = 0;
    let hasUnread = false;

    if (responseJson.unread_count !== undefined) {
      unreadCount = responseJson.unread_count;
      hasUnread = !!responseJson.has_unread_notifications;
    } else if (
      responseJson.data &&
      typeof responseJson.data === 'object' &&
      !Array.isArray(responseJson.data)
    ) {
      unreadCount = responseJson.data.unread_count || 0;
      hasUnread = !!responseJson.data.has_unread_notifications;
    } else if (Array.isArray(responseJson.data) && responseJson.data.length > 0) {
      const firstItem = responseJson.data[0];
      unreadCount = firstItem.unread_count || 0;
      hasUnread = !!firstItem.has_unread_notifications;
    }

    const count =
      typeof unreadCount === 'number'
        ? unreadCount
        : parseInt(unreadCount, 10) || 0;

    this.setState({
      unreadNotificationCount: count,
      newNotification: hasUnread && count > 0,
    });
  };

  handleBack = () => {
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

  handleCloseCommentsModal = () => {
    this.toggleLikeCallback();
    this.setState({ commentsModalOpen: false, replying: false });
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

  handleEditReply = (item: IReplyItem, rowMap: RowMap<IReplyItem>) => {
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
    this.setState({ commentsModalOpen: false, showReplies: false });

    await setStorageData('profileIdToLoad', `${accountId}`);
    await setStorageData('IsFromCommentProfile', JSON.stringify(true));
    await setStorageData('commentUserid', this.state.userID);
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

  handleFollow = async (accountId: string) => {
    this.setState({ isLoading: true });
    const authToken = await getStorageData('authToken');
    const apiHeader = {
      'Content-Type': configJSON.createFollowContentType,
      token: authToken,
    };

    const apiRequestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createFollowApiCallID = apiRequestMessage.messageId;

    const dataToSend = {
      data: {
        attributes: {
          account_id: parseInt(accountId),
        },
      },
    };

    const endpoint = this.state.profileData.data?.attributes.follow
      ? `${configJSON.createFollowApiEndpoint}/${accountId}`
      : configJSON.createFollowApiEndpoint;
    const methodType = this.state.profileData.data?.attributes.follow
      ? configJSON.deleteMethodType
      : configJSON.createFollowApiMethod;

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

    if (!this.state.profileData.data?.attributes.follow) {
      apiRequestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(dataToSend),
      );
    }

    runEngine.sendMessage(apiRequestMessage.id, apiRequestMessage);
  };

  toggleLikeApi = async (eventId: string) => {
    const termsIsAccept = await getStorageData('tAndCAcceptance');
    if (termsIsAccept === 'true') {
      const token = await getStorageData('authToken');

      const payload = {
        like: {
          show_id: eventId,
        },
      };
      const toggleLikeRequestMsg = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.toggleLikeApiCallId = toggleLikeRequestMsg.messageId;

      toggleLikeRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.toggleLikeApiEndPoint,
      );

      toggleLikeRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          'Content-Type': configJSON.toggleLikeContentType,
          token,
        }),
      );

      toggleLikeRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(payload),
      );

      toggleLikeRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.toggleLikeApiMethod,
      );

      runEngine.sendMessage(toggleLikeRequestMsg.id, toggleLikeRequestMsg);
    } else {
      this.setState({ showTncPopup: true });
    }
  };

  goToFollowerFollowingScreen = (screen: string) => {
    const info = {
      type: screen,
      accountId: this.state.profileData.data?.id,
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

  goToBlockedUserScreen = () => {
    const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationTargetMessage), 'Blockedusers');
    this.send(msg);
  };

  goToEditProfile = () => {
    this.props.navigation.navigate('EditProfile', {
      profileData: this.state.profileData,
      editMode: true,
    });
  };

  handleShareEvent = async (eventId: string, eventType: string) => {
    const termsIsAccept = await getStorageData('tAndCAcceptance');
    if (termsIsAccept === 'true') {
      const navMsg: Message = new Message(
        getName(MessageEnum.NavigationMessage),
      );
      navMsg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      navMsg.addData(getName(MessageEnum.NavigationTargetMessage), 'Share');
      const info = {
        eventId: eventId,
        eventType,
      };
      const raiseMessage: Message = new Message(
        getName(MessageEnum.NavigationPayLoadMessage),
      );
      raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);
      navMsg.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
      this.send(navMsg);
    } else {
      this.setState({ showTncPopup: true });
    }
  };

  getCategoriesList = async () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCategoriesListAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.categoriesEndPoint,
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

  handleCategorySelection = (catName: string) => {
    const category = this.state.categoriesList.find(
      item => item.attributes.name === catName,
    );
    const catId = category ? category.id : '';
    
    // Check if we have saved categories from Categoriessubcategories screen
    const savedSubcategories = this.state.savedCategoriesAndSubcategories[catName] || [];
    
    console.log('🔄 Category changed to:', catName);
    console.log('📋 Saved subcategories for this category:', savedSubcategories);
    
    this.setState(
      {
        selectedCategoryName: catName,
        selectedSubCategoryName: savedSubcategories, // Set selected subcategories from saved data
        categoryPickerModal: false,
      },
      () => {
        // Still call API to get all available subcategories for the picker
        if (catId && catId !== '') this.getSubCategoriesAPI(catId);
      },
    );
  };

  getSubCategoriesAPI = async (cat_id: string) => {
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getSubCategoriesListAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.subCategoriesEndPoint + cat_id,
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

  handleSubCategorySelection = (sub_cat: string) => {
    const { selectedSubCategoryName } = this.state;
    const updatedGenre = new Set([...selectedSubCategoryName, sub_cat]);
    this.setState({
      selectedSubCategoryName: Array.from(updatedGenre),
      subCategoryPickerModal: false,
    });
  };

  handleRemoveSubCategory = (item: any) => {
    const { selectedSubCategoryName } = this.state;
    const updatedGenre = selectedSubCategoryName.filter(
      subCat => subCat !== item,
    );
    this.setState({ selectedSubCategoryName: updatedGenre });
  };

  handleShowComments = async (eventId: string) => {
    const termsIsAccept = await getStorageData('tAndCAcceptance');
    if (termsIsAccept === 'true') {
      this.setState({
        commentsModalOpen: true,
        eventId,
        comment: '',
        isLoadingComments: true,
      });
      this.fetchComments(eventId);
    } else {
      this.setState({ showTncPopup: true });
    }
  };

  fetchComments = async (eventId: string) => {
    const token = await getStorageData('authToken');

    this.setState({ commentsLoading: true });
    const fetchCommentsMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.fetchCommentsAPICallID = fetchCommentsMsg.messageId;

    fetchCommentsMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.fetchCommentsEndpoint}?commentable_id=${eventId}&commentable_type=Show`,
    );

    fetchCommentsMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token,
      }),
    );

    fetchCommentsMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(fetchCommentsMsg.id, fetchCommentsMsg);
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
      : configJSON.postCommentMethodType;

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
      commentsModalOpen: true,
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
      commentsModalOpen: true,
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
      commentsModalOpen: false,
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
      : configJSON.postCommentMethodType;

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

  getCalendarEventsLength = () => {
    try {
      if (this.state.profileData.data.attributes.calendar_shows.length > 0) {
        return this.state.profileData.data.attributes.calendar_shows.length;
      } else {
        return 0;
      }
    } catch (_) {
      return 0;
    }
  };

  getLikedEventLength = () => {
    try {
      if (this.state.profileData.data.attributes.liked_events.length > 0) {
        return this.state.profileData.data.attributes.liked_events.length;
      } else {
        return 0;
      }
    } catch (_) {
      return 0;
    }
  };

  handleEditPreferences = async () => {
    const isEdit =
      this.state.profileData.data?.attributes?.user_selection?.data !== null
        ? 'true'
        : 'false';
    await setStorageData('categoriesFromProfile', 'true');
    if (this.props.navigation) {
      try {
        await setStorageData('categoriesEditMode', isEdit);
        await setStorageData('navigateBack', 'true');
        await setStorageData(
          'categoriesData',
          JSON.stringify(
            this.state.profileData.data.attributes?.user_selection?.data?.attributes
              ?.user_categories,
          ),
        );
        await setStorageData(
          'artistsList',
          JSON.stringify(
            this.state.profileData.data.attributes?.user_selection?.data?.attributes
              ?.band_artists,
          ),
        );
        await setStorageData(
          'user_state',
          this.state.profileData.data.attributes?.user_selection?.data?.attributes
            ?.states[0] ?? this.state.profileData.data.attributes.state,
        );
        this.state.profileData.data.attributes?.user_selection?.data?.attributes
          ?.states.length === 2 &&
          (await setStorageData(
            'alternate_state',
            this.state.profileData.data.attributes?.user_selection?.data?.attributes
              ?.states[1],
          ));
        this.props.navigation.navigate('CategoriesSubCategories', {
          fromProfile: true,
        });
        return;
      } catch (_) {
        // Fall through to message-based navigation
      }
    }
    const categoryNavMsg: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    categoryNavMsg.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    categoryNavMsg.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'CategoriesSubCategories',
    );
    await setStorageData('categoriesEditMode', isEdit);
    await setStorageData('navigateBack', 'true');
    await setStorageData(
      'categoriesData',
      JSON.stringify(
        this.state.profileData.data.attributes?.user_selection?.data?.attributes
          ?.user_categories,
      ),
    );
    await setStorageData(
      'artistsList',
      JSON.stringify(
        this.state.profileData.data.attributes?.user_selection?.data?.attributes
          ?.band_artists,
      ),
    );
    await setStorageData(
      'user_state',
      this.state.profileData.data.attributes?.user_selection?.data?.attributes
        ?.states[0] ?? this.state.profileData.data.attributes.state,
    );
    this.state.profileData.data.attributes?.user_selection?.data?.attributes
      ?.states.length === 2 &&
      (await setStorageData(
        'alternate_state',
        this.state.profileData.data.attributes?.user_selection?.data?.attributes
          ?.states[1],
      ));

    this.send(categoryNavMsg);
  };

  handleToggleExpandSubcat = () => {
    this.setState({ expandSubcat: !this.state.expandSubcat });
  };

  isMyProfile = () => {
    if (this.state?.userID === this.state.profileData?.data?.id) {
      return true;
    } else {
      return false;
    }
  };

  getLikedEventsLabel = () => {
    if (this.state.expandedLikedEvents) {
      return 'See less';
    } else {
      return 'See more';
    }
  };

  toggleLikedEventsExpand = () => {
    this.setState({ expandedLikedEvents: !this.state.expandedLikedEvents });
  };

  likedEventsData = () => {
    if (this.getLikedEventLength() === 0) {
      return [];
    }

    const list = this.state.profileData.data?.attributes?.liked_events;
    if (this.state.expandedLikedEvents) {
      return list;
    }

    return list.slice(0, 1);
  };

  getDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      monthIndex: date.getMonth(),
      dayOfWeekIndex: date.getDay(),
      year: date.getFullYear(),
    };
  };

  getFormattedMonth = (dateString: string) => {
    const { monthIndex } = this.getDateParts(dateString);
    return monthsShort[monthIndex];
  };

  getFormattedDate = (dateString: string) => {
    const { day } = this.getDateParts(dateString);
    return day;
  };

  getFormattedFullMonth = (dateString: string) => {
    const { monthIndex } = this.getDateParts(dateString);
    return monthsFull[monthIndex];
  };

  getFullDate = (dateString: string) => {
    const { dayOfWeekIndex, day, monthIndex, year } =
      this.getDateParts(dateString);
    const dayName = daysOfWeek[dayOfWeekIndex];
    const month = monthsShort[monthIndex];
    return `${dayName}, ${day} ${month}, ${year}`;
  };

  handleLikeNav = (item: any) => {
    const info = {
      eventID: item.id,
      type: 'show',
    };

    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Likeapost2');

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  handleCountryClick = () => {
    this.setState({ countryClicked: true });
  };

  getCountryList = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCountriesListAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.countriesList,
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

  onCountrySelect = (country: string) => {
    const selectedCountryObj = this.state.countriesList.find(
      item => item.country_code === country || item.country_name === country,
    );
    const selectedCountryCode = selectedCountryObj
      ? selectedCountryObj.country_code
      : '';

    if (
      this.state.otherCountrySelected === false &&
      selectedCountryCode !== 'US'
    ) {
      this.setState({ otherCountrySelected: true, modalVisible: true });
    }

    if (this.state.countryCodesList.length !== 0) {
      const filteredCountry = this.state.countryCodesList.find(
        country => country.id === selectedCountryCode,
      );
      this.setState({ selectedCountryCode: filteredCountry });
    }

    this.setState(
      {
        selectedCountry: country,
        states: [],
        selectedState: '',
        cities: [],
        selectedCity: '',
        countryChanged: true,
        isCountryModified: true,
      },
      () => {
        if (selectedCountryCode === 'US')
          this.getStateList(selectedCountryCode);
      },
    );
  };

  handleSelectedCountryiOS = (selectedCountry: string) => {
    this.setState({ countryClicked: false });
    this.onCountrySelect(selectedCountry);
  };

  handleCountryCodeListAPI = () => {
    const header = {
      'Content-Type': configJSON.validationApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCountryCodeListID = requestMessage.messageId;

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

  handleShowCountryCode = () => {
    this.setState({ countryCodeClicked: true });
  };

  handleCountryCodeValueiOS = (selectedCountryCode: any) => {
    this.setState({ countryCodeClicked: false, selectedCountryCode });
  };

  handleCountrycodeValueAndroid = (selectedCountryCode: any) => {
    this.setState({ countryCodeClickedAndroid: false, selectedCountryCode });
  };

  openGoogleMaps = (data: any) => {
    const location = `${data.address} ${data?.city} ${data?.state} ${data?.zip_code}`;
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

  hideModalCountry = () => {
    this.setState({ countryClicked: false });
  };

  hideModalState = () => {
    this.setState({ stateClicked: false });
  };

  hideModalCity = () => {
    this.setState({ cityClicked: false });
  };

  hideModalPicker = () => {
    this.setState({ showPickerModal: false });
  };

  hideModalCategory = () => {
    this.setState({ categoryPickerModal: false });
  };

  hideModalSubCategory = () => {
    this.setState({ subCategoryPickerModal: false });
  };

  hideCountryCodeModal = () => {
    this.setState({ countryCodeClicked: false });
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

  likeComments = async (comment_id: string) => {
    const token = await getStorageData('authToken');
    const likeCommentRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createCommentAPICallID = likeCommentRequestMsg.messageId;

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
        token: token,
      }),
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postCommentMethodType,
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(likeCommentRequestMsg.id, likeCommentRequestMsg);
  };

  closeTnCModalPopup = () => {
    this.setState({ showTncPopup: false });
  };

  handleTnCUpdateCheckOutModal = async () => {
    this.closeTnCModalPopup();
    const TncNavmessage: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    TncNavmessage.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    TncNavmessage.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'TermsConditions',
    );
    const tAndCAcceptanceStatus = await getStorageData('tAndCAcceptance');
    const Datainfo = {
      isTermsAndConditionsAccepted: tAndCAcceptanceStatus,
    };
    const raiseTncNavmessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseTncNavmessage.addData(
      getName(MessageEnum.NavigationTermAndConditionMessage),
      Datainfo,
    );
    TncNavmessage.addData(
      getName(MessageEnum.NavigationRaiseMessage),
      raiseTncNavmessage,
    );
    this.send(TncNavmessage);
  };

  getCalendarEventsLabel = () => {
    if (this.state.expandedCalendarEvents) {
      return 'See less';
    } else {
      return 'See more';
    }
  };

  toggleCalendarEventsExpand = () => {
    this.setState({
      expandedCalendarEvents: !this.state.expandedCalendarEvents,
    });
  };

  calendarEventsData = () => {
    if (this.getCalendarEventsLength() === 0) {
      return [];
    }

    const list = this.state.profileData.data?.attributes?.calendar_shows;

    if (this.state.expandedCalendarEvents) {
      return list;
    }

    return list.slice(0, 1);
  };

  /** Half-hour labels from 12:00 AM through 11:30 PM (full 24-hour day). */
  buildFullDayHalfHourSlots(): string[] {
    const timeSlots: string[] = [];
    let current = new Date(`1970-01-01T00:00:00`);
    const end = new Date(`1970-01-01T23:30:00`);

    while (current <= end) {
      let hours = current.getHours();
      let minutes = current.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');

      timeSlots.push(`${hours}:${formattedMinutes} ${ampm}`);
      current.setMinutes(current.getMinutes() + 30);
    }

    return timeSlots;
  }

  generateOpenTimeSlots() {
    const timeSlots = this.buildFullDayHalfHourSlots();
    this.setState({ openTimeSlots: timeSlots, closeTimeSlots: timeSlots });
  }

  convertTo24Hour(time: string) {
    let [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  /**
   * Parse API open_time/close_time (e.g. "2000-01-01T05:30:00.000+00:00") to display format "5:30 AM".
   */
  parseISOTimeToDisplay(isoTime: string | null | undefined): string {
    if (!isoTime || typeof isoTime !== 'string' || isoTime.trim() === '')
      return '';
    const match = isoTime.trim().match(/T(\d{1,2}):(\d{2})/);
    if (!match) return '';
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    if (isNaN(hours) || hours < 0 || hours > 23) return '';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  /**
   * Map full lowercase day names from API to abbreviated form used in UI (e.g. monday -> Mon).
   */
  mapBusinessDaysToAbbreviated(days: string[] | null | undefined): string[] {
    if (!days || !Array.isArray(days) || days.length === 0) return [];
    const fullToAbbr: Record<string, string> = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    };
    return days
      .map((d: string) => fullToAbbr[(d || '').toLowerCase()])
      .filter(Boolean);
  }

  showOpenCloseSameTimeMessage = () => {
    const msg = 'Open and close times cannot be the same.';
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('', msg);
    }
  };

  handleOpenAtSelection = (time: string) => {
    if (
      time !== '' &&
      this.state.closeAt !== '' &&
      time.trim() === this.state.closeAt.trim()
    ) {
      this.showOpenCloseSameTimeMessage();
      return;
    }
    this.setState({ openAt: time, openAtPickerModal: false });
  };

  handleCloseAtSelection = (time: string) => {
    if (
      time !== '' &&
      this.state.openAt !== '' &&
      time.trim() === this.state.openAt.trim()
    ) {
      this.showOpenCloseSameTimeMessage();
      return;
    }
    this.setState({ closeAt: time, closeAtPickerModal: false });
  };

  handleBusinessDayToggle = (day: string) => {
    const { selectedBusinessDays } = this.state;
    if (selectedBusinessDays.includes(day)) {
      this.setState({
        selectedBusinessDays: selectedBusinessDays.filter(d => d !== day),
      });
    } else {
      this.setState({
        selectedBusinessDays: [...selectedBusinessDays, day],
      });
    }
  };

  getRulesAndRegulations = async () => {
    console.log('🔵 getRulesAndRegulations called');
    console.log('🔵 this.authToken exists?', !!this.authToken);
    
    // Try to get authToken from storage if not set
    if (!this.authToken) {
      console.log('⚠️ this.authToken not set, trying to get from storage...');
      const token = await getStorageData('authToken');
      if (token) {
        this.authToken = token;
        console.log('✅ Got authToken from storage');
      } else {
        console.log('❌ No authToken found in storage, cannot fetch rules');
        return;
      }
    }

    const header = {
      'Content-Type': configJSON.categoryApiContentType,
      token: this.authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getRulesAndRegulationsApiCallId = requestMessage.messageId;
    console.log('🔵 Rules API Call ID:', this.getRulesAndRegulationsApiCallId);
    console.log('🔵 Rules API Endpoint:', configJSON.rulesAndRegulationsEndpoint);

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.rulesAndRegulationsEndpoint,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.methodTypeApiGetUserProfile,
    );

    console.log('🔵 Sending rules API request...');
    runEngine.sendMessage(requestMessage.id, requestMessage);
    console.log('🔵 Rules API request sent');
  };

  loadSavedRulesTexts = async () => {
    // Helper function to load saved texts and match with rules
    if (!this.state.rulesAndRegulations || this.state.rulesAndRegulations.length === 0) {
      console.log('⚠️ Rules not loaded yet, cannot match saved texts');
      return;
    }

    const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
    const customRulesStr = await getStorageData('customRules');
    console.log('🔍 ========== LOADING SAVED RULES TEXTS ==========');
    console.log('🔍 Saved texts string from AsyncStorage:', savedRulesTextsStr);
    console.log('🔍 Custom rules string from AsyncStorage:', customRulesStr);
    console.log('🔍 Available rules count:', this.state.rulesAndRegulations.length);
    console.log('🔍 First rule structure:', JSON.stringify(this.state.rulesAndRegulations[0], null, 2));
    
    // Load custom rules if available
    let savedCustomRules: string[] = [];
    if (customRulesStr) {
      try {
        savedCustomRules = JSON.parse(customRulesStr);
        console.log('✅ Loaded custom rules:', savedCustomRules);
      } catch (error) {
        console.error('❌ Error parsing custom rules:', error);
      }
    }
    
    if (savedRulesTextsStr) {
      try {
        const savedRulesTexts = JSON.parse(savedRulesTextsStr);
        console.log(
          '🔄 Parsed saved rules texts:',
          savedRulesTexts,
        );
        console.log('🔍 Saved texts count:', savedRulesTexts.length);
        console.log('🔍 Available rule titles:', this.state.rulesAndRegulations.map((r: any) => {
          // Handle both direct title and attributes.title
          return r.title || r.attributes?.title || 'NO TITLE';
        }));
        
        // Match the texts with rules to get IDs for display (case-insensitive matching)
        // Handle both rule.title and rule.attributes.title structures
        const matchedIds: number[] = [];
        const matchedTexts: string[] = [];
        
        this.state.rulesAndRegulations.forEach((rule: any) => {
          // Get title from either rule.title or rule.attributes.title
          const ruleTitle = (rule.title || rule.attributes?.title || '').trim();
          const ruleId = rule.id || rule.attributes?.id;
          
          if (!ruleTitle) {
            console.log('⚠️ Rule has no title:', rule);
            return;
          }
          
          if (!ruleId) {
            console.log('⚠️ Rule has no ID:', rule);
            return;
          }
          
          const isMatch = savedRulesTexts.some((savedText: string) => {
            const savedTextTrimmed = (savedText || '').trim();
            const exactMatch = savedTextTrimmed === ruleTitle;
            const caseInsensitiveMatch = savedTextTrimmed?.toLowerCase() === ruleTitle?.toLowerCase();
            const matches = exactMatch || caseInsensitiveMatch;
            
            if (matches) {
              console.log(`✅ Matched: "${savedTextTrimmed}" with rule "${ruleTitle}" (ID: ${ruleId})`);
              matchedTexts.push(savedTextTrimmed);
            }
            return matches;
          });
          
          if (isMatch && !matchedIds.includes(ruleId)) {
            matchedIds.push(ruleId);
          }
        });
        
        // Find custom rules: combine saved custom rules with unmatched texts from selectedRulesAndRegulationsTexts
        const unmatchedTexts = savedRulesTexts.filter((savedText: string) => {
          const savedTextTrimmed = (savedText || '').trim();
          return !matchedTexts.some((matchedText: string) => {
            const matchedTextTrimmed = (matchedText || '').trim();
            return savedTextTrimmed === matchedTextTrimmed || 
                   savedTextTrimmed.toLowerCase() === matchedTextTrimmed.toLowerCase();
          });
        });
        
        // Combine saved custom rules with unmatched texts, removing duplicates
        const allCustomRulesSet = new Set<string>();
        savedCustomRules.forEach((text: string) => allCustomRulesSet.add(text.trim()));
        unmatchedTexts.forEach((text: string) => allCustomRulesSet.add(text.trim()));
        const customRules: string[] = Array.from(allCustomRulesSet);
        
        console.log('🔄 Matched IDs from saved texts:', matchedIds);
        console.log('🔄 Custom rules found:', customRules);
        console.log('🔄 Current selectedRulesAndRegulationsIds before update:', this.state.selectedRulesAndRegulationsIds);
        
        // Add custom rules to the rulesAndRegulations array with unique IDs
        const existingRules = [...this.state.rulesAndRegulations];
        const customRulesWithIds: any[] = [];
        let customRuleIdCounter = 10000; // Start from high number to avoid conflicts
        
        customRules.forEach((customText: string) => {
          // Check if this custom rule is already in the rules array
          const alreadyExists = existingRules.some((rule: any) => {
            const ruleTitle = (rule.title || rule.attributes?.title || '').trim();
            const customTextTrimmed = customText.trim();
            return ruleTitle === customTextTrimmed || 
                   ruleTitle.toLowerCase() === customTextTrimmed.toLowerCase();
          });
          
          if (!alreadyExists) {
            customRulesWithIds.push({
              id: customRuleIdCounter++,
              title: customText.trim(),
              isCustom: true
            });
            // Add to matchedIds so it shows as selected
            matchedIds.push(customRuleIdCounter - 1);
            console.log(`✅ Added custom rule: "${customText.trim()}" with ID: ${customRuleIdCounter - 1}`);
          }
        });
        
        console.log('🔄 Setting selectedRulesAndRegulationsIds to:', matchedIds);
        console.log('🔄 Adding custom rules to display:', customRulesWithIds.length);
        console.log('🔍 ===========================================');
        
        // Update state with matched IDs and add custom rules to the rules array
        if (matchedIds.length > 0 || customRulesWithIds.length > 0) {
          this.setState({ 
            rulesAndRegulations: [...existingRules, ...customRulesWithIds],
            selectedRulesAndRegulationsIds: matchedIds,
            customRules: customRules // Also update customRules state
          }, () => {
            console.log('✅ State updated. New selectedRulesAndRegulationsIds:', this.state.selectedRulesAndRegulationsIds);
            console.log('✅ Total rules count (API + Custom):', this.state.rulesAndRegulations.length);
            console.log('✅ Custom rules in state:', this.state.customRules);
          });
        } else {
          console.log('⚠️ No matches found between saved texts and available rules');
        }
      } catch (error) {
        console.error('❌ Error parsing saved rules texts:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
      }
    } else {
      console.log('⚠️ No saved rules texts found in AsyncStorage');
    }
  };

  handleGetRulesAndRegulationsResponse = async (responseJson: any) => {
    console.log('📥 ========== handleGetRulesAndRegulationsResponse ==========');
    console.log('📥 Full Response:', JSON.stringify(responseJson, null, 2));
    console.log('📥 Response.data exists?', !!responseJson.data);
    console.log('📥 Response.errors exists?', !!responseJson.errors);
    console.log('📥 Response.data type:', Array.isArray(responseJson.data) ? 'Array' : typeof responseJson.data);
    
    // Check if response contains HTML error (502 Bad Gateway, etc.) or has rawResponse
    if ((responseJson.rawResponse && responseJson.rawResponse.includes('<html>')) || 
        (!responseJson.data && responseJson.rawResponse)) {
      console.log('❌ Server error (502 Bad Gateway or similar) - API endpoint may be down');
      console.log('⚠️ Will try to load saved texts anyway and show them');
      
      // Even if API fails, try to load saved texts and create a simple rules list from them
      const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
      console.log('🔍 Checking for saved texts after API error:', savedRulesTextsStr);
      
      if (savedRulesTextsStr) {
        try {
          const savedRulesTexts = JSON.parse(savedRulesTextsStr);
          console.log('✅ Found saved rules texts, creating display list:', savedRulesTexts);
          
          if (savedRulesTexts && savedRulesTexts.length > 0) {
            // Create a simple rules array from saved texts for display
            const displayRules = savedRulesTexts.map((text: string, index: number) => ({
              id: index + 1000, // Temporary IDs
              title: text,
            }));
            
            const displayIds = displayRules.map((r: any) => r.id);
            
            console.log('✅ Creating display rules from saved texts');
            console.log('✅ Display rules:', displayRules);
            console.log('✅ Display IDs:', displayIds);
            
            this.setState({
              rulesAndRegulations: displayRules,
              selectedRulesAndRegulationsIds: displayIds,
            }, () => {
              console.log('✅ State updated with fallback rules');
              console.log('✅ Rules count in state:', this.state.rulesAndRegulations.length);
              console.log('✅ Selected IDs in state:', this.state.selectedRulesAndRegulationsIds);
            });
          } else {
            console.log('⚠️ Saved texts array is empty');
          }
        } catch (error) {
          console.error('❌ Error parsing saved texts:', error);
        }
      } else {
        console.log('⚠️ No saved texts found in AsyncStorage');
      }
      return;
    }
    
    if (responseJson.data && !responseJson.errors) {
      const rulesData = Array.isArray(responseJson.data) ? responseJson.data : [];
      console.log('✅ Rules data received, count:', rulesData.length);
      console.log('✅ First rule structure:', rulesData.length > 0 ? JSON.stringify(rulesData[0], null, 2) : 'No rules');
      
      this.setState({
        rulesAndRegulations: rulesData,
      }, async () => {
        console.log('✅ Rules set in state. State rules count:', this.state.rulesAndRegulations.length);
        console.log('✅ Now loading saved texts...');
        // After rules are loaded, load saved texts and custom rules
        await this.loadSavedRulesTexts();
        
        // If we have selectedRulesAndRegulationsIds from API but no saved texts matched,
        // try to match the IDs directly with the rules list and save the texts
        if (
          this.state.selectedRulesAndRegulationsIds &&
          this.state.selectedRulesAndRegulationsIds.length > 0 &&
          this.state.rulesAndRegulations.length > 0
        ) {
          const matchedTexts: string[] = [];
          this.state.rulesAndRegulations.forEach((rule: any) => {
            const ruleId = rule.id || rule.attributes?.id;
            const ruleTitle = rule.title || rule.attributes?.title || '';
            if (
              ruleId &&
              ruleTitle &&
              this.state.selectedRulesAndRegulationsIds.indexOf(ruleId) !== -1 &&
              !matchedTexts.includes(ruleTitle)
            ) {
              matchedTexts.push(ruleTitle);
            }
          });
          
          // If we found matched texts, save them to AsyncStorage
          if (matchedTexts.length > 0) {
            const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
            let existingTexts: string[] = [];
            if (savedRulesTextsStr) {
              try {
                existingTexts = JSON.parse(savedRulesTextsStr);
              } catch (error) {
                console.error('Error parsing existing saved texts:', error);
              }
            }
            
            // Merge matched texts with existing texts (avoid duplicates)
            const allTexts = [...new Set([...existingTexts, ...matchedTexts])];
            await setStorageData('selectedRulesAndRegulationsTexts', JSON.stringify(allTexts));
            console.log('✅ Matched IDs with rules and saved texts to AsyncStorage:', allTexts);
            
            // Update selectedRulesAndRegulationsIds to ensure they match
            const matchedIds: number[] = [];
            this.state.rulesAndRegulations.forEach((rule: any) => {
              const ruleId = rule.id || rule.attributes?.id;
              const ruleTitle = rule.title || rule.attributes?.title || '';
              if (ruleId && allTexts.includes(ruleTitle)) {
                matchedIds.push(ruleId);
              }
            });
            
            if (matchedIds.length > 0) {
              this.setState({ selectedRulesAndRegulationsIds: matchedIds });
              console.log('✅ Updated selectedRulesAndRegulationsIds from matched texts:', matchedIds);
            }
          }
        }
        
        // Also load customRules from storage
        const customRulesStr = await getStorageData('customRules');
        if (customRulesStr) {
          try {
            const savedCustomRules = JSON.parse(customRulesStr);
            this.setState({ customRules: savedCustomRules });
            console.log('✅ Loaded custom rules into state:', savedCustomRules);
          } catch (error) {
            console.error('❌ Error parsing custom rules:', error);
          }
        }
      });
    } else {
      console.log('❌ Error or no data in response');
      console.log('❌ Errors:', responseJson.errors);
      console.log('❌ Data:', responseJson.data);
      
      // Even on error, try to load saved texts if available
      const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
      if (savedRulesTextsStr) {
        try {
          const savedRulesTexts = JSON.parse(savedRulesTextsStr);
          console.log('⚠️ API failed but found saved texts, creating display list');
          
          // Create a simple rules array from saved texts for display
          const displayRules = savedRulesTexts.map((text: string, index: number) => ({
            id: index + 1000,
            title: text,
          }));
          
          this.setState({
            rulesAndRegulations: displayRules,
            selectedRulesAndRegulationsIds: displayRules.map((r: any) => r.id),
          });
        } catch (error) {
          console.error('❌ Error parsing saved texts:', error);
        }
      }
    }
    console.log('📥 ========================================================');
  };

  handleAddCustomRule = () => {
    const customRuleText = this.state.customRuleTxt.trim();
    if (customRuleText !== "") {
      // Check if this custom rule has already been added
      const currentCustomRules = this.state.customRules || [];
      if (!currentCustomRules.includes(customRuleText)) {
        // Add to custom rules list and automatically select it
        const updatedCustomRules = [...currentCustomRules, customRuleText];
        const currentSelectedIds = this.state.selectedRulesAndRegulationsIds || [];
        const currentRules = this.state.rulesAndRegulations || [];
        
        // Find the highest ID to create a unique ID for the custom rule
        let maxId = 10000;
        currentRules.forEach((rule: any) => {
          const ruleId = rule.id || rule.attributes?.id;
          if (ruleId && typeof ruleId === 'number' && ruleId > maxId) {
            maxId = ruleId;
          }
        });
        const newCustomRuleId = maxId + 1;
        
        // Add custom rule to rulesAndRegulations array
        const customRuleWithId = {
          id: newCustomRuleId,
          title: customRuleText,
          isCustom: true
        };
        
        // Add to selected IDs so it shows as checked
        const updatedSelectedIds = [...currentSelectedIds, newCustomRuleId];
        
        this.setState({
          customRules: updatedCustomRules,
          rulesAndRegulations: [...currentRules, customRuleWithId],
          selectedRulesAndRegulationsIds: updatedSelectedIds,
          customRuleTxt: ""
        }, async () => {
          console.log("✅ Custom rule added:", customRuleText);
          console.log("✅ All custom rules:", this.state.customRules);
          console.log("✅ Total rules count:", this.state.rulesAndRegulations.length);
          
          // Save custom rules to AsyncStorage
          await setStorageData(
            "customRules",
            JSON.stringify(this.state.customRules)
          );
          
          // Also update selectedRulesAndRegulationsTexts if it exists in state
          // Note: selectedRulesAndRegulationsTexts might not be in state, so we'll load it from storage
          const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
          let currentSelectedTexts: string[] = [];
          if (savedRulesTextsStr) {
            try {
              currentSelectedTexts = JSON.parse(savedRulesTextsStr);
            } catch (error) {
              console.error('Error parsing saved rules texts:', error);
            }
          }
          
          if (!currentSelectedTexts.includes(customRuleText)) {
            const updatedSelectedTexts = [...currentSelectedTexts, customRuleText];
            await setStorageData(
              "selectedRulesAndRegulationsTexts",
              JSON.stringify(updatedSelectedTexts)
            );
            console.log("✅ Updated selectedRulesAndRegulationsTexts in storage");
          }
        });
      } else {
        // Rule already exists, just clear the input
        this.setState({ customRuleTxt: "" });
        console.log("⚠️ Custom rule already exists:", customRuleText);
      }
    }
  }

  handleToggleRuleSelection = async (ruleId: number) => {
    const currentSelected = this.state.selectedRulesAndRegulationsIds;
    const index = currentSelected.indexOf(ruleId);
    let updatedSelectedIds: number[];
    
    if (index !== -1) {
      updatedSelectedIds = currentSelected.filter(id => id !== ruleId);
    } else {
      updatedSelectedIds = [...currentSelected, ruleId];
    }
    
    this.setState({
      selectedRulesAndRegulationsIds: updatedSelectedIds,
    }, async () => {
      // Save the selected rules texts to AsyncStorage whenever a rule is toggled
      const selectedRulesTexts: string[] = [];
      
      // Get texts from API rules based on selected IDs
      if (
        updatedSelectedIds.length > 0 &&
        this.state.rulesAndRegulations &&
        this.state.rulesAndRegulations.length > 0
      ) {
        this.state.rulesAndRegulations.forEach((rule: any) => {
          const ruleId = rule.id || rule.attributes?.id;
          if (updatedSelectedIds.indexOf(ruleId) !== -1) {
            const ruleTitle = rule.title || rule.attributes?.title || '';
            if (ruleTitle && !selectedRulesTexts.includes(ruleTitle)) {
              selectedRulesTexts.push(ruleTitle);
            }
          }
        });
      }
      
      // Also include custom rules that are selected
      if (this.state.customRules && this.state.customRules.length > 0) {
        // Get selected custom rules from saved texts
        const savedRulesTextsStr = await getStorageData('selectedRulesAndRegulationsTexts');
        if (savedRulesTextsStr) {
          try {
            const savedTexts = JSON.parse(savedRulesTextsStr);
            savedTexts.forEach((text: string) => {
              // Add custom rules that don't match API rules
              const isApiRule = this.state.rulesAndRegulations?.some((rule: any) => {
                const ruleTitle = (rule.title || rule.attributes?.title || '').trim();
                return ruleTitle === text.trim() || ruleTitle.toLowerCase() === text.trim().toLowerCase();
              });
              if (!isApiRule && !selectedRulesTexts.includes(text)) {
                selectedRulesTexts.push(text);
              }
            });
          } catch (error) {
            console.error('Error parsing saved texts:', error);
          }
        }
      }
      
      // Save to AsyncStorage
      await setStorageData(
        'selectedRulesAndRegulationsTexts',
        JSON.stringify(selectedRulesTexts)
      );
      console.log('✅ Saved selected rules texts to AsyncStorage after toggle:', selectedRulesTexts);
    });
  };

  handleAddRosterItem = async () => {
    if (this.state.rosterTxt.trim() !== '') {
      if (!this.state.roster.includes(this.state.rosterTxt.trim())) {
        const updatedRoster = [...this.state.roster, this.state.rosterTxt.trim()];
        this.setState({
          roster: updatedRoster,
          rosterTxt: '',
        }, async () => {
          // Save to AsyncStorage
          await setStorageData('savedRosters', JSON.stringify(updatedRoster));
          console.log('✅ Saved rosters to AsyncStorage:', updatedRoster);
        });
      } else {
        this.setState({ rosterTxt: '' });
      }
    }
  };

  handleRemoveRosterItem = async (itemToRemove: string) => {
    const updatedRoster = this.state.roster.filter(
      (item: string) => item !== itemToRemove,
    );
    this.setState({ roster: updatedRoster }, async () => {
      // Save to AsyncStorage
      await setStorageData('savedRosters', JSON.stringify(updatedRoster));
      console.log('✅ Saved rosters to AsyncStorage after removal:', updatedRoster);
    });
  };

  handleUpdateRulesAndRegulationsResponse = (responseJson: any) => {
    if (responseJson.errors) {
      console.log('Error updating rules and regulations:', responseJson.errors);
      this.parseApiErrorResponse(responseJson);
    } else {
      console.log('Rules and regulations updated successfully');
    }
  };

  handleUpdateRostersResponse = (responseJson: any) => {
    if (responseJson.errors) {
      console.log('Error updating rosters:', responseJson.errors);
      this.parseApiErrorResponse(responseJson);
    } else {
      console.log('Rosters updated successfully');
    }
  };

  shouldHideRulesAndRegulationsTab = (): boolean => {
    // Account types that should show Rules and Regulations tab
    const rulesAccountTypes = [
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
    
    // Account types that should show Roster tab (hidden from Rules tab)
    const hiddenAccountTypes = [
      'Record Label',
      'Record_Label',
      'Promoter',
      'Booking_Agent',
      'Agency',
    ];
    
    // If account type is in the rules list, show Rules tab (return false)
    if (rulesAccountTypes.includes(this.state.accountType)) {
      return false;
    }
    
    // If account type is in the hidden list, show Roster tab (return true)
    if (hiddenAccountTypes.includes(this.state.accountType)) {
      return true;
    }
    
    // If userRole is venue but accountType is not in rules list, show Roster tab
    if (this.state.userRole === 'venue') {
      console.log("🔍 Venue user with account type not in rules list - showing Roster tab");
      return true;
    }
    
    return false;
  };

  handleRulesRegulationsSelection = (rulesRegulations: string) => {
    this.setState({ rulesRegulations });
  };
}
