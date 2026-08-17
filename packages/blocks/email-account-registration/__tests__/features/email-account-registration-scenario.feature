Feature: Email Account Registration
    Scenario: Register User for Android
        Given I am a User attempting to Register after confirming OTP
        When I navigate to the Registration Screen
        Then I can leave the screen with out errors
        When Complete the registration form
        Then Trigger API for registration
        When Name contains numbers
        Then Trigger API for registration
        When Email contains special characters
        Then Trigger API for registration
        When Email domain is empty
        Then Trigger API for registration
        When Email domain lacks .(dot)
        Then Trigger API for registration
        When Email domain has invalid characters
        Then Trigger API for registration
        When Password length is not 8
        Then Trigger API for registration
        When Password does not have small letters
        Then Trigger API for registration
        When Password does not have capital letters
        Then Trigger API for registration
        When Password does not contain numbers
        Then Trigger API for registration
        When Password does not contain special characters
        Then Trigger API for registration
        When Password and confirm password are different
        Then Trigger API for registration
        When Country is not selected
        Then Trigger API for registration
        When Cell phone length is not 10
        Then Trigger API for registration
        When Cell phone has invalid characters
        Then Trigger API for registration
        When State is empty
        Then Trigger API for registration

    Scenario: Register User for iOS
        Given I am a User attempting to Register after confirming OTP
        When I navigate to the Registration Screen
        Then I can leave the screen with out errors
