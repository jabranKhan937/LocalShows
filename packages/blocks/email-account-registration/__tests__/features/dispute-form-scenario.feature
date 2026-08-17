Feature: Band/Artist Registration 
    Scenario: Dispute Form for Band Artist
        Given I am a User attempting to Register as a Band/Artist
        When I navigate to the Dispute Form Screen
        Then User navigates back

    Scenario: Dispute Form for Venue
        Given I am a User attempting to Register as a Venue
        When I navigate to the Dispute Form Screen
        Then User navigates back