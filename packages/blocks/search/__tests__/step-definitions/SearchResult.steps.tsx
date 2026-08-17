import { defineFeature, loadFeature } from 'jest-cucumber'
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import React from 'react'
import SearchResult from '../../src/SearchResult'

import { Message } from '../../../../framework/src/Message'
export const configJSON = require('../../config.json')
import MessageEnum, {
  getName
} from '../../../../framework/src/Messages/MessageEnum'
import { _ } from '../../../../framework/src/IBlock'

const mockEventList = [
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
      "likes_count": "1",
      "added_in_calendar": false,
      "comments_count": 1,
      "band_profile_image": null,
      "account_id": "",
      "comment_count": 1,
    }
  },
  {
    "id": "5",
    "type": null,
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
      "likes_count": "0",
      "added_in_calendar": false,
      "comments_count": 1,
      "band_profile_image": "band_profile_image",
      "account_id": ""
    }
  }
]

const screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    state: {
    },
    push:jest.fn()
  },
  id: 'SearchResult'
}

const guestScreenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    state: {
      params: {
        eventList: { data: mockEventList },
      }
    },
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
  },
  id: 'SearchResult'
}

const guestScreenProps2 = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    openDrawer:jest.fn(),
    state: {
      params: {
        eventList: mockEventList,
      }
    },
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
  },
  id: 'SearchResult'
}

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

const getCommentsApiResponse = {
  "data": [
    {
      "id": "5",
      "type": "comment",
      "attributes": {
        "id": 5,
        "account_id": 27,
        "commentable_id": 123,
        "commentable_type": "Show",
        "comment": "Another comment.",
        "replies": [
          {
            "id": 79,
            "reply": "Hiiiisbs",
            "likes_count": 0,
            "account_id": 27,
            "account_name": "Astha",
            "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
            "likes": [],
            "created_at": "2024-03-07T05:20:22.156Z",
            "updated_at": "2024-03-07T05:20:22.156Z",
          },
          {
            "id": 80,
            "reply": "Hiiiisbs",
            "likes_count": 0,
            "account_id": 27,
            "account_name": "Astha",
            "profile_image": null,
            "likes": [],
            "created_at": "2024-03-04T19:08:54.549Z",
            "updated_at": "2024-03-04T19:08:54.549Z",
          },
        ],
        "created_at": "2024-03-04T19:08:54.549Z",
        "updated_at": "2024-03-04T19:08:54.549Z",
        "commentable": {
          "id": 123,
          "event_title": "Event 1",
          "date_of_the_show": "2024-03-31",
          "time": "2000-01-01T20:00:00.000Z",
          "line_ups": null,
          "description": "Description",
          "rules_and_regulations": "Rules",
          "created_at": "2024-03-04T15:48:29.745Z",
          "updated_at": "2024-03-04T16:44:37.345Z",
          "city": "Bloomingdale",
          "state": "District of Columbia",
          "country": "US",
          "address": "Address lko",
          "location": "Sadar lucknow",
          "zip_code": 226002,
          "like_by_me": false,
          "added_in_calendar": false,
          "account_id": 27,
          "type_of_show": ""
        },
        "account": {
          "id": 27,
          "first_name": "comuser",
          "last_name": "test",
          "full_phone_number": "918521479635",
          "country_code": 91,
          "phone_number": 8521479635,
          "email": "abc@gmail.com",
          "activated": true,
          "device_id": null,
          "unique_auth_id": "BBVneNwamOR5pCiCxwrNVAtt",
          "password_digest": "$2a$12$f4EGVjzxhHS8nWP4nuptmuqD9Nj1M4YKAI9F.EaJhtkdt.o5iP0b.",
          "created_at": "2023-10-17T06:39:02.543Z",
          "updated_at": "2023-10-17T06:39:02.552Z",
          "user_name": null,
          "platform": null,
          "user_type": null,
          "app_language_id": null,
          "last_visit_at": null,
          "is_blacklisted": false,
          "suspend_until": null,
          "status": "regular",
          "role_id": 1,
          "full_name": null,
          "gender": null,
          "date_of_birth": null,
          "age": null,
          "country": "India",
          "state": "MP",
          "city": "Indore",
          "i_would_like": false,
          "terms_and_conditions": false,
          "are_you_18": false,
          "archived": false,
          "archived_at": null,
          "private": true,
          "location": null,
          "band_artist_name": null,
          "verify_at": null
        },
        "profile_image_url": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
        "like_by_me": null,
        "likes_count": 0,
        "model_name": "BxBlockComments::Comment"
      }
    },
    {
      "id": "4",
      "type": "comment",
      "attributes": {
        "id": 5,
        "account_id": 27,
        "commentable_id": 123,
        "commentable_type": "Show",
        "comment": "Another comment.",
        "replies": [
          {
            "id": 79,
            "reply": "Hiiiisbs",
            "likes_count": 0,
            "account_id": 27,
            "account_name": "Astha",
            "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
            "likes": [],
            "created_at": "2024-03-04T19:08:54.549Z",
            "updated_at": "2024-03-04T19:08:54.549Z",
          },
          {
            "id": 80,
            "reply": "Hiiiisbs",
            "likes_count": 0,
            "account_id": 27,
            "account_name": "Astha",
            "profile_image": null,
            "likes": [],
            "created_at": "2024-03-04T19:08:54.549Z",
            "updated_at": "2024-03-04T19:08:54.549Z",
          },
        ],
        "created_at": "2024-03-04T19:08:54.549Z",
        "updated_at": "2024-03-04T19:08:54.549Z",
        "commentable": {
          "id": 123,
          "event_title": "Event 1",
          "date_of_the_show": "2024-03-31",
          "time": "2000-01-01T20:00:00.000Z",
          "line_ups": null,
          "description": "Description",
          "rules_and_regulations": "Rules",
          "created_at": "2024-03-04T15:48:29.745Z",
          "updated_at": "2024-03-04T16:44:37.345Z",
          "city": "Bloomingdale",
          "state": "District of Columbia",
          "country": "US",
          "address": "Address lko",
          "location": "Sadar lucknow",
          "zip_code": 226002,
          "like_by_me": false,
          "added_in_calendar": false,
          "account_id": 221,
          "type_of_show": ""
        },
        "account": {
          "id": 27,
          "first_name": "comuser",
          "full_phone_number": "918521479635",
          "country_code": 91,
          "phone_number": 8521479635,
          "email": "abc@gmail.com",
          "activated": true,
          "device_id": null,
          "unique_auth_id": "BBVneNwamOR5pCiCxwrNVAtt",
          "password_digest": "$2a$12$f4EGVjzxhHS8nWP4nuptmuqD9Nj1M4YKAI9F.EaJhtkdt.o5iP0b.",
          "created_at": "2023-10-17T06:39:02.543Z",
          "updated_at": "2023-10-17T06:39:02.552Z",
          "user_name": null,
          "platform": null,
          "user_type": null,
          "app_language_id": null,
          "last_visit_at": null,
          "is_blacklisted": false,
          "suspend_until": null,
          "status": "regular",
          "role_id": 1,
          "full_name": null,
          "gender": null,
          "date_of_birth": null,
          "age": null,
          "country": "India",
          "state": "MP",
          "city": "Indore",
          "i_would_like": false,
          "terms_and_conditions": false,
          "are_you_18": false,
          "archived": false,
          "archived_at": null,
          "private": true,
          "location": null,
          "band_artist_name": null,
          "verify_at": null
        },
        "profile_image_url": null,
        "like_by_me": null,
        "likes_count": 0,
        "model_name": "BxBlockComments::Comment"
      }
    }
  ]
};

