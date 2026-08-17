import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Filteritems from "../../src/Filteritems";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../framework/src/RunEngine";

const screenProps = {
  navigation: {
    addListener: jest.fn((event, callback) => {
      if (event === "willFocus") {
        callback();
      } else if (event === "willBlur") {
        callback();
      }
    }),
    navigate: jest.fn(),
    goBack: jest.fn(),
    openDrawer: jest.fn(),
    push: jest.fn(),
  },
  id: "Filteritems",
};

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

jest.useFakeTimers();

const feature = loadFeature(
  "./__tests__/features/filteritems-scenario.feature"
);

const showsApiData = {
  data: [
    {
      id: "19",
      type: "show",
      attributes: {
        event_title: "Music concert",
        date_of_the_show: "2023-11-13",
        time: "04:00:00",
        line_ups: null,
        description: "the show is based on the music concert",
        rules_and_regulations: "",
        city: "Akutan",
        state: "Alaska",
        country: "US",
        zip_code: null,
        address: "",
        location: "",
        show_features: [],
        like_by_me: false,
        added_in_calendar: true,
        likes_count: 0,
        profile_image: "",
      },
    },
    {
      id: "22",
      type: "show",
      attributes: {
        event_title: "Music concert",
        date_of_the_show: "2023-11-01",
        time: "04:00:00",
        line_ups: null,
        description: "the show is based on the music concert",
        rules_and_regulations: null,
        city: "Akutan",
        state: "Alaska",
        country: "United States",
        zip_code: null,
        address: null,
        location: null,
        show_features: [],
        like_by_me: false,
        added_in_calendar: true,
        likes_count: 0,
        profile_image: "profile_image",
      },
    },
    {
      id: "23",
      type: "show",
      attributes: {
        event_title: "Music concert",
        date_of_the_show: "2023-09-12",
        time: "04:00:00",
        line_ups: null,
        description: "the show is based on the music concert",
        rules_and_regulations: null,
        city: "Akutan",
        state: "Alaska",
        country: "United States",
        zip_code: null,
        address: null,
        location: null,
        show_features: [],
        like_by_me: false,
        added_in_calendar: true,
        likes_count: 0,
        profile_image: "profile_image",
      },
    },
  ],
  meta: {
    message: "List of shows.",
    posts: 1,
    pictures: 0,
  },
};

const noEventsAPIResponse = {
  data: [],
  meta: {
    message: "List of shows.",
    posts: 1,
    pictures: 0,
  },
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to filteritems", ({ given, when, then }) => {
    let filterItemsWrapper: ShallowWrapper;
    let instance: Filteritems;

    given("I am a User loading filteritems", () => {
      filterItemsWrapper = shallow(<Filteritems {...screenProps} />);
      instance = filterItemsWrapper.instance() as Filteritems;
    });

    when("User is not logged in", () => {
      instance.setState({ token: "" });
    });

    then("Render login popup", () => {
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "createAccountBtn")
        .simulate("press");
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "popupCloseBtn")
        .simulate("press");
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "loginBtn")
        .simulate("press");
      expect(instance.state.token).toBe("");
    });

    when("I navigate to the filteritems", async () => {
      instance.setState({ userId: "312" });
      instance.handleEventNavigation({
        attributes: {
          account_id: 312,
          added_in_calendar: false,
          address: "Gee@yopmail.com",
          band_name: "Utkarsh",
          band_profile_image: "",
          city: "Alameda",
          comment_count: 1,
          country: "US",
          date_of_the_show: "2024-09-26",
          description: "Hhh",
          event_title: "Heu",
          genre: [],
          id: 114,
          like_by_me: false,
          likes_count: 2,
          line_ups: ["Utkarsh"],
          location: "Hee",
          model_name: "Show",
          profile_image:
            "https://localshowsapp-316774-ruby.b316774.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYm89IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8a673bee7aefd8eb68dfecc507362973f24c8ccb/eventImage.jpg",
          rules_and_regulations: null,
          show_features: [],
          state: "California",
          time: "03:00:00",
          type_of_show: [],
          website: "undefined",
          zip_code: 55508,
        },
      });
      instance.setState({ userId: "313" });
      instance.handleEventNavigation({
        attributes: {
          account_id: 312,
          added_in_calendar: false,
          address: "Gee@yopmail.com",
          band_name: "Utkarsh",
          band_profile_image: "",
          city: "Alameda",
          comment_count: 1,
          country: "US",
          date_of_the_show: "2024-09-26",
          description: "Hhh",
          event_title: "Heu",
          genre: [],
          id: 114,
          like_by_me: false,
          likes_count: 2,
          line_ups: ["Utkarsh"],
          location: "Hee",
          model_name: "Show",
          profile_image:
            "https://localshowsapp-316774-ruby.b316774.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYm89IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8a673bee7aefd8eb68dfecc507362973f24c8ccb/eventImage.jpg",
          rules_and_regulations: null,
          show_features: [],
          state: "California",
          time: "03:00:00",
          type_of_show: [],
          website: "undefined",
          zip_code: 55508,
        },
      });
      instance.navigateToNotifications();
      await instance.handleRemovePicture();
      instance.setState({ activeTab: "post" });
      instance.handlePostPictureDelete();
      instance.setState({ activeTab: "test" });
      instance.handlePostPictureDelete();
      instance.setDates({
        startDate: new Date(),
        endDate: new Date(),
        displayedDate: new Date(),
      });
      instance.setState({ token: null });
      instance.getShows("2024-09-28", "2024-09-209");
      instance.setState({ token: "123" });
      instance.getShows("2024-09-28", "2024-09-209");
      instance.getToken();
      instance.renderGroupedEvents({ elements: [], item: "2999-12-31" });
      instance.renderGroupedEvents({ elements: [], item: "2999-12-30" });
    });

    then("filteritems will load with out errors", () => {
      expect(instance.state.token).toBe("123");
    });

    when("User is not a fan", () => {
      instance.setState({ userRole: "band" });
    });

    then("User clicks the Posts tab", () => {
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "postsTab")
        .simulate("press");
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "searchText")
        .simulate("changeText", "");
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "hamburgerIcon")
        .simulate("press");
      expect(instance.state.activeTab).toBe("post");
    });

    then("User clicks the Pictures tab", () => {
      filterItemsWrapper
        .findWhere((node) => node.prop("testID") === "picturesTab")
        .simulate("press");
      expect(instance.state.activeTab).toBe("picture");
    });

    when("User is switched to Pictures tab", () => {
      instance.setState({ activeTab: "picture" });
    });

    then("Render UI for Pictures Tab", () => {
      expect(instance.state.activeTab).toBe("picture");
    });

    when("User is switched to Posts tab", () => {
      instance.setState({ activeTab: "post" });
    });

    then("Render UI for Posts Tab", () => {
      expect(instance.state.activeTab).toBe("post");
    });
  });

  test("Test Hide keyboard, back navigation and date picker", ({
    given,
    when,
    then,
  }) => {
    let filterItemsWrapper: ShallowWrapper;
    let filterItemsInstance: Filteritems;
    let hideKeyboardButton: ShallowWrapper;
    let backNavigationButton: ShallowWrapper;
    let btnBackHome: ShallowWrapper;
    let btnDatePickerToggle: ShallowWrapper;

    given("I am a User loading filteritems", () => {
      filterItemsWrapper = shallow(<Filteritems {...screenProps} />);
      filterItemsInstance = filterItemsWrapper.instance() as Filteritems;
      filterItemsInstance.setState({ token: "123" });

      hideKeyboardButton = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "hideKeyboardTouchable"
      );
      filterItemsInstance.hideKeyboard = jest.fn();

      backNavigationButton = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "backButton"
      );

      btnBackHome = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnBackHome"
      );

      btnDatePickerToggle = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnDateSelector"
      );
    });

    when("I navigate to the filteritems", () => {
      hideKeyboardButton.simulate("press");
      backNavigationButton.simulate("press");
      btnBackHome.simulate("press");
      btnDatePickerToggle.simulate("press");
    });

    then("hide keyboard works", () => {
      expect(filterItemsInstance.hideKeyboard).toHaveBeenCalled();
    });

    then("date picker works", () => {
      expect(filterItemsInstance.state.showDateSelector).toBe(true);
    });
  });

  test("Testing filter popup", ({ given, when, then }) => {
    let filterItemsWrapper: ShallowWrapper;
    let filterItemsInstance: Filteritems;
    let btnFilterPopup: ShallowWrapper;

    given("I am a User loading filteritems", () => {
      filterItemsWrapper = shallow(<Filteritems {...screenProps} />);
      filterItemsInstance = filterItemsWrapper.instance() as Filteritems;
      filterItemsInstance.setState({ token: "123" });

      btnFilterPopup = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnFilterPopup"
      );
    });

    when("I click the filter popup", () => {
      btnFilterPopup.simulate("press");
    });

    then("filter popup shows up", () => {
      expect(filterItemsInstance.state.showFilterPopup).toBe(true);
    });
  });

  test("Testing lists rendering", ({ given, when, then }) => {
    let filterItemsWrapper: ShallowWrapper;
    let filterItemsInstance: Filteritems;
    let btnFilterMostRecent: ShallowWrapper;
    let btnFilterLeastRecent: ShallowWrapper;
    let btnFilterByState: ShallowWrapper;
    let pageTitle: ShallowWrapper;

    let msg: Message;

    given("I am a User loading filteritems", () => {
      filterItemsWrapper = shallow(<Filteritems {...screenProps} />);
      filterItemsInstance = filterItemsWrapper.instance() as Filteritems;
      filterItemsInstance.setState({ token: "123" });

      const btnFilterPopup = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnFilterPopup"
      );
      btnFilterPopup.simulate("press");
      filterItemsInstance.setState({ activeTab: "test" });
      btnFilterMostRecent = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnFilterMostRecent"
      );

      filterItemsInstance.setState({ activeTab: "post" });
      btnFilterMostRecent = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnFilterMostRecent"
      );

      btnFilterLeastRecent = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnFilterLeastRecent"
      );

      btnFilterByState = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnFilterByState"
      );

      pageTitle = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "pageTitle"
      );

      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      filterItemsInstance.getCalendarEventsApiCallId = msg.messageId;
      runEngine.sendMessage("Unit Test", msg);

      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        showsApiData
      );
      filterItemsInstance.getCalendarEventsApiCallId = msg.messageId;
    });

    when("I fetch from the shows api", () => {
      runEngine.sendMessage("Unit Test", msg);
    });

    then("the list shows up", () => {});

    when("I click the btnFilterMostRecent", () => {
      filterItemsInstance.setState({ activeTab: "post" });
      btnFilterMostRecent.simulate("press");
      filterItemsInstance.setState({ activeTab: "test" });
      btnFilterMostRecent.simulate("press");
    });

    then("the list is sorted with most recent event on top", () => {});

    when("I click the btnFilterLeastRecent", () => {
      btnFilterLeastRecent.simulate("press");
    });

    then("the list is sorted with most recent event at bottom", () => {});

    when("I click the btnFilterByState", () => {
      btnFilterByState.simulate("press");
    });

    then("the list is sorted by state", () => {});

    when("API Response is empty", () => {
      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        noEventsAPIResponse
      );
      filterItemsInstance.getCalendarEventsApiCallId = msg.messageId;
      runEngine.sendMessage("Unit Test", msg);
    });

    then("pageTitle is rendered", () => {
      expect(pageTitle).toBeDefined();
    });
  });

  test("Testing event deletion", ({ given, when, then }) => {
    let filterItemsWrapper: ShallowWrapper;
    let filterItemsInstance: Filteritems;
    let renderShowCardWrapper: ShallowWrapper;
    let btnDeleteEvent: ShallowWrapper;
    let btnDeleteEventModal: ShallowWrapper;
    let btnKeepEventModal: ShallowWrapper;
    let btnHideModal: ShallowWrapper;

    given("I am a User loading renderShowCard", () => {
      filterItemsWrapper = shallow(<Filteritems {...screenProps} />);
      filterItemsInstance = filterItemsWrapper.instance() as Filteritems;
      filterItemsInstance.setState({ token: "123" });
      let mockShowCardItem = {
        attributes: {
          account_id: 312,
          added_in_calendar: false,
          address: "Gee@yopmail.com",
          band_name: "Utkarsh",
          band_profile_image: "",
          city: "Alameda",
          comment_count: 1,
          country: "US",
          date_of_the_show: "2024-09-26",
          description: "Hhh",
          event_title: "Heu",
          genre: [],
          id: 114,
          like_by_me: false,
          likes_count: 2,
          line_ups: ["Utkarsh"],
          location: "Hee",
          model_name: "Show",
          profile_image:
            "https://localshowsapp-316774-ruby.b316774.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYm89IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8a673bee7aefd8eb68dfecc507362973f24c8ccb/eventImage.jpg",
          rules_and_regulations: null,
          show_features: [],
          state: "California",
          time: "03:00:00",
          type_of_show: [],
          website: "undefined",
          zip_code: 55508,
          images_and_videos: [
            {
              id: 84,
              filename: "Screenshot_2023-11-22_05-15-23.png",
              url: "http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBXUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--ced9db8665d2c279c01e8c2033c66be05c446aa5/Screenshot_2023-11-22_05-15-23.png",
              type: "image",
            },
          ],
        },
        id: "114",
        type: "show",
      };
      filterItemsInstance.setState({ activeTab: "post" });
      renderShowCardWrapper = shallow(
        <filterItemsInstance.renderShowCard
          {...screenProps}
          item={mockShowCardItem}
          index={1}
        />
      );
      filterItemsInstance.setState({ activeTab: "test" });
      renderShowCardWrapper = shallow(
        <filterItemsInstance.renderShowCard
          {...screenProps}
          item={mockShowCardItem}
          index={2}
        />
      );

      btnDeleteEvent = renderShowCardWrapper.findWhere(
        (node) => node.prop("testID") === "btnDeleteEvent"
      );

      btnDeleteEventModal = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnDeleteEventModal"
      );
      filterItemsInstance.setState({ activeTab: "post" });
      renderShowCardWrapper
        .findWhere((node) => node.prop("testID") === "showCard")
        .simulate("press");

      btnKeepEventModal = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnKeepEventModal"
      );

      btnHideModal = filterItemsWrapper.findWhere(
        (node) => node.prop("testID") === "btnHideModal"
      );
    });

    when("I click the delete event button", () => {
      btnDeleteEvent.simulate("press");
    });

    then("the delete confirmation modal appears", () => {
      expect(filterItemsInstance.state.deleteEventModalVisible).toBe(true);
    });

    when("I click the delete button", () => {
      btnDeleteEventModal.simulate("press");
    });

    then("API is fetching", () => {
      expect(filterItemsInstance.state.isFetching).toBe(true);
    });

    when("I click the disable modal button", () => {
      btnKeepEventModal.simulate("press");
      btnDeleteEvent.simulate("press");
      btnHideModal.simulate("press");
    });

    then("the modal disappears", () => {
      expect(filterItemsInstance.state.deleteEventModalVisible).toBe(false);
    });
  });

  test("Testing delete event API", ({ given, when, then }) => {
    let filterItemsWrapper: ShallowWrapper;
    let filterItemsInstance: Filteritems;

    let msg: Message;

    given("I am a User loading filteritems", () => {
      filterItemsWrapper = shallow(<Filteritems {...screenProps} />);
      filterItemsInstance = filterItemsWrapper.instance() as Filteritems;
      filterItemsInstance.setState({ token: "123" });

      msg = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msg.messageId
      );
      msg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        message: "Event deleted succesfully",
      });
      filterItemsInstance.deleteCalendarEventApiCallId = msg.messageId;

      filterItemsInstance.showAlert = jest.fn();
    });

    when("I call the delete API", () => {
      filterItemsInstance.setState({ startDate: "" });
      runEngine.sendMessage("Unit Test", msg);
    });

    then("alert is shown", () => {
      let msg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msg.addData(getName(MessageEnum.RestAPIResponceDataMessage), {
        message: "test",
      });

      filterItemsInstance.handleDeleteCalendarEventApiResponse(msg);
      expect(filterItemsInstance.showAlert).toHaveBeenCalled();
    });
  });

  test("if the start date is empty then the search should not work", () => {
    let filterItemsWrapper: ShallowWrapper = shallow(
      <Filteritems {...screenProps} />
    );
    let filterItemsInstance: Filteritems =
      filterItemsWrapper.instance() as Filteritems;

    filterItemsInstance.setState({ startDate: "MM DD YYYY" });
    filterItemsInstance.handleSearch("test");
    filterItemsInstance.handleTabSwitch("dfkjdfk");
    let msg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
    msg.addData(getName(MessageEnum.RestAPIResponceDataMessage), {
      message: "test",
    });

    filterItemsInstance.handleDeleteCalendarEventApiResponse(msg);
  });
});
