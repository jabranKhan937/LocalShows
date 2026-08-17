Feature: hamburgermenu

    Scenario: User navigates to hamburgermenu
        Given I am a User loading hamburgermenu
        When I navigate to the hamburgermenu
        Then hamburgermenu will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors