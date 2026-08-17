Feature: TermsConditionsUsers

  Scenario: User navigates to TermsConditions
    Given I am a User loading TermsConditions
    When I navigate to TermsConditions
    Then TermsConditions List render
    Then TermsConditions will load

    And I can leave the screen