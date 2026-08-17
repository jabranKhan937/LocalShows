Feature: savesearch

    Scenario: User navigates to savesearch
        Given I am a User loading savesearch
        When I navigate to the savesearch
        Then savesearch will load with out errors