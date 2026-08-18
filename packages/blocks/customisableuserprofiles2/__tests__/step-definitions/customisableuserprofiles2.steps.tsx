import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Customisableuserprofiles2 from "../../src/Customisableuserprofiles2"
import { runEngine } from "../../../../framework/src/RunEngine";
import { ICommentItem } from "../../src/Customisableuserprofiles2Controller";
import { Linking, Platform, TextInput } from "react-native";

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

const screenProps = {
  navigation: {
    openDrawer: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    state: {
      params: {
        isOtherUser: false
      }
    },
    goBack: jest.fn()
  },
  id: "Customisableuserprofiles2"
}

const mockSuccessResponse = {
  "data": {
    "id": "27",
    "type": "account_profile",
    "attributes": {
      "account_id":"27",
      "activated": true,
      "push_notification": true,
      "country_code": "1",
      "email": "sad@gmail.com",
      "first_name": "sad",
      "full_phone_number": "+18604292803",
      "phone_number": "8604292803",
      "type": null,
      "created_at": "2024-04-05T15:21:41.804Z",
      "updated_at": "2024-05-29T11:52:34.146Z",
      "device_id": null,
      "unique_auth_id": "zQbZEQX4vlIEM0RJFmaaBgtt",
      "account_type": "Artist",
      "country": "US",
      "state": "District of Columbia",
      "city": "Washington",
      "private": true,
      "role_id": 9,
      "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZEk9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--464763148153a4a4476ffb6ebf8866d3bfe5e165/1864472.png",
      "followers": 0,
      "following": 0,
      "category_subcat": [
        {
          "id": 8,
          "name": "Art",
          "subcategories": [
            {
              "id": 74,
              "name": "Architecture"
            },
            {
              "id": 76,
              "name": "Collage"
            },
            {
              "id": 75,
              "name": "Ceramic"
            }
          ]
        },
        {
          "id": 6,
          "name": "Music",
          "subcategories": [
            {
              "id": 80,
              "name": "Acoustic"
            }
          ]
        },
        {
          "id": 9,
          "name": "Other",
        }
      ],
      "band_artists": null,
      "calendar_shows": [],
      "liked_events": [],
      "is_verified_user": true,
      "verify_at": null,
      "posts": 2,
      "follow": false,
      "is_confirm": null,
      "social_media": {
        "id": 17,
        "instagram": "https://www.instagram.com",
        "facebook": "http://www.facebook.com",
        "linkedin": "www.linkedin.com",
        "created_at": "2024-05-05T20:40:40.442Z",
        "updated_at": "2024-05-05T20:40:40.442Z"
      },
      "official_website": "www.abc.com",
      "bio": "About me",
      "influences": [
        "influences1"
      ],
      "affiliates": [
        "affiliates1"
      ],
      "post_list": [
        {
          "id": 39,
          "name": null,
          "description": "hi",
          "body": null,
          "location": null,
          "account_id": 541,
          "is_explicit": false,
          "like_by_me": false,
          "created_at": "2024-11-07T00:07:54.765-08:00",
          "updated_at": "2024-11-07T00:07:54.851-08:00",
          "added_in_calendar": false,
          "model_name": "BxBlockPosts::Post",
          "images_and_videos": [
            {
              "id": 425,
              "filename": "eventImage.jpg",
              "url": "sbucket/3llfxm4zr4bntirz7g8se48oob7i",
              "type": "image"
            }
          ],
          "likes_count": 0,
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg"
        },
        {
          "id": 37,
          "name": "New post from Admin",
          "description": "New post from Admin Description",
          "body": "New post from Admin body",
          "location": "Lucknow",
          "account_id": 541,
          "is_explicit": true,
          "like_by_me": false,
          "created_at": "2024-10-17T02:02:50.593-07:00",
          "updated_at": "2024-10-23T02:22:20.084-07:00",
          "added_in_calendar": false,
          "model_name": "BxBlockPosts::Post",
          "images_and_videos": [
            {
              "id": 415,
              "filename": "photo-1429514513361-8fa32282fd5f.jpeg",
              "url": "/sbucket/8zo34kgwfocjy9435krxq9s6mnm1",
              "type": "image"
            }
          ],
          "likes_count": 0,
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg"
        }
      ],
      "show_list": [
        {
          "id": 237,
          "event_title": "New event for detail testing",
          "date_of_the_show": "2024-11-18",
          "time": "02:30:00",
          "description": "Test details",
          "rules_and_regulations": null,
          "city": "Ahwahnee",
          "state": "California",
          "country": "US",
          "zip_code": 12345,
          "address": "address",
          "location": "location",
          "like_by_me": true,
          "added_in_calendar": true,
          "account_id": 123,
          "show_features": [],
          "website": "www.google.com",
          "likes_count": 1,
          "comment_count": 1,
          "model_name": "Show",
          "band_name": "my band name",
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg",
          "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcU1CIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4a06f7deb267f04e7ec25c3d1f12c67073558d49/eventImage.jpg",
          "type_of_show": [
            {
              "id": 8,
              "name": "Art",
              "approved_by_admin": true,
              "created_at": "2023-10-03T02:46:13.375-07:00",
              "updated_at": "2024-08-25T22:32:48.957-07:00"
            }
          ],
          "genre": [
            {
              "id": 103,
              "name": "Ceramic",
              "approved_by_admin": true,
              "created_at": "2024-09-11T01:02:46.489-07:00",
              "updated_at": "2024-09-11T23:22:32.339-07:00"
            }
          ],
          "line_ups": [
            "my band name",
            "Jerry"
          ]
        },
        {
          "id": 228,
          "event_title": "Eden ",
          "date_of_the_show": "2024-12-18",
          "time": "01:00:00",
          "description": "This is a Music Show",
          "rules_and_regulations": "Everyone allowed",
          "city": "Washington",
          "state": "District of Columbia",
          "country": "US",
          "zip_code": 89003,
          "address": "3488 Zimmerman Lane",
          "location": "Mig road",
          "like_by_me": true,
          "added_in_calendar": true,
          "account_id": 541,
          "show_features": [],
          "website": "www.google.com",
          "likes_count": 6,
          "comment_count": 6,
          "model_name": "Show",
          "band_name": "my band name",
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg",
          "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcDBCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--94f28e0b854cecad2fde64238a2f877f3ec65c9e/photo-1429514513361-8fa32282fd5f.jpeg",
          "type_of_show": [
            {
              "id": 6,
              "name": "Music",
              "approved_by_admin": true,
              "created_at": "2023-10-03T02:46:13.337-07:00",
              "updated_at": "2024-10-24T23:06:25.552-07:00"
            }
          ],
          "genre": [
            null
          ],
          "line_ups": []
        }
      ]
    }
  }
}

