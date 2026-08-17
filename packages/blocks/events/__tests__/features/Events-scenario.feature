Feature: Events

    Scenario: User navigates to Events
        Given I am a User loading Events
        When I navigate to the Events
        Then Events will load with out errors
        And I can click the event list item
        And I can leave the screen with out errors