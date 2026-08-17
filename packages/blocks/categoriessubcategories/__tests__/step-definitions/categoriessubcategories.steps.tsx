import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Categoriessubcategories from "../../src/Categoriessubcategories";

const mockAPISuccessCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
  msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  instance[apiCallID] = msgSucessRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgSucessRestAPI)
}

const mockAPIFailureCall = (instance: any, apiCallID: string, apiData: object) => {
  const msgFailureRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgFailureRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgFailureRestAPI.messageId);
  msgFailureRestAPI.addData(getName(MessageEnum.RestAPIResponceErrorMessage), apiData);
  instance[apiCallID] = msgFailureRestAPI.messageId
  const { receive: MockRecieve } = instance
  MockRecieve("", msgFailureRestAPI)
}

const mockErrorResponse = {
  "errors": []
}

const mockSuccessResponse = {
  "data": {
    "id": "66",
    "type": "user_selection",
    "attributes": {
      "account_id": 569,
      "categories": [
        "Art",
        "Enjoyment",
        "Music"
      ],
      "subcategories": [
        "Architecture",
        "Ceramic",
        "Collage",
        "Burlesque",
        "Comedy",
        "Dance",
        "Acoustic",
        "Alternative Music",
        "Blues"
      ],
      "band_artists": [
        "astha"
      ],
      "states": [
        "Alaska",
        "Florida"
      ],
      "influences": [],
      "affiliates": [],
      "user_categories": [
        {
          "id": 1,
          "category": {
            "id": 8,
            "name": "Art",
            "created_at": "2023-10-03T02:46:13.375-07:00",
            "updated_at": "2024-08-25T22:32:48.957-07:00",
            "user_sub_categories": [
              {
                "id": 7,
                "created_at": "2024-08-27T00:50:35.307-07:00",
                "updated_at": "2024-08-27T00:50:35.307-07:00",
                "sub_category": {
                  "id": 74,
                  "name": "Architecture",
                  "parent_id": 8,
                  "created_at": "2024-03-05T02:35:30.597-08:00",
                  "updated_at": "2024-03-05T02:35:30.597-08:00"
                }
              }
            ]
          },
          "created_at": "2024-08-26T02:46:27.357-07:00",
          "updated_at": "2024-08-26T02:46:27.357-07:00"
        },
        {
          "id": 4,
          "category": {
            "id": 8,
            "name": "Art",
            "created_at": "2023-10-03T02:46:13.375-07:00",
            "updated_at": "2024-08-25T22:32:48.957-07:00",
            "user_sub_categories": [
              {
                "id": 7,
                "created_at": "2024-08-27T00:50:35.307-07:00",
                "updated_at": "2024-08-27T00:50:35.307-07:00",
                "sub_category": {
                  "id": 74,
                  "name": "Architecture",
                  "parent_id": 8,
                  "created_at": "2024-03-05T02:35:30.597-08:00",
                  "updated_at": "2024-03-05T02:35:30.597-08:00"
                }
              }
            ]
          },
          "created_at": "2024-08-26T02:50:49.506-07:00",
          "updated_at": "2024-08-26T02:50:49.506-07:00"
        },
        {
          "id": 9,
          "category": {
            "id": 7,
            "name": "Enjoyment",
            "created_at": "2023-10-03T02:46:13.354-07:00",
            "updated_at": "2024-08-25T22:32:57.745-07:00",
            "user_sub_categories": [
              {
                "id": 10,
                "created_at": "2024-08-27T00:52:16.959-07:00",
                "updated_at": "2024-08-27T00:52:16.959-07:00",
                "sub_category": {
                  "id": 77,
                  "name": "Burlesque",
                  "parent_id": 7,
                  "created_at": "2024-03-05T02:36:45.793-08:00",
                  "updated_at": "2024-03-05T02:36:45.793-08:00"
                }
              }
            ]
          },
          "created_at": "2024-08-27T00:52:16.954-07:00",
          "updated_at": "2024-08-27T00:52:16.954-07:00"
        },
        {
          "id": 10,
          "category": {
            "id": 6,
            "name": "Music",
            "created_at": "2023-10-03T02:46:13.337-07:00",
            "updated_at": "2024-08-25T22:33:04.170-07:00",
            "user_sub_categories": [
              {
                "id": 11,
                "created_at": "2024-08-27T00:52:16.971-07:00",
                "updated_at": "2024-08-27T00:52:16.971-07:00",
                "sub_category": {
                  "id": 80,
                  "name": "Acoustic",
                  "parent_id": 6,
                  "created_at": "2024-03-05T02:37:38.611-08:00",
                  "updated_at": "2024-03-05T02:37:38.611-08:00"
                }
              }
            ]
          },
          "created_at": "2024-08-27T00:52:16.966-07:00",
          "updated_at": "2024-08-27T00:52:16.966-07:00"
        }
      ]
    }
  }
}

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
  },
  id: "Categoriessubcategories",
};

