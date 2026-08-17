Feature: eventregistration

    Scenario: User navigates to eventregistration
        Given I am a User loading eventregistration
        When I navigate to the eventregistration
        Then eventregistration will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors