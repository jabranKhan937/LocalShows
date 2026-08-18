import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import UserProfileBasicBlock from "../../src/UserProfileBasicBlock";

import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import { ICommentItem } from "../../src/UserProfileBasicController";
import { TextInput } from "react-native";
import StorageProvider from '../../../../framework/src/StorageProvider'
jest.mock("react-native-swipe-list-view", () => ({
  SwipeListView: jest.fn(),
}));

jest.useFakeTimers();

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

const mockCommentItem: ICommentItem = {
  key: "1",
  attributes: {
    account_id: "",
    account: {
      id: 123,
      first_name: "John",
      account_type:"fan"
    },
    profile_image_url: "http://example.com/profile.jpg",
    comment: "This is a test comment",
    created_at: new Date().toISOString(),
    replies: [
      {
        id: 1,
        key: "1-1",
        account_id: 124,
        profile_image: "http://example.com/reply_profile1.jpg",
        account_name: "Jane",
        reply: "This is a reply 1",
        created_at: new Date().toISOString(),
        account_type:'fan'
      },
      {
        id: 2,
        key: "1-2",
        account_id: 125,
        profile_image: null,
        account_name: "Doe",
        reply: "This is a reply 2",
        created_at: new Date().toISOString(),
        account_type:'Band'
      },
    ],
    likes_count: 5,
    like_by_me: true,
  },
  id: 1,
};

const mockResponse = {
  data: {
    id: "185",
    type: "account",
    attributes: {
      activated: true,
      country_code: null,
      email: "astha.gupta@metafic.co",
      first_name: "Astha",
      full_phone_number: "11234567890",
      phone_number: null,
      type: null,
      created_at: "2023-12-21T14:31:20.312Z",
      updated_at: "2023-12-21T14:31:33.203Z",
      device_id: null,
      unique_auth_id: "KsXDPCcTJhF4xmu8ia4iGQtt",
      country: "United States",
      state: "WA",
      city: "Airway Heights",
      profile_image: "",
      followers: 0,
      following: 0,
      follow: false,
      category_subcat: [],
      band_artists: [],
      calendar_shows: [
        {
          id: 209,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        },
        {
          id: 9,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        }
      ],
      liked_events: [
        {
          id: 209,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        },
      ],
      is_verified_user: true,
      verify_at: null,
      is_confirm: null,
      posts: 0,
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
      }
    },
  },
};

const mockResponseWithMultipleLikedEvents = {
  data: {
    id: "",
    type: "account",
    attributes: {
      activated: true,
      country_code: null,
      email: "astha.gupta@metafic.co",
      first_name: "Astha",
      full_phone_number: "11234567890",
      phone_number: null,
      type: null,
      created_at: "2023-12-21T14:31:20.312Z",
      updated_at: "2023-12-21T14:31:33.203Z",
      device_id: null,
      unique_auth_id: "KsXDPCcTJhF4xmu8ia4iGQtt",
      country: "United States",
      state: "WA",
      city: "Airway Heights",
      profile_image: "",
      followers: 0,
      following: 0,
      follow: true,
      category_subcat: [],
      band_artists: [],
      calendar_shows: [
        {
          id: 209,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        },
        {
          id: 99,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        }
      ],
      liked_events: [
        {
          id: 209,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        },
        {
          id: 210,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        },
      ],
      is_verified_user: true,
      verify_at: null,
      is_confirm: null,
      posts: 0,
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
      }
    },
  },
};

const mockResponseWithNoLikedEvents = {
  data: {
    id: "",
    type: "account",
    attributes: {
      activated: true,
      country_code: null,
      email: "astha.gupta@metafic.co",
      first_name: "Astha",
      full_phone_number: "11234567890",
      phone_number: null,
      type: null,
      created_at: "2023-12-21T14:31:20.312Z",
      updated_at: "2023-12-21T14:31:33.203Z",
      device_id: null,
      unique_auth_id: "KsXDPCcTJhF4xmu8ia4iGQtt",
      country: "United States",
      state: "WA",
      city: "Airway Heights",
      profile_image: "",
      followers: 0,
      following: 0,
      follow: false,
      category_subcat: [],
      band_artists: [],
      calendar_shows: [
        {
          id: 209,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        },
        {
          id: 9,
          event_title: "Event test",
          date_of_the_show: "2024-06-25",
          time: "18:00:00",
          description: "Description",
          rules_and_regulations: "",
          city: "Washington",
          state: "District of Columbia",
          country: "US",
          zip_code: 12345,
          address: "Address",
          location: "LocationA",
          like_by_me: true,
          added_in_calendar: false,
          account_id: 384,
          show_features: [],
          website: null,
          likes_count: 1,
          comment_count: 0,
          model_name: "Show",
          band_name: "Astha Band",
          band_profile_image: "",
          profile_image: "",
          type_of_show: [
            {
              id: 8,
              name: "Art",
              approved_by_admin: true,
              created_at: "2023-10-03T09:46:13.375Z",
              updated_at: "2024-03-05T10:23:23.938Z",
            },
          ],
          genre: [
            {
              id: 74,
              name: "Architecture",
              approved_by_admin: true,
              created_at: "2024-03-05T10:35:30.597Z",
              updated_at: "2024-03-05T10:35:30.597Z",
            },
          ],
          line_ups: ["Astha Band"],
        }
      ],
      liked_events: [],
      is_verified_user: true,
      verify_at: null,
      is_confirm: null,
      posts: 0,
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
      }
    },
  },
};

const sampleEvent = {
  id: 209,
  event_title: "Event test",
  date_of_the_show: "2024-06-25",
  type:"show",
  time: "18:00:00",
  description: "Description",
  rules_and_regulations: "",
  city: "Washington",
  state: "District of Columbia",
  country: "US",
  zip_code: 12345,
  address: "Address",
  location: "LocationA",
  like_by_me: true,
  added_in_calendar: false,
  account_id: 384,
  show_features: [],
  website: "",
  likes_count: 1,
  comment_count: 0,
  model_name: "Show",
  band_name: "Astha Band",
  band_profile_image: "band_profile_image",
  profile_image: "",
  type_of_show: [
    {
      id: 8,
      name: "Art",
      approved_by_admin: true,
      created_at: "2023-10-03T09:46:13.375Z",
      updated_at: "2024-03-05T10:23:23.938Z",
    },
  ],
  genre: [
    {
      id: 74,
      name: "Architecture",
      approved_by_admin: true,
      created_at: "2024-03-05T10:35:30.597Z",
      updated_at: "2024-03-05T10:35:30.597Z",
    },
  ],
  line_ups: ["Astha Band"],
};

const sampleEvent2 = {
  id: 209,
  type:"show",
  event_title: "Event test",
  date_of_the_show: "2024-06-25",
  time: "18:00:00",
  description: "Description",
  rules_and_regulations: "",
  city: "Washington",
  state: "District of Columbia",
  country: "US",
  zip_code: 12345,
  address: "Address",
  location: "LocationA",
  like_by_me: true,
  added_in_calendar: false,
  account_id: 384,
  show_features: [],
  website: "",
  likes_count: 1,
  comment_count: 0,
  model_name: "Show",
  band_name: "Astha Band",
  band_profile_image: "",
  profile_image: "",
  type_of_show: [
    {
      id: 8,
      name: "Art",
      approved_by_admin: true,
      created_at: "2023-10-03T09:46:13.375Z",
      updated_at: "2024-03-05T10:23:23.938Z",
    },
  ],
  genre: [
    {
      id: 74,
      name: "Architecture",
      approved_by_admin: true,
      created_at: "2024-03-05T10:35:30.597Z",
      updated_at: "2024-03-05T10:35:30.597Z",
    },
  ],
  line_ups: ["Astha Band"],
};

