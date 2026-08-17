Feature: recommendationengine

    Scenario: User navigates to recommendationengine
        Given I am a User loading recommendationengine
        When I navigate to the recommendationengine
        Then recommendationengine will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors