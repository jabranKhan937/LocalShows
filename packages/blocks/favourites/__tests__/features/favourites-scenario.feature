Feature: favourites

    Scenario: User navigates to favourites
        Given I am a User loading favourites
        When I navigate to the favourites
        Then favourites will load with out errors
        And I can leave the screen with out errors

    Scenario: User can view any favourites
        Given I am a User attempting to view a favourites
        When I view a favourites
        Then I can view favourites will load with out errors

    Scenario: User can delete any favourites
        Given I am a User attempting to delete a favourites
        When I delete a favourites
        Then I can delete favourites will load with out errors
        And Rest Api will return success response
    
    Scenario: Empty title
        Given I am a user attempting to add a favourites
        When I am adding a favourites with empty title
        Then add favourites should fail
    
    Scenario: Empty content
        Given I am a user attempting to add a favourites
        When I am adding a favourites with empty content
        Then add favourites should fail

    Scenario: title and content
        Given I am a user attempting to add a favourites
        When I am adding a favourites with title and content
        Then add favourites should succeed
        And Rest Api will return success response