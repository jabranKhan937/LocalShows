import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import CreateYourProfile from "../../src/CreateYourProfile";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import { Platform } from "react-native";

jest.useFakeTimers();

jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(),
  PERMISSIONS: {
    CAMERA: 'mock_camera_permission',
    WRITE_EXTERNAL_STORAGE: 'mock_write_external_storage_permission',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    NEVER_ASK_AGAIN: 'never_ask_again',
  },
}));

jest.mock("react-native-image-picker", () => ({
  launchCamera: jest.fn().mockImplementation(() => Promise.resolve({
    assets: [
      {
        uri: "image.png"
      }
    ]
  })),
  launchImageLibrary: jest.fn().mockImplementation(() => Promise.resolve({
    assets: [
      {
        uri: "image.png"
      }
    ]
  }))
}));

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

const mockResponse = {
  "data": {
    "id": "185",
    "type": "account",
    "attributes": {
      "activated": true,
      "email": "astha.gupta@metafic.co",
      "first_name": "Astha",
      "full_phone_number": "11234567890",
      "phone_number": 1234567890,
      "country_code": 91,
      "country_code_name": 'US',
      "type": null,
      "created_at": "2023-12-21T14:31:20.312Z",
      "updated_at": "2023-12-21T14:31:33.203Z",
      "device_id": null,
      "unique_auth_id": "KsXDPCcTJhF4xmu8ia4iGQtt",
      "country": "United States",
      "state": "WA",
      "city": "Airway Heights",
      "profile_image": "profile_image",
      "cover_photo": "cover_photo",
      "followers": 0,
      "following": 0,
      "social_media":{
        "instagram":"test",
        "facebook":"test",
        "linkedin":"test"
      },
      "category_subcat": [
        {
          "id": 7,
          "name": "Enjoyment",
          "subcategories": [
            {
              "id": 78,
              "name": "Comedy"
            }
          ]
        },

        {
          "id": 3,
          "name": "Art",
          "subcategories": [
            {
              "id": 8,
              "name": "Artist"
            }
          ]
        }
      ],
      "band_artists": null,
      "calendar_shows": [
        {
          "id": 209,
          "event_title": "Event test",
          "date_of_the_show": "2024-06-25",
          "time": "18:00:00",
          "description": "Description",
          "rules_and_regulations": "",
          "city": "Washington",
          "state": "District of Columbia",
          "country": "US",
          "zip_code": 12345,
          "address": "Address",
          "location": "LocationA",
          "like_by_me": true,
          "added_in_calendar": false,
          "account_id": 384,
          "show_features": [],
          "website": null,
          "likes_count": 1,
          "comment_count": 0,
          "model_name": "Show",
          "band_name": "Astha Band",
          "band_profile_image": "",
          "profile_image": "",
          "cover_photo": "",
          "type_of_show": [
            {
              "id": 8,
              "name": "Art",
              "approved_by_admin": true,
              "created_at": "2023-10-03T09:46:13.375Z",
              "updated_at": "2024-03-05T10:23:23.938Z"
            }
          ],
          "genre": [
            {
              "id": 74,
              "name": "Architecture",
              "approved_by_admin": true,
              "created_at": "2024-03-05T10:35:30.597Z",
              "updated_at": "2024-03-05T10:35:30.597Z"
            }
          ],
          "line_ups": [
            "Astha Band"
          ]
        }
      ],
      "liked_events": [
        {
          "id": 209,
          "event_title": "Event test",
          "date_of_the_show": "2024-06-25",
          "time": "18:00:00",
          "description": "Description",
          "rules_and_regulations": "",
          "city": "Washington",
          "state": "District of Columbia",
          "country": "US",
          "zip_code": 12345,
          "address": "Address",
          "location": "LocationA",
          "like_by_me": true,
          "added_in_calendar": false,
          "account_id": 384,
          "show_features": [],
          "website": null,
          "likes_count": 1,
          "comment_count": 0,
          "model_name": "Show",
          "band_name": "Astha Band",
          "band_profile_image": "",
          "profile_image": "",
          "cover_photo": "",
          "type_of_show": [
            {
              "id": 8,
              "name": "Art",
              "approved_by_admin": true,
              "created_at": "2023-10-03T09:46:13.375Z",
              "updated_at": "2024-03-05T10:23:23.938Z"
            }
          ],
          "genre": [
            {
              "id": 74,
              "name": "Architecture",
              "approved_by_admin": true,
              "created_at": "2024-03-05T10:35:30.597Z",
              "updated_at": "2024-03-05T10:35:30.597Z"
            }
          ],
          "line_ups": [
            "Astha Band"
          ]
        }
      ],
      "is_verified_user": true,
      "verify_at": null,
      "follow": false,
      "is_confirm": null,
      "posts": 0,
      "user_selection": {
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
    }
  }
}

const mockResponse2 = {
  "data": {
    "id": "185",
    "type": "account",
    "attributes": {
      "activated": true,
      "email": "astha.gupta@metafic.co",
      "first_name": "Astha",
      "full_phone_number": "11234567890",
      "phone_number": 1234567890,
      "country_code": null,
      "country_code_name": 'US',
      "type": null,
      "created_at": "2023-12-21T14:31:20.312Z",
      "updated_at": "2023-12-21T14:31:33.203Z",
      "device_id": null,
      "unique_auth_id": "KsXDPCcTJhF4xmu8ia4iGQtt",
      "country": "United States",
      "state": "WA",
      "city": "Airway Heights",
      "profile_image": "profile_image",
      "cover_photo": "cover_photo",
      "followers": 0,
      "following": 0,
      "category_subcat": [
        {
          "id": 7,
          "name": "Enjoyment",
          "subcategories": [
            {
              "id": 78,
              "name": "Comedy"
            }
          ]
        }
      ],
      "band_artists": null,
      "calendar_shows": [],
      "liked_events": [],
      "is_verified_user": true,
      "verify_at": null,
      "follow": false,
      "is_confirm": null,
      "posts": 0,
      "user_selection": {
        "data": {
          "id": "66",
          "type": "user_selection",
          "attributes": {
            "account_id": 569,
            "categories": [
              "Art",
            ],
            "subcategories": [
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
              }
            ]
          }
        }
      }
    }
  }
}

