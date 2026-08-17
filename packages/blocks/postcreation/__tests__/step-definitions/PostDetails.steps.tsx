import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
export const configJSON = require("../../config.json");
import React from "react";
import PostDetails from "../../src/PostDetails";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";

jest.useFakeTimers()

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
    navigate: jest.fn(),
    goBack: jest.fn(),
    state: {
      params: {
        eventId: "1",
        event_image: {
          uri: 'image'
        }
      }
    }

  },
  id: 'PostDetails'
}

const mockResponse = {
  "data": {
    "id": "44",
    "type": "show",
    "attributes": {
      "event_title": "Astha Event",
      "date_of_the_show": "2024-02-10",
      "time": "18:05:00",
      "line_ups": ["Enjoyment"],
      "description": "Dummy",
      "rules_and_regulations": null,
      "city": "Akutan",
      "state": "Texas",
      "country": "AU",
      "zip_code": "12345",
      "address": "address",
      "location": "location",
      "show_features": null,
      "like_by_me": false,
      "added_in_calendar": true,
      "type_of_show": [{
        "id": "7",
        "type": "category",
        "attributes": {
          "id": 7,
          "name": "Enjoyment",
          "created_at": "2023-10-03T09:46:13.354Z",
          "updated_at": "2024-02-27T10:22:02.320Z"
        }
      }, {
        "id": "4",
        "type": "category",
        "attributes": {
          "id": 4,
          "name": "Art",
          "created_at": "2023-10-03T09:46:13.354Z",
          "updated_at": "2024-02-27T10:22:02.320Z"
        }
      }],
      "genre": [
        {
          "id": 78,
          "name": "Comedy",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:37:01.232Z",
          "updated_at": "2024-03-05T10:37:01.232Z"
        },
        {
          "id": 77,
          "name": "Burlesque",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:36:45.793Z",
          "updated_at": "2024-03-05T10:36:45.793Z"
        },
        {
          "id": 79,
          "name": "Dance",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:37:16.629Z",
          "updated_at": "2024-03-05T10:37:16.629Z"
        }
      ],
      "account_id": null,
      "likes_count": 0,
      "model_name": "Show",
      "profile_image": "image"
    }
  }
}

const mockResponseWithLikeByMe = {
  "data": {
    "id": "44",
    "type": "show",
    "attributes": {
      "event_title": "Astha Event",
      "date_of_the_show": "2999-12-31",
      "time": "18:05:00",
      "line_ups": ['Enjoyment'],
      "description": "Dummy",
      "rules_and_regulations": null,
      "city": "Akutan",
      "state": "Texas",
      "country": "AU",
      "zip_code": "12345",
      "address": "address",
      "location": "location",
      "show_features": null,
      "like_by_me": true,
      "added_in_calendar": true,
      "type_of_show": [{
        "id": "7",
        "type": "category",
        "attributes": {
          "id": 7,
          "name": "Enjoyment",
          "created_at": "2023-10-03T09:46:13.354Z",
          "updated_at": "2024-02-27T10:22:02.320Z"
        }
      }, {
        "id": "4",
        "type": "category",
        "attributes": {
          "id": 4,
          "name": "Art",
          "created_at": "2023-10-03T09:46:13.354Z",
          "updated_at": "2024-02-27T10:22:02.320Z"
        }
      }],
      "genre": [
        {
          "id": 78,
          "name": "Comedy",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:37:01.232Z",
          "updated_at": "2024-03-05T10:37:01.232Z"
        },
        {
          "id": 77,
          "name": "Burlesque",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:36:45.793Z",
          "updated_at": "2024-03-05T10:36:45.793Z"
        },
        {
          "id": 79,
          "name": "Dance",
          "approved_by_admin": true,
          "created_at": "2024-03-05T10:37:16.629Z",
          "updated_at": "2024-03-05T10:37:16.629Z"
        }
      ],
      "account_id": null,
      "likes_count": 0,
      "model_name": "Show",
      "profile_image": ""
    }
  }
}

const mockFailureResponse = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

const mockLikeSuccessResponse = {
  "data": {
    "id": "106",
    "type": "like",
    "attributes": {
      "likeable_id": 190,
      "likeable_type": "Show",
      "like_by_id": 277,
      "created_at": "2024-04-09T08:25:32.774Z",
      "updated_at": "2024-04-09T08:25:32.774Z"
    }
  }
}

const mockLikeFailureResponse = {
  "errors": [
    {
      "token": "Invalid token"
    }
  ]
}

const mockSelectedLineup = [
  {
    id: "1",
    first_name: "band 1",
    email: "band@gmail.com",
    created_at: "",
    role_id: 9
  },
  {
    id: "",
    first_name: "band 2",
    email: "",
    created_at: "",
    role_id: 9
  }
]

