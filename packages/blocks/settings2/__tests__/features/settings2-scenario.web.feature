Feature: settings2

    Scenario: User navigates to settings2
        Given I am a User loading settings2
        When I navigate to the settings2
        Then settings2 will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors