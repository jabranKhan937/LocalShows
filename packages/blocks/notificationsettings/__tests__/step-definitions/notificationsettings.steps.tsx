import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
export const configJSON = require("../../config.json");

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Notificationsettings from "../../src/Notificationsettings"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Notificationsettings"
  }

const feature = loadFeature('./__tests__/features/notificationsettings-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to notificationsettings', ({ given, when, then }) => {
        let notificationSettingsWrapper:ShallowWrapper;
        let instance:Notificationsettings; 

        given('I am a User loading notificationsettings', () => {
            notificationSettingsWrapper = shallow(<Notificationsettings {...screenProps}/>)
            expect(notificationSettingsWrapper).toBeTruthy()
            expect(notificationSettingsWrapper).toMatchSnapshot()     

            instance = notificationSettingsWrapper.instance()as Notificationsettings;

            const getNotificationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            getNotificationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getNotificationAPI.messageId);
            getNotificationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": [
                    {
                        "id": "2",
                        "type": "notification_settings",
                        "attributes": {
                            "title": "Settings #1 update",
                            "description": "Description updated",
                            "state": "active",
                            "notification_groups": {
                                "data": [
                                    {
                                        "id": "3",
                                        "type": "notification_groups",
                                        "attributes": {
                                            "group_type": "order_group",
                                            "group_name": "group #3",
                                            "notification_setting_id": 2,
                                            "state": "active",
                                            "notification_subgroups": {
                                                "data": [
                                                    {
                                                        "id": "2",
                                                        "type": "notification_subgroups",
                                                        "attributes": {
                                                            "subgroup_type": "order_shipped",
                                                            "subgroup_name": "name 4",
                                                            "notification_group_id": 3,
                                                            "state": "inactive"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            });
            instance.notificationAPICallId = getNotificationAPI.messageId
            runEngine.sendMessage("Unit Test", getNotificationAPI)

        });

        when('I navigate to the notificationsettings', () => {
             instance = notificationSettingsWrapper.instance() as Notificationsettings
        });

        then('notificationsettings will load with out errors', () => {
            expect(notificationSettingsWrapper).toBeTruthy()
            expect(notificationSettingsWrapper).toMatchSnapshot()
            
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(notificationSettingsWrapper).toBeTruthy()
            expect(notificationSettingsWrapper).toMatchSnapshot()
        });
    });

    test('Set notification settings active or inactive', ({ given, when, then }) => {
        let notificationSettingsWrapper:ShallowWrapper;
        let instance:Notificationsettings; 

        given('I am a User attempting to set notification settings active or inactive', () => {
            notificationSettingsWrapper = shallow(<Notificationsettings {...screenProps}/>)
            expect(notificationSettingsWrapper).toBeTruthy()
            expect(notificationSettingsWrapper).toMatchSnapshot()
        });

        when('I set notification settings active or inactive', () => {
             instance = notificationSettingsWrapper.instance() as Notificationsettings
            //  instance.setState({email: "", password: "password!"})
        });

        then('notification settings should set active or inactive', () => {
            var data={
                "title": "Settings #1 update",
                "description": "Description updated",
                "state": "inactive"
            }
            expect(instance.postNotificationDataRequest(configJSON.updateNotificationAPIEndPoint+`2`,data,"setNotification")).toBe(true);

            const msgSetNotificationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgSetNotificationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSetNotificationAPI);
            msgSetNotificationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": {
                    "id": "2",
                    "type": "notification_settings",
                    "attributes": {
                        "title": "Settings #1 update",
                        "description": "Description updated",
                        "state": "inactive",
                        "notification_groups": {
                            "data": [
                                {
                                    "id": "3",
                                    "type": "notification_groups",
                                    "attributes": {
                                        "group_type": "order_group",
                                        "group_name": "group #3",
                                        "notification_setting_id": 2,
                                        "state": "inactive",
                                        "notification_subgroups": {
                                            "data": [
                                                {
                                                    "id": "2",
                                                    "type": "notification_subgroups",
                                                    "attributes": {
                                                        "subgroup_type": "order_shipped",
                                                        "subgroup_name": "name 4",
                                                        "notification_group_id": 3,
                                                        "state": "inactive"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            });

            msgSetNotificationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSetNotificationAPI.messageId);
            instance.setNotificationAPICall = msgSetNotificationAPI.messageId
            runEngine.sendMessage("Unit Test", msgSetNotificationAPI);
        });
    });

    test('Set notification settings group active or inactive', ({ given, when, then }) => {
        let notificationSettingsWrapper:ShallowWrapper;
        let instance:Notificationsettings; 

        given('I am a User attempting to set notification settings group active or inactive', () => {
            notificationSettingsWrapper = shallow(<Notificationsettings {...screenProps}/>)
            expect(notificationSettingsWrapper).toBeTruthy()
            expect(notificationSettingsWrapper).toMatchSnapshot()
        });

        when('I set notification settings group active or inactive', () => {
             instance = notificationSettingsWrapper.instance() as Notificationsettings
            //  instance.setState({email: "", password: "password!"})
        });

        then('notification settings group should set active or inactive', () => {
            var data={
                "group_type": "order_group",
                "group_name": "group #3",
                "state": "active",
                "notification_setting_id": 2
            }
            expect(instance.postNotificationDataRequest(configJSON.updateNotificationGroupAPIEndPoint+`3`,data,"setGroupNotification")).toBe(true);

            const msgSetNotificationGroupAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgSetNotificationGroupAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSetNotificationGroupAPI);
            msgSetNotificationGroupAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": {
                    "id": "3",
                    "type": "notification_groups",
                    "attributes": {
                        "group_type": "order_group",
                        "group_name": "group #3",
                        "notification_setting_id": 2,
                        "state": "active",
                        "notification_subgroups": {
                            "data": [
                                {
                                    "id": "2",
                                    "type": "notification_subgroups",
                                    "attributes": {
                                        "subgroup_type": "order_shipped",
                                        "subgroup_name": "name 4",
                                        "notification_group_id": 3,
                                        "state": "inactive"
                                    }
                                }
                            ]
                        }
                    }
                }
            });

            msgSetNotificationGroupAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSetNotificationGroupAPI.messageId);
            instance.setNotificationGroupAPICall = msgSetNotificationGroupAPI.messageId
            runEngine.sendMessage("Unit Test", msgSetNotificationGroupAPI);
        });
    });

    test('Set notification settings sub group active or inactive', ({ given, when, then }) => {
        let notificationSettingsWrapper:ShallowWrapper;
        let instance:Notificationsettings; 

        given('I am a User attempting to set notification settings sub group active or inactive', () => {
            notificationSettingsWrapper = shallow(<Notificationsettings {...screenProps}/>)
            expect(notificationSettingsWrapper).toBeTruthy()
            expect(notificationSettingsWrapper).toMatchSnapshot()
        });

        when('I set notification settings sub group active or inactive', () => {
             instance = notificationSettingsWrapper.instance() as Notificationsettings
            //  instance.setState({email: "", password: "password!"})
        });

        then('notification settings sub group should set active or inactive', () => {
            var data={
                "subgroup_type": "order_shipped",
                "subgroup_name": "name 4",
                "notification_group_id": 3,
                "state": "active"
            }
            expect(instance.postNotificationDataRequest(configJSON.updateNotificationSubGroupAPIEndPoint+`2`,data,"setSubGroupNotification")).toBe(true);

            const msgSetNotificationSubGroupAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgSetNotificationSubGroupAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSetNotificationSubGroupAPI);
            msgSetNotificationSubGroupAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": {
                    "id": "2",
                    "type": "notification_subgroups",
                    "attributes": {
                        "subgroup_type": "order_shipped",
                        "subgroup_name": "name 4",
                        "notification_group_id": 3,
                        "state": "active"
                    }
                }
            });

            msgSetNotificationSubGroupAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSetNotificationSubGroupAPI.messageId);
            instance.setNotificationSubGroupAPICall = msgSetNotificationSubGroupAPI.messageId
            runEngine.sendMessage("Unit Test", msgSetNotificationSubGroupAPI);
        });
    });


});
