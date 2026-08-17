Feature: TermsConditionsEdit

  Scenario: User navigates to TermsConditions
    Given I am a User loading TermsConditions
    When I navigate to TermsConditions
    Then I can change termsCondsInput value
    Then I can press btnSendTermsConds
    Then TermsConditions will load

    And I can leave the screen