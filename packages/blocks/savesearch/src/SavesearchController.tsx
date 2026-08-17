import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start

export interface IUser {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface ISearch {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
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
  users: IUser[];
  selectedUser?: IUser;
  showSearch: boolean;
  searches: ISearch[];
  searchQuery: string;
  isLoading: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class SavesearchController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  getUsersId = "";
  saveSearchId = "";
  getSearchId = "";
  deleteSearchId = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      users: [],
      selectedUser: undefined,
      showSearch: false,
      searches: [],
      searchQuery: "",
      isLoading: false,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    // Customizable Area Start
    if (
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage)) ===
      this.getUsersId
    ) {
      const { users } = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      this.setState({ users, isLoading: false });
    } else if (
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage)) ===
      this.saveSearchId
    ) {
      this.refreshData();
    } else if (
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage)) ===
      this.getSearchId
    ) {
      let { data } = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      data.sort(this.sortByDate);
      this.setState({ searches: data });
    } else if (
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage)) ===
      this.deleteSearchId
    ) {
      this.refreshData();
    }
    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount(): Promise<void> {
    super.componentDidMount();
    this.getUsers();
  }

  sortByDate = (a: any, b: any) => {
    const firstDate = new Date(a.updated_at);
    const secondDate = new Date(b.updated_at);
    return (secondDate.getTime() - firstDate.getTime());
  }

  refreshData = () => {
    this.setState({ isLoading: false });

    /* Refresh the data */
    this.getSearches(this.state.searchQuery);
  };

  getUsers = () => {
    this.setState({ isLoading: true });

    const header = {
      "Content-Type": configJSON.jsonContentType,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getUsersId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getUsersEndpoint
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

  saveSearch = () => {
    if(!this.state.searchQuery.trim()) {
      return;
    }

    this.setState({ isLoading: true });

    const header = {
      "Content-Type": configJSON.jsonContentType,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.saveSearchId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.saveSearchEndpoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify({
        user_id: this.state.selectedUser?.id,
        search: this.state.searchQuery.trim(),
      })
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  getSearches = (searchQuery: string, user?: number) => {
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getSearchId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getSearchEndpoint}?user_id=${
        user || this.state.selectedUser?.id
      }&search=${searchQuery.trim()}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  deleteSearch = (searchQuery: string) => {
    this.setState({ isLoading: true });

    const header = {
      "Content-Type": configJSON.jsonContentType,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteSearchId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.deleteSearchEndpoint}/${this.state.selectedUser?.id}?search=${searchQuery}`
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

  onSelectUser = (item: IUser) => {
    this.setState({ showSearch: true, selectedUser: item });
    this.getSearches("", item.id);
  };

  onChangeSearchQuery = (searchQuery: string) => {
    this.setState({ searchQuery });
    this.getSearches(searchQuery);
  };

  onNavigateBack = () => {
    this.setState({ showSearch: false, searchQuery: "", searches: [] });
  };
  // Customizable Area End
}
