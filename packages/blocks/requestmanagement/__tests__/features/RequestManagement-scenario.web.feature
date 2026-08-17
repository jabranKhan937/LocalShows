Feature: RequestManagement

    Scenario: User navigates to RequestManagement
        Given I am a User loading RequestManagement
        When I navigate to the RequestManagement
        Then RequestManagement will load with out errors
        Then Get token function shoudl be called
        When Network responed for received request api
        Then ReceivedRequests state should be update