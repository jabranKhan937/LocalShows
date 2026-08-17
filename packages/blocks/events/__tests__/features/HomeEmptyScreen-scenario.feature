Feature: HomeEmptyScreen

    Scenario: User navigates to HomeEmptyScreen
        Given I am a User loading HomeEmptyScreen
        When I navigate to the HomeEmptyScreen
        Then User clicks on modal buttons

    Scenario: Permissions in iOS
        Given User attempting to load HomeEmptyScreen
        When User requests for location permissions
        Then ios permission method is invoked
        When I deny response
        Then ios permission method is invoked
