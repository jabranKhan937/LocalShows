import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
export const configJSON = require("../../config.json");
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Favourites from "../../src/Favourites"
import AddFavourites from "../../src/AddFavourites"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Favourites"
  }

const feature = loadFeature('./__tests__/features/favourites-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to favourites', ({ given, when, then }) => {
        let FavouritesWrapper:ShallowWrapper;
        let instance:Favourites; 

        given('I am a User loading favourites', () => {
            FavouritesWrapper = shallow(<Favourites {...screenProps}/>)
            expect(FavouritesWrapper).toBeTruthy();    

            instance = FavouritesWrapper.instance()as Favourites;

            const getFavouritesAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            getFavouritesAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getFavouritesAPI.messageId);
            getFavouritesAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": {
                    "id": "11",
                    "type": "favourite",
                    "attributes": {
                        "favouriteable_id": 3,
                        "favouriteable_type": "AccountBlock::Account",
                        "user_id": 3,
                        "created_at": "2022-03-03T20:17:54.117Z",
                        "updated_at": "2022-03-03T20:17:54.117Z"
                    }
                }
            });
            instance.favouritesApiCallId = getFavouritesAPI.messageId
            runEngine.sendMessage("Unit Test", getFavouritesAPI)

        });

        when('I navigate to the favourites', () => {
             instance = FavouritesWrapper.instance() as Favourites

        });

        then('favourites will load with out errors', () => {
            expect(FavouritesWrapper).toBeTruthy();
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(FavouritesWrapper).toBeTruthy();
        });
    });

    test('User can view any favourites', ({ given, when, then }) => {
        let FavouritesWrapper:ShallowWrapper;
        let instance:Favourites; 
        
        
        
        given('I am a User attempting to view a favourites', () => {
            FavouritesWrapper = shallow(<Favourites {...screenProps}/>)
            expect(FavouritesWrapper).toBeTruthy();
        });

        when('I view a favourites', () => {
             instance = FavouritesWrapper.instance() as Favourites
             instance.setState({
                activeId:1,
                favouriteType: "AccountBlock::Account",
                favouriteId: 1,
                activeCreatedAt:"2020-10-13T09:37:02.001Z",
                activeUpdatedAt:"2020-10-13T09:37:02.001Z",
                isVisible:!instance.state.isVisible})
        });

        then('I can view favourites will load with out errors', () => {
        
            expect(instance.state.isVisible).toBe(true);
        });

    });

    test('User can delete any favourites', ({ given, when, then }) => {
        let FavouritesWrapper:ShallowWrapper;
        let instance:Favourites; 
        
        given('I am a User attempting to delete a favourites', () => {
            FavouritesWrapper = shallow(<Favourites {...screenProps}/>)
            expect(FavouritesWrapper).toBeTruthy();
        });

        when('I delete a favourites', () => {
             instance = FavouritesWrapper.instance() as Favourites
             instance.deleteFavouritesApiCall(configJSON.favouritesApiEndPoint+`/1`)
        });

        then('I can delete favourites will load with out errors', () => {
        
            expect(instance.deleteFavouritesApiCall(configJSON.favouritesApiEndPoint+`/1`)).toBe(true);
        });
        then('Rest Api will return success response', () => {
            const deleteSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            deleteSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), deleteSucessRestAPI.messageId);
            deleteSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {});
            instance.deleteFavouritesApiCallId = deleteSucessRestAPI.messageId
            runEngine.sendMessage("Unit Test", deleteSucessRestAPI)

        });

    });

    test('Empty title', ({ given, when, then }) => {
        let AddInteractiveFavouritessWrapper:ShallowWrapper;
        let instance:AddFavourites; 

        given('I am a user attempting to add a favourites', () => {
            AddInteractiveFavouritessWrapper= shallow(<AddFavourites {...screenProps}/>)
            instance = AddInteractiveFavouritessWrapper.instance()as AddFavourites;
            expect(AddInteractiveFavouritessWrapper).toBeTruthy();
        });

        when('I am adding a favourites with empty title', () => {
            instance = AddInteractiveFavouritessWrapper.instance() as AddFavourites
            instance.setState({title: ""})
        });

        then('add favourites should fail', async() => {
            expect(await instance.addFavouritesCall()).toBe(false);
        });
    });

    test('Empty content', ({ given, when, then }) => {
        let AddInteractiveFavouritessWrapper:ShallowWrapper;
        let instance:AddFavourites; 

        given('I am a user attempting to add a favourites', () => {
            AddInteractiveFavouritessWrapper= shallow(<AddFavourites {...screenProps}/>)
            instance = AddInteractiveFavouritessWrapper.instance()as AddFavourites;
            expect(AddInteractiveFavouritessWrapper).toBeTruthy();
        });

        when('I am adding a favourites with empty content', () => {
            instance = AddInteractiveFavouritessWrapper.instance() as AddFavourites
            instance.setState({title: "FAQ title",content:""})
        });

        then('add favourites should fail', async() => {
            expect(await instance.addFavouritesCall()).toBe(false);
        });

    });

    test('title and content', ({ given, when, then }) => {
        let AddInteractiveFavouritessWrapper:ShallowWrapper;
        let instance:AddFavourites; 

        given('I am a user attempting to add a favourites', () => {
            AddInteractiveFavouritessWrapper= shallow(<AddFavourites {...screenProps}/>)
            instance = AddInteractiveFavouritessWrapper.instance()as AddFavourites;
            expect(AddInteractiveFavouritessWrapper).toBeTruthy();
        });

        when('I am adding a favourites with title and content', () => {
            instance = AddInteractiveFavouritessWrapper.instance() as AddFavourites
            instance.setState({favouriteId: 2, favouriteType: "AccountBlock::Account"})
        });

        then('add favourites should succeed', () => {
            expect(instance.addFavouritesCall()).toBe(true);
        });
        then('Rest Api will return success response',()=>{
            const addFavouritesSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            addFavouritesSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), addFavouritesSucessRestAPI.messageId);
            addFavouritesSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "data": {
                    "id": "11",
                    "type": "favourite",
                    "attributes": {
                        "favouriteable_id": 3,
                        "favouriteable_type": "AccountBlock::Account",
                        "user_id": 3,
                        "created_at": "2022-03-03T20:17:54.117Z",
                        "updated_at": "2022-03-03T20:17:54.117Z"
                    }
                }
            })

            instance.addFavouritesApiCallId = addFavouritesSucessRestAPI.messageId
            runEngine.sendMessage("Unit Test", addFavouritesSucessRestAPI)

        })

    });

});
