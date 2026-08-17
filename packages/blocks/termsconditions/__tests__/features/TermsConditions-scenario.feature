Feature: TermsConditions

  Scenario: User navigates to TermsConditions
    Given I am a User loading TermsConditions
    When I navigate to TermsConditions
    Then TermsConditions will load with out errors

    Then I can press navigationBackButton
    Then I can change terms and conditions acceptance value
    Then I can press btnCancel
    Then I can press btnAgree
    When user click on hamburger icon