const mockuserprofile = {
  "data": {
      "id": "10",
      "type": "account",
      "attributes": {
          "activated": true,
          "country_code": null,
          "email": "sambhav.b1@poolstack.in",
          "first_name": " mayank",
          "full_phone_number": "119876543210",
          "phone_number": "9876543210",
          "type": null,
          "created_at": "2024-01-18T09:59:00.031Z",
          "updated_at": "2024-03-19T07:22:32.760Z",
          "device_id": null,
          "unique_auth_id": "yrbcvX141KtmqkgTgHBdEAtt",
          "country": "india",
          "state": "MH",
          "city": "indore",
          "private": true,
          "profile_image": "http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBLUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--bc3fd2ca996e20fd374354586a9748b4f7b117ea/Screenshot_2023-11-22_05-15-23.png",
          "followers": 1,
          "following": 2,
          "category_subcat": [
              {
                  "id": 1,
                  "name": "Music",
                  "subcategories": []
              },
              {
                  "id": 3,
                  "name": "Art",
                  "subcategories": []
              }
          ],
          "band_artists": [
              "Artist3o",
              "Artist25p"
          ],
          "calendar_shows": [],
          "liked_events": [
              {
                  "id": 5,
                  "event_title": "dance",
                  "date_of_the_show": "2023-11-13",
                  "time": "04:00:00",
                  "description": "the show is based on the music concert",
                  "rules_and_regulations": null,
                  "city": "abc",
                  "state": "California",
                  "country": null,
                  "zip_code": null,
                  "address": null,
                  "location": null,
                  "like_by_me": true,
                  "added_in_calendar": false,
                  "account_id": null,
                  "show_features": [],
                  "website": null,
                  "likes_count": 2,
                  "model_name": "Show",
                  "profile_image": "",
                  "type_of_show": [],
                  "line_up": []
              },
              {
                  "id": 7,
                  "event_title": "dance",
                  "date_of_the_show": "2023-11-13",
                  "time": "04:00:00",
                  "description": "the show is based on the music concert",
                  "rules_and_regulations": null,
                  "city": "abc",
                  "state": "California",
                  "country": null,
                  "zip_code": null,
                  "address": null,
                  "location": null,
                  "like_by_me": true,
                  "added_in_calendar": false,
                  "account_id": null,
                  "show_features": [],
                  "website": null,
                  "likes_count": 1,
                  "model_name": "Show",
                  "profile_image": "",
                  "type_of_show": [],
                  "line_up": []
              },
              {
                  "id": 2,
                  "event_title": "",
                  "date_of_the_show": null,
                  "time": null,
                  "description": "",
                  "rules_and_regulations": "",
                  "city": "Ahemdabad",
                  "state": "MP",
                  "country": null,
                  "zip_code": null,
                  "address": null,
                  "location": null,
                  "like_by_me": true,
                  "added_in_calendar": false,
                  "account_id": null,
                  "show_features": [],
                  "website": null,
                  "likes_count": 1,
                  "model_name": "Show",
                  "profile_image": "",
                  "type_of_show": [],
                  "line_up": []
              },
              {
                  "id": 3,
                  "event_title": "dance",
                  "date_of_the_show": "2023-11-13",
                  "time": "04:00:00",
                  "description": "the show is based on the music concert",
                  "rules_and_regulations": "",
                  "city": "Indore",
                  "state": "Maharashtra",
                  "country": "IN",
                  "zip_code": 52001,
                  "address": "near railway station",
                  "location": "alibag",
                  "like_by_me": true,
                  "added_in_calendar": false,
                  "account_id": null,
                  "show_features": [],
                  "website": null,
                  "likes_count": 2,
                  "model_name": "Show",
                  "profile_image": "",
                  "type_of_show": [],
                  "line_up": []
              },
              {
                  "id": 1,
                  "event_title": "",
                  "date_of_the_show": null,
                  "time": null,
                  "description": "",
                  "rules_and_regulations": "",
                  "city": "Indore",
                  "state": "Madhya Pradesh",
                  "country": null,
                  "zip_code": null,
                  "address": null,
                  "location": null,
                  "like_by_me": true,
                  "added_in_calendar": false,
                  "account_id": null,
                  "show_features": [
                      {
                          "id": 82,
                          "feature_name": "activate card",
                          "activate_feature": true,
                          "show_id": 109,
                          "created_at": "2024-01-29T10:58:46.082Z",
                          "updated_at": "2024-03-19T11:51:48.825Z"
                      }
                  ],
                  "website": null,
                  "likes_count": 3,
                  "model_name": "Show",
                  "profile_image": "",
                  "type_of_show": [],
                  "line_up": []
              }
          ],
          "verify_at": null,
          "follow": null
      }
  }
}

