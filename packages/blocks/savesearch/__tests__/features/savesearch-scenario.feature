Feature: savesearch

    Scenario: User navigates to savesearch
        Given I am a User loading savesearch
        When I navigate to the savesearch
        Then list items are rendered correctly
        And Search renders correctly
        And Search items are rendered correctly
        And functions from controller work properly