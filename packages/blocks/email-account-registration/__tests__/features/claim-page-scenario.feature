Feature: Band/Artist Registration 
    Scenario: Claim Page for Band Artist
        Given I am a User attempting to Register as a Band/Artist
        When I navigate to the Claim Page Screen
        Then Press Event is performed
        When Type is not selected
        Then Throw type error
        When Band/Artist Name is empty
        Then Throw Band/Artist Name error
        When Country is empty
        Then Throw Country error
        When State is empty
        Then Throw State error
        When City is empty
        Then Throw City error

    Scenario: Pickers in iOS
        Given User attempting to Register on Claim Page
        When User click the band/artist picker
        Then User can select the band/artist
        When Country picker is clicked
        Then Country value is changed
        When State picker is clicked
        Then State value is changed
        When City picker is clicked
        Then City value is changes

    Scenario: Claim Page for Venue
        Given I am a User attempting to Register as a Venue
        When I navigate to the Claim Page Screen
        Then Press Event is performed
        When Address is not selected
        Then Throw address error
        When Zip is empty
        Then Throw zip error
        When Zip is invalid
        Then Throw zip error
    
    Scenario: Open Modal when I press claim submit button
       Given I am a User attempting to Register as a Venue 
       When I press the submit button
       Then I expect to show an modal


    Scenario: Test generic functions
            Given I am a User attempting to Register as a Venue
            When I call handleClaimPageAPI function with validation checked
            Then I expect handleClaimPageAPI to be called

    Scenario: TypeList filled with venue selected values
            Given I am a User attempting to Register as a Venue
            When The screen is loaded with userRole
            Then I expect typeList have location values