const screenProps = {
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

const feature = loadFeature(
  "./__tests__/features/UserProfileBasicBlock-scenario.feature"
);

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve("27")),
  set: jest.fn().mockImplementation(() => Promise.resolve([])),
  remove: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  });

  test("User navigates to UserProfileBasicBlock", ({ given, when, then }) => {
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    let testFn = jest.fn();

    given("I am a User loading UserProfileBasicBlock", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
    });

    when("I navigate to the UserProfileBasicBlock", async () => {
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
      await instance.componentDidMount()
      
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
          data: mockResponse,
        }
      );
      instance.setState({isOtherUser:true})
      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
      instance.getUserDetailsAPI(instance.state.userID);
      instance.setState({showTncPopup:true})
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "TnCPopupCloseBtn")
        .simulate("press");
        userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "TnCPopupCloseBtn2")
        .simulate("press");
        userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "checkoutTnCbtn")
        .simulate("press");
    
        instance.renderCategories({item:{

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
        
        }})
        instance.renderCategories({item:{
          id: 8,
          created_at: "2023-10-03T02:46:13.375-07:00",
          updated_at: "2024-08-25T22:32:48.957-07:00",
          attributes:{
            name: "Art",
          }
        }})
        instance.setState({currentCountryCode:null})
        instance.validateMobileAndThenUpdateUserProfile()
        instance.validateCountryCodeAndPhoneNumber('+91','1234567890')
        instance.validateCountryCodeAndPhoneNumber('+91','')
        instance.validateCountryCodeAndPhoneNumber('','1234567890')
        instance.validateAndUpdateProfile()
        instance.validateCurrentPwd('test')
        instance.validateCurrentPwd('')
        instance.validatePassword('test')
        instance.validatePassword('')
        instance.validateRePassword('test')
        instance.validateRePassword('')
        instance.validateMobileOnServer('+91','1234567890')
        instance.enableDisableEditPassword(true)
        instance.enableDisableEditPassword(false)
        instance.registrationAndLoginType = 'SocialAccount'
        instance.enableDisableEditPassword(true)
        instance.enableDisableEditPassword(false)
        instance.goToPrivacyPolicy()
        instance.goToTermsAndCondition()
        instance.isStringNullOrBlank('')
        instance.isStringNullOrBlank('test')
        instance.requestSessionData()
        instance.getUserProfile()
        instance.getValidations()
        await instance.updateBandDetails(null)
        await instance.updateBandDetails({
          category_subcat: [
            {
              id: "1",
              name: "cat_1",
              subcategories: [
                {
                  id: "1",
                  name: "sub_cat_1",
                },
              ],
            },
          ],
        })
        instance.setStateBand()
        instance.setCityBand()
        await instance.getUserID()
        await instance.getStoredData()
        instance.txtInputFirstNameProps.onChangeText('test')
        instance.txtInputLastNameProps.onChangeText('test')
        instance.txtInputPhoneNumberlWebProps.onChangeText('1234567890')
        instance.txtInputEmailWebProps.onChangeText('test')
        instance.txtInputCurrentPasswordProps.onChangeText('test')
        instance.txtInputNewPasswordProps.onChangeText('test')
        instance.txtInputReTypePasswordProps.onChangeText('test')
        instance.btnEnableEditPasswordProps.onPress()
        instance.btnDisableEditPasswordProps.onPress()
        instance.getCountryCode()
        instance.handleCreateBandProfileBody()
        await instance.createBandProfile()
        instance.showCountryCodeDropdown()
        instance.handlePhoneDropdown()
        instance.handleOnBlur()
        instance.handleFollow('123')
        StorageProvider.get.mockResolvedValue('true')
        instance.toggleLikeApi('1232')
        StorageProvider.get.mockResolvedValue('false')
        instance.toggleLikeApi('1232')
        instance.goToEditProfile()
        StorageProvider.get.mockResolvedValue('true')
        instance.handleShareEvent('123',"test")
        StorageProvider.get.mockResolvedValue('false')
        instance.handleShareEvent('123',"test")
        StorageProvider.get.mockResolvedValue('true')
        instance.handleShowComments('123')
        StorageProvider.get.mockResolvedValue('false')
        instance.handleShowComments('123')
        instance.setState({editingComment:false,showReplies:false})
        await instance.postComment()
        instance.setState({editingComment:true,showReplies:true})
        await instance.postComment()
        instance.handleReplyBack()
        await instance.postReplyToComment()
        instance.setState({editingComment:true,showReplies:true})
        await instance.postReplyToComment()
        instance.handleToggleExpandSubcat()
        instance.setState({expandedLikedEvents:true})
        instance.getLikedEventsLabel()
        instance.setState({expandedLikedEvents:false})
        instance.getLikedEventsLabel()
        instance.getCalendarEventsLabel()
        instance.toggleCalendarEventsExpand()
        instance.toggleLikedEventsExpand()
        instance.handleCountrycodeValueAndroid('+91')
        instance.isEmailValid('test@gmailcom')
        instance.setState({userID:'123'})
        instance.showProfile('123','fan')
        instance.showProfile('123','Band')
        instance.showProfile('123','Artist')
        instance.showProfile('123','fan')
        await instance.navigateToStartChat()
        instance.isEmailValid('test')
        instance.isEmailValid('test@')
        instance.isEmailValid('test@gmail')
        instance.isEmailValid('test@gmail.com')

        const msgValidationAPI2 = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        msgValidationAPI2.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgValidationAPI2.messageId
        );
  
        msgValidationAPI2.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          {
            data: mockResponse,
          }
        );
  
        instance.createCommentAPICallID = msgValidationAPI2.messageId;
        runEngine.sendMessage("Unit Test", msgValidationAPI2);
        instance.props.navigation.getParam.mockReturnValue(mockuserprofile);
        await instance.setCountryFan()
        instance.setState({countriesList:[{
          country_code: 'US',
          country_name: "united states"
      }]})
        StorageProvider.get.mockResolvedValue('US')
        await instance.setCountryBand()
  
    });


    then("User clicks the back button", () => {
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "themeToggle")
        .simulate("press");

      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "hamburgerIcon")
        .simulate("press");

      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "notificationButton")
        .simulate("press");
      
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "navigationBackButton")
        .simulate("press");
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "followers")
        .simulate("press");

      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "followBtn")
        .simulate("press");

      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "following")
        .simulate("press");
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    });

    when("attributes is empty", () => {
      instance.setState({
        profileData: {
          data: {
            attributes: {},
          },
        },
      });
    });

    then("render UI when attributes is empty", () => {
      // expect(instance.state.profileData.data.attributes).toEqual({});
    });

    when("id is not empty", () => {
      instance.setState({
        profileData: {
          data: {
            id: "185",
          },
        },
        userID: "185",
      });
    });

    then("render UI when id is not empty", () => {
      // expect(instance.state.profileData.data.id).toEqual(instance.state.userID);
    });

    when("catgories has value", () => {
      instance.setState({
        profileData: {
          data: {
            attributes: {
              category_subcat: [
                {
                  id: "1",
                  name: "cat_1",
                  subcategories: [
                    {
                      id: "1",
                      name: "sub_cat_1",
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      let msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponseWithMultipleLikedEvents
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    then("render UI when catgories has value", () => {
      expect(userProfileBasicBlock.exists()).toBe(true);
    });

    when("band_artists has value", () => {
      instance.setState({
        profileData: {
          data: {
            attributes: {
              band_artists: [1, 2, 3],
            },
          },
        },
      });
    });

    then("render UI when band_artists has value", () => {
      // expect(instance.state.profileData.data.attributes.band_artists).toEqual([
      //   1,
      //   2,
      //   3,
      // ]);
    });

    when("calendar_event has value", () => {
      instance.setState({
        profileData: {
          data: {
            attributes: {
              calendar_event: [1, 2, 3],
            },
          },
        },
      });
    });

    then("render UI when calendar_event has value", () => {
      // expect(
      //   instance.state.profileData.data.attributes.calendar_event
      // ).toEqual([1, 2, 3]);
    });

    then("render user details", () => {
      const mockData = {
        data: {
          id: "185",
          type: "account",
          attributes: {
            activated: true,
            country_code: null,
            email: "astha.gupta@metafic.co",
            first_name: "Aasthaa",
            full_phone_number: "11234567890",
            phone_number: null,
            type: null,
            created_at: "2023-12-21T14:31:20.312Z",
            updated_at: "2024-01-12T10:14:39.563Z",
            device_id: null,
            unique_auth_id: "KsXDPCcTJhF4xmu8ia4iGQtt",
            country: "United States",
            state: "Washington",
            city: "Airways Heights",
            profile_image: "a",
            followers: 0,
            following: 0,
            category_subcat: [],
            band_artists: [],
          },
        },
      };
      const mockDataWithPrivateAccount = {
        data: {
          id: "185",
          type: "account",
          attributes: {
            activated: true,
            country_code: null,
            email: "astha.gupta@metafic.co",
            first_name: "Aasthaa",
            full_phone_number: "11234567890",
            phone_number: null,
            type: null,
            created_at: "2023-12-21T14:31:20.312Z",
            updated_at: "2024-01-12T10:14:39.563Z",
            device_id: null,
            unique_auth_id: "KsXDPCcTJhF4xmu8ia4iGQtt",
            country: "United States",
            state: "Washington",
            city: "Airways Heights",
            profile_image: "a",
            followers: 0,
            following: 0,
            category_subcat: [],
            band_artists: [],
            private: true,
          },
        },
      };
      let msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockData
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      instance.handleUserDetailApiResponse(mockData)
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockDataWithPrivateAccount
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    when("I send a successful follow API response", () => {
      instance.showAlert = testFn;

      mockAPISuccessCall(instance, "createFollowApiCallID", {
        "data": {
          "id": "81",
          "type": "follow",
          "attributes": {
            "id": 81,
            "current_user_id": 504,
            "account_id": 507,
            "created_at": "2024-08-04T09:24:05.730-07:00",
            "updated_at": "2024-08-04T09:24:05.730-07:00",
            "confirmed": false,
            "name": "Zeke",
            "followed_back": false,
            "profile_image_url": null
          }
        },
        "meta": {
          "message": "Follow request sent."
        }
      })

      mockAPISuccessCall(instance, "createFollowApiCallID", {
        "errors": [
          {
            "message": "You already follow."
          }
        ]
      })

      mockAPIFailureCall(instance, "createFollowApiCallID", {
        "errors": [
          {
            "message": "You already follow."
          }
        ]
      })
    });

    then("alert is shown", () => {
      // expect(testFn).toHaveBeenCalled();
    });

    when("showCommentsBtn is pressed", () => {
      const renderEventWrapper = shallow(
        <instance.renderEvents item={sampleEvent2} />
      );

      renderEventWrapper
        .findWhere((node) => node.prop("testID") === "showCommentsBtn")
        .simulate("press");
    });

    then("comments modal is open", () => {
      expect(userProfileBasicBlock.exists()).toBe(true);
    });

    when("closeCommentsModalButton is pressed", () => {
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "commentModal")
        .simulate("press");

      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "closeCommentsModalButton")
        .simulate("press");
    });

    then("comments modal is closed", () => {
      expect(userProfileBasicBlock.exists()).toBe(true);
    });

    when("comment is submitted", () => {
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "commentTextInput")
        .simulate("changeText", "Abc");
      instance.setState({ editingComment: false, showReplies: true })
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "emojiCommentBtn")
        .simulate("press");
    });

    then("comment is posted", () => {
      expect(userProfileBasicBlock.exists()).toBe(true);
    });

    when("comment is edited", () => {
      instance.setState({ editingComment: true, showReplies: true })
      shallow(<instance.renderComment item={mockCommentItem} />)
        .findWhere((node) => node.prop("testID") === "replyButton")
        .simulate("press");
      userProfileBasicBlock
        .findWhere((node) => node.prop("testID") === "emojiCommentBtn")
        .simulate("press");
    });

    then("comment is posted", () => {
      expect(userProfileBasicBlock.exists()).toBe(true);
    });

    when("private account is used", () => {
      let getFollowersListAPICall = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      getFollowersListAPICall.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getFollowersListAPICall.messageId
      );

      getFollowersListAPICall.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );

      instance.getFollowersListAPICallID = getFollowersListAPICall.messageId;
      runEngine.sendMessage("Unit Test", getFollowersListAPICall);

      getFollowersListAPICall = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      getFollowersListAPICall.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getFollowersListAPICall.messageId
      );

      getFollowersListAPICall.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: [
            {
              attributes: {
                account_id: "1",
              }
            }
          ]
        }
      );

      instance.getFollowersListAPICallID = getFollowersListAPICall.messageId;
      runEngine.sendMessage("Unit Test", getFollowersListAPICall);
    });

    then("it checks for followers", () => {
      expect(userProfileBasicBlock.exists()).toBe(true);
    });
  });

  test("Test render events", ({ given, when, then }) => {
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;
    let renderEventWrapper: ShallowWrapper;
    let shareEventBtn: ShallowWrapper;
    let likeEventBtn: ShallowWrapper;

    given("I am a User loading UserProfileBasicBlock", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
    });

    when("I call like event API", () => {
      const likeEventRequestMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      likeEventRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        likeEventRequestMsg.messageId
      );

      likeEventRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {}
      );

      instance.toggleLikeApiCallId = likeEventRequestMsg.messageId;
      runEngine.sendMessage("Unit Test", likeEventRequestMsg);
    });

    then("getUserDetailsAPI is invoked", () => {
      expect(instance.getUserDetailsAPI).toBeDefined();
    });

    when("I try to render event", () => {
      renderEventWrapper = shallow(
        <instance.renderEvents item={sampleEvent} />
      );

      shareEventBtn = renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "shareEventBtn"
      );

      likeEventBtn = renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "navigateToDetail"
      );
      likeEventBtn.simulate('press')
      renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "bandPicture"
      ).simulate("press")
      renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "bandPicture"
      ).simulate("press")
      renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "bandName"
      ).simulate("press")
      renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "openLocation"
      ).simulate("press")
      
      renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "likeThisTxt"
      ).simulate("press")

      renderEventWrapper.findWhere(
        (node) => node.prop("testID") === "commentBubble"
      ).simulate("press")

    });

    then("I can render event", () => {
      expect(shareEventBtn).toBeDefined();
    });

    when("I click likeEventBtn", () => {
      likeEventBtn.simulate("press");
    });

    then("I can like event", () => {
      expect(instance.toggleLikeApiCallId).toBeDefined();
    });

    when("I click shareEventBtn", () => {
      shareEventBtn.simulate("press");
    });

    then("navigate() is invoked", () => {
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    });
  });

  test("Comments", ({ given, when, then }) => {
    let userProfileBasicBlock: ShallowWrapper;
    let commentsToggleBtn: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("I am a User loading UserProfileBasicBlock", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
    });

    when("I navigate to the UserProfileBasicBlock", () => {
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
      commentsToggleBtn = userProfileBasicBlock.findWhere(
        (node) => node.prop("testID") === "showCommentsBtn"
      );
    });

    then("I can toggle the comments popup", () => {
      expect(commentsToggleBtn).toBeDefined();
    });
  });

  test("Render and interact with the comment component", ({
    given,
    when,
    then,
  }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;
    let profileImageBtn: ShallowWrapper;
    let showReplyBtn: ShallowWrapper;

    let testFn = jest.fn();

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderComment
          item={{
            ...mockCommentItem,
            attributes: {
              ...mockCommentItem.attributes,
              like_by_me: false,
              profile_image_url: "",
            },
          }}
        />
      );
      wrapper = shallow(<instance.renderComment item={mockCommentItem} />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("I click the profile image button", () => {
      profileImageBtn = wrapper.findWhere(
        (node) => node.prop("testID") === "imgShowProfile"
      );
      profileImageBtn.simulate("press");
    });

    then("the profile is shown", () => {
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    });

    when("the reply button is pressed", () => {
      instance.commentTextInput = new TextInput({});
      instance.commentTextInput = {
        ...instance.commentTextInput,
        focus: testFn,
        setState: () => { },
        forceUpdate: () => { },
        render: () => <></>,
      };
      wrapper
        .findWhere((node) => node.prop("testID") === "replyButton")
        .simulate("press");
    });

    then("input.focus() is invoked", () => {
      expect(testFn).toHaveBeenCalled();
    });

    when("the show reply button is pressed", () => {
      showReplyBtn = wrapper.findWhere(
        (node) => node.prop("testID") === "showReplyButton"
      );

      showReplyBtn.simulate("press");
    });

    then("reply modal is open", () => {
      expect(showReplyBtn.exists()).toBe(true);
    });

    when("the like button is pressed", () => {
      showReplyBtn = wrapper.findWhere(
        (node) => node.prop("testID") === "likeCommentButton"
      );

      showReplyBtn.simulate("press");
    });

    then("you can like comments", () => {
      expect(showReplyBtn.exists()).toBe(true);
    });
  });

  test("Render comments", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
      instance.setState({commentsLoading:true,isLoadingComments:true})
      shallow(<instance.renderComments />);

      const mockResponse = {
        data: [mockCommentItem],
      };

      const createBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        createBulkUploadMsg.messageId
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.fetchCommentsAPICallID = createBulkUploadMsg.messageId;
      runEngine.sendMessage("Unit Test", createBulkUploadMsg);
      for (let i = 0; i < instance.defaultEmojisForSelectionStrip.length; i++) {
        let  emojiReplyBtn2 = userProfileBasicBlock.findWhere(
            (node) => node.prop("testID") === `emojiReply${i}c`
          );
          emojiReplyBtn2.simulate("press");
        }
    });

    when("I try to render the component", () => {
      wrapper = shallow(<instance.renderComments />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Render hidden comments", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let deletCommentBtn: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    let testFn = jest.fn();

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
      shallow(<instance.renderHiddenComment item={mockCommentItem} />);

      const mockResponse = {
        data: [mockCommentItem],
      };

      const createBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        createBulkUploadMsg.messageId
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.fetchCommentsAPICallID = createBulkUploadMsg.messageId;
      runEngine.sendMessage("Unit Test", createBulkUploadMsg);
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderHiddenComment item={mockCommentItem} />
      );

      wrapper
        .findWhere((node) => node.prop("testID") === "editComment")
        .simulate("press");

      wrapper
        .findWhere((node) => node.prop("testID") === "deleteComment")
        .simulate("press");
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("the edit button is pressed", () => {
      instance.commentTextInput = new TextInput({});
      instance.commentTextInput = {
        ...instance.commentTextInput,
        focus: testFn,
        setState: () => { },
        forceUpdate: () => { },
        render: () => <></>,
      };
      wrapper
        .findWhere((node) => node.prop("testID") === "editComment")
        .simulate("press");
    });

    then("input.focus() is invoked", () => {
      expect(testFn).toHaveBeenCalled();
    });

    when("delete button is pressed", () => {
      deletCommentBtn = wrapper.findWhere(
        (node) => node.prop("testID") === "deleteComment"
      );
      deletCommentBtn.simulate("press");
    });

    then("comments can be deleted", () => {
      expect(deletCommentBtn.exists()).toBe(true);
    });
  });

  test("Render replies modal", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let emojiReplyBtn: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
    });

    when("I try to render the component", () => {
      wrapper = shallow(<instance.renderRepliesModal />);
      instance.isPlatformiOS = () => {
        return true;
      };
      wrapper = shallow(<instance.renderRepliesModal />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("emojiReply button is pressed", () => {
      for (let i = 0; i < instance.defaultEmojisForSelectionStrip.length; i++) {
        emojiReplyBtn = wrapper.findWhere(
          (node) => node.prop("testID") === `emojiReply${i}`
        );
        emojiReplyBtn.simulate("press");
      } 
    });

    then("emojis are inserted", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("onChange is triggered on reply text input", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "replyTextInput")
        .simulate("changeText", "Abc");
    });

    then("reply is updated", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("close modal button is pressed", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "closeReplyPopupButton")
        .simulate("press");

      wrapper
      .findWhere((node) => node.prop("testID") === "repliesModal")
      .simulate("press");
    });

    then("modal is closed", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Render replies", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
    });

    when("I try to render the component", () => {
      instance.setState({commentsLoading:true})
      wrapper = shallow(<instance.renderReplies />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("userProfileImage is pressed", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "userProfileImage")
        .simulate("press");
    });

    then("profile is shown", () => {
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    });
  });

  test("Render reply item", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderReplyItem
          item={{
            ...mockCommentItem.attributes.replies[0],
            profile_image: "",
            created_at: "",
          }}
        />
      );
      wrapper = shallow(
        <instance.renderReplyItem
          item={mockCommentItem.attributes.replies[0]}
        />
      );
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("showProfileBtn is pressed", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "showProfileBtn")
        .simulate("press");
    });

    then("profile is shown", () => {
      expect(screenProps.navigation.navigate).toHaveBeenCalled();
    });
  });

  test("Render reply hidden item", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <UserProfileBasicBlock {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as UserProfileBasicBlock;
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderHiddenReplyItem
          item={mockCommentItem.attributes.replies[0]}
        />
      );
      wrapper = shallow(
        <instance.renderHiddenReplyItem
          item={{
            ...mockCommentItem.attributes.replies[0],
            profile_image: "",
            created_at: "",
            account_id: "",
          }}
        />
      );
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("edit is pressed", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "editReply")
        .simulate("press");
    });

    then("reply can be edited", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("deleteReply is pressed", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "deleteReply")
        .simulate("press");
    });

    then("reply can be deleted", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Create and delete comments", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      wrapper = shallow(<UserProfileBasicBlock {...screenProps} />);
    });

    when("I try to render the component", () => {
      instance = wrapper.instance() as UserProfileBasicBlock;
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("delete comment API is called", () => {
      const mockResponse = {};

      const createBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        createBulkUploadMsg.messageId
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.deleteCommentAPICallID = createBulkUploadMsg.messageId;
      runEngine.sendMessage("Unit Test", createBulkUploadMsg);
    });

    then("API call goes through", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("post comment API is called", () => {
      const mockResponse = {};

      const createBulkUploadMsg = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        createBulkUploadMsg.messageId
      );

      createBulkUploadMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.postCommentAPICallID = createBulkUploadMsg.messageId;
      runEngine.sendMessage("Unit Test", createBulkUploadMsg);
    });

    then("API call goes through", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Calendar and liked events", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      wrapper = shallow(<UserProfileBasicBlock {...screenProps} />);
      instance = wrapper.instance() as UserProfileBasicBlock;
    });

    when("the calendar and liked events are set", () => {
      let msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponseWithMultipleLikedEvents
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      instance.getUserDetailsAPI(instance.state.userID);

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          ...mockResponse,
          data: {
            ...mockResponse.data,
            attributes: {
              ...mockResponse.data.attributes,
              calendar_shows: [],
              liked_events: []
            }
          }
        }
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      instance.getUserDetailsAPI(instance.state.userID);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Render preferences", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let instance: UserProfileBasicBlock;

    given("the component is rendered", () => {
      const tmpWrapper = shallow(<UserProfileBasicBlock {...screenProps} />);
      instance = tmpWrapper.instance() as UserProfileBasicBlock;
      wrapper = shallow(<instance.renderPreferences />);
    });

    when("the calendar and liked events are set", () => {
      let msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponse
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponseWithMultipleLikedEvents
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      wrapper = shallow(<instance.renderPreferences />);

      wrapper.findWhere(node => node.prop("testID") === "editPrefsBtn").simulate("press");

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockResponseWithNoLikedEvents
      );

      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);

      msgValidationAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI.messageId
      );

      msgValidationAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          ...mockResponse,
          data: {
            ...mockResponse.data,
            attributes: {
              ...mockResponse.data.attributes,
              calendar_shows: [],
              liked_events: []
            }
          }
        }
      );
      instance.setState({isOtherUser:false})
      instance.handleBack()
      instance.userDetailGetApiCallId = msgValidationAPI.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