const feature = loadFeature(
  "./__tests__/features/categoriessubcategories-scenario.feature"
);

const categoriesResponse = {
  data: {
    Art: [
      {
        id: "74",
        type: "sub_category",
        attributes: {
          id: 74,
          name: "Architecture",
          created_at: "2024-03-05T10:35:30.597Z",
          updated_at: "2024-03-05T10:35:30.597Z",
          parent_id: 8,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
      {
        id: "75",
        type: "sub_category",
        attributes: {
          id: 75,
          name: "Ceramic",
          created_at: "2024-03-05T10:35:45.048Z",
          updated_at: "2024-03-05T10:36:24.219Z",
          parent_id: 8,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
      {
        id: "76",
        type: "sub_category",
        attributes: {
          id: 76,
          name: "Collage",
          created_at: "2024-03-05T10:36:03.981Z",
          updated_at: "2024-03-05T10:36:03.981Z",
          parent_id: 8,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
    ],
    Enjoyment: [
      {
        id: "77",
        type: "sub_category",
        attributes: {
          id: 77,
          name: "Burlesque",
          created_at: "2024-03-05T10:36:45.793Z",
          updated_at: "2024-03-05T10:36:45.793Z",
          parent_id: 7,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
      {
        id: "78",
        type: "sub_category",
        attributes: {
          id: 78,
          name: "Comedy",
          created_at: "2024-03-05T10:37:01.232Z",
          updated_at: "2024-03-05T10:37:01.232Z",
          parent_id: 7,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
      {
        id: "79",
        type: "sub_category",
        attributes: {
          id: 79,
          name: "Dance",
          created_at: "2024-03-05T10:37:16.629Z",
          updated_at: "2024-03-05T10:37:16.629Z",
          parent_id: 7,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
    ],
    Music: [
      {
        id: "80",
        type: "sub_category",
        attributes: {
          id: 80,
          name: "Acoustic",
          created_at: "2024-03-05T10:37:38.611Z",
          updated_at: "2024-03-05T10:37:38.611Z",
          parent_id: 6,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
      {
        id: "81",
        type: "sub_category",
        attributes: {
          id: 81,
          name: "Alternative Music",
          created_at: "2024-03-05T10:37:54.903Z",
          updated_at: "2024-03-05T10:37:54.903Z",
          parent_id: 6,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
      {
        id: "82",
        type: "sub_category",
        attributes: {
          id: 82,
          name: "Blues",
          created_at: "2024-03-05T10:38:07.076Z",
          updated_at: "2024-03-05T10:38:07.076Z",
          parent_id: 6,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
    ],
    Other: [
      {
        id: "83",
        type: "sub_category",
        attributes: {
          id: 83,
          name: "Other Show",
          created_at: "2024-03-05T10:38:48.171Z",
          updated_at: "2024-03-05T10:38:48.171Z",
          parent_id: 9,
          rank: null,
          approved_by_admin: true,
          account_id: null,
        },
      },
    ],
  },
};

const artistResponse = {
  "data": [
    {
      "id": 219,
      "first_name": "123",
      "email": "astha.gupta+11@metafic.co",
      "created_at": "2024-03-01T12:52:20.566Z",
      "role_id": 9
    },
    {
      "id": 215,
      "first_name": "a1",
      "email": "astha.gupta+4@metafic.co",
      "created_at": "2024-02-27T08:27:17.662Z",
      "role_id": 9
    },
  ]
}

const statesResponse = {
  "state": {
    "AK": "Alaska",
    "AL": "Alabama",
  }
}

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('navigateBack')),
  get: jest.fn().mockImplementation(() => Promise.resolve('true')),
}));

jest.useFakeTimers()

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to categoriessubcategories", ({ given, when, then }) => {
    let categoryWrapper: ShallowWrapper;
    let instance: Categoriessubcategories;
    let pageTitle: ShallowWrapper;

    given("I am a User loading categoriessubcategories", () => {
      categoryWrapper = shallow(<Categoriessubcategories {...screenProps} />);
    });

    when("I navigate to the categoriessubcategories", () => {
      instance = categoryWrapper.instance() as Categoriessubcategories;

      mockAPISuccessCall(instance, "saveDataAPICallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "saveDataAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "saveDataAPICallId", mockErrorResponse)
      instance.setState({affiliates:['test','test 2']})
      instance.handleRemoveAffiliate('test')
      instance.setState({selectedArtists:['test','test 2']})
      instance.setState({influences:['test','test 2']})
      instance.setState({influenceTxt:'test'})
      instance.setState({userRole:'fan'})
      instance.handleRemoveArtist('test')
      instance.handleArtistSelection()
      instance.setState({userRole:'band'})
      instance.setState({selectedArtists:['test','test 2']})
      instance.setState({influences:['test','test 2']})
      instance.setState({influenceTxt:'test3'})
      instance.handleArtistSelection()
      instance.handleRemoveArtist('test')
      instance.setState({subcategories:{
        test:['test','test 2'],
        test2:['test','test 2']
      }})
      instance.handleRemoveSubcat('test','test2')
      const noPayload = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", noPayload);

      const payloadWithEventId = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      payloadWithEventId.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          affiliates: "affiliates",
          influences: "influences",
        }
      );
      runEngine.sendMessage("Unit Test", payloadWithEventId);

      pageTitle = categoryWrapper.findWhere(
        (node) => node.prop("testID") === "pageTitle"
      );

      const getCategoriesAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getCategoriesAPI.messageId
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        categoriesResponse
      );
      instance.getCategoriesApiCallId = getCategoriesAPI.messageId;
      runEngine.sendMessage("Unit Test", getCategoriesAPI);
    });

    then("categoriessubcategories will load with out errors", () => {
      expect(pageTitle).toBeDefined();
    });
  });

  test("Test tab buttons", ({ given, when, then }) => {
    let categoryWrapper: ShallowWrapper;
    let instance: Categoriessubcategories;
    let firstTabButton: ShallowWrapper;
    let secondTabButton: ShallowWrapper;
    let thirdTabButton: ShallowWrapper;
    let pageTitle: ShallowWrapper;

    given("I am a User loading categoriessubcategories", () => {
      categoryWrapper = shallow(<Categoriessubcategories {...screenProps} />);
      instance = categoryWrapper.instance() as Categoriessubcategories;
      const getCategoriesAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getCategoriesAPI.messageId
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        categoriesResponse
      );
      instance.getCategoriesApiCallId = getCategoriesAPI.messageId;
      runEngine.sendMessage("Unit Test", getCategoriesAPI);

      pageTitle = categoryWrapper.findWhere(
        (node) => node.prop("testID") === "pageTitle"
      );

      firstTabButton = categoryWrapper.findWhere(
        (node) => node.prop("testID") === "firstTabButton"
      );

      secondTabButton = categoryWrapper.findWhere(
        (node) => node.prop("testID") === "secondTabButton"
      );

      thirdTabButton = categoryWrapper.findWhere(
        (node) => node.prop("testID") === "thirdTabButton"
      );
    });

    when("I click the tab switching buttons", () => {
      firstTabButton.simulate("press");
      secondTabButton.simulate("press");
      thirdTabButton.simulate("press");
    });

    then("I can switch between tabs", () => {
      expect(pageTitle).toBeDefined();
    });
  });

  test("Render Selector", ({ given, when, then }) => {
    let categoryWrapper: ShallowWrapper;
    let renderSelectorItemWrapper: ShallowWrapper;
    let instance: Categoriessubcategories;
    let pageTitle: ShallowWrapper;

    given("I am a User loading renderSelectorItem", () => {
      categoryWrapper = shallow(<Categoriessubcategories {...screenProps} />);
      instance = categoryWrapper.instance() as Categoriessubcategories;
      pageTitle = categoryWrapper.findWhere(
        (node) => node.prop("testID") === "pageTitle"
      );
      const getCategoriesAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getCategoriesAPI.messageId
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        categoriesResponse
      );
      instance.getCategoriesApiCallId = getCategoriesAPI.messageId;
      runEngine.sendMessage("Unit Test", getCategoriesAPI);
    });

    when("I pass the correct data", () => {
      renderSelectorItemWrapper = shallow(<instance.renderSelectorItem item="Art" />);

      const picker = renderSelectorItemWrapper.findWhere(
        (node) => node.prop("testID") === "subcategoryPicker"
      );
      picker.simulate("valueChange", "Architecture");
      picker.simulate("valueChange", "Architecture");
    });

    then("it renders properly", () => {
      expect(pageTitle).toBeDefined();
    });
  });

  test("Render based on tabs", ({ given, when, then }) => {
    let categoryWrapper: ShallowWrapper;
    let renderBasedOnTabsWrapper: ShallowWrapper;
    let instance: Categoriessubcategories;
    let pageTitle: ShallowWrapper;

    given("I am a User loading categoriessubcategories", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      categoryWrapper = shallow(<Categoriessubcategories {...screenProps} />);
      instance = categoryWrapper.instance() as Categoriessubcategories;

      const getCategoriesAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getCategoriesAPI.messageId
      );
      getCategoriesAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        categoriesResponse
      );
      instance.getCategoriesApiCallId = getCategoriesAPI.messageId;
      runEngine.sendMessage("Unit Test", getCategoriesAPI);

      const getArtistsAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getArtistsAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getArtistsAPI.messageId
      );
      getArtistsAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        artistResponse
      );
      instance.getArtistsApiCallId = getArtistsAPI.messageId;
      runEngine.sendMessage("Unit Test", getArtistsAPI);

      instance.setState({ token: "token" });
      instance.getArtists();
      instance.getCategories();
      instance.getStates();

      const getStatesAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      getStatesAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getStatesAPI.messageId
      );
      getStatesAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { errors: "abc" }
      );
      instance.getStatesApiCallId = getStatesAPI.messageId;
      runEngine.sendMessage("Unit Test", getStatesAPI);

      getStatesAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        statesResponse
      );
      instance.getStatesApiCallId = getStatesAPI.messageId;
      runEngine.sendMessage("Unit Test", getStatesAPI);

    });

    when("I click the tab switching buttons", () => {
      renderBasedOnTabsWrapper = shallow(<instance.conditionalRenderngBasedOnActiveTab />);
      pageTitle = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "pageTitle"
      );
      let nextBtn = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "btnNext1"
      );
      nextBtn.simulate("press");

      renderBasedOnTabsWrapper = shallow(<instance.conditionalRenderngBasedOnActiveTab />);

      nextBtn = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "btnNext2"
      );
      nextBtn.simulate("press");

      renderBasedOnTabsWrapper = shallow(<instance.conditionalRenderngBasedOnActiveTab />);

      let statePicker = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "statePicker"
      );
      statePicker.simulate("valueChange", "AK");

      let btnShowAltState = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "btnShowAltState"
      );
      btnShowAltState.simulate("press");

      renderBasedOnTabsWrapper = shallow(<instance.conditionalRenderngBasedOnActiveTab />);
      statePicker = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "stateAltPicker"
      );
      statePicker.simulate("valueChange", "AL");

      let saveBtn = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "saveBtn"
      );
      saveBtn.simulate("press");
      instance.getUserCategories(categoriesResponse.data, ["Dance"])

      instance.setState({ userRole: "band" });
      renderBasedOnTabsWrapper = shallow(<instance.conditionalRenderngBasedOnActiveTab />);

      let affiliateTextInput = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "txtInputAffiliates"
      );
      affiliateTextInput.simulate("submitEditing");
      affiliateTextInput.simulate("changeText", "Abc");
      affiliateTextInput.simulate("submitEditing");

      renderBasedOnTabsWrapper = shallow(<instance.conditionalRenderngBasedOnActiveTab />);

      saveBtn = renderBasedOnTabsWrapper.findWhere(
        (node) => node.prop("testID") === "saveBtn"
      );
      saveBtn.simulate("press");
    });

    then("I can render scenarios", () => {
      expect(pageTitle).toBeDefined();
    });

    test("Pickers in iOS", ({ given, when, then }) => {
      let categoriesSubcategoriesWrapper: ShallowWrapper;
      let conditionalRenderngBasedOnActiveTab: ShallowWrapper;
      let renderSelectorItemWrapper: ShallowWrapper;
      let instance: Categoriessubcategories;
      let btnStateSelect: ShallowWrapper;
      let pageTitle: ShallowWrapper;

      given("I am a User loading categoriessubcategories", () => {
        jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
          OS: 'ios',
          select: jest.fn(),
        }))
        jest.doMock("../../../../framework/src/Utilities", () => ({
          getStorageData: () => Promise.resolve("true"),
        }));
        categoriesSubcategoriesWrapper = shallow(
          <Categoriessubcategories {...screenProps} />
        );

        instance = categoriesSubcategoriesWrapper.instance() as Categoriessubcategories;
        const loadFn = instance.loadCategoriesData
        loadFn();

        const getStatesAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        getStatesAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          getStatesAPI.messageId
        );
        getStatesAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          { errors: "abc" }
        );
        instance.getStatesApiCallId = getStatesAPI.messageId;
        runEngine.sendMessage("Unit Test", getStatesAPI);

        const getArtistsAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        getArtistsAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          getArtistsAPI.messageId
        );
        getArtistsAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          artistResponse
        );
        instance.getArtistsApiCallId = getArtistsAPI.messageId;
        runEngine.sendMessage("Unit Test", getArtistsAPI);

        const getCategoriesAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        getCategoriesAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          getCategoriesAPI.messageId
        );
        getCategoriesAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          categoriesResponse
        );
        instance.getCategoriesApiCallId = getCategoriesAPI.messageId;
        runEngine.sendMessage("Unit Test", getCategoriesAPI);

        getStatesAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          statesResponse
        );
        instance.getStatesApiCallId = getStatesAPI.messageId;
        runEngine.sendMessage("Unit Test", getStatesAPI);

        renderSelectorItemWrapper = shallow(<instance.renderSelectorItem item="Art" />);
        pageTitle = renderSelectorItemWrapper.findWhere(
          (node) => node.prop("testID") === "pageTitle"
        );

        let pickerToggle = renderSelectorItemWrapper.findWhere(
          (node) => node.prop("testID") === "btnToggleIosModal"
        );

        pickerToggle.simulate("press");

        let picker = categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "pickerModal"
        );

        picker.simulate("valueChange", "Architecture");

        categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "hideModal"
        ).simulate("press")

        instance.setState({ activeTab: 1 });

        conditionalRenderngBasedOnActiveTab = shallow(
          <instance.conditionalRenderngBasedOnActiveTab />
        )

        conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "influencesTextInput"
        ).simulate("changeText", "test");

        conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "influencesTextInput"
        ).simulate("submitEditing");

        conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "influencesTextInput"
        ).simulate("changeText", " ");

        conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "influencesTextInput"
        ).simulate("submitEditing");

        conditionalRenderngBasedOnActiveTab = shallow(
          <instance.conditionalRenderngBasedOnActiveTab />
        )

        picker = categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "pickerModal"
        );

        picker.simulate("valueChange", "123");
        
        categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "hideModal"
        ).simulate("press")

        instance.setState({ activeTab: 2 });

        conditionalRenderngBasedOnActiveTab = shallow(
          <instance.conditionalRenderngBasedOnActiveTab />
        )

        btnStateSelect = conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "btnToggleIosStateModal"
        );

        btnStateSelect.simulate("press");

        picker = categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "statePickerModal"
        );

        picker.simulate("valueChange", "AK");

        categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "hideStatePickerModal"
        ).simulate("press")

        let btnShowAltState = conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "btnShowAltState"
        );
        btnShowAltState.simulate("press");

        conditionalRenderngBasedOnActiveTab = shallow(
          <instance.conditionalRenderngBasedOnActiveTab />
        )

        btnStateSelect = conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "btnToggleIosStateAltModal"
        );

        btnStateSelect.simulate("press");

        picker = categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "statePickerModal"
        );

        picker.simulate("valueChange", "AK");

        categoriesSubcategoriesWrapper.findWhere(
          (node) => node.prop("testID") === "hideStatePickerModal"
        ).simulate("press")
      });

      when("I load categoriessubcategories", () => {
        instance.setState({ userRole: 'band', activeTab: 1 })

        conditionalRenderngBasedOnActiveTab = shallow(
          <instance.conditionalRenderngBasedOnActiveTab />
        )
        conditionalRenderngBasedOnActiveTab.findWhere(
          (node) => node.prop("testID") === "influencesTextInput"
        ).simulate("submitEditing");

      });

      then("it renders properly", () => {
        expect(pageTitle).toBeDefined();
      });
    });
    test("The APIs should not be called if token is empty",({given,when,then})=>{
      given("user enters catagory page",()=>{
        categoryWrapper = shallow(<Categoriessubcategories {...screenProps}/>);
        instance = categoryWrapper.instance() as Categoriessubcategories;
      });
      when("token is empty or invalid",()=>{
        spyOn(instance,"getArtists")
        instance.setState({token:""});
        instance.handleSaveData();
        instance.getArtists();
        instance.getCategories();
        instance.getStates();
      })
      then("the api would not be called",()=>{
        expect(instance.getArtists).toBeCalledTimes(3)
      })
    })
  });
});
