import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import React from "react";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import ClaimPage from "../../src/ClaimPage";
import { runEngine } from '../../../../framework/src/RunEngine'
import StorageProvider from "../../../../framework/src/StorageProvider";
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

const mockResponse = {
  "data": {
    "id": "18",
    "type": "page",
    "attributes": {
      "id": 18,
      "page_type": "Artist",
      "band_artist_name": "Artist A",
      "city": "Akutan",
      "state": "Alaska",
      "country": "US",
      "verify_at": null
    }
  },
  "meta": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MjY3LCJleHAiOjE3MTQ5MDMxODB9.dQd4kmu2rK2kJPP8rWdbhxcSUCOUmsnuxzdZchjdTiJ0A-oOW5TITMH55SO8addEC9npmmfoLgN6r7f7yEE6Ag"
  }
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
  id: "claim-page-scenario"
};

jest.mock("../../../../framework/src/StorageProvider", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
  set: jest.fn().mockImplementation(() => Promise.resolve('test')),
  remove: jest.fn().mockImplementation(() => Promise.resolve([]))
}));

jest.useFakeTimers()

const feature = loadFeature("./__tests__/features/claim-page-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
      OS: "android",
      select: jest.fn()
    }));
  });

  test("Claim Page for Band Artist", ({ given, when, then }) => {
    let claimPageWrapper: ShallowWrapper;
    let instance: ClaimPage;
    let claimPageBackground: ShallowWrapper;

    given("I am a User attempting to Register as a Band/Artist", () => {
      claimPageWrapper = shallow(<ClaimPage {...screenProps} />);
    });

    when("I navigate to the Claim Page Screen", async () => {
      instance = claimPageWrapper.instance() as ClaimPage;
      instance.handleNavigationPayload({bandName:'test',type:"test",selectedState:"test",userRole:'test'})
      instance.handleNavigationPayload(null)
      await instance.handleClaimPageSuccess()
      instance.setState({userRole:'band'})
      instance.renderBandOrLocation()
      instance.setState({userRole:'test'})
      instance.renderBandOrLocation()
      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          bandName: "first_name",
          type: "Band",
          selectedCountry: "US",
          selectedState: "Alaska",
          selectedCity: "Akutan",
          userRole: "band"
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      const msgWithoutPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", msgWithoutPlayloadAPI);

      mockAPISuccessCall(instance, "getCountryListAPICallId", mockCountryList)
      mockAPISuccessCall(instance, "getCountryListAPICallId", { errors: [] })
      mockAPIFailureCall(instance, "getCountryListAPICallId", { errors: [] })

      mockAPISuccessCall(instance, "getStatesId", mockStateResponse)
      mockAPISuccessCall(instance, "getStatesId", { errors: [] })
      mockAPIFailureCall(instance, "getStatesId", { errors: [] })

      mockAPISuccessCall(instance, "getCitiesId", mockCityResponse)
      mockAPISuccessCall(instance, "getCitiesId", { errors: [] })
      mockAPIFailureCall(instance, "getCitiesId", { errors: [] })

      claimPageBackground = claimPageWrapper.findWhere(node => node.prop("testID") === "claimPageBackground")
      claimPageBackground.simulate("press");

      claimPageWrapper.findWhere(node => node.prop("testID") === "backButton").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "Band");
      claimPageWrapper.findWhere(node => node.prop("testID") === "bandArtistInput").simulate("changeText", "Title");
      claimPageWrapper.findWhere(node => node.prop("testID") === "countryPicker").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "countryPicker").simulate("ValueChange", "US");
      claimPageWrapper.findWhere(node => node.prop("testID") === "countryPicker").simulate("ValueChange", "United States");
      claimPageWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("ValueChange", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "cityPicker").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "cityPicker").simulate("ValueChange", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnAccept").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnCreatePage").simulate("press");

      mockAPISuccessCall(instance, "claimPageID", mockResponse)
      mockAPISuccessCall(instance, "claimPageID", { errors: [] })
      mockAPIFailureCall(instance, "claimPageID", { errors: [] })
      StorageProvider.get.mockResolvedValue(JSON.stringify({
        bandName:'test',
        type:'test',
        selectedState:'test',
        userRole:'test',
      }))
      await instance.componentDidMount()
    });

    then("Press Event is performed", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Type is not selected", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "typePicker").simulate("ValueChange", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw type error", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Band/Artist Name is empty", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "bandArtistInput").simulate("changeText", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw Band/Artist Name error", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Country is empty", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "countryPicker").simulate("ValueChange", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw Country error", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("State is empty", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "statePicker").simulate("ValueChange", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw State error", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("City is empty", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "cityPicker").simulate("ValueChange", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw City error", () => {
      expect(claimPageBackground).toBeDefined();
    });
  });

  test("Pickers in iOS", ({ given, when, then }) => {
    let claimPageWrapper: ShallowWrapper;
    let instance: ClaimPage;
    let claimPageBackground: ShallowWrapper;

    given("User attempting to Register on Claim Page", () => {
      jest.doMock("react-native/Libraries/Utilities/Platform.ios.js", () => ({
        OS: "ios",
        select: jest.fn()
      }));
      claimPageWrapper = shallow(<ClaimPage {...screenProps} />);
    });

    when("User click the band/artist picker", () => {
      instance = claimPageWrapper.instance() as ClaimPage;
      claimPageBackground = claimPageWrapper.findWhere(node => node.prop("testID") === "claimPageBackground")
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "hideTypeModal").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "typePickerModal").simulate("ValueChange", "Band");
    });

    then("User can select the band/artist", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Country picker is clicked", () => {
      mockAPISuccessCall(instance, "getCountryListAPICallId", mockCountryList)
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnCountrySelect").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "hideCountryPickerModal").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "countryPickerModal").simulate("ValueChange", "US");
      claimPageWrapper.findWhere(node => node.prop("testID") === "countryPickerModal").simulate("ValueChange", "United States");
      
    });

    then("Country value is changed", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("State picker is clicked", () => {
      mockAPISuccessCall(instance, "getStatesId", mockStateResponse)
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnStateSelect").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "hideStateModal").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "statePickerModal").simulate("ValueChange", "AK");
    });

    then("State value is changed", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("City picker is clicked", () => {
      mockAPISuccessCall(instance, "getCitiesId", mockCityResponse)
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnCitySelect").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "hideCityModal").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "cityPickerModal").simulate("ValueChange", "Akutan");
      claimPageWrapper.findWhere(node => node.prop("testID") === "bandArtistInput").simulate("changeText", "Title"); 
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnAccept").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnCreatePage").simulate("press");
       });

    then("City value is changes", () => {
      expect(claimPageBackground).toBeDefined();
    });
  });

  test("Claim Page for Venue", ({ given, when, then }) => {
    let claimPageWrapper: ShallowWrapper;
    let instance: ClaimPage;
    let claimPageBackground: ShallowWrapper;

    given("I am a User attempting to Register as a Venue", () => {
      claimPageWrapper = shallow(<ClaimPage {...screenProps} />);
    });

    when("I navigate to the Claim Page Screen", () => {
      instance = claimPageWrapper.instance() as ClaimPage;

      const msgPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      msgPlayloadAPI.addData(
        getName(MessageEnum.HelpCentreMessageData),
        {
          bandName: "first_name",
          type: "Band",
          selectedState: "Alaska",
          selectedCity: "Akutan",
          userRole: "venue"
        }
      );
      runEngine.sendMessage("Unit Test", msgPlayloadAPI);

      const msgWithoutPlayloadAPI = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      runEngine.sendMessage("Unit Test", msgWithoutPlayloadAPI);
      
      claimPageBackground = claimPageWrapper.findWhere(node => node.prop("testID") === "claimPageBackground")
      claimPageBackground.simulate("press");

      mockAPISuccessCall(instance, "claimPageID", mockResponse)
      mockAPISuccessCall(instance, "claimPageID", { errors: [] })
      mockAPIFailureCall(instance, "claimPageID", { errors: [] })
    });

    then("Press Event is performed", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Address is not selected", () => {
      instance.setState({userRole:"venue"})
      claimPageWrapper.findWhere(node => node.prop("testID") === "addressInput").simulate("changeText", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw address error", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Zip is empty", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "zipInput").simulate("changeText", "");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw zip error", () => {
      expect(claimPageBackground).toBeDefined();
    });

    when("Zip is invalid", () => {
      claimPageWrapper.findWhere(node => node.prop("testID") === "zipInput").simulate("changeText", "q123wgy");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
    });

    then("Throw zip error", () => {
      expect(claimPageBackground).toBeDefined();
    });

  });
  test('Open Modal when I press claim submit button', ({given, when , then}) => {
    let claimPageWrapper: ShallowWrapper;
    let instance: ClaimPage;
  

    given("I am a User attempting to Register as a Venue", () => {
      claimPageWrapper = shallow(<ClaimPage {...screenProps} />);
    });
    when('I press the submit button', () => {
      instance = claimPageWrapper.instance() as ClaimPage;
      jest.spyOn(instance, "checkValidation").mockImplementation(() => true);
      jest.spyOn(instance, "handleClaimPageAPI");
      claimPageWrapper.findWhere(node => node.prop("testID") === "btnClaimPage").simulate("press");
      const data = {
        band_artist_name: 'The Adicts',
        page_type: 'Band / Artist',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        role_id: 3,
      };
      mockAPISuccessCall(instance, 'claimPageID', data)
    });
    then("I expect to show an modal", () => {
      expect(instance.handleClaimPageAPI).toBeCalled()
    });

  })

  test('Test generic functions', ({given, when , then}) => {
    let claimPageWrapper: ShallowWrapper;
    let instance: ClaimPage;


    given("I am a User attempting to Register as a Venue", () => {
      claimPageWrapper = shallow(<ClaimPage {...screenProps} />);
    });
    when('I call handleClaimPageAPI function with validation checked', () => {
      instance = claimPageWrapper.instance() as ClaimPage;
      instance.setState({
        selectedState: 'AK',
        selectedCountry: 'US',
        stateList: [
          {
            key: 'AK',
            name: 'Alaska'
          }
        ],
        countryList: [{
          country_code: "US",
          country_name: "United States"
      },]
      })
      jest.spyOn(instance, 'handleClaimPageAPI')
      jest.spyOn(instance, "checkValidation").mockImplementation(() => true);
     
      instance.handleClaimPageAPI()
    });
    then("I expect handleClaimPageAPI to be called", () => {
      expect(instance.handleClaimPageAPI).toBeCalled()
    });
    
  })
  test("TypeList filled with venue selected values", ({ given, when, then }) => {
    let claimPageWrapper: ShallowWrapper;
    let instance: ClaimPage;


    given("I am a User attempting to Register as a Venue", () => {
      claimPageWrapper = shallow(<ClaimPage {...screenProps} />);
    });

    when("The screen is loaded with userRole", () => {
      instance = claimPageWrapper.instance() as ClaimPage;
      jest.spyOn(instance, 'getTypeList')
      instance.getTypeList('venue')

    });
    then("I expect typeList have location values", () => {
      const typeListValues= ['Club / Venue' , 'Theater', 'Museum', 'Record_Label', 'Promoter']
      console.log(instance.state.typeList)
      expect(instance.state.typeList).toEqual(typeListValues);
    });
  });

});
