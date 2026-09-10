import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import AllEventDetailScreen from "../../src/AllEventDetailScreen";

import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

const screenData = [
  { type: 'image' },
  { type: 'title' },
  { type: 'like' },
  { type: 'clickableItems' },
  { type: 'description' },
  { type: 'rulesRegulations' },
  { type: 'showFeatures' },
  { type: 'ticketsAndDirectionsButtons' },
]

const screenProps = {
  navigation: {
    getParam: jest.fn(),
    goBack: jest.fn(),
    navigate: jest.fn(),
    pop:jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    state:{
      params:{
        eventId:"testID",
        isPostPictureSuccessfullyCreated:true,
        successMessage:{
          title:"test",
          description:"test des"
        }
      }
    },
    openDrawer: jest.fn(),
  },
  id: "AllEventDetailScreen",
};

const mockResponseWithoutAttributes = {
  "data": {
    "id": "190",
    "type": "show",
  }
}

const mockResponse = {
  "data": {
    "id": "190",
    "type": "show",
    "attributes": {
      "id": 190,
      "event_title": "Event with likes",
      "date_of_the_show": "2024-04-16",
      "time": "04:00:00",
      "description": "Description",
      "rules_and_regulations": "Rules",
      "city": "Washington",
      "state": "District of Columbia",
      "country": "US",
      "zip_code": 12345,
      "address": "Address",
      "location": "Location",
      "like_by_me": false,
      "added_in_calendar": false,
      "account_id": 277,
      "show_features": [
        {
          "id": 7,
          "feature_name": "Show Feature 1",
          "activate_feature": false,
          "show_id": 193,
          "created_at": "2024-03-13T11:46:25.100Z",
          "updated_at": "2024-04-15T06:43:05.702Z"
        }
      ],
      "website": "https://example.com",
      "likes_count": 2,
      "model_name": "Show",
      "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYWc9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--63524cb1388a5e9cc5c1cd43be0b9127c5ddfeab/eventImage.jpg",
      "type_of_show": [
        {
          "id": 8,
          "name": "Art",
          "approved_by_admin": true,
          "created_at": "2023-10-03T09:46:13.375Z",
          "updated_at": "2024-03-05T10:23:23.938Z"
        }
      ],
      "genre": [],
      "line_ups": [
        'baba',
        '12'
      ]
    }
  }
}

const mockAllBandsList = {
  "data": [
    {
      "id": 302,
      "first_name": "12",
      "email": "12@yopmail.com",
      "created_at": "2024-05-05T17:35:53.333Z",
      "role_id": 9
    },
    {
      "id": 303,
      "first_name": "18",
      "email": "18@gmail.com",
      "created_at": "2024-05-06T08:40:50.684Z",
      "role_id": 9
    },
  ]
}

const mockResponseUpdated = {
  "data": {
    "id": "190",
    "type": "show",
    "attributes": {
      "id": 190,
      "event_title": "Event with likes",
      "date_of_the_show": "2024-04-16",
      "time": "04:00:00",
      "description": "Description",
      "rules_and_regulations": "Rules",
      "city": "Washington",
      "state": "District of Columbia",
      "country": "US",
      "zip_code": 12345,
      "address": "Address",
      "location": "Location",
      "like_by_me": true,
      "added_in_calendar": true,
      "account_id": 277,
      "show_features": [
        {
          "id": 7,
          "feature_name": "Show Feature 1",
          "activate_feature": false,
          "show_id": 193,
          "created_at": "2024-03-13T11:46:25.100Z",
          "updated_at": "2024-04-15T06:43:05.702Z"
        }
      ],
      "website": "https://example.com",
      "likes_count": 2,
      "model_name": "Show",
      "profile_image": null,
      "type_of_show": [
        {
          "id": 8,
          "name": "Art",
          "approved_by_admin": true,
          "created_at": "2023-10-03T09:46:13.375Z",
          "updated_at": "2024-03-05T10:23:23.938Z"
        },
        {
          "id": 9,
          "name": "Music",
          "approved_by_admin": true,
          "created_at": "2023-10-03T09:46:13.375Z",
          "updated_at": "2024-03-05T10:23:23.938Z"
        }
      ],
      "genre": [],
      "line_ups": []
    }
  }
}

