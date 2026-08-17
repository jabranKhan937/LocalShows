Feature: Band/Artist Registration 
    Scenario: Representative Certification for Band Artist
        Given I am a User attempting to Register as a Band/Artist
        When I navigate to the Representative Certification Screen
        Then Press Event is performed
        When Title is contains characters and numbers
        Then Press Event is performed
        When Form is filled
        Then Press Event is performed

    Scenario: Representative Certification for Band Artist in iOS
        Given User attempting to RepresentativeCertification
        When I navigate to the Representative Certification Screen
        Then Press Event is performed
    
    Scenario: Representative Certification for Venue on Android device
        Given User attempting to RepresentativeCertification on Android device
        When I navigate to the Representative Certification Screen with a Venue account
        When I try to submit values with empty value
        Then I expect checkValidation to be called

    Scenario: User Verification Account to claim page
        Given I am a User attempting to Register as a Band/Artist
        When I navigate to the Representative Certification Screen and fill all the fields
        And I press the verification account button
        Then I expect to call the API
        And I expect to be redirected to the claim Page