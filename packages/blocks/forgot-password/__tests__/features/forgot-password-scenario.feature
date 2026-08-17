Feature: forgot-password

    Scenario: User navigates to ForgotPassword
        Given I am a User loading ForgotPassword
        When I navigate to the ForgotPassword
        Then ForgotPassword is rendered correctly
        And user can enter email successfully
        And user can submit email successfully
        And user can go back
        And controller functions work properly
    
    Scenario: User navigates to ForgotPasswordOTP
        Given I am a User loading ForgotPasswordOTP
        When I navigate to the ForgotPasswordOTP
        Then ForgotPasswordOTP is rendered correctly
        And user can enter otp
        And user can resend otp
        And user can submit otp
        And user can go back
    