Feature: PostPostpone
  
    Scenario: User navigates to PostPostpone
        Given I am a User attempting to create a post
        When I click on post a show
        Then User interacts with the screen
        When Date is empty
        Then Throw date empty error
        When Time is not selected
        Then Throw time not selected error
        When Date and Time is set
        Then Render UI with date and time
        When Undefined date is set
        Then Render UI with undefined date

    Scenario: iOS User navigates to PostPostpone
        Given I am a User attempting to create a post
        When I click on post a show
        Then User interacts with the screen
        When Undefined date is set
        Then Render UI with undefined date
