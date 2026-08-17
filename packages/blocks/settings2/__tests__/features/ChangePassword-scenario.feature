Feature: ChangePassword

    Scenario: User navigates to changePassword
        Given I am a User loading changePassword
        When I navigate to the changePassword
        Then User interacts with UI
        When User fills the Current Password
        Then Current Password is not empty
        When User fills the New Password
        Then New Password is not empty but invalid
        When User fills the New Password with Alphabets and character
        Then New Password is not empty but invalid
        When User fills the New Password with number
        Then New Password is not empty but invalid
        When User fills the New Password
        Then New Password is not empty
        When User re-enters the New Password
        Then Confirm Password matches the New Password
        