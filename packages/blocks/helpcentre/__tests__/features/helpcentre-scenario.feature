Feature: helpcentre

    Scenario: User loads up the about us screen
        Given The screen loads up
        When User visits the screen
        Then The contents are rendered properly
        And User can go back
        When i click on hamburger icon

    Scenario: User navigates to helpcentre
        Given I am a User loading helpcentre
        When I navigate to the helpcentre
        Then User press a button
        Then User performs search
        When user click on hamburger icon

    Scenario: User navigates to helpcentreQA
        Given I am a User loading helpcentreQA
        When I navigate to the helpcentreQA
        Then helpcentreQA will load with out errors

        When I pass some data to renderItem
        Then items are rendered

        Given I can find the button to hide keyboard
        When I click the button to hide keyboard
        Then hideKeyboard() is called

    Scenario: User navigates to helpcentreSub
        Given I am a User loading helpcentreSub
        When I navigate to the helpcentreSub
        Then helpcentreSub will load with out errors

        When I pass some data to renderItem
        Then items are rendered

        When I click on go to subscreen button
        Then I can go to the subscreen

        Given I can find the button to hide keyboard
        When I click the button to hide keyboard
        Then hideKeyboard() is called
      