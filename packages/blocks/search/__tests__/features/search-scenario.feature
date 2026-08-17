Feature: search

    Scenario: User navigates to search
        Given I am a User loading search
        When I navigate to the search
        Then User navigates back
        When Whole state is not selected
        Then Whole state value is false
        When User selects a state
        Then State value is changed
        When User selects a city
        Then City value is changed
        When User selects a city without state
        Then City value is changed
        When Whole state is selected and search API is triggered
        Then Whole state value is true
        When Whole state is not selected and search API is triggered
        Then Whole state value is true
        When Whole state is not selected and search API is triggered
        Then Whole state value is false
        When Search API is triggered
        Then Whole state value is false

    Scenario: Pickers in iOS
        Given User attempting to Search Events
        When User click the state picker
        Then User can select the state
        When User click the city picker
        Then User can select the city

    Scenario: Pickers in web
        Given User attempting to Search Events
        When User click the state picker
        Then User can select the state
    Scenario: Search Users
        Given User attempting o Search Users
        When Search User API Call
        When Query is Empty