Feature: filteritems

    Scenario: User navigates to filteritems
        Given I am a User loading filteritems
        When User is not logged in
        Then Render login popup
        When I navigate to the filteritems
        Then filteritems will load with out errors
        When User is not a fan
        Then User clicks the Posts tab
        Then User clicks the Pictures tab
        When User is switched to Pictures tab
        Then Render UI for Pictures Tab
        When User is switched to Posts tab
        Then Render UI for Posts Tab
    
    Scenario: Test Hide keyboard, back navigation and date picker
        Given I am a User loading filteritems
        When I navigate to the filteritems
        Then hide keyboard works
        And date picker works

    Scenario: Testing filter popup
        Given I am a User loading filteritems
        When I click the filter popup
        Then filter popup shows up

    Scenario: Testing lists rendering
        Given I am a User loading filteritems
        When I fetch from the shows api
        Then the list shows up

        When I click the btnFilterMostRecent
        Then the list is sorted with most recent event on top

        When I click the btnFilterLeastRecent
        Then the list is sorted with most recent event at bottom

        When I click the btnFilterByState
        Then the list is sorted by state
        When API Response is empty
        Then pageTitle is rendered

    Scenario: Testing event deletion
        Given I am a User loading renderShowCard

        When I click the delete event button
        Then the delete confirmation modal appears

        When I click the delete button
        Then API is fetching

        When I click the disable modal button
        Then the modal disappears

    Scenario: Testing delete event API
        Given I am a User loading filteritems
        When I call the delete API
        Then alert is shown

    Scenario: if the start date is empty then the search should not work