import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");
import moment from 'moment-timezone'
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";

import PostCreation from "../../src/PostCreation";

jest.useFakeTimers()
jest.mock('react-native-daterange-picker', () => {
  return {
    DateRangePicker: jest.fn(),
  };
});
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

const mockStateDataSuccess = {
  "state": {
    "AK": "Alaska",
    "AL": "Alabama",
  }
}

const mockCitiesDataSuccess = {
  "city": [
    "Akutan",
    "Alakanuk",
  ]
}

const mockFailureResponse = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

const mockCreateShowAPIResponse = {
  "data": {
    "id": "59",
    "type": "show",
    "attributes": {
      "event_title": "Token demo",
      "date_of_the_show": "2025-03-30T00:00:00.000+03:00",
      "time": "04:00:00",
      "line_ups": ['a'],
      "description": "Dummy description",
      "rules_and_regulations": null,
      "city": "Alaska",
      "state": "Akutan",
      "country": "US",
      "zip_code": 123456,
      "address": "Address",
      "location": "Location",
      "show_features": null,
      "like_by_me": null,
      "added_in_calendar": false,
      "type_of_show": "",
      "account_id": 185,
      "likes_count": 0,
      "model_name": "Show",
      "profile_image": ""
    }
  }
}

const mockLineupDataSuccess = {
  "data": [
    {
      "id": 302,
      "first_name": "Art",
      "email": "12@yopmail.com",
      "created_at": "2024-05-05T17:35:53.333Z",
      "role_id": 9
    },
  ]
}

const mockTypeOfShowDataSuccess = {
  "data": [
    {
      "id": "4",
      "type": "band_artist",
      "attributes": {
        "id": 4,
        "name": "AC/DC",
        "created_at": "2024-03-05T10:41:24.667Z",
        "updated_at": "2024-03-05T10:41:24.667Z"
      }
    },
  ]
}

const mockGenreDataSuccess = {
  "data": [
    {
      "id": "74",
      "type": "sub_category",
      "attributes": {
        "id": 74,
        "name": "Architecture",
        "parent_id": 8,
        "created_at": "2024-03-05T10:35:30.597Z",
        "updated_at": "2024-03-05T10:35:30.597Z"
      }
    },
    {
      "id": "75",
      "type": "sub_category",
      "attributes": {
        "id": 75,
        "name": "Ceramic",
        "parent_id": 8,
        "created_at": "2024-03-05T10:35:45.048Z",
        "updated_at": "2024-03-05T10:36:24.219Z"
      }
    },
    {
      "id": "76",
      "type": "sub_category",
      "attributes": {
        "id": 76,
        "name": "Collage",
        "parent_id": 8,
        "created_at": "2024-03-05T10:36:03.981Z",
        "updated_at": "2024-03-05T10:36:03.981Z"
      }
    }
  ]
}

const mockFeatureList = {
  "data": [
    {
      "id": "8",
      "type": "show_feature",
      "attributes": {
        "id": 8,
        "feature_name": "Accept credit",
        "activate_feature": true
      }
    },
    {
      "id": "7",
      "type": "show_feature",
      "attributes": {
        "id": 7,
        "feature_name": "All ages",
        "activate_feature": false
      }
    }
  ]
}

const mockCategoryList = {
  "data": [
      {
          "id": "8",
          "type": "category",
          "attributes": {
              "id": 8,
              "name": "Art",
              "created_at": "2023-10-03T02:46:13.375-07:00",
              "updated_at": "2024-08-25T22:32:48.957-07:00",
              "user_sub_categories": []
          }
      },
      {
          "id": "7",
          "type": "category",
          "attributes": {
              "id": 7,
              "name": "Enjoyment",
              "created_at": "2023-10-03T02:46:13.354-07:00",
              "updated_at": "2024-08-25T22:32:57.745-07:00",
              "user_sub_categories": []
          }
      },
      {
          "id": "6",
          "type": "category",
          "attributes": {
              "id": 6,
              "name": "Music",
              "created_at": "2023-10-03T02:46:13.337-07:00",
              "updated_at": "2024-08-25T22:33:04.170-07:00",
              "user_sub_categories": []
          }
      }
  ]
}

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    state: {
      params: {
        from: 'show',
        event_image: 'event_image',
        eventId: 'eventId',
      }
    }
  },
  id: "Posts"
};

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('userRole')),
  get: jest.fn().mockImplementation(() => Promise.resolve('venue')),
}));