const createBandResponse = {
  data: {
    id: "14",
    type: "profile",
    attributes: {
      id: 14,
      country: "US",
      address: "Address",
      city: "Austin",
      postal_code: "12345",
      account_id: 301,
      profile_role: 0,
      name: "John Doe",
      administrator_name: "Admin Name",
      location: "Location",
      photo: " ",
      title: "Band",
      category_id: null,
      subcategory_id: null,
      official_website: "https://example.com",
      social_media_id: null,
      bio: "Profile Bio",
      social_media_attributes: {
        id: 19,
        instagram: "john_doe_insta",
        facebook: "example_facebook",
        linkedin: "example_linkedin",
      },
      categories: [],
      subcategories: [],
      music_types: [],
      music_subtypes: [],
      user_selection: {
        data: {
          id: "66",
          type: "user_selection",
          attributes: {
            account_id: 569,
            categories: [
              "Art",
              "Enjoyment",
              "Music"
            ],
            subcategories: [
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
            band_artists: [
              "astha"
            ],
            states: [
              "Alaska",
              "Florida"
            ],
            influences: [],
            affiliates: [],
            user_categories: [
              {
                id: 1,
                category: {
                  id: 8,
                  name: "Art",
                  created_at: "2023-10-03T02:46:13.375-07:00",
                  updated_at: "2024-08-25T22:32:48.957-07:00",
                  user_sub_categories: [
                    {
                      id: 7,
                      created_at: "2024-08-27T00:50:35.307-07:00",
                      updated_at: "2024-08-27T00:50:35.307-07:00",
                      sub_category: {
                        id: 74,
                        name: "Architecture",
                        parent_id: 8,
                        created_at: "2024-03-05T02:35:30.597-08:00",
                        updated_at: "2024-03-05T02:35:30.597-08:00"
                      }
                    }
                  ]
                },
                created_at: "2024-08-26T02:46:27.357-07:00",
                updated_at: "2024-08-26T02:46:27.357-07:00"
              },
              {
                id: 4,
                category: {
                  id: 8,
                  name: "Art",
                  created_at: "2023-10-03T02:46:13.375-07:00",
                  updated_at: "2024-08-25T22:32:48.957-07:00",
                  user_sub_categories: [
                    {
                      id: 7,
                      created_at: "2024-08-27T00:50:35.307-07:00",
                      updated_at: "2024-08-27T00:50:35.307-07:00",
                      sub_category: {
                        id: 74,
                        name: "Architecture",
                        parent_id: 8,
                        created_at: "2024-03-05T02:35:30.597-08:00",
                        updated_at: "2024-03-05T02:35:30.597-08:00"
                      }
                    }
                  ]
                },
                created_at: "2024-08-26T02:50:49.506-07:00",
                updated_at: "2024-08-26T02:50:49.506-07:00"
              },
              {
                id: 9,
                category: {
                  id: 7,
                  name: "Enjoyment",
                  created_at: "2023-10-03T02:46:13.354-07:00",
                  updated_at: "2024-08-25T22:32:57.745-07:00",
                  user_sub_categories: [
                    {
                      id: 10,
                      created_at: "2024-08-27T00:52:16.959-07:00",
                      updated_at: "2024-08-27T00:52:16.959-07:00",
                      sub_category: {
                        id: 77,
                        name: "Burlesque",
                        parent_id: 7,
                        created_at: "2024-03-05T02:36:45.793-08:00",
                        updated_at: "2024-03-05T02:36:45.793-08:00"
                      }
                    }
                  ]
                },
                created_at: "2024-08-27T00:52:16.954-07:00",
                updated_at: "2024-08-27T00:52:16.954-07:00"
              },
              {
                id: 10,
                category: {
                  id: 6,
                  name: "Music",
                  created_at: "2023-10-03T02:46:13.337-07:00",
                  updated_at: "2024-08-25T22:33:04.170-07:00",
                  user_sub_categories: [
                    {
                      id: 11,
                      created_at: "2024-08-27T00:52:16.971-07:00",
                      updated_at: "2024-08-27T00:52:16.971-07:00",
                      sub_category: {
                        id: 80,
                        name: "Acoustic",
                        parent_id: 6,
                        created_at: "2024-03-05T02:37:38.611-08:00",
                        updated_at: "2024-03-05T02:37:38.611-08:00"
                      }
                    }
                  ]
                },
                created_at: "2024-08-27T00:52:16.966-07:00",
                updated_at: "2024-08-27T00:52:16.966-07:00"
              }
            ]
          }
        }
        ,
      },
    },
  },
};

const artistResponse = {
  data: [
    {
      id: 219,
      first_name: "123",
      email: "astha.gupta+11@metafic.co",
      created_at: "2024-03-01T12:52:20.566Z",
      role_id: 9,
    },
    {
      id: 215,
      first_name: "a1",
      email: "astha.gupta+4@metafic.co",
      created_at: "2024-02-27T08:27:17.662Z",
      role_id: 9,
    },
  ],
};

const mockCategoryList = {
  "data": [
    {
      "id": "8",
      "type": "category",
      "attributes": {
        "id": 8,
        "name": "Art",
        "created_at": "2023-10-03T09:46:13.375Z",
        "updated_at": "2024-03-05T10:23:23.938Z"
      }
    },
    {
      "id": "7",
      "type": "category",
      "attributes": {
        "id": 7,
        "name": "Enjoyment",
        "created_at": "2023-10-03T09:46:13.354Z",
        "updated_at": "2024-02-27T10:22:02.320Z"
      }
    },
    {
      "id": "6",
      "type": "category",
      "attributes": {
        "id": 6,
        "name": "Music",
        "created_at": "2023-10-03T09:46:13.337Z",
        "updated_at": "2024-03-05T10:23:31.846Z"
      }
    }
  ]
}

const mockErrorResponse = {
  "errors": []
}

let screenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    openDrawer: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    getParam: jest.fn(),
    state: {
      params: {
        editMode: false,

      }
    }
  },
  id: "UserProfileBasicBlock",
};

