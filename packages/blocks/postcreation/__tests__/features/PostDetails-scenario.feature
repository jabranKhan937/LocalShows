Feature: PostDetails

    Scenario: User navigates to PostDetails
        Given I am a User loading PostDetails
        When I navigate to the PostDetails
        Then User interacts with UI
        Then I can see the show date in correct formate
        When User interacts with 3 dots to postpone the show
        Then Postpone the show
        When User interacts with 3 dots to cancel the show
        Then Cancel the show
        When User interacts with 3 dots to sell the show
        Then Sell the show