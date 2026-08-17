Feature: savesearch

    Scenario: User navigates to OTPConfirmation
        Given I am a User loading OTPConfirmation
        When I navigate to the OTPConfirmation
        Then OTPConfirmation is rendered correctly

        Given otp inputs are rendered
        When I enter otp
        Then otp state gets updated
        And can click resend otp
        And can submit otp
        And can go back
        And controller functions work properly