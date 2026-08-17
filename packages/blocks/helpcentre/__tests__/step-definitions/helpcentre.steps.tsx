import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import HelpCentre from "../../src/HelpCentre";
import HelpCentreQA from "../../src/HelpCentreQA";
import HelpCentreSub from "../../src/HelpCentreSub";
import AboutUs from "../../src/AboutUs";

const testFn = jest.fn()
let getAuthTokenFn: () => void;

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: (_: string, fn: () => void) => {
      getAuthTokenFn = fn;
    },
    openDrawer: jest.fn()
  },
  id: "HelpCentre"
};

const mockFAQList = [
  {
    "id": 1,
    "question": "How do I purchase tickets through the Local Shows app?",
    "answer": "Purchasing tickets through the Local Shows app is quick and easy. Simply browse through the available shows, select the event you're interested in, and click on the Buy Tickets button. You will be redirected to a secure ticketing platform where you can choose your desired ticket quantity and complete your purchase. Once your transaction is confirmed, your tickets will be stored in the app for easy access on the day of the show. Get ready to rock!",
    "created_at": "2023-11-20T13:38:19.491Z",
    "updated_at": "2023-11-20T13:38:19.491Z",
    "isOpen": true,
  },
]

jest.useFakeTimers()

const feature = loadFeature("./__tests__/features/helpcentre-scenario.feature");
const helpCentreResponce = {
  data: ["a", "b"],
}
const helpCentreSubResponce = "[{\"id\":\"NavigationPayLoadMessage\",\"properties\":{\"HelpCentreMessageData\":{\"que_title\":\"subtype1\",\"que_array\":[{\"id\":\"1\",\"type\":\"question_sub_type\",\"attributes\":{\"id\":1,\"sub_type\":\"subtype1\",\"description\":\"This is sub type 1\",\"created_at\":\"2021-05-04T17:12:28.283Z\",\"updated_at\":\"2021-05-04T17:12:28.283Z\",\"question_answers\":{\"data\":[{\"id\":\"1\",\"type\":\"question_answer\",\"attributes\":{\"id\":1,\"question\":\"A question\",\"answer\":\"This is an answer\",\"created_at\":\"2021-05-04T17:25:40.392Z\",\"updated_at\":\"2021-05-04T17:25:40.392Z\"}}]}}}]}},\"messageId\":\"1909530b-f8bd-4375-8bf4-d598cfd9e983\"}]"

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User loads up the about us screen", ({ given, when, then }) => {
    let aboutUs: ShallowWrapper;
    let testLabel: ShallowWrapper;
    let backButton: ShallowWrapper;

    given("The screen loads up", () => {
      aboutUs = shallow(<AboutUs {...screenProps} />);
    });

    when("User visits the screen", () => {
      testLabel = aboutUs.findWhere(
        node => node.prop("testID") === "testLabel"
      );
      backButton = aboutUs.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      );
    });

    then("The contents are rendered properly", () => {
      expect(testLabel).toBeDefined();
    });

    then("User can go back", () => {
      backButton.simulate("press");
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("i click on hamburger icon" , () => {
      const hamburgerButton = aboutUs.findWhere((node) => node.prop("testID") === "hamburgerButton")
      console.log('hamburgerButton',hamburgerButton.debug())
      hamburgerButton.simulate("press")
    })

  });

  test("User navigates to helpcentre", ({ given, when, then }) => {
    let helpCentre: ShallowWrapper;
    let instance: HelpCentre;
    let testContainer: ShallowWrapper;
    let testElement: ShallowWrapper;
    let btnHideKeyboard: ShallowWrapper;
    let renderItem: ShallowWrapper;

    given("I am a User loading helpcentre", () => {
      helpCentre = shallow(<HelpCentre {...screenProps} />);
    });

    when("I navigate to the helpcentre", () => {
      instance = helpCentre.instance() as HelpCentre;

      const msgToken = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );
      msgToken.addData(
        getName(MessageEnum.SessionResponseToken),
        "TOKEN"
      );
      const NavigationPayLoadMessage = new Message(getName(MessageEnum.NavigationPayLoadMessage))
      let datapayload = {
        que_title:'test',
        que_array:[]
      }
      NavigationPayLoadMessage.addData(getName(MessageEnum.HelpCentreMessageData),datapayload)
      instance.handleNavigationPayload(NavigationPayLoadMessage)
      const NavigationPayLoadMessage2 = new Message(getName(MessageEnum.NavigationPayLoadMessage))
      let datapayload2 = null
      NavigationPayLoadMessage.addData(getName(MessageEnum.HelpCentreMessageData),datapayload2)
      instance.handleNavigationPayload(NavigationPayLoadMessage2)
      runEngine.sendMessage("Unit Test", msgToken);

      instance.getHelpCentreQA('test')
      instance.filterFAQData('how')


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
          data: helpCentreResponce
        }
      );

      instance.getHelpCentreApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      let aboutUsAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      aboutUsAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        aboutUsAPI.messageId
      );

      aboutUsAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": [
              {
                  "id": "1",
                  "type": "setting",
                  "attributes": {
                      "title": "Test",
                      "description": "<p><strong>Test </strong>demo in <em>Admin </em><u>Console</u></p>",
                      "image": null
                  }
              }
          ]
      }
      );

      instance.getAboutUsApiCallId = aboutUsAPI.messageId;
      runEngine.sendMessage("Unit Test", aboutUsAPI);

      aboutUsAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      aboutUsAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        aboutUsAPI.messageId
      );

      instance.getAboutUsApiCallId = aboutUsAPI.messageId;
      runEngine.sendMessage("Unit Test", aboutUsAPI);


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
      instance.getHelpCentreApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      const getFAQAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getFAQAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getFAQAPI.messageId);
      getFAQAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), []);
      instance.getFAQApiCallId = getFAQAPI.messageId
      runEngine.sendMessage("Unit Test", getFAQAPI)

      instance.gotoSubScreen(null);

      instance.gotoHelpCentreQA(null, []);

      instance.getFAQListAPI()

      instance.showHideAnswers(0)

    });

    then("User press a button", () => {
      let buttonComponent = helpCentre.findWhere(
        (node) => node.prop("testID") === "hamburgerMenu"
      );
      buttonComponent.simulate("press");

      buttonComponent = helpCentre.findWhere(
        (node) => node.prop("testID") === "navigateBack"
      );
      buttonComponent.simulate("press");

      const flatList = helpCentre.findWhere(node => node.prop("testID") === "faqsList");
      mockFAQList.forEach((item, index) => {
        const innerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        flatList.renderProp("ListEmptyComponent")();
        flatList.renderProp("keyExtractor")({item});
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "questionClick"
        ).simulate("press");
      })

      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    then("User performs search", () => {
      let txtInputCellPhone = helpCentre.findWhere(
        (node) => node.prop("testID") === "searchInputText"
      );
      txtInputCellPhone.simulate("changeText", "search");
      expect(instance.state.searchInput).toBe("search")
    })

    when("user click on hamburger icon" , () => {
      const hamburgerMenu = helpCentre.findWhere((node) => node.prop("testID") === "hamburgerMenu")
      console.log('hamburgerMenu',hamburgerMenu.debug())
      hamburgerMenu.simulate("press")
    })
  });

  test("User navigates to helpcentreQA", ({ given, when, then }) => {
    let helpCentre: ShallowWrapper;
    let instance: HelpCentreQA;
    let testView: ShallowWrapper;
    let hideKeyboardButton: ShallowWrapper;
    let renderItem: ShallowWrapper;
    let testButton: ShallowWrapper;

    given("I am a User loading helpcentreQA", () => {
      helpCentre = shallow(<HelpCentreQA {...screenProps} />);
    });

    when("I navigate to the helpcentreQA", () => {
      instance = helpCentre.instance() as HelpCentreQA;
      testView = helpCentre.findWhere(
        node => node.prop("testID") === "testView"
      );
    });

    then("helpcentreQA will load with out errors", () => {
      expect(testView).toBeDefined();
    });

    when("I pass some data to renderItem", () => {
      const itemToRender = {
        attributes: {
          que_type: "abc",
          answer: "def",
        }
      }
      renderItem = shallow(<instance.renderItem item={{}} />);
      renderItem = shallow(<instance.renderItem item={itemToRender} />);
      testButton = renderItem.findWhere(
        node => node.prop("testID") === "testButton"
      );
    });

    then("items are rendered", () => {
      expect(testButton).toBeDefined();
    });

    given("I can find the button to hide keyboard", () => {
      hideKeyboardButton = helpCentre.findWhere(
        node => node.prop("testID") === "hideKeyboardButton"
      );
    });

    when("I click the button to hide keyboard", () => {
      instance.hideKeyboard = jest.fn();
      hideKeyboardButton.simulate("press");
    });

    then("hideKeyboard() is called", () => {
      expect(instance.hideKeyboard).toHaveBeenCalled();
    });
  });

  test("User navigates to helpcentreSub", ({ given, when, then }) => {
    let helpCentre: ShallowWrapper;
    let instance: HelpCentreSub;
    let testView: ShallowWrapper;
    let hideKeyboard: ShallowWrapper;
    let renderItem: ShallowWrapper;
    let testButton: ShallowWrapper;

    given("I am a User loading helpcentreSub", () => {
      helpCentre = shallow(<HelpCentreSub {...screenProps} />);
    });

    when("I navigate to the helpcentreSub", () => {
      instance = helpCentre.instance() as HelpCentreSub;
      testView = helpCentre.findWhere(
        node => node.prop("testID") === "testView"
      );
    });

    then("helpcentreSub will load with out errors", () => {
      expect(testView).toBeDefined();
    });

    when("I pass some data to renderItem", () => {
      const itemToRender = {
        attributes: {
          que_type: "abc"
        }
      }
      renderItem = shallow(<instance.renderItem item={{}} />);
      renderItem = shallow(<instance.renderItem item={itemToRender} />);
      testButton = renderItem.findWhere(
        node => node.prop("testID") === "testButton"
      );
    });

    then("items are rendered", () => {
      expect(testButton).toBeDefined();
    });

    when("I click on go to subscreen button", () => {
      testButton.simulate("press");
      instance.gotoHelpCentreQA = testFn;
      testButton.simulate("press");
    });

    then("I can go to the subscreen", () => {
      expect(testFn).toHaveBeenCalled();
    });

    given("I can find the button to hide keyboard", () => {
      hideKeyboard = helpCentre.findWhere(
        node => node.prop("testID") === "hideKeyboard"
      );
    });

    when("I click the button to hide keyboard", () => {
      instance.hideKeyboard = jest.fn();
      hideKeyboard.simulate("press");
    });

    then("hideKeyboard() is called", () => {
      expect(instance.hideKeyboard).toHaveBeenCalled();
    });

  });
});
