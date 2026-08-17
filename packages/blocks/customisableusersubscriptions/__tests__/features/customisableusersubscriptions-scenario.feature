Feature: customisableusersubscriptions

    Scenario: User navigates to customisableusersubscriptions
        Given I am a User loading customisableusersubscriptions
        When I navigate to the customisableusersubscriptions
        Then customisableusersubscriptions will load with out errors
        And I can leave the screen with out errors
    
    Scenario: User navigates to subscriptiondetails
        Given I am a User loading subscriptiondetails
        When I navigate to the subscriptiondetails
        Then subscriptiondetails will load with out errors
        And I can leave the screen with out errors