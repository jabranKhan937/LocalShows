Feature: TermsConditionsDetail

  Scenario: User navigates to TermsConditions
    Given I am a User loading TermsConditions
    When I navigate to TermsConditions
    Then I can press btnNavigateEdit
    Then I can press btnNavigateUsers
    Then TermsConditions will load

    And I can leave the screen