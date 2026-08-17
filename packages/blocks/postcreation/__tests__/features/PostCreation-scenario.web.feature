Feature: PostCreation

    Scenario: User navigates to posts
        Given I am a User loading posts
        When I navigate to the posts
        Then posts will load with out errors
        And I can leave the screen with out errors

    Scenario: User can view a post
        Given I am a User attempting to view a post
        When I click on a post 
        Then view post will load with out errors
        And I can leave the screen with out errors

    Scenario: User can delete a post
        Given I am a User attempting to delete a post
        When I delete a post
        Then delete post should succeed
        And I can leave the screen with out errors

    Scenario: User can add a post
        Given I am a User attempting to add a post
        When I click on add post
        Then add posts should succeed
        And RestAPI will return successfull response
        And I can leave the screen with out errors