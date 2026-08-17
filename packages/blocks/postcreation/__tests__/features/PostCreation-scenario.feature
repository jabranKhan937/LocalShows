Feature: PostCreation
  
    Scenario: User navigates to PostCreation
        Given I am a User attempting to create a post
        When I click on post a show
        Then Fetch required APIs
        When User interacts with the buttons
        Then Initiate click events
        When User clicks from camera
        Then Render the event image on UI
        When Event title is empty
        Then Throw event title empty error
        When Location is empty
        Then Throw location empty error
        When Address is empty
        Then Throw address empty error
        When Address is invalid
        Then Throw address invalid error
        When Address is invalid regex
        Then Throw address invalid regex error
        When State is not selected
        Then Throw state not selected error
        When City is not selected
        Then Throw city not selected error
        When Zip is empty
        Then Throw zip empty error
        When Zip is invalid
        Then Throw zip invalid error
        When Date is empty
        Then Throw date empty error
        When Time is not selected
        Then Throw time not selected error
        When Line up is not selected
        Then Throw line up not selected error
        When Type of show is not selected
        Then Throw type of shows not selected error
        When Description is empty
        Then Throw description empty error
        When All fields are field
        Then Trigger create show API
        When Event Id is not null
        Then Render UI with event Id


    Scenario: iOS User navigates to PostCreation
        Given I am a User attempting to create a post
        When I click on post a show
        Then User interacts with the screen
    
    Scenario: User creates a new event
        Given I am a User attempting to create a event post
        When I fill the fields
        And I press the submit button
        Then I expect to submit event data information