const mockSuccessResponse2 = {
  "data": {
    "id": "272",
    "type": "account_profile",
    "attributes": {
      "activated": true,
      "push_notification": true,
      "country_code": "1",
      "email": "sad@gmail.com",
      "first_name": "sad",
      "full_phone_number": "+18604292803",
      "phone_number": "8604292803",
      "type": null,
      "created_at": "2024-04-05T15:21:41.804Z",
      "updated_at": "2024-05-29T11:52:34.146Z",
      "device_id": null,
      "unique_auth_id": "zQbZEQX4vlIEM0RJFmaaBgtt",
      "account_type": "Artist",
      "country": "US",
      "state": "District of Columbia",
      "city": "Washington",
      "private": true,
      "role_id": 9,
      "profile_image": "rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZEk9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--464763148153a4a4476ffb6ebf8866d3bfe5e165/1864472.png",
      "followers": 0,
      "following": 0,
      "band_artists": null,
      "calendar_shows": [],
      "liked_events": [],
      "is_verified_user": true,
      "verify_at": null,
      "posts": 2,
      "follow": true,
      "is_confirm": null,
      "social_media": {
        "id": 17,
        "instagram": "",
        "facebook": "",
        "linkedin": "",
        "created_at": "2024-05-05T20:40:40.442Z",
        "updated_at": "2024-05-05T20:40:40.442Z"
      },
      "official_website": "abc.com",
      "bio": "",
      "influences": [
        "influences1",
        "influences2"
      ],
      "affiliates": [
        "affiliates1",
        "affiliates2"
      ],
      "post_list": [
        {
          "id": 39,
          "name": null,
          "description": "hi",
          "body": null,
          "location": null,
          "account_id": 541,
          "is_explicit": false,
          "like_by_me": false,
          "created_at": "2024-11-07T00:07:54.765-08:00",
          "updated_at": "2024-11-07T00:07:54.851-08:00",
          "added_in_calendar": false,
          "model_name": "BxBlockPosts::Post",
          "images_and_videos": [
            {
              "id": 425,
              "filename": "eventImage.jpg",
              "url": "/sbucket/3llfxm4zr4bntirz7g8se48oob7i",
              "type": "image"
            }
          ],
          "likes_count": 0,
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg"
        },
        {
          "id": 37,
          "name": "New post from Admin",
          "description": "New post from Admin Description",
          "body": "New post from Admin body",
          "location": "Lucknow",
          "account_id": 541,
          "is_explicit": true,
          "like_by_me": false,
          "created_at": "2024-10-17T02:02:50.593-07:00",
          "updated_at": "2024-10-23T02:22:20.084-07:00",
          "added_in_calendar": false,
          "model_name": "BxBlockPosts::Post",
          "images_and_videos": [
            {
              "id": 415,
              "filename": "photo-1429514513361-8fa32282fd5f.jpeg",
              "url": "/sbucket/8zo34kgwfocjy9435krxq9s6mnm1",
              "type": "image"
            }
          ],
          "likes_count": 0,
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg"
        }
      ],
      "show_list": [
        {
          "id": 237,
          "event_title": "New event for detail testing",
          "date_of_the_show": "2024-11-18",
          "time": "02:30:00",
          "description": "Test details",
          "rules_and_regulations": null,
          "city": "Ahwahnee",
          "state": "California",
          "country": "US",
          "zip_code": 12345,
          "address": "address",
          "location": "location",
          "like_by_me": true,
          "added_in_calendar": true,
          "account_id": 541,
          "show_features": [],
          "website": "www.google.com",
          "likes_count": 1,
          "comment_count": 1,
          "model_name": "Show",
          "band_name": "my band name",
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg",
          "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcU1CIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4a06f7deb267f04e7ec25c3d1f12c67073558d49/eventImage.jpg",
          "type_of_show": [
            {
              "id": 8,
              "name": "Art",
              "approved_by_admin": true,
              "created_at": "2023-10-03T02:46:13.375-07:00",
              "updated_at": "2024-08-25T22:32:48.957-07:00"
            }
          ],
          "genre": [
            {
              "id": 103,
              "name": "Ceramic",
              "approved_by_admin": true,
              "created_at": "2024-09-11T01:02:46.489-07:00",
              "updated_at": "2024-09-11T23:22:32.339-07:00"
            }
          ],
          "line_ups": [
            "my band name",
            "Jerry"
          ]
        },
        {
          "id": 228,
          "event_title": "Eden ",
          "date_of_the_show": "2024-12-18",
          "time": "01:00:00",
          "description": "This is a Music Show",
          "rules_and_regulations": "Everyone allowed",
          "city": "Washington",
          "state": "District of Columbia",
          "country": "US",
          "zip_code": 89003,
          "address": "3488 Zimmerman Lane",
          "location": "Mig road",
          "like_by_me": true,
          "added_in_calendar": true,
          "account_id": 541,
          "show_features": [],
          "website": "www.google.com",
          "likes_count": 6,
          "comment_count": 6,
          "model_name": "Show",
          "band_name": "my band name",
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg",
          "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcDBCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--94f28e0b854cecad2fde64238a2f877f3ec65c9e/photo-1429514513361-8fa32282fd5f.jpeg",
          "type_of_show": [
            {
              "id": 6,
              "name": "Music",
              "approved_by_admin": true,
              "created_at": "2023-10-03T02:46:13.337-07:00",
              "updated_at": "2024-10-24T23:06:25.552-07:00"
            }
          ],
          "genre": [
            null
          ],
          "line_ups": []
        }
      ]
    }
  }
}

