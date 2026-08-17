Feature: AddEventDetailScreen

    Scenario: User navigates to AddEventDetilScreen
        Given I am a User loading AddEventDetailScreen
        When I navigate to the AddEventDetailScreen
        Then I can't not save events without title
        And I can save events with events data
        And I can create an event will load with out errors
        And I can delete an event will load with out errors
        And I can click buttons without errors
        And I can leave the screen with out errors
