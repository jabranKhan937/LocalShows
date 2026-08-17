import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Location from "../../src/Location";

const tempCityList = [
  {
    id: 1,
    name: "testCity1",
    attributes: {
      name: "test city 1",
    },
  },
  {
    id: 2,
    name: "testCity2",
    attributes: {
      name: "test city 2",
    },
  },
];

const screenProps = {
  navigation: {
    navigate: jest.fn(),
  },
  id: "Location",
};

const feature = loadFeature("./__tests__/features/location-scenario.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to location", ({ given, when, then }) => {
    let locationBlock: ShallowWrapper;
    let instance: Location;

    given("I am a User loading location", () => {
      locationBlock = shallow(<Location {...screenProps} />);
    });

    when("I navigate to the location", () => {
      instance = locationBlock.instance() as Location;
    });

    then("location will load with out errors", () => {
      expect(locationBlock).toBeTruthy();
    });

    then("location will load screen based on state changes", () => {
      instance = locationBlock.instance() as Location;
      instance.componentDidMount();

      instance.setState({ allowAccess: true });
   
      instance.setState({ allowAccess: false });
  
    });

    then("location will able to click buttons", () => {
      let buttonComponent = locationBlock.findWhere(
        (node) => node.prop("testID") === "button-view-pad"
      );
      buttonComponent.simulate("press");

      instance = locationBlock.instance() as Location;
      instance.setState({ allowAccess: true });

      buttonComponent = locationBlock.findWhere(
        (node) => node.prop("testID") === "btnAllowLocation"
      );
      buttonComponent.simulate("press");

    });

    then("location get city without errors", () => {
      const msgRESTAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgRESTAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgRESTAPI.messageId
      );
      msgRESTAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [{}],
      });
      instance.getCityApiCallId = msgRESTAPI.messageId;
      runEngine.sendMessage("Unit Test", msgRESTAPI);
    });

    then("location update default city without errors", () => {
      const msgRESTAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgRESTAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgRESTAPI.messageId
      );
      msgRESTAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [{}],
      });
      instance.updateDefaultCityApiCallId = msgRESTAPI.messageId;
      runEngine.sendMessage("Unit Test", msgRESTAPI);
    });

    then("location get google map results without errors", () => {
      const msgRESTAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgRESTAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgRESTAPI.messageId
      );
      msgRESTAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [{}],
      });
      instance.googleMapAPIId = msgRESTAPI.messageId;
      runEngine.sendMessage("Unit Test", msgRESTAPI);
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(locationBlock).toBeTruthy();
    });
  });
});
