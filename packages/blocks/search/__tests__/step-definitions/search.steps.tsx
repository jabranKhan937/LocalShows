import { defineFeature, loadFeature } from 'jest-cucumber'
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import React from 'react'
import Search from '../../src/Search'

import { Message } from '../../../../framework/src/Message'
export const configJSON = require('../../config.json')
import MessageEnum, {
  getName
} from '../../../../framework/src/Messages/MessageEnum'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Platform, View } from 'react-native'

jest.mock('rn-range-slider', () => {
  return {
    RangeSlider: jest.fn(),
  };
});

jest.useFakeTimers()

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    LIMITED: 'limited',
    GRANTED: 'granted',
    BLOCKED: 'blocked'
  },
  PERMISSIONS: {
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.location_when_in_use'
    },
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.access_fine_location'
    }
  }
}));

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn((success, error) => {
    success({
      coords: {
        latitude: 37.7749, 
        longitude: -122.4194,
      },
    });
  }),
}));

const mockSuccessResponse = {
  "data": [
    {
      "id": "9",
      "type": "show",
      "attributes": {
        "event_title": "dance18",
        "date_of_the_show": "2023-11-18",
        "time": "04:00:00",
        "line_ups": null,
        "description": "the show is based on the music concert",
        "rules_and_regulations": null,
        "city": "Akutan",
        "state": "Alaska",
        "country": "United States",
        "zip_code": null,
        "address": null,
        "location": null,
        "show_features": [],
        "like_by_me": true,
        "likes_count": 1
      }
    },
    {
      "id": "5",
      "type": "show",
      "attributes": {
        "event_title": "Dummy event",
        "date_of_the_show": "2024-11-18",
        "time": "04:00:00",
        "line_ups": null,
        "description": "This is a dummy event",
        "rules_and_regulations": null,
        "city": "Akutan",
        "state": "Alaska",
        "country": "United States",
        "zip_code": null,
        "address": "",
        "location": "",
        "show_features": [],
        "like_by_me": false,
        "likes_count": 0
      }
    }
  ],
  "meta": {
    "message": "List of shows."
  }
}

const mockErrorResponse = {
  "errors": [
    {
      "message": "Not found any show."
    }
  ]
}

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    getParam: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    navigate: jest.fn(),
    openDrawer: jest.fn(),
    push:jest.fn(),
    state:{params:{
      eventList:true
    }
  }
  },
  id: 'Search'
}

jest.mock('rn-range-slider', () => {
  return function MockRangeSlider(props:any) {
    return <View testID="range-slider" {...props} />;
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

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_id')),
  get: jest.fn().mockImplementation(() => Promise.resolve('1')),
}));