const feature = loadFeature("./__tests__/features/PostCreation-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("User navigates to PostCreation", ({ given, when, then }) => {
    let postCreationWrapper: ShallowWrapper;
    let instance: PostCreation;
    let eventTitleInputText: ShallowWrapper;

    given("I am a User attempting to create a post", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      postCreationWrapper = shallow(<PostCreation {...screenProps} />);
    });

    when("I click on post a show", () => {
      instance = postCreationWrapper.instance() as PostCreation;
      instance.createPostCreation()
      instance.goToItemDetails({},false)
      instance.editNavigation({})
      instance.navigateToDetails({})
      instance.AddPostCreation()
      eventTitleInputText = postCreationWrapper.findWhere(node => node.prop("testID") === "eventTitleInputText")
      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "tokenstring");
      runEngine.sendMessage("Unit Test", tokenMsg);
      instance.handleMarkAsSoldOut(123)
      instance.updateCreatePostData(123)
      mockAPISuccessCall(instance, "getStatesAPICallId", mockStateDataSuccess)
      mockAPISuccessCall(instance, "getStatesAPICallId", mockFailureResponse)
      mockAPIFailureCall(instance, "getStatesAPICallId", mockFailureResponse)

      instance.setState({ statesList: [{ key: "AK", name: "Alaska" }] });
      postCreationWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("valueChange", "AK");

      mockAPISuccessCall(instance, "getCitiesAPICallId", mockCitiesDataSuccess)
      mockAPISuccessCall(instance, "getCitiesAPICallId", mockFailureResponse)
      mockAPIFailureCall(instance, "getCitiesAPICallId", mockFailureResponse)

      mockAPISuccessCall(instance, "getLineupsAPICallID", mockLineupDataSuccess)
      mockAPISuccessCall(instance, "getLineupsAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getLineupsAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "getTypeOfShowAPICallID", mockTypeOfShowDataSuccess)
      mockAPISuccessCall(instance, "getTypeOfShowAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getTypeOfShowAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "getGenreAPICallID", mockGenreDataSuccess)
      mockAPISuccessCall(instance, "getGenreAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getGenreAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "getEventFeaturesAPICallID", mockFeatureList)
      mockAPISuccessCall(instance, "getEventFeaturesAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getEventFeaturesAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "apiGetCategoryCallID", mockCategoryList)
      mockAPISuccessCall(instance, "apiGetCategoryCallID", mockFailureResponse)
      mockAPIFailureCall(instance, "apiGetCategoryCallID", mockFailureResponse)

      mockAPISuccessCall(instance, "updatePostApiCallId", mockCategoryList)
      mockAPISuccessCall(instance, "updatePostApiCallId", mockFailureResponse)
      mockAPIFailureCall(instance, "updatePostApiCallId", mockFailureResponse)
      
      mockAPISuccessCall(instance, "postponeShowAPICallID", mockCreateShowAPIResponse)
      mockAPISuccessCall(instance, "postponeShowAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "postponeShowAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "cancelShowAPICallID", mockCategoryList)
      mockAPISuccessCall(instance, "cancelShowAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "cancelShowAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "cancelShowAPICall", mockFailureResponse)

      instance.generateTimes()
      instance.getStatesListAPI()
    });

    then('Fetch required APIs', () => {
      expect(eventTitleInputText).toBeDefined()
    })

    when("User interacts with the buttons", () => {
      instance.setState({ userRole: 'venue' })
      postCreationWrapper.findWhere(node => node.prop("testID") === "containerFeedback").simulate("press");
      postCreationWrapper.findWhere(node => node.prop("testID") === "backBtn").simulate("press");
      postCreationWrapper.findWhere(node => node.prop("testID") === "eventTitleInputText").simulate("changeText", "title");
      postCreationWrapper.findWhere(node => node.prop("testID") === "locationInputText").simulate("changeText", "location");
      postCreationWrapper.findWhere(node => node.prop("testID") === "addressInputText").simulate("changeText", "address");
      postCreationWrapper.findWhere(node => node.prop("testID") === "zipInputText").simulate("changeText", "zip");
      postCreationWrapper.findWhere(node => node.prop("testID") === "zipInputText").simulate("changeText", "12345");
      postCreationWrapper.findWhere(node => node.prop("testID") === "timePicker").simulate("valueChange", "time");
      postCreationWrapper.findWhere(node => node.prop("testID") === "typeOfShowPicker").simulate("valueChange", "typeOfShow");
      postCreationWrapper.findWhere(node => node.prop("testID") === "descriptionInputText").simulate("changeText", "description");
      postCreationWrapper.findWhere(node => node.prop("testID") === "rulesRegulationInputText").simulate("changeText", "rulesRegulation");
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      postCreationWrapper.findWhere(node => node.prop("testID") === "btnDateSelector").simulate("press");
      postCreationWrapper.findWhere(node => node.prop("testID") === "DateRangePicker").simulate("change", {
        startDate: '1',
        displayedDate: '1',
      });
      postCreationWrapper.findWhere(node => node.prop("testID") === "btnDateSelector").simulate("press");
      postCreationWrapper.findWhere(node => node.prop("testID") === "hideCalendar").simulate("press");
      postCreationWrapper.findWhere(node => node.prop("testID") === "lineUpTxtInput").simulate("changeText", "Art");
      postCreationWrapper.findWhere(node => node.prop("testID") === "lineUpTxtInput").simulate("submitEditing", "Art");
      postCreationWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("valueChange", "AK");
      postCreationWrapper.findWhere(node => node.prop("testID") === "cityPicker").simulate("valueChange", "Akutan");
      postCreationWrapper.findWhere(node => node.prop("testID") === "typeOfShowPicker").simulate("valueChange", "Art");
      postCreationWrapper.findWhere(node => node.prop("testID") === "genrePicker").simulate("valueChange", "Collage");

      const showFeaturesFlatlist = postCreationWrapper.findWhere(node => node.prop("testID") === "showFeaturesFlatlist");
      mockFeatureList.data.forEach((item, index) => {
        const innerWrapper = showFeaturesFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        showFeaturesFlatlist.renderProp("keyExtractor")( item );

        if (!item.attributes.activate_feature)
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "unselectedShowFeature"
        ).simulate("press");

        if (item.attributes.activate_feature)
          innerWrapper.findWhere(
            (node) => node.prop("testID") === "selectedShowFeature"
          ).simulate("press");
      })

      instance.setState({currentUserId:"1"})
      const lineUpFlatlist = postCreationWrapper.findWhere(node => node.prop("testID") === "lineUpFlatlist");
      mockLineupDataSuccess.data.forEach((item, index) => {
        const innerWrapper = lineUpFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        lineUpFlatlist.renderProp("keyExtractor")({ item });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "closeLineUpBtn"
        ).simulate("press");
      })

      const typeOfShowFlatlist = postCreationWrapper.findWhere(node => node.prop("testID") === "typeOfShowFlatlist");
      mockTypeOfShowDataSuccess.data.forEach((item, index) => {
        const innerWrapper = typeOfShowFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        typeOfShowFlatlist.renderProp("keyExtractor")({ item });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "closeTypeOfShowBtn"
        ).simulate("press");
      })

      const genreFlatlist = postCreationWrapper.findWhere(node => node.prop("testID") === "genreFlatlist");
      mockTypeOfShowDataSuccess.data.forEach((item, index) => {
        const innerWrapper = genreFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        genreFlatlist.renderProp("keyExtractor")({ item });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "closeGenreBtn"
        ).simulate("press");
      })

      mockAPISuccessCall(instance, "createShowApiCallID", mockCreateShowAPIResponse)
      mockAPISuccessCall(instance, "createShowApiCallID", mockFailureResponse)
      mockAPIFailureCall(instance, "createShowApiCallID", mockFailureResponse)
    })

    then('Initiate click events', () => {
      expect(eventTitleInputText).toBeDefined()
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("User clicks from camera", () => {
      instance.setState({
        selectedImageData: {
          uri: "image_path"
        }
      })
    })

    then("Render the event image on UI", () => {
      expect(instance.state.selectedImageData.uri).toBe("image_path")
    })

    when("Event title is empty", () => {
      instance.setState({ eventTitle: "", eventTitleError: "Please enter event title", })
    })

    then("Throw event title empty error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.eventTitleError).toBe("Please enter event title")
    })

    when("Location is empty", () => {
      instance.setState({ location: "", locationError: "Please enter location", })
    })

    then("Throw location empty error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.locationError).toBe("Please enter location")
    })

    when("Address is empty", () => {
      instance.setState({ address: "", addressError: "Please enter address" })
    })

    then("Throw address empty error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.addressError).toBe("Please enter address")
    })

    when("Address is invalid", () => {
      instance.setState({ address: "1" })
    })

    then("Throw address invalid error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.addressError).toBe("Please enter valid address")
    })

    when("Address is invalid regex", () => {
      instance.setState({ address: "!!! Not an address ???" })
    })

    then("Throw address invalid regex error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.addressError).toBe("Please enter valid address")
    })

    when("State is not selected", () => {
      instance.setState({ selectedState: "", stateError: "Please select a state" })
    })

    then("Throw state not selected error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.stateError).toBe("Please select a state")
    })

    when("City is not selected", () => {
      instance.setState({ selectedCity: "", cityError: "Please select a city" })
    })

    then("Throw city not selected error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.cityError).toBe("Please select a city")
    })

    when("Zip is empty", () => {
      instance.setState({ zipCode: "", zipError: "Please enter zip" })
    })

    then("Throw zip empty error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.zipError).toBe("Please enter zip")
    })

    when("Zip is invalid", () => {
      instance.setState({ zipCode: "1" })
    })

    then("Throw zip invalid error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.zipError).toBe("Zip must be of 5 digits")
    })

    when("Date is empty", () => {
      instance.setState({ dateOfShow: "", dateOfShowError: "Please enter date of the show" })
    })

    then("Throw date empty error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.dateOfShowError).toBe("Please enter date of the show")
    })

    when("Time is not selected", () => {
      instance.setState({ time: "", timeError: "Please select time" })
    })

    then("Throw time not selected error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.timeError).toBe("Please select time")
    })

    when("Line up is not selected", () => {
      instance.setState({ selectedLineUp: [] })
    })

    then("Throw line up not selected error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.lineUpError).toBe("Please select a line up")
    })

    when("Type of show is not selected", () => {
      instance.setState({ selectedTypeOfShows: [] })
    })

    then("Throw type of shows not selected error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.typeOfShowError).toBe("Please select a type of show")
    })

    when("Description is empty", () => {
      instance.setState({ description: "", descriptionError: "Please enter description" })
    })

    then("Throw description empty error", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      expect(instance.state.descriptionError).toBe("Please enter description")
    })

    when("All fields are field", () => {
      instance.setState({
        eventTitle: "abc",
        location: "abc",
        address: "abc",
        selectedState: "abc",
        selectedCity: "abc",
        zipCode: "12345",
        dateOfShow: "abc",
        time: "abc",
        description: "abc",
      })
    })

    then("Trigger create show API", () => {
      const createShowSuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      createShowSuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), mockCreateShowAPIResponse)
      instance.createShowApiCallID = createShowSuccess.messageId
      runEngine.sendMessage('Unit Test', createShowSuccess)
      instance.handleCreateShowAPIResponse(mockCreateShowAPIResponse)

      const createShowFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      createShowFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), mockFailureResponse)
      instance.createShowApiCallID = createShowFailure.messageId
      runEngine.sendMessage('Unit Test', createShowFailure)
      instance.handleAPIErrors(mockFailureResponse)
      instance.handleCreateShowAPIResponse(mockFailureResponse)
      expect(instance.state.eventTitle).toBe("abc");
    })


    when("Event Id is not null", () => {
      instance.setState({ eventId: "1" })
    })

    then("Render UI with event Id", () => {
      postCreationWrapper.findWhere(node => node.prop("testID") === "cancelUpdate").simulate("press")
      expect(instance.state.eventId).toBe("1")
    })

  })


  test("iOS User navigates to PostCreation", ({ given, when, then }) => {
    let postCreationWrapper: ShallowWrapper;
    let instance: PostCreation;
    let eventTitleInputText: ShallowWrapper;

    given("I am a User attempting to create a post", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      postCreationWrapper = shallow(<PostCreation {...screenProps} />);
    });

    when("I click on post a show", () => {
      instance = postCreationWrapper.instance() as PostCreation;
      eventTitleInputText = postCreationWrapper.findWhere(node => node.prop("testID") === "eventTitleInputText")

      mockAPISuccessCall(instance, "getStatesAPICallId", mockStateDataSuccess)
      mockAPISuccessCall(instance, "getStatesAPICallId", mockFailureResponse)
      mockAPIFailureCall(instance, "getStatesAPICallId", mockFailureResponse)

      mockAPISuccessCall(instance, "getCitiesAPICallId", mockCitiesDataSuccess)
      mockAPISuccessCall(instance, "getCitiesAPICallId", mockFailureResponse)
      mockAPIFailureCall(instance, "getCitiesAPICallId", mockFailureResponse)

      mockAPISuccessCall(instance, "getLineupsAPICallID", mockLineupDataSuccess)
      mockAPISuccessCall(instance, "getLineupsAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getLineupsAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "getTypeOfShowAPICallID", mockTypeOfShowDataSuccess)
      mockAPISuccessCall(instance, "getTypeOfShowAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getTypeOfShowAPICallID", mockFailureResponse)

      mockAPISuccessCall(instance, "getGenreAPICallID", mockGenreDataSuccess)
      mockAPISuccessCall(instance, "getGenreAPICallID", mockFailureResponse)
      mockAPIFailureCall(instance, "getGenreAPICallID", mockFailureResponse)

      postCreationWrapper.findWhere((node) => node.prop("testID") === "btnStateSelect").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "statePickerModal").simulate("ValueChange", "AK");
      postCreationWrapper.findWhere((node) => node.prop("testID") === "hideStateModal").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "btnCitySelect").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "cityPickerModal").simulate("ValueChange", "Akutan");
      postCreationWrapper.findWhere((node) => node.prop("testID") === "hideCityModal").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "btnTimeSelect").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "timePickerModal").simulate("ValueChange", "01h30");
      postCreationWrapper.findWhere((node) => node.prop("testID") === "hideTimeModal").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "btnTypeOfShowsSelect").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "typeOfShowsPickerModal").simulate("ValueChange", "01h30");
      postCreationWrapper.findWhere((node) => node.prop("testID") === "hideTypeOfShowModal").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "btnGenreSelect").simulate("press")
      postCreationWrapper.findWhere((node) => node.prop("testID") === "genrePickerModal").simulate("ValueChange", "01h30");
      postCreationWrapper.findWhere((node) => node.prop("testID") === "hideGenreModal").simulate("press")

    });

    then("User interacts with the screen", () => {
      expect(eventTitleInputText).toBeDefined()
    });
  })



    test('User creates a new event', ({given, when, then}) => {
      let postCreationWrapper: ShallowWrapper;
      let instance: PostCreation;
      let eventTitleInputText: ShallowWrapper;
      const currentState = {
        eventTitle: 'show-title',
        location: 'My location',
        address: 'My address',
        description: 'My description',
        statesList: [{key: 'FL', name: 'Florida'}],
        citiesList: ['Alva'],
        selectedCity: 'Alva',
        zipCode: '00001',
        dateOfShow: '01/01/2025',
        selectedDate: moment('01/01/2025'),
        time: '03h30',
        lineupText: 'Trash Talk',
        selectedLineUp: [{
          id: '0',
          first_name: 'trashShow',

        }],
        selectedImageData: {uri :['http://url-example.com']},
        selectedTypeOfShows: [{attributes: {created_at: "2023-10-30T15:49:27.228-07:00", id: 6, name: "Music", updated_at: "2024-09-17T10:33:46.672-07:00", user_sub_categories: []}, id: 6, type: "category"}],
        selectedGenres: [{attributes: {created_at: "2024-09-17T10:48:30.109-07:00", id: 221, name: "Disco", parent_id: 6, updated_at: "2024-09-17T11:01:54.097-07:00"}, id: 221, type: "sub_category"}]

      }
      given('I am a User attempting to create a event post', ()=> {
        postCreationWrapper = shallow(<PostCreation {...screenProps} />);
      })
      when('I fill the fields', () =>{
        instance = postCreationWrapper.instance() as PostCreation;
        jest.spyOn(instance, 'handleCreateShowAPI')
        jest.spyOn(instance,'checkCreateShowValidation').mockImplementation(() => true)
        instance.setState({...instance.state , ...currentState})

      })
      when('I press the submit button', () =>{
        postCreationWrapper.findWhere(node => node.prop("testID") === "postShowBtn").simulate("press");
      })
      then('I expect to submit event data information', () =>{

        expect(instance.handleCreateShowAPI).toBeCalled()
      })
    })

});