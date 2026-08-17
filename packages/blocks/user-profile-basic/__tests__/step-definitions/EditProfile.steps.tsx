import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import EditProfile from "../../src/EditProfile";

import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('userRole')),
  get: jest.fn().mockImplementation(() => Promise.resolve('fan'))
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

const mockResponse = {
  "data": {
    "id": "185",
    "type": "account",
    "attributes": {
      "activated": true,
      "country_code": 1,
      "country_code_name":'US',
      "email": "astha.gupta@metafic.co",
      "first_name": "Astha",
      "full_phone_number": "11234567890",
      "phone_number": null,
      "type": null,
      "created_at": "2023-12-21T14:31:20.312Z",
      "updated_at": "2023-12-21T14:31:33.203Z",
      "device_id": null,
      "unique_auth_id": "KsXDPCcTJhF4xmu8ia4iGQtt",
      "country": "United States",
      "state": "WA",
      "city": "Airway Heights",
      "profile_image": "",
      "followers": 0,
      "following": 0,
      "category_subcat": [],
      "band_artists": null
    }
  }
}

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
    goBack: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    getParam: jest.fn(),
    state: {
      params: {
        editMode: true,
        profileData: mockResponse,
      }
    }
  },
  id: "EditProfile"
};

const mockErrorResponse = {
  "errors": []
}

const mockCountryCodeList = {
  "data": [
    {
      "id": "CN",
      "type": "country_code_and_flag",
      "attributes": {
        "name": "China",
        "country_code": "86",
        "map_url": "https://flagcdn.com/64x48/cn.png"
      }
    },
    {
      "id": "TW",
      "type": "country_code_and_flag",
      "attributes": {
        "name": "Taiwan, Province of China",
        "country_code": "886",
        "map_url": "https://flagcdn.com/64x48/tw.png"
      }
    }
  ]
}

const feature = loadFeature(
  "./__tests__/features/EditProfile-scenario.feature"
);

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
}));

jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  request: jest.fn(),
  PERMISSIONS: {
    CAMERA: 'mock_camera_permission',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    NEVER_ASK_AGAIN: 'never_ask_again',
  },
}));

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android')
  })

  test("User navigates to EditProfile", ({ given, when, then }) => {
    let editProfile: ShallowWrapper;
    let testLabel: ShallowWrapper;
    let instance: EditProfile;

    given("The screen loads up", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      editProfile = shallow(<EditProfile {...screenProps} />);
    });

    when("User visits the screen", () => {
      instance = editProfile.instance() as EditProfile;
      testLabel = editProfile.findWhere(
        node => node.prop("testID") === "testLabel"
      );
      editProfile.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "profilePicButton").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "btnCountryCodeSelectAndroid").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "btnAccept").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "cancelButton").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "cameraOption").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "galleryOption").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "cancelOption").simulate("press")

      mockAPISuccessCall(instance, "getCountryCodeListID", mockCountryCodeList)
      mockAPISuccessCall(instance, "getCountryCodeListID", mockErrorResponse)
      mockAPIFailureCall(instance, "getCountryCodeListID", mockErrorResponse)

      mockAPISuccessCall(instance, "getCountriesListAPICallID", mockCountryList)
      mockAPISuccessCall(instance, "getCountriesListAPICallID", mockErrorResponse)
      mockAPIFailureCall(instance, "getCountriesListAPICallID", mockErrorResponse)

      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockErrorResponse)
      mockAPIFailureCall(instance, "userDetailGetApiCallId", mockErrorResponse)

      mockAPISuccessCall(instance, "getStatesApiCallId", {
        state: {
          "AK": "Alaska",
          "AL": "Alabama",
        }
      })
      mockAPIFailureCall(instance, "getStatesApiCallId", mockErrorResponse)
    });

    then("User navigates back", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("Name is empty", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw name error", () => {
      expect(instance.state.nameError).toBe("Name cannot be blank");
    });

    when("Email is empty", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email error", () => {
      expect(instance.state.emailError).toBe("Email cannot be blank");
    });

    when("Email is invalid", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email invalid error", () => {
      expect(instance.state.emailError).toBe("Email not valid.");
    });

    when("Email is not valid", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email invalid error", () => {
      expect(instance.state.emailError).toBe("Email not valid.");
    });

    when("Email is invalid", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "@gmail.com")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email invalid error", () => {
      expect(instance.state.emailError).toBe("Email not valid.");
    });

    when("Phone number is empty", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")

    });

    then("Throw phone number error", () => {
      expect(instance.state.phoneError).toBe("Cell Phone cannot be blank");
    });

    when("Phone number has characters", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "a")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")

    });

    then("Throw phone number error", () => {
      expect(instance.state.phoneError).toBe("Cell Phone cannot be blank");
    });

    when("State picker is clicked", () => {
      editProfile
        .findWhere(node => node.prop("testID") === "countryAndroidPicker")
        .simulate("press");

      editProfile
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("press");

      mockAPISuccessCall(instance, "getStatesApiCallId",
        {
          state: {
            AK: "Alaska",
            AL: "Alabama"
          }
        }
      )

      mockAPISuccessCall(instance, "getStatesApiCallId", { errors: [] })
      mockAPIFailureCall(instance, "getStatesApiCallId", { errors: [] })

      editProfile
        .findWhere(node => node.prop("testID") === "countryAndroidPicker")
        .simulate("ValueChange", "United States");

        editProfile
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "AK");

      editProfile
        .findWhere(node => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("State value is changed", () => {
      expect(instance.state.selectedState).toBe("AK");
    });

    when("City picker is clicked", () => {
      editProfile
        .findWhere(node => node.prop("testID") === "cityPickerTag")
        .simulate("press");

      mockAPISuccessCall(instance, "getCityApiCallId",
        {
          city: ["Akutan", "Alakanuk"]
        }
      )

      mockAPISuccessCall(instance, "getCityApiCallId", { errors: [] })
      mockAPIFailureCall(instance, "getCityApiCallId", { errors: [] })

      editProfile
        .findWhere(node => node.prop("testID") === "cityPickerTag")
        .simulate("ValueChange", "Akutan");

      editProfile
        .findWhere(node => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("City value is changed", () => {
      expect(instance.state.selectedState).toBe("AK");
    });

    when("Name has digits and characters", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "1astha1")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    })

    then("render UI with invalid name", () => {
      expect(instance.state.nameError).toBe("Name can only contain alphabets")
    })

    when("Phone number has alphabets and characters", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "1")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    })

    then("render UI with invalid cell phone", () => {
      expect(instance.state.phoneError).toBe("Cell Phone number invalid")
    })

    when("Form is filled", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "1234567890")
      editProfile
        .findWhere(node => node.prop("testID") === "countryAndroidPicker")
        .simulate("ValueChange", "US");
      editProfile
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "AK");
      editProfile
        .findWhere(node => node.prop("testID") === "cityPickerTag")
        .simulate("ValueChange", "Akutan");
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
      mockAPISuccessCall(instance, "editProfilePatchApiCallID", mockResponse)
      mockAPISuccessCall(instance, "editProfilePatchApiCallID", { "errors": [{ "token": "Invalid token" }] })
      mockAPIFailureCall(instance, "editProfilePatchApiCallID", [])
    })

    then("Save the profile", () => {
      expect(instance.state.firstName).toBe("Name");
    })
  });

  test("Pickers in iOS", ({ given, when, then }) => {
    let profileWrapper: ShallowWrapper;
    let instance: EditProfile;
    let stateSelectPickerComponent: ShallowWrapper;
    let citySelectPickerComponent: ShallowWrapper;
    let btnStateSelect: ShallowWrapper;
    let btnCitySelect: ShallowWrapper;

    given("User attempting to EditProfile", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'ios',
        select: jest.fn(),
      }))

      jest.doMock("react-native-image-picker", () => ({
        launchCamera: jest.fn().mockImplementation(() => Promise.resolve([])),
        launchImageLibrary: jest.fn().mockImplementation(() => Promise.resolve([]))
      }));

      profileWrapper = shallow(
        <EditProfile {...screenProps} />
      );

      instance = profileWrapper.instance() as EditProfile;

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "btnCountrySelectiOS"
      ).simulate("press")

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "countryPickerModal"
      ).simulate("ValueChange", "United States")

      btnStateSelect = profileWrapper.findWhere(
        (node) => node.prop("testID") === "btnStateSelect"
      );

      stateSelectPickerComponent = profileWrapper.findWhere(
        (node) => node.prop("testID") === "statePickerModal"
      )

      btnCitySelect = profileWrapper.findWhere(
        (node) => node.prop("testID") === "btnCitySelect"
      );

      citySelectPickerComponent = profileWrapper.findWhere(
        (node) => node.prop("testID") === "cityPickerModal"
      );
      profileWrapper.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "1234567890")
      profileWrapper.findWhere(node => node.prop("testID") === "countryCodePickerModal").simulate("valueChange", mockCountryCodeList.data[0])

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "hideCountryCodeModal"
      ).simulate("press")

      profileWrapper.findWhere(node => node.prop("testID") === "btnCountryCodeSelect").simulate("press")
      
    });

    when("User click the state picker", () => {
      profileWrapper.findWhere(node => node.prop("testID") === "profilePicButton").simulate("press")
      profileWrapper.findWhere(node => node.prop("testID") === "cameraOption").simulate("press")
      profileWrapper.findWhere(node => node.prop("testID") === "galleryOption").simulate("press")
      profileWrapper.findWhere(node => node.prop("testID") === "cancelOption").simulate("press")
      btnStateSelect.simulate("press");

      mockAPISuccessCall(instance, "getStatesApiCallId", {
        state: {
          "AK": "Alaska",
          "AL": "Alabama",
        }
      })

      stateSelectPickerComponent.simulate("ValueChange", "AK");

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "hideStateModal"
      ).simulate("press")
    });

    then("User can select the state", () => {
      expect(instance.state.selectedState).toBe("AK");
    });

    when("User click the city picker", () => {
      btnCitySelect.simulate("press");

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "countryPickerModal"
      ).simulate("ValueChange", "US")

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "hideCountryModal"
      ).simulate("press")

      mockAPISuccessCall(instance, "getStatesApiCallId", {
        city: [
          "Akutan",
          "Alakanuk"
        ]
      })

      citySelectPickerComponent.simulate("ValueChange", "Akutan");

      profileWrapper.findWhere(
        (node) => node.prop("testID") === "hideCityModal"
      ).simulate("press")
    });

    then("User can select the city", () => {
      expect(instance.state.selectedCity).toBe('Akutan');
    });
  });

  test("User navigates to Edit Profile", ({ given, when, then }) => {
    let editProfile: ShallowWrapper;
    let testLabel: ShallowWrapper;
    let instance: EditProfile;

    given("The screen loads up", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      editProfile = shallow(<EditProfile {...screenProps} />);
    });

    when("User visits the screen", () => {
      instance = editProfile.instance() as EditProfile;
      testLabel = editProfile.findWhere(
        node => node.prop("testID") === "testLabel"
      );
      editProfile.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "profilePicButton").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "btnCountryCodeSelectAndroid").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "btnAccept").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "cancelButton").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "cameraOption").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "galleryOption").simulate("press")
      editProfile.findWhere(node => node.prop("testID") === "cancelOption").simulate("press")

      mockAPISuccessCall(instance, "userDetailGetApiCallId", mockResponse)
      mockAPISuccessCall(instance, "userDetailGetApiCallId", [])
      mockAPIFailureCall(instance, "userDetailGetApiCallId", [])

      mockAPISuccessCall(instance, "getStatesApiCallId", {
        state: {
          "AK": "Alaska",
          "AL": "Alabama",
        }
      })
      mockAPIFailureCall(instance, "getStatesApiCallId", [])
    });

    then("User navigates back", () => {
      expect(screenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("Name is empty", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw name error", () => {
      expect(instance.state.nameError).toBe("Name cannot be blank");
    });

    when("Email is empty", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email error", () => {
      expect(instance.state.emailError).toBe("Email cannot be blank");
    });

    when("Email is invalid", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email invalid error", () => {
      expect(instance.state.emailError).toBe("Email not valid.");
    });

    when("Email is not valid", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email invalid error", () => {
      expect(instance.state.emailError).toBe("Email not valid.");
    });

    when("Email is invalid", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "@gmail.com")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    });

    then("Throw email invalid error", () => {
      expect(instance.state.emailError).toBe("Email not valid.");
    });

    when("Phone number is empty", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")

    });

    then("Throw phone number error", () => {
      expect(instance.state.phoneError).toBe("Cell Phone cannot be blank");
    });

    when("Phone number has characters", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "a")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")

    });

    then("Throw phone number error", () => {
      expect(instance.state.phoneError).toBe("Cell Phone cannot be blank");
    });

    when("State picker is clicked", () => {
      editProfile
        .findWhere(node => node.prop("testID") === "countryAndroidPicker")
        .simulate("press");

      editProfile
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("press");

      mockAPISuccessCall(instance, "getStatesApiCallId",
        {
          state: {
            AK: "Alaska",
            AL: "Alabama"
          }
        }
      )

      mockAPISuccessCall(instance, "getStatesApiCallId", { errors: [] })
      mockAPIFailureCall(instance, "getStatesApiCallId", { errors: [] })

      editProfile
        .findWhere(node => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("State value is changed", () => {
      expect(instance.state.selectedState).toBe("");
    });

    when("City picker is clicked", () => {
      editProfile
        .findWhere(node => node.prop("testID") === "cityPickerTag")
        .simulate("press");

      mockAPISuccessCall(instance, "getCityApiCallId",
        {
          city: ["Akutan", "Alakanuk"]
        }
      )

      mockAPISuccessCall(instance, "getCityApiCallId", { errors: [] })
      mockAPIFailureCall(instance, "getCityApiCallId", { errors: [] })

      editProfile
        .findWhere(node => node.prop("testID") === "cityPickerTag")
        .simulate("ValueChange", "Akutan");

      editProfile
        .findWhere(node => node.prop("testID") === "saveBtn")
        .simulate("press");
    });

    then("City value is changed", () => {
      expect(instance.state.selectedState).toBe("");
    });

    when("Name has digits and characters", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "1astha1")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    })

    then("render UI with invalid name", () => {
      expect(instance.state.nameError).toBe("Name can only contain alphabets")
    })

    when("Phone number has alphabets and characters", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "1")
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
    })

    then("render UI with invalid cell phone", () => {
      expect(instance.state.phoneError).toBe("Cell Phone number invalid")
    })

    when("Form is filled", () => {
      editProfile.findWhere(node => node.prop("testID") === "nameTextInput").simulate("changeText", "Name")
      editProfile.findWhere(node => node.prop("testID") === "emailTextInput").simulate("changeText", "abc@gmail.com")
      editProfile.findWhere(node => node.prop("testID") === "phoneTextInput").simulate("changeText", "1234567890")
      editProfile
        .findWhere(node => node.prop("testID") === "countryAndroidPicker")
        .simulate("ValueChange", "United States");
      editProfile
        .findWhere(node => node.prop("testID") === "statePicker")
        .simulate("ValueChange", "");
      editProfile
        .findWhere(node => node.prop("testID") === "cityPickerTag")
        .simulate("ValueChange", "Akutan");
      editProfile.findWhere(
        node => node.prop("testID") === "saveBtn"
      ).simulate("press")
      mockAPISuccessCall(instance, "editProfilePatchApiCallID", mockResponse)
      mockAPISuccessCall(instance, "editProfilePatchApiCallID", { "errors": [{ "token": "Invalid token" }] })
      mockAPIFailureCall(instance, "editProfilePatchApiCallID", [])
    })

    then("Save the profile", () => {
      expect(instance.state.firstName).toBe("Name");
    })
  });

});
