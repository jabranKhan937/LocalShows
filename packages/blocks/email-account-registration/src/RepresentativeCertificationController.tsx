import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import { setStorageData, isEmpty, getStorageData } from "../../../framework/src/Utilities";
import { DeviceEventEmitter } from "react-native";
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from "../../utilities/src/Colors";
export type IosPickerProps = {
    stateName: 'title' | 'placeName',
}
export type AndroidPickerProps = {
  stateName: 'title' | 'placeName',
  stateListName: 'titleList' | 'placeListName'
}
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
}

export interface S {
  // Customizable Area Start
  userRole: 'band'|'venue' | '';
  title: string;
  placeName: string;
  titleList: string[];
  placeListName: string[];
  fullName: string;
  selectedBandArtist: string;
  bandArtistList: any[];
  bandArtistClicked: boolean;
  authorizePage: boolean;
  titleError: string;
  fullNameError: string;
  bandArtistError: string;
  placeNameError: string;
  isDarkMode: boolean;
  // Customizable Area End
}

export interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class RepresentativeCertificationController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  postVerifyMyAccountID: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage)
    ];
    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this, this.subScribedMessages);

    this.state = {
      // Customizable Area Start
      userRole: "",
      title: "",
      placeName: "",
      fullName: "",
      bandArtistList: ["Band", "Artist"],
      titleList: ["Owner", "Associate member"],
      placeListName: ["Whisky a go go", "Oasis club", "Rio club"],
      selectedBandArtist: "",
      bandArtistClicked: false,
      authorizePage: false,
      titleError: "",
      fullNameError: "",
      bandArtistError: "",
      placeNameError: "",
      isDarkMode: true
      // Customizable Area End
    };

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message)
    }
    // Customizable Area End
  }

  // Customizable Area Start
  handleRestAPIResponse = (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );

    if (!responseJson.errors) {
      if(apiRequestCallId === this.postVerifyMyAccountID){

        const {page_used} = responseJson.data.attributes

        this.handleNavigation(page_used)
      }
    } else {
      this.parseApiErrorResponse(errorResponse);
    }
  }


  profileThemeListener: any = null;

  async componentDidMount() {
    // Get user role immediately when component mounts
    await this.getUserRole();
    this.loadCertificationTheme();
    
    // Also listen for navigation focus events
    this.props.navigation.addListener("willFocus", async () => {
      await this.getUserRole();
    });
  }

  async componentWillUnmount(): Promise<void> {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  loadCertificationTheme = async () => {
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

  getCertificationTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  dynamicOpacity = (property: boolean | string) => {
    return property ? 1 : 0.5;
  };


  checkValidation = () => {
    let error = false;
    this.setState({
      titleError: "",
      fullNameError: "",
      bandArtistError: ""
    });

    if (isEmpty(this.state.title)) {
      this.setState({ titleError: configJSON.errorTitleCannotBeBlank });
      error = true;
    } else if (!(/^[a-zA-Z| ]+$/.test(this.state.title))) {
      this.setState({ titleError: configJSON.errorTitleCanOnlyContainAlphabets });
      error = true;
    }

    if (isEmpty(this.state.fullName)) {
      this.setState({ fullNameError: configJSON.errorFullNameCannotBeBlank });
      error = true;
    }

    if (this.state.userRole === 'band' && isEmpty(this.state.selectedBandArtist)) {
      this.setState({
        bandArtistError: configJSON.errorBandArtistCannotBeBlank
      });
      error = true;
    }
    if (this.state.userRole === 'venue' && isEmpty(this.state.placeName)) {
      this.setState({
        placeNameError: configJSON.errorPlaceNameCannotBeBlank
      });
      error = true;
    }

    if (error) {
      return false;
    }
    return true;
  };
  handleVerifyMyAccount =  () =>{
    if (!this.checkValidation()) return
    const {userRole , placeName , selectedBandArtist , fullName , title} = this.state
    const header = {
      "Content-Type": configJSON.validationApiContentType
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.postVerifyMyAccountID = requestMessage.messageId;

    const requestData = {
      
      band_artist_name: userRole === 'venue' ? placeName : selectedBandArtist,
      your_title: title,
      electronic_signature: fullName,
      role_id: userRole === 'venue' ? 2 : 3
    }


    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.verifyMyAccountEndPoint 
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(requestData)
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  handleNavigation = async (isPageAlreadyExists ?: boolean) => {
      await setStorageData("user_title", this.state.title)
      await setStorageData('administrator_name', this.state.fullName);
      await setStorageData("user_role", this.state.userRole)
      // const redirectionRouteName = isPageAlreadyExists ? 'ClaimPage' : 'CreatePage';
            const redirectionRouteName = 'CreatePage';


      const message: Message = new Message(getName(MessageEnum.NavigationMessage));
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(getName(MessageEnum.NavigationTargetMessage), redirectionRouteName);

      const info = {
        bandName: this.state.selectedBandArtist.trim(),
        userRole: this.state.userRole,
        userTitle: this.state.title,
        placeTitle: this.state.placeName,
        administratorName: this.state.fullName,
      }

      const raiseMessage: Message = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

      message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

      this.send(message);
    
  };

  handleTitle = (title: string) => {
    this.setState({ title: title.replace(/ {2}/g, ' ') })
  }

  handleFullName = (fullName: string) => {
    this.setState({ fullName: fullName.replace(/ {2}/g, ' ') })
  }

  handlePlaceName = (placeName: string) => {
    this.setState({ placeName: placeName})
  }

  handleBandArtist = (selectedBandArtist: string) => {
    this.setState({ selectedBandArtist: selectedBandArtist.replace(/ {2}/g, ' ') })
  }

  handleAuthorizePage = () => {
    this.setState({
      authorizePage: !this.state.authorizePage
    })
  }

  getUserRole = async () => {
    const userRole = await getStorageData("userRole");
    console.log('Retrieved userRole from storage:', userRole);
    if (userRole) {
      this.setState({ userRole });
    } else {
      console.warn('userRole not found in storage');
    }
  }


  // Customizable Area End
}
