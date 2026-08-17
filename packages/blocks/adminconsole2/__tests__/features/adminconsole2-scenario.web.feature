Feature: adminconsole2

    Scenario: User navigates to adminconsole2
        Given I am a User loading adminconsole2
        When I navigate to the adminconsole2
        Then adminconsole2 will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors