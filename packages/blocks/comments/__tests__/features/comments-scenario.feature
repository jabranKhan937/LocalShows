Feature: comments

    Scenario: User navigates to Comments
        Given I am a User loading Comments
        When I navigate to the Comments
        Then Comments will load with out errors
        And I can leave the screen with out errors

    Scenario: User navigates to CreateComment
        Given I am a User loading CreateComment
        When I navigate to the CreateComment
        Then CreateComment will load with out errors
        And I can leave the screen with out errors
