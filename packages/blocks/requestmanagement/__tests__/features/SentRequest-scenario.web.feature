Feature: SentRequest

    Scenario: User navigates to SentRequest
        Given I am a User loading SentRequest
        When I navigate to the SentRequest
        Then SentRequest will load with out errors
        And Get token function shoudl be called
        When Network responed for get groups api
        Then Get sent request api should be called
        When Network responed for sent request api
        Then Sent request state should ve update
        When Click delete button to delete request
        Then Delete request api should be call
        When User click on update button from the table
        Then User update request text in the text field
        When User click sent button to update request review text
        Then User click on receive request to navigate to receive request page
        Then Navigate function should be call
        When User enter request id in input field to filter
        Then Input field value should be update
        When User click on view button to view request
        Then View request modal should be opened
