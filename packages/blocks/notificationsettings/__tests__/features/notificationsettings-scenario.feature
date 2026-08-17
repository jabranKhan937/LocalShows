Feature: notificationsettings

    Scenario: User navigates to notificationsettings
        Given I am a User loading notificationsettings
        When I navigate to the notificationsettings
        Then notificationsettings will load with out errors
        And I can leave the screen with out errors

    Scenario: Set notification settings active or inactive
        Given I am a User attempting to set notification settings active or inactive
        When I set notification settings active or inactive
        Then notification settings should set active or inactive

    Scenario: Set notification settings group active or inactive
        Given I am a User attempting to set notification settings group active or inactive
        When I set notification settings group active or inactive
        Then notification settings group should set active or inactive

    Scenario: Set notification settings sub group active or inactive
        Given I am a User attempting to set notification settings sub group active or inactive
        When I set notification settings sub group active or inactive
        Then notification settings sub group should set active or inactive