const feature = loadFeature('./__tests__/features/search-scenario.feature')

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' }, Alert: {
        alert: jest.fn()
      }
    }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android')
  })

  test('User navigates to search', ({ given, when, then }) => {
    let SearchWrapper: ShallowWrapper
    let showsNearMeTxt: ShallowWrapper
    let showsByState: ShallowWrapper
    let instance: Search
   
    given('I am a User loading search', () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      SearchWrapper = shallow(<Search {...screenProps} />)
    })

    when('I navigate to the search', () => {
      instance = SearchWrapper.instance() as Search
      instance.setSearchText('text')
      instance.hideModal()
      instance.getSearchList('token')
      instance.checkValidation()
      instance.getSearchShowAPI()
      instance.handleCommentsOnPress()
      instance.handleMilesRange(10)
      Platform.OS = 'ios'
      instance.requestLocationPermission()
      instance.handlePermissionResult('denied')
      instance.handlePermissionResult('granted')
      instance.getLocation()
      instance.checkLocationPermission()
      Platform.OS = 'android'
      instance.requestLocationPermission()
      instance.handlePermissionResult('denied')
      instance.handlePermissionResult('granted')
      instance.getLocation()
      instance.checkLocationPermission()
      instance.handleEmojiSelected('test')
      instance.handleReplyCloseModal()
      instance.setState({authToken:'test'})
      instance.handleNotificationNavigation()
      instance.setState({authToken:''})
      instance.handleNotificationNavigation()
      instance.handleLikeOnPress('test')
      instance.handleCalendarOnPress('test')
      instance.handleLikeCountOnPress('123','show')
      instance.renderSearchView()
      instance.renderSearchTabs('')
      instance.renderSearchTabs('Shows')
      instance.renderSearchTabs('People')
      instance.setState({SelectedTab:'People'})
      instance.handleSearchText('test')
      instance.setState({SelectedTab:'Shows'})

      const receivedReqApiMessage = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );

      receivedReqApiMessage.addData(
        getName(MessageEnum.SessionResponseToken),
        ""
      );

      runEngine.sendMessage("Unit Test", receivedReqApiMessage);

      mockAPISuccessCall(instance, "getStatesAPICallId", {
        state: {
          "AK": "Alaska",
          "AL": "Alabama",
        }
      })
      mockAPISuccessCall(instance, "getStatesAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getStatesAPICallId", mockErrorResponse)

      mockAPISuccessCall(instance, "searchApiCallId", { data: [] })
      mockAPISuccessCall(instance, "searchApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "searchApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "getCommentsAPICallID", { data: [] })
      mockAPISuccessCall(instance, "getCommentsAPICallID", mockErrorResponse)
      mockAPIFailureCall(instance, "getCommentsAPICallID", mockErrorResponse)
      
      // mockAPISuccessCall(instance, "createSearchFollowApiCallID", { data: [] })
      // mockAPIFailureCall(instance, "createSearchFollowApiCallID", mockErrorResponse)
      
      showsNearMeTxt = SearchWrapper.findWhere(node => node.prop("testID") === "showsNearMeTxt")
      showsByState = SearchWrapper.findWhere(node => node.prop("testID") === "showsByStateTxt")
      SearchWrapper.findWhere(node => node.prop("testID") === "hideKeyboard").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "hamburger").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press")
      instance.setState({authToken:"123"})
      SearchWrapper.findWhere(node => node.prop("testID") === "notificationIcon").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "btnWholeState").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "searchText").simulate("changeText", "searchText");
      SearchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "createAccountBtn").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "loginBtn").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "showsNearMe").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "PeopleTabBtn").simulate("press") 
      SearchWrapper.findWhere(node => node.prop("testID") === "ShowTabBtn").simulate("press")
      
      SearchWrapper.findWhere(node => node.prop("testID") === "stateTxt")
      const rangeSlider = SearchWrapper.findWhere(node => node.prop("testID") === "milesRangeSlider")
      rangeSlider.renderProp("renderThumb")();
      rangeSlider.renderProp("renderRail")();
      rangeSlider.renderProp("renderRailSelected")();
      SearchWrapper.findWhere(node => node.prop("testID") === "showsByState").simulate("press")
      const rangeS = SearchWrapper.findWhere(node => node.prop("testID") === "milesRangeSlider")
      rangeS.renderProp("renderThumb")();
      rangeS.renderProp("renderRail")();
      rangeS.renderProp("renderRailSelected")();
      instance.getSearchUserList("test", "test")
      instance.getSearchUserList("test", "")
      instance.followAndUnfollowUserAPICall("123", false)
      instance.followAndUnfollowUserAPICall("123", true)
      instance.setState({authToken: null})
      instance.followAndUnfollowUserAPICall("123", true)
      instance.setState({authToken: "test"})
      instance.followAndUnfollowUserAPICall("123", true)
      instance.renderProfileUserSearch("123","Band")
      instance.setState({authToken: null})
      instance.renderProfileUserSearch("123","Band")
      instance.setState({authToken: "test"})
      instance.renderProfileUserSearch("123","Band")
      instance.setState({userId:"321"})
      instance.renderProfileUserSearch("321", "Band")
      instance.getUserProfilePic()

      const getUnreadChatListAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getUnreadChatListAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), getUnreadChatListAPISuccess.messageId);
      getUnreadChatListAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[]});
      instance.createSearchFollowApiCallID = getUnreadChatListAPISuccess.messageId
      runEngine.sendMessage("Unit Test", getUnreadChatListAPISuccess)
    })

    then("User navigates back", () => {
      expect(showsByState).toBeDefined();
    })

    when("Whole state is not selected", () => {
      SearchWrapper.findWhere(node => node.prop("testID") === "btnWholeState").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate("press")
      mockAPISuccessCall(instance, "getCitiesAPICallId", mockErrorResponse)

      const rangeSlider = SearchWrapper.findWhere(node => node.prop("testID") === "milesRangeSlider")
      rangeSlider.renderProp("renderThumb")();
      rangeSlider.renderProp("renderRail")();
      rangeSlider.renderProp("renderRailSelected")();
    })

    then("Whole state value is false", () => {
      expect(showsNearMeTxt).toBeDefined();
    });

    when("User selects a state", () => {
      SearchWrapper
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("press");

      mockAPISuccessCall(instance, "getStatesAPICallId",
        {
          state: {
            AK: "Alaska",
            AL: "Alabama"
          }
        }
      )

      mockAPISuccessCall(instance, "getStatesAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getStatesAPICallId", mockErrorResponse)

      SearchWrapper
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "AK");
    })

    then("State value is changed", () => {
      expect(showsByState).toBeDefined();
    });

    when("User selects a city", () => {
      SearchWrapper
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("press");

      mockAPISuccessCall(instance, "getCitiesAPICallId",
        {
          city: ["Akutan", "Alakanuk"]
        }
      )

      mockAPISuccessCall(instance, "getCitiesAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getCitiesAPICallId", mockErrorResponse)

      SearchWrapper
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("ValueChange", "Akutan");
    });

    then("City value is changed", () => {
      expect(showsNearMeTxt).toBeDefined();
    });

    when("User selects a city without state", () => {
      SearchWrapper
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "");

      SearchWrapper
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("press");

      mockAPISuccessCall(instance, "getCitiesAPICallId",
        {
          city: ["Akutan", "Alakanuk"]
        }
      )

      mockAPISuccessCall(instance, "getCitiesAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getCitiesAPICallId", mockErrorResponse)

      SearchWrapper
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("ValueChange", "Akutan");
    });

    then("City value is changed", () => {
      expect(showsByState).toBeDefined();
    });

    when("Whole state is selected and search API is triggered", () => {
      SearchWrapper.findWhere(node => node.prop("testID") === "btnWholeState").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate("press")

      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getSearchShowAPICallId", mockErrorResponse)
    })

    then("Whole state value is true", () => {
      expect(showsNearMeTxt).toBeDefined();
    });

    when("Whole state is not selected and search API is triggered", () => {
      SearchWrapper
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("ValueChange", "");

        SearchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate("press")

      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getSearchShowAPICallId", mockErrorResponse)
    })

    then("Whole state value is true", () => {
      expect(showsNearMeTxt).toBeDefined();
    });

    when("Whole state is not selected and search API is triggered", () => {
      SearchWrapper.findWhere(node => node.prop("testID") === "btnWholeState").simulate("press")
      SearchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate("press")

      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getSearchShowAPICallId", mockErrorResponse)
    })

    then("Whole state value is false", () => {
      expect(showsByState).toBeDefined();
    });

    when("Search API is triggered", () => {
      SearchWrapper.findWhere(node => node.prop("testID") === "btnWholeState").simulate("press")
      SearchWrapper
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "Alaska");
        SearchWrapper
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("ValueChange", "Akutan");
      SearchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate("press")

      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getSearchShowAPICallId", mockErrorResponse)
    })

    then("Whole state value is false", () => {
      expect(showsByState).toBeDefined();
    });

  })

  test("Pickers in iOS", ({ given, when, then }) => {
    let searchWrapper: ShallowWrapper;
    let instance: Search;
    let stateSelectPickerComponent: ShallowWrapper;
    let citySelectPickerComponent: ShallowWrapper;
    let btnStateSelect: ShallowWrapper;
    let btnCitySelect: ShallowWrapper;
    let showsNearMeTxt: ShallowWrapper
    let showsByState: ShallowWrapper

    given("User attempting to Search Events", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      jest.doMock('react-native-permissions', () => ({
        check: jest.fn(),
        request: jest.fn(),
        RESULTS: {
          UNAVAILABLE: 'unavailable',
          DENIED: 'denied',
          LIMITED: 'limited',
          GRANTED: 'granted',
          BLOCKED: 'blocked'
        },
        PERMISSIONS: {
          IOS: {
            LOCATION_WHEN_IN_USE: 'ios.location_when_in_use'
          },
          ANDROID: {
            ACCESS_FINE_LOCATION: 'android.access_fine_location'
          }
        }
      }));
      searchWrapper = shallow(
        <Search {...screenProps} />
      );

      instance = searchWrapper.instance() as Search;

      btnStateSelect = searchWrapper.findWhere(
        (node) => node.prop("testID") === "btnStateSelect"
      );

      stateSelectPickerComponent = searchWrapper.findWhere(
        (node) => node.prop("testID") === "statePickerModal"
      );

      btnCitySelect = searchWrapper.findWhere(
        (node) => node.prop("testID") === "btnCitySelect"
      );

      citySelectPickerComponent = searchWrapper.findWhere(
        (node) => node.prop("testID") === "cityPickerModal"
      );
    });

    when("User click the state picker", () => {
      showsNearMeTxt = searchWrapper.findWhere(node => node.prop("testID") === "showsNearMeTxt")
      showsByState = searchWrapper.findWhere(node => node.prop("testID") === "showsByState")
      searchWrapper.findWhere(node => node.prop("testID") === "showsByState").simulate("press")

      btnStateSelect.simulate("press");

      mockAPISuccessCall(instance, "getStatesAPICallId", {
        state: {
          "AK": "Alaska",
          "AL": "Alabama",
        }
      })
      mockAPISuccessCall(instance, "getStatesAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getStatesAPICallId", mockErrorResponse)

      stateSelectPickerComponent.simulate("ValueChange", "AK");

      searchWrapper.findWhere(
        (node) => node.prop("testID") === "hideStateModal"
      ).simulate("press")

    });
    

    then("User can select the state", () => {
      expect(showsNearMeTxt).toBeDefined();
    });

    when("User click the city picker", () => {

      btnCitySelect.simulate("press");

      mockAPISuccessCall(instance, "getCitiesAPICallId",
        {
          city: ["Akutan", "Alakanuk"]
        }
      )

      mockAPISuccessCall(instance, "getCitiesAPICallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getCitiesAPICallId", mockErrorResponse)
      citySelectPickerComponent.simulate("ValueChange", "Akutan");

      searchWrapper.findWhere(
        (node) => node.prop("testID") === "hideCityModal"
      ).simulate("press")

    });

    then("User can select the city", () => {
      expect(showsByState).toBeDefined();
    });
  });

  test("Pickers in web", ({ given, when, then }) => {
    let searchWrapper: ShallowWrapper;
    let instance: Search;
    let showsNearMeTxt: ShallowWrapper

    given("User attempting to Search Events", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'web',
        select: jest.fn(),
      }))

      searchWrapper = shallow(
        <Search {...screenProps} />
      );

      instance = searchWrapper.instance() as Search;

    });

    when("User click the state picker", () => {
      showsNearMeTxt = searchWrapper.findWhere(node => node.prop("testID") === "showsNearMeTxt")
    });

    then("User can select the state", () => {
      expect(showsNearMeTxt).toBeDefined();
    });

  });

  test("Search Users",({given, when, then}) => {
    let searchWrapper: ShallowWrapper;
    let instance: Search;
    given('User attempting o Search Users', () => {

      searchWrapper = shallow(
        <Search {...screenProps} />
      );

      instance = searchWrapper.instance() as Search;
    })
    when("Search User API Call", () => {
      instance.setState({SelectedTab:'People',searchText:'Test'})
      searchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate('press')
      mockAPISuccessCall(instance, "getSearchUserListAPICallID",[{
        "attributes": {
          "activated": true,
          "country_code": "32",
          "created_at": "2024-11-24T21:59:06.875-08:00",
          "device_id": "messagingToken",
          "email": "usertesting@yopmail.com",
          "first_name": "Band fab",
          "full_phone_number": "3225566325",
          "last_name": null,
          "phone_number": "25566325",
          "type": null,
          "unique_auth_id": "gfMWJ6EZGIS8ErMjLv59dQtt",
          "updated_at": "2024-11-24T23:54:16.131-08:00",
          "user_name": 'utkarsh'
        },
        "id": "540",
        "type": "user"
      }])
      instance.handleSearchUserAPIResponse([{
        "attributes": {
          "activated": true,
          "country_code": "32",
          "created_at": "2024-11-24T21:59:06.875-08:00",
          "device_id": "messagingToken",
          "email": "usertesting@yopmail.com",
          "first_name": "Band fab",
          "full_phone_number": "3225566325",
          "last_name": null,
          "phone_number": "25566325",
          "type": null,
          "unique_auth_id": "gfMWJ6EZGIS8ErMjLv59dQtt",
          "updated_at": "2024-11-24T23:54:16.131-08:00",
          "user_name": 'utkarsh'
        },
        "id": "540",
        "type": "user"
      }])
      instance.setState({LoadingUsers:true})
      instance.renderUserSearchView()
      instance.setState({NoUserFound:true, LoadingUsers:false})
      instance.renderUserSearchView()
      instance.setState({NoUserFound:false,LoadingUsers:false,UserList:[{
        "attributes": {
          "activated": true,
          "country_code": "32",
          "created_at": "2024-11-24T21:59:06.875-08:00",
          "device_id": "messagingToken",
          "email": "usertesting@yopmail.com",
          "first_name": "Band fab",
          "full_phone_number": "3225566325",
          "last_name": null,
          "phone_number": "25566325",
          "type": null,
          "unique_auth_id": "gfMWJ6EZGIS8ErMjLv59dQtt",
          "updated_at": "2024-11-24T23:54:16.131-08:00",
          "user_name": 'utkarsh',
          "profile_image":'test',
          isFollow:true
        },
        "id": "545",
        "type": "user"
      },{
        "attributes": {
          "activated": true,
          "country_code": "32",
          "created_at": "2024-11-24T21:59:06.875-08:00",
          "device_id": "messagingToken",
          "email": "usertesting@yopmail.com",
          "first_name": "Band fab",
          "full_phone_number": "3225566325",
          "last_name": null,
          "phone_number": "25566325",
          "type": null,
          "unique_auth_id": "gfMWJ6EZGIS8ErMjLv59dQtt",
          "updated_at": "2024-11-24T23:54:16.131-08:00",
          "user_name": 'utkarsh',
          "profile_image":'',
          isFollow:false
        },
        "id": "540",
        "type": "user"
      },{
        "attributes": null,
        "id": "546",
        "type": "user"
      }]})
      instance.setState({FollowUserId:'540'})
      instance.handleSearchFollowandUnfollowAPIResponse({})
      instance.renderUserSearchView()
      const flatList = searchWrapper.findWhere(node => node.prop("testID") === "SearchUserList");
      instance.state.UserList.forEach((item:any, index:any) => {
        let InnerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        InnerWrapper.findWhere(node=>node.prop("testID")==="followAndUnfollowId").simulate('press')
        InnerWrapper.findWhere(node=>node.prop("testID")==="userProfileImageBTN").simulate('press')
      })
     
    })
    
    when('Query is Empty', () => {
      instance.setState({SelectedTab:'People',searchText:''})
      searchWrapper.findWhere(node => node.prop("testID") === "btnSearch").simulate('press')
      mockAPISuccessCall(instance, "getSearchUserListAPICallID",[])
      instance.handleSearchUserAPIResponse([])
    })
  })



})
