import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import HomeEmptyScreen from "../../src/HomeEmptyScreen";
import { PermissionsAndroid, Platform } from "react-native";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import GeolocationServices from "react-native-geolocation-service";
import Permissions from "react-native-permissions";
import { log } from "react-native-reanimated";
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
export const configJSON = require("../../config.json");

const mockEventList = [
  {
    "state_name": "MP",
    "shows": [
      {
        "id": 2,
        "event_title": "",
        "date_of_the_show": null,
        "time": null,
        "line_ups": null,
        "description": "",
        "rules_and_regulations": "",
        "created_at": "2024-01-08T10:36:31.495Z",
        "updated_at": "2024-01-23T11:24:43.771Z",
        "city": "Ahemdabad",
        "state": "MP",
        "country": null,
        "address": null,
        "location": null,
        "zip_code": null,
        "like_by_me": null,
        "added_in_calendar": false,
        "profile_image": "123"
      },
      {
        "id": 3,
        "event_title": "",
        "date_of_the_show": null,
        "time": null,
        "line_ups": null,
        "description": "",
        "rules_and_regulations": "",
        "created_at": "2024-01-08T10:36:31.495Z",
        "updated_at": "2024-01-23T11:24:43.771Z",
        "city": "Ahemdabad",
        "state": "MP",
        "country": null,
        "address": null,
        "location": null,
        "zip_code": null,
        "like_by_me": false,
        "added_in_calendar": true,
        "profile_image": ""
      }
    ]
  },
  {
    "state_name": "California",
    "shows": [
      {
        "id": 4,
        "event_title": "",
        "date_of_the_show": null,
        "time": null,
        "line_ups": null,
        "description": "",
        "rules_and_regulations": "",
        "created_at": "2024-01-12T11:28:15.601Z",
        "updated_at": "2024-01-24T11:49:03.088Z",
        "city": null,
        "state": "California",
        "country": null,
        "address": null,
        "location": null,
        "zip_code": null,
        "like_by_me": true,
        "added_in_calendar": false,
        "profile_image": ""
      }
    ]
  }
]

const mockResponse = {
  "data": [
    {
      "Alaska": [
        {
          "id": 5,
          "event_title": "Dummy event",
          "date_of_the_show": "2024-11-18",
          "time": "2000-01-01T04:00:00.000Z",
          "line_ups": null,
          "description": "This is a dummy event",
          "rules_and_regulations": null,
          "created_at": "2024-01-09T13:12:02.385Z",
          "updated_at": "2024-01-25T06:14:10.492Z",
          "city": "Akutan",
          "state": "Alaska",
          "country": "United States",
          "address": "",
          "location": "",
          "zip_code": null,
          "like_by_me": false,
          "likes_count": 0,
          "show_features": [],
          "added_in_calendar": false,
          "profile_image": ""
        }
      ]
    }
  ]
}

const mockCategoryList = [
  {
    "id": "30",
    "type": "category",
    "attributes": {
      "id": 30,
      "name": "category part2",
      "created_at": "2023-11-09T07:04:18.294Z",
      "updated_at": "2023-11-09T07:29:26.573Z"
    }
  },
  {
    "id": "37",
    "type": "category",
    "attributes": {
      "id": 37,
      "name": "music",
      "created_at": "2023-11-20T10:58:41.119Z",
      "updated_at": "2023-11-20T10:58:50.328Z"
    }
  },
]
const eventsByLocationResponse = {
  "data": [
    {
      "id": "26",
      "type": "show",
      "attributes": {
        "event_title": "Music concert",
        "date_of_the_show": "2024-05-12",
        "time": "04:00:00",
        "line_ups": null,
        "description": "the show is based on the music concert",
        "rules_and_regulations": "",
        "city": "Akutan",
        "state": "AK",
        "country": "AU",
        "zip_code": null,
        "address": "",
        "location": "",
        "show_features": [],
        "like_by_me": false,
        "added_in_calendar": true,
        "likes_count": 0,
        "model_name": "Show",
        "profile_image": ""
      }
    }
  ],
  "meta": {
    "message": "List of all shows."
  }
}

const eventsByLocationResponseNoData = {
  "data": [],
  "meta": {
    "message": "List of all shows."
  }
}

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
          "account_id": 221,
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

const getCommentsApiResponseWithLikesAndReplies = {
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
        "profile_image_url": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
        "like_by_me": true,
        "likes_count": 0,
        "model_name": "BxBlockComments::Comment"
      }
    }
  ]
};

const screenProps = {
  navigation: {
    getParam: jest.fn(),
    navigate: jest.fn(),
    addListener: (_: string, _a: () => void) => { }
  },
  id: "HomeEmptyScreen",
};

const feature = loadFeature(
  "./__tests__/features/HomeEmptyScreen-scenario.feature"
);

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
  set: jest.fn().mockImplementation(() => Promise.resolve([]))
}));

defineFeature(feature, (test) => {
  
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  

  test("User navigates to HomeEmptyScreen", ({ given, when, then }) => {
    let homeEmptyWrapper: ShallowWrapper;
    let instance: HomeEmptyScreen;

    given("I am a User loading HomeEmptyScreen", () => {
      homeEmptyWrapper = shallow(<HomeEmptyScreen {...screenProps} />);
    });

    when("I navigate to the HomeEmptyScreen", () => {
      instance = homeEmptyWrapper.instance() as HomeEmptyScreen;
      jest.advanceTimersByTime(500);
    });

    then("User clicks on modal buttons", () => {
      expect(instance.state.modalVisible).toBe(false)
    })

  });

  test("Permissions in iOS", ({ given, when, then }) => {
    let eventsWrapper: ShallowWrapper;
    let instance: HomeEmptyScreen;

    given("User attempting to load HomeEmptyScreen", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      eventsWrapper = shallow(
        <HomeEmptyScreen {...screenProps} />
      );

      instance = eventsWrapper.instance() as HomeEmptyScreen;

    });

    when("User requests for location permissions", () => {
      instance.requestLocationPermission();
    });

    then("ios permission method is invoked", () => {
      expect(instance.state.hasLocationPermission).toBe(false);
    });

    when("I deny response", () => {
      jest.spyOn(GeolocationServices, "requestAuthorization").mockImplementationOnce(() => Promise.resolve("denied"));
      instance.requestLocationPermission();

      jest.spyOn(GeolocationServices, "requestAuthorization").mockImplementationOnce(() => Promise.resolve("disabled"));
      instance.requestLocationPermission();

      jest.spyOn(Permissions, "check").mockImplementationOnce(() => Promise.resolve("denied"));
      instance.hasLocationPermission();

      jest.doMock("react-native", () => ({ Platform: { OS: "android", Version: 30 } }));

      jest.spyOn(PermissionsAndroid, "request").mockImplementationOnce(() => Promise.resolve(PermissionsAndroid.RESULTS.GRANTED));
      instance.requestLocationPermissionAndroid();

      jest.spyOn(PermissionsAndroid, "request").mockImplementationOnce(() => Promise.reject("Error"));
      instance.requestLocationPermissionAndroid();
    })

    then("ios permission method is invoked", () => {
      expect(instance.state.hasLocationPermission).toBe(false);
    });
  });
});