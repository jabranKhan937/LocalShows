Feature: TermsConditions

  Scenario: User navigates to TermsConditions
    Given I am a User loading TermsConditions
    When I navigate to TermsConditions
    Then TermsConditions will load with out errors

    When TermsConditions List render
    Then I can press navigateDetailBtn
    Then I can press navigateEditBtn
    Then I can change terms and conditions acceptance value

    And I can leave the screen