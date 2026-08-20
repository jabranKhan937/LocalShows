import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { getStorageData, isEmpty, removeStorageData, setStorageData } from "../../../framework/src/Utilities";
import { StackActions } from '@react-navigation/native';
import { DeviceEventEmitter } from "react-native";
import {
  lightTheme,
  redesignTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
} from "../../utilities/src/Colors";

// Customizable Area End

export const configJSON = require("./config");

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
  isPrivateAccount: boolean;
  isPushNotificationEnabled: boolean;
  // Customizable Area Start
  isLoading: boolean;
  authToken: string;
  currentPassword: string;
  currentPasswordError: string;
  newPassword: string;
  newPasswordError: string;
  confirmNewPassword: string;
  confirmNewPasswordError: string;
  isDeleteAccountConfirmationModal: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmNewPassword: boolean;
  currentUserRole: string;
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class Settings2Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getIsPrivateAccountAPICallID: any;
  putIsPrivateAccountAPICallID: any;
  putDeleteAccountAPICallID: any;
  updatePasswordAPICallID: any;
  updateProfilePatchAPICallID: any
  profileThemeListener: { remove: () => void } | null = null;
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
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      isPrivateAccount: true,
      isPushNotificationEnabled: true,
      isLoading: true,
      authToken: "",
      currentPassword: "",
      currentPasswordError: "",
      newPassword: "",
      newPasswordError: "",
      confirmNewPassword: "",
      confirmNewPasswordError: "",
      isDeleteAccountConfirmationModal: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmNewPassword: false,
      currentUserRole: "fan",
      isDarkMode: true,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        "Change Value",
        "From: " + this.state.txtSavedValue + " To: " + value
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
    if (message.id === getName(MessageEnum.RestAPIResponceMessage)) {
      this.handleRestAPIResponseMessage(message)
    }
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
    autoCompleteType: "email",
    keyboardType: "email-address",
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
      this.state.txtInputValue
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
  async componentDidMount() {
    this.getAuthToken();
    this.loadSettingsTheme();
  }

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  loadSettingsTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== "false" });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  getSettingsTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  getAuthToken = async () => {
    const authToken = await getStorageData('authToken');
    const pushNotification = await getStorageData('user_push_notification');
    this.setState({ authToken, isPushNotificationEnabled: pushNotification }, async () => {
      const userRole = await getStorageData('userRole');
      if (userRole === 'fan')
        this.getPrivateAccountAPI()
      else
        this.setState({ currentUserRole: userRole,isLoading:false })

    })
  }

  handleRestAPIResponseMessage = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );
    if (apiRequestCallId === this.getIsPrivateAccountAPICallID) {
      this.handleIsPrivateAccountApiResponse(message);
    } else if (apiRequestCallId === this.putIsPrivateAccountAPICallID) {
      this.handleMakePrivateAccountApiResponse(message);
    } else if (apiRequestCallId === this.putDeleteAccountAPICallID) {
      this.handleDeleteAccountApiResponse(message);
    } else if (apiRequestCallId === this.updatePasswordAPICallID) {
      this.handleUpdatePasswordApiResponse(message)
    } else if (apiRequestCallId === this.updateProfilePatchAPICallID) {
      this.handleUpdateProfileApiResponse(message)
    }
  }

  handleUpdateProfileApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    this.setState({ isLoading: false })

    if (responseJson != null && !responseJson.errors) {
      this.setState({ isPushNotificationEnabled: responseJson.data.attributes.push_notification })
      setStorageData("user_push_notification", responseJson.data.attributes.push_notification.toString());
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }


  handleUpdatePasswordApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      this.setState({ isLoading: false, }, () => {
        this.props.navigation.goBack()
      });
    } else {
      this.parseApiErrorResponse(responseJson);
      this.setState({ isLoading: false })
    }
  }

  handleIsPrivateAccountApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      this.setState({ isLoading: false, isPrivateAccount: responseJson.private });
    } else {
      this.parseApiErrorResponse(responseJson);
      this.setState({ isLoading: false })
    }
  }

  handleMakePrivateAccountApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      this.setState({ isLoading: false, isPrivateAccount: !this.state.isPrivateAccount });
    } else {
      this.parseApiErrorResponse(responseJson);
      this.setState({ isLoading: false })
    }
  }

  handleDeleteAccountApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      this.logoutUser()
    } else {
      this.parseApiErrorResponse(responseJson);
      this.setState({ isLoading: false })
    }
  }

  logoutUser = async () => {
    console.log('🧹 Settings logoutUser - Clearing all cache and AsyncStorage data');
    
    // Clear all user-related data using the helper function
    const { clearAllUserData } = require('../../../framework/src/Utilities');
    await clearAllUserData();
    
    this.props.navigation.navigate('EmailAccountLoginBlock')
    const authMessage = new Message(getName(MessageEnum.EditProfileUpdateMessage));
    runEngine.sendMessage(authMessage.id, authMessage);
  }

  getPrivateAccountAPI = () => {
    this.setState({ isLoading: true })
    const getIsPrivateAccountMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getIsPrivateAccountAPICallID = getIsPrivateAccountMsg.messageId;

    getIsPrivateAccountMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.isPrivateEndPoint
    );

    getIsPrivateAccountMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
        token: this.state.authToken,
      })
    );

    getIsPrivateAccountMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(getIsPrivateAccountMsg.id, getIsPrivateAccountMsg);
  }

  putPrivateAccountAPI = () => {
    const putIsPrivateAccountMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.putIsPrivateAccountAPICallID = putIsPrivateAccountMsg.messageId;

    putIsPrivateAccountMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.makePrivateEndPoint}${!this.state.isPrivateAccount}`
    );

    putIsPrivateAccountMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
        token: this.state.authToken,
      })
    );

    putIsPrivateAccountMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.putAPIMethodType
    );

    runEngine.sendMessage(putIsPrivateAccountMsg.id, putIsPrivateAccountMsg);
  }

  deleteAccountAPI = () => {
    const deleteAccountMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.putDeleteAccountAPICallID = deleteAccountMsg.messageId;

    deleteAccountMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.deleteAccountEndPoint
    );

    deleteAccountMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
        token: this.state.authToken,
      })
    );

    deleteAccountMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.putAPIMethodType
    );

    runEngine.sendMessage(deleteAccountMsg.id, deleteAccountMsg);
  }

  updatePasswordAPI = () => {
    if (this.checkValidations()) {
      const data = {
        data: {
          attributes: {
            old_password: this.state.currentPassword,
            new_password: this.state.newPassword,
            confirm_password: this.state.confirmNewPassword,
          }
        }
      }
      const updatePasswordMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

      this.updatePasswordAPICallID = updatePasswordMsg.messageId;

      updatePasswordMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.updatePasswordEndPoint
      );

      updatePasswordMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify({
          "Content-Type": configJSON.validationApiContentType,
          token: this.state.authToken,
        })
      );

      updatePasswordMsg.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(data)
      );

      updatePasswordMsg.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.exampleAPiMethod
      );

      runEngine.sendMessage(updatePasswordMsg.id, updatePasswordMsg);
    }
  }

  checkValidations = () => {
    this.setState({ currentPassword: this.state.currentPassword.trim(), newPassword: this.state.newPassword.trim(), confirmNewPassword: this.state.confirmNewPassword.trim(), })
    let error = false;

    this.setState({
      currentPasswordError: "",
      newPasswordError: "",
      confirmNewPasswordError: "",
    });

    if (isEmpty(this.state.currentPassword)) {
      this.setState({ currentPasswordError: configJSON.errorCurrentPasswordCannotBeBlank })
      error = true;
    }

    if (isEmpty(this.state.newPassword)) {
      this.setState({ newPasswordError: configJSON.errorNewPasswordCannotBeBlank })
      error = true;
    } else {
      const errorStr = this.analyzeNewPassword(this.state.newPassword.trim());
      if (errorStr) {
        this.setState({ newPasswordError: errorStr });
        error = true;
      }
    }

    if (isEmpty(this.state.confirmNewPassword)) {
      this.setState({ confirmNewPasswordError: configJSON.errorConfirmNewPasswordCannotBeBlank })
      error = true;
    }

    if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({ confirmNewPasswordError: configJSON.matchNewAndConfirmPassword })
      error = true;
    }

    if (error) {
      return false;
    }
    return true;
  }

  handlePushNotification = async () => {
    const authToken = await getStorageData('authToken');
    const formData = new FormData();
    formData.append('data[push_notification]', this.state.isPushNotificationEnabled.toString());

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateProfilePatchAPICallID = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateProfileEndPoint
    );

    const header = {
      "Content-Type": configJSON.contentTypeFormData,
      token: authToken
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      formData
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.methodTypeApiPatchUserProfile
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  handleChangePasswordNavigation = () => {
    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), "ChangePassword");
    this.send(message);
  }

  handleProfileNavigation = async () => {
    const userId = await getStorageData('user_id');
    await setStorageData("profileIdToLoad", `${userId}`);
    const navMessage: Message = new Message(getName(MessageEnum.NavigationMessage));
    navMessage.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    navMessage.addData(getName(MessageEnum.NavigationTargetMessage), 'Profile');
    this.send(navMessage);
  }

  analyzeNewPassword(newPassword: string) {
    let error = false;

    if (newPassword.length < 8) {
      error = true;
    }

    if (!/[a-z]/.test(newPassword)) {
      error = true;
    }

    if (!/[A-Z]/.test(newPassword)) {
      error = true;
    }

    if (!/\d/.test(newPassword)) {
      error = true;
    }

    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
      error = true;
    }

    if (error) {
      return configJSON.errorNewPasswordNotValid;
    }

    return "";
  }

  handleCurrentPassword = (text: string) => {
    this.setState({ currentPassword: text.replace("  ", " ") })
  }

  handleNewPassword = (text: string) => {
    this.setState({ newPassword: text.replace("  ", " ") })
  }

  handleConfirmPassword = (text: string) => {
    this.setState({ confirmNewPassword: text.replace("  ", " ") })
  }

  // Customizable Area End
}
