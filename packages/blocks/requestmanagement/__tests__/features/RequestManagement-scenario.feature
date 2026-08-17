Feature: RequestManagement

    Scenario: User navigates to RequestManagement
        Given I am a User loading RequestManagement
        When I navigate to the RequestManagement
        Then RequestManagement will load with out errors
    
    Scenario: User navigates to RequestManagement with one category
        Given I am a User loading RequestManagement
        When I navigate to the RequestManagement
        Then RequestManagement will load with out errors