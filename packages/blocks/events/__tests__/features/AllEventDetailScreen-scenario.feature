Feature: AllEventDetailScreen

    Scenario: Guest User navigates to AllEventDetailScreen
        Given I am a User loading AllEventDetailScreen
        When I navigate to the AllEventDetailScreen
        Then User navigates back
        When API returns correct data
        Then User navigates back
        When API is modified
        Then Show menu pops up

    Scenario: User navigates to AllEventDetailScreen
        Given I am a User loading AllEventDetailScreen
        When I navigate to the AllEventDetailScreen
        Then User navigates back