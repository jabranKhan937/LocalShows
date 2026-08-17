Feature: Share

    Scenario: User navigates to Share
        Given I am a User loading Share
        When I navigate to the Share
        Then Share will load with out errors
        And I can select the button with with out errors

    Scenario: User navigates to Share for mobile
        Given User loads Share screen
        When User navigate to the Share screen
        Then User list have some value
        When User clicks back
        Then User navigates back
        When User uses search box
        Then Search box has value
        When User selects the User list
        Then Search is blank
        When User list is empty
        Then Empty list component is rendered
        When User interacts with share button
        Then Send message API is triggered
        When share event API is called
        Then navigate is invoked