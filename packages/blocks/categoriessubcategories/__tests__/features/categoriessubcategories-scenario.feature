Feature: categoriessubcategories

    Scenario: User navigates to categoriessubcategories
        Given I am a User loading categoriessubcategories
        When I navigate to the categoriessubcategories
        Then categoriessubcategories will load with out errors
    
    Scenario: Test tab buttons
        Given I am a User loading categoriessubcategories
        When I click the tab switching buttons
        Then I can switch between tabs
    
    Scenario: Render Selector
        Given I am a User loading renderSelectorItem
        When I pass the correct data
        Then it renders properly
    
    Scenario: Render based on tabs
        Given I am a User loading categoriessubcategories
        When I click the tab switching buttons
        Then I can render scenarios
    
    Scenario: Pickers in iOS
        Given I am a User loading categoriessubcategories
        When I load categoriessubcategories
        Then it renders properly

    Scenario: The APIs should not be called if token is empty
        Given user enters catagory page
        When token is empty or invalid
        Then the api would not be called