const feature = loadFeature(
  "./__tests__/features/AllEventDetailScreen-scenario.feature"
);

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

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_role')),
  get: jest.fn().mockImplementation(() => Promise.resolve('fan')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("Guest User navigates to AllEventDetailScreen", ({ given, when, then }) => {
    let allEventDetailScreenWrapper: ShallowWrapper;
    let instance: AllEventDetailScreen;

    given("I am a User loading AllEventDetailScreen", () => {
      allEventDetailScreenWrapper = shallow(<AllEventDetailScreen {...screenProps} />);
    });

    when("I navigate to the AllEventDetailScreen", () => {
      instance = allEventDetailScreenWrapper.instance() as AllEventDetailScreen;
      instance.setState({eventDetail:{attributes:{
        date_of_the_show:"2999-12-31",
        sold_out:true
      }}})
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          eventId: "1",
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);
      mockAPISuccessCall(instance, "getEventDetailApiCallID", mockResponseWithoutAttributes)
      mockAPIFailureCall(instance, "getEventDetailApiCallID", [])

      mockAPISuccessCall(instance, "getAllBandsListApiCallId", mockAllBandsList)
      mockAPIFailureCall(instance, "getAllBandsListApiCallId", [])
      const screenFlatList = allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "mainFlatList");
      screenData.forEach((item: any) => {
        const renderItem = screenFlatList.renderProp("renderItem")({
          item: item,
        });

        screenFlatList.renderProp("keyExtractor")({
          item: item,
        });

        const listHeaderComponent = screenFlatList.renderProp("ListHeaderComponent")({
          item: item,
        });
        listHeaderComponent.findWhere(node => node.prop("testID") === "backBtn").simulate("press")
        listHeaderComponent.findWhere(node => node.prop("testID") === "hamburgerIcon").simulate("press")

        renderItem.findWhere(node => node.prop("testID") === "wholeUI").simulate("press")
        if (item.type === "image") {
          renderItem.findWhere(node => node.prop("testID") === "threeDotIcon").simulate("press")
          // renderItem.findWhere(node => node.prop("testID") === "addToCalendar").simulate("press")
          // renderItem.findWhere(node => node.prop("testID") === "shareWithFriend").simulate("press")
        }
        if (item.type === "like") {
          renderItem.findWhere(node => node.prop("testID") === "likeDislikeBtn").simulate("press")
          instance.setState({authToken:"123",selectedEventId:'123', eventDetail:{data:{type:'post'}}})
          renderItem.findWhere(node => node.prop("testID") === "likeText").simulate("press")
          instance.setState({authToken:null})
          renderItem.findWhere(node => node.prop("testID") === "likeText").simulate("press")
        }

        if (item.type === "showFeatures") {
          const flatList = renderItem.findWhere(node => node.prop("testID") === "showFeaturesFlatlist");
        }

        if (item.type === "clickableItems") {
          const typeOfShowFlatlist = renderItem.findWhere(node => node.prop("testID") === "typeOfShowFlatlist");
          const lineupFlatlist = renderItem.findWhere(node => node.prop("testID") === "lineupFlatlist");
        }

        if (item.type === "ticketsAndDirectionsButtons") {
          renderItem.findWhere(node => node.prop("testID") === "directionsBtn").simulate("press")
        }
      })

      allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "createAccountBtn").simulate("press")
      allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "loginBtn").simulate("press")
      allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "popupCloseButton").simulate("press")

    });

    then("User navigates back", () => {
      expect(screenProps.navigation.pop).toHaveBeenCalled();
    })

    when("API returns correct data", () => {
      instance = allEventDetailScreenWrapper.instance() as AllEventDetailScreen;
      mockAPISuccessCall(instance, "getEventDetailApiCallID", mockResponse)
      mockAPIFailureCall(instance, "getEventDetailApiCallID", [])
      const screenFlatList = allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "mainFlatList");
      screenData.forEach((item: any) => {
        const renderItem = screenFlatList.renderProp("renderItem")({
          item: item,
        });

        screenFlatList.renderProp("keyExtractor")({
          item: item,
        });

        const listHeaderComponent = screenFlatList.renderProp("ListHeaderComponent")({
          item: item,
        });
        listHeaderComponent.findWhere(node => node.prop("testID") === "backBtn").simulate("press")

        renderItem.findWhere(node => node.prop("testID") === "wholeUI").simulate("press")
        if (item.type === "image") {
          renderItem.findWhere(node => node.prop("testID") === "threeDotIcon").simulate("press")
          // renderItem.findWhere(node => node.prop("testID") === "addToCalendar").simulate("press")
          // renderItem.findWhere(node => node.prop("testID") === "shareWithFriend").simulate("press")
        }
        if (item.type === "like") {
          renderItem.findWhere(node => node.prop("testID") === "likeDislikeBtn").simulate("press")
          renderItem.findWhere(node => node.prop("testID") === "likeText").simulate("press")
        }

        if (item.type === "showFeatures") {
          const flatList = renderItem.findWhere(node => node.prop("testID") === "showFeaturesFlatlist");
          mockResponse.data.attributes.show_features.forEach((item: any) => {
            flatList.renderProp("renderItem")({
              item: item,
            });

    
          })
        }

        if (item.type === "clickableItems") {
          const typeOfShowFlatlist = renderItem.findWhere(node => node.prop("testID") === "typeOfShowFlatlist");
          if (typeof typeOfShowFlatlist.prop("renderItem") === "function") {
            mockResponse.data.attributes.type_of_show.forEach((item: any, index: number) => {
              typeOfShowFlatlist.renderProp("renderItem")({
                item: item,
                index: index,
              });
              typeOfShowFlatlist.renderProp("keyExtractor")({ item });
            })
          }
          instance.showLineupProfile("1", "12@yopmail.com")
          instance.setState({ authToken: "w" })
          const lineupFlatlist = renderItem.findWhere(node => node.prop("testID") === "lineupFlatlist");
          mockResponse.data.attributes.line_ups.forEach((item: any, index: number) => {
            const renderLineupItem = lineupFlatlist.renderProp("renderItem")({
              item: item,
              index: index,
            });
            renderLineupItem.findWhere(node => node.prop("testID") === 'lineup').simulate('press')

          //  lineupFlatlist.renderProp("keyExtractor")({ item });
          })
        }

        if (item.type === "ticketsAndDirectionsButtons") {
          renderItem.findWhere(node => node.prop("testID") === "directionsBtn").simulate("press")
        }


      })

      allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "createAccountBtn").simulate("press")
      allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "loginBtn").simulate("press")
      allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "popupCloseButton").simulate("press")
      instance.showLineupProfile("1", "12@yopmail.com")

    });

    then("User navigates back", () => {
      expect(screenProps.navigation.pop).toHaveBeenCalled();
    })

    when("API is modified", () => {
      mockAPISuccessCall(instance, "getEventDetailApiCallID", mockResponseUpdated)
      instance.openGoogleMaps(mockResponse.data.attributes)
      const screenFlatList = allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "mainFlatList");
      screenData.forEach((item: any) => {
        const renderItem = screenFlatList.renderProp("renderItem")({
          item: item,
        });

        screenFlatList.renderProp("keyExtractor")({
          item: item,
        });
        if (item.type === "clickableItems") {
          const typeOfShowFlatlist = renderItem.findWhere(node => node.prop("testID") === "typeOfShowFlatlist");
          if (typeof typeOfShowFlatlist.prop("renderItem") === "function") {
            mockResponse.data.attributes.type_of_show.forEach((item: any, index: number) => {
              typeOfShowFlatlist.renderProp("renderItem")({
                item: item,
                index: index,
              });
              typeOfShowFlatlist.renderProp("keyExtractor")({ item });
            })
          }
        }
        if (item.type === "image") {
          renderItem.findWhere(node => node.prop("testID") === "threeDotIcon").simulate("press")
          // renderItem.findWhere(node => node.prop("testID") === "addToCalendar").simulate("press")
        }
      })
    })

    then("Show menu pops up", () => {
      expect(instance.state.showMenu).toBe(true)
    })


  });

  test("User navigates to AllEventDetailScreen", ({ given, when, then }) => {
    let allEventDetailScreenWrapper: ShallowWrapper;
    let instance: AllEventDetailScreen;


    given("I am a User loading AllEventDetailScreen", () => {
      allEventDetailScreenWrapper = shallow(<AllEventDetailScreen {...screenProps} />);
    });

    when("I navigate to the AllEventDetailScreen", async () => {
      instance = allEventDetailScreenWrapper.instance() as AllEventDetailScreen;

      mockAPISuccessCall(instance, "getEventDetailApiCallID", mockResponse)
      mockAPIFailureCall(instance, "getEventDetailApiCallID", [])

      instance.navigateToBandProfile(123)
      instance.showProfile('test', "Band")
      const screenFlatList = allEventDetailScreenWrapper.findWhere(node => node.prop("testID") === "mainFlatList");
      screenData.forEach((item: any) => {
        const renderItem = screenFlatList.renderProp("renderItem")({
          item: item,
        });

        screenFlatList.renderProp("keyExtractor")({
          item: item,
        });

        if (item.type === "like") {
          renderItem.findWhere(node => node.prop("testID") === "likeDislikeBtn").simulate("press")
          renderItem.findWhere(node => node.prop("testID") === "likeText").simulate("press")
        }

        if (item.type === "image") {
          renderItem.findWhere(node => node.prop("testID") === "threeDotIcon").simulate("press")
          // renderItem.findWhere(node => node.prop("testID") === "addToCalendar").simulate("press")
        }

      })

      mockAPISuccessCall(instance, "addEventToCalendarAPICallID", {
        "message": "Show is already in the calendar."
      })
      mockAPIFailureCall(instance, "addEventToCalendarAPICallID", [])
      instance.handlePayloadFromNav()
    });

    then("User navigates back", () => {
      expect(instance.state.authToken).toBe("");
    })
  });
});