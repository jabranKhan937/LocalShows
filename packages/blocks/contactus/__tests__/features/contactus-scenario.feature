Feature: contactus

    Scenario: User navigates to contactus
        Given I am a User loading contactus
        When I navigate to the contactus
        Then press back button
        When Form is filled
        Then press back button
        When Form is empty
        Then press back button
        When Name is invalid
        Then press back button
        When Phone number is invalid
        Then press back button
        When Phone number is invalid
        Then press back button
        When Email is invalid
        Then press back button
        When Email is invalid
        Then press back button
        When Email is invalid
        Then press back button
        
    Scenario: User navigates to contactus iOS
        Given I am a User loading contactus
        When I navigate to the contactus
        Then press back button
        When Form is filled
        Then press back button
        When Form is empty
        Then press back button
        When Name is invalid
        Then press back button
        When Phone number is invalid
        Then press back button
        When Phone number is invalid
        Then press back button
        When Email is invalid
        Then press back button
        When Email is invalid
        Then press back button
        When Email is invalid
        Then press back button

    Scenario: User navigates to addContactus
        Given I am a User loading addContactus
        When I navigate to the addContactus
        When user click on hamburger icon
        