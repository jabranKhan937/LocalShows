import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import { Message } from "../../../../framework/src/Message";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";

import React from "react";
import Savesearch from "../../src/Savesearch";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "Savesearch",
};

const feature = loadFeature("./__tests__/features/savesearch-scenario.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to savesearch", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let renderListItem: ShallowWrapper;
    let renderSearchItem: ShallowWrapper;
    let search: ShallowWrapper;
    let instance: Savesearch;

    given("I am a User loading savesearch", () => {
      exampleBlockA = shallow(<Savesearch {...screenProps} />);
    });

    when("I navigate to the savesearch", () => {
      instance = exampleBlockA.instance() as Savesearch;
    });

    then("list items are rendered correctly", () => {
      renderListItem = shallow(
        <instance.renderItem
          item={{
            id: 1,
            full_name: "Test1",
            email: "Test1@gmail.com",
            phone_number: "9123456782",
            created_at: "2023-09-12T10:19:02.030Z",
            updated_at: "2023-09-12T10:19:02.030Z",
          }}
        />
      );
      let buttonComponent = renderListItem.findWhere(
        (node) => node.prop("testID") === "userSelectButton"
      );
      buttonComponent.simulate("press");

      expect(instance.state.showSearch).toBe(true)
    });

    then("Search renders correctly", () => {
      search = shallow(<instance.Search />);
      const textInputComponent = search.findWhere(
        (node) => node.prop("testID") === "searchInput"
      );
      textInputComponent.simulate("changeText", "hello");

      textInputComponent.simulate("submitEditing");

      textInputComponent.simulate("changeText", "hello");

      let buttonComponent = search.findWhere(
        (node) => node.prop("testID") === "submitButton"
      );
      buttonComponent.simulate("press");

      expect(instance.state.searchQuery).toBe("hello")
    });

    then("Search items are rendered correctly", () => {
      renderSearchItem = shallow(
        <instance.renderSearchItem
          item={{
            id: 1,
            name: "Test1",
            user_id: 1,
            created_at: "2023-09-12T10:19:02.030Z",
            updated_at: "2023-09-12T10:19:02.030Z",
          }}
        />
      );

      let deleteButton = renderSearchItem.findWhere(
        (node) => node.prop("testID") === "deleteSearchButton"
      );
      deleteButton.simulate("press");

      expect(instance.state.isLoading).toBe(true)
    });

    then("functions from controller work properly", () => {

      instance.sortByDate('2023-10-20', '2023-10-21');

      /* Get Users API */

      const apiMsgupdate = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      apiMsgupdate.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        apiMsgupdate.messageId
      );
      apiMsgupdate.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        users: [],
      });

      instance.getUsersId = apiMsgupdate.messageId;
      runEngine.sendMessage("Unit Test", apiMsgupdate);

      /* Save Search API */

      const saveSearchRequest = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      saveSearchRequest.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        saveSearchRequest.messageId
      );
      saveSearchRequest.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: {
            id: 4,
            name: "hello",
            user_id: 5,
            created_at: "2023-10-05T08:10:33.619Z",
            updated_at: "2023-10-05T08:10:33.619Z",
          },
          message: "data is created",
        }
      );

      instance.saveSearchId = saveSearchRequest.messageId;
      runEngine.sendMessage("Unit Test", saveSearchRequest);

      /* Delete Search API */

      const deleteSearchRequest = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      deleteSearchRequest.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        deleteSearchRequest.messageId
      );
      deleteSearchRequest.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: {
            id: 18,
            name: "Something",
            user_id: 1,
            created_at: "2023-10-06T06:11:59.406Z",
            updated_at: "2023-10-06T06:11:59.406Z",
          },
          message: "Data delete Successfully",
        }
      );

      instance.deleteSearchId = deleteSearchRequest.messageId;
      runEngine.sendMessage("Unit Test", deleteSearchRequest);

      /* Get Search API */

      const getSearchRequest = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );

      getSearchRequest.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        getSearchRequest.messageId
      );
      getSearchRequest.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: [
            {
              id: 6,
              name: "sss",
              user_id: 1,
              created_at: "2023-10-03T10:46:33.354Z",
              updated_at: "2023-10-03T10:46:33.354Z",
            },
          ],
          message: "Previous search data",
        }
      );

      instance.getSearchId = getSearchRequest.messageId;
      runEngine.sendMessage("Unit Test", getSearchRequest);

      expect(instance.state.searches[0].id).toBe(6)
    });
  });
});
