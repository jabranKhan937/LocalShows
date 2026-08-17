Feature: search

    Scenario: User navigates to search
        Given I am a User loading search
        When I navigate to the search
        Then I can click Search button
        Then search will load with out errors
        Then I can view Search item
        And I can leave the screen with out errors