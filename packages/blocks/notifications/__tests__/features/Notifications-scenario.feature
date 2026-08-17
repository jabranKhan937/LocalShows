Feature: Notifications

    Scenario: User navigates to Notifications
        Given I am a User loading Notifications
        When I navigate to the Notifications
        Then Notifications will load with out errors
        When User interacts with the screen components
        Then User navigates back
        When User clicks the You tab
        Then You tab gets active
        When User clicks the Your Friend tab
        Then Your Friend tab gets active
        When User has follow request notification
        Then Render Follow and remove buttons
        When User confirms the request notification
        Then Render Follow back button
        When User is switched to Your Friend tab
        Then Render Your Friends tab UI
        When Search input has data
        Then Render API with search input



        