Feature: search

    Scenario: User navigates to SearchResult
        Given User loading search result
        When User navigate to the search result
        Then User clicks on button
        When Event list is rendered
        Then User navigates to detail screen

    Scenario: Guest User navigates to SearchResult
        Given Guest User loading search result
        When Guest User navigate to the search result
        Then Guest User clicks on button
        When Event list is rendered
        Then Guest User navigates to detail screen

    Scenario: User navigates to SearchResult for comments
        Given User loading search result
        When User interacts with comments
        Then User navigates to detail screen
        When User interacts with comments
        Then User navigates to detail screen
        When User interacts with replies
        Then User navigates to detail screen
        When User interacts with replies
        Then User navigates to detail screen

    Scenario: Guest User navigates to Search Result
        Given Guest User loading search result
        When Guest User navigate to the search result
        Then Guest User clicks on button
