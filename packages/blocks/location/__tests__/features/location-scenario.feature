Feature: location

    Scenario: User navigates to location
        Given I am a User loading location
        When I navigate to the location
        Then location will load with out errors
        And location will load screen based on state changes
        And location will able to click buttons
        And location get city without errors
        And location update default city without errors
        And location get google map results without errors
        And I can leave the screen with out errors