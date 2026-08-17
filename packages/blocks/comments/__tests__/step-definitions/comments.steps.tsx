import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Comments from "../../src/Comments";
import CreateComment from "../../src/CreateComment";

const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Comments"
  }

const feature = loadFeature('./__tests__/features/comments-scenario.feature');

defineFeature(feature, (test) => {
    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Comments', ({ given, when, then }) => {
        let commentsBlock: ShallowWrapper;
        let instance: Comments;

        given('I am a User loading Comments', () => {
          commentsBlock = shallow(<Comments {...screenProps}/>)
         });

        when('I navigate to the Comments', () => {
             instance = commentsBlock.instance() as Comments;
        });

        then('Comments will load with out errors', () => {
            
          expect(commentsBlock).toBeTruthy()

          const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
          tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
          runEngine.sendMessage("Unit Test", tokenMsg);
        
          instance = commentsBlock.instance() as Comments;
          const msgCommentsAPI = new Message(
            getName(MessageEnum.RestAPIResponceMessage)
          );
          msgCommentsAPI.addData(
            getName(MessageEnum.RestAPIResponceDataMessage),
            msgCommentsAPI.messageId
          );
          msgCommentsAPI.addData(
            getName(MessageEnum.RestAPIResponceSuccessMessage),
            {
              "data": [
                  {
                      "id": "1",
                      "type": "comment",
                      "attributes": {
                          "id": 1,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "{\"text\"=>\"Comment text\"}",
                          "created_at": "2022-01-31T17:36:18.824Z",
                          "updated_at": "2022-01-31T17:36:18.824Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "2",
                      "type": "comment",
                      "attributes": {
                          "id": 2,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "{\"text\"=>\"I Love this stuff\"}",
                          "created_at": "2022-01-31T18:36:20.239Z",
                          "updated_at": "2022-01-31T18:36:20.239Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "3",
                      "type": "comment",
                      "attributes": {
                          "id": 3,
                          "account_id": 1,
                          "post_id": 2,
                          "comment": "{\"text\"=>\"I Love this stuff\"}",
                          "created_at": "2022-01-31T18:37:40.214Z",
                          "updated_at": "2022-01-31T18:37:40.214Z",
                          "post": {
                              "id": 2,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T18:37:22.252Z",
                              "updated_at": "2022-01-31T18:37:22.252Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "4",
                      "type": "comment",
                      "attributes": {
                          "id": 4,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "{\"text\"=>\"I Love this stuff\"}",
                          "created_at": "2022-01-31T20:11:55.206Z",
                          "updated_at": "2022-01-31T20:11:55.206Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "5",
                      "type": "comment",
                      "attributes": {
                          "id": 5,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "333",
                          "created_at": "2022-01-31T20:13:01.807Z",
                          "updated_at": "2022-01-31T20:13:01.807Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "6",
                      "type": "comment",
                      "attributes": {
                          "id": 6,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "My comment is the best....\n",
                          "created_at": "2022-01-31T20:17:25.009Z",
                          "updated_at": "2022-01-31T20:17:25.009Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "7",
                      "type": "comment",
                      "attributes": {
                          "id": 7,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "hi",
                          "created_at": "2022-01-31T20:31:13.483Z",
                          "updated_at": "2022-01-31T20:31:13.483Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "8",
                      "type": "comment",
                      "attributes": {
                          "id": 8,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "Reply to ite\n",
                          "created_at": "2022-01-31T20:31:57.894Z",
                          "updated_at": "2022-01-31T20:31:57.894Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  },
                  {
                      "id": "9",
                      "type": "comment",
                      "attributes": {
                          "id": 9,
                          "account_id": 1,
                          "post_id": 1,
                          "comment": "ABC",
                          "created_at": "2022-01-31T20:33:49.977Z",
                          "updated_at": "2022-01-31T20:33:49.977Z",
                          "post": {
                              "id": 1,
                              "name": "22",
                              "description": "333",
                              "category_id": 6,
                              "created_at": "2022-01-31T14:57:01.045Z",
                              "updated_at": "2022-01-31T14:57:01.045Z",
                              "body": "test body",
                              "location": "test location",
                              "account_id": 1
                          },
                          "account": {
                              "id": 1,
                              "first_name": "test",
                              "last_name": "account",
                              "full_phone_number": "",
                              "country_code": null,
                              "phone_number": null,
                              "email": "tester@me.com",
                              "activated": true,
                              "device_id": null,
                              "unique_auth_id": null,
                              "password_digest": "$2a$12$3fjk1H3xaJi7iT91CrQtmOrrD4QwYdXzIKY/8jWxR58wdt6WykOXW",
                              "created_at": "2022-01-11T15:22:38.266Z",
                              "updated_at": "2022-01-11T15:22:38.266Z",
                              "user_name": null,
                              "role_id": null
                          },
                          "liked": null
                      }
                  }
              ],
              "meta": {
                  "message": "List of comments created by user."
              }
          }
          );
          instance.commentApiCallId = msgCommentsAPI.messageId;
          runEngine.sendMessage("Unit Test", msgCommentsAPI);

          instance.commentApiCallId = "";
          instance.apiCommentItemCallId = msgCommentsAPI.messageId;
          runEngine.sendMessage("Unit Test", msgCommentsAPI);

          instance.apiCommentItemCallId = "";
          instance.likeCommentId = msgCommentsAPI.messageId;
          runEngine.sendMessage("Unit Test", msgCommentsAPI);

          
          // instance.apiCommentItemCallId = msgValidationAPI.messageId;

          instance.likeChildComments(1);
          instance.getCommentText("{\"text\":\"Message\"}");
          instance.getCommentText("Message");

          expect(commentsBlock).toBeTruthy();

        });

        then('I can leave the screen with out errors', () => {
          let buttonComponent = commentsBlock.findWhere((node) => node.prop('testID') === 'btnCommentTxt');
          buttonComponent.simulate('press')
          instance.componentWillUnmount()
          expect(commentsBlock).toBeTruthy()
        });
    });

    test("User navigates to CreateComment", ({ given, when, then }) => {
      let commentsBlock: ShallowWrapper;
      let instance: CreateComment;
  
      given("I am a User loading CreateComment", () => {
        commentsBlock = shallow(<CreateComment {...screenProps} />);
      });
  
      when("I navigate to the CreateComment", () => {
        instance = commentsBlock.instance() as CreateComment; 
    
      });
  
      then("CreateComment will load with out errors", () => {
        expect(commentsBlock).toBeTruthy();
        expect(commentsBlock).toMatchSnapshot();
        
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
            data: []
          }
        );
        instance.commentApiCallId = msgValidationAPI.messageId;
        runEngine.sendMessage("Unit Test", msgValidationAPI);
  
        const msgError = new Message(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        msgError.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgValidationAPI.messageId
        );
        msgError.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {
          data: []
        });
        instance.commentApiCallId = msgValidationAPI.messageId;
        runEngine.sendMessage("Unit Test", msgValidationAPI);
      });

      then("I can leave the screen with out errors", () => {
        instance.componentWillUnmount();
        expect(commentsBlock).toBeTruthy();
      });
    });
  
});
