Feature: forgot-password

    Scenario: User navigates to NewPassword
        Given I am a User loading NewPassword
        When I navigate to the NewPassword
        Then NewPassword is rendered correctly
        When New password is invalid
        Then NewPassword is rendered correctly
        When New password is invalid
        Then NewPassword is rendered correctly
        When New password is invalid
        Then NewPassword is rendered correctly
        When Confirm password and new password are empty
        Then NewPassword is rendered correctly
        When Confirm password and new password are not same
        Then NewPassword is rendered correctly

    Scenario: iOS User navigates to NewPassword
        Given I am a User loading NewPassword
        When I navigate to the NewPassword
        Then NewPassword is rendered correctly
