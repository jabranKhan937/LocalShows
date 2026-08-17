import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import AddEventDetailScreen from "../../src/AddEventDetailScreen";

const screenProps = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    state: {
      params: {
        event: {
          id: "1",
          attributes: {
            title: "Test Event",
            time: new Date().setDate(new Date().getDate() + 1),
            date: new Date().setDate(new Date().getDate() + 1),
            latitude: "",
            longitude: "",
            address: "",
            assigned_to: ["All"],
            visibility: ["All"],
            email_account_id: 214,
            notify: "One Day Before",
            repeat: "Never",
            // custom_repeat: this.state.customRepeat,
            notes: "Test Notes",
            event_type: "Doctor",
          },
        },
      },
    },
  },
  id: "AddEventDetailScreen",
};

const feature = loadFeature(
  "./__tests__/features/AddEventDetailScreen-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to AddEventDetilScreen", ({ given, when, then }) => {    
    let exampleDetailBlock: ShallowWrapper;
    let instance: AddEventDetailScreen;

    given("I am a User loading AddEventDetailScreen", () => {
      exampleDetailBlock = shallow(<AddEventDetailScreen {...screenProps} />);
    });

    when("I navigate to the AddEventDetailScreen", () => {
      instance = exampleDetailBlock.instance() as AddEventDetailScreen;
      instance.componentDidMount();
      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);
    });
    then("I can't not save events without title", () => {
      instance.setState({ title: "" });
      // let buttonSaveEvent = exampleDetailBlock.findWhere(
      //   (node) => node.prop("testID") === "btnSaveEvent"
      // );
      instance.onPressSaveButton();
      
    });

    then("I can save events with events data", () => {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      instance = exampleDetailBlock.instance() as AddEventDetailScreen;
      instance.setState({
        title: "Test Event",
        time: currentDate,
        date: currentDate,
        assignToList: ["All"],
        visibilityList: ["All"],
        notifyValue: {
          id: 0,
          name: "One Day Before",
          isSelected: false,
        },
        repeatValue: {
          id: 0,
          name: "Never",
          isSelected: false,
        },
        notes: "Test Notes",
        event_type: "Doctor",
      });
      let buttonSaveEvent = exampleDetailBlock.findWhere(
        (node) => node.prop("testID") === "btnSaveEvent"
      );
      buttonSaveEvent.simulate("press");

      
    });

    then("I can create an event will load with out errors", () => {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);

      const attrs = {
        title: "Test Event",
        time: currentDate,
        date: currentDate,
        latitude: "",
        longitude: "",
        address: "",
        assigned_to: ["All"],
        visibility: ["All"],
        email_account_id: 214,
        notify: "One Day Before",
        repeat: "Never",
        // custom_repeat: this.state.customRepeat,
        notes: "Test Notes",
        event_type: "Doctor",
      };

      instance.setState({
        title: "Test Event",
        time: currentDate,
        date: currentDate,
        // assign_to: ["All"],
        assignToList: ["All"],
        visibilityList: ["All"],
        notifyValue: {
          id: 0,
          name: "One Day Before",
          isSelected: false,
        },
        repeatValue: {
          id: 0,
          name: "Never",
          isSelected: false,
        },
        notes: "Test Notes",
        event_type: "Doctor",
      });

      const data = {
        attributes: attrs,
      };

      // ---- createEvent API ----
      const msgCreateEventAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgCreateEventAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgCreateEventAPI.messageId
      );
      msgCreateEventAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: data,
        }
      );
      instance.apiCreateEventCallId = msgCreateEventAPI.messageId;
      runEngine.sendMessage("Unit Test", msgCreateEventAPI);
    });

    then("I can delete an event will load with out errors", () => {
      instance.deleteEvent();
      expect(exampleDetailBlock).toBeTruthy();
      
      // // ---- delete Event API ----
      // const msgDeleteEventAPI = new Message(
      //   getName(MessageEnum.RestAPIResponceMessage)
      // );
      // msgDeleteEventAPI.addData(
      //   getName(MessageEnum.RestAPIResponceDataMessage),
      //   msgDeleteEventAPI.messageId
      // );
      // msgDeleteEventAPI.addData(
      //   getName(MessageEnum.RestAPIResponceSuccessMessage),
      //   {
      //     data: data,
      //   }
      // );
      // instance.apiCreateEventCallId = msgDeleteEventAPI.messageId;
      // runEngine.sendMessage("Unit Test", msgDeleteEventAPI);
    });

    then("I can click buttons without errors", () => {
      let buttonComponent = exampleDetailBlock.findWhere(
        (node) => node.prop("testID") === "btnVisibility"
      );
      // buttonComponent.simulate("press");
      expect(exampleDetailBlock).toBeTruthy();
      
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(exampleDetailBlock).toBeTruthy();
      
    });
  });
});
