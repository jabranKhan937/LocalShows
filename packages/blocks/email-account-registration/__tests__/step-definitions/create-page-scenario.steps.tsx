import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import React from "react";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";

import CreatePage from "../../src/CreatePage";
import { runEngine } from '../../../../framework/src/RunEngine'

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

const mockStateResponse = {
  "state": {
    "AK": "Alaska",
    "AL": "Alabama",
  }
}

const mockCityResponse = {
  "city": [
    "Akutan",
    "Alakanuk",
  ]
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

const mockResponseWithoutVerificationToken = {
  "data": {
    "id": "371",
    "type": "email_account",
    "attributes": {
      "first_name": "Band ass",
      "last_name": null,
      "full_phone_number": "11234567890",
      "country_code": 1,
      "phone_number": 1234567890,
      "email": "astha.gupta+1aa2@metafic.co",
      "activated": false,
      "account_type": "Band",
      "country": "US",
      "state": "Alaska",
      "city": "Akutan",
      "role_id": 9,
      "i_would_like": false,
      "terms_and_conditions": false,
      "are_you_18": false,
      "private": true,
      "is_blacklisted": false,
      "push_notification": true,
      "profile_image": ""
    }
  },
  "meta": {
    "otp": {
      "id": 1551,
      "email": "astha.gupta+1aa2@metafic.co",
      "pin": 1144,
      "activated": false,
      "valid_until": "2024-06-14T14:25:07.279Z",
      "created_at": "2024-06-14T14:22:07.279Z",
      "updated_at": "2024-06-14T14:22:07.279Z"
    },
    "message": "Verification otp send to your email successfully",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTU1MSwiZXhwIjoxNzIwOTY2OTI3fQ.1mZU19A2FO73ge9ru3rKFm64wCj85g_3DU9FY_kc0rGxjvBKUCb1PfM5ZAEQL9IwB4nrwJab_M5CzCTGeKgMsQ"
  }
}

const mockResponseWithVerificationToken = {
  "redirect_on": "dispute_form",
  "claim_ids": [
    62
  ],
  "account": {
    "id": 356,
    "first_name": "Band Threaaew",
    "last_name": null,
    "full_phone_number": "11234567890",
    "country_code": 1,
    "phone_number": 1234567890,
    "email": "band3aaw@yopmail.com",
    "role_id": 9,
    "country": "US",
    "state": "Alaska",
    "city": "Akutan",
  },
  "meta": {
    "verification_token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTQzNiwiZXhwIjoxNzIwOTM0NTM1fQ.rC1ZuiVoroM1CVxCdgU8_5ZCT1kT75mo07Ns1E0hRP0w7qCyoQ5-b_Cr3CY4C5oBaV5sMaBhp9FoHnJSKnBbLw",
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MzU2LCJleHAiOjE3MjA5MzQ1MzV9.oJ_HFsb9rZmfQQBoM8oGI2aGP9pyQTTh00FjQYTh3-qQnZBv7QCSlXQ_LTSIxjj8ZFMbBDbnu23d-HiCtOaSqw"
  }
}

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn().mockImplementation((event, callback) => {
      callback();
      return {
        remove: jest.fn(),
      };
    }),
  },
  id: "create-page-scenario"
};

jest.useFakeTimers()

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    LIMITED: 'limited',
    GRANTED: 'granted',
    BLOCKED: 'blocked'
  },
  PERMISSIONS: {
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.location_when_in_use'
    },
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.access_fine_location'
    }
  }
}));

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

