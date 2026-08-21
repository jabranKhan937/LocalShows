import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { getStorageData, setStorageData } from "../../../framework/src/Utilities";
import { DeviceEventEmitter } from "react-native";
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
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
  // Customizable Area Start
  selectedRole: "" | "fan" | "venue" | "band";
  isModalVisible: boolean;
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class RolesandpermissionsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      selectedRole: configJSON.defaultRole,
      isModalVisible:false,
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

  profileThemeListener: any = null;

  async componentDidMount() {
    await super.componentDidMount();
    this.loadRoleTheme();
  }

  async componentWillUnmount(): Promise<void> {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  loadRoleTheme = async () => {
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

  getRoleTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  // Customizable Area Start
  setRole = (role: "fan" | "venue" | "band") => {
    this.setState({ selectedRole: role });
  }

  goToSignup = async () => {
    await setStorageData("userRole", this.state.selectedRole);
    console.log("Saved userRole to storage:", this.state.selectedRole);
    // console.log("this props are here",this.props);    
    if (this.state.selectedRole === "fan") {
      const msg: Message = new Message(getName(MessageEnum.NavigateEmailSignUpMessage));
      msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      this.send(msg);
    }
     else {
      const message: Message = new Message(getName(MessageEnum.NavigationMessage));
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(getName(MessageEnum.NavigationTargetMessage), "RepresentativeCertification");
      this.send(message);
    }
  }

  handleBack = () => {
    this.setState({isModalVisible:false})
  }
  // Customizable Area End
}
