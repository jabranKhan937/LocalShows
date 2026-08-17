import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { ErrorInfo } from "react";
export const configJSON = require("./config");

// Customizable Area Start
// Customizable Area End

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export interface S {
  // Customizable Area Start
  title: any;
  notes: any;
  date: any;
  time: any;
  showTimePickerModal: boolean;
  showDatePickerModal: boolean;
  assignToList: any;
  visibilityList: any;
  notifyList: any;
  repeatList: any;
  showAssignToList: boolean;
  showVisibilityList: boolean;
  showNotifyList: boolean;
  showRepeatList: boolean;
  event_type: string;
  showTime: boolean;
  showDate: boolean;
  loading: boolean;
  showRepeatValue: any;
  showNotifyValue: any;
  showVisiblityValue: any;
  showAssignToValue: any;
  repeatValue: any;
  notifyValue: any;
  visiblityValue: any;
  assignToValue: any;
  partnerList: any[];
  lastAssigned: string;
  lastVisible: string;
  selectedEventId: string;
  showClashModal: boolean;
  customRepeatFlag: boolean;
  customRepeat: string;
  role: string;
  isOwner: boolean;
  customRepeatDay: string;
  customRepeatDayValue: string;
  searchLocation: string;
  lat: string;
  lng: string;
  showCustomRepeatList: boolean;
  showCustomRepeatValue: any;
  customRepeatValue: any;
  customRepeatList: any[];
  token: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

// Customizable Area Start
const INITIAL_VALUE = [
  {
    id: 0,
    type: "radio",
    name: "All",
    isSelected: false,
    counter: false,
  },
  {
    id: 1,
    type: "radio",
    name: "None",
    isSelected: false,
    counter: false,
  },
];
// Customizable Area End

export default class AddEventDetailController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiAcceptRequestCallId: any;
  apiCreateEventCallId: any;
  apiDeleteEventCallId: any;

  private readonly errorTitle = "Error";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    runEngine.attachBuildingBlock(this as IBlock, [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ]);
    this.receive = this.receive.bind(this);

    this.state = {
      // Customizable Area Start
      title: "",
      notes: "",
      loading: false,
      token: "",
      showTimePickerModal: false,
      showDatePickerModal: false,
      date: new Date(Date.now() + 6 * 1000),
      time: new Date(Date.now() + 6 * 1000),
      showAssignToList: false,
      showVisibilityList: false,
      showNotifyList: false,
      showRepeatList: false,
      showTime: false,
      showDate: true,
      repeatValue: [],
      notifyValue: {},
      visiblityValue: [],
      assignToValue: [],
      showRepeatValue: false,
      showNotifyValue: false,
      showVisiblityValue: false,
      showAssignToValue: false,
      event_type: "",
      lastAssigned: "Assign To",
      lastVisible: "Visibility",
      assignToList: ["None"],
      visibilityList: ["None"],
      selectedEventId: "",
      searchLocation: "Location",
      lat: "",
      lng: "",
      notifyList: [
        {
          id: 0,
          name: "One Day Before",
          isSelected: false,
        },
        {
          id: 1,
          name: "One Hour Before",
          isSelected: false,
        },
        {
          id: 2,
          name: "30 Minutes Before",
          isSelected: false,
        },
      ],

      repeatList: [
        {
          id: 0,
          name: "Never",
          isSelected: false,
        },
        {
          id: 1,
          name: "Every Day",
          isSelected: false,
        },
        {
          id: 2,
          name: "Every Week",
          isSelected: false,
        },
        {
          id: 3,
          name: "Every Month",
          isSelected: false,
        },
        {
          id: 4,
          name: "Every 2 Months",
          isSelected: false,
        },
        {
          id: 5,
          name: "Every Year",
          isSelected: false,
        },
        {
          id: 6,
          name: "Custom",
          isSelected: false,
        },
      ],
      partnerList: [],
      showClashModal: false,
      customRepeatFlag: false,
      customRepeat: "",
      role: "",
      isOwner: true,
      customRepeatDay: "",
      customRepeatDayValue: "1",
      showCustomRepeatList: false,
      showCustomRepeatValue: false,
      customRepeatValue: [],
      customRepeatList: [
        {
          id: 0,
          name: "Day",
          value: "day",
          isSelected: false,
        },
        {
          id: 1,
          name: "Week",
          value: "week",
          isSelected: true,
        },
        {
          id: 2,
          name: "Month",
          value: "month",
          isSelected: false,
        },
        {
          id: 3,
          name: "Year",
          value: "year",
          isSelected: false,
        },
      ],
      // Customizable Area End
    };
  }

  // Customizable Area Start
  _reloadEventData = () => {
    const calendarSelectedDate = new Date();
    this.setState({
      event_type: this.props.navigation.state.params.event,
      date: calendarSelectedDate
        ? new Date(calendarSelectedDate)
        : new Date(Date.now() + 6 * 1000),
    });
    const selectedEvent = this.props.navigation.state.params.event;
    if (selectedEvent.id) {
      // Assigned To Start
      const { assign_to } = selectedEvent;
      const assignedList = assign_to.map((item: any) => `${item.id}`);
      let lastAssigned;
      if (assign_to.length > 0) {
        lastAssigned = assign_to[assign_to.length - 1].nick_name
          ? assign_to[assign_to.length - 1].nick_name
          : assign_to[assign_to.length - 1].full_name;
      } else {
        lastAssigned = "Assign To";
      }
      // Assigned To End

      // Visible To Start
      const { visibility } = selectedEvent;
      const visibilityList = visibility.map((item: any) => `${item.id}`);
      let lastVisible;
      if (visibility.length > 0) {
        lastVisible = visibility[visibility.length - 1].nick_name
          ? visibility[visibility.length - 1].nick_name
          : visibility[visibility.length - 1].full_name;
      } else {
        lastVisible = "Visibility";
      }
      // Visible To End

      // Notify Start
      let notifyList: { id: any; name: any; isSelected: boolean }[] = [];
      let notifyData: any = {};
      this.state.notifyList.filter((item: any) => {
        if (item.name === selectedEvent?.notify) {
          notifyData = {
            id: item.id,
            name: item.name,
            isSelected: true,
          };
          notifyList.push(notifyData);
        } else {
          notifyList.push(item);
        }
      });
      // Notify End

      // Repeat Start
      let repeatList: { id: any; name: any; isSelected: boolean }[] = [];
      let repeatData: any = {};
      let customRepeatList: {
        id: any;
        name: any;
        value: any;
        isSelected: boolean;
      }[] = [];
      let customRepeatData: any = {};
      let customRepeatData1: any = {};
      this.state.repeatList.filter((item: any) => {
        if (item.name === selectedEvent?.repeat) {
          repeatData = {
            id: item.id,
            name: item.name,
            isSelected: true,
          };
          repeatList.push(repeatData);
        } else {
          repeatList.push(item);
        }
      });
      if (selectedEvent?.repeat === "Custom") {
        var repeatDay = selectedEvent?.custom_repeat_in_number;
        this.setState({
          showCustomRepeatValue: true,
          customRepeatFlag: true,
          customRepeatDayValue: repeatDay.toString(),
        });
        this.state.customRepeatList.filter((item: any) => {
          if (item.value === selectedEvent?.custom_repeat_every) {
            customRepeatData = {
              id: item.id,
              name: item.name,
              value: item.value,
              isSelected: true,
            };
            customRepeatList.push(customRepeatData);
          } else {
            customRepeatData1 = {
              id: item.id,
              name: item.name,
              value: item.value,
              isSelected: false,
            };
            customRepeatList.push(customRepeatData1);
          }
        });
      }
      // Repeat End
      this.setState({
        selectedEventId: selectedEvent.id,
        event_type: selectedEvent?.event_type,
        title: selectedEvent?.title,
        notes: selectedEvent?.notes,
        showTime: true,
        time: new Date(selectedEvent?.time),
        date: new Date(selectedEvent?.date),
        showDate: true,
        showNotifyValue: true,
        notifyValue: notifyData,
        notifyList: notifyList,
        showRepeatValue: true,
        repeatValue: repeatData,
        repeatList: repeatList,
        customRepeatValue: customRepeatData,
        customRepeatList: customRepeatList,
        assignToList: assignedList,
        lastAssigned: lastAssigned,
        visibilityList: visibilityList,
        lastVisible: lastVisible,
        role: selectedEvent?.role,
        isOwner: selectedEvent?.role === "Owner" ? true : false,
        lat: selectedEvent?.latitude,
        lng: selectedEvent?.longitude,
        searchLocation: selectedEvent?.address
          ? selectedEvent?.address
          : "Location",
      });
    }
  };

  async componentDidMount() {
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
        this._refreshLocationData();
        this._reloadEventData();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area End
  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  getUserEmailId = async () => {
    let userEmailId = configJSON.userEmailId;
    return userEmailId;
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      const subData = message.getData(getName(MessageEnum.EventsMessageData));
      if (subData?.selected_date) {
        this.setState({ date: new Date(subData?.selected_date) });
      }
    }
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = this.state.token;
      runEngine.debugLog("TOKEN", token);
      this.setState({ token: token });
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.apiCreateEventCallId !== null &&
      this.apiCreateEventCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.apiCreateEventCallId = null;

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      var errorResponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (responseJson && responseJson.data) {
        this.createEventSuccessCallBack(responseJson);
      }

      if (responseJson && responseJson.errors) {
        this.parseApiErrorResponse(responseJson.errors);
      } else {
        //Check Error Response
        this.createEventFailureCallBack(errorResponse);
      }
    } else if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.apiDeleteEventCallId !== null &&
      this.apiDeleteEventCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.apiDeleteEventCallId = null;

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      var errorResponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if (responseJson && responseJson.message) {
        this.createEventSuccessCallBack(responseJson);
      } else {
        //Check Error Response
        this.createEventFailureCallBack(errorResponse);
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  createEventSuccessCallBack = async (responseJson: any) => {
    this.setState({ loading: false });
    this.props.navigation.navigate("Events");
  };

  createEventFailureCallBack = (errorResponse: any) => {
    this.setState({ loading: false });
  };

  _refreshLocationData = () => {
    const { params } = this.props.navigation.state;
    if (params.location != null) {
      this.setState({
        lat: params.lat,
        lng: params.lng,
        searchLocation: params.location,
      });
    }
  };

  onPressSaveButton = async () => {
    if (!this.state.title) {
      this.showAlert("", "Please Enter Title");
      return;
    }

    let token = this.state.token;
    this.setState({ loading: true });

    const header = {
      "Content-Type": "application/json",
      token: token,
    };

    const attrs = {
      title: this.state.title,
      time: this.state.time,
      date: this.state.date,
      latitude: this.state.lat,
      longitude: this.state.lng,
      address:
        this.state.searchLocation === "Location"
          ? ""
          : this.state.searchLocation,
      assign_to: this.state.assignToList,
      visibility: this.state.visibilityList,
      notify: this.state.notifyValue.id,
      repeat: this.state.repeatValue.id ? this.state.repeatValue.id : 0,
      custom_repeat_in_number:
        this.state.repeatValue.id === 6 ? this.state.customRepeatDayValue : "",
      custom_repeat_every:
        this.state.repeatValue.id === 6
          ? this.state.customRepeatValue.value
            ? this.state.customRepeatValue.value
            : "week"
          : "",
      notes: this.state.notes,
      event_type: this.state.event_type,
    };

    const data = {
      attributes: attrs,
    };

    const httpBody = {
      data: data,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiCreateEventCallId = requestMessage.messageId;

    if (this.state.selectedEventId) {
      if (this.state.role === "Owner") {
        requestMessage.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          `/events/events/${this.state.selectedEventId}`
        );
      } else {
        // this.updateNotes();
      }
    } else {
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        "/events/events"
      );
    }

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    if (this.state.selectedEventId) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        "PUT"
      );
    } else {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        "POST"
      );
    }

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  deleteEvent = async () => {
    let token = await this.state.token;
    this.setState({ loading: true });

    const header = {
      "Content-Type": "application/json",
      token: token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.apiDeleteEventCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `/bx_block_events/events/${this.state.selectedEventId}`
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "DELETE"
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  };

  addZero = (i: any) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  convertTime = (str: any) => {
    if (Date.parse(str)) {
      let date = new Date(str);
      let h = this.addZero(date.getHours());
      let m = this.addZero(date.getMinutes());
      console.log(h);
      console.log(m);
      return [h + ":" + m];
    } else {
      return str;
    }
  };

  convertDate = (str: any) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
  };

  onPressAssignBtn = (item: any, type: keyof S) => {
    var tempList = this.state[type];
    const index = tempList.indexOf(item.id);
    const noneIndex = tempList.indexOf("None");
    if (noneIndex > -1) {
      tempList.splice(noneIndex, 1);
    }
    if (index > -1) {
      tempList.splice(index, 1);
    } else {
      tempList.push(item.id);
    }
    const newState: any = {
      [type]: tempList,
    };
    if (type === "assignToList") {
      newState.lastAssigned = item.name;
      newState.showAssignToList = false;
    } else {
      newState.lastVisible = item.name;
      newState.showVisibilityList = false;
    }
    this.setState(newState);
  };

  onPressAll = (type: string) => {      
   const newState: any = {
      [type]: ["All"],
    };
    if (type === "assignToList") {
      newState.lastAssigned = "All";
      newState.showAssignToList = false;
    } else {
      newState.lastVisible = "All";
      newState.showVisibilityList = false;
    }
    this.setState(newState);
  };

  onPressNone = (type: string) => {
    const newState: any = {
      [type]: ["None"],
    };
    if (type === "assignToList") {
      newState.lastAssigned = "None";
      newState.showAssignToList = false;
    } else {
      newState.lastVisible = "None";
      newState.showVisibilityList = false;
    }
    this.setState(newState);
  };

  onPressAssignToRadioBtn = (item: any) => {
    let tempList = this.state.assignToList;

    for (let i = 0; i < tempList.length; i++) {
      if (tempList[i].id == item.id) {
        tempList[i].isSelected = true;
        this.setState({ assignToValue: tempList[i], showAssignToValue: true });
      } else {
        tempList[i].isSelected = false;
      }
    }
    this.setState({ assignToList: tempList, showAssignToList: false });
  };

  assignToCheckBox = (item: any) => {
    let localRepeatList = this.state.assignToList;
    let selectIndex = localRepeatList.findIndex(
      (itemFilter: any) => itemFilter.id === item.id
    );
    (localRepeatList[selectIndex].isSelected =
      !localRepeatList[selectIndex].isSelected),
      this.setState({
        assignToList: localRepeatList,
        showAssignToList: false,
        showAssignToValue: true,
      });
  };

  onPressVisibilityRadioBtn = (item: any) => {
    let tempList = this.state.visibilityList;
    for (let i = 0; i < tempList.length; i++) {
      if (tempList[i].id == item.id) {
        tempList[i].isSelected = true;
        this.setState({
          visiblityValue: tempList[i],
          showVisiblityValue: true,
        });
      } else {
        tempList[i].isSelected = false;
      }
    }
    this.setState({ visibilityList: tempList, showVisibilityList: false });
  };

  visibilityCheck = (item: any) => {
    let localRepeatList = this.state.visibilityList;
    let selectIndex = localRepeatList.findIndex(
      (itemFilter: any) => itemFilter.id === item.id
    );

    (localRepeatList[selectIndex].isSelected =
      !localRepeatList[selectIndex].isSelected),
      this.setState({
        visibilityList: localRepeatList,
        showVisibilityList: false,
        showVisiblityValue: true,
      });
  };

  onPressVisibilityCheckBox = (item: any) => {
    !item.counter && item.isSelected
      ? this.onPressVisibilityRadioBtn(item)
      : this.visibilityCheck(item);
  };

  onPressNotifyRadioBtn = (item: any) => {
    var tempList = this.state.notifyList;
    for (var i = 0; i < tempList.length; i++) {
      if (tempList[i].id == item.id) {
        tempList[i].isSelected = true;
        this.setState({ notifyValue: tempList[i], showNotifyValue: true });
      } else {
        tempList[i].isSelected = false;
      }
    }
    this.setState({ notifyList: tempList, showNotifyList: false });
  };

  onPressRepeatRadioBtn = (item: any) => {
    var tempList = this.state.repeatList;
    for (var i = 0; i < tempList.length; i++) {
      if (tempList[i].id == item.id) {
        tempList[i].isSelected = true;
        this.setState({ repeatValue: tempList[i], showRepeatValue: true });
      } else {
        tempList[i].isSelected = false;
      }
    }
    this.setState({ repeatList: tempList, showRepeatList: false });
    if (item.name === "Custom") {
      this.setState({ customRepeatFlag: true });
    } else {
      this.setState({ customRepeatFlag: false });
    }
  };
  // Customizable Area End
}
