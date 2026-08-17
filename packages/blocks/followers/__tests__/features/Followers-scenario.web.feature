Feature: Followers

    Scenario: User navigates to Followers
        Given I am a User loading Followers
        When I navigate to the Followers
        Then Followers will load with out errors
        And Tab will load without errors
        And UserList Table will load with out errors
        And FollowingList Table will load with out errors
        And FollowerList Table will load with out errors
        And TabPanel will load without error
        And Select TabPanel will load without error
        And GenTable will load without error

    Scenario: User can view a user list and follow other user
        Given I am a User attempting to view a user list
        When I click on a user list
        Then user list will load with out errors
        And Followers will get the user list on API call
        And I can select the follow button without errors
        And User cilck on the follow button and call the API
        And User cilck on the follow button and get error on API
        And Followers will get the error user list API call

    Scenario: User can view a Follower list and unfollow other user
        Given I am a User attempting to view a Follower list
        When I click on a Follower list
        Then Follower list will load with out errors
        And User get the follower list on API Call
        And I navigate to Following list Table
        And I can select the Unfollow button without errors
        And User cilck on the Unfollow button and call the API
        And User cilck on the Unfollow button and get error on API
        And User get the error follower list on API Call
    
    Scenario: User can view a Following list and follow other user
        Given I am a User attempting to view a Following list
        When I click on a Following list
        Then Following list will load with out errors
        And User get the following list on API Call
        And I navigate to Follower list Table
        And I can select the follow button without errors
        And User get the error following list on API Call   
        And I can leave the screen without errors
