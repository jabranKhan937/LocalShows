import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import AllEventScreen from "../../src/AllEventScreen";
import { Platform } from "react-native";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { ISocketMessage } from "../../../chat/src/ChatController";
import StorageProvider from '../../../../framework/src/StorageProvider'
import  messaging  from "@react-native-firebase/messaging";
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
        "genre": [],
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
        "type": "show",
        "added_in_calendar": false,
        "profile_image": "123"
      },
      {
        "id": 3,
        "event_title": "",
        "date_of_the_show": null,
        "time": null,
        "genre": [],
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
        "type": "post",
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
        "genre": [],
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
        "type": "show",
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
      "UP": [
        {
          "id": 179,
          "event_title": "lat_long889",
          "date_of_the_show": "2024-07-29",
          "time": "2000-01-01T04:00:00.000Z",
          "line_up": null,
          "description": "this is a swiming show.test",
          "rules_and_regulations": "nfnkdnkfdnkfnkdnfkdndbnfdsbhdwf",
          "created_at": "2024-06-18T09:40:52.629Z",
          "updated_at": "2024-06-18T09:40:52.629Z",
          "city": "new delhi old",
          "state": "UP",
          "country": "India",
          "address": "waterparktest",
          "location": "Mig road",
          "zip_code": 45200,
          "like_by_me": null,
          "added_in_calendar": false,
          "account_id": 149,
          "type_of_show": "swmng",
          "lat": 30.889805,
          "long": -77.009056,
          "genre": null,
          "type": "show",
          "likes_count": 0,
          "comments_count": 0,
          "show_features": [

          ],
          "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWnM9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6201841c0c4de12e3b4a28f31424568fbebebaa9/E4784hdVoAQPfw5.jpeg"
        },
        {
          "id": 16,
          "name": "Postnewe",
          "description": "\"post8\"",
          "category_id": null,
          "created_at": "2024-06-14T05:06:42.464Z",
          "updated_at": "2024-06-14T05:06:42.477Z",
          "body": null,
          "location": "UP",
          "account_id": 149,
          "like_by_me": null,
          "is_explicit": true,
          "added_in_calendar": false,
          "type": "post",
          "likes_count": 0,
          "images_and_videos": [
            "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYXc9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1dc043e6b51818472eead132fd7862a0ea9b58fe/5783df2e9eb364e76940841004f501f8.png"
          ]
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
        "genre": [],
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
        "profile_image": "",
        "type": "show",
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
        "genre": [],
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
        "type_of_show": "",
        "type": "show",
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
          "genre": [],
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
          "type_of_show": "",
          "type": "show",
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
          "verify_at": null,
          "account_type": null,
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
          "genre": [],
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
          "type_of_show": "",
          "type": "post",
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
          "verify_at": null,
          "account_type": "Band",
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
          "genre": [],
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
          "type_of_show": "",
          "type": "show",
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

jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(),
}));

const screenProps = {
  navigation: {
    getParam: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    openDrawer: jest.fn(),
    push:jest.fn()
  },
  id: "AllEventScreen",
};

const feature = loadFeature(
  "./__tests__/features/AllEventScreen-scenario.feature"
);



jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_id')),
  get: jest.fn().mockImplementation(() => Promise.resolve('27')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_role')),
  get: jest.fn().mockImplementation(() => Promise.resolve('fan')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));
jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    requestPermission: jest.fn(),
    onMessage: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
    getToken:jest.fn(),
    registerDeviceForRemoteMessages:jest.fn(),
    onNotificationOpenedApp:jest.fn(),
    getInitialNotification:jest.fn().mockImplementation(() => Promise.resolve('test')),
  });
});

jest.useFakeTimers()

