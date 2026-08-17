Feature: Band/Artist Registration 
    Scenario: Create Page for Band Artist
        Given I am a User attempting to Register as a Band/Artist
        When I navigate to the Create Page Screen
        Then User navigates back
        When Email is invalid
        Then Throw Email invalid error
        When Email is invalid
        Then Throw Email invalid error
        When Email is invalid
        Then Throw Email invalid error
        When Email is invalid
        Then Throw Email invalid error
        When Password is invalid
        Then Throw Password invalid error
        When Confirm Password is empty
        Then Throw Confirm Password match error
        When Phone number has characters
        Then Throw Phone number error
        When Phone number is invalid
        Then Throw Phone number invalid error
        When Countries list and countryCode is invalid
        Then I expect handleCreatePageAPI to be called with wrong fields
        When Create Page form is filled
        Then Handle Create Page Success API Response
    
    Scenario: Band Artist comming from Representative Screen
        Given I am a User attempting to Register a band user
        When The page is mounted
        Then I expect the band name field is already filled

    Scenario: Selecting a country code on android device
        Given I am a User attempting to Register a band on android device
        When I select the country code
        Then I expect the country code to be on the field

    Scenario: Pickers in iOS
        Given User attempting to Register on Create Page
        When User click the band/artist picker
        Then User can select the band/artist
        When I select the country code
        Then I expect the country code to be on the field

    Scenario: Create Page for Venue
        Given I am a User attempting to Register as a Venue
        When I navigate to the Create Page Screen
        Then User navigates back

    Scenario: Page is unmounted
        Given I am a User attempting to Register a user
        When The page is unmounted
        Then I expect the _mounted is false