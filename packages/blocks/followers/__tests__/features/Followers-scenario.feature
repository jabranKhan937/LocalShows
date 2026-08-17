Feature: Followers

    Scenario: User navigates to Followers
        Given I am a User loading Followers
        When I navigate to the Followers
        Then User navigates back
        When Followers are listed
        Then User views followers list
