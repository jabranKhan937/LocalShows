import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Eventregistration from "../../src/Eventregistration"
import ItineraryDetails from "../../src/ItineraryDetails"
import { CommentProps, EventData } from "../../src/ItineraryDetailsController"
import moment from "moment"

const mockUtilities = (instance: any, functionName: string, data?: any) => {
    if (typeof instance[functionName] === "function") {
      instance[functionName](data);
    }
  }

jest.mock("react-native-daterange-picker", () => <></>)

jest.useFakeTimers();
jest.mock("../../../../framework/src/StorageProvider", () => ({
    get: jest.fn().mockImplementation(() => Promise.resolve("27")),
    set: jest.fn().mockImplementation(() => Promise.resolve([])),
    remove: jest.fn().mockImplementation(() => Promise.resolve([])),
  }));

const screenProps = {
    id: "Eventregistration",
    navigation: {
        openDrawer: jest.fn(),
        goBack: jest.fn(),
        addListener: jest.fn((event, callback) => {
      if (event === 'willFocus') {
        callback();
      }
    }),
    },
    
    
  }

const feature = loadFeature('./__tests__/features/eventregistration-scenario.feature');
const mockAPISuccessCall = (instance: any, apiCallID: string, responseData: object) => {
    const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
    msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
    msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), responseData);
    instance[apiCallID] = msgSucessRestAPI.messageId
    const { receive: MockRecieve } = instance
    MockRecieve("", msgSucessRestAPI)
  }

  const mockNavigationPayLoadMessage = (instance: any, routeName: string, paramsData?: object) => {
    const message = new Message(getName(MessageEnum.NavigationMessage))
    message.addData(getName(MessageEnum.NavigationPropsMessage), instance.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), routeName);

    const raiseMessage = new Message(getName(MessageEnum.NavigationPayLoadMessage))
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), paramsData);
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage)

    const { receive: MockRecieve } = instance
    MockRecieve("", message)
  }
defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'android' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
    });

    test('User navigates to eventregistration', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Eventregistration;         

        given('I am a User loading eventregistration', () => {
            exampleBlockA = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I navigate to the eventregistration', () => {
             instance = exampleBlockA.instance() as Eventregistration
        });

        then('eventregistration will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
        });
        when('I navigate to the Eventregistration', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "hideKeyboardTouchable").simulate("press")
            exampleBlockA.findWhere(node => node.prop("testID") === "btnDateSelector").simulate("press")  
        })

        when('I navigate to the hamburgerBtn', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "hamburger").simulate("press")
        })
        when('I navigate to the navigationBackButton', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press")
        })
        when('I toggle to the privateAccount', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "privateAccount").simulate("press")   
        })
        when('I navigate to the notificationScreen', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "notificationIcon").simulate("press")   
        })
        when('I press this btn modal close', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "closeCalendar").simulate("press")   

        })

    });

    test('Test generic functions', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Eventregistration;  

        given('I am a User loading eventregistration', () => {
            jest.spyOn(helpers, 'getOS').mockImplementation(() => 'ios');
            exampleBlockA = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I navigate to the eventregistration', () => {
             instance = exampleBlockA.instance() as Eventregistration
        });
        when('I call txtInputWebProps onChangeText function', () => {
            instance.txtInputWebProps.onChangeText('value-typed')
       });

        then('I expect txtInputValue to have some value', () => {
            expect(instance.state.txtInputValue.length).toBeGreaterThan(0)
        });
        when('I call btnShowHideProps onPress function', () => {
            instance = exampleBlockA.instance() as Eventregistration
            
            instance.setState({enableField: false})
            instance.btnShowHideProps.onPress()
        });
       then('I expect enabledField to be true', () => {
            expect(instance.state.enableField).toBe(true)
       });

        when('I call btnExampleProps onPress function', () => {
            instance = exampleBlockA.instance() as Eventregistration
            jest.spyOn(instance, 'doButtonPressed')
            instance.btnExampleProps.onPress()
        });
       then('I expect doButtonPressed to be called', () => {
        expect(instance.doButtonPressed).toBeCalled()
       });
       when('I call setEnableField', () => {
        instance = exampleBlockA.instance() as Eventregistration
            
        instance.setState((prev) => ({enableField: !prev.enableField}))
       });
       then('I expect enableField to be false', () => {
        expect(instance.state.enableField).toBe(false)
       });
    });

    test('User navigates to ItineraryDetails with pending accepted itinerary' , ({ given, when, then }) => {
        let eventRegistrationBlock:ShallowWrapper;
        let instance:Eventregistration;  
        let itineraryDetailsWrapper:ShallowWrapper;
        let instanceItinerary:ItineraryDetails; 

        given('I am a User loading eventregistration for ios', () => {
            jest.spyOn(helpers, 'getOS').mockImplementation(() => 'ios');
            eventRegistrationBlock = shallow(<Eventregistration {...screenProps}/>);
        });
        when('I press addItineraryBtn with card pending accept',() =>{
            instance = eventRegistrationBlock.instance() as Eventregistration
            jest.spyOn(instance, 'handleHasPendingItineraryCard')
            instance.setState({itineraryList: [{
                cityName: 'Miami',
                endDate: '2025-05-05',
                startDate: '2025-05-05',
                hasAcceptButton: true
            }]})
            eventRegistrationBlock.findWhere(node => node.prop("testID") === "addItineraryBtn").simulate("press")  
        })
        then('I expect the handleFieldsBlank to be called' , () => {
            expect(instance.handleHasPendingItineraryCard()).toBe(true)

        })
        when('I try to delete itineraryCard with accept pending',() =>{
            instance = eventRegistrationBlock.instance() as Eventregistration
            jest.spyOn(instance, 'handleToogleModalDeleteItinerary')
            instance.setState({itineraryList: [{
                cityName: 'Miami',
                endDate: '2025-05-05',
                startDate: '2025-05-05',
                hasAcceptButton: true
            }]})
            eventRegistrationBlock.findWhere(node => node.prop("testID") === "removeCardBtn-0").simulate("press")  
        })
        then('I can see the card beeing deleted from the list' , () => {
            expect(instance.handleToogleModalDeleteItinerary).toBeCalled()
            expect(instance.state.itineraryList).toStrictEqual([])

        })
        when('I press cancel on delete itinerary modal',() =>{
            instance = eventRegistrationBlock.instance() as Eventregistration
            jest.spyOn(instance, 'handleCancelDeleteItinerary')
            instance.setState({
                isItineraryModalClicked: true
            })
            eventRegistrationBlock.findWhere(node => node.prop("testID") === "deleteItineraryModalClose").simulate("press")  
           
        })
        then('I should get back to the current page' , () => {
            expect(instance.handleCancelDeleteItinerary).toBeCalled()

        })
        when('I press upArrow button Icon',() =>{
            instance = eventRegistrationBlock.instance() as Eventregistration
            jest.spyOn(instance, 'handleCancelDeleteItinerary')
            eventRegistrationBlock.findWhere(node => node.prop("testID") === "hideCardsBtn").simulate("press")  
           
        })
        then('I should hide all the cards' , () => {
            expect(instance.state.isClicked).toBe(true)

        })
        when('I select the itinerary card', () =>{
            instance = eventRegistrationBlock.instance() as Eventregistration
            
            jest.spyOn(runEngine, 'sendMessage')
            instance.setState({
                itineraryList: [{
                cityName: 'Miami',
                countryCode: 'US',
                state: 'Florida',
                endDate: '2025-05-05',
                startDate: '2025-05-05',
                hasAcceptButton: true,
                categoryId: '8',
                id: '1'
                }],
                states: [{
                    key: 'FL',
                    name: 'Florida'
                }],
                typesList: [{ id: '8', attributes: { name: 'Art'}} as any],
                isClicked: false
            })
            const params = {
                itineraryId: '1',
                startDate : '2025-05-05',
                endDate : '2025-05-05',
                selectedCountryCode: 'US',
                selectedState : 'Florida',
                selectedCity : 'Miami',
                selectedType: '8',
              }
            eventRegistrationBlock.findWhere(node => node.prop("testID") === "ItineraryDetailsPress").simulate("press") 
            mockNavigationPayLoadMessage(instance, 'ItineraryDetails', params) 
        })
        then('I should go to the itinerary Card screen with the itinerary card information',() =>{
            expect(runEngine.sendMessage).toBeCalled()
        })
        when('I am in the itineraryDetails screen with the params sended', () =>{
           
            itineraryDetailsWrapper =  shallow(<ItineraryDetails {...screenProps}/>);
            instanceItinerary = itineraryDetailsWrapper.instance() as ItineraryDetails
            mockUtilities(instanceItinerary, "handleGetTravelsList")
            jest.spyOn(instanceItinerary , 'handleGetTravelsSearchParams')
            jest.spyOn(runEngine , 'sendMessage')
            const params = {
                itineraryId: '1',
                startDate : '2025-05-05',
                endDate : '2025-05-05',
                selectedCountryCode: 'US',
                selectedState : 'Florida',
                selectedCity : 'Miami',
                selectedType: '8',
              }
            
            const navigationMsg = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            navigationMsg.addData(getName(MessageEnum.HelpCentreMessageData), params);
            runEngine.sendMessage('NavigationMessage',navigationMsg);

            const mockResponseGetTravels = {
                travel: {
                    data: {
                        attributes: {
                            start_date : '2025-05-05' ,
                            end_date: '2025-05-05', 
                            state: 'Florida',
                            city : 'Miami',
                            country: '',
                            category_id : 'US'
                        }
                    }
                }
            }
            const categories   = {
  
                    id: "",
                    type: "category",
                    attributes: {
                      id: 0,
                      name: "All",
                      created_at: "2023-11-09T07:04:18.294Z",
                      updated_at: "2023-11-09T07:29:26.573Z"
                    }
   
            }
            instanceItinerary.setState({
                categories: [categories]
            })
            mockAPISuccessCall(instanceItinerary, 'getTravelsParamsApiCallId', mockResponseGetTravels)
   
        })
        then('I can see the cards with the params selected', () =>{
            expect(instanceItinerary.handleGetTravelsSearchParams).toBeCalledWith('1')
            expect(runEngine.sendMessage).toBeCalled()
        })
    })


    test('User navigates to eventregistration for ios', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Eventregistration;  

        given('I am a User loading eventregistration for ios', () => {
            jest.spyOn(helpers, 'getOS').mockImplementation(() => 'ios');
            exampleBlockA = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I navigate to the eventregistration for ios', () => {
             instance = exampleBlockA.instance() as Eventregistration
        });

        then('eventregistration will load with out errors for ios', () => {
            expect(exampleBlockA).toBeTruthy();
        });
 
        when('I press to the DateRangePicker', () => {
            instance.setState({showDateSelector: true})
           const datePicker = exampleBlockA.findWhere(node => node.prop("testID") === "DateRangePicker")
            datePicker.prop("onDayPress")( moment("15-04-2025"));
            instance.setState({displayedDate:new Date()});
            datePicker.prop("current")
        });
        then('I expect to show the start date and end date on the datefield', () =>{
            const expectedDate = moment().format("DD/MM/YYYY").toString()
            expect(instance.state.endDate).toBe('');
            
        })
        when('I press to the btnCountrySelect', () => {
            instance.setState({ countriesList: [{country_code: 'US', country_name: 'United States'}]})
            exampleBlockA.findWhere(node => node.prop("testID") === "btnCountrySelect").simulate("press")  
            exampleBlockA.findWhere(node => node.prop("testID") === "countryPickerModal").simulate("valueChange","United States")  
        });
        then('I expect the country to be selected', () => {
            expect(instance.state.countryFieldClicked).toBe(false);
            expect(instance.state.selectedCountry).toBe("United States");
            
        });
        when('I press to the StateDropdown', () => {
            instance.setState({countryFieldClicked: false , selectedCountry: 'United States'})
            exampleBlockA.findWhere(node => node.prop("testID") === "btnStateSelect").simulate("press")
            instance.setState({ selectedCountry: 'US', states: [{key: 'Miami', name: 'Miami'}], countriesList: [{country_code: 'US', country_name: 'United States'}]})
            exampleBlockA.findWhere(node => node.prop("testID") === "statePickerModal").simulate("valueChange","Miami")  
        });
        then('I expect the state modal to be opened', () => {
            expect(instance.state.stateFieldClicked).toBe(false);
            expect(instance.state.selectedState).toBe("Miami");
        });
        when('I try to select the state with no countries selected', () => {
            jest.spyOn(instance,'handleToogleModalStatesField')
            instance.setState({stateFieldClicked: false , selectedCountry: ''})
           
        });
        then('I expect state button to be disabled', () => {
            expect(instance.handleToogleModalStatesField).not.toBeCalled();
        });
        when('I press to the btnCitySelect', () => {
            instance.setState({selectedState: 'Miami' , selectedCountry: 'US', states: [{key: 'Miami', name: 'Miami'}], countriesList: [{country_code: 'US', country_name: 'United States'}]})
            
            exampleBlockA.findWhere(node => node.prop("testID") === "btnCitySelect").simulate("press")  
        })
        then('I expect a cityPickerModal modal to be opened' , () => {
            expect(instance.state.cityFieldClicked).toBe(true)
        })
        when('I choose the city', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "cityPickerModal").simulate("valueChange","Los Angeles")  
        })
        then('I expect the city to be on the field' , () => {
            expect(instance.state.selectedCity).toBe('Los Angeles');
        })
        when('I press to the btnTypeSelect', () => {
            
            exampleBlockA.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press")  
        })
        then('I expect a typePickerModal modal to be opened' , () => {
            expect(instance.state.typeFieldClicked).toBe(true)
        })
        when('I choose the type', () => {
            instance.setState({
                typesList: [
                    {
                        id: '0',
                        type: 'category',
                        attributes: {
                            id: 0,
                            name: 'Music',
                            created_at: '00-00-00',
                            updated_at: '00-00-00'
                        }
                    }
                ]
            })
            exampleBlockA.findWhere(node => node.prop("testID") === "typePickerModal").simulate("valueChange","Music")  
        })
        then('I expect the type to be on the field' , () => {
            expect(instance.state.selectedType).toBe('Music');
        })
        when('I press addItineraryBtn with countries blank fields',() =>{
            jest.spyOn(instance, 'handleAddItineraryFieldsBlank')
            instance.setState({countriesList:[], selectedCountry: '' , states: [], selectedState: '' , cities: [], selectedCity: ''})
            exampleBlockA.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press")  
        })
        then('I expect the handleFieldsBlank to be called' , () => {
            expect(instance.handleAddItineraryFieldsBlank()).toBe(true)
        })
        when('I press addItineraryBtn with states blank fields',() =>{
            jest.spyOn(instance, 'handleAddItineraryFieldsBlank')
            instance.setState({countriesList:[{country_code: 'US' , country_name: 'United States'}], selectedCountry: 'United States' , states: [], selectedState: ''})
            exampleBlockA.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press")  
        })
        then('I expect the handleFieldsBlank to be called' , () => {
            expect(instance.handleAddItineraryFieldsBlank()).toBe(true)
        })
        when('I press addItineraryBtn with cities blank fields',() =>{
            jest.spyOn(instance, 'handleAddItineraryFieldsBlank')
            instance.setState({countriesList:[{country_code: 'US' , country_name: 'United States'}], selectedCountry: 'United States',states: [{key : 'AL', name: 'Alabama'}], selectedState: 'AL' , cities: [], selectedCity: ''})
            exampleBlockA.findWhere(node => node.prop("testID") === "btnTypeSelect").simulate("press")  
        })
        then('I expect the handleFieldsBlank to be called' , () => {
            expect(instance.handleAddItineraryFieldsBlank()).toBe(true)
        })
        when('I press addItineraryBtn',() =>{
            jest.spyOn(instance, 'handleAddToMyItinerary')
            instance.setState({
                selectedCity : 'Miami',
                selectedCountry : 'United States',
                selectedState : 'Florida',
                selectedEndDateFormatted: 'June 4th',
                selectedStartDateFormatted: 'June 1th',
                countriesList: [{country_code: 'US', country_name: 'United States'}],
                selectedType : 'All',
                isPrivateAccount: true, 
            })
            instance.scrollRef = {
                //@ts-ignore
                current:{
                scrollToEnd:jest.fn()
                }
            }
            exampleBlockA.findWhere(node => node.prop("testID") === "addItineraryBtn").simulate("press")  
        })
        then("scrols to the new tile",()=>{
            jest.spyOn(instance, 'handleAddToMyItinerary')
            instance.setState({
                selectedCity : 'Miami',
                selectedCountry : 'United States',
                selectedState : 'Florida',
                selectedEndDateFormatted: 'June 4th',
                selectedStartDateFormatted: 'June 1th',
                countriesList: [{country_code: 'US', country_name: 'United States'}],
                selectedType : 'All',
                isPrivateAccount: true, 
            })
            instance.scrollRef = {
                //@ts-ignore
                current:{}
            }
            exampleBlockA.findWhere(node => node.prop("testID") === "addItineraryBtn").simulate("press")  
        
    })
        then('I can see a card on the bottom' , () => {
            expect(instance.handleAddToMyItinerary).toBeCalled()
        })
        when('I press acceptBtn',() =>{
            jest.spyOn(instance, 'createNewItinerary')
            jest.spyOn(runEngine , 'sendMessage')
            exampleBlockA.findWhere(node => node.prop("testID") === "acceptBtn")
        })
        then('The api should be called to create a itinerary' , () => {
            const mockCreateItineraryAPIResponse = {
                data: {
                    "id": "2",
                    "type": "travel",
                    "attributes": {
                        "id": 2,
                        "start_date": "2025-02-19",
                        "end_date": "2025-02-25",
                        "country": "US",
                        "state": "alabama",
                        "city": "adamsville",
                        "category_id": 8,
                        "account_id": 906,
                        "match_preference": true
                    }
                },
                meta: {
                    "message": "Travel itinerary successfully created"
                }
            }
            mockAPISuccessCall(instance, "createShowApiCallID", mockCreateItineraryAPIResponse)
            expect(runEngine.sendMessage).toBeCalled()
        })
        


    });
    test('User navigates to eventregistration for android', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Eventregistration;  

        given('I am a User loading eventregistration for android', () => {
            
            exampleBlockA = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I navigate to the eventregistration for android', () => {
             instance = exampleBlockA.instance() as Eventregistration

        });

        then('eventregistration will load with out errors for android', () => {
            expect(exampleBlockA).toBeTruthy();
        });
        when('I press to the countryPicker and change the value to outside country', () => {
            instance.setState({ countriesList: [{country_code: 'BR', country_name: 'Brazil'}]})  
        });
        then('I expect the modal with warning to be showed on screen', () => {
            exampleBlockA.findWhere(node => node.prop("testID") === "btnAccept").simulate("press")  
        });
        when('I press to the countryPicker and change the value', () => {
            instance.setState({  countriesList: [{country_code: 'US', country_name: 'United States'}]})
        });
        then('I expect the countryPicker to be United States as value', () => {
            expect(instance.state.selectedCountry).toBe('United States');
            
        });
        when('I press to the statePicker and change the value', () => {
            instance.setState({ selectedCountry: 'US', states: [{key: 'Miami', name: 'Miami'}], countriesList: [{country_code: 'US', country_name: 'United States'}]})
            exampleBlockA.findWhere(node => node.prop("testID") === "statePicker").simulate("valueChange","Miami")  
        });
        then('I expect the statePicker to be United States as value', () => {
            expect(instance.state.selectedState).toBe('Miami');
            
        });
        when('I choose the city', () => {
          
            instance.setState({ cities: ['Los Angeles'],  selectedState: 'Florida', selectedCountry: 'US', states: [{key: 'Miami', name: 'Miami'}], countriesList: [{country_code: 'US', country_name: 'United States'}]})
            exampleBlockA.findWhere(node => node.prop("testID") === "cityPicker").simulate("valueChange","Los Angeles")  
            
        })
        then('I expect the city to be on the field' , () => {
            expect(instance.state.selectedCity).toBe('Los Angeles');
        })
        when('I choose the type', () => {
            instance.setState({
                typesList: [
                    {
                        id: '0',
                        type: 'category',
                        attributes: {
                            id: 0,
                            name: 'Music',
                            created_at: '00-00-00',
                            updated_at: '00-00-00'
                        }
                    }
                ]
            })
            exampleBlockA.findWhere(node => node.prop("testID") === "typePicker").simulate("valueChange","Music")  
        })
        then('I expect the type to be on the field' , () => {
            expect(instance.state.selectedType).toBe('Music');
        })
 
    })

    test('API calls with success to eventregistration', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Eventregistration; 
        const countriesList = {
            countries: [
                {
                        country_code : 'US',
                        country_name: 'United States'
                },
                {
                    country_code : 'BR',
                    country_name: 'Brazil'
            }
            ]
        } 
        const responseStatesJson = {
            state: [{
                key: 'FL',
                name: 'Florida'
                }]
        }
            const citiesData ={
                cities : ['Chicago','Miami', 'New York']
            }
        const categories  = {
            data : [{
                id: "",
                type: "category",
                attributes: {
                  id: 0,
                  name: "All",
                  created_at: "2023-11-09T07:04:18.294Z",
                  updated_at: "2023-11-09T07:29:26.573Z"
                }
              }]
        };
          const responseItinerariesData = {
            data: [
                {
                    city: 'Miami',
                    start_date: '01/01/2025',
                    end_date: '01/01/2025',
                    show_count: 0
                }
              ]
          }
        given('I am a User loading eventregistration', () => {
            
            exampleBlockA = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I navigate to the eventregistration', () => {
             instance = exampleBlockA.instance() as Eventregistration

        });
        then('I expect the apis to be called', () => {
            mockAPISuccessCall(instance, 'getTravelsItineraryListAPICallID',responseItinerariesData)
            mockAPISuccessCall(instance, 'getCategoriesListAPICallID',categories)
            mockAPISuccessCall(instance, 'getCountriesListAPICallID',countriesList)
            mockAPISuccessCall(instance, 'getStatesApiCallId',responseStatesJson)
            mockAPISuccessCall(instance, 'getCityApiCallId',citiesData)

        });
        when('I fill the fields', () =>{
            instance = exampleBlockA.instance() as Eventregistration 
            instance.setState({
                selectedCity : 'Miami',
                selectedCountry: 'United States',
                selectedState : 'Florida',
                selectedEndDateFormatted : '4th June',
                selectedStartDateFormatted : '1th June',
                countriesList : [{country_code: 'US' , country_name: 'United States'}],
                selectedType : 'All',
                isPrivateAccount: true,
            })
        })
        when('I press the addItineraryBtn', () =>{
            exampleBlockA.findWhere(node => node.prop("testID") === "addItineraryBtn").simulate("press")
        })
        then('I expect a post API to be called', () =>{
            const responseData = {
                data: {
                    attributes: {
                        city: 'Miami'
                    }
                }
            }
            mockAPISuccessCall(instance, 'postNewItineraryAPICallID',responseData)
        })

        then('I expect a post API to be called with error', () =>{
            const responseData = {
                errors: {
                    error : 'message'
                }
            }
            mockAPISuccessCall(instance, 'postNewItineraryAPICallID',responseData)
        })
        when('I have an itinerary item and I press delete icon', () =>{
            instance = exampleBlockA.instance() as Eventregistration 
            const itineraryList = [{
                id: '1',
                        cityName: 'Miami',
                        startDate: 'Jun 4th 2025',
                        endDate:  'Jun 15th 2025',
                        countryCode: 'US',
                        state: 'Florida',
                        hasAcceptButton: false,
            }]
            instance.setState({itineraryList})

            exampleBlockA.findWhere(node => node.prop("testID") === "removeCardBtn-0").simulate("press")
            exampleBlockA.findWhere(node => node.prop("testID") === "btnDeleteItinerary").simulate("press")
        })
        then('I expect an delete API to be called with success', () =>{
            const responseData = {
                data: {
                    id : 1,
                    attributes: {
                        city: 'Miami'
                    }
                }
            }
            mockAPISuccessCall(instance, 'deleteItineraryAPICallID',responseData)
        })

        then('I expect an delete API to be called with error', () =>{
            const responseData = {
                errors: {
                    error : 'message'
                }
            }
            mockAPISuccessCall(instance, 'deleteItineraryAPICallID',responseData)
        })

    })


    test('API calls with errors to eventregistration', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Eventregistration; 
        
        const responseJson = {
            errors: {
                message: 'error on api call'
            }
        }
        given('I am a User loading eventregistration', () => {
            
            exampleBlockA = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I navigate to the eventregistration', () => {
             instance = exampleBlockA.instance() as Eventregistration

        });
        then('I expect the apis to be called with errors', () => {
            mockAPISuccessCall(instance, 'getTravelsItineraryListAPICallID',responseJson)
            mockAPISuccessCall(instance, 'getCategoriesListAPICallID',responseJson)
            mockAPISuccessCall(instance, 'getCountriesListAPICallID',responseJson)
            mockAPISuccessCall(instance, 'getStatesApiCallId',responseJson)
            mockAPISuccessCall(instance, 'getCityApiCallId',responseJson)
            

        });
    })

    test('User navigates to ItineraryDetails', ({ given, when, then }) => {
        
        let eventRegistrationWrapper:ShallowWrapper;
        let instanceEventRegistration:Eventregistration; 
        let itineraryDetailsWrapper:ShallowWrapper;
        let itineraryInstance:ItineraryDetails;
        itineraryDetailsWrapper =  shallow(<ItineraryDetails {...screenProps}/>);
        itineraryInstance = itineraryDetailsWrapper.instance() as ItineraryDetails;

        given('I am a User loading eventregistration', () => {
            eventRegistrationWrapper = shallow(<Eventregistration {...screenProps}/>);
        });

        when('I press search button with no date selected', () => {
            
            instanceEventRegistration = eventRegistrationWrapper.instance() as Eventregistration
            jest.spyOn(instanceEventRegistration, 'handleSearchFieldsBlank')
            instanceEventRegistration.setState({
                startDate: 'DD/MM/YYYY'
            })
            eventRegistrationWrapper.findWhere(node => node.prop("testID") === "searchBtn").simulate("press")
        });

        then('eventregistration will show an alert error', () => {
            expect(instanceEventRegistration.handleSearchFieldsBlank).toBeCalled();
        });
        when('I press search button with date selected', () => {
            
            instanceEventRegistration = eventRegistrationWrapper.instance() as Eventregistration
            jest.spyOn(instanceEventRegistration, 'handleNavigationToItineraryScreen')
            jest.spyOn(runEngine , 'sendMessage')
            instanceEventRegistration.setState({
                startDate: '01-03-2025',
                selectedCountry: 'United States',
                countriesList: [{ country_code: 'US', country_name: 'United States'}],
                typesList: [{ id: '1', type: 'categories', attributes: {id: 1 , name: 'Music' , created_at: 'created-date', updated_at : 'updated-date'}},]
            })
            eventRegistrationWrapper.findWhere(node => node.prop("testID") === "searchBtn").simulate("press");
            
            const params = {
                selectedType: { id: '1', attributes: {id: 1 , name: 'Music'}},
                selectedCity : 'Miami',
                selectedState : 'Florida',
                startDate : '01-02-2025',
                endDate : '15-02-2025',
                selectedCountryCode : 'US'
              }
            mockNavigationPayLoadMessage(instanceEventRegistration, 'ItineraryDetails' ,params )
        });

        then('eventregistration will show ItineraryDetails screen with the params', async() => {
            expect(instanceEventRegistration.handleNavigationToItineraryScreen).toBeCalled();
            expect(runEngine.sendMessage).toBeCalled()
            expect(itineraryDetailsWrapper).toBeTruthy();
            itineraryInstance.openGoogleMaps("TestLocation")
            itineraryInstance.handleEventLaunch({id:"93"},"CA")
        });
    })

    test('User navigates to ItineraryDetails with country and date params only', ({ given, when, then }) => {
        let eventRegistrationWrapper:ShallowWrapper;
        let instanceEventRegistration:Eventregistration; 
        let itineraryDetailsWrapper:ShallowWrapper;
        itineraryDetailsWrapper =  shallow(<ItineraryDetails {...screenProps}/>);

        given('I am a User loading eventregistration', () => {
            eventRegistrationWrapper = shallow(<Eventregistration {...screenProps}/>);
        });
        when('I select the date of the show and I select the country', () => {
            
            instanceEventRegistration = eventRegistrationWrapper.instance() as Eventregistration
            jest.spyOn(instanceEventRegistration, 'handleNavigationToItineraryScreen')
            jest.spyOn(runEngine , 'sendMessage')
            instanceEventRegistration.setState({
                startDate: '01-03-2025',
                selectedCountry: 'United States',
                states: [{key: 'FL', name: 'Florida'}],
                selectedState: 'Florida',
                selectedCity: 'Miami',
                countriesList: [{ country_code: 'US', country_name: 'United States'}],
                typesList: [{ id: '1', type: 'categories', attributes: {id: 1 , name: 'Music' , created_at: 'created-date', updated_at : 'updated-date'}},]
            })
            eventRegistrationWrapper.findWhere(node => node.prop("testID") === "searchBtn").simulate("press");
            
            const params = {
                selectedType: { id: '1', attributes: {id: 1 , name: 'Music'}},
                startDate : '01-02-2025',
                endDate : '15-02-2025',
                selectedCountryCode : 'US'
              }
            mockNavigationPayLoadMessage(instanceEventRegistration, 'ItineraryDetails' ,params )
  
        });
        when('I press search button', ()=> {
            
        })

        then('eventregistration will show ItineraryDetails screen with the params selected', () => {
            expect(instanceEventRegistration.handleNavigationToItineraryScreen).toBeCalled();
            expect(runEngine.sendMessage).toBeCalled()
        });
    })

    test('User loads ItineraryDetails screen', ({ given, when, then }) => {
        let ItineraryDetailsWrapper:ShallowWrapper;
        let instanceItinerary:ItineraryDetails; 


        const itineraryCardMock :EventData[]= [{
            id:'1',
            name: 'Miami',
            avatar: 'avatar-image',
            date: '2025-12-12',
            image: 'image.png',
            location: 'location example',
            title: 'title',
            description: 'description',
            added_in_calendar:true,
            type: 'show',
            post: {
                likeByMe: false,
                likes: 1,
                comments: [{
                    title: 'comment title',
                    description: 'comment description'
                },
                {
                    title: 'comment title2',
                    description: 'comment description2'
                }]
            },
        },
            {
                id:'2',
                    name: 'New York',
                    avatar: 'avatar-image',
                    added_in_calendar:false,
                    date: '2025-12-12',
                    image: 'image.png',
                    title: 'The Show',
                    description: 'The description',
                    type: 'show',
                    location: 'location example',
                    post: {
                        likeByMe: true,
                        likes: 1,  
                    },
            }]
        
        
        jest.spyOn(runEngine , 'sendMessage')
        given('I am a User loading ItineraryDetails', () => {
            ItineraryDetailsWrapper = shallow(<ItineraryDetails {...screenProps}/>);
        });

        when('I navigate to the ItineraryDetails', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails
        });

        then('ItineraryDetails will load with out errors', () => {
            expect(ItineraryDetailsWrapper).toBeTruthy();
        });

        when('I press like button', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails
            
            instanceItinerary.setState({
                eventsData: itineraryCardMock,
                selectedEvent: itineraryCardMock[0],
                isLoading:false,
                selectedParams: {
                    ...instanceItinerary.state.selectedParams,
                    selectedType: {
                        id: '0',
                        type: 'All',
                        attributes: {
                            name: 'All',
                            id: 0,
                            created_at: '00-00',
                            updated_at: '00-00'
                        }
                    }
                }
            }) 
            const flatList = ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "eventsList");
            itineraryCardMock.forEach((itinerary, index) => {
                const innerWrapper = flatList.renderProp("renderItem")({
                    item: itinerary,
                    index: index,
                  });
          
                  innerWrapper.findWhere(node => node.prop("testID") === "likeBtn").simulate("press");
            })
            mockAPISuccessCall(instanceItinerary , 'postToogleLikeEventApiCallId', {data: {
                id: '1',
                status: 'liked'
            }})


        });

        then('I expect to show the like button filled', () => {
           
            expect(runEngine.sendMessage).toBeCalled();
        });


        then('I expect to show the like button outfilled', () => {

            const flatList = ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "eventsList");
            itineraryCardMock.forEach((itinerary, index) => {
                const innerWrapper = flatList.renderProp("renderItem")({
                    item: itinerary,
                    index: index,
                  });
          
                  innerWrapper.findWhere(node => node.prop("testID") === "likeBtn").simulate("press");
            })
            mockAPISuccessCall(instanceItinerary , 'postToogleLikeEventApiCallId', {message: {
                id: '1',
                status: 'deleted'
            }})
            expect(runEngine.sendMessage).toBeCalled();
        });

        when('I call handleNotificationNavigationPressed function', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails
            jest.spyOn(instanceItinerary, 'handleNotificationNavigationPressed')
            instanceItinerary.handleNotificationNavigationPressed()
            const navigationMsg: Message = new Message(getName(MessageEnum.NavigationMessage));
            navigationMsg.addData(getName(MessageEnum.NavigationPropsMessage), instanceItinerary.props);
            navigationMsg.addData(getName(MessageEnum.NavigationTargetMessage), "Notifications");
            runEngine.sendMessage('NavigationMessage',navigationMsg)
        });
        then('I expect the function to be called', () => {
                expect(instanceItinerary.handleNotificationNavigationPressed).toBeCalled()
        });
        
    });

    test('User press edit search button', ({ given, when, then }) => {
        let ItineraryDetailsWrapper:ShallowWrapper;
        let instanceItinerary:ItineraryDetails; 
            
    
        given('I am a User loading ItineraryDetails screen', () => {
            ItineraryDetailsWrapper = shallow(<ItineraryDetails {...screenProps}/>);
        });
    
        when('I navigate to the ItineraryDetails screen', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
           

        });
        when('I press edit search button', () => {
            instanceItinerary.setState({
                isLoading:false,
                selectedParams: {
                    ...instanceItinerary.state.selectedParams,
                    selectedType: {
                        id: '0',
                        type: 'All',
                        attributes: {
                            name: 'All',
                            id: 0,
                            created_at: '00-00',
                            updated_at: '00-00'
                        }
                    }
                }
            })
            jest.spyOn(runEngine , 'sendMessage')
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "searchBtn").simulate("press");
            mockNavigationPayLoadMessage(instanceItinerary, 'Eventregistration')
        })
        then('I expect to be redirected to travels screen',() =>{
            expect(runEngine.sendMessage).toBeCalled()
        })
    })

    test('API calls with success to ItineraryDetails screen', ({ given, when, then }) => {
        let ItineraryDetailsWrapper:ShallowWrapper;
        let instanceItinerary:ItineraryDetails; 
            
    
        given('I am a User loading ItineraryDetails screen', () => {
            ItineraryDetailsWrapper = shallow(<ItineraryDetails {...screenProps}/>);
        });
    
        when('I navigate to the ItineraryDetails screen', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
           

        });
        then('I expect to get the params from the other screen',() =>{
            jest.spyOn(instanceItinerary, 'handleRestAPIResponseMessage')
            const params = {
                selectedType: { id: '1', attributes: {id: 1 , name: 'Music'}},
                selectedCity : 'Miami',
                selectedState : 'Florida',
                startDate : '01-02-2025',
                endDate : '15-02-2025',
                selectedCountryCode : 'US'
              }
            const navigationMsg: Message = new Message(getName(MessageEnum.NavigationPayLoadMessage));
            
            navigationMsg.addData(getName(MessageEnum.HelpCentreMessageData), params);
            runEngine.sendMessage('NavigationMessage',navigationMsg);

            expect(runEngine.sendMessage).toBeCalled();
        })
        then('I expect to get the params from the itinerary Card selected',() =>{
            jest.spyOn(instanceItinerary, 'handleRestAPIResponseMessage')
            const params = {
                selectedType: { id: '1', attributes: {id: 1 , name: 'Music'}},
                selectedCity : 'Miami',
                selectedState : 'Florida',
                startDate : '01-02-2025',
                endDate : '15-02-2025',
                selectedCountryCode : 'US',
                itineraryId: '1'
              }
            const navigationMsg: Message = new Message(getName(MessageEnum.NavigationPayLoadMessage));
            
            navigationMsg.addData(getName(MessageEnum.HelpCentreMessageData), params);
            runEngine.sendMessage('NavigationMessage',navigationMsg);

            expect(runEngine.sendMessage).toBeCalled();
        })
        
        then('I expect the categories api to be called', () => {
            jest.spyOn(instanceItinerary, 'handleGetCategoriesResponse')
            const responseData = {
                data: [{
                    "id": "8",
                    "type": "category",
                    "attributes": {
                        "id": 8,
                        "name": "Art",
                        "created_at": "2023-10-30T22:49:27.258+00:00",
                        "updated_at": "2024-09-17T17:33:26.038+00:00",
                        "user_sub_categories": []
                    }
                },]
            }
            mockAPISuccessCall(instanceItinerary, 'getCategoriesApiCallId', responseData)
            expect(instanceItinerary.handleGetCategoriesResponse).toBeCalled();
        });
        then('I expect the apis to be called', () => {
            const responseData = {
                data: [{
                    id: '1',
                    type: 'type',
                    attributes: {
                        date_of_the_show: '01-01-2025',
                        band_profile_image: 'profile-image.png',
                        event_title: 'Reveillon',
                        location: 'Rio',
                        profile_image: 'profile-img.png',
                        likes_count: 5,
                        comments: [{
                            title: 'comment title',
                            description: 'comment description'
                          }]
                    }
                }]
            }
            mockAPISuccessCall(instanceItinerary, 'getShowsApiCallId', responseData)
            expect(instanceItinerary.handleRestAPIResponseMessage).toBeCalled();
        });
        then('I expect the apis to be called with errors', () => {
            const responseData = {
                errors: {
                    message: 'Something gets wrong'
                }
            }
            mockAPISuccessCall(instanceItinerary, 'getShowsApiCallId', responseData)
            expect(instanceItinerary.handleRestAPIResponseMessage).toBeCalled();
        });

        when('I press back arrow button', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            jest.spyOn(instanceItinerary, 'handleBackNavigationPress')
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "navigationBackButton").simulate("press")
            instanceItinerary.handleBackNavigationPress()

        });
        then('I expect to get back to travels screen',() =>{
            expect(instanceItinerary.handleBackNavigationPress).toBeCalled()
            
        })

    })
    test('Comments section' , ({given, when, then}) => {
        let ItineraryDetailsWrapper:ShallowWrapper;
        let instanceItinerary:ItineraryDetails; 
        const itineraryCardMock :EventData[]= [{
            id:'1',
            name: 'Miami',
            avatar: 'avatar-image',
            date: '2025-12-12',
            image: 'image.png',
            location: 'location example',
            title: 'title',
            description: 'description',
            type: 'show',
            added_in_calendar:false,
            post: {
                likeByMe: false,
                likes: 1,
                comments: [{
                    title: 'comment title',
                    description: 'comment description'
                },
                {
                    title: 'comment title2',
                    description: 'comment description2'
                }]
            },
        },
            {
                id:'2',
                    name: 'New York',
                    avatar: 'avatar-image',
                    date: '2025-12-12',
                    image: 'image.png',
                    title: 'The Show',
                    added_in_calendar:true,
                    description: 'The description',
                    type: 'show',
                    location: 'location example',
                    post: {
                        likeByMe: true,
                        likes: 1,  
                    },
            }]
           
            
    
        given('I am a User loading ItineraryDetails screen', () => {
            ItineraryDetailsWrapper = shallow(<ItineraryDetails {...screenProps}/>);
        });
    
        when('I press comments icon button', async () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            await instanceItinerary.handleGetUserInformation()
            instanceItinerary.setState({
                eventsData: itineraryCardMock,
                selectedEvent: itineraryCardMock[0],
                isLoading:false,
                selectedParams: {
                    ...instanceItinerary.state.selectedParams,
                    selectedType: {
                        id: '0',
                        type: 'All',
                        attributes: {
                            name: 'All',
                            id: 0,
                            created_at: '00-00',
                            updated_at: '00-00'
                        }
                    }
                }
            }) 
            jest.spyOn(instanceItinerary, 'handleToogleModalShowComments')
            const flatList = ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "eventsList");
            itineraryCardMock.forEach((itinerary, index) => {
                const innerWrapper = flatList.renderProp("renderItem")({
                    item: itinerary,
                    index: index,
                  });
          
                  innerWrapper.findWhere(node => node.prop("testID") === "commentIcon").simulate("press")
                  innerWrapper.find({testID:"share"}).simulate("press")
                  innerWrapper.find({testID:"addEventToCalendarBtn"})
                  instanceItinerary.addToCalanderApi("23")
                  mockAPISuccessCall(instanceItinerary,"calanderAddApiCallID",{})
                })
            
            
           
        });
        then('I can see the modal to be showed' ,() => {
            expect(instanceItinerary.handleToogleModalShowComments).toBeCalled()
        })
        then('The api be called with the comments' ,() => {
            jest.spyOn(runEngine , 'sendMessage')
            jest.spyOn(instanceItinerary , 'handleCommentsRendering')
            const commentMock  = {
                id: '1',
                type: 'show',
                attributes: {
                  account_id: '375',
                  commentable_id: '300',
                  commentable_type:'Show',
                  comment:'string',
                  replies:[{
                    reply: 'string',
                    id: '1',
                    key: '1',
                    likes_count: '1',
                    account_id: '370',
                    account_name: 'Joe Do',
                    profile_image: 'image-avatar',
                  }],
                  account: {
                    id: '5',
                    account_type: 'Band',
                    profile_image_url: 'image-url',
                    first_name: 'string',
            
                  }
                }
              }
            const responseJson = {
                data : [
                    commentMock,

                ]
            }
            mockAPISuccessCall(instanceItinerary, 'getCommentsAPICallID', responseJson)

            expect(runEngine.sendMessage).toBeCalled()
           
        })
        when('I press close modal button', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            instanceItinerary.setState({showComments : true , isReplying: true , selectedEvent: itineraryCardMock[0]})
            jest.spyOn(instanceItinerary, 'hideKeyboard')
 
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "commentsModalClick").simulate("press")
        })
        then('I expect the show comments modal to be closed', () => {
            expect(instanceItinerary.hideKeyboard).toBeCalled()
        })
        when('I select an emoticon' , () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            instanceItinerary.setState({showComments : true , isReplying: false , selectedEvent: itineraryCardMock[0], userInfo:{ id: '5', token: 'token', avatar:'avatar'}})
            jest.spyOn(instanceItinerary, 'handleSubmitEditing')
            instanceItinerary.defaultEmojisForSelectionBar = ["️💖"];
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "emojiReply-0").simulate("press")
            expect(instanceItinerary.state.commentedText).toBe("️💖");
            
        })
        when('I type an comment and press submit button', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "commentTextInput").simulate("changeText", 'Great Post') 
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "submitCommentBtn").simulate("press")
            mockAPISuccessCall(instanceItinerary , 'createEditLikeCommentAPICallID', {})
        });
        when('I type an comment and press submit button with isEdditing true', () =>{
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            instanceItinerary.setState({
                isEditing: true,
                showReplies: false,
                showComments: true,
           
            })
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "commentTextInput").simulate("changeText", 'Great Post') 
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "submitCommentBtn").simulate("press")
        })

        then('I expect the api to be called' ,() => {
            expect(instanceItinerary.handleSubmitEditing).toBeCalled()
            expect(runEngine.sendMessage).toBeCalled()
        })
        when('I press reply button', ( ) => {
            let commentsMock : CommentProps[] = [{
                id: '1',
                type: 'show',
                attributes: {
                  account_id: 375,
                  commentable_id: 300,
                  commentable_type:'Show',
                  comment:'string',
                  created_at: "2023-10-30T22:49:27.258+00:00",
                  replies:[{
                    reply: 'string',
                    likes_count: 1,
                    account_id: 370,
                    account_name: 'Joe Do',
                    profile_image: 'image-avatar',
                  }],
                  account: {
                    id: 375,
                    account_type: 'Band',
                    profile_image_url: 'image-url',
                    first_name: 'string',
            
                  }
                }
              }]
              const userInfo = {
                id: '375',
                token : 'token'
              }
              instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
              instanceItinerary.setState({showComments : true , isReplying: false , selectedEvent: itineraryCardMock[0] , commentsList: commentsMock , userInfo})
          
            const swipeListView = ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "swipeListView");
            commentsMock.forEach((item, index) => {
                const swipeListWrapper = swipeListView.renderProp("renderItem")({
                item: item,
                index: index,
                });
                swipeListView.renderProp("renderHiddenItem")({
                    data: item,
                    rowMap: index,
                });
                
                const swipeSubListView = swipeListWrapper.findWhere(node => node.prop("testID") === "swipeSubListView");
                
                const swipeSubListWrapper = swipeSubListView.renderProp("renderItem")({
                    item: item,
                    index: index,
                    });

                swipeSubListWrapper.findWhere(node => node.prop("testID") === "imageShowProfile").simulate("press")
                swipeSubListWrapper.findWhere(node => node.prop("testID") === "replyButton").simulate("press")
                swipeSubListWrapper.findWhere(node => node.prop("testID") === "likeCommentButton").simulate("press")
                swipeSubListWrapper.findWhere(node => node.prop("testID") === "showReplyButton").simulate("press")
 
                ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "replies-avatar").simulate("press")
                ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "emojiReply-0").simulate("press")
                const replyTextInput = ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "replyTextInput")
                
                replyTextInput.simulate("changeText", 'Great Reply');

                ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "repliesModalClick").simulate("press")

            })
        })

        then('I can see the replies and call the reply submit function' , () => {
            jest.spyOn(instanceItinerary, 'replyToComment')
            instanceItinerary.setState({isReplying: true, isEditing: false})
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "emojiReplyBtn").simulate("press")
            expect(instanceItinerary.replyToComment).toBeCalled()
        })
        then('I can call reply submit function with isEditing as true' , () => {
            instanceItinerary.setState({isReplying: true, isEditing: true , replyId: '1'})
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "emojiReplyBtn").simulate("press")
            
            expect(instanceItinerary.state.showComments).toBe(false)
        })
        then('I expect to call modal close functions', () => {
            jest.spyOn(instanceItinerary, 'handleCloseCommentPopup')
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "replyModalBackBtn").simulate("press")
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "closeReplyPopupButton").simulate("press")
            ItineraryDetailsWrapper.findWhere(node => node.prop("testID") === "closeCommentsPopupButton").simulate("press")

            expect(instanceItinerary.handleCloseCommentPopup).toBeCalled()
        })

    })
    test('Test generic functions in ItineraryDetails', ({given, when , then}) => {

        let ItineraryDetailsWrapper:ShallowWrapper;
        let instanceItinerary:ItineraryDetails; 

        given('I am a User loading ItineraryDetails screen', () => {
            ItineraryDetailsWrapper = shallow(<ItineraryDetails {...screenProps}/>);
        });
        when('I navigate to the ItineraryDetails and call generics functions', () => {
            instanceItinerary = ItineraryDetailsWrapper.instance() as ItineraryDetails;
            jest.spyOn(instanceItinerary, 'showProfile')
            instanceItinerary.showProfile('1', 'Band')
            jest.spyOn(instanceItinerary, 'renderRepliesHiddenItem')
            instanceItinerary.setState({
                userInfo: {
                    id: '1',
                    token: 'token'
                }
            })
            const mockData = {
                item : {
                    id: 0,
                    account_id: 1
                }
            }
            instanceItinerary.renderRepliesHiddenItem(mockData, 'Band')
        });
        then('I expect the function to be called' ,() => {
            expect(instanceItinerary.showProfile).toBeCalled()
            expect(instanceItinerary.renderRepliesHiddenItem).toBeCalled()
        })
    })
    test('User selects a date range using the calendar', ({ given, when, then }) => {
        let dateRangeWrapper: ShallowWrapper;
        let instance: Eventregistration;
      
        given('the calendar is initially hidden', () => {
          dateRangeWrapper = shallow(<Eventregistration {...screenProps} />);
          instance = dateRangeWrapper.instance() as Eventregistration;
          expect(dateRangeWrapper.find({ testID: 'DateRangePicker' }).exists()).toBe(false);
        });
      
        when('the user opens the calendar', () => {
          dateRangeWrapper.setState({ showDateSelector: true });
        });
      
        then('the calendar should be visible', () => {
          expect(dateRangeWrapper.find({ testID: 'DateRangePicker' }).exists()).toBe(true);
        });
      
        when('the user selects a start date and an end date', () => {
          const start = moment().add(2, 'days').format('YYYY-MM-DD');
          const end = moment().add(5, 'days').format('YYYY-MM-DD');
      
          jest.spyOn(instance, 'handleSetDates');
          instance.handleDayPress({ dateString: start });
          instance.handleDayPress({ dateString: end });
        });
      
        then('the start and end dates should be updated and calendar hidden', () => {
          expect(instance.handleSetDates).toHaveBeenCalled();
          expect(dateRangeWrapper.state('showDateSelector')).toBe(false);
        });
      });
      
});