const mockErrorResponse = {
  "errors": []
}

const mockCommentItem: ICommentItem = {
  key: "1",
  attributes: {
    account_id: "",
    account: {
      id: 123,
      first_name: "John",
      account_type: "fan"
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
        account_type: 'fan'
      },
      {
        id: 2,
        key: "1-2",
        account_id: 125,
        profile_image: null,
        account_name: "Doe",
        reply: "This is a reply 2",
        created_at: new Date().toISOString(),
        account_type: 'Band'
      },
    ],
    likes_count: 5,
    like_by_me: true,
  },
  id: 1,
};

const feature = loadFeature('./__tests__/features/customisableuserprofiles2-scenario.feature');

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('user_id')),
  get: jest.fn().mockImplementation(() => Promise.resolve('27'))
}));

defineFeature(feature, (test) => {
  let mockCanOpenURL: jest.Mock;
  let mockOpenURL: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }));
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
    jest.spyOn(runEngine, "sendMessage");
    mockCanOpenURL = Linking.canOpenURL as jest.Mock;
    mockOpenURL = Linking.openURL as jest.Mock;
  });

  test('User navigates to customisableuserprofiles2', ({ given, when, then }) => {
    let customisableuserprofiles2: ShallowWrapper;
    let instance: Customisableuserprofiles2;
    let followText: ShallowWrapper;

    given('I am a User loading customisableuserprofiles2', () => {
      customisableuserprofiles2 = shallow(<Customisableuserprofiles2 {...screenProps} />);
    });

    when('I navigate to the customisableuserprofiles2', async () => {
      instance = customisableuserprofiles2.instance() as Customisableuserprofiles2
      instance.setState({ isOtherUser: false })
      instance.handleBackButton()
      instance.setState({ isOtherUser: true })
      instance.handleBackButton()
      instance.props.navigation.state.params.isOtherUser = true
      instance.scrollToPosts();

      instance.handleShowComments('123')
      instance.handleShowComments('123')
      instance.setState({ editingComment: false, showReplies: false })
      await instance.postComment()
      instance.setState({ editingComment: true, showReplies: true })
      await instance.postComment()
      instance.handleReplyBack()
      await instance.postReplyToComment()
      instance.setState({ editingComment: true, showReplies: true })
      await instance.postReplyToComment()

      await instance.handleWillFocus()
      instance.props.navigation.state.params = null
      await instance.handleWillFocus()
      instance.setState({ userProfileData: { bio: "test" } })
      await instance.navigateToBandEditProfile()
      instance.setState({ userProfileData: { bio: "" } })
      await instance.navigateToBandEditProfile()
      instance.handleOfficialWebsite('https://test.com')
      mockCanOpenURL.mockResolvedValue(true);
      instance.handleFacebookLink('https://test.com')
      instance.handleInstagramLink('https://test.com')
      instance.handleLinkedInLink('https://test.com')
      instance.parseUrlFaceBook('http://www.test.com')
      instance.parseUrlFaceBook('https://www.test.com')
      instance.parseUrlFaceBook('test')
      instance.parseUrlInstagram('http://www.test.com')
      instance.parseUrlInstagram('https://www.test.com')
      instance.parseUrlInstagram('test')
      instance.parseUrlLinkedin('http://www.test.com')
      instance.parseUrlLinkedin('https://www.test.com')
      instance.parseUrlLinkedin('test')
      mockCanOpenURL.mockResolvedValue(false);
      Platform.OS = 'ios'
      instance.handleFacebookLink('test.com')
      instance.handleInstagramLink('test.com')
      instance.handleLinkedInLink('test.com')
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      const mockapiMessage = new Message(getName(MessageEnum.AccoutLoginSuccess));
      mockapiMessage.addData(getName(MessageEnum.AuthTokenDataMessage), 'test');
      runEngine.sendMessage("Unit Test", mockapiMessage);
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
      mockAPISuccessCall(instance, "createFollowApiCallID", mockErrorResponse)
      mockAPIFailureCall(instance, "createFollowApiCallID", mockErrorResponse)

      customisableuserprofiles2.findWhere(node => node.prop("testID") === "scrollView");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "navigationBackButton").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "themeToggle").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "notificationIcon").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "hamburgerMenu").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "postsCount").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "followersCount").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "followingCount").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "blocked").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "websiteURL").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "instagramURL").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "facebookURL").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "linkedinURL").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "containerView").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "editProfileTxt").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "bioTxt");
      instance.txtInputWebProps.onChangeText('test')
      instance.txtInputProps.secureTextEntry = false
      instance.btnShowHideProps.onPress()
      instance.txtInputProps.secureTextEntry = true
      instance.btnShowHideProps.onPress()
      instance.btnExampleProps.onPress()
      instance.setEnableField()

      instance.setState({ expandedPosts: true })
      instance.setState({ expandedShows: true })
      instance.getPostsLabel()
      instance.getShowsLabel()
      instance.setState({ expandedPosts: false })
      instance.setState({ expandedShows: false })
      instance.getPostsLabel()
      instance.getShowsLabel()
      instance.togglePostsExpand()
      instance.toggleShowsExpand()
      instance.handleProfileNavigation(1)
      instance.handleShareEvent('123',"test_type")
      instance.handleReplyPressed("1")

      instance.setState({ showTncPopup: true })
      customisableuserprofiles2
        .findWhere((node) => node.prop("testID") === "TnCPopupCloseBtn2")
        .simulate("press");
      customisableuserprofiles2
        .findWhere((node) => node.prop("testID") === "checkoutTnCbtn")
        .simulate("press");

      const msgValidationAPI2 = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgValidationAPI2.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgValidationAPI2.messageId
      );

      msgValidationAPI2.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        mockSuccessResponse
      );

      instance.createCommentAPICallID = msgValidationAPI2.messageId;
      runEngine.sendMessage("Unit Test", msgValidationAPI2);
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

      const categoryFlatList = customisableuserprofiles2.findWhere(node => node.prop("testID") === "categoriesList");
      mockSuccessResponse.data.attributes.category_subcat.forEach((item: any, index: number) => {
        categoryFlatList.renderProp("renderItem")({
          item: item,
          index: index
        });

        categoryFlatList.renderProp("keyExtractor")({
          item: item,
        });
      })

      const categorySubcategoryFlatList = customisableuserprofiles2.findWhere(node => node.prop("testID") === "categorySubCategoriesList");
      mockSuccessResponse.data.attributes.category_subcat.forEach((item: any, index: number) => {
        const renderItem = categorySubcategoryFlatList.renderProp("renderItem")({
          item: item,
          index: index
        });

        const subcategoryFlatList = renderItem.findWhere(node => node.prop("testID") === "subCategoriesList");
        mockSuccessResponse.data.attributes.category_subcat.forEach((item: any, index: number) => {
          subcategoryFlatList.renderProp("renderItem")({
            item: item,
            index: index
          });

          subcategoryFlatList.renderProp("keyExtractor")({
            item: item,
          });
        })

        categorySubcategoryFlatList.renderProp("keyExtractor")({
          item: item,
        });
      })

      const influencesFlatlist = customisableuserprofiles2.findWhere(node => node.prop("testID") === "influencesFlatlist");
      mockSuccessResponse.data.attributes.influences.forEach((item, index) => {
        influencesFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        influencesFlatlist.renderProp("keyExtractor")(item);
      })
      mockSuccessResponse2.data.attributes.influences.forEach((item, index) => {
        influencesFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        influencesFlatlist.renderProp("keyExtractor")(item);
      })
      const affiliatesFlatlist = customisableuserprofiles2.findWhere(node => node.prop("testID") === "affiliatesFlatlist");
      mockSuccessResponse.data.attributes.affiliates.forEach((item, index) => {
        affiliatesFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        affiliatesFlatlist.renderProp("keyExtractor")(item);
      })
      mockSuccessResponse2.data.attributes.affiliates.forEach((item, index) => {
        affiliatesFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        affiliatesFlatlist.renderProp("keyExtractor")(item);
      })
    instance.setState({ userProfileData: { bio: "",show_list:[
        {
          "id": 237,
          "event_title": "New event for detail testing",
          "date_of_the_show": "2024-11-18",
          "time": "02:30:00",
          "description": "Test details",
          "rules_and_regulations": null,
          "city": "Ahwahnee",
          "state": "California",
          "country": "US",
          "zip_code": 12345,
          "address": "address",
          "location": "location",
          "like_by_me": true,
          "added_in_calendar": true,
          "account_id": 123,
          "show_features": [],
          "website": "www.google.com",
          "likes_count": 1,
          "comment_count": 1,
          "model_name": "Show",
          "band_name": "my band name",
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg",
          "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcU1CIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4a06f7deb267f04e7ec25c3d1f12c67073558d49/eventImage.jpg",
          "type_of_show": [
            {
              "id": 8,
              "name": "Art",
              "approved_by_admin": true,
              "created_at": "2023-10-03T02:46:13.375-07:00",
              "updated_at": "2024-08-25T22:32:48.957-07:00"
            }
          ],
          "genre": [
            {
              "id": 103,
              "name": "Ceramic",
              "approved_by_admin": true,
              "created_at": "2024-09-11T01:02:46.489-07:00",
              "updated_at": "2024-09-11T23:22:32.339-07:00"
            }
          ],
          "line_ups": [
            "my band name",
            "Jerry"
          ]
        },
        {
          "id": 228,
          "event_title": "Eden ",
          "date_of_the_show": "2024-12-18",
          "time": "01:00:00",
          "description": "This is a Music Show",
          "rules_and_regulations": "Everyone allowed",
          "city": "Washington",
          "state": "District of Columbia",
          "country": "US",
          "zip_code": 89003,
          "address": "3488 Zimmerman Lane",
          "location": "Mig road",
          "like_by_me": true,
          "added_in_calendar": true,
          "account_id": 541,
          "show_features": [],
          "website": "www.google.com",
          "likes_count": 6,
          "comment_count": 6,
          "model_name": "Show",
          "band_name": "my band name",
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg",
          "profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcDBCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--94f28e0b854cecad2fde64238a2f877f3ec65c9e/photo-1429514513361-8fa32282fd5f.jpeg",
          "type_of_show": [
            {
              "id": 6,
              "name": "Music",
              "approved_by_admin": true,
              "created_at": "2023-10-03T02:46:13.337-07:00",
              "updated_at": "2024-10-24T23:06:25.552-07:00"
            }
          ],
          "genre": [
            null
          ],
          "line_ups": []
        }
      ] } })
      const showsFlatList = customisableuserprofiles2.findWhere(node => node.prop("testID") === "showsFlatList");
      customisableuserprofiles2.findWhere(node => node.prop("testID") === "showsView")
      mockSuccessResponse.data.attributes.show_list.forEach((item: any, index: number) => {
        const innerItem = showsFlatList.renderProp("renderItem")({
          item: item,
          index: index
        });

        innerItem.findWhere(
          (node) => node.prop("testID") === "openGoogleMap"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "likeShowBtn"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "showCommentBubble"
        ).simulate("press")
        instance.setState({userID:'123'})
        innerItem.findWhere(
          (node) => node.prop("testID") === "showDetail"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "shareShowBtn"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "likeThisShowText"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "showCommentsBtn"
        ).simulate("press")
      })
      instance.setState({ userProfileData: { bio: "",post_list:[
        {
          "id": 39,
          "name": null,
          "description": "hi",
          "body": null,
          "location": null,
          "account_id": 541,
          "is_explicit": false,
          "like_by_me": false,
          "created_at": "2024-11-07T00:07:54.765-08:00",
          "updated_at": "2024-11-07T00:07:54.851-08:00",
          "added_in_calendar": false,
          "model_name": "BxBlockPosts::Post",
          "images_and_videos": [
            {
              "id": 425,
              "filename": "eventImage.jpg",
              "url": "sbucket/3llfxm4zr4bntirz7g8se48oob7i",
              "type": "image"
            }
          ],
          "likes_count": 0,
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg"
        },
        {
          "id": 37,
          "name": "New post from Admin",
          "description": "New post from Admin Description",
          "body": "New post from Admin body",
          "location": "Lucknow",
          "account_id": 541,
          "is_explicit": true,
          "like_by_me": false,
          "created_at": "2024-10-17T02:02:50.593-07:00",
          "updated_at": "2024-10-23T02:22:20.084-07:00",
          "added_in_calendar": false,
          "model_name": "BxBlockPosts::Post",
          "images_and_videos": [
            {
              "id": 415,
              "filename": "photo-1429514513361-8fa32282fd5f.jpeg",
              "url": "/sbucket/8zo34kgwfocjy9435krxq9s6mnm1",
              "type": "image"
            }
          ],
          "likes_count": 0,
          "band_profile_image": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalFCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6af042f15d91b9e158905e3ba5e9eb74089cacab/profilePic.jpg"
        }
      ] } })
      instance.setState({ profileContentTab: 'posts' });
      const postsFlatList = customisableuserprofiles2.findWhere(node => node.prop("testID") === "postsFlatList");
      mockSuccessResponse.data.attributes.post_list.forEach((item: any, index: number) => {
        const innerItem = postsFlatList.renderProp("renderItem")({
          item: item,
          index: index
        });

        innerItem.findWhere(
          (node) => node.prop("testID") === "likePostBtn"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "postCommentBubble"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "navigateToPostsDetail"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "sharePostBtn"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "likeThisPostText"
        ).simulate("press")

        innerItem.findWhere(
          (node) => node.prop("testID") === "postCommentsBtn"
        ).simulate("press")
      })

      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockSuccessResponse2)
    });

    then("User opens drawer menu", () => {
      expect(screenProps.navigation.openDrawer).toHaveBeenCalled()
    })

    when("User opens other band's profile", () => {
      instance.setState({ profileIdToLoad: "272", userID: "373" })
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockSuccessResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockSuccessResponse2)
      followText = customisableuserprofiles2.findWhere((node) => node.prop("testID") === "follow").simulate("press");

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
    })

    then("API is called", () => {
      expect(followText).toBeDefined()
    })

    when("test", () => {
      instance.setState({ profileIdToLoad: "272", userID: "373" })
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockSuccessResponse2)

      followText = customisableuserprofiles2.findWhere((node) => node.prop("testID") === "follow").simulate("press");
      customisableuserprofiles2.findWhere((node) => node.prop("testID") === "message").simulate("press");
    })
    then("API is called", () => {
      expect(followText).toBeDefined()
    })
  });

  test("Comments", ({ given, when, then }) => {
    let userProfileBasicBlock: ShallowWrapper;
    let commentsToggleBtn: ShallowWrapper;
    let instance: Customisableuserprofiles2;

    given("I am a User loading Customisableuserprofiles2", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
    });

    when("I navigate to the Customisableuserprofiles2", () => {
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
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
    let instance: Customisableuserprofiles2;
    let profileImageBtn: ShallowWrapper;
    let showReplyBtn: ShallowWrapper;

    let testFn = jest.fn();

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderShowsPostsComment
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
      wrapper = shallow(<instance.renderShowsPostsComment item={mockCommentItem} />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("I click the profile image button", () => {
      profileImageBtn = wrapper.findWhere(
        (node) => node.prop("testID") === "commentUserProfile"
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
        .findWhere((node) => node.prop("testID") === "commentUserProfile")
        .simulate("press");
    });

    then("input.focus() is invoked", () => {
      // expect(testFn).toHaveBeenCalled();
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
        (node) => node.prop("testID") === "likeCommentsButton"
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
    let instance: Customisableuserprofiles2;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
      instance.setState({ commentsLoading: true, isLoadingComments: true })
      shallow(<instance.renderShowsPostsComments />);

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
        let emojiReplyBtn2 = userProfileBasicBlock.findWhere(
          (node) => node.prop("testID") === `emojiReply${i}c`
        );
        emojiReplyBtn2.simulate("press");
      }
    });

    when("I try to render the component", () => {
      wrapper = shallow(<instance.renderShowsPostsComments />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Render hidden comments", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let deletCommentBtn: ShallowWrapper;
    let instance: Customisableuserprofiles2;

    let testFn = jest.fn();

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
      shallow(<instance.renderHiddenShowsPostsComment item={mockCommentItem} />);

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
        <instance.renderHiddenShowsPostsComment item={mockCommentItem} />
      );

      wrapper
        .findWhere((node) => node.prop("testID") === "editAComment")
        .simulate("press");

      wrapper
        .findWhere((node) => node.prop("testID") === "deleteAComment")
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
        .findWhere((node) => node.prop("testID") === "editAComment")
        .simulate("press");
    });

    then("input.focus() is invoked", () => {
      expect(testFn).toHaveBeenCalled();
    });

    when("delete button is pressed", () => {
      deletCommentBtn = wrapper.findWhere(
        (node) => node.prop("testID") === "deleteAComment"
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
    let emojiReplyButton: ShallowWrapper;
    let instance: Customisableuserprofiles2;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
    });

    when("I try to render the component", () => {
      wrapper = shallow(<instance.renderShowsPostsRepliesModal />);
      instance.isPlatformiOS = () => {
        return true;
      };
      wrapper = shallow(<instance.renderShowsPostsRepliesModal />);
    });

    then("the component should render correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("emojiReply button is pressed", () => {
      for (let i = 0; i < instance.defaultEmojisForSelectionStrip.length; i++) {
        emojiReplyButton = wrapper.findWhere(
          (node) => node.prop("testID") === `emojiReply${i}`
        );
        emojiReplyButton.simulate("press");
      }
    });

    then("emojis are inserted", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("onChange is triggered on reply text input", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "replyInput")
        .simulate("changeText", "Abc");
    });

    then("reply is updated", () => {
      expect(wrapper.exists()).toBe(true);
    });

    when("close modal button is pressed", () => {
      wrapper
        .findWhere((node) => node.prop("testID") === "closeReplyPopupBtn")
        .simulate("press");

      wrapper
        .findWhere((node) => node.prop("testID") === "replyModal")
        .simulate("press");
    });

    then("modal is closed", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  test("Render replies", ({ given, when, then }) => {
    let wrapper: ShallowWrapper;
    let userProfileBasicBlock: ShallowWrapper;
    let instance: Customisableuserprofiles2;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
    });

    when("I try to render the component", () => {
      instance.setState({ commentsLoading: true })
      wrapper = shallow(<instance.renderShowsPostsReplies />);
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
    let instance: Customisableuserprofiles2;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderShowsPostsReplyItem
          item={{
            ...mockCommentItem.attributes.replies[0],
            profile_image: "",
            created_at: "",
          }}
        />
      );
      wrapper = shallow(
        <instance.renderShowsPostsReplyItem
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
    let instance: Customisableuserprofiles2;

    given("the component is rendered", () => {
      userProfileBasicBlock = shallow(
        <Customisableuserprofiles2 {...screenProps} />
      );
      instance = userProfileBasicBlock.instance() as Customisableuserprofiles2;
    });

    when("I try to render the component", () => {
      wrapper = shallow(
        <instance.renderHiddenShowsPostsReplyItem
          item={mockCommentItem.attributes.replies[0]}
        />
      );
      wrapper = shallow(
        <instance.renderHiddenShowsPostsReplyItem
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
    let instance: Customisableuserprofiles2;

    given("the component is rendered", () => {
      wrapper = shallow(<Customisableuserprofiles2 {...screenProps} />);
    });

    when("I try to render the component", () => {
      instance = wrapper.instance() as Customisableuserprofiles2;
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

});
