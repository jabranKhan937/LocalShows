Feature: Blockedusers

    Scenario: User navigates to Blockedusers
        Given I am a User loading Blockedusers
        When I navigate to the Blockedusers
        Then Blockedusers will load with out errors
        And I can leave the screen with out errors

    Scenario: User can view any Blockeduser
        Given I am a User attempting to view a Blockeduser
        When I view a Blockeduser
        Then I can view Blockeduser will load with out errors

    Scenario: User can delete any Blockeduser
        Given I am a User attempting to delete a Blockeduser
        When I delete a Blockeduser
        Then I can delete Blockeduser will load with out errors
        And Rest Api will return success response
    
    Scenario: Empty userid
        Given I am a user attempting to add a Blockeduser
        When I am adding a Blockeduser with empty userid
        Then add Blockeduser should fail