const createCommentAPIResponse = {
  "data": {
    "id": "23",
    "type": "comment",
    "attributes": {
      "id": 23,
      "account_id": 27,
      "commentable_id": 123,
      "commentable_type": "Show",
      "comment": "Some other comment",
      "replies": [
        {
          "id": 79,
          "reply": "Hiiiisbs",
          "likes_count": 0,
          "account_id": 27,
          "account_name": "Astha",
          "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
          "likes": [],
          "created_at": "2024-03-07T05:20:22.156Z",
          "updated_at": "2024-03-07T05:20:22.156Z",
        },
        {
          "id": 80,
          "reply": "Hiiiisbs",
          "likes_count": 0,
          "account_id": 27,
          "account_name": "Astha",
          "profile_image": null,
          "likes": [],
          "created_at": "2024-03-07T05:20:22.156Z",
          "updated_at": "2024-03-07T05:20:22.156Z",
        },
      ],
      "created_at": "2024-03-07T05:20:22.156Z",
      "updated_at": "2024-03-07T05:20:22.156Z",
      "commentable": {
        "id": 123,
        "event_title": "Event 1",
        "date_of_the_show": "2024-03-31",
        "time": "2000-01-01T20:00:00.000Z",
        "line_ups": null,
        "description": "Description",
        "rules_and_regulations": "Rules",
        "created_at": "2024-03-04T15:48:29.745Z",
        "updated_at": "2024-03-04T16:44:37.345Z",
        "city": "Bloomingdale",
        "state": "District of Columbia",
        "country": "US",
        "address": "Address lko",
        "location": "Sadar lucknow",
        "zip_code": 226002,
        "like_by_me": false,
        "added_in_calendar": false,
        "account_id": 221,
        "type_of_show": ""
      },
      "account": {
        "id": 27,
        "first_name": "comuser",
        "full_phone_number": "918521479635",
        "country_code": 91,
        "phone_number": 8521479635,
        "email": "abc@gmail.com",
        "activated": true,
        "device_id": null,
        "unique_auth_id": "BBVneNwamOR5pCiCxwrNVAtt",
        "password_digest": "$2a$12$f4EGVjzxhHS8nWP4nuptmuqD9Nj1M4YKAI9F.EaJhtkdt.o5iP0b.",
        "created_at": "2023-10-17T06:39:02.543Z",
        "updated_at": "2023-10-17T06:39:02.552Z",
        "user_name": null,
        "platform": null,
        "user_type": null,
        "app_language_id": null,
        "last_visit_at": null,
        "is_blacklisted": false,
        "suspend_until": null,
        "status": "regular",
        "role_id": 1,
        "full_name": null,
        "gender": null,
        "date_of_birth": null,
        "age": null,
        "country": "India",
        "state": "MP",
        "city": "Indore",
        "i_would_like": false,
        "terms_and_conditions": false,
        "are_you_18": false,
        "archived": false,
        "archived_at": null,
        "private": true,
        "location": null,
        "band_artist_name": null,
        "verify_at": null
      },
      "like_by_me": null,
      "likes_count": 0,
      "model_name": "BxBlockComments::Comment"
    }
  },
  "meta": {
    "success": true,
    "message": "Comment created."
  }
}

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
  getCurrentPosition: jest.fn()
}));

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('authToken')),
  get: jest.fn().mockImplementation(() => Promise.resolve('27')),
}));

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_role')),
  get: jest.fn().mockImplementation(() => Promise.resolve('fan')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

const feature = loadFeature('./__tests__/features/SearchResult-scenario.feature')

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android')
  })

  test('User navigates to SearchResult', ({ given, when, then }) => {
    let SearchResultWrapper: ShallowWrapper
    let instance: SearchResult

    given('User loading search result', () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      SearchResultWrapper = shallow(<SearchResult {...screenProps} />)
    })

    when('User navigate to the search result', async () => {
      instance = SearchResultWrapper.instance() as SearchResult
      SearchResultWrapper.findWhere(node => node.prop("testID") === "hideKeyboard").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "backBtn").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "popupCloseButton").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "createAccountBtn").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "loginBtn").simulate("press")
      instance.setState({userId:'123',authToken:'123'})
      await instance.handleProfileNavigation('123','Band')
      await instance.handleProfileNavigation('124','Artist')
      await instance.handleProfileNavigation('123','Fan')
    })

    then("User clicks on button", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Event list is rendered", () => {
      
      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockEventList)
      mockAPISuccessCall(instance, "getSearchShowAPICallId", [])
      mockAPIFailureCall(instance, "getSearchShowAPICallId", [])

      mockAPISuccessCall(instance, "getCommentsAPICallID", getCommentsApiResponse)
      mockAPISuccessCall(instance, "getCommentsAPICallID", [])
      mockAPIFailureCall(instance, "getCommentsAPICallID", [])

      mockAPISuccessCall(instance, "addNewCommentAPICallID", createCommentAPIResponse)
      mockAPISuccessCall(instance, "addNewCommentAPICallID", [])
      mockAPIFailureCall(instance, "addNewCommentAPICallID", [])

      const eventFlatlist = SearchResultWrapper.findWhere(node => node.prop("testID") === "eventFlatlist").simulate("press")
      mockEventList.forEach((item, index) => {
        const innerWrapper = eventFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        eventFlatlist.renderProp("ListEmptyComponent")();
        eventFlatlist.renderProp("keyExtractor")({ item });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "navigateToDetail"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandProfileImage"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandName"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "likeBtn"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "cmmentIcon").simulate("press")
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "likeThisTxt"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "commentsCount"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "comments"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "addToCalendar").simulate("press")
        innerWrapper.findWhere(node => node.prop("testID") === "addToCalendarIcon").simulate("press")
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "openMaps"
        ).simulate("press");
      })
    })

    then("User navigates to detail screen", () => {
      // expect(instance.state.userId).toBe("27")
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    })


  })

  test('Guest User navigates to SearchResult', ({ given, when, then }) => {
    let SearchResultWrapper: ShallowWrapper
    let instance: SearchResult

    given('Guest User loading search result', () => {
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
      SearchResultWrapper = shallow(<SearchResult {...guestScreenProps} />)
    })

    when('Guest User navigate to the search result', () => {
      instance = SearchResultWrapper.instance() as SearchResult
      SearchResultWrapper.findWhere(node => node.prop("testID") === "hideKeyboard").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "backBtn").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "popupCloseButton").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "createAccountBtn").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "loginBtn").simulate("press")
    })

    then("Guest User clicks on button", () => {
      expect(guestScreenProps.navigation.goBack).toHaveBeenCalled();
    })

    when("Event list is rendered", () => {
      mockAPISuccessCall(instance, "getSearchShowAPICallId", mockEventList)
      mockAPISuccessCall(instance, "getSearchShowAPICallId", { errors: [] })
      mockAPIFailureCall(instance, "getSearchShowAPICallId", [])
      const eventFlatlist = SearchResultWrapper.findWhere(node => node.prop("testID") === "eventFlatlist").simulate("press")
      mockEventList.forEach((item, index) => {
        const innerWrapper = eventFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        eventFlatlist.renderProp("ListEmptyComponent")();
        eventFlatlist.renderProp("keyExtractor")({ item });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "navigateToDetail"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandProfileImage"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandName"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "likeBtn"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "cmmentIcon").simulate("press")

        mockAPISuccessCall(instance, "postLikeDislikeApiCallId", [])
        mockAPISuccessCall(instance, "postLikeDislikeApiCallId", { errors: [] })
        mockAPIFailureCall(instance, "postLikeDislikeApiCallId", [])
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "likeThisTxt"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "commentsCount"
        ).simulate("press");
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "comments"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "addToCalendar").simulate("press")
        innerWrapper.findWhere(node => node.prop("testID") === "addToCalendarIcon").simulate("press")
        mockAPISuccessCall(instance, "addEventToCalendarAPICallId", [])
        mockAPISuccessCall(instance, "addEventToCalendarAPICallId", { errors: [] })
        mockAPIFailureCall(instance, "addEventToCalendarAPICallId", [])
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "openMaps"
        ).simulate("press");
      })
    })

    then("Guest User navigates to detail screen", () => {
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    })


  })

  test('User navigates to SearchResult for comments', ({ given, when, then }) => {
    let SearchResultWrapper: ShallowWrapper
    let instance: SearchResult
    let testFn = jest.fn();

    given('User loading search result', () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      SearchResultWrapper = shallow(<SearchResult {...screenProps} />)
    })

    when("User interacts with comments", () => {
      instance = SearchResultWrapper.instance() as SearchResult
      instance.commentTextInput = { focus: testFn };
      mockAPISuccessCall(instance, "getCommentsAPICallID", getCommentsApiResponse)
      const eventFlatlist = SearchResultWrapper.findWhere(node => node.prop("testID") === "eventFlatlist").simulate("press")
      mockEventList.forEach((item, index) => {
        const innerWrapper = eventFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        eventFlatlist.renderProp("ListEmptyComponent")();
        eventFlatlist.renderProp("keyExtractor")({ item });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandProfileImage"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "cmmentIcon").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "commentTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiCommentBtn").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "commentsModal").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "closeCommentsPopupButton").simulate("press")
        instance.setState({ isEditing: false })
        SearchResultWrapper.findWhere(node => node.prop("testID") === "replyTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiReplyBtn").simulate("press")
        let mainCommentSwipeListView = SearchResultWrapper.findWhere(
          (node) => node.prop("testID") === "mainSwipeListView"
        );
        getCommentsApiResponse.data.forEach(() => {
          const mainRenderItem = mainCommentSwipeListView.renderProp("renderItem")({
            item: getCommentsApiResponse.data[0],
            index: index,
          });

          const nonSwipeableComments = mainRenderItem.findWhere(
            (node) => node.prop("testID") === "commentsNonSwipableListView"
          );

          getCommentsApiResponse.data.forEach(() => {
            const commentsRenderItem = nonSwipeableComments.renderProp("renderItem")({
              item: getCommentsApiResponse.data[0],
              index: index,
            });
            
            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "imageShowProfile")
              .simulate("press");

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "replyButton")
              .simulate("press");

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "showReplyButton")
              .simulate("press");

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "likeCommentButton")
              .simulate("press");
          })

        })
      })

    })

    then("User navigates to detail screen", () => {
 
    })


    when("User interacts with comments", () => {
      mockAPISuccessCall(instance, "getCommentsAPICallID", getCommentsApiResponse)
      const eventFlatlist = SearchResultWrapper.findWhere(node => node.prop("testID") === "eventFlatlist").simulate("press")
      mockEventList.forEach((item, index) => {
        const innerWrapper = eventFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        eventFlatlist.renderProp("ListEmptyComponent")();
        eventFlatlist.renderProp("keyExtractor")({ item });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandProfileImage"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "cmmentIcon").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "commentTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiCommentBtn").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "closeCommentsPopupButton").simulate("press")
        instance.setState({ isEditing: false })
        SearchResultWrapper.findWhere(node => node.prop("testID") === "replyTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiReplyBtn").simulate("press")
        instance.setState({ userId: "27" })
        let mainCommentSwipeListView = SearchResultWrapper.findWhere(
          (node) => node.prop("testID") === "mainSwipeListView"
        );
        getCommentsApiResponse.data.forEach(() => {
          const mainRenderItem = mainCommentSwipeListView.renderProp("renderItem")({
            item: getCommentsApiResponse.data[0],
            index: index,
          });

          const swipeableComments = mainRenderItem.findWhere(
            (node) => node.prop("testID") === "commentsSwipableListView"
          );

          getCommentsApiResponse.data.forEach(() => {
            const commentsRenderItem = swipeableComments.renderProp("renderItem")({
              item: getCommentsApiResponse.data[0],
              index: index,
            });
            let hiddenItem = swipeableComments.renderProp("renderHiddenItem")(
              {
                item: {
                  id: "",
                  attributes: {
                    account_id: '',
                    comment: "",
                  }
                }
              },
              []
            );

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "imageShowProfile")
              .simulate("press");

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "replyButton")
              .simulate("press");

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "showReplyButton")
              .simulate("press");

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "likeCommentButton")
              .simulate("press");

            hiddenItem
              .findWhere((node) => node.prop("testID") === "editComment")
              .simulate("press");

            hiddenItem
              .findWhere((node) => node.prop("testID") === "deleteComment")
              .simulate("press");
          })

        })
      })

    })

    then("User navigates to detail screen", () => {
   
    })

    when("User interacts with replies", () => {
      mockAPISuccessCall(instance, "getCommentsAPICallID", getCommentsApiResponse)
      const eventFlatlist = SearchResultWrapper.findWhere(node => node.prop("testID") === "eventFlatlist").simulate("press")
      mockEventList.forEach((item, index) => {
        const innerWrapper = eventFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        eventFlatlist.renderProp("ListEmptyComponent")();
        eventFlatlist.renderProp("keyExtractor")({ item });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandProfileImage"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "cmmentIcon").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "commentTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiCommentBtn").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "closeCommentsPopupButton").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "replyTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiReplyBtn").simulate("press")
        instance.setState({ isEditing: false, showReplies: true, commentsLoading: false, userId: "10" })
        SearchResultWrapper.findWhere(node => node.prop("testID") === "replyModalBackBtn").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "repliesModal").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "repliesProfile").simulate("press")
        
        let mainReplySwipeList = SearchResultWrapper.findWhere(
          (node) => node.prop("testID") === "mainReplySwipeList"
        );
        const replyData = [
          {
            "id": 79,
            "reply": "Hiiiisbs",
            "likes_count": 0,
            "account_id": 27,
            "account_name": "Astha",
            "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
            "likes": [],
            "created_at": "2024-03-07T05:20:22.156Z",
            "updated_at": "2024-03-07T05:20:22.156Z",
          },
          {
            "id": 80,
            "reply": "Hiiiisbs",
            "likes_count": 0,
            "account_id": 27,
            "account_name": "Astha",
            "profile_image": null,
            "likes": [],
            "created_at": "2024-03-04T19:08:54.549Z",
            "updated_at": "2024-03-04T19:08:54.549Z",
          },
        ]
        replyData.forEach(() => {
          const mainRenderItem = mainReplySwipeList.renderProp("renderItem")({
            item: replyData[0],
            index: index,
          });

          const nonSwipeableReplies = mainRenderItem.findWhere(
            (node) => node.prop("testID") === "replyNonSwipableListView"
          );

          replyData.forEach(() => {
            const commentsRenderItem = nonSwipeableReplies.renderProp("renderItem")({
              item: replyData[0],
              index: index,
            });
            
            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "imageShowProfileReply")
              .simulate("press");
          })

        })
      })

    })

    then("User navigates to detail screen", () => {
     
    })


    when("User interacts with replies", () => {
      mockAPISuccessCall(instance, "getCommentsAPICallID", getCommentsApiResponse)
      const eventFlatlist = SearchResultWrapper.findWhere(node => node.prop("testID") === "eventFlatlist").simulate("press")
      mockEventList.forEach((item, index) => {
        const innerWrapper = eventFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        eventFlatlist.renderProp("ListEmptyComponent")();
        eventFlatlist.renderProp("keyExtractor")({ item });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "bandProfileImage"
        ).simulate("press");
        innerWrapper.findWhere(node => node.prop("testID") === "cmmentIcon").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "commentTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiCommentBtn").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "closeCommentsPopupButton").simulate("press")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "replyTextInput").simulate("changeText", "comment")
        SearchResultWrapper.findWhere(node => node.prop("testID") === "emojiReplyBtn").simulate("press")
        instance.setState({ isEditing: false, showReplies: true, commentsLoading: false, userId: "27" })
        let mainReplySwipeList = SearchResultWrapper.findWhere(
          (node) => node.prop("testID") === "mainReplySwipeList"
        );
        getCommentsApiResponse.data[0].attributes.replies.forEach(() => {
          const mainRenderItem = mainReplySwipeList.renderProp("renderItem")({
            item: getCommentsApiResponse.data[0].attributes.replies[0],
            index: index,
          });

          const swipeableReplies = mainRenderItem.findWhere(
            (node) => node.prop("testID") === "replySwipableListView"
          );

          getCommentsApiResponse.data.forEach(() => {
            const commentsRenderItem = swipeableReplies.renderProp("renderItem")({
              item: getCommentsApiResponse.data[0],
              index: index,
            });
            let hiddenItem = swipeableReplies.renderProp("renderHiddenItem")(
              {
                item: {
                  id: "",
                  attributes: {
                    account_id: '',
                    comment: "",
                  }
                }
              },
              []
            );

            commentsRenderItem
              .findWhere((node) => node.prop("testID") === "imageShowProfileReply")
              .simulate("press");

            hiddenItem
              .findWhere((node) => node.prop("testID") === "editReply")
              .simulate("press");

            hiddenItem
              .findWhere((node) => node.prop("testID") === "deleteReply")
              .simulate("press");
          })

        })
      })

    })

    then("User navigates to detail screen", () => {

    })


  })

  test('Guest User navigates to Search Result', ({ given, when, then }) => {
    let SearchResultWrapper: ShallowWrapper
    let instance: SearchResult

    given('Guest User loading search result', () => {
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

      jest.doMock("../../../../framework/src/StorageProvider", () => ({
        set: jest.fn().mockImplementation(() => Promise.resolve('authToken')),
        get: jest.fn().mockImplementation(() => Promise.resolve('27')),
      }));

      SearchResultWrapper = shallow(<SearchResult {...guestScreenProps2} />)
    })

    when('Guest User navigate to the search result', () => {
      instance = SearchResultWrapper.instance() as SearchResult
      SearchResultWrapper.findWhere(node => node.prop("testID") === "backBtn").simulate("press")
      SearchResultWrapper.findWhere(node => node.prop("testID") === "hamburgerIcon").simulate("press")
    })

    then("Guest User clicks on button", () => {
      expect(guestScreenProps2.navigation.goBack).toHaveBeenCalled();
    })

  })


})
