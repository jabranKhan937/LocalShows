Feature: ApiIntegration

    Scenario: User navigates to ApiIntegration
        Given I am a User loading ApiIntegration
        When I navigate to the ApiIntegration
        Then ApiIntegration will load with out errors
        And I can leave the screen with out errors