jest.mock("../../../../framework/src/StorageProvider", () => ({
  set: jest.fn().mockImplementation(() => Promise.resolve('tAndCAcceptance')),
  get: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

const feature = loadFeature(
  "./__tests__/features/create-page-scenario.feature"
);

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
      OS: "android",
      select: jest.fn()
    }));
  });

  test("Create Page for Band Artist", ({ given, when, then }) => {
    let createPageWrapper: ShallowWrapper;
    let instance: CreatePage;
    let pageTitle: ShallowWrapper;

    given("I am a User attempting to Register as a Band/Artist", () => {
      createPageWrapper = shallow(<CreatePage {...screenProps} />);
    });

    when("I navigate to the Create Page Screen", () => {
      instance = createPageWrapper.instance() as CreatePage;
      instance.getCurrentLatitudeLongitude()
      pageTitle = createPageWrapper.findWhere(node => node.prop("testID") === "pageTitle");
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          bandName: "first_name",
          userRole: "band",
          administratorName: "administratorName",
          userTitle:"userTitle",
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      const msgWithoutPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", msgWithoutPlayloadAPI);

      mockAPISuccessCall(instance, "getCountryCodeListId", mockCountryCodeList)
      mockAPISuccessCall(instance, "getCountryCodeListId", { errors: [] })
      mockAPIFailureCall(instance, "getCountryCodeListId", { errors: [] })

      mockAPISuccessCall(instance, "getCountryListId", mockCountryList)
      mockAPISuccessCall(instance, "getCountryListId", { errors: [] })
      mockAPIFailureCall(instance, "getCountryListId", { errors: [] })

      mockAPISuccessCall(instance, "getStateListAPIId", mockStateResponse)
      mockAPISuccessCall(instance, "getStateListAPIId", { errors: [] })
      mockAPIFailureCall(instance, "getStateListAPIId", { errors: [] })

      mockAPISuccessCall(instance, "getCityListAPIId", mockCityResponse)
      mockAPISuccessCall(instance, "getCityListAPIId", { errors: [] })
      mockAPIFailureCall(instance, "getCityListAPIId", { errors: [] })

      mockAPISuccessCall(instance, "getStateCityId", {
        "state": "Sao Paulo",
        "city": "Sao Paulo",
        "country": "Brazil",
        "country_code": "BR"
      })

      mockAPISuccessCall(instance, "getStateCityId", {
        "state": "New York",
        "city": "New York",
        "country": "United States",
        "country_code": "us"
      })     
      mockAPISuccessCall(instance, "getStateCityId", { errors: [] })
      mockAPIFailureCall(instance, "getStateCityId", { errors: [] })

      createPageWrapper.findWhere(node => node.prop("testID") === "Background").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "backButton").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnAcceptTermsConditions").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnLegalTermsAndCondition").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "passwordIcon").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "confirmPasswordIcon").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnAccept").simulate("press");
      
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryPicker").simulate("ValueChange", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("ValueChange", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "cityPicker").simulate("ValueChange", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPhone").simulate("changeText", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnCountryCodeSelectAndroid").simulate("press");

    });

    then("User navigates back", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Email is invalid", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "Email");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Email invalid error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Email is invalid", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "email@");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Email invalid error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Email is invalid", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "email@gmailcom");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Email invalid error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Email is invalid", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "1)@gmail.com");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Email invalid error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Password is invalid", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "abc@gmail.com");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "123");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Password invalid error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Confirm Password is empty", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "abc@gmail.com");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "123");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Confirm Password match error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Phone number has characters", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "abc@gmail.com");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test@123");
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Alaska");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPhone").simulate("changeText", "abc");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
    });

    then("Throw Phone number error", () => {
      expect(pageTitle).toBeDefined();
    });

    when("Phone number is invalid", () => {
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "abc@gmail.com");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputConfirmPassword").simulate("changeText", "Test@123");
      
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPhone").simulate("changeText", "123");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");

    });

    then("Throw Phone number invalid error", () => {
      expect(pageTitle).toBeDefined();
    });
    when('Countries list and countryCode is invalid', () => {
      jest.spyOn(instance, "checkValidation").mockImplementation(() => false); 
      jest.spyOn(instance, 'handleCreatePageAPI')
      instance.setState({countryList:[{country_code: 'US'}] ,selectedCountry: 'US', selectedCountryCode: null})
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
      expect(instance.state.selectedCountryCode).toBeFalsy()

      instance.setState({selectedCountry: '', selectedCountryCode: null})
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");
      expect(instance.state.selectedCountry).toBeFalsy()
    })
    then('I expect handleCreatePageAPI to be called with wrong fields', () => {
      
      expect(instance.handleCreatePageAPI).toBeCalled()
    })

    when("Create Page form is filled", () => {
      jest.spyOn(instance, 'handleCreatePageSuccess')
      createPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "band");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "Name");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputEmail").simulate("changeText", "abc@gmail.com");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPassword").simulate("changeText", "Test@123");
      
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPhone").simulate("changeText", "11234567890");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryPicker").simulate("ValueChange", "United States");
      createPageWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("ValueChange", "Alaska");
      createPageWrapper.findWhere(node => node.prop("testID") === "cityPicker").simulate("ValueChange", "Akutan");
      instance.setState({acceptTermsConditions: true})
      createPageWrapper.findWhere(node => node.prop("testID") === "btnContinue").simulate("press");

      mockAPISuccessCall(instance, "createPageID", mockResponseWithoutVerificationToken)
      mockAPISuccessCall(instance, "createPageID", mockResponseWithVerificationToken)
      mockAPISuccessCall(instance, "createPageID", { errors: [] })
      mockAPIFailureCall(instance, "createPageID", { errors: [] })
    });

    then("Handle Create Page Success API Response", () => {
      expect(instance.state.name).toBe('Name')
      expect(instance.state.email).toBe('abc@gmail.com')
      expect(instance.state.password).toBe('Test@123')
      expect(instance.state.phoneNumber).toBe('11234567890')
      expect(instance.checkValidation()).toBe(false)
      expect(instance.handleCreatePageSuccess).toBeCalled()
      expect(pageTitle).toBeDefined();
    });
  });


  test("Band Artist comming from Representative Screen", ({ given, when, then }) => {
          let createPageWrapper: ShallowWrapper;
          let instance: CreatePage;
          let pageTitle: ShallowWrapper;
      
          given("I am a User attempting to Register a band user", () => {
            createPageWrapper = shallow(<CreatePage {...screenProps} />);
          });
      
          when("The page is mounted", () => {
            instance = createPageWrapper.instance() as CreatePage;
            jest.spyOn(runEngine, 'sendMessage')
            const msgPlayloadAPI = new Message(
              getName(MessageEnum.NavigationPayLoadMessage)
            );
            msgPlayloadAPI.addData(
              getName(MessageEnum.HelpCentreMessageData),
              {
                bandName: "RHCP",
                userRole: "band",
                administratorName: "administratorName",
                userTitle:"userTitle",
              }
            );
            runEngine.sendMessage("Unit Test", msgPlayloadAPI);
           
          });
      
          then("I expect the band name field is already filled", () => {
            expect(instance.state.name).toBe('RHCP');
            expect(instance.state.userRole).toBe('band') 
            expect(runEngine.sendMessage).toBeCalled();
          });
      
        });

  test("Selecting a country code on android device", ({given, when , then}) => {
    let createPageWrapper: ShallowWrapper;
    let instance: CreatePage;
    const mockCountriesCodeList = [
      {
        id: "AF",
        type: "country_code_and_flag",
        attributes: {
            name: "Afghanistan",
            country_code: "93",
            map_url: "https://flagcdn.com/64x48/af.png"
        }
    },
    {
        id: "AL",
        type: "country_code_and_flag",
        attributes: {
            name: "Albania",
            country_code: "355",
            map_url: "https://flagcdn.com/64x48/al.png"
        }
    },
    ]
    given("I am a User attempting to Register a band on android device", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "android"
      }));
      createPageWrapper = shallow(<CreatePage {...screenProps} />);
    })
    when("I select the country code", () => {
      instance = createPageWrapper.instance() as CreatePage;
      instance.setState({countryCodesList: mockCountriesCodeList})
      jest.spyOn(instance,'handleCountryCodeValueChangeAndroid')
      createPageWrapper.findWhere(node => node.prop("testID") === "btnCountryCodeSelectAndroid").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryCodeModal-0").simulate("press");
    })
    then("I expect the country code to be on the field", () => {
      expect(instance.state.countryCodeClickedAndroid).toBe(false)
      expect(instance.handleCountryCodeValueChangeAndroid).toBeCalled()
      
    })
  })

  test("Pickers in iOS", ({ given, when, then }) => {
    let createPageWrapper: ShallowWrapper;
    let instance: CreatePage;
    let pageTitle: ShallowWrapper;

    given("User attempting to Register on Create Page", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "ios", select: jest.fn()
      }));
      jest.doMock('react-native-permissions', () => ({
        check: jest.fn(),
        request: jest.fn(),
        RESULTS: {
          UNAVAILABLE: 'unavailable',
          DENIED: 'denied',
          LIMITED: 'limited',
          GRANTED: 'granted',
          BLOCKED: 'blocked'
        },
        PERMISSIONS: {
          IOS: {
            LOCATION_WHEN_IN_USE: 'ios.location_when_in_use'
          },
          ANDROID: {
            ACCESS_FINE_LOCATION: 'android.access_fine_location'
          }
        }
      }));
      createPageWrapper = shallow(<CreatePage {...screenProps} />);
    });

    when("User click the band/artist picker", () => {
      instance = createPageWrapper.instance() as CreatePage;
      pageTitle = createPageWrapper.findWhere(node => node.prop("testID") === "pageTitle");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "hideTypeModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "typePickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "typePickerModal").simulate("ValueChange", "Band");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "typePickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "typePickerModal").simulate("ValueChange", "");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("ChangeText", "band");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnCountryCodeSelect").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnCountrySelect").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnStateSelect").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "btnCitySelect").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "hideCountryCodePickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryCodePickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryCodePickerModal").simulate("ValueChange", {
        "id": "CN",
        "type": "country_code_and_flag",
        "attributes": {
          "name": "China",
          "country_code": "86",
          "map_url": "https://flagcdn.com/64x48/cn.png"
        }
      });
      createPageWrapper.findWhere(node => node.prop("testID") === "hideCountryPickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryPickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "countryPickerModal").simulate("ValueChange", "United StatesS");
      createPageWrapper.findWhere(node => node.prop("testID") === "hideStateModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "hideCityModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "statePickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "statePickerModal").simulate("ValueChange", "Alaska");
      createPageWrapper.findWhere(node => node.prop("testID") === "cityPickerModal").simulate("press");
      createPageWrapper.findWhere(node => node.prop("testID") === "cityPickerModal").simulate("ValueChange", "Akutan");
      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputPhone").simulate("changeText", "");
    });

    then("User can select the band/artist", () => {
      expect(pageTitle).toBeDefined();
    });
    when("I select the country code", () => {
      instance = createPageWrapper.instance() as CreatePage;
      jest.spyOn(instance, 'handleCountryCodeSelectionIOS')
      createPageWrapper.findWhere(node => node.prop("testID") === "btnCountryCodeSelect").simulate("press");
      const selectedCountryCode = {
        id: 'countryCodeId',
        attributes: {
          name: 'United States',
          country_code : '1'
        }

      }
      createPageWrapper.findWhere(node => node.prop("testID") === "countryCodePickerModal").simulate("ValueChange",selectedCountryCode);

    });
    then("I expect the country code to be on the field", () => {
      expect(instance.state.countryCodeClicked).toBe(false)
      expect(instance.handleCountryCodeSelectionIOS).toBeCalled()
    });
  });

  test("Create Page for Venue", ({ given, when, then }) => {
    let createPageWrapper: ShallowWrapper;
    let instance: CreatePage;
    let pageTitle: ShallowWrapper;

    given("I am a User attempting to Register as a Venue", () => {
      createPageWrapper = shallow(<CreatePage {...screenProps} />);
    });

    when("I navigate to the Create Page Screen", () => {
      instance = createPageWrapper.instance() as CreatePage;
      pageTitle = createPageWrapper.findWhere(node => node.prop("testID") === "pageTitle");
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          bandName: "first_name",
          userRole: "venue"
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      const msgWithoutPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", msgWithoutPlayloadAPI);

      createPageWrapper.findWhere(node => node.prop("testID") === "txtInputName").simulate("changeText", "");
    });

    then("User navigates back", () => {
      expect(pageTitle).toBeDefined();
    });

  });



  test("Page is unmounted", ({ given, when, then }) => {
    let createPageWrapper: ShallowWrapper;
    let instance: CreatePage;
    let pageTitle: ShallowWrapper;

    given("I am a User attempting to Register a user", () => {
      createPageWrapper = shallow(<CreatePage {...screenProps} />);
    });

    when("The page is unmounted", () => {
      instance = createPageWrapper.instance() as CreatePage;
      jest.spyOn(instance, 'componentWillUnmount')
      instance.componentWillUnmount()
     
    });

    then("I expect the _mounted is false", () => {
      expect(instance.componentWillUnmount).toBeCalled();
      expect(instance._isMounted).toBe(false)
    });

  });

  

});
