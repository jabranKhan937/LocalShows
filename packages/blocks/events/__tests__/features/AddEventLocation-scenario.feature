Feature: AddEventLocation

    Scenario: User navigates to AddEventLocation
        Given I am a User loading AddEventLocation
        When I navigate to the AddEventLocation
        Then AddEventLocation will load with out errors
        And I can click the event list item
        And I can leave the screen with out errors