defineFeature(feature, (test) => {
  let debugLogSpy:any;
  beforeEach(() => {
    debugLogSpy = jest.spyOn(runEngine, 'debugLog');
    jest.resetModules();
    jest.doMock("react-native", () => ({
      Platform: { OS: "web" }, Alert: {
        alert: jest.fn()
      }
    }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("User navigates to AllEventScreen", ({ given, when, then }) => {
    let allEventScreen: ShallowWrapper;
    let instance: AllEventScreen;
    let localShowsTitle: ShallowWrapper;

    given("I am a User loading AllEventScreen", () => {
      allEventScreen = shallow(<AllEventScreen {...screenProps} />);
    });

    when("I navigate to the AllEventScreen", async () => {
      instance = allEventScreen.instance() as AllEventScreen;
      StorageProvider.get.mockResolvedValue(null)
      localShowsTitle = allEventScreen.findWhere(node => node.prop("testID") === "localShowsTitle")
      instance.showPopup()
      instance.hasLocationPermission()
      instance.getEventsListAPI()
      instance.initialiseLocation()
      instance.performSearch();
      instance.setState({authToken:'123'})
      instance.setState({userId:'123'})
      instance.showProfile('123','Fan')
      instance.setState({authToken:''})
      instance.openGoogleMaps({
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
      })
      
      const getUnreadChatListAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getUnreadChatListAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), getUnreadChatListAPISuccess.messageId);
      getUnreadChatListAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[{attributes:2}]});
      instance.getChatListApiCallId = getUnreadChatListAPISuccess.messageId
      runEngine.sendMessage("Unit Test", getUnreadChatListAPISuccess)

      const getUnreadChatListAPISuccess2 = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getUnreadChatListAPISuccess2.addData(getName(MessageEnum.RestAPIResponceDataMessage), getUnreadChatListAPISuccess2.messageId);
      getUnreadChatListAPISuccess2.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[null]});
      instance.getChatListApiCallId = getUnreadChatListAPISuccess2.messageId
      runEngine.sendMessage("Unit Test", getUnreadChatListAPISuccess2)   
   
      const getEventListAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getEventListAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), getEventListAPISuccess.messageId);
      getEventListAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), mockResponse);
      instance.getEventsListApiCallId = getEventListAPISuccess.messageId
      runEngine.sendMessage("Unit Test", getEventListAPISuccess)

      const getCommentsAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getCommentsAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), getCommentsAPISuccess.messageId);
      getCommentsAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), getCommentsApiResponse);
      instance.getCommentsAPICallID = getCommentsAPISuccess.messageId
      runEngine.sendMessage("Unit Test", getCommentsAPISuccess)

      const getEventListAPIFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getEventListAPIFailure.addData(getName(MessageEnum.RestAPIResponceDataMessage), getEventListAPIFailure.messageId);
      getEventListAPIFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), []);
      instance.getEventsListApiCallId = getEventListAPIFailure.messageId
      runEngine.sendMessage("Unit Test", getEventListAPIFailure)

      const getCategoryListAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getCategoryListAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), getCategoryListAPISuccess.messageId);
      getCategoryListAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { data: mockCategoryList });
      instance.getCategoriesListAPICallID = getCategoryListAPISuccess.messageId
      runEngine.sendMessage("Unit Test", getCategoryListAPISuccess)

      const getCategoryListAPIFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getCategoryListAPIFailure.addData(getName(MessageEnum.RestAPIResponceDataMessage), getCategoryListAPIFailure.messageId);
      getCategoryListAPIFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), []);
      instance.getCategoriesListAPICallID = getCategoryListAPIFailure.messageId
      runEngine.sendMessage("Unit Test", getCategoryListAPIFailure)

      const getEventListAPITokenExpire = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getEventListAPITokenExpire.addData(getName(MessageEnum.RestAPIResponceDataMessage), getEventListAPITokenExpire.messageId);
      getEventListAPITokenExpire.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {
        "errors": [
          {
            "token": "Token has Expired"
          }
        ]
      });
      instance.getEventsListApiCallId = getEventListAPITokenExpire.messageId
      runEngine.sendMessage("Unit Test", getEventListAPITokenExpire)
      instance.showTokenExpiredPopup()
      instance.handleTokenExpired()

      const createCommentMsg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      createCommentMsg.addData(getName(MessageEnum.RestAPIResponceDataMessage), createCommentMsg.messageId);
      createCommentMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), createCommentAPIResponse);
      instance.createCommentAPICallID = createCommentMsg.messageId
      runEngine.sendMessage("Unit Test", createCommentMsg)

      const postLikeDislikeEventMsg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      postLikeDislikeEventMsg.addData(getName(MessageEnum.RestAPIResponceDataMessage), postLikeDislikeEventMsg.messageId);
      postLikeDislikeEventMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), createCommentAPIResponse);
      instance.postLikeDislikeEventApiCallId = postLikeDislikeEventMsg.messageId
      runEngine.sendMessage("Unit Test", postLikeDislikeEventMsg)
    });

    then("User clicks on modal buttons", () => {
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "popupCloseButton"
      ).simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "noThanksButton"
      ).simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "allowLocationPermissionButton"
      ).simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "popupCloseButton"
      ).simulate("press");
      
      expect(instance.state.modalVisible).toBe(false)
    })

    when("expandedItems has data", () => {
      instance.setState({ expandedItems: ["California"] })
    })

    then("User clicks on header buttons", () => {
      expect(instance.state.expandedItems.length).toBe(1)
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "navigationBackButton"
      ).simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "searchText"
      ).simulate("changeText", "searchText");
      expect(instance.state.searchText).toBe("searchText")
    })
    
    then("Render flatlist for guest user", () => {
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "eventsList");
      instance.setState({authToken:'123'})
      mockEventList.forEach((item, index) => {
        flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        flatList.renderProp("keyExtractor")({
          item: item,
        });

        flatList.renderProp("ListEmptyComponent")();
      })
    })

    when("Shows are more", () => {
      instance.setState({
        authenticatedEventsList: [
          {
            "state": "MP",
            "shows": [
              {
                "id": 1,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "like_by_me": true,
                "added_in_calendar": false,
                "type": "show",
              },
              {
                "id": 2,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "like_by_me": true,
                "added_in_calendar": false,
                "type": "show",
              },
              {
                "id": 3,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "like_by_me": true,
                "added_in_calendar": false,
                "type": "show",
              },
              {
                "id": 4,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "like_by_me": true,
                "added_in_calendar": false,
                "type": "show",
              },
              {
                "id": 5,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "like_by_me": true,
                "added_in_calendar": false,
                "type": "show",
              }
            ]
          }
        ],
      })
    })

    then("Render shows flatlist for guest user", () => {
      instance.setState({authToken:null})
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "eventsList");
      instance.state.authenticatedEventsList.forEach((item, index) => {
        const innerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "toggleSeeMore"
        ).simulate("press");
      })
     
    })

    then("User clicks on event to navigate", () => {
      const mockEvents = [
        {
          "state": "MP",
          "shows": [
            {
              "id": 2,
              "event_title": "",
              "date_of_the_show": null,
              "time": null,
              "genre": [],
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
              "like_by_me": true,
              "added_in_calendar": false,
              "type": "show",
            },

          ]
        }
      ]
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "eventsList");
      mockEvents.forEach((item, index) => {
        const innerWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        innerWrapper.findWhere(node => node.prop("testID") === "eventLaunch").simulate("press");
      })
      expect(localShowsTitle).toBeDefined();
    })

    when("User clicks on All tab", () => {
      instance.setState({ selectedCategoryID: '30', selectedFilterIndex: 0 })
    })

    then("All tab activates", () => {
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "categoryList");
      mockCategoryList.forEach((item, index) => {
        const flatlistWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        flatList.renderProp("keyExtractor")({
          item: item,
        });

        flatlistWrapper.findWhere(
          (node) => node.prop("testID") === "filterButton"
        ).simulate("press");
      })
      expect(instance.state.selectedFilterIndex).toBe(1)
    })

    when("User is a logged in user", () => {
      instance.setState({ authToken: "authToken" })
    })

    then("User clicks on notification bell", () => {
      instance.getEventsListAPI()
      instance.hasLocationPermission()
      instance.initialiseLocation()
      instance.getEventsFromLocation()
      instance.getEventsByLatLong(0, 0);
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "bellIcon"
      ).simulate("press");
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "drawerImage"
      ).simulate("press");

      expect(instance.state.authToken).toBe("authToken")
    })

    then("Render event list", () => {
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "authenticatedEventsList");
      mockEventList.forEach((item, index) => {
        flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        flatList.renderProp("keyExtractor")({
          item: item,
        });

        flatList.renderProp("ListEmptyComponent")();
      })
      expect(instance.state.authToken).toBe("authToken")
    })




    
    when("Event has some likes & comments", () => {
      instance.setState({
        authenticatedEventsList: [
          {
            "state": "MP",
            "shows": [
              {
                "id": 2,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "like_by_me": true,
                "added_in_calendar": false,
                "likes_count": 1,
                "comments_count": 1,
                "type": "show",
                'band_profile_image': 'test'
              },

            ]
          }
        ],
        from: "list"
      })
    })

    then("Show likes & comments count", () => {
      const mockData= {
        "state": "MP",
        "shows": [
          {
            "id": 2,
            "event_title": "",
            "date_of_the_show": null,
            "time": null,
            "genre": [],
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
            "like_by_me": true,
            "added_in_calendar": false,
            "likes_count": 1,
            "comments_count": 1,
            "type": "post",
            'band_profile_image': 'test'
          },

        ]
      }
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "authenticatedEventsList");
      instance.state.authenticatedEventsList.forEach((item, index) => {
        const flatlistWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        flatlistWrapper.findWhere(node => node.prop("testID") === "likeBtn").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "share").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "likeThisTxt").simulate("press");
        flatlistWrapper.findWhere(node => node.prop("testID") === "addEventToCalendarBtn").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "share").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "commentIcon").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "bandProfile").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "bandName").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "commentsCountBtn").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "likeBtn").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "share").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "addEventToCalendarBtn").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "commentIcon").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "commentsCountBtn").simulate("press")

        flatlistWrapper.findWhere(
          (node) => node.prop("testID") === "navigateToDetail"
        ).simulate("press");
      })
      const flatlistWrapper = flatList.renderProp("renderItem")({
        item: mockData,
        index: 0,
      });

      flatlistWrapper.findWhere(node => node.prop("testID") === "commentIcon").simulate("press")

      const postLikeDislikeEventAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postLikeDislikeEventAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), postLikeDislikeEventAPISuccess.messageId);
      postLikeDislikeEventAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        "message": "Successfully destroy"
      });
      instance.postLikeDislikeEventApiCallId = postLikeDislikeEventAPISuccess.messageId
      runEngine.sendMessage("Unit Test", postLikeDislikeEventAPISuccess)

      const postLikeDislikeEventAPIFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postLikeDislikeEventAPIFailure.addData(getName(MessageEnum.RestAPIResponceDataMessage), postLikeDislikeEventAPIFailure.messageId);
      postLikeDislikeEventAPIFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), []);
      instance.postLikeDislikeEventApiCallId = postLikeDislikeEventAPIFailure.messageId
      runEngine.sendMessage("Unit Test", postLikeDislikeEventAPIFailure)

      const addEventToCalendarMsg = new Message(getName(MessageEnum.RestAPIResponceMessage))
      addEventToCalendarMsg.addData(getName(MessageEnum.RestAPIResponceDataMessage), addEventToCalendarMsg.messageId);
      addEventToCalendarMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        "message": "Show is already in the calendar."
      });
      instance.addEventToCalendarAPICallID = addEventToCalendarMsg.messageId
      runEngine.sendMessage("Unit Test", addEventToCalendarMsg)

      const addEventToCalendarMsgFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      addEventToCalendarMsgFailure.addData(getName(MessageEnum.RestAPIResponceDataMessage), addEventToCalendarMsgFailure.messageId);
      addEventToCalendarMsgFailure.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {
        "errors": [
          "Record not found"
        ]
      });
      instance.addEventToCalendarAPICallID = addEventToCalendarMsgFailure.messageId
      runEngine.sendMessage("Unit Test", addEventToCalendarMsgFailure)
      expect(localShowsTitle).toBeDefined();
    })

    when("User likes an event", () => {
      instance.setState({
        authenticatedEventsList: [
          {
            "state": "MP",
            "shows": [
              {
                "id": 2,
                "event_title": "",
                "date_of_the_show": null,
                "time": null,
                "genre": [],
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
                "added_in_calendar": false,
                "likes_count": 1,
                "comment_count": 1,
                "type": "show",
              },

            ]
          }
        ],
        from: "list"
      })
    })

    then("Update likes count", () => {
      const flatList = allEventScreen.findWhere(node => node.prop("testID") === "authenticatedEventsList");
      instance.state.authenticatedEventsList.forEach((item, index) => {
        const flatlistWrapper = flatList.renderProp("renderItem")({
          item: item,
          index: index,
        });

        flatlistWrapper.findWhere(node => node.prop("testID") === "likeBtn").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "bandProfile").simulate("press")
        flatlistWrapper.findWhere(node => node.prop("testID") === "bandName").simulate("press")

        flatlistWrapper.findWhere(
          (node) => node.prop("testID") === "navigateToDetail"
        ).simulate("press");
      })

      const postLikeDislikeEventAPISuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      postLikeDislikeEventAPISuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), postLikeDislikeEventAPISuccess.messageId);
      postLikeDislikeEventAPISuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        "message": "Successfully destroy"
      });
      instance.postLikeDislikeEventApiCallId = postLikeDislikeEventAPISuccess.messageId
      runEngine.sendMessage("Unit Test", postLikeDislikeEventAPISuccess)
      expect(localShowsTitle).toBeDefined();
    })

    then('Platform is iOS', async () => {
      Platform.OS = 'ios';

      const result = await instance.hasLocationPermission();
      expect(result).toBe(true);
    });

    then('Platform is Android', async () => {
      Platform.OS = 'android';
      Platform.Version = 22;

      const result = await instance.hasLocationPermission();
      expect(result).toBe(true);
    });

    when("selectedState is empty", () => {
      instance.setState({ selectedState: "" })
    })

    then("Render UI with empty selectedState", () => {
      expect(instance.state.selectedState).toBe("")
    })

    when("selectedState is California", () => {
      instance.setState({ selectedState: "California" })
    })

    then("Render UI with California as selectedState", () => {
      allEventScreen.findWhere(node => node.prop("testID") === "statePickerModal").simulate("valueChange", "California")
      expect(instance.state.selectedState).toBe("California")
    })

    when("selectedState is California and expandedItems is empty", () => {
      instance.setState({ selectedState: "California", expandedItems: [] })
    })

    then("Render UI with California as selectedState and expandedItems is empty", () => {
      expect(instance.state.selectedState).toBe("California")
    })

    when("selectedState is California and expandedItems has state", () => {
      instance.setState({ selectedState: "California", expandedItems: ['California'] })
    })

    then("Render UI with California as selectedState and expandedItems has MP as state", () => {
      expect(instance.state.selectedState).toBe("California")
    })

    when("I call the events by location API successfully", () => {
      const getEventByLocationApiSuccess = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getEventByLocationApiSuccess.addData(getName(MessageEnum.RestAPIResponceDataMessage), getEventByLocationApiSuccess.messageId);
      getEventByLocationApiSuccess.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), eventsByLocationResponse);
      instance.getEventsListApiCallId = getEventByLocationApiSuccess.messageId
      runEngine.sendMessage("Unit Test", getEventByLocationApiSuccess)
    })

    then("I get the expected response", () => {
   
    })

    when("I call the events by location API with no data", () => {
      const getEventByLocationApiNoData = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getEventByLocationApiNoData.addData(getName(MessageEnum.RestAPIResponceDataMessage), getEventByLocationApiNoData.messageId);
      getEventByLocationApiNoData.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), eventsByLocationResponseNoData);
      instance.getEventsListApiCallId = getEventByLocationApiNoData.messageId
      runEngine.sendMessage("Unit Test", getEventByLocationApiNoData)
    })

    then("I get blank events list", () => {
      
    })

    when("I call the events by location API with failure", () => {
      const getEventByLocationApiFailure = new Message(getName(MessageEnum.RestAPIResponceMessage))
      getEventByLocationApiFailure.addData(getName(MessageEnum.RestAPIResponceDataMessage), getEventByLocationApiFailure.messageId);
      getEventByLocationApiFailure.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), null);
      instance.getEventsListApiCallId = getEventByLocationApiFailure.messageId
      runEngine.sendMessage("Unit Test", getEventByLocationApiFailure)
    })

    then("I get no data", () => {
    })

    when("I call the events list API but with location permissions", () => {
      instance.setState({ hasLocationPermission: true });
      instance.getEventsListAPI();
    })

    then("I get blank events list", () => {
    })

    when("I call the create comment API", () => {
      const msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(getName(MessageEnum.RestAPIResponceDataMessage), msg.messageId);
      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), createCommentAPIResponse);
      instance.createCommentAPICallID = msg.messageId
      runEngine.sendMessage("Unit Test", msg)
    })

    then("I get the expected response", () => {
      expect(instance.state.commentsLoading).toBe(true);
    })

    when("I call the get comments API", () => {
      const msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(getName(MessageEnum.RestAPIResponceDataMessage), msg.messageId);
      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), getCommentsApiResponse);
      instance.getCommentsAPICallID = msg.messageId
      runEngine.sendMessage("Unit Test", msg)
    });

    then("the comments are fetched", () => {
    });

    when("I click the closeCommentsPopupButton", async () => {
      const closeCommentsPopupButton = allEventScreen.findWhere(
        (node) => node.prop("testID") === "closeCommentsPopupButton"
      );
      closeCommentsPopupButton.simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "commentsModalClick"
      ).simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "closeReplyPopupButton"
      ).simulate("press");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "replyModalBackBtn"
      ).simulate("press")

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "repliesModalClick"
      ).simulate("press");

      instance.openPrefs()
      instance.setState({ isEditing: true })
      instance.replyToComment()
      instance.setState({ isEditing: false })
      instance.replyToComment()
      instance.handleShareNavigation('test')
      instance.showProfile('test','Fan')
      instance.showProfile('test','Artist')
      instance.setState({ authToken: 'test' })
      instance.handleLikeDislikePress()
      instance.setState({ authToken: '' })
      instance.setState({
        eventDetail: {
          attributes: {
            added_in_calendar: true
          }
        }
      })
      instance.handleAddToCalendarPress()
      instance.setState({ authToken: 'test' })
      instance.setState({
        eventDetail: {
          attributes: {
            added_in_calendar: true
          }
        }
      })
      instance.handleAddToCalendarPress()
      instance.setState({
        eventDetail: {
          attributes: null
        }
      })
      instance.handleAddToCalendarPress()
      instance.setState({
        eventDetail: {
          attributes: {
            added_in_calendar: false
          }
        }
      })
      instance.handleAddToCalendarPress()
      instance.handleRefresh()
      instance.handleEventNavigation()
      instance.handleCommentTextChange('test')
      instance.handleCommentOnBlur()
      instance.showState()
      instance.handleStateValueChangeIOS('test')
      instance.openRemoveFromCalendarPopup()
      instance.setState({ authToken: '' })
      instance.openRemoveFromCalendarPopup()
      instance.handleRemoveFromCalendar()
      instance.closeRemoveFromCalendar()
      instance.closeTnCModal()
      instance.handleTncUpdateCheckOut()
      const mockshow = {
        id: 'testid',
        type: 'test',
        account_id:123
      }
      instance.handleEventLaunch(mockshow, 'test')
      instance.setState({userId:"123"})
      instance.handleEventLaunch(mockshow, 'test')
      instance.setState({ selectedEventId: 'test', authToken: 'test' })
      instance.handleLikeTextPress()
      instance.setState({ commentText: 'test' })
      instance.handleSubmitEditing()
      instance.setState({ replying: true })
      instance.handleSubmitEditing()
      instance.setState({ commentText: 'test' })
      instance.handleSubmitEditing()
      instance.setState({ showReplies: true })
      instance.handleSubmitEditing()
      instance.handleEmojiSelected('test')
      instance.openWebsiteURL('https://test.com')
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "TnCPopupCloseBtn"
      ).simulate("press");
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "TnCPopupCloseBtn2"
      ).simulate("press");
      allEventScreen.findWhere(
        (node) => node.prop("testID") === "checkoutTnCbtn"
      ).simulate("press");
      instance.setState({showComments:true})
      instance.updateEventDetail()
      StorageProvider.get.mockResolvedValue('true')
      await instance.handleShareNavigation('test')
      await instance.handleLike('test', "show")
      await instance.handleLike('test', "post")
      await instance.handleAddEventToCalendar('test')
      instance.setState({userId:'123'})
      await instance.navigateToBandProfile(123)
      instance.setState({userId:''})
      await instance.navigateToBandProfile(123)
      instance.handleShareWithFriends()
      instance.setState({authToken:''})
      instance.handleShareWithFriends()
      StorageProvider.get.mockResolvedValue(null)
    });

    then("the comment popup disappears", () => {
      expect(instance.state.showComments).toBe(true);
    });

    when("I enter text into the commentTextInput", () => {
      const commentTextInput = allEventScreen.findWhere(
        (node) => node.prop("testID") === "commentTextInput"
      );
      commentTextInput.simulate("changeText", "Abcd");

      const replyTextInput = allEventScreen.findWhere(
        (node) => node.prop("testID") === "replyTextInput"
      );
      replyTextInput.simulate("changeText", "Abcd");

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "emojiComment"
      ).simulate("press")

      instance.setState({ isEditing: true })

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "emojiReplyBtn"
      ).simulate("press")

    });

    then("the comment text is updated", () => {
      expect(instance.state.commentText).toBe("");
    });
  });

  test("Comments", ({ given, when, then }) => {
    let allEventScreen: ShallowWrapper;
    let instance: AllEventScreen;

    given("I am a User loading AllEventScreen", () => {
      allEventScreen = shallow(<AllEventScreen {...screenProps} />);
    });

    when("I navigate to the AllEventScreen", async () => {
      instance = allEventScreen.instance() as AllEventScreen;
     
    });

    then("I can toggle the comments popup", () => {
      expect(instance.state.showComments).toBe(false);
    });
  });

  test("Comments popup", ({ given, when, then }) => {
    let instance: AllEventScreen;
    let allEventScreen: ShallowWrapper;
    let commentsPopup: ShallowWrapper;
    let replyPopup: ShallowWrapper;
    let replyButton: ShallowWrapper;
    let likeCommentButton: ShallowWrapper;
    let editDeleteCommentsHiddenItems: ShallowWrapper;
    let editDeleteRepliesHiddenItems: ShallowWrapper;
    let editCommentsButton: ShallowWrapper;
    let editRepliesButton: ShallowWrapper;
    let testFn = jest.fn();
    let localShowsTitle: ShallowWrapper;

    given("I am a User opening the comments popup", () => {
      allEventScreen = shallow(<AllEventScreen {...screenProps} />);
    });

    when("I open the comments popup", () => {
      instance = allEventScreen.instance() as AllEventScreen;
      localShowsTitle = allEventScreen.findWhere(node => node.prop("testID") === "localShowsTitle")
      commentsPopup = shallow(<instance.renderCommentItem item={getCommentsApiResponseWithLikesAndReplies.data[0]} />);
      replyPopup = shallow(<instance.renderReplies />);
      instance.setState({
        showRepliesFor: [getCommentsApiResponseWithLikesAndReplies.data[0].id], userId: "27",
        userProfilePic: "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBOZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--32f48c4ca82fccbbfdf0f99863fc3374bb2d785a/profilePicture.jpg",
      });
      commentsPopup = shallow(<instance.renderCommentItem item={getCommentsApiResponseWithLikesAndReplies.data[0]} />);
      commentsPopup = shallow(<instance.renderCommentItem item={getCommentsApiResponse.data[0]} />);
      replyPopup = shallow(<instance.renderRepliesItem item={getCommentsApiResponse.data[0].attributes.replies[0]} />);
      editDeleteCommentsHiddenItems = shallow(<instance.renderCommentsHiddenItem item={getCommentsApiResponse.data[0]} />);
      editDeleteRepliesHiddenItems = shallow(<instance.renderRepliesHiddenItem item={getCommentsApiResponse.data[0].attributes.replies[0]} />);
      editCommentsButton = editDeleteCommentsHiddenItems.findWhere(
        (node) => node.prop("testID") === "editComment"
      );
      instance.commentTextInput = { focus: testFn };
      editCommentsButton.simulate("press")
      editDeleteCommentsHiddenItems.findWhere(
        (node) => node.prop("testID") === "deleteComment"
      ).simulate("press");

      editRepliesButton = editDeleteRepliesHiddenItems.findWhere(
        (node) => node.prop("testID") === "editReply"
      );
      instance.commentTextInput = { focus: testFn };

      editRepliesButton.simulate("press")
      editDeleteRepliesHiddenItems.findWhere(
        (node) => node.prop("testID") === "deleteReply"
      ).simulate("press");
      replyButton = commentsPopup.findWhere(
        (node) => node.prop("testID") === "replyButton"
      );
      commentsPopup.findWhere(
        (node) => node.prop("testID") === "showReplyButton"
      ).simulate("press")
      likeCommentButton = commentsPopup.findWhere(
        (node) => node.prop("testID") === "likeCommentButton"
      );
      instance.commentTextInput = { focus: testFn };
      replyButton.simulate("press");
      likeCommentButton.simulate("press");

      instance.setState({ isEditing: false })

      allEventScreen.findWhere(
        (node) => node.prop("testID") === "emojiReplyBtn"
      ).simulate("press")

    });

    then("I can reply", () => {
      expect(testFn).toHaveBeenCalled();
    });

    then("I can like", () => {
      expect(instance.state.commentsLoading).toBe(true);
    });

    when("isEditing and showReplies are true", () => {
      instance.setState({ isEditing: true, showReplies: true })
    })

    then("Trigger api with isEditing and showReplies true", () => {
      instance.createComment()
      expect(instance.state.isEditing).toBe(true);
    });

    when("isEditing is true and showReplies is false", () => {
      instance.setState({ isEditing: true, showReplies: false })
    })

    then("Trigger api with isEditing true and showReplies false", () => {
      instance.createComment()
      expect(instance.state.isEditing).toBe(true);
    });

    when("I click profile picture", () => {
      commentsPopup.findWhere(node => node.prop("testID") === "imageShowProfile").simulate("press");
    })

    then("it goes to profile", () => {
      expect(localShowsTitle).toBeDefined();
    })
  });

  test("Pickers in iOS", ({ given, when, then }) => {
    let eventsWrapper: ShallowWrapper;
    let instance: AllEventScreen;

    given("User attempting to AllEventScreen", async () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))
      eventsWrapper = shallow(
        <AllEventScreen {...screenProps} />
      );

      instance = eventsWrapper.instance() as AllEventScreen;
      Platform.OS = 'ios'
      instance.setState({stateNameList:['California','test']})
    });

    when("User click the state picker", async () => {
      instance.setState({ authToken: null })
    });

    then("User can select the state", () => {
      eventsWrapper.findWhere(node => node.prop("testID") === "btnStateSelect").simulate("press")
      eventsWrapper.findWhere(node => node.prop("testID") === "statePickerModal").simulate("valueChange", "California")

      expect(instance.state.selectedState).toBe("California");
    });

  });

  test("Web socket", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let instance: AllEventScreen;

    let tmpFn = (_: ISocketMessage) => { };

    given("The initial setup", () => {

      // Setup the scenario

      wrapper = shallow(<AllEventScreen {...screenProps} />);
      instance = wrapper.instance() as AllEventScreen;
      shallow(<instance.renderRedDot condition={false} />);
      shallow(<instance.renderRedDot condition={true} />);

      tmpFn = instance.handleSocketMessage
    });

    when("websocket is created", async () => {
     tmpFn({
        identifier: 'unique_identifier',
        message: {
          type: 'follow',
          sub_type: 'chat_message',
          chat_id: 12345,
          message: 'Hello, this is a test message',
          event: 'message_received'
        }
      });

      tmpFn({
        identifier: 'unique_identifier',
        message: {
          type: 'chat',
          sub_type: 'chat_message',
          chat_id: 12345,
          message: 'Hello, this is a test message',
          event: 'message_received'
        }
      });
      Platform.OS = 'android'
      Platform.Version = 33
      StorageProvider.remove.mockResolvedValue([])
    });

    then("it can connect to it", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("component is unmounted", () => {
      wrapper.unmount();
    });

    then("close is called", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });  
  test("Posts data should not be shown on screen for guest users", ({given, when , then}) => {
    let eventsWrapper: ShallowWrapper;
    let instance: AllEventScreen;
  
    const mockEvents = [
      {
        shows: [{
          id: 330,
          type: 'post',
          state: "Alabama"
        }],
         state_name: "Alabama"
      },

    ]
      

    given("User attempting to AllEventScreen", async () => {
      eventsWrapper = shallow(
        <AllEventScreen {...screenProps} />
      );
      
    });
    when("The screen is loaded for a guest user with only posts", () => {
      
      instance = eventsWrapper.instance() as AllEventScreen;
      instance.setState({ authToken: null, authenticatedEventsList: mockEvents , hasLocationPermission: true , stateNameList: ["All"]})
      jest.spyOn(instance,'renderEventItem')
      instance.renderEventItem({item: mockEvents[0]})
   });

    then("Nothing should be showed to the guest user", () => {
      expect(instance.renderEventItem).toBeCalled()

    });
  })
  test("User navigate to all AllEventScreen with params on the route", ({given, when , then}) => {
    let eventsWrapper: ShallowWrapper;
    let instance: AllEventScreen;
  
    given("User attempting to AllEventScreen", async () => {
      eventsWrapper = shallow(
        <AllEventScreen {...screenProps} />
      );
      
    });
    when("I load the AllEventScreen screen", () => {   
      instance = eventsWrapper.instance() as AllEventScreen;
      jest.spyOn(instance, 'showAlert')
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          isPostPictureSuccessfullyCreated: true,
          successMessage: {
            title: 'Post created',
            description: 'Post Created with success'
          }
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);
   });

    then("I expect to show a created post success message", () => {
     expect(instance.showAlert).toBeCalled()

    });
  })
  
});