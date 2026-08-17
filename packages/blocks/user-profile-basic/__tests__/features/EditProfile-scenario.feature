Feature: EditProfile

    Scenario: User navigates to EditProfile
        Given The screen loads up
        When User visits the screen
        Then User navigates back
        When Name is empty
        Then Throw name error
        When Email is empty
        Then Throw email error
        When Email is invalid
        Then Throw email invalid error
        When Email is not valid
        Then Throw email invalid error
        When Email is invalid
        Then Throw email invalid error
        When Phone number is empty
        Then Throw phone number error
        When Phone number has characters
        Then Throw phone number error
        When State picker is clicked
        Then State value is changed
        When City picker is clicked
        Then City value is changed
        When Name has digits and characters
        Then render UI with invalid name
        When Phone number has alphabets and characters
        Then render UI with invalid cell phone
        When Form is filled
        Then Save the profile

    Scenario: Pickers in iOS
        Given User attempting to EditProfile
        When User click the state picker
        Then User can select the state
        When User click the city picker
        Then User can select the city

    Scenario: User navigates to Edit Profile
        Given The screen loads up
        When User visits the screen
        Then User navigates back
        When Name is empty
        Then Throw name error
        When Email is empty
        Then Throw email error
        When Email is invalid
        Then Throw email invalid error
        When Email is not valid
        Then Throw email invalid error
        When Email is invalid
        Then Throw email invalid error
        When Phone number is empty
        Then Throw phone number error
        When Phone number has characters
        Then Throw phone number error
        When State picker is clicked
        Then State value is changed
        When City picker is clicked
        Then City value is changed
        When Name has digits and characters
        Then render UI with invalid name
        When Phone number has alphabets and characters
        Then render UI with invalid cell phone
        When Form is filled
        Then Save the profile

