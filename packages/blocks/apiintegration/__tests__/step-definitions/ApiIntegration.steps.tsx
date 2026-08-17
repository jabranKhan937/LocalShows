import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import ApiIntegration from "../../src/ApiIntegration"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "ApiIntegration"
  }

const feature = loadFeature('./__tests__/features/ApiIntegration-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to ApiIntegration', ({ given, when, then }) => {
        let apiIntegrationBlock:ShallowWrapper;
        let instance:ApiIntegration; 

        given('I am a User loading ApiIntegration', () => {
            apiIntegrationBlock = shallow(<ApiIntegration {...screenProps}/>)
        });

        when('I navigate to the ApiIntegration', () => {
             instance = apiIntegrationBlock.instance() as ApiIntegration
        });

        then('ApiIntegration will load with out errors', () => {
            expect(apiIntegrationBlock).toBeTruthy()
        });

        then('I can select the button with with out errors', () => {
            let buttonComponent = apiIntegrationBlock.findWhere((node) => node.prop('testID') === 'btnExample');
            buttonComponent.simulate('press')
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(apiIntegrationBlock).toBeTruthy()
        });
    });


});
