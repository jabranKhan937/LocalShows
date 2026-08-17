import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Customisableusersubscriptions from "../../src/Customisableusersubscriptions";
import SubscriptionDetails from "../../src/SubscriptionDetails";

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
  },
  id: "Customisableusersubscriptions",
  route: {},
  data: {},
};

const feature = loadFeature(
  "./__tests__/features/customisableusersubscriptions-scenario.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("User navigates to customisableusersubscriptions", ({
    given,
    when,
    then,
  }) => {
    let customisableusersubscriptionsBlock: ShallowWrapper;
    let instance: Customisableusersubscriptions;

    given("I am a User loading customisableusersubscriptions", () => {
      customisableusersubscriptionsBlock = shallow(
        <Customisableusersubscriptions {...screenProps} />
      );
    });

    when("I navigate to the customisableusersubscriptions", () => {
      instance = customisableusersubscriptionsBlock.instance() as Customisableusersubscriptions;
    });

    then("customisableusersubscriptions will load with out errors", () => {
      expect(customisableusersubscriptionsBlock).toBeTruthy();
      expect(customisableusersubscriptionsBlock).toMatchSnapshot();

      const msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: [{"id":"1","type":"subscription","attributes":{"name":"Test Subscription","price":"100.0","description":"Description of the subscription","valid_up_to":"2022-02-02","expired":false,"image_link":null,"subscribed":false}},{"id":"2","type":"subscription","attributes":{"name":"iPad App","price":"500.0","description":"This is a month iPad App","valid_up_to":"2016-02-03","expired":true,"image_link":"/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--0c99d2419f59ed2dbe813a272bfb342861d45cfd/Home.png","subscribed":false}},{"id":"3","type":"subscription","attributes":{"name":"New test sub","price":"888.0","description":"Desc","valid_up_to":"2024-10-18","expired":false,"image_link":null,"subscribed":false}}]
        }
      );
      instance.getListCallId = msgValidationAPI.messageId;
      
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      const msgError = new Message(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      msgError.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );
      msgError.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {
        data: []
      });
      instance.getListCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(customisableusersubscriptionsBlock).toBeTruthy();
      expect(customisableusersubscriptionsBlock).toMatchSnapshot();
    });
  });

  test("User navigates to subscriptiondetails", ({
    given,
    when,
    then,
  }) => {
    let subscriptionDetailsBlock: ShallowWrapper;
    let instance: SubscriptionDetails;

    given("I am a User loading subscriptiondetails", () => {
      subscriptionDetailsBlock = shallow(
        <SubscriptionDetails {...screenProps} />
      );
    });

    when("I navigate to the subscriptiondetails", () => {
      instance = subscriptionDetailsBlock.instance() as Customisableusersubscriptions;
      instance.setState({"data": [{"id":"1","type":"subscription","attributes":{"name":"Test Subscription","price":"100.0","description":"Description of the subscription","valid_up_to":"2022-02-02","expired":false,"image_link":null,"subscribed":false}},{"id":"2","type":"subscription","attributes":{"name":"iPad App","price":"500.0","description":"This is a month iPad App","valid_up_to":"2016-02-03","expired":true,"image_link":"/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--0c99d2419f59ed2dbe813a272bfb342861d45cfd/Home.png","subscribed":false}},{"id":"3","type":"subscription","attributes":{"name":"New test sub","price":"888.0","description":"Desc","valid_up_to":"2024-10-18","expired":false,"image_link":null,"subscribed":false}}]});
    });

    then("subscriptiondetails will load with out errors", () => {
      expect(subscriptionDetailsBlock).toBeTruthy();
      expect(subscriptionDetailsBlock).toMatchSnapshot();

      const payloadMessage = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", payloadMessage);

    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(subscriptionDetailsBlock).toBeTruthy();
      expect(subscriptionDetailsBlock).toMatchSnapshot();
    });
  });

});
