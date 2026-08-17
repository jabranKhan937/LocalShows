Feature: likeapost2

    Scenario: User navigates to likeapost2
        Given I am a User loading likeapost2
        When I navigate to the likeapost2
        Then Render the likes list
        When User search for event
        Then Render the filtered likes list

    Scenario: Guest User navigates to likeapost2
        Given I am a User loading likeapost2
        When I navigate to the likeapost2
        Then Render the likes list