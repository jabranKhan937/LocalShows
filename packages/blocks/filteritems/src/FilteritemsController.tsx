import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { getStorageData } from "../../../framework/src/Utilities";
import { CommonActions } from "@react-navigation/native";
import moment from "moment";

// Customizable Area Start
type FilterTypes = "0" | "1" | "2";
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
  token: string | null;
  startDate: string;
  endDate: string;
  displayedDate: any;
  showDateSelector: boolean;
  events: Record<string, []>;
  filteredEvents: any[];
  isFetching: boolean;
  showFilterPopup: boolean;
  selectedFilter: FilterTypes;
  deleteEventModalVisible: boolean;
  eventIdToRemove: string;
  activeTab: string;
  userRole: string;
  searchText: string;
  userId: string;
  showLoginPopup: boolean;
  postsCount: string;
  picturesCount: string;
  eventAccountId: string;
  activeOptionsMenuId: string | null;
  unreadNotificationCount: number;
  newNotification: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class FilteritemsController extends BlockComponent<
  Props,
  S,
  SS
> {
  getCalendarEventsApiCallId: any;
  deleteCalendarEventApiCallId: any;
  checkUnreadNotificationsApiCallId: any;

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [getName(MessageEnum.RestAPIResponceMessage)];

    this.state = {
      token: "",
      startDate: "MM DD YYYY",
      endDate: "MM DD YYYY",
      displayedDate: moment(),
      showDateSelector: false,
      events: {},
      filteredEvents: [],
      isFetching: false,
      showFilterPopup: false,
      selectedFilter: "0",
      deleteEventModalVisible: false,
      eventIdToRemove: "",
      activeTab: "post",
      userRole: "fan",
      searchText: "",
      userId: "",
      showLoginPopup: false,
      postsCount: "",
      picturesCount: "",
      eventAccountId: "",
      activeOptionsMenuId: null,
      unreadNotificationCount: 0,
      newNotification: false,
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }
  async componentDidMount() {
    super.componentDidMount();
    this.props.navigation.addListener("willFocus", () => {
      this.setState({
        startDate: "MM DD YYYY",
        endDate: "MM DD YYYY",
        activeTab: "post",
        displayedDate: moment(),
      });
      this.getToken();
      // Refresh notification count when screen comes into focus
      setTimeout(() => {
        this.getUnreadNotificationsCount();
      }, 100);
    });
    this.props.navigation.addListener("willBlur", () => {
      this.setState({ showDateSelector: false });
    });
    // Also add focus listener for React Navigation v5+
    // Refetch calendar here so we always show latest events when user returns to this screen
    // (e.g. after adding an event elsewhere). willFocus is not always reliable in all navigators.
    this.props.navigation.addListener("focus", () => {
      setTimeout(() => {
        this.getUnreadNotificationsCount();
        // Always refetch calendar to show latest data (no need to kill the app)
        if (this.state.token) {
          const start =
            this.state.startDate !== "MM DD YYYY"
              ? moment(this.state.startDate).format("YYYY-MM-DD")
              : "";
          const end =
            this.state.endDate !== "MM DD YYYY"
              ? moment(this.state.endDate).format("YYYY-MM-DD")
              : "";
          this.getShows(start, end);
        } else {
          // Token might not be in state yet (e.g. first focus); getToken will trigger getShows
          this.getToken();
        }
      }, 100);
    });
    this.getToken();
    // Call notification count API on mount
    setTimeout(() => {
      this.getUnreadNotificationsCount();
    }, 100);
  }

  getToken = async () => {
    const token = await getStorageData("authToken");
    if (token) {
      this.setState({ showLoginPopup: false });
    } else {
      this.setState({ showLoginPopup: true });
    }
    const userId = await getStorageData("user_id");
    const userRole = token ? await getStorageData("userRole") : "fan";
    this.setState({ token, userRole, userId }, () => {
      this.getShows("", "");
    });
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    this.handleRestAPIResponse(message);

    // Customizable Area End
  }
  // Customizable Area Start

  async componentWillUnmount() {
    super.componentWillUnmount();
    this.props.navigation.removeListner();
  }

  showDateSelector = () => {
    this.setState({
      showDateSelector: true,
      startDate: "MM DD YYYY",
      endDate: "MM DD YYYY",
      displayedDate: moment(),
    });
  };
  handleCloseBtn = () => {
    this.setState({ showLoginPopup: false });
  };

  setDates = (dates: any) => {
    if (dates.startDate) {
      this.setState({
        startDate: moment(dates.startDate).format("MMM DD YYYY"),
      });
    }
    if (dates.endDate) {
      this.setState({
        endDate: moment(dates.endDate).format("MMM DD YYYY"),
        showDateSelector: false,
      });
      this.getShows(
        moment(dates.startDate).format("YYYY-MM-DD"),
        moment(dates.endDate).format("YYYY-MM-DD")
      );
    }
    if (dates.displayedDate) {
      this.setState({
        displayedDate: dates.displayedDate,
      });
    }
  };

  getShows = async (startDate: string, endDate: string) => {
    if (this.state.token === null) {
      return false;
    }
    this.setState({ isFetching: true });

    const { userRole, activeTab, token } = this.state;
    const {
      validationApiContentType,
      getCalendarEndpoint,
      getPostsPicturesCalendarForBandEndpoint,
      apiMethodTypeGet,
    } = configJSON;

    const endpoints =
      userRole === "fan"
        ? `${getCalendarEndpoint}?start_date=${startDate}&end_date=${endDate}`
        : `${getPostsPicturesCalendarForBandEndpoint}?start_date=${startDate}&end_date=${endDate}&type=${activeTab}&query=${this.state.searchText}`;

    console.log("[Filteritems] getShows API", {
      endpoint: endpoints,
      method: apiMethodTypeGet,
      userRole,
      activeTab,
    });

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    const header = {
      "Content-Type": validationApiContentType,
      token: token,
    };

    this.getCalendarEventsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoints
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      apiMethodTypeGet
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  deleteEvent = async () => {
    this.setState({ deleteEventModalVisible: false, isFetching: true });

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: this.state.token,
    };

    const { userRole, eventAccountId, userId, eventIdToRemove } = this.state;

    const isFan = userRole === "fan";
    const isEventOwner = eventAccountId === userId;

    let endpoint;

    if (isFan) {
      endpoint = `${configJSON.deleteEventEndpoint}?show_id=${eventIdToRemove}`;
    } else if (isEventOwner) {
      endpoint = `${configJSON.cancelShowEndPoint}/${eventIdToRemove}`;
    } else {
      endpoint = `${configJSON.deleteEventEndpoint}?show_id=${eventIdToRemove}`;
    }

    this.deleteCalendarEventApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeDelete
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  groupBy = (xs: any, key: string) =>
    xs.reduce((rv: any, x: any) => {
      if (!rv[x.attributes[key]]) {
        rv[x.attributes[key]] = [];
      }
      rv[x.attributes[key]].push(x);
      return rv;
    }, {});

  dynamicBg = (selected: FilterTypes) => {
    if (selected === this.state.selectedFilter) {
      return "#c5c5ff";
    }
    return "transparent";
  };

  filterEvents = async (
    filterType: FilterTypes,
    events: Record<string, []>
  ) => {
    this.setState({
      isFetching: true,
      selectedFilter: filterType,
      showFilterPopup: false,
    });

    const filterBy =
      this.state.activeTab === "post" ? "date_of_the_show" : "updated_at";
    if (filterType === "0") {
      const eventList = Object.values(events).reduce(
        (result: any, array) => result.concat(array),
        []
      );
      const groupedByDate = this.groupBy(eventList, filterBy);
      const array = Object.keys(groupedByDate);
      const descend = (date1: any, date2: any) =>
        Number(moment(date2)) - Number(moment(date1));
      const filteredEvents = [...array].sort(descend);
      this.setState({ events: groupedByDate, filteredEvents });
    }

    if (filterType === "1") {
      const eventList = Object.values(events).reduce(
        (result: any, array) => result.concat(array),
        []
      );
      const groupedByDate = this.groupBy(eventList, filterBy);
      const array = Object.keys(groupedByDate);
      const ascend = (date1: any, date2: any) =>
        Number(moment(date1)) - Number(moment(date2));
      const filteredEvents = [...array].sort(ascend);
      this.setState({ events: groupedByDate, filteredEvents });
    }

    if (filterType === "2") {
      const eventList = Object.values(events).reduce(
        (result: any, array) => result.concat(array),
        []
      );
      const groupedByState = this.groupBy(eventList, "state");
      this.setState({
        events: groupedByState,
        filteredEvents: Object.keys(groupedByState),
      });
    }

    this.setState({ isFetching: false });
  };

  handleEventNavigation = (item: any) => {
    if (item?.attributes?.account_id?.toString() === this.state.userId) {
      this.props.navigation.navigate("PostDetails", {
        eventId: item.id,
        eventState: item.attributes.state,
      });
    } else {
      this.handleDetailNavigation(item.id, item.attributes.state_name);
    }
  };

  moveToSignupLoginScreen = (navigateTo: string) => {
    this.setState({ showLoginPopup: false }, () => {
      this.props.navigation.navigate(navigateTo);
    });
  };

  navigateToNotifications = () => {
    // Only reset the newNotification flag, don't reset the count
    // The count should be updated by the API when we return to this screen
    const nestedNotificationRoute = {
      name: "Home",
      params: {
        screen: "HomeTab",
        params: {
          screen: "Calender",
          params: {
            screen: "Notifications",
          },
        },
      },
    };

    if (
      this.props.navigation &&
      typeof this.props.navigation.dispatch === "function"
    ) {
      this.props.navigation.dispatch(
        CommonActions.navigate(nestedNotificationRoute),
      );
    } else if (
      this.props.navigation &&
      typeof this.props.navigation.navigate === "function"
    ) {
      this.props.navigation.navigate("Home", {
        screen: "HomeTab",
        params: {
          screen: "Calender",
          params: {
            screen: "Notifications",
          },
        },
      });
      this.props.navigation.navigate("Notifications");
    }
    this.setState({ newNotification: false });
  };

  getUnreadNotificationsCount = async () => {
    if (!this.state.token) {
      const token = await getStorageData("authToken");
      if (!token) {
        return;
      }
      this.setState({ token });
    }

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: this.state.token,
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
      configJSON.apiMethodTypeGet,
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
    else if (responseJson.data && typeof responseJson.data === 'object' && !Array.isArray(responseJson.data)) {
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
    else if (Array.isArray(responseJson.data) && responseJson.data.length === 0) {
      unreadCount = 0;
      hasUnread = false;
    }
    else {
      unreadCount = 0;
      hasUnread = false;
    }

    // Ensure unreadCount is a number
    const count = typeof unreadCount === 'number' ? unreadCount : parseInt(unreadCount, 10) || 0;

    this.setState({
      unreadNotificationCount: count,
      newNotification: hasUnread && count > 0,
    });
  };

  handleDeleteModal = (eventId: string, accountId: string) => {
    this.setState({
      eventIdToRemove: eventId,
      eventAccountId: accountId?.toString(),
      deleteEventModalVisible: true,
    });
  };

  togglePostOptionsMenu = (eventId: string) => {
    this.setState((prevState) => ({
      activeOptionsMenuId:
        prevState.activeOptionsMenuId === eventId ? null : eventId,
    }));
  };

  closePostOptionsMenu = () => {
    if (this.state.activeOptionsMenuId !== null) {
      this.setState({ activeOptionsMenuId: null });
    }
  };

  handleEditPicturePost = (eventId: string) => {
    this.setState({ activeOptionsMenuId: null }, () => {
      this.props.navigation.navigate("PhotoLibrary", {
        eventId,
      });
    });
  };

  handleDeletePicturePost = (eventId: string, accountId: string) => {
    this.setState({ activeOptionsMenuId: null }, () => {
      this.handleDeleteModal(eventId, accountId);
    });
  };

  handleEditShow = (item: any) => {
    this.setState({ activeOptionsMenuId: null }, () => {
      this.props.navigation.navigate("PostCreation", {
        eventId: item.id,
        from: 'show',
        eventData: item,
      });
    });
  };

  handleDeleteShow = (eventId: string, accountId: string) => {
    this.setState({ activeOptionsMenuId: null }, () => {
      this.handleDeleteModal(eventId, accountId);
    });
  };

  handleSearch = (searchText: string) => {
    this.setState({ searchText: searchText.replace("  ", " ") }, () => {
      if (this.state.startDate === "MM DD YYYY") {
        this.getShows("", "");
      } else {
        this.getShows(
          moment(this.state.startDate).format("YYYY-MM-DD"),
          moment(this.state.endDate).format("YYYY-MM-DD")
        );
      }
    });
  };

  handleTabSwitch = (selectedTab: string) => {
    this.setState(
      { activeTab: selectedTab, filteredEvents: [], events: {} },
      () => {
        this.getShows(
          this.state.startDate !== "MM DD YYYY" ? this.state.startDate : "",
          this.state.endDate !== "MM DD YYYY" ? this.state.endDate : ""
        );
      }
    );
  };

  showFilterPopup = () => {
    this.setState({
      showFilterPopup: !this.state.showFilterPopup,
    });
  };

  hideDeleteModal = () => {
    this.setState({ deleteEventModalVisible: false });
  };

  handleRemovePicture = async () => {
    this.setState({ deleteEventModalVisible: false, isFetching: true });
    const authToken = await getStorageData("authToken");

    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteCalendarEventApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.postAPictureEndPoint}/${this.state.eventIdToRemove}`
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeDelete
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handlePostPictureDelete = () => {
    if (this.state.activeTab === "post") {
      this.deleteEvent();
    } else {
      this.handleRemovePicture();
    }
  };

  handleDetailNavigation = (eventId: string, state: string) => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage)
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      "AllEventDetailScreen"
    );

    const info = {
      eventId: eventId,
      eventState: state,
    };

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage)
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);

    this.send(message);
  };

  handleRestAPIResponse = (message: Message) => {
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      if (apiRequestCallId === this.getCalendarEventsApiCallId) {
        this.handleGetCalendarEventsApiResponse(message);
      } else if (apiRequestCallId === this.deleteCalendarEventApiCallId) {
        this.handleDeleteCalendarEventApiResponse(message);
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

  handleGetCalendarEventsApiResponse = (message: Message) => {
    this.setState({ isFetching: false });
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if (responseJson && !responseJson.errors) {
      // Success
      const filterBy =
        this.state.activeTab === "post" ? "date_of_the_show" : "updated_at";
      if (responseJson.data.length === 0) {
        this.setState({
          events: {},
          postsCount: responseJson.meta?.posts ?? "0",
          picturesCount: responseJson.meta?.pictures ?? "0",
        });
      } else {
        const events = this.groupBy(responseJson.data, filterBy);
        this.setState({
          events,
          postsCount: responseJson.meta?.posts ?? "0",
          picturesCount: responseJson.meta?.pictures ?? "0",
        });
        this.filterEvents("0", events);
      }
    } else {
      this.setState({ events: {} });
    }
  };

  handleDeleteCalendarEventApiResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if (responseJson && responseJson.message) {
      // Success
      if (this.state.startDate === "MM DD YYYY") {
        this.getShows("", "");
      } else {
        this.getShows(
          moment(this.state.startDate).format("YYYY-MM-DD"),
          moment(this.state.endDate).format("YYYY-MM-DD")
        );
      }
      this.showAlert("Message", responseJson.message);
    }
    this.setState({ isFetching: false });
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };
  // Customizable Area End
}
