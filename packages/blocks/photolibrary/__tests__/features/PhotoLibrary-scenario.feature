Feature: PhotoLibrary

    Scenario: User navigates to PhotoLibrary
        Given I am a User loading PhotoLibrary
        When User navigate to the PhotoLibrary
        Then User interacts with UI
        When Description is empty
        Then Throw error for Description
        When Description is not empty
        Then Trigger the API for Post a Picture

    Scenario: User navigates to Edit PhotoLibrary
        Given I am a User loading PhotoLibrary
        When User navigate to the PhotoLibrary
        Then User interacts with UI
        When Description is empty
        Then Throw error for Description
        When Description is not empty
        Then Trigger the API for Post a Picture