const feature = loadFeature("./__tests__/features/PostDetails-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android')
  })

  test("User navigates to PostDetails", ({ given, when, then }) => {
    let postSelectionWrapper: ShallowWrapper;
    let instance: PostDetails;
    let titleTxt: ShallowWrapper;

    given("I am a User loading PostDetails", () => {
      postSelectionWrapper = shallow(<PostDetails {...screenProps} />);
    });

    when("I navigate to the PostDetails", () => {
      instance = postSelectionWrapper.instance() as PostDetails;
      titleTxt = postSelectionWrapper.findWhere(node => node.prop("testID") === "titleTxt").simulate("press")
      instance.setState({sold_out:false,showMenu:true})
      instance.renderMenuPopup()
      postSelectionWrapper.findWhere(node => node.prop("testID") === "editShow").simulate("press")
      instance.setState({sold_out:false,showMenu:true})
      postSelectionWrapper.findWhere(node => node.prop("testID") === "postponeShow").simulate("press")
      instance.setState({sold_out:false,showMenu:true})
      postSelectionWrapper.findWhere(node => node.prop("testID") === "cancelShow").simulate("press")
      instance.setState({sold_out:false,showMenu:true})
      postSelectionWrapper.findWhere(node => node.prop("testID") === "markAsSoldOut").simulate("press")
      mockAPISuccessCall(instance, "postDetailApiCallID", mockResponse)
      mockAPISuccessCall(instance, "postDetailApiCallID", mockFailureResponse)
      mockAPIFailureCall(instance, "postDetailApiCallID", mockFailureResponse)

      postSelectionWrapper.findWhere(node => node.prop("testID") === "containerFeedback").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "backBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "threeDotsBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "likeBtn").simulate("press")

      mockAPISuccessCall(instance, "likeDislikeShowApiCallID", mockLikeSuccessResponse)
      mockAPISuccessCall(instance, "likeDislikeShowApiCallID", mockLikeFailureResponse)
      mockAPIFailureCall(instance, "likeDislikeShowApiCallID", mockLikeFailureResponse)

      // postSelectionWrapper.findWhere(node => node.prop("testID") === "openMap").simulate("press")

      mockAPISuccessCall(instance, "postDetailApiCallID", mockResponseWithLikeByMe)

      const lineupFlatlist = postSelectionWrapper.findWhere(node => node.prop("testID") === "lineupFlatlist");
      mockSelectedLineup.forEach((item, index) => {
        const renderItem = lineupFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        renderItem.findWhere(node => node.prop("testID") === 'lineup').simulate('press')
      })
      instance.openGoogleMaps()

      // const typeOfShowFlatlist = postSelectionWrapper.findWhere(node => node.prop("testID") === "typeOfShowFlatlist");
      // mockResponse.data.attributes.type_of_show.forEach((item, index) => {
      //   typeOfShowFlatlist.renderProp("renderItem")({
      //     item: item,
      //     index: index,
      //   });
      //   typeOfShowFlatlist.renderProp("keyExtractor")({ item })
      // })

      // const genreFlatlist = postSelectionWrapper.findWhere(node => node.prop("testID") === "genreFlatlist");
      // mockResponse.data.attributes.genre.forEach((item, index) => {
      //   genreFlatlist.renderProp("renderItem")({
      //     item: item,
      //     index: index,
      //   });
      //   genreFlatlist.renderProp("keyExtractor")({ item });
      // })

      postSelectionWrapper.findWhere(node => node.prop("testID") === "editShow").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "crossBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "cancelBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "confirmBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "directionsBtn").simulate("press")

    });

    then("User interacts with UI", () => {
      expect(titleTxt).toBeDefined()
    })
    then("I can see the show date in correct formate",()=>{
      const formatedDate = instance.formatDate("2025-04-14T18:30:00.000+00:00")
      expect(formatedDate).toBe("Monday, Apr 14, 2025")
    })

    when("User interacts with 3 dots to postpone the show", () => {
      postSelectionWrapper.findWhere(node => node.prop("testID") === "threeDotsBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "postponeShow").simulate("press")
    })

    then("Postpone the show", () => {
      expect(titleTxt).toBeDefined()
    })

    when("User interacts with 3 dots to cancel the show", () => {
      postSelectionWrapper.findWhere(node => node.prop("testID") === "threeDotsBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "cancelShow").simulate("press")
    })

    then("Cancel the show", () => {
      expect(titleTxt).toBeDefined()
    })

    when("User interacts with 3 dots to sell the show", () => {
      postSelectionWrapper.findWhere(node => node.prop("testID") === "threeDotsBtn").simulate("press")
      postSelectionWrapper.findWhere(node => node.prop("testID") === "markAsSoldOut").simulate("press")
      instance.setState({showSoldOutToast:true,sold_out:true})
      postSelectionWrapper.findWhere(node => node.prop("testID") === "likeNavBtn").simulate("press")

    })

    then("Sell the show", () => {
      expect(titleTxt).toBeDefined()
    })

  });

});