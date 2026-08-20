import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { getStorageData, isEmpty } from "../../../framework/src/Utilities";
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
  // Customizable Area Start
  name: string;
  email: string;
  phoneNumber: string;
  comments: string;
  enableField: boolean;
  token: string;
  contactUsList: any;
  activeId: number;
  activeName: string;
  activeEmail: string;
  activePhoneNumber: string;
  activeDescription: string;
  activeCreatedAt: string;
  isVisible: boolean;
  subject: string;
  description: string;
  nameError: string;
  emailError: string;
  phoneError: string;
  subjectError: string;
  messageError: string;
  modalVisible: boolean;
  countryCodesList: any[];
  countryCodeClicked: boolean;
  countryCodeClickedAndroid: boolean;
  selectedCountryCode: any;
  countryCodeFetched:boolean
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class ContactusController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  contactUsApiCallId: any;
  deleteContactApiCallId: any;
  addContactApiCallId: any;
  postContactUsApiCallID: any;
  getCountryCodeListId: string = "";
  profileThemeListener: { remove: () => void } | null = null;
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
    ];

    this.contactUsApiCallId = "";
    this.deleteContactApiCallId = "";
    this.addContactApiCallId = "";

    this.state = {
      name: "",
      email: "",
      phoneNumber: "",
      comments: "",
      enableField: false,
      token: "",
      contactUsList: [],
      activeId: 0,
      activeName: "",
      activeEmail: "",
      activePhoneNumber: "",
      activeDescription: "",
      activeCreatedAt: "",
      isVisible: false,
      subject: "",
      description: "",
      nameError: "",
      emailError: "",
      phoneError: "",
      subjectError: "",
      messageError: "",
      modalVisible: false,
      countryCodesList: [],
      countryCodeClicked: false,
      countryCodeClickedAndroid: false,
      selectedCountryCode: {},
      countryCodeFetched:false,
      isDarkMode: true,
    };

    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    const authToken = await getStorageData('authToken');
    this.handleCountryCodeListAPICall()
    this.loadContactTheme();
    if (authToken !== null) {
      const name = await getStorageData('user_name') ?? "";
      const email = await getStorageData('user_email') ?? "";
      let phoneNumber = await getStorageData('user_phone_number') ?? "";
      phoneNumber = phoneNumber.slice(-10)
      this.setState({ name, email, phoneNumber, });
    }
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.handleSessionResponse(message);
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestApiResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  loadContactTheme = async () => {
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

  getContactTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  handleSessionResponse(message: Message) {
    const token = message.getData(getName(MessageEnum.SessionResponseToken));
    runEngine.debugLog("TOKEN", token);
    this.setState({ token });
    this.getContactUsList(token);
  }

  handleRestApiResponse(message: Message) {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    const errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );
    runEngine.debugLog("API Message Received", message);

    if (responseJson && responseJson.data) {
      this.handleApiResponseWithData(apiRequestCallId, responseJson);
    } else if (responseJson && responseJson.message) {
      this.handleApiResponseWithMessage(apiRequestCallId, responseJson);
    } else {
      this.handleAddContactErrors(responseJson.errors);
      this.parseApiErrorResponse(errorReponse)
    }
  }

  handleApiResponseWithData(apiRequestCallId: string, responseJson: any) {
    if (apiRequestCallId === this.contactUsApiCallId) {
      this.setState({ contactUsList: responseJson.data });
    } else if (apiRequestCallId === this.addContactApiCallId || apiRequestCallId === this.postContactUsApiCallID) {
      this.props.navigation.goBack();
    } else if (apiRequestCallId === this.getCountryCodeListId) {
      this.handleGetCountryCodeListResponse(responseJson)
    }
  }

  handleGetCountryCodeListResponse = async (responseJson: any) => {
    if (!responseJson.errors) {
      let countryName = await getStorageData('user_country') ?? "US";
      const usData = responseJson.data.find((item: any) => item.id === countryName)
      this.setState({ countryCodesList: responseJson.data, selectedCountryCode: usData },()=>{
        this.setState({countryCodeFetched:true})
      });
    } else {
      this.parseApiErrorResponse(responseJson);
      this.setState({countryCodeFetched:true})
    }
  }

  handleApiResponseWithMessage(apiRequestCallId: string, responseJson: any) {
    if (apiRequestCallId === this.deleteContactApiCallId) {
      this.setState({ isVisible: false });
      this.getContactUsList(this.state.token);
    } else if (responseJson.errors && apiRequestCallId === this.addContactApiCallId) {
      this.handleAddContactErrors(responseJson.errors);
    }
  }

  handleAddContactErrors(errors: any) {
    errors.forEach((error: any) => {
      if (error.contact) {
        this.showAlert(configJSON.errorTitle, error.contact.join("."));
      }
    });
  }

  txtNameProps = {
    onChangeText: (text: string) => {
      this.setState({ name: text });

      //@ts-ignore
      this.txtNameProps.value = text;
    },
  };

  txtEmailProps = {
    onChangeText: (text: string) => {
      this.setState({ email: text });

      //@ts-ignore
      this.txtEmailProps.value = text;
    },
  };
  
  txtPhoneNumberProps = {
    onChangeText: (text: string) => {
      this.setState({ phoneNumber: text });

      //@ts-ignore
      this.txtPhoneNumberProps.value = text;
    },
    // keyboardType: "phone-pad"
  };

  txtCommentsProps = {
    multiline: true,
    onChangeText: (text: string) => {
      this.setState({ comments: text });

      //@ts-ignore
      this.txtCommentsProps.value = text;
    },
  };

  setName = (text: string) => {
    this.setState({ name: text });
  };

  setEmail = (text: string) => {
    this.setState({ email: text });
  };

  setPhoneNumber = (text: string) => {
    this.setState({ phoneNumber: text });
  };

  setComments = (text: string) => {
    this.setState({ comments: text });
  };

  addQuery = () => {
    this.props.navigation.navigate("AddContactus");
  };

  hideModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  setModal = (item: any) => {
    this.setState({
      activeId: item.id,
      activeName: item.attributes.name,
      activeEmail: item.attributes.email,
      activeDescription: item.attributes.description,
      activePhoneNumber: item.attributes.phone_number,
      activeCreatedAt: item.attributes.created_at,
      isVisible: !this.state.isVisible,
    });
  };

  isStringNullOrBlank(str: string) {
    return str === null || str.length === 0;
  }

  isValidEmail = (Email: string) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(Email) === false) {
      return false;
    } else {
      return true;
    }
  };

  addQueryApi = () => {
    if (
      this.isStringNullOrBlank(this.state.name) ||
      this.isStringNullOrBlank(this.state.email) ||
      this.isStringNullOrBlank(this.state.phoneNumber) ||
      this.isStringNullOrBlank(this.state.comments)
    ) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorAllFieldsAreMandatory
      );
      return false;
    } else if (!this.isValidEmail(this.state.email.trim())) {
      this.showAlert(configJSON.errorTitle, configJSON.errorEmailNotValid);
      return false;
    } else {
      let data = {
        data: {
          name: this.state.name.trim(),
          email: this.state.email.trim(),
          phone_number: this.state.selectedCountryCode.attributes?.country_code + this.state.phoneNumber.trim(),
          description: this.state.comments.trim(),
        },
      };

      const header = {
        "Content-Type": configJSON.contactUsApiContentType,
        token: this.state.token,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );

      this.addContactApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.getContactUsAPiEndPoint
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(data)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod
      );
      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    }
  };

  deleteContactUs = (id: number) => {
    const header = {
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteContactApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getContactUsAPiEndPoint + `/${id}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpDeleteMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  getContactUsList = (token: string) => {
    const header = {
      "Content-Type": configJSON.contactUsApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.contactUsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getContactUsAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  btnSubmitProps = {
    onPress: () => this.addQueryApi(),
  };

  btnBackProps = {
    onPress: () => this.props.navigation.goBack(),
  };

  checkValidations = () => {
    this.setState({ name: this.state.name.trim() })
    const emailRegex = new RegExp(configJSON.emailRegex)
    let error = false;

    this.setState({
      nameError: "",
      emailError: "",
      phoneError: "",
      subjectError: "",
      messageError: "",
    });

    if (isEmpty(this.state.name)) {
      this.setState({ nameError: configJSON.errorNameCannotBeBlank })
      error = true;
    } else if (!(/^[a-zA-Z| ]+$/.test(this.state.name))) {
      this.setState({ nameError: configJSON.errorNameCanOnlyContainAlphabets });
      error = true;
    }

    if (isEmpty(this.state.phoneNumber)) {
      this.setState({ phoneError: configJSON.errorPhoneCannotBeBlank })
      error = true;
    } else if (this.state.phoneNumber.length !== 10) {
      this.setState({ phoneError: configJSON.errorPhoneNumberLength })
      error = true;
    }

    if (isEmpty(this.state.email)) {
      this.setState({ emailError: configJSON.errorEmailCannotBeBlank })
      error = true;
    } else if (!emailRegex.test(this.state.email)) {
      this.setState({ emailError: configJSON.errorEmailNotValid })
      error = true;
    }

    if (isEmpty(this.state.subject)) {
      this.setState({ subjectError: configJSON.errorSubjectCannotBeBlank })
      error = true;
    }

    if (isEmpty(this.state.description)) {
      this.setState({ messageError: configJSON.errorMessageCannotBeBlank })
      error = true;
    }

    if (error) {
      return false;
    }
    return true;
  }

  postContactAPI = () => {
    if (this.checkValidations()) {
      const data = {
        name: this.state.name,
        email: this.state.email,
        phone_number: this.state.phoneNumber,
        subject: this.state.subject,
        description: this.state.description,
        country_code: this.state.selectedCountryCode?.attributes?.country_code
      };

      const header = {
        "Content-Type": configJSON.contactUsApiContentType,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );

      this.postContactUsApiCallID = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.contactUsAPIEndPoint
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(data)
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  }

  checkIsEmailValid = (email: string) => {
    const indexOfAtChar = email.indexOf('@');
    if (indexOfAtChar === -1 || email.lastIndexOf('@') !== indexOfAtChar) {
      return false;
    }

    const firstPartData = email.slice(0, indexOfAtChar);
    const secondPartData = email.slice(indexOfAtChar + 1);

    if (firstPartData === '' || secondPartData === '') {
      return false;
    }

    const dotIndexData = secondPartData.indexOf('.');
    if (dotIndexData === -1 || secondPartData.lastIndexOf('.') !== dotIndexData) {
      return false;
    }

    const validChar = /^[a-zA-Z0-9_.+-]+$/;
    if (!validChar.test(firstPartData) || !validChar.test(secondPartData)) {
      return false;
    }

    return true;
  }

  hideModalVisibility = () => {
    this.setState({ modalVisible: false })
  }

  handleName = (name: string) => {
    this.setState({ name })
  }

  handlePhoneNumber = (phone: string) => {
    if (phone && !(/^\d+$/.test(phone))) {
      return;
    }
    this.setState({ phoneNumber: phone })
  }

  handleEmail = (text: string) => {
    this.setState({ email: text.replace(" ", "") })
  }

  handleSubject = (subject: string) => {
    this.setState({ subject })
  }

  handleMessage = (description: string) => {
    this.setState({ description })
  }

  handleCountryCodeListAPICall = () => {
    const header = {
      "Content-Type": configJSON.contactUsApiContentType,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getCountryCodeListId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.countryCodeList
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }

  showCountryCodeModal = () => {
    this.setState({ countryCodeClicked: true })
  }

  handleCountryCodeValueiOS = (selectedCountryCode: any) => {
    this.setState({ countryCodeClicked: false, selectedCountryCode })
  }

  handleCountryCodeValueAndroid = (selectedCountryCode: any) => {
    this.setState({ countryCodeClickedAndroid: false, selectedCountryCode })
  }

  hideCountryCode = () => {
    this.setState({ countryCodeClicked: false })
  }
  
  // Customizable Area End
}