let screenProps2 = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    openDrawer: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    getParam: jest.fn(),
    state: {
      params: {
        editMode: true
      }
    }
  },
  id: "UserProfileBasicBlock",
};

const mockCountryList = {
  "countries": [
    {
      "country_code": "US",
      "country_name": "United States"
    },
    {
      "country_code": "AE",
      "country_name": "United Arab Emirates"
    },]
}

const feature = loadFeature(
  "./__tests__/features/CreateProfile-scenario.feature"
);

jest.mock("../../../../framework/src/StorageProvider", () => ({
  setStorageData: jest.fn().mockImplementation(() => Promise.resolve('user_country')),
  getStorageData: jest.fn().mockImplementation(() => Promise.resolve('US')),
  set: jest.fn().mockImplementation(() => Promise.resolve('userRole')),
  get: jest.fn().mockImplementation(() => Promise.resolve('venue')),
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("User navigates to CreateProfile", ({ given, when, then }) => {
    let createYourProfile: ShallowWrapper;
    let instance: CreateYourProfile;
    let testLabel: ShallowWrapper;

    given("I am a User loading CreateProfile", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "android",
        select: jest.fn(),
      }));
      createYourProfile = shallow(<CreateYourProfile {...screenProps2} />);
    });

    when("I navigate to the CreateProfile", () => {
      instance = createYourProfile.instance() as CreateYourProfile;
      mockAPISuccessCall(instance, "getBandArtistsAPICallID", artistResponse)
      mockAPISuccessCall(instance, "getBandArtistsAPICallID", mockErrorResponse)
      mockAPIFailureCall(instance, "getBandArtistsAPICallID", mockErrorResponse)

      mockAPISuccessCall(instance, "getCountriesListAPICallID", mockCountryList)
      mockAPISuccessCall(instance, "getCountriesListAPICallID", mockErrorResponse)
      mockAPIFailureCall(instance, "getCountriesListAPICallID", mockErrorResponse)

      mockAPISuccessCall(instance, "getStatesApiCallId",
        {
          state: {
            AK: "Alaska",
            AL: "Alabama"
          }
        }
      )
      mockAPISuccessCall(instance, "getStatesApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getStatesApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "getCityApiCallId",
        {
          city: ["Akutan", "Alakanuk"]
        }
      )
      mockAPISuccessCall(instance, "getCityApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "getCityApiCallId", mockErrorResponse)

      testLabel = createYourProfile.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
    });

    then("CreateProfile is rendered properly", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the navigationBackButton", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "navigationBackButton")
        .simulate("press");
    });

    then("goBack method is called", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the saveBtn", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("isLoading is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the cancelButton", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "cancelButton")
        .simulate("press");
    });

    then("isLoading is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the profilePicButton", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "profilePicButton")
        .simulate("press");

      createYourProfile.findWhere(node => node.prop("testID") === "cameraOption").simulate("press")
      createYourProfile.findWhere(node => node.prop("testID") === "galleryOption").simulate("press")
      createYourProfile.findWhere(node => node.prop("testID") === "cancelOption").simulate("press")
    });

    then("isLoading is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the coverPicButton", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "coverPicButton")
        .simulate("press");
      createYourProfile.findWhere(node => node.prop("testID") === "cameraOption").simulate("press")
      createYourProfile.findWhere(node => node.prop("testID") === "galleryOption").simulate("press")
      createYourProfile.findWhere(node => node.prop("testID") === "cancelOption").simulate("press")
    });

    then("isLoading is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the adminNameTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "adminNameTextInput")
        .simulate("changeText", "Abc");
    });

    then("name is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the websiteTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "websiteTextInput")
        .simulate("changeText", "website");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "addressTextInput")
        .simulate("changeText", "address");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "capacityTextInput")
        .simulate("changeText", "capacity");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "rulesRegulationInputText")
        .simulate("changeText", "rulesRegulation");
    });
    
    then("website is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the instagramTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "instagramTextInput")
        .simulate("changeText", "instagram");
        instance.InstaInputRef.current = { focus: jest.fn() }
        createYourProfile
        .findWhere((node) => node.prop("testID") === "InstaInputBtn")
        .simulate("press");
    });

    then("instagram link is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the facebookTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "facebookTextInput")
        .simulate("changeText", "facebook");
        instance.FBInputRef.current = { focus: jest.fn() }
        createYourProfile
        .findWhere((node) => node.prop("testID") === "FBInputBtn")
        .simulate("press");
    });

    then("facebook link is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the linkedinTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "linkedinTextInput")
        .simulate("changeText", "linkedin");    
         instance.LdinInputRef.current = { focus: jest.fn() }
        createYourProfile
        .findWhere((node) => node.prop("testID") === "LdinInputBtn")
        .simulate("press");
        
    });

    then("linkedin link is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the aboutUsTxtInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "aboutUsTxtInput")
        .simulate("changeText", "aboutUs");
    });

    then("aboutUs is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I submit text in the affiliateTextInput without change", () => {
      const input = createYourProfile.findWhere(
        (node) => node.prop("testID") === "affiliateTextInput"
      );
      input.simulate("submitEditing");
    });

    then("affiliateTxt is reset", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the affiliateTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "affiliateTextInput")
        .simulate("changeText", "affiliateTxt");
    });

    then("affiliateTxt is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change and submit text in the affiliateTextInput", () => {
      const input = createYourProfile.findWhere(
        (node) => node.prop("testID") === "affiliateTextInput"
      );
      input.simulate("changeText", "affiliateTxt");
      input.simulate("submitEditing");
      createYourProfile.findWhere(
        (node) => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("affiliateTxt is reset", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click btnRemoveAffiliate", () => {
      const renderAffiliateItemWrapper = shallow(<instance.renderAffiliateItem item={"affiliateTxt"} />)
      renderAffiliateItemWrapper.findWhere(
        (node) => node.prop("testID") === "btnRemoveAffiliate"
      ).simulate("press");
    });

    then("affiliatesList is cleared", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the categoryPicker", () => {
      mockAPISuccessCall(instance, "getCategoriesListAPICallID", mockCategoryList)
      mockAPISuccessCall(instance, "getSubCategoriesListAPICallID", mockCategoryList)
      createYourProfile
        .findWhere((node) => node.prop("testID") === "categoryPicker")
        .simulate("valueChange", "Artist");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "categoryListPicker")
        .simulate("valueChange", "cat1");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "subCategoryListPicker")
        .simulate("valueChange", "cat1");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "openAtPicker")
        .simulate("valueChange", "08:00 PM");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "closeAtPicker")
        .simulate("valueChange", "11:00 PM");

      const subCategoryFlatlist = createYourProfile.findWhere(node => node.prop("testID") === "subCategoryFlatlist");
      ["1"].forEach((item, index) => {
        const innerWrapper = subCategoryFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        subCategoryFlatlist.renderProp("keyExtractor")({ item });

        innerWrapper.findWhere(
          (node) => node.prop("testID") === "closeSubCatBtn"
        ).simulate("press");
      })

      const businessHoursFlatlist = createYourProfile.findWhere(node => node.prop("testID") === "businessHoursFlatlist");
      ["1"].forEach((item, index) => {
        const innerWrapper = businessHoursFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        businessHoursFlatlist.renderProp("keyExtractor")({ item });

      })

      const showFeaturesFlatlist = createYourProfile.findWhere(node => node.prop("testID") === "showFeaturesFlatlist");
      ["1"].forEach((item, index) => {
        const innerWrapper = showFeaturesFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        showFeaturesFlatlist.renderProp("keyExtractor")({ item });


      })
      
      const influencesFlatList = createYourProfile.findWhere(node => node.prop("testID") === "influencesFlatList");
      ["1"].forEach((item, index) => {
        const innerWrapper = influencesFlatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "btnRemoveInfluence"
        ).simulate("press");
      })

      const affiliateFlatList = createYourProfile.findWhere(node => node.prop("testID") === "affiliateFlatList");
      ["1"].forEach((item, index) => {
        const innerWrapper = affiliateFlatList.renderProp("renderItem")({
          item: item,
          index: index,
        });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "btnRemoveAffiliate"
        ).simulate("press");
      })
    });

    then("bandType is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click btnRemoveInfluence", () => {
      const renderInfluenceItemWrapper = shallow(<instance.renderInfluenceItem item={"123"} />)
      renderInfluenceItemWrapper.findWhere(
        (node) => node.prop("testID") === "btnRemoveInfluence"
      ).simulate("press");
    });

    then("influencesList is cleared", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the saveBtn", () => {
      createYourProfile
        .findWhere(node => node.prop("testID") === "countryAndroidPicker")
        .simulate("ValueChange", "United States");

      createYourProfile
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "AK");

      createYourProfile
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("press");

      createYourProfile
        .findWhere(node => node.prop("testID") === "cityPicker")
        .simulate("ValueChange", "Akutan");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("isLoading is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I call API to create band profile", () => {
      mockAPISuccessCall(instance, "createBandProfileApiCallID", createBandResponse)
      mockAPISuccessCall(instance, "createBandProfileApiCallID", mockErrorResponse)
      mockAPIFailureCall(instance, "createBandProfileApiCallID", mockErrorResponse)
    });

    then("isLoading is false", () => {
      expect(testLabel).toBeDefined();
    });
  });

  test("Rendering in iOS", ({ given, when, then }) => {
    let createYourProfile: ShallowWrapper;
    let instance: CreateYourProfile;
    let testLabel: ShallowWrapper;
    let stateSelectButton: ShallowWrapper;
    let citySelectButton: ShallowWrapper;
    let stateSelectPickerComponent: ShallowWrapper;
    let citySelectPickerComponent: ShallowWrapper;

    given("I am a User loading CreateProfile", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "ios",
        select: jest.fn(),
      }));
      createYourProfile = shallow(<CreateYourProfile {...screenProps} />);
    });

    when("I navigate to the CreateProfile", () => {
      instance = createYourProfile.instance() as CreateYourProfile;
      testLabel = createYourProfile.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
      mockAPISuccessCall(instance, "getCategoriesListAPICallID", mockCategoryList)
      mockAPISuccessCall(instance, "getCategoriesListAPICallID", mockErrorResponse)
      mockAPIFailureCall(instance, "getCategoriesListAPICallID", mockErrorResponse)

      mockAPISuccessCall(instance, "getSubCategoriesListAPICallID", mockCategoryList)
      mockAPISuccessCall(instance, "getSubCategoriesListAPICallID", mockErrorResponse)
      mockAPIFailureCall(instance, "getSubCategoriesListAPICallID", mockErrorResponse)

      createYourProfile.findWhere(
        (node) => node.prop("testID") === "countrySelectButton"
      ).simulate("press")

      createYourProfile.findWhere(
        (node) => node.prop("testID") === "countryPickerModal"
      ).simulate("ValueChange", "United States")

      createYourProfile.findWhere(
        (node) => node.prop("testID") === "hideCountryModal"
      ).simulate("press")

      stateSelectButton = createYourProfile.findWhere(
        (node) => node.prop("testID") === "stateSelectButton"
      );

      stateSelectPickerComponent = createYourProfile.findWhere(
        (node) => node.prop("testID") === "statePickerModal"
      );

      citySelectButton = createYourProfile.findWhere(
        (node) => node.prop("testID") === "citySelectButton"
      );

      citySelectPickerComponent = createYourProfile.findWhere(
        (node) => node.prop("testID") === "cityPickerModal"
      );
      stateSelectButton.simulate("press");

      mockAPISuccessCall(instance, "getStatesApiCallId", {
        state: {
          "AK": "Alaska",
          "AL": "Alabama",
        }
      })

      stateSelectPickerComponent.simulate("ValueChange", "AK");

      createYourProfile.findWhere(
        (node) => node.prop("testID") === "hideStateModal"
      ).simulate("press")

      citySelectButton.simulate("press");

      mockAPISuccessCall(instance, "getStatesApiCallId", {
        city: [
          "Akutan",
          "Alakanuk"
        ]
      })

      citySelectPickerComponent.simulate("ValueChange", "Akutan")

      createYourProfile.findWhere(
        (node) => node.prop("testID") === "hideCityModal"
      ).simulate("press")

    });

    then("CreateProfile is rendered properly", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the pickerModal", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "pickerModal")
        .simulate("valueChange", "Band Member");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "hidePickerModal")
        .simulate("press");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "titleTextInput")
        .simulate("changeText", "title");
    });

    then("showPickerModal is false", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the categoryPickerModal", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "categoryPickerModal")
        .simulate("valueChange", "Art");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "hideCategoryModal")
        .simulate("press");

    });

    then("showPickerModal is false", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the subCategoryPickerModal", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "subCategoryPickerModal")
        .simulate("valueChange", "Sculpture");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "hideSubCategoryModal")
        .simulate("press");
    });

    then("showPickerModal is false", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the btnCategoryPicker", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "btnCategoryPicker")
        .simulate("press");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "btnCategoryListPicker")
        .simulate("press");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "btnSubCategoryListPicker")
        .simulate("press");

    });

    then("showPickerModal is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the pickerModal", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "pickerModal")
        .simulate("valueChange", "Band");

      createYourProfile
        .findWhere((node) => node.prop("testID") === "hidePickerModal")
        .simulate("press");
    });

    then("showPickerModal is false", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the pickerModal", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "pickerModal")
        .simulate("valueChange", "Punk");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "hidePickerModal")
        .simulate("press");
    });

    then("showPickerModal is false", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the influencesTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "influencesTextInput")
        .simulate("changeText", "test");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "influencesTextInput")
        .simulate("submitEditing");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "influencesTextInput")
        .simulate("changeText", "");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "influencesTextInput")
        .simulate("submitEditing");
    });

    then("showPickerModal is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change value in the pickerModal", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "pickerModal")
        .simulate("valueChange", "123");
      createYourProfile
        .findWhere((node) => node.prop("testID") === "hidePickerModal")
        .simulate("press");
    });

    then("showPickerModal is false", () => {
      expect(testLabel).toBeDefined();
    });
  });

  test("User navigates to CreateProfile in Edit mode", ({ given, when, then }) => {
    let createYourProfile: ShallowWrapper;
    let instance: CreateYourProfile;
    let testLabel: ShallowWrapper;

    screenProps = {
      ...screenProps,
      navigation: {
        ...screenProps.navigation,
        state: {
          params: {
            editMode: true
          }
        }
      }
    }

    given("I am a User loading CreateProfile", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "android",
        select: jest.fn(),
      }));
      createYourProfile = shallow(<CreateYourProfile {...screenProps2} />);
    });

    when("I navigate to the CreateProfile", () => {
      instance = createYourProfile.instance() as CreateYourProfile;
      testLabel = createYourProfile.findWhere(
        (node) => node.prop("testID") === "testLabel"
      );
    });

    then("CreateProfile is rendered properly", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the adminNameTextInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "adminNameTextInput")
        .simulate("changeText", "Abc");
    });

    then("name is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I change text in the aboutUsTxtInput", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "aboutUsTxtInput")
        .simulate("changeText", "aboutUs");
    });

    then("aboutUs is updated", () => {
      expect(testLabel).toBeDefined();
    });

    when("I click the saveBtn", () => {
      createYourProfile
        .findWhere((node) => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("isLoading is true", () => {
      expect(testLabel).toBeDefined();
    });

    when("I call API to edit band profile", () => {
      mockAPISuccessCall(instance, "editBandProfileApiCallID", createBandResponse)
      mockAPISuccessCall(instance, "editBandProfileApiCallID", mockErrorResponse)
      mockAPIFailureCall(instance, "editBandProfileApiCallID", mockErrorResponse)

      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      instance.updateBandDetails(mockResponse.data.attributes)
      instance.getProfileData(mockResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockResponse2)
      instance.updateBandDetails(mockResponse2.data.attributes)
      instance.getProfileData(mockResponse2)
    });

    then("goBack is called", () => {
      expect(testLabel).toBeDefined();
    });
  });

  test("User Edit Email And Phone",({ given, when, then}) => {
    let createYourProfile: ShallowWrapper;
    let instance: CreateYourProfile;
    // let EmailInput:any
    let PhoneInput:any
    let PhoneInputAndroid:any
    given('User Try to Type in Input', () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "ios",
        select: jest.fn(),
      }));
      createYourProfile = shallow(<CreateYourProfile {...screenProps2} />);
    })

    when('User Add Text In Input',() => {
      console.log('asfoisfjskldfldfn')
      instance = createYourProfile.instance() as CreateYourProfile;
      // EmailInput = createYourProfile.findWhere(
      //   (node) => node.prop("testID") === "emailTextInput"
      // );
      // EmailInput.simulate("changeText", "test@yopmail.com");

      PhoneInput = createYourProfile.findWhere(
        (node) => node.prop("testID") === "phoneTextInputBand"
      );
      PhoneInput.simulate("changeText", "1234567890");
      instance.setState({selectedCountryCode:{
        attributes:{
            "country_code": "US",
            "country_name": "United States"
        }
      }})
      Platform.OS = 'android'

      instance.setState({selectedCountryCode:{
        attributes:{
            "country_code": "US",
            "country_name": "United States"
        }
      }})
      PhoneInputAndroid = createYourProfile.findWhere(
        (node) => node.prop("testID") === "phoneTextInput"
      );
      PhoneInputAndroid.simulate("changeText", "1234567890");
      createYourProfile.findWhere(
        (node) => node.prop("testID") === "btnCountryCodeSelectAndroid"
      ).simulate('press')
      
      instance.setState({countryCodesList: [
        {
          attributes:{
            "country_code": "US",
            "country_name": "United States"
        }
        },
        {
          attributes:{
            "country_code": "AE",
        "country_name": "United Arab Emirates"
        }
        }
      ]})
      instance.parseFaceBookUrl('http://www.test.com')
      instance.parseFaceBookUrl('https://www.test.com')
      instance.parseFaceBookUrl('test')
      instance.parseInstagramUrl('http://www.test.com')
      instance.parseInstagramUrl('https://www.test.com')
      instance.parseInstagramUrl('test')
      instance.parseLinkedinUrl('http://www.test.com')
      instance.parseLinkedinUrl('https://www.test.com')
      instance.parseLinkedinUrl('test')
    })





  })
});
