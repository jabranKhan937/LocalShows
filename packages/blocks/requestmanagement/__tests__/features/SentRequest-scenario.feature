Feature: SentRequest

    Scenario: User navigates to SentRequest
        Given I am a User loading SentRequest
        When I navigate to the SentRequest
        Then SentRequest will load with out errors
        And Get token function shoudl be called
        And Network responed for get groups api
        And Get sent request api should be called
        When Network responed for sent request api
        Then Sent request state should ve update
        When Click delete button to delete request
        Then Delete request api should be call
        Then Get delete request api response
        When User press on update button from the table
        Then User update request text in the text field
        Then Text input value should be match
        When User press sent button to update request review text
        Then Update request text api should be called
        Then Get response from update request text api
        When User click on sent button to open modal to create new request
        Then User click on sent button to create new request
        Then Network should be called after clicking sent button
        Then Get response from send request api
        When User enter request id in input field to filter
        Then Input field value should be update
        When User press on view button to view request
        Then View request modal should be opened