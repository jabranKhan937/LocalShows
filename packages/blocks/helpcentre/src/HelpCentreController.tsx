
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { DeviceEventEmitter } from "react-native";
import { getStorageData } from "../../../framework/src/Utilities";
import {
  lightTheme,
  redesignTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
} from "../../utilities/src/Colors";

interface IFAQList {
  id: number
  question: string
  answer: string
  created_at: string
  updated_at: string
  isOpen: boolean
}

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
  helpCentreQA: any;
  token: string;
  queue_type: any;
  dataQA: []
  dataSub: [];
  faqList: IFAQList[];
  searchInput: string;
  filteredFAQList: IFAQList[];
  aboutUs: string;
  aboutUsImage: string;
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class HelpCentreController extends BlockComponent<
  Props,
  S,
  SS
> {
  getHelpCentreApiCallId: any
  getFAQApiCallId: any
  getAboutUsApiCallId: any
  profileThemeListener: { remove: () => void } | null = null;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.SessionResponseMessage)];
    this.state = {
      helpCentreQA: [],
      token: "",
      queue_type: "",
      dataQA: [],
      dataSub: [],
      faqList: [],
      searchInput: "",
      filteredFAQList: [],
      aboutUs: "",
      aboutUsImage:"",
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
    this.getFAQListAPI()
    this.getAboutUs();
    this.loadHelpCentreTheme();
  }

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recieved", JSON.stringify(message));

    this.handleSessionResponse(message);
    this.handleNavigationPayload(message);
    this.handleRestAPIResponse(message);
    // Customizable Area End
  }

  // Customizable Area Start
  loadHelpCentreTheme = async () => {
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

  getHelpCentreTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  handleSessionResponse(message: Message) {
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: token }, () => {
        // this.getHelpCentreQA(token)
      });
    }
  }

  handleNavigationPayload(message: Message) {
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const subData = message.getData(getName(MessageEnum.HelpCentreMessageData));
      if (subData?.que_title) {
        this.setState({ dataSub: subData.que_array ?? [] });
      } else {
        this.setState({ dataQA: subData?.que_array ?? [] });
      }
    }
  }

  handleRestAPIResponse(message: Message) {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      if (apiRequestCallId === this.getHelpCentreApiCallId) {
        this.handleHelpCentreApiResponse(message);
      }

      if (apiRequestCallId === this.getFAQApiCallId) {
        this.handleFAQApiResponse(message);
      }

      if (apiRequestCallId === this.getAboutUsApiCallId) {
        this.handleAboutUsApiResponse(message);
      }
    }
  }

  handleAboutUsApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      this.setState({
        aboutUs: responseJson.data[0].attributes.description,
        aboutUsImage: responseJson.data[0].attributes.image,
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  }

  handleHelpCentreApiResponse(message: Message) {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    const errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      this.setState({ helpCentreQA: responseJson.data });
    } else {
      this.parseApiErrorResponse(responseJson);
    }

    this.parseApiCatchErrorResponse(errorReponse);
  }

  handleFAQApiResponse(message: Message) {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    const errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );

    if (responseJson != null && !responseJson.errors) {
      const faqData = responseJson.map((item: any) => ({ ...item, isOpen: false }));
      this.setState({ faqList: faqData, searchInput: "", filteredFAQList: [] });
    } else {
      this.parseApiErrorResponse(responseJson);
    }

    this.parseApiCatchErrorResponse(errorReponse);
  }

  getHelpCentreQA = (token: string) => {

    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: token
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getHelpCentreApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.helpcentreAPIEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  gotoSubScreen(item: any) {

    const que_type = item?.attributes?.que_type
    const data = item?.attributes?.question_sub_types?.data

    const msg = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationTargetMessage), 'HelpCentreSub');

    msg.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props
    );

    const helpcentreSubInfo = {
      que_title: que_type,
      que_array: data
    }

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), helpcentreSubInfo);

    msg.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(msg)

  }

  gotoHelpCentreQA(sub_type: any, data: []) {

    const msg = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationTargetMessage), 'HelpCentreQA');

    msg.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props
    );

    const helpcentreSubInfo = {
      sub_type: sub_type,
      que_array: data
    }

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), helpcentreSubInfo);

    msg.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(msg);
  }

  getFAQListAPI = () => {
    const getDataMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getFAQApiCallId = getDataMsg.messageId;

    getDataMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.faqAPIEndPoint
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
      })
    );

    getDataMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(getDataMsg.id, getDataMsg);
  }

  getAboutUs = () => {
    const requestMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getAboutUsApiCallId = requestMsg.messageId;

    requestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.aboutUsEndpoint
    );

    requestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        "Content-Type": configJSON.validationApiContentType,
      })
    );

    requestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(requestMsg.id, requestMsg);
  }

  showHideAnswers = (faqIndex: number) => {
    const { searchInput, faqList, filteredFAQList } = this.state;
    const faq = searchInput === "" ? [...faqList] : [...filteredFAQList];

    const newArray = faq.map((item: any, index: number) => ({
      ...item,
      isOpen: index === faqIndex ? !item.isOpen : false,
    }));

    const newState = searchInput === "" ? { faqList: newArray } : { filteredFAQList: newArray };
    this.setState(newState as any);
  }

  filterFAQData = (searchText: string) => {
    const text = searchText.toLowerCase();
    const filteredData: any = [...this.state.faqList].filter((item: any) =>
      item.question.toLowerCase().includes(text.trim()) ||
      item.answer.toLowerCase().includes(text.trim())
    );

    this.setState({
      searchInput: searchText,
      filteredFAQList: filteredData
    });
  }

  // Customizable Area End
}
