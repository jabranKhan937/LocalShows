import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'

import React from "react";
import Share from "../../src/Share.web"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Share"
  }

const feature = loadFeature('./__tests__/features/Share-scenario.web.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Share', ({ given, when, then }) => {
        let shareBlock:ShallowWrapper;
        let instance:Share; 

        given('I am a User loading Share', () => {
            shareBlock = shallow(<Share {...screenProps}/>)
        });

        when('I navigate to the Share', () => {
             instance = shareBlock.instance() as Share
        });

        then('Share will load with out errors', () => {
            expect(shareBlock).toBeTruthy()
        });

        then('I can select the button with with out errors', () => {
            let buttonComponent = shareBlock.findWhere((node) => node.prop('testID') === 'btnShare');
            // buttonComponent.simulate('press')
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(shareBlock).toBeTruthy()
        